# G4-07 / MLGMR-STUDY1 — 現在の状態

更新日: 2026-09-27  
Program: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
状態: **`COMPLETE / FORMAL-COMPLETE / MAIN-INTEGRATED`**

## 現在地

```text
reviewed pre-integration main HEAD = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
research branch = research/g4-07-multiscale-geometry-memory-return
integrated research HEAD = 0130bc4e4a7b5ec0c96a026a846fdbf75530f02a
Study ID = MLGMR-STUDY1
Stage 0 = COMPLETE / STAGE0-PASS
Stage 1 = COMPLETE / DEVELOPMENT-SUPPORT-ONLY
Stage 2 = COMPLETE / FORMAL-COMPLETE
formal family = 16 slots
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
pre-main audit = PASS
G4-10 depth-11 access = 0 / NOT AUTHORIZED
public AI change = false
main integration = COMPLETE / FAST-FORWARD
```

## Stage 0 canonical execution

```text
run = 36238840292 / attempt 1 / success
head = 0c7cdb2b2fa83c4d97ec0d2ad27c6a5c9c22b2b5
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V3
mandatory gates = 18 / 18 PASS
production / independent exact agreement = true
artifact ID = 10905163005
fresh scientific seed reads = 0
```

詳細: [`checkpoints/2026-09-26-stage-0-technical-pass.md`](checkpoints/2026-09-26-stage-0-technical-pass.md)

## Stage 1 canonical execution

```text
run = 36247459779 / attempt 1 / success
head = cf9244d760fac807c604fef1ae9639103bfa4b31
binding = MLGMR-STUDY1-STAGE1-BINDING-2026-09-26-V1
frozen source commit = acae88384e74d9d8b7d2661adcee69d1fe1f3175
artifact ID = 10908816662
artifact ZIP SHA-256 = 65081316d7f3dc0f59b7da5a527af65c052ea33b0ab7e8e8b07d06d764f27469
fresh scientific seed reads = 96
first / last read = 40713001 / 40713145
measured trajectories = 16 / P1 8 / P2 8
production / independent exact agreement = true
formal inference = false
```

Stage 1では24 axis×lag slotのうち16 slotがfrozen support gateを満たした。effect directionはpromotionへ使用していない。

```text
lag 1 = 6 / 6 supported
lag 2 = 6 / 6 supported
lag 4 = 4 / 6 supported
lag 8 = 0 / 6 supported
```

Canonical record: [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)

詳細: [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)

## Stage 2 canonical execution

```text
run = 36278926636 / attempt 1 / success
head = f73e2ade42b3379b9eaf2007292a057cfeaf88f0
binding = MLGMR-STUDY1-STAGE2-BINDING-2026-09-27-V1
frozen source commit = 8bf76b5bb4ef375948cedaac131cb256b4a1dd8a
artifact ID = 10919769185
artifact ZIP SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
STAGE_2_RESULT.json SHA-256 = 970083e5f2a5f06e05d52c271e7b4b2bda3e8eb7889ba699b96c9cc3efc98726
candidate manifest SHA-256 = 1c4b8479a04169a50e89e4c33b79fc4a95930c2d61c52f1d6ddb51cf958b28af
formal measurements SHA-256 = be67b4e7d78291e008eaf8b40d94b08cf5924a703ddb54df183824f237751ab8
formal inference SHA-256 = 365e7ae66571d6e6621a81ea6755185c7e581d13a38f81491f428b3a7f03b429
fresh scientific seed reads = 363
first / last read = 40723001 / 40723581
candidate count = P1 48 / P2 48
formal measured trajectories = 64 / P1 32 / P2 32
production / independent exact agreement = true
G4-10 depth-11 access = 0
```

Canonical record: [`results/stage-2/STAGE_2_CANONICAL_RECORD.json`](results/stage-2/STAGE_2_CANONICAL_RECORD.json)

詳細: [`checkpoints/2026-09-27-stage-2-formal-complete.md`](checkpoints/2026-09-27-stage-2-formal-complete.md)

## Formal result

Fixed 16-slot family:

```text
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
```

6つのlag-1 slotはすべて`REVERSAL-CONFIRMED`。

```text
A1 lag 1 = REVERSAL-CONFIRMED
A2 lag 1 = REVERSAL-CONFIRMED
A3 lag 1 = REVERSAL-CONFIRMED
A4 lag 1 = REVERSAL-CONFIRMED
A5 lag 1 = REVERSAL-CONFIRMED
A6 lag 1 = REVERSAL-CONFIRMED
```

