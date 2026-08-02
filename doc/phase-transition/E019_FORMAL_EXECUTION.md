# E-019 固定ローカル正式実行手順

更新日: 2026-08-02  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Infrastructure validated / awaiting E-019-specific formal authorization

## 1. 固定済み科学条件

正本となる事前登録:

- `config/experiments/phase-transition-search-profile-generalization-v2.json`

v1は履歴として保持する。v2はformal data生成前に、sample-size planningの参考Nだけを訂正した版であり、選択sample size、seed、endpoint、decision ruleは変更していない。

Formal strata:

| stratum | evaluator | depth | comparison | paired seeds | games |
|---|---|---:|---|---:|---:|
| D1 | `bao` | 1 | `phase2` vs `legacy` | 6500 | 13000 |
| D3 | `bao` | 3 | `phase2` vs `legacy` | 4500 | 9000 |
| V2 | `bao-v2` | 2 | `phase2` vs `legacy` | 2000 | 4000 |
| total |  |  |  | 13000 | 26000 |

Formal seed block:

- D1: `20268001–20274500`
- D3: `20268001–20272500`
- V2: `20268001–20270000`

各stratum内でphase2/legacyはsame seed / same random-opening boundaryを要求する。strata間のseed overlapはnested-prefix designとして事前登録済みで、primary inferenceは各stratum内pairに限定する。

Primary:

- population: `pliesRemaining >= 9`
- unit: paired shared-seed game within stratum
- endpoint: eligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上存在するか
- test: two-sided exact McNemar
- component alpha: `0.05`
- minimum discordant pairs: `20 / stratum`
- direction: `phase2-only > legacy-only`
- global: D1/D3/V2すべて`pass`を要求するintersection-union test
- standalone stratum claim: Holm-Bonferroni, family alpha `0.05`

Structural trajectory-ply analysisはpreregistered secondaryのみで、paired game-level condition decisionまたはglobal IUT decisionを変更しない。

## 2. 現在の実行状態

Execution policy:

- `config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`

現在:

- infrastructure validation: complete
- `formalExecutionAllowed`: **false**
- formal corpus generated: **false**
- E-019 formal execution lock: **not generated**
- GitHub Actions formal run: prohibited

E-011/E-017/E-018の承認・execution lockはE-019へ流用しない。

## 3. 固定ローカル環境

予定repository:

```text
/home/oruorane/github/bao-la-kiswahili-game
```

予定環境:

- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux / WSL2
- Python venv: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`

venv名にE-011を含むが、E-011の科学条件・承認・execution lockを流用する意味ではない。E-019自身のlock生成時にruntimeを再検証して固定する。

## 4. Formal authorization前に実行してよいlocal preflight

E-019固有formal承認の前に、環境確認だけを行ってよい。最初にvenvをactivateする。

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
git check-ignore -q artifacts/phase-transition/search-profile-generalization-v2/.e019-ignore-probe && echo "corpus root ignored: yes"
```

期待値:

- `which python3`: `/home/oruorane/.venvs/bao-phase-transition-e011/bin/python3`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- Node.js: `v24.6.0`
- branch: `research/forced-capture-regime-analysis`
- worktree: clean（`git status --porcelain=v1`が無出力）
- corpus root ignored: `yes`

この段階では**次を実行しない**。

```text
prepare-phase-transition-search-profile-generalization-execution.js
run-phase-transition-search-profile-generalization-formal.js --phase run
```

現在のpolicyは`formalExecutionAllowed=false`なので、lock preparationは意図的に拒否される。

## 5. E-019固有formal開始承認

local preflightと研究台帳確認後、E-019 formal 26000局を開始するには別の明示的ユーザー承認を要求する。

承認によって変更してよいのはexecution policyの実行状態だけである。

変更してはいけない事項:

