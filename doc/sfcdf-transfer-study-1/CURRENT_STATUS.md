# SFCDFクロスドメイン移送研究1 — 現在状態

更新日: 2026-09-18

## 正式状態

```text
studyId = SFCDF-TRANSFER-STUDY1
program = Research Generation 4 / G4-02
authorization = G4-02-AUTHORIZED-FOR-PREREG-AND-STAGE0
preregistration = FROZEN
stage0 = AUTHORIZED / NOT YET COMPLETED
stage1 = RESERVED / NOT AUTHORIZED / NOT ACCESSED
stage2 = RESERVED / NOT AUTHORIZED / NOT ACCESSED
freshScientificSeedAccess = 0
formalScientificOutcomeGenerated = false
mainIntegrationAuthorized = false
```

## seed state

- Stage 0 technical-only: `44420001..44420064`
- Stage 1 fresh compatibility: `40421001..40421384` — RESERVED / UNREAD
- Stage 2 formal heldout: `40422001..40422768` — RESERVED / UNREAD

## freshness

- G3-04: 4-way exclusion
- G4-01 Stage 1R: seed + full trajectory + RAW root exclusion、opening prefixは`NOT-AUDITABLE-NOT-ASSERTED`
- G4-01 old Stage 1: `40111001..40111384` permanent quarantine
- Stage 1→Stage 2: 4-way exclusion必須

## 次のgate

Stage 0 technical fixture suiteを実装・実行し、production/independent agreement、identity/firewall、statistics、resource/fail-closed contractを検証する。

Stage 0 PASSまではStage 1 seedへアクセスしない。
