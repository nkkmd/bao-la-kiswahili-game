# E-018 固定ローカル正式実行手順

更新日: 2026-08-02  
Experiment: `E-018`  
analysisVersion: `16-search-profile-dependence`  
Status: Approved / Awaiting fixed-local execution lock

## 1. 固定事項

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- Python command: `python3`
- Python environment: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- games: `2000 / condition`, `4000 total`
- shared seed: `20265001–20267000`
- paired random-opening boundary: required
- GitHub Actions formal run: prohibited

E-018正式実行では、既存の固定ローカルPython環境を使用する。system Pythonにはnumpy/pandasが存在しないことを2026-08-02のpreflightで確認したため、**local executionの案内では最初に必ず次を実行する。**

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

venvの名称にはE-011が含まれるが、E-011の科学条件や承認を流用する意味ではない。E-018のPython解析工程に必要な、既に検証済みの固定ローカルPython環境として使用する。

## 2. 必須local preflight

execution lock生成前、および新しいshell/sessionからE-018 local formal工程を再開する際には、次の順序を省略しない。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game

source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/forced-capture-regime-analysis
git pull --ff-only origin research/forced-capture-regime-analysis

which python3
python3 --version
python3 -c "import numpy, pandas; print('numpy', numpy.__version__, 'pandas', pandas.__version__)"
node --version
git rev-parse HEAD
git status --porcelain=v1
```

期待値:

- `which python3`: `/home/oruorane/.venvs/bao-phase-transition-e011/bin/python3`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- Node.js: `v24.6.0`
- branch: `research/forced-capture-regime-analysis`
- worktree: clean（`git status --porcelain=v1`が無出力）

上記のいずれかが異なる場合はexecution lockを生成しない。

**execution lock生成後は、package install / upgrade、git pull、source変更、branch変更を行わない。** 必要になった場合は既存lockをそのまま使って継続せず、原因と影響を記録して再固定の要否を判断する。

## 3. Execution lock生成

preflight成功後にのみ実行する。

```bash
node tools/experiments/prepare-phase-transition-search-profile-dependence-execution.js
```

生成物:

```text
artifacts/phase-transition/search-profile-dependence-v1/execution-lock.json
```

確認事項:

- `errors: []`
- source commitがpreflightのHEADと一致
- branchが`research/forced-capture-regime-analysis`
- Node.jsが`v24.6.0`
- `githubActions: false`
- `corpusRootIgnored: true`
- preregistration hashが固定
- execution-policy hashが固定
- corpus / primary endpoint / decision ruleが事前登録と一致

lock内の`status: prepared-not-approved`および`approval.approved: false`は、repository側承認と実行時approval tokenを分離する二段階guardのためであり、それ自体は異常ではない。

## 4. 状態確認

```bash
node tools/experiments/run-phase-transition-search-profile-dependence-formal.js \
  --phase status
```

正式実行前に、repository policyが`approved-awaiting-local-lock / formalExecutionAllowed=true`であり、P2/LGのformal corpusが未生成であることを確認する。

## 5. Formal corpus生成

execution lockとstatus監査成功後にのみ実行する。

```bash
node tools/experiments/run-phase-transition-search-profile-dependence-formal.js \
  --phase run \
  --approval-token E-018-FORMAL-APPROVED
```

正式corpus:

- P2: 2000局
- LG: 2000局
- total: 4000局
- shared seed: `20265001–20267000`

長時間実行では`tmux`または`screen`を使用してよい。これは科学条件を変更しない。

## 6. Formal analysis / integrity / evaluation

4000局完了後、順序を変更せず実行する。

```bash
node tools/experiments/run-phase-transition-search-profile-dependence-formal.js \
  --phase analyze

node tools/experiments/run-phase-transition-search-profile-dependence-formal.js \
  --phase verify

node tools/experiments/run-phase-transition-search-profile-dependence-formal.js \
  --phase evaluate
```

`verify`が`mode=formal / valid=true`になる前に統計結果を正式結果として解釈しない。

primary decisionは事前登録済みのexact McNemar contractを変更せず適用する。

- `confirmed`: integrity/pairing成功、discordant >=20、two-sided exact McNemar p<=0.05、`n10 > n01`
- `not-confirmed`: integrity/pairing成功、discordant >=20だがsignificance/direction不通過
- `inconclusive`: corpus/hash/source/pairing/output integrity失敗、またはdiscordant <20

structural secondaryはprimary McNemar判定を置き換えない。

## 7. 停止条件

次の場合はformal run / analyze / verify / evaluateを停止する。

- venvが未activate、または`python3`が固定venv以外を指す
- numpy/pandasがimportできない、または固定確認版と異なる
- source commitがexecution lockと異なる
- branchが異なる
- worktreeがdirty
- Node.js versionが異なる
- GitHub Actions環境
- preregistration hash不一致
- execution-policy hash不一致
- paired seed/opening integrity不一致
- P2/LG condition identity混在
- required output構築失敗

停止時は既存formal成果物を黙って上書きせず、原因・影響範囲・再開判断を`RESEARCH_LOG.md`へ追記する。

## 8. 運用上の必須案内

E-018についてユーザーへローカル作業を案内する場合、**最初のshell commandとしてvenv activationを必ず含める。**

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

新しいterminal、SSH再接続、`tmux`/`screen`の新規sessionなどで環境継承が不明な場合も、`which python3`と依存versionを再確認してからformal工程へ進む。
