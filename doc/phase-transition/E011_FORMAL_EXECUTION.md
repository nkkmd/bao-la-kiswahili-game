# E-011 固定ローカル正式実行手順

更新日: 2026-08-01  
Status: Prepared / Formal execution disabled

## 1. 固定事項

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- run order: `C0 → C1 → C2 → C3 → C4`
- corpus output: `artifacts/phase-transition/robustness-v1/`
- analysis output: `artifacts/local/phase-transition-robustness/`
- parallel execution: prohibited
- GitHub Actions full run: prohibited

正式実験は、リポジトリ上の`formalExecutionAllowed`と完全一致の承認トークンの両方が有効でなければ開始できない。

現時点では次の設定のため、正式自己対局は実行不能である。

```json
"formalExecutionAllowed": false
```

## 2. 実行前環境ロック

正式実験の開始承認後、対象コミットへ更新し、clean worktreeで環境ロックを生成する。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game
git switch research/forced-capture-regime-analysis
git pull --ff-only
node --version
git status --short

node tools/experiments/prepare-phase-transition-robustness-execution.js
```

生成物:

```text
artifacts/phase-transition/robustness-v1/execution-lock.json
```

ロックには以下を記録する。

- source commit
- branch
- worktree状態
- Node.js version
- OS / architecture
- CPU model / logical CPU count
- total memory
- preregistration hash
- execution-policy hash
- corpus / analysis出力先

次のいずれかが不一致ならロック生成は失敗する。

- repository path
- branch
- Node.js version
- platform
- clean worktree
- E-011 run order
- preregistration experiment ID

## 3. 状態確認

環境ロック生成後、自己対局を開始せず状態だけ確認できる。

```bash
node tools/experiments/run-phase-transition-robustness-formal.js \
  --phase status
```

## 4. 正式条件実行

以下は、明示的な正式実験開始承認後にのみ使用する。

```bash
node tools/experiments/run-phase-transition-robustness-formal.js \
  --phase run \
  --condition C0 \
  --approval-token E-011-FORMAL-APPROVED
```

runnerは未完了の先頭条件だけを許可する。C0未完了時にC1以降を指定すると停止する。

各条件完了後に分析する。

```bash
node tools/experiments/run-phase-transition-robustness-formal.js \
  --phase analyze \
  --condition C0
```

同様にC1、C2、C3、C4を逐次実行する。

## 5. 全条件完了後の監査

```bash
node tools/experiments/run-phase-transition-robustness-formal.js \
  --phase verify
```

監査対象:

- 5条件すべての400局完了
- condition config hashの分離
- source commitの一致
- shared seedの一致
- paired opening hashの一致
- game / observation / AI sourceのcondition分離

## 6. 条件別・全体判定

```bash
node tools/experiments/run-phase-transition-robustness-formal.js \
  --phase evaluate
```

主判定は事前登録済みの条件を変更せず適用する。

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- リスク比3以上
- 候補率が対照率を上回る

副次分析として、各条件で以下を併記する。

- `trajectoryHash + candidatePly`重複除去後の候補・対照率
- 重複除去後のリスク比
- 固有trajectory数
- 固有アーキタイプ数
- 最大trajectory-ply重複数
- 最大捕獲可能量非対称化

## 7. 停止条件

次の場合は正式実行・再開・分析を停止する。

- source commitがexecution lockから変化した
- branchが変化した
- worktreeがdirty
- Node.js versionが変化した
- GitHub Actions環境
- condition順序違反
- 既存gameのconfig hash不一致
- paired opening hash不一致
- condition IDまたはAI source混在
- preregistration hash不一致

停止後は既存成果物を上書きせず、原因と影響範囲を研究ログへ追記する。
