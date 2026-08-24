# Symmetry / Isomorphic Positions Study 1

Status: **ACTIVE — Stage 0 design / no formal symmetry outcome generated**  
Study ID: `SIP-STUDY1`

## Research question

Bao の candidate state/player/move transformation が、単なる visual symmetry ではなく、state validity、exact legal-move set、transition、terminal/winner semantics を保存する **rule-semantic graph isomorphism** かを bounded domain 上で deterministic に検証する。

本Studyは新規 prospective independent study であり、完了済み研究の formal decision、threshold、classifier、endpoint、population、interpretation boundary を変更しない。

## Immutable upstream anchor

Restricted Endgame / Winning Regions Study 1 の raw 8-state exact oracle を read-only ground truth として使用する。upstream Study の raw state count、hash、solution、formal decision は変更しない。

Study開始時に再取得した `main`:

```text
f2edfe27f4e22198e28525b0ac09f6dd4834c488
```

## Current stage

- current `main` identity: recovered
- engine coordinate / rule semantics: recovered
- historical symmetry material: reviewed as context only
- candidate transformation semantics: frozen before formal reachable-corpus outcomes
- Stage 0 synthetic/control validation: tooling pending
- Stage 0 technical graph benchmark: pending
- Stage 1 formal domain/spec: **not yet frozen**
- formal candidate pass/fail: **not generated**

## Entry points

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md)
- [`STAGE_0_TRANSFORM_DESIGN.md`](STAGE_0_TRANSFORM_DESIGN.md)
- [`STAGE_0_TECHNICAL_PLAN.md`](STAGE_0_TECHNICAL_PLAN.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`preregistration/CANDIDATE_TRANSFORMS.json`](preregistration/CANDIDATE_TRANSFORMS.json)
