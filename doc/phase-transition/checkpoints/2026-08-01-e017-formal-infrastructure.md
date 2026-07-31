# E-017 固定ローカル正式実行基盤チェックポイント

日付: 2026-08-01  
analysisVersion: `15-independent-structural-confirmation`  
Status: Infrastructure implemented / Formal execution disabled / CI pending

## 目的

E-017の正式1000局を、事前登録・固定source・固定runtime・固定seed・固定出力契約の下で実行、再開、監査、判定できるようにする。

本工程では正式1000局を生成しない。明示的なE-017開始承認を受けるまで、repositoryの正式実行許可を無効のまま維持する。

## 追加ファイル

- `config/experiments/phase-transition-independent-confirmation-execution-policy-v1.json`
- `tools/experiments/prepare-phase-transition-independent-confirmation-execution.js`
- `tools/experiments/run-phase-transition-independent-confirmation-formal.js`
- `tools/experiments/verify-phase-transition-independent-confirmation.js`
- `test/phase-transition-independent-confirmation-formal.test.js`
- `doc/phase-transition/E017_FORMAL_EXECUTION.md`

更新:

- `.github/workflows/phase-transition-independent-confirmation.yml`
- `.gitignore`
- `evaluate-phase-transition-independent-confirmation.js`
- `phase-transition-independent-confirmation.test.js`

## 固定実行policy

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- formal corpus: `artifacts/phase-transition/independent-confirmation-v2/`
- local analysis: `artifacts/local/phase-transition-independent-confirmation-v2/`
- approval token: `E-017-FORMAL-APPROVED`
- `formalExecutionAllowed: false`

E-017正式開始時には、別の明示的指示を受けた後、許可フラグを別コミットで`true`へ変更し、そのコミットでexecution lockを生成する。

## Execution lock

lock生成器は次を検査・記録する。

- GitHub Actions環境ではない
- repository path
- branch
- clean worktree
- Node.js version
- platform
- formal corpus rootがgit-ignore対象
- experiment ID
- games = 1000
- base seed = `20263001`
- exact source commit
- OS / architecture / hostname
- CPU model / logical CPU count
- total memory
- preregistration path / SHA-256
- execution policy path / SHA-256
- 事前登録corpus全体

出力:

```text
artifacts/phase-transition/independent-confirmation-v2/execution-lock.json
```

## Guarded formal runner

対応phase:

- `status`
- `run`
- `analyze`
- `verify`
- `evaluate`

`run`では次の両方を要求する。

1. repository policyの`formalExecutionAllowed=true`
2. 完全一致のE-017承認トークン

全phaseで次を再照合する。

- execution policy path / SHA-256
- preregistration path / SHA-256
- preregistration corpusとexecution lock corpusの完全一致
- source commit
- branch
- clean worktree
- Node.js version
- experiment ID

## Corpus integrity

`verify` phaseでは既存artifact verifierとE-017 corpus contractを組み合わせ、次を検証する。

- observation schema
- `gameId + ply`一意性
- ply連続性
- `previousStateHash`
- final state hash
- trajectory hash
- manifest file hash / bytes
- 1000局完了
- seed列`20263001–20264000`
- game ID一意性
- 全game trajectory hash
- AI条件・profile・maxDepth
- game config hashとmanifest config hash
- manifest source commitとexecution lock source commit
- lockの事前登録・policy hash

出力:

```text
artifacts/local/phase-transition-independent-confirmation-v2/integrity/
└── independent-confirmation-integrity.json
```

`mode=formal`かつ`valid=true`の場合だけ、事前登録判定を許可する。

## Operational failure policy

candidate/control CSV欠損、trajectory結合失敗、必要出力構築失敗を単純なprocess errorで終わらせず、次を出力する。

- decision: `inconclusive`
- error message
- `independent-confirmation-result.json`
- `independent-confirmation-summary.csv`

これは成功条件の緩和ではなく、事前登録済みの`inconclusive`契約を実装したもの。

## 回帰テスト対象

- formal corpus rootのGit ignore実照合
- GitHub Actionsでのlock生成拒否
- repository許可フラグ
- 完全一致トークン
- preregistration / policy hash
- preregistration corpusとlock corpus
- partial game count
- source commitとlockの一致
- formal integrity success / failure
- operational failureの`inconclusive`変換

## 影響

- E-017の1000局、seed、AI条件、主解析単位、成功条件は変更していない。
- E-010の`not-confirmed`判定は変更していない。
- E-011の条件・判定規則は変更していない。
- E-017正式1000局は生成していない。

## 次工程

1. `Phase Transition Independent Confirmation`の最新CIを完了する。
2. E-011 formal guard CIを完了する。
3. 明示的承認なしにE-011またはE-017の正式corpusを生成しない。
