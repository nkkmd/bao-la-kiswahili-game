# E-018 固定ローカル正式実験 開始承認チェックポイント

更新日: 2026-08-02  
Experiment: `E-018`  
analysisVersion: `16-search-profile-dependence`  
Status: Approved / Awaiting fixed-local execution lock

## 1. 明示的開始承認

2026-08-02 08:39 JST、E-018 formal開始直前で停止している状態に対し、ユーザーから「では進めます。ローカルでの作業があれば説明してください」と明示的な進行指示を受領した。

この指示を、D-093およびE-018 execution policyが要求する **E-018固有のformal 4000局開始承認** として記録する。

E-011またはE-017の過去承認を流用したものではない。

## 2. Repository許可

formal corpus条件・分析条件・判定条件には触れず、execution policyの状態と許可フラグだけを専用コミットで有効化した。

- authorization commit: `9c5a902f3fbe0df02975050f2648a2a08cefb109`
- execution policy: `config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json`
- policy status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-018-FORMAL-APPROVED`

## 3. 維持した事前登録条件

次は一切変更していない。

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 2000局 / condition
- total 4000局
- shared seed: `20265001–20267000`
- same seed / same random-opening boundary required
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- binary endpoint: eligible category-A `capture-branch-expansion` candidateが1件以上あるか
- primary test: two-sided exact McNemar
- alpha: `0.05`
- minimum discordant pairs: `20`
- direction requirement: `n10 > n01`
- legacy minimum expansion count: none
- structural `trajectoryHash + eventPly` comparison: secondary only
- decision contract: `confirmed / not-confirmed / inconclusive`

E-011 formal global decision `inconclusive`、E-017 formal decision `not-confirmed`も変更していない。E-011 C4やE-017の観測結果をE-018 formal resultへ読み替えない。

## 4. 現時点の実行状態

このGitHub工程ではformal corpusを生成していない。

次に固定ローカルrepository

`/home/oruorane/github/bao-la-kiswahili-game`

で以下を満たした上でexecution lockを生成する必要がある。

- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- clean worktree
- このcheckpointを含む最新branch headへfast-forward済み
- GitHub Actions環境ではない

### 固定Python環境

2026-08-02のlocal preflightでsystem Pythonにはnumpy/pandasが存在せず、既存venv `/home/oruorane/.venvs/bao-phase-transition-e011` では次を確認した。

- Python `3.12.3`
- numpy `2.5.1`
- pandas `3.0.5`

したがってE-018 local formal工程では、execution lock生成前および新しいshell/sessionからの再開時に必ず次を実行する。

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

その後、`which python3`が`/home/oruorane/.venvs/bao-phase-transition-e011/bin/python3`を指すこと、numpy/pandasのimportとversion、Node.js、HEAD、clean worktreeを確認する。

このvenvの利用はE-011の科学条件や承認をE-018へ流用するものではなく、E-018のPython解析工程に必要な既に検証済み固定ローカル実行環境を使用するための運用要件である。

専用runbook:

- `doc/phase-transition/E018_FORMAL_EXECUTION.md`

execution lock生成成功前に4000局を開始してはならない。

## 5. 次工程

1. `source ~/.venvs/bao-phase-transition-e011/bin/activate`で固定Python環境を有効化する。
2. 固定ローカルrepositoryで最新branch headへ更新する。
3. Python/numpy/pandas、Node.js、HEAD、clean worktreeをpreflight確認する。
4. `prepare-phase-transition-search-profile-dependence-execution.js`でexecution lockを生成する。
5. lockのsource commit、runtime、hardware、preregistration hash、policy hash、corpus条件、primary endpoint、decision ruleを監査する。
6. lock成功後にのみ、完全一致トークン `E-018-FORMAL-APPROVED` を用いてformal `run`を開始する。
7. corpus生成完了後、`analyze → verify → evaluate`を順に実行する。
8. formal integrityと事前登録判定を保存した後、研究台帳を同期する。

PR #26は引き続きopen / draftのまま維持する。
