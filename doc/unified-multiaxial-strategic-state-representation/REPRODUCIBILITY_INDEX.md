# UMSSR-STUDY1 — 再現性索引

更新日: 2026-08-30

## 1. repository anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
baseline main tree = 462af8c1443ab6fa00dcadfb46b171f1c8673550
research branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

## 2. Study / Stage IDs

```text
Study = UMSSR-STUDY1
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
```

## 3. 初期正本文書

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `CANDIDATE_AXIS_INVENTORY.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`
- `prereg/STUDY_1_INITIAL_CONTRACT.json`
- `checkpoints/2026-08-30-study-start-freeze.md`

## 4. upstream canonical sources

開始時auditで最低限参照したcentral source:

- `README.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/DOCUMENTATION_LANGUAGE_POLICY.md`
- `doc/JAPANESE_DOCUMENTATION_QUALITY_GATE.md`

G2-01..G2-09の`CURRENT_STATUS.md`を確認し、とくにG2-02およびG2-06〜G2-09ではcanonical machine-readable resultも確認した。

主要machine-readable source:

- `doc/search-reliability-decision-robustness/results/STAGE_2_FORMAL_RESULT.json`
- `doc/rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`
- `doc/practical-comeback-reply-pressure-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`
- `doc/machine-decision-failure-taxonomy/results/STAGE_1_DEVELOPMENT_RESULT.json`
- `doc/tactical-motif-generalization-counterexample/results/STUDY_1_FINAL_RESULT.json`

## 5. upstream state summary

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion = null
STSCV-STUDY1 = INCONCLUSIVE / validated transform set = []
REEOE-STUDY1 = INCONCLUSIVE
DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RCPR-STUDY1 Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR-STUDY1 Stage 1 = STAGE1-TECHNICAL-INVALID
MDFT-STUDY1 = NON-ESTIMABLE
TMGC-STUDY1 = TECHNICAL-INVALID
```

## 6. RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

excluded:

```text
turn,reason
```

validated transform set=`[]`。

## 7. seed ledger

```text
29300001..29300064 = Stage 0 technical-only / NON-SCIENTIFIC
29310001..29314096 = Stage 1 / RESERVED-UNCONSUMED
29410001..29418192 = Stage 2 / RESERVED-UNCONSUMED
```

seed consumption stateはscientific execution開始時にexecution-start artifactへmaterializeし、consume-once semanticsを適用する。

## 8. future artifacts

Stage 0以降で次を追加する予定である。存在するまでcanonical resultとはみなさない。

- machine-readable Stage 0 technical spec / result
- Stage 1 source freeze / feature dictionary / development spec
- Stage 1 explicit authorization
- Stage 1 execution-start artifact
- Stage 1 production / independent result
- Stage 1 exact comparison / readiness result
- Stage 2 formal spec / authorization（Stage 1 gate PASS時のみ）
- Stage 2 production / independent formal result
- final Study result

## 9. documentation quality

新規human-readable Markdownは作成時点から日本語主体とする。immutable化、hash固定、closure前に`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`の必須ゲートを適用する。
