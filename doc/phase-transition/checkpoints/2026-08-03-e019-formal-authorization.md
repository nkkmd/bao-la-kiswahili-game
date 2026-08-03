# E-019 formal execution authorization checkpoint

更新日: 2026-08-03  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Formal authorized / awaiting new fixed-local execution lock / formal corpus not generated

## 1. Authorization

E-019 infrastructure validation完了後、固定ローカルpreflightを実施し、ユーザーからE-019固有のformal実行開始承認を受領した。

承認文:

> E-019のformal実行開始を承認します。

この承認はE-019にのみ適用する。E-011、E-017、E-018の承認またはexecution lockを流用しない。

## 2. Fixed-local preflight

承認直前の固定ローカル環境で次を確認した。

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- pre-authorization HEAD: `1fbe740378df4446af1212a6891f309958c7b8c1`
- worktree: clean
- Python executable: `/home/oruorane/.venvs/bao-phase-transition-e011/bin/python3`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- Node.js: `v24.6.0`
- E-019 corpus root: git ignored

固定venv名に`e011`を含むが、科学条件・承認・lockを流用する意味ではなく、既に固定された実行環境としてのみ利用する。

## 3. Repository authorization state

execution policy:

`config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`

を次へ遷移した。

```text
status: approved-awaiting-local-lock
formalExecutionAllowed: true
formalCorpusGenerated: false
githubActionsFormalRunAllowed: false
```

formal authorization後もGitHub Actionsによるformal corpus生成は禁止する。

## 4. Scientific contract unchanged

承認によって事前登録条件は変更しない。

- D1: `hard / bao / depth1 / phase2 vs legacy`, 6500 pairs
- D3: `hard / bao / depth3 / phase2 vs legacy`, 4500 pairs
- V2: `hard / bao-v2 / depth2 / phase2 vs legacy`, 2000 pairs
- total: 13000 paired comparisons / 26000 games
- formal master seed block: `20268001–20274500`
- primary population: `pliesRemaining >= 9`
- paired same-seed / same-opening game-level binary endpoint
- two-sided exact McNemar per stratum
- alpha: 0.05
- minimum discordant pairs: 20 per stratum
- direction: phase2-only > legacy-only
- global decision: 3/3 component passを要求するIUT
- standalone inference: Holm-Bonferroni
- structural analysis: preregistered secondary only

E-010 `not-confirmed`、E-011 `inconclusive`、E-017 `not-confirmed`、E-018 `confirmed`も変更しない。

## 5. Remaining guard before corpus generation

承認はformal corpusを即時生成する許可ではない。

次に、authorization stateを含む最新branchを固定ローカルへ同期し、runtime/worktreeを再確認した上で**E-019専用の新規execution lock**を生成する。

lockが以下を満たすまでformal corpusを生成しない。

- `errors: []`
- `status: prepared-approved`
- `approval.approved: true`
- source commitが最新同期HEADと一致
- preregistration SHA-256固定
- execution-policy SHA-256固定
- runtime / branch / worktree / git-ignore checks pass
- corpus / primary / IUT / Holm / structural-secondary contractsが事前登録と一致

lock生成後はpackage install/upgrade、`git pull`、source変更、branch変更を行わない。必要になった場合は既存lockを無条件に流用せず再固定の要否を判断する。

## 6. Next step

固定ローカル環境を最新authorization headへ`git pull --ff-only`し、preflightを再確認した後、次を実行する。

```bash
node tools/experiments/prepare-phase-transition-search-profile-generalization-execution.js
```

execution lockの内容を監査してからformal corpus generationへ進む。
