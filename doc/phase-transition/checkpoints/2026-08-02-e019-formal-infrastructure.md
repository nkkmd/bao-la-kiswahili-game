# E-019 formal infrastructure validation checkpoint

更新日: 2026-08-02  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Infrastructure validated / awaiting E-019-specific formal authorization

## 1. 事前登録正本

E-019は次を正本としてinfrastructureを実装・検証した。

- preregistration: `config/experiments/phase-transition-search-profile-generalization-v2.json`
- execution policy: `config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`
- formal runbook: `doc/phase-transition/E019_FORMAL_EXECUTION.md`

v1は履歴として残す。v2への訂正はformal data生成前のsample-size reference Nの計算訂正のみであり、選択N、formal seed、endpoint、decision ruleを変更していない。

v2 preregistration SHA-256 observed by the infrastructure fixture:

```text
046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8
```

## 2. 固定design

- D1: `hard / bao / depth 1`, phase2 vs legacy, 6500 pairs
- D3: `hard / bao / depth 3`, phase2 vs legacy, 4500 pairs
- V2: `hard / bao-v2 / depth 2`, phase2 vs legacy, 2000 pairs
- total: 13000 paired comparisons / 26000 games
- formal master seed block: `20268001–20274500`
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game within stratum
- primary test: two-sided exact McNemar
- component alpha: 0.05
- minimum discordant pairs: 20 / stratum
- direction: phase2-only > legacy-only
- global decision: three-component intersection-union test
- standalone stratum inference: Holm-Bonferroni family alpha 0.05
- structural trajectory-ply comparison: secondary only

このcheckpointは上記条件を変更しない。

## 3. 実装

E-018 infrastructureを基礎に、E-019専用として次を実装した。

- `tools/experiments/lib/phase-transition-search-profile-generalization.js`
- `tools/experiments/run-phase-transition-search-profile-generalization.js`
- `tools/experiments/build-phase-transition-search-profile-generalization-pairs.js`
- `tools/experiments/verify-phase-transition-search-profile-generalization.js`
- `tools/experiments/evaluate-phase-transition-search-profile-generalization.js`
- `tools/experiments/summarize-phase-transition-search-profile-generalization-structure.js`
- `tools/experiments/prepare-phase-transition-search-profile-generalization-execution.js`
- `tools/experiments/run-phase-transition-search-profile-generalization-formal.js`
- `test/phase-transition-search-profile-generalization.test.js`
- `test/phase-transition-search-profile-generalization-formal.test.js`
- `.github/workflows/phase-transition-search-profile-generalization.yml`

Formal corpus root:

```text
artifacts/phase-transition/search-profile-generalization-v2/
```

は`.gitignore`対象とした。

## 4. Guard contract

Formal authorization前は次を強制する。

- public runnerは`--fixture-games`必須
- fixture seed rangeがE-019 formal blockまたは過去excluded blockへ重なる場合は拒否
- current execution policyは`formalExecutionAllowed=false`
- GitHub Actions formal runは禁止
- E-019 formal execution lock preparationもauthorization前は拒否
- E-011/E-017/E-018 execution lockは使用しない
- formal runnerはE-019専用lock、source、policy/preregistration hash、clean worktree、exact approval tokenを要求する

## 5. Infrastructure validation history

### Run #1

E-019専用workflowの最初の実行はunit-test段階で停止した。

原因:

- formal-guard testがSHA helperを誤ったmoduleから参照していた。

影響:

- fixture generation前に停止
- formal corpus生成なし
- formal seed使用なし
- scientific condition変更なし

test helper参照だけを修正した。

### Run #2

次の実行では以下が成功した。

- preregistration / IUT / Holm unit tests
- formal guard tests
- six-condition fixture generation
- three-stratum paired fixture integrity

その後、candidate/control analysisで停止した。

原因:

- 2-game fixtureの`V2-LG`で候補が0件となり、既存`analyze-phase-transition-archetypes.py`がempty candidate DataFrameを正常状態として扱えず`KeyError: 'category'`となった。

これは0候補を違法扱いする科学条件ではなく、既存analysis utilityのempty-input edge caseだった。

対応:

- fixture seedを都合よく変更しなかった
- candidate thresholdを変更しなかった
- 0候補をcandidate/archetype/unique-state count 0、phaseBands emptyとして正常処理するようutilityを修正した

影響:

- formal corpus生成なし
- formal seed使用なし
- scientific condition変更なし

### Run #3 — successful infrastructure validation

Workflow:

```text
Phase Transition Search Profile Generalization
```

Actions run:

```text
30747182554
```

validated branch head:

```text
ea7f87c2df1bfa1a5997ab63aa59b21db97f3955
```

non-formal fixture:

- base seed: `20267101`
- seeds: `20267101–20267102`
- 2 games / condition
- 6 conditions
- 12 games total
- formal seed overlap: none
- `formalExecutionApproved: false`

Successful workflow stages:

1. preregistration / evaluator / IUT-Holm / formal-guard tests
2. six-condition fixture generation
3. three-stratum pairing integrity
4. candidate + control analysis for all six conditions
5. paired game-level endpoint construction for D1/D3/V2
6. fixture evaluator output-contract check
7. preregistered structural secondary construction
8. artifact upload

Fixture integrity verified:

- all 6 conditions present: true
- unique condition config hashes: true
- common source commit: true
- within-stratum seed sequences: true
- paired opening hashes within stratum: true
- condition identity clean: true
- trajectory hashes present: true
- execution mode correct: true
- errors: `[]`
- valid: `true`

The fixture evaluator is not a scientific result. Because the fixture has only 2 pairs per stratum rather than the preregistered formal N, each condition is expected to be technical `inconclusive` under exact-pair-count validation. This only tests the output/decision contract.

Artifact:

- name: `phase-transition-search-profile-generalization-fixture`
- artifact ID: `8833345386`
- SHA-256 digest: `sha256:b4224224f27f9d4403be62698abefd77acd130729ce2eb5171cce0017f0dbe52`
- size: 220939 bytes

## 6. Repository execution state after validation

Execution policy status is advanced to:

```text
infrastructure-validated-awaiting-authorization
```

but remains:

```text
formalExecutionAllowed: false
formalCorpusGenerated: false
```

Therefore no E-019 formal execution lock may be generated yet and no formal corpus may be started.

## 7. 次工程

次は固定ローカルenvironmentのpre-authorization preflightを行う。

Preflightではruntime、branch、HEAD、clean worktree、git-ignore stateだけを確認する。E-019 formal seedを使用せず、execution lockを生成しない。

Preflight successful後、研究状態を確認したうえで、E-019固有formal 26000局開始について別の明示的ユーザー承認を要求する。

承認前にsample size、seed、endpoint、McNemar rule、IUT/Holm contractを変更しない。

PR #26は引き続きopen / draftを維持する。