- D1/D3/V2の条件
- paired sample sizes
- seed ranges
- candidate/regime thresholds
- `pliesRemaining >= 9`
- primary unit / endpoint
- exact McNemar
- component alpha
- minimum discordant pairs
- direction rule
- IUT global contract
- Holm standalone contract
- primary/secondary boundary

過去experimentの承認はE-019開始承認として扱わない。

## 6. E-019専用execution lock生成

E-019固有承認後、repository policyが`approved-awaiting-local-lock / formalExecutionAllowed=true`へ更新されていることを確認してから、固定ローカルでのみ実行する。

```bash
cd /home/oruorane/github/bao-la-kiswahili-game
source ~/.venvs/bao-phase-transition-e011/bin/activate

node tools/experiments/prepare-phase-transition-search-profile-generalization-execution.js
```

生成先:

```text
artifacts/phase-transition/search-profile-generalization-v2/execution-lock.json
```

lockで最低限確認する:

- `status: prepared-approved`
- `errors: []`
- `githubActions: false`
- source commit / branch / clean worktree
- Node.js / Python / numpy / pandas
- `corpusRootIgnored: true`
- preregistration path + SHA-256
- execution-policy path + SHA-256
- corpus conditions / endpoint / condition rule / global IUT / Holm / structural-secondary boundary

lock生成後はpackage install/upgrade、`git pull`、source変更、branch変更を行わない。必要になった場合は既存lockの流用可否を再判断し、黙って条件を変えない。

## 7. Formal status

lock生成後:

```bash
node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase status
```

6 conditionsについてplanned countsを確認する。

- D1-P2: 6500
- D1-LG: 6500
- D3-P2: 4500
- D3-LG: 4500
- V2-P2: 2000
- V2-LG: 2000

## 8. Formal corpus生成

status確認後のみ:

```bash
node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase run \
  --approval-token E-019-FORMAL-APPROVED
```

26000局を固定条件で生成する。長時間実行には`tmux`または`screen`を使用してよい。これは科学条件を変更しない。

## 9. Formal analysis / verify / evaluate

全26000局完了後、順序を変更せず実行する。

```bash
node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase analyze

node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase verify

node tools/experiments/run-phase-transition-search-profile-generalization-formal.js \
  --phase evaluate
```

`verify`が`mode=formal / valid=true`になる前に統計結果をformal resultとして解釈しない。

Condition-level:

- `pass`: exact pair count + integrity + discordants >=20 + p<=0.05 + phase2-only>legacy-only
- `fail`: exact pair count + integrity + discordants >=20、ただしsignificance/direction不通過
- `insufficient`: integrity/pairing成功だがdiscordants <20
- `inconclusive`: corpus/source/hash/opening/pairing/output construction等のtechnical failure

Global:

- `confirmed`: D1/D3/V2すべて`pass`
- `not-confirmed`: 1 stratum以上が`fail`
- `inconclusive`: `fail`はないが1 stratum以上が`insufficient`またはtechnical `inconclusive`

Holm-adjusted pはstandalone stratum claims用として保存し、IUT component passと混同しない。

## 10. Final export

formal evaluation完了後にfinal bundleを固定する場合、既存の恒久保管規則に従う。

```text
/home/oruorane/bao-e019-exports/
```

最低構成:

```text
e019-final-formal-evaluation.tar.gz
e019-final-formal-evaluation.tar.gz.sha256
```

archive bytes、SHA-256、member安全性、formal integrity、formal decisionを監査してから`FORMAL_EXPORT_INDEX.md`へ追記する。

## 11. 停止条件

次の場合はformal工程を停止する。

- E-019固有formal承認がない
- E-019専用execution lockがない / invalid
- worktreeがdirty
- branch / source commitがlockと不一致
- Node/Python/package version不一致
- GitHub Actions環境
- preregistration / policy hash不一致
- formal seed sequence不一致
- within-stratum opening hash不一致
- condition identity混在
- required output construction失敗

停止時に閾値、N、seed、decision ruleを変更して継続しない。
