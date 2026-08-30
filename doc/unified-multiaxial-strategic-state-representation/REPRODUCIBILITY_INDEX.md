# UMSSR-STUDY1 — 再現性索引

更新日: 2026-08-30

## 1. repository anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
research branch = research/g2-10-unified-multiaxial-strategic-state-representation
initial freeze commit = d5e5237a6678442cb5f0e72b3430b93e4526c1d4
pre-scientific tightening commit = 54cc0661d283f3740b9fd8f665730ed84eb01bcb
initial consistency audit commit = e3ff29277460d4d7e8529cef565448a6dfa3378d
Stage 0 source/spec freeze commit = 78de03fde8e286f65d1544ad585e9337dad240a0
```

## 2. Study / Stage IDs

```text
Study = UMSSR-STUDY1
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
```

## 3. 正本文書

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `UPSTREAM_STUDY_AUDIT.md`
- `CANDIDATE_AXIS_INVENTORY.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`
- `prereg/STUDY_1_INITIAL_CONTRACT.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `authorizations/STAGE_0_TECHNICAL_EXECUTE.json`
- `results/STAGE_0_TECHNICAL_CLOSURE_RESULT.json`
- `results/STAGE_0_SOURCE_HASHES.json`
- `checkpoints/2026-08-30-stage0-source-spec-freeze.md`
- `checkpoints/2026-08-30-stage0-technical-pass.md`

## 4. upstream audit summary

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

G2-07 Decision Register D38のintegration provenanceだけにstale entryを確認したが、scientific closureには影響しない。詳細は`UPSTREAM_STUDY_AUDIT.md`。

## 5. RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Stage 0でproduction / independent exact agreement、`turn/reason` exclusion、`pending` inclusionを再確認した。

standard initial RAW key:

```text
2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
```

## 6. seed ledger

```text
29300001..29300064 = Stage 0 technical-only / NON-SCIENTIFIC / NOT USED IN ACCEPTED RUN
29310001..29314096 = Stage 1 / RESERVED-UNCONSUMED
29410001..29418192 = Stage 2 / RESERVED-UNCONSUMED
```

accepted Stage 0 runはhand-built fixtureだけを使用し、scientific seedを0件消費した。

## 7. Stage 0 source/spec freeze

```text
commit = 78de03fde8e286f65d1544ad585e9337dad240a0
spec SHA-256 = 8e0f5c0cc0179f8660baa63826b6ace97022dee1ac59e980061ea63c794fe2d0
initial contract SHA-256 = 5e5d0afe358e227d6e29ac6e31a907a782e82c0791cba67174dfe7bd3e0bf739
technical authorization SHA-256 = 6e4a5a5cbd40c7553318ec2d20dbe76f6a46e03991e0aab8f45456e6e3a9ad02
```

source hash ledgerは`results/STAGE_0_SOURCE_HASHES.json`を正本とする。

## 8. Stage 0 canonical technical execution

```text
workflow = UMSSR Stage 0 Technical
run = 33295423785
job = 99214144073
source commit = 78de03fde8e286f65d1544ad585e9337dad240a0
workflow conclusion = success
artifact id = 9727254008
artifact name = umssr-stage0-technical-78de03fde8e286f65d1544ad585e9337dad240a0
artifact size = 11525 bytes
artifact ZIP SHA-256 = d63883eb0ec188b23c673809d182bc5585459992a30f29892c6a1a86400b6309
```

artifact内部:

```text
STAGE_0_TECHNICAL_RESULT.json SHA-256 = a11a81989fde36ff1a5d5fd38fd124365ea301bbbbc9a03e6cef9b6657e63ad1
SOURCE_HASHES.json SHA-256 = 0670489290a5ef193a67ee0355839efe79c5171497cf66e2ca5f9be903c2289a
runner internal result SHA-256 = 9599ba6993daff1f159037f8387e8dbbf5244150db585690d3b8ea0530b68fb9
internal hash recomputation = MATCH
```

formal disposition:

```text
STAGE0-TECHNICAL-PASS
mandatory gates = 14
passed = 14
failed = 0
scientific inference = NONE
```

## 9. Stage 0 technical bindings

### search

G2-02系2実装はNamua / Mtaji technical fixtureでdepth 1/2のlegal move count、per-move score、best score、top set、canonical bestをexact一致させた。

```text
upstream result eligibility = TECHNICAL-REFERENCE-ONLY
fresh G2-10 concept = DEVELOPMENT-CANDIDATE-ONLY
```

### tactical C03

```text
TM-S2-C03 original frozen scope reconstruction = PASS
positive control = PASS
negative control = PASS
Namua control = INELIGIBLE
generalization = NOT AUTHORIZED
direct executable eligibility = FORMALLY-ELIGIBLE / ORIGINAL SCOPE ONLY
```

### morphology

```text
historical frozen classifier artifact = absent
direct executable eligibility = INELIGIBLE
fresh G2-10 concept = DEVELOPMENT-CANDIDATE-ONLY
historical formal claim changed = false
```

### G2-05 bounded exact

```text
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
root RAW key binding = exact
full independent exact recomputation recorded = true
eligibility = BOUNDED-EXACT-ELIGIBLE
fresh-state extrapolation = false
```

## 10. numeric verification

```text
aggregation order = lexical canonical
arithmetic = IEEE-754 binary64
canonical encoding = big-endian binary64 lowercase hex
control hex = 3ff758ab7c7a895f
production insertion-order invariant = true
independent insertion-order invariant = true
production/independent exact = true
```

## 11. resource evidence

```text
runner wall before result = 0.07734332299999999 s
max RSS = 63512576 bytes
predicted result bytes = 25513
wall ceiling = 600 s
RSS ceiling = 536870912 bytes
artifact ceiling = 2097152 bytes
resource gate = PASS
```

この値はStage 0 technical planning evidenceであり、Stage 1 scientific outcomeではない。

## 12. authorization state after Stage 0

```text
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds = RESERVED-UNCONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds = RESERVED-UNCONSUMED
```

Stage 1 scientific execution前に、development population、actual axis set、feature dictionary、numeric/scaling contract、representation selection、readiness/promotion rule、Stage 2 endpoint、firewall、resource/artifact contract、independent implementationをprospectively freezeする。

## 13. documentation quality

human-readable Markdownは日本語主体とする。canonical token、Study/Stage ID、field名、hash、pathは原表記を維持する。closure前には`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`を再適用する。
