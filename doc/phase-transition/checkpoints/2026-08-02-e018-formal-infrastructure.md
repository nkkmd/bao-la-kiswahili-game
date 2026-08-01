# E-018 search profile依存性直接比較 — formal infrastructureチェックポイント

日付: 2026-08-02  
Experiment: `E-018`  
Hypothesis: `H16`  
analysisVersion: `16-search-profile-dependence`  
Status: **infrastructure validated / formal not approved / not run**

## 目的

E-018の事前登録条件を変更せず、formal 4000局を生成する直前までの実行基盤を監査・固定する。

この工程は実装・実行環境監査であり、H16の科学的結果ではない。E-018のformal corpusは生成していない。

## 事前登録の固定条件

次は変更していない。

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 2000局 / condition、4000局 total
- shared seed: `20265001–20267000`
- same seed / same random-opening boundary required
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- game endpoint: eligible category-A `capture-branch-expansion` candidateが1件以上存在するか
- primary test: two-sided exact McNemar
- alpha: `0.05`
- minimum discordant pairs: `20`
- direction: `n10 > n01`
- legacy minimum expansion count: none
- structural secondaryはprimary判定を置き換えない

preregistration file:

- `config/experiments/phase-transition-search-profile-dependence-v1.json`

preregistration blob SHAはinfrastructure監査前後で変更していない。

## 実装済み基盤

### Fixture / shared implementation

- `tools/experiments/run-phase-transition-search-profile-dependence.js`
- `tools/experiments/verify-phase-transition-search-profile-dependence.js`
- `tools/experiments/build-phase-transition-search-profile-pairs.js`
- `tools/experiments/evaluate-phase-transition-search-profile-dependence.js`
- `tools/experiments/summarize-phase-transition-search-profile-structure.js`
- `tools/experiments/lib/phase-transition-search-profile-dependence.js`

### Fixed-local formal execution

- `config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json`
- `tools/experiments/prepare-phase-transition-search-profile-dependence-execution.js`
- `tools/experiments/run-phase-transition-search-profile-dependence-formal.js`
- `test/phase-transition-search-profile-dependence-formal.test.js`

formal runnerは `status / run / analyze / verify / evaluate` を分離する。

## Formal execution guard

formal run開始には次を要求する。

- GitHub Actionsではない固定ローカル環境
- repository path: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- clean worktree
- formal corpus rootがgit ignore対象
- execution lockと現在のsource commitが一致
- execution lockとpreregistration path / SHA-256が一致
- execution lockとexecution-policy path / SHA-256が一致
- locked corpus条件がpreregistrationと一致
- locked primary endpointがpreregistrationと一致
- locked decision ruleがpreregistrationと一致
- repository policyが明示承認後の `approved-awaiting-local-lock / formalExecutionAllowed=true`
- exact approval token `E-018-FORMAL-APPROVED`

現在のrepository policyは意図的に次のまま維持している。

- `status: prepared-not-approved`
- `formalExecutionAllowed: false`

したがって現状態ではformal 4000局を開始できない。

E-017の承認はE-018へ継承しない。

## Formal integrity guard

verifierにformal modeを追加し、2000局×2条件について次を監査する。

- 各conditionのartifact hash検証
- exact completed game count
- formal execution mode metadata
- preregistration hash
- condition ID / search profile / evaluator / depth
- shared base seed
- exact seed sequence
- P2/LG common source commit
- source commitとexecution lockの一致
- same game indexのpaired opening hash一致
- game / observation / AI sourceのcondition分離
- trajectory hash存在
- condition config hashの分離
- execution-lock preregistration hash
- execution-lock policy hash
- locked corpus / primary endpoint / decision rule

formal evaluationはintegrity resultが `mode=formal / valid=true` の場合だけ進む。

## Formal evaluation contract

formal evaluationは次の順で必要出力を構築する。

1. P2/LGのcandidate/control分析
2. paired game-level endpoint
3. preregistered structural secondary
4. primary exact McNemar evaluation

paired endpointまたはrequired output構築に失敗した場合は、事前登録どおり`inconclusive`として記録する。

structural secondaryはprimary McNemar decisionを変更しない。

## E-017実行環境問題への予防措置

E-017ではPython実行後の`__pycache__/`がclean-worktree guardを停止させた。

E-018では同じ非科学的停止を予防するため、`.gitignore`に次を追加した。

- `__pycache__/`
- `*.py[cod]`

これはPython bytecode cacheのみを対象とする実行環境上の変更であり、E-018のseed、局数、候補検出、分類閾値、primary unit、検定、alpha、direction、minimum discordant pairs、decision ruleを変更しない。

## GitHub Actions検証

workflow:

- `Phase Transition Search Profile Dependence`
- `.github/workflows/phase-transition-search-profile-dependence.yml`

validated implementation head:

- `c37b0e3d00b11d0d9563a815dbb653297503a90d`

Actions:

- run: `30723040531`
- job: `fixture`
- result: **success**

成功step:

- Python dependency setup
- evaluator / pair-builder / preregistration / formal-guard regression tests
- paired two-game fixture generation
- paired fixture integrity verification
- P2/LG candidate/control construction
- paired game-level endpoint construction
- preregistered structural secondary
- artifact upload

GitHub Actionsは2局fixtureのみであり、formal corpusは生成していない。

## 監査時のformal state

- E-018 approval: **not granted**
- execution policy: `prepared-not-approved`
- `formalExecutionAllowed`: `false`
- formal execution lock: **not generated for formal run**
- P2 formal corpus: `0 / 2000`
- LG formal corpus: `0 / 2000`
- total formal corpus: `0 / 4000`
- formal result: **none**
- H16 scientific status: **unconfirmed / not yet tested by E-018 formal data**

## 既存formal decisionの維持

このinfrastructure工程によって既存結果を変更しない。

- E-011 formal global decision: **`inconclusive`**
- E-017 formal decision: **`not-confirmed`**

E-011 C4のlegacy expansion 0をH16 confirmedへ読み替えない。
E-017の強いphase2 enrichmentをH16の直接証拠へ読み替えない。

## 停止点

E-018 formal infrastructureは、正式4000局を開始する直前まで検証済みとする。

**ここで停止する。**

次の操作は、ユーザーからE-018固有の明示的formal開始承認を受けた後にのみ行う。

1. scientific条件を変更せずexecution policyの状態・許可フラグだけを専用コミットで有効化する。
2. 固定ローカル環境で最新branch headを取得する。
3. clean worktree / Node.js / platform / repository pathを確認する。
4. execution lockを生成し、source commit、runtime、hardware、preregistration/policy hashを固定する。
5. lock成功後にのみformal 4000局を開始する。

明示承認前に上記1–5をformal開始へ進めない。
