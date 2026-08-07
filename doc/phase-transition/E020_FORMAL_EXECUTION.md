# E-020 / H18 D3逆転独立確認 — fixed-local formal execution runbook

更新日: 2026-08-05  
Experiment: `E-020`  
Hypothesis: `H18`  
analysisVersion: `18-d3-reversal-replication`

## 1. 前提

E-020は2026-08-05 18:41 JSTに実験固有のformal開始承認を受領済み。

Execution policy:

- `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`
- status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-020-FORMAL-APPROVED`
- GitHub Actions formal execution: prohibited

Formal corpusはE-020専用execution lockが`prepared-approved`になるまで生成しない。

## 2. 固定scientific contract

- condition: `hard / bao / depth 3`
- P2 search: `phase2`
- LG search: `legacy`
- pairs: `4500`
- total games: `9000`
- formal seed: `20275001–20279500`
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- primary endpoint: eligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上あるか
- test: two-sided exact McNemar
- alpha: `0.05`
- minimum discordants: `20`
- prospective direction: `LG-only > P2-only`

このrunbookでscientific contractは変更しない。

## 3. Authorization ledger sync

固定ローカルrepositoryで最新branchを取得する。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game
git switch research/forced-capture-regime-analysis
git pull --ff-only origin research/forced-capture-regime-analysis
git status --short
```

worktreeがcleanであることを確認後、authorization ledger syncを実行する。

```bash
node tools/experiments/sync-e020-authorization-ledgers.js

git diff --check
git diff -- \
  doc/phase-transition/CURRENT_STATUS.md \
  doc/phase-transition/RESEARCH_LOG.md \
  doc/phase-transition/DECISION_REGISTER.md \
  doc/phase-transition/EXPERIMENT_INDEX.md \
  doc/phase-transition/HYPOTHESES.md
```

内容を確認後、commit/pushする。

```bash
git add \
  doc/phase-transition/CURRENT_STATUS.md \
  doc/phase-transition/RESEARCH_LOG.md \
  doc/phase-transition/DECISION_REGISTER.md \
  doc/phase-transition/EXPERIMENT_INDEX.md \
  doc/phase-transition/HYPOTHESES.md

git commit -m "docs: record E-020 formal authorization in ledgers"
git push origin research/forced-capture-regime-analysis

git status --short
git rev-parse HEAD
```

このcommitがformal source候補になるため、execution lock生成後にはsource commitを変更しない。

## 4. Fixed-local preflight

Python venvをactivateする。

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

環境を確認する。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game

pwd
git branch --show-current
git status --short
git rev-parse HEAD
node --version
python3 --version
python3 - <<'PY'
import numpy, pandas
print("numpy", numpy.__version__)
print("pandas", pandas.__version__)
PY
uname -s
```

期待値:

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- worktree: clean
- Node.js: `v24.6.0`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- platform: Linux

formal corpus rootのgit ignoreも確認する。

```bash
git check-ignore --no-index artifacts/phase-transition/d3-reversal-replication-v1/.e020-ignore-probe
```

## 5. E-020専用execution lock生成

preflightが全て一致した場合のみ実行する。

```bash
node tools/experiments/prepare-phase-transition-d3-reversal-replication-execution.js \
  > /tmp/e020-execution-lock-output.json
```

生成lock:

- `artifacts/phase-transition/d3-reversal-replication-v1/execution-lock.json`

表示・監査:

```bash
cat /tmp/e020-execution-lock-output.json

python3 - <<'PY'
import json
p = "artifacts/phase-transition/d3-reversal-replication-v1/execution-lock.json"
with open(p) as f:
    x = json.load(f)
print("status:", x.get("status"))
print("errors:", x.get("errors"))
print("sourceCommit:", x.get("environment", {}).get("sourceCommit"))
print("branch:", x.get("environment", {}).get("branch"))
print("nodeVersion:", x.get("environment", {}).get("nodeVersion"))
print("python:", x.get("environment", {}).get("python"))
print("preregistrationSha256:", x.get("preregistration", {}).get("sha256"))
print("executionPolicySha256:", x.get("executionPolicy", {}).get("sha256"))
print("approval:", x.get("approval"))
PY
```

必須条件:

- `status: prepared-approved`
- `errors: []`
- source commit = lock生成時のHEAD
- branch一致
- runtime一致
- preregistration / policy SHA-256存在
- approval `approved: true`

この監査が完了するまでformal runは開始しない。

## 6. Formal corpus generation

execution lock監査成功後にのみ実行する。

状態確認:

```bash
node tools/experiments/run-phase-transition-d3-reversal-replication-formal.js \
  --phase status
```

formal 9000 games:

```bash
node tools/experiments/run-phase-transition-d3-reversal-replication-formal.js \
  --phase run \
  --approval-token E-020-FORMAL-APPROVED
```

runnerはP2/LG各4500局をE-020 formal seedで生成する。execution lock後のsource / branch / policy / preregistration / runtime変更を拒否する。

## 7. Analysis / verify / evaluate

formal corpus完了後、同じlock・source・runtimeを維持して順番に実行する。

```bash
node tools/experiments/run-phase-transition-d3-reversal-replication-formal.js --phase analyze
node tools/experiments/run-phase-transition-d3-reversal-replication-formal.js --phase verify
node tools/experiments/run-phase-transition-d3-reversal-replication-formal.js --phase evaluate
```

`verify`でformal integrityが`mode=formal / valid=true / errors=[]`になる前にevaluationを科学結論として扱わない。

## 8. Decision boundary

Evaluatorは事前登録contractをそのまま適用する。

### confirmed

- exact 4500 pairs
- discordants >=20
- two-sided exact McNemar p <=0.05
- LG-only > P2-only

### not-confirmed

valid/evaluableでdiscordants >=20だがsignificanceまたはprospective direction不通過。

P2 > LGへ有意に戻っても`not-confirmed`。

### inconclusive

integrity / exact pairing / required output / exact Nが成立しない、またはdiscordants <20。

Structural/mechanism-bridge secondaryでprimary decisionを置換・救済・反転しない。

## 9. Lock後の禁止事項

execution lock生成後はformal完了まで次を変更しない。

- source commit
- branch
- preregistration
- execution policy
- Node/Python environment
- N
- seed
- endpoint
- direction
- alpha
- minimum discordants
- decision rule

問題が発生した場合はformal conditionを事後変更せず、同一lock下でのresume可否を個別に監査する。
