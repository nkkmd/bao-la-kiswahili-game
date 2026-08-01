# E-017 固定ローカル正式実験 開始承認チェックポイント

更新日: 2026-08-01  
Experiment: `E-017`  
analysisVersion: `15-independent-structural-confirmation`  
Status: Approved / Awaiting fixed-local execution lock

## 1. 明示的開始承認

2026-08-01 22:47 JST、ユーザーから研究再開時に提示した推奨順序「E-017 → H16直接比較実験」に対して「推奨順序で進めてください」と明示的な進行指示を受領した。

この指示を、既存のD-073およびE-017 execution policyが要求する **E-017固有のformal experiment開始承認** として記録する。

E-011の過去承認を流用したものではない。

## 2. Repository許可

formal corpus条件・分析条件・判定条件には触れず、execution policyの状態と許可フラグだけを専用コミットで有効化した。

- authorization commit: `f0f9e90be0d77dac395e9ec53d951a011ad1f1fd`
- execution policy: `config/experiments/phase-transition-independent-confirmation-execution-policy-v1.json`
- policy status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-017-FORMAL-APPROVED`

## 3. 維持した事前登録条件

次は一切変更していない。

- 1000局
- seed: `20263001–20264000`
- `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`
- raw primary candidate rows >= 30
- unique candidate trajectory-ply >= 15
- unique candidate trajectory >= 12
- unique expansion trajectory-ply >= 5
- unique expansion trajectory >= 5
- unique control trajectory-ply >= 30000
- deduplicated RR >= 3
- deduplicated candidate rate > control rate
- decision contract: `confirmed / not-confirmed / inconclusive`

E-010の`not-confirmed`、E-011のformal `inconclusive`、H16の「E-011から示唆・未検証」という位置づけも変更していない。

## 4. 現時点の実行状態

このGitHub工程ではformal corpusを生成していない。

E-017のrunbookに従い、次に固定ローカルrepository

`/home/oruorane/github/bao-la-kiswahili-game`

で以下を満たした上でexecution lockを生成する必要がある。

- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- clean worktree
- authorization commit以降の対象headへfast-forward済み
- GitHub Actions環境ではない

execution lock生成成功前に1000局を開始してはならない。

## 5. 次工程

1. 固定ローカル環境で最新branch headへ更新する。
2. `prepare-phase-transition-independent-confirmation-execution.js`でexecution lockを生成する。
3. lockのsource commit、runtime、事前登録hash、policy hash、corpus条件を監査する。
4. lock成功後にのみ、完全一致トークンを用いてE-017正式1000局を開始する。
5. `run → analyze → verify → evaluate`を順に実行する。
6. formal integrityと事前登録判定を保存した後、研究台帳を更新する。
7. E-017完了後にのみ、次の推奨工程としてH16の`phase2`対`legacy`直接比較実験を別事前登録する。

PR #26は引き続きdraftのまま維持する。
