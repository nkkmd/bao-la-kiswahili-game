# Tactical Motif Generalization / Counterexample Study 1

- Research Generation: `G2-09`
- Study ID: `TMGC-STUDY1`
- branch: `research/g2-09-tactical-motif-generalization-counterexample`
- baseline remote `main`: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`
- status: **Stage 0 technical work authorized; Stage 1 / Stage 2 not authorized**

## 正式研究題目

**Baoにおけるmachine-confirmed tactical motifの一般化可能範囲と反例領域のprospective検証 — phase, morphology, search condition, state familyを横断したTM-S2-C03のgeneralization boundary / counterexample boundaryの再現可能な特定**

本研究はResearch Generation 2のG2-09として実施する、新規・prospective・独立研究である。Research Generation 1のTactical Motifs / Tesuji Study 1で`CONFIRMED`となった`TM-S2-C03`を再解析・再定義・普遍化する研究ではなく、fresh prospective evidenceを用いて、元claim domainの外側でどこまで再現可能か、どこで反例が現れるか、どこが推定不能かを分離する。

## Immutable upstream boundary

以下はG2-09から変更しない。

- `TM-S2-C03 = CONFIRMED`
- `TM-S2-C01 = NOT-CONFIRMED`
- `TM-S2-C02 = NOT-CONFIRMED`
- `TM-S2-C04 = NOT-CONFIRMED`
- human axis: `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`
- authoritative state identity: RAW identity
- RAW identity included fields: `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`
- RAW identity excluded fields: `turn`, `reason`
- `validated transform set = []`
- `canonicalization = false`
- `symmetry reduction = false`

G2-06のtechnical-invalid representation、G2-08のnon-estimable development leaf observations等、formal validationを得ていない出力をG2-09のvalidated grouping inputとして使用しない。

## C03 exact / phase-transport の分離

元の`TM-S2-C03` primary definitionは次の凍結済みmachine constructである。

- phase: `mtaji`
- move abstraction mode: `coarse-no-index`
- move family: `takata`, row `1`, direction `right`, phase `mtaji`, `side=null`, `houseChoice=null`, `houseTwo=false`; pit indexはabstractionから除外
- precondition: `reusablePits=0-2`
- primary structural consequence: `actorNyumbaSeedsDeltaSign=0`
- paired diagnostic consequence: `worstReplyActorCaptureMoveDeltaSign=0`（diagnostic-only、primary definitionの代替不可）

したがってG2-09では、元定義をそのまま適用できるものを`C03-EXACT`として扱う。Namua等へのphase跨ぎは、Stage 0で意味論的に一意・再現可能に定義できると確認された場合に限り、G2-09専用の別constructとしてprospectively固定する。意味論的に一意に定義できない場合はfail-closedで`TECHNICALLY-INELIGIBLE`として扱い、元C03を変形して救済しない。

上流の完全なmachine-readable referenceは`preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json`を参照する。

## Stage構成

1. `TMGC-S0-TECHNICAL-2026-08-30-v1` — technical feasibility / semantics validation
2. `TMGC-S1-DEVELOPMENT-2026-08-30-v1` — fresh development / boundary construction
3. `TMGC-S2-FORMAL-2026-08-30-v1` — fresh held-out formal validation

現時点ではStage 0のtechnical workのみauthorizedである。科学的root生成・科学的seed消費はまだ許可されていない。

詳細は`STUDY_1_PROTOCOL.md`、`CURRENT_STATUS.md`、`preregistration/STUDY_CONTRACT.json`、`preregistration/STAGE_0_TECHNICAL_SPEC.json`を参照する。
