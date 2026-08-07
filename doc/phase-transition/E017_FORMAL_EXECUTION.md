# E-017 固定ローカル正式実行手順

更新日: 2026-08-01  
Status: Approved / Awaiting fixed-local execution lock

## 1. 固定事項

- experiment: `E-017`
- games: 1000
- seed range: `20263001–20264000`
- condition: `hard / bao / phase2 / depth 2`
- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- corpus output: `artifacts/phase-transition/independent-confirmation-v2/`
- analysis output: `artifacts/local/phase-transition-independent-confirmation-v2/`
- GitHub Actions formal run: prohibited

正式1000局は、repository上の許可フラグと完全一致の承認トークンの両方が有効でなければ開始できない。

2026-08-01 22:47 JSTにE-017固有の明示的開始承認を受領し、専用commit `f0f9e90be0d77dac395e9ec53d951a011ad1f1fd`でpolicyを有効化した。

現時点のpolicy:

```json
"formalExecutionAllowed": true
```

ただし固定ローカルexecution lockはまだ生成しておらず、formal corpusは`0 / 1000`である。

## 2. 正式開始承認時のpolicy変更

実施済み。明示的なE-017開始指示を受けた後、次だけを別コミットで変更した。

```json
"formalExecutionAllowed": true
```

次は変更していない。

- 1000局
- seed範囲
- AI条件
- 候補検出閾値
- trajectory-ply主解析単位
- 構造availability基準
- RR基準

承認チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e017-formal-start-authorization.md`

## 3. 実行前環境lock

開始承認後、対象コミットへ更新し、clean worktreeでlockを生成する。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game
git switch research/forced-capture-regime-analysis
git pull --ff-only
node --version
git status --short

node tools/experiments/prepare-phase-transition-independent-confirmation-execution.js
```

出力:

```text
artifacts/phase-transition/independent-confirmation-v2/execution-lock.json
```

lockへ記録する。

- source commit
- branch
- repository path
- Node.js version
- OS / architecture
- CPU model / logical CPU count
- total memory
- hostname
- 事前登録path / SHA-256
- execution policy path / SHA-256
- 正式corpus条件

次のいずれかが不一致ならlock生成を失敗させる。

- repository path
- branch
- clean worktree
- Node.js version
- platform
- formal corpus rootのgit-ignore
- experiment ID
- gamesが1000以外
- base seedが`20263001`以外
- GitHub Actions環境

## 4. 状態確認

lock生成後、自己対局を開始せず進捗を確認できる。

```bash
node tools/experiments/run-phase-transition-independent-confirmation-formal.js \
  --phase status
```

出力:

- fixed source commit
- formal execution許可状態
- 完了gameファイル数
- 計画局数
- manifest有無

## 5. 正式1000局実行

明示的な開始承認後のみ使用する。承認は2026-08-01 22:47 JSTに取得済みだが、execution lock生成成功前には実行しない。

```bash
node tools/experiments/run-phase-transition-independent-confirmation-formal.js \
  --phase run \
  --approval-token E-017-FORMAL-APPROVED
```

runnerは事前登録ファイルから次を読み取り、CLIへ固定展開する。

- profile
- games
- base seed
- max ply
- opening plies
- baseline games
- level
- evaluation profile
- search profile
- maxDepth

既存gameファイルはconfig hash一致時だけ再利用する。異なるconfig hashのpartial corpusがある場合は停止する。

## 6. 候補・対照分析

1000局manifestの完了後に実行する。

```bash
node tools/experiments/run-phase-transition-independent-confirmation-formal.js \
  --phase analyze
```

実行内容:

1. A/B/C/X候補・アーキタイプ分析
2. 強制捕獲レジーム候補・対照構築
3. trajectory-ply主解析に必要なcandidate/control CSV生成

## 7. Corpus integrity監査

```bash
node tools/experiments/run-phase-transition-independent-confirmation-formal.js \
  --phase verify
```

監査対象:

- `observations.jsonl`、`games.json`、`manifest.json`の存在
- manifest SHA-256と実ファイル一致
- observation schema
- `gameId + ply`一意性
- ply連続性と`previousStateHash`
- final state hash
- trajectory hash
- 1000局完了
- seedが`20263001–20264000`と完全一致
- game ID一意性
- 全gameのtrajectory hash
- AI条件とprofile
- config hash
- manifest source commitとexecution lock source commitの一致
- lockの事前登録・policy hash存在

出力:

```text
artifacts/local/phase-transition-independent-confirmation-v2/integrity/
└── independent-confirmation-integrity.json
```

## 8. 事前登録判定

Formal integrityが`mode=formal / valid=true`の場合だけ実行できる。

```bash
node tools/experiments/run-phase-transition-independent-confirmation-formal.js \
  --phase evaluate
```

主解析単位:

```text
trajectoryHash + eventPly
```

全成功条件:

- 生の主解析候補行30件以上
- 固有candidate trajectory-ply 15件以上
- 固有candidate trajectory 12件以上
- 固有expansion trajectory-ply 5件以上
- 固有expansion trajectory 5件以上
- 固有control trajectory-ply 30000件以上
- 重複除去後RR 3以上
- 重複除去後候補率が対照率を上回る

判定:

- 全条件通過: `confirmed`
- Corpus validだが一つ以上失敗: `not-confirmed`
- Corpus、hash、trajectory結合、必要出力の失敗: `inconclusive`

## 9. 全phase共通ガード

formal runnerは各phaseの開始前に次を再照合する。

- execution policy path / SHA-256
- 事前登録path / SHA-256
- 事前登録corpusとexecution lock corpusの完全一致
- repository path
- source commit
- branch
- clean worktree
- Node.js version
- experiment ID

設定・source・runtimeのいずれかがlock後に変わった場合は、既存corpusを上書きせず停止する。

## 10. 停止条件

- 違法手またはartifact schema不一致
- manifest hash不一致
- seed列不一致
- trajectory hash不一致
- source commit不一致
- config hash不一致
- partial corpusのconfig不一致
- worktreeがdirty
- Node.js version変更
- GitHub Actions環境
- formal integrity未通過
- 事前登録またはexecution policyのhash変更

停止時は原因、影響範囲、既存成果物の状態を`RESEARCH_LOG.md`へ追記し、条件を結果後に緩和しない。