lag 2の6 slotとformal family内lag 4の4 slotはすべて`NOT-CONFIRMED`。lag 8、およびA4/A5 lag 4はStage 1 support不足のためformal family外であり、Stage 2 scientific decisionを持たない。

## Bounded persistence summary

preregistered contiguous persistence ruleでは全6 axis:

```text
confirmedContiguousPersistenceLagMax = NONE
```

これは「temporal structureがない」という意味ではない。今回のsame-sign persistence chainがlag 1から開始しなかったことを意味し、むしろlag 1では全axisでopposite-sign relationがformal confirmationに到達した。

half-lifeや物理的decay lawへの読み替えは禁止する。

## Return endpoint

return endpointはpreregistrationどおり**DESCRIPTIVE ONLY**。formal confirmation labelやp-value claimへ昇格しない。

## Interpretation boundary

本Studyが支持するのは、固定P1/P2 fresh trajectory population、固定continuous representation、checkpoint grid、lag familyにおける短lagのformal opposite-sign relationである。

以下は主張しない。

- whole-Bao universal oscillation / mean-reversion law
- causal rule-event mechanism
- capture / nyumba / reserve / phase transition別の効果
- physical half-life / decay constant
- lag 8以遠への外挿
- game-theoretic consequence
- AI strength / best-move correctness
- human difficulty
- public AI feature recommendation

rule-semantic transitionはG4-08、search reliabilityはG4-09の別agendaとして保護する。

## No-rescue boundary

Stage 2はone-shot formal executionとして完了した。以下は禁止。

- Stage 2 same-evidence rerun
- seed extension
- replacement population
- post-access lag / axis / checkpoint / policy変更
- threshold relaxation
- favorable subgroup rescue
- Stage 1 effect directionを用いたformal family変更
- G3-11 depth-10 rerun
- G4-10 depth-11 access without separate authorization

## Closure

Closure decision:

[`../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`](../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md)

Final report:

[`FINAL_REPORT.md`](FINAL_REPORT.md)

`MLGMR-STUDY1`のscientific executionは完了した。追加scientific runは不要かつ未認可。

## Pre-main audit

最終整合性監査はPASS。確認済み:

- canonical Stage 2 result / closure / current-facing文書のformal counts一致
- raw artifact digestとcanonical provenanceの一致
- research branchはreviewed `main`に対してbehind 0
- branch差分に`public/`変更なし
- public AI production changeなし
- G4-10 depth-11 access = 0
- same-evidence rerun / seed extension / replacement populationなし
- frozen [`../research-generation-4/PROGRAM_PLAN.md`](../research-generation-4/PROGRAM_PLAN.md) 未変更

監査checkpoint: [`../research-generation-4/checkpoints/2026-09-27-g4-07-pre-main-audit.md`](../research-generation-4/checkpoints/2026-09-27-g4-07-pre-main-audit.md)

## Main integration

2026-09-27、pre-integration `main` `8edf791aa789d77ba27d3d7704ab02acd6e35eac` から、最終文書監査済みresearch HEAD `0130bc4e4a7b5ec0c96a026a846fdbf75530f02a` へ**non-force fast-forward**で統合した。

```text
integration method = FAST-FORWARD
integrated research HEAD = 0130bc4e4a7b5ec0c96a026a846fdbf75530f02a
scientific rerun during integration = false
public/ change = false
public AI production change = false
G4-10 depth-11 access = 0
```

統合は既存のformal result、no-rescue boundary、解釈境界を変更しない。

## 次に許可される作業

G4-07は科学実行・文書監査・main統合まで完了した。

G4-08 / G4-09 / G4-10 scientific executionは本Studyのclosureやmain統合によって自動認可されない。次のagendaへ進む場合は、独立したauthorization reviewから開始する。

## 正本

- [`FINAL_REPORT.md`](FINAL_REPORT.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`prereg/STAGE_2_FORMAL_SPEC.json`](prereg/STAGE_2_FORMAL_SPEC.json)
- [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)
- [`results/stage-2/STAGE_2_CANONICAL_RECORD.json`](results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)
- [`checkpoints/2026-09-27-stage-2-formal-complete.md`](checkpoints/2026-09-27-stage-2-formal-complete.md)
- [`../research-generation-4/checkpoints/2026-09-27-g4-07-pre-main-audit.md`](../research-generation-4/checkpoints/2026-09-27-g4-07-pre-main-audit.md)
- [`../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`](../research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md)
