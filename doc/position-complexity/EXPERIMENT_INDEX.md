# Position Complexity / Difficulty Study — Experiment Index

更新日: 2026-08-13  
Status: **ACTIVE INDEX**

## PCX-S0-T001 — Exact root/depth diagnostic technical validation

```text
stage = Stage 0
class = technical validation
status = COMPLETE / PASS
scientific inference = none
```

Canonical result:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
workflow run = 31589325398
```

## PCX-S1-E001 — Multi-layer complexity exploratory design corpus

```text
stage = Stage 1
class = exploratory design development
stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
status = COMPLETE / READINESS PASS / CONSUMED
scientific inference = exploratory only
confirmatory reuse = prohibited
```

Frozen identity:

```text
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Population/result:

```text
games = 768
unique historical trajectories = 685
selected unique rule states = 666
Namua = 341
Mtaji = 325
D23 instability = 162
D23 stable = 504
ordinary-domain D2 margins = 510
all preregistered readiness gates = PASS
```

Canonical records:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
```

Local artifact root:

```text
artifacts/local/position-complexity/stage1-exploratory-v1/
```

No Stage 1 state or seed may serve as Stage 2 confirmation evidence.

## PCX-S2-F001 — Structural branching / decision-instability formal confirmation

```text
stage = Stage 2
class = formal / confirmatory
stage ID = PCX-S2-FORMAL-2026-08-13-v1
scientific design = FROZEN
tooling = VALIDATED
local execution authorization = ACTIVE
formal corpus = NOT YET GENERATED
```

Formal design:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
```

Authorization/runbook:

```text
doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
doc/position-complexity/STAGE_2_FORMAL_RUNBOOK.md
doc/position-complexity/checkpoints/2026-08-13-stage2-formal-generation-authorization.md
```

Fresh fixed corpus:

```text
1024 games
seeds 20410001..20411024
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / depth2
max ply 100
```

Primary:

```text
PCX-H1
D23Instability ~ phase + log1pLegalMoveCount
vs phase-only reduced model
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
```

Key secondary:

```text
PCX-H2
ordinary-domain log1pD2BestSecondGap
adds information beyond phase + log1pLegalMoveCount
confirmatory only if PCX-H1 is confirmed
```

Validated formal tooling:

```text
tools/experiments/run-position-complexity-stage2-formal.js
tools/experiments/verify-position-complexity-stage2-formal.js
tools/experiments/analyze-position-complexity-stage2-formal.py
tools/experiments/check-position-complexity-stage2-authorization.js
test/position-complexity-stage2-formal-tooling.test.js
```

Technical authorization validation:

```text
fingerprint CI run = 31673666993 / success
authorization-present CI run = 31673835352 / success
authorization preflight = success
```

Formal corpus generation is authorized only locally under the exact frozen pipeline. GitHub Actions generation, Stage 1 reuse, seed extension, early stopping, outcome-dependent replacement and post-hoc model/metric changes remain prohibited.

Artifact root after execution:

```text
artifacts/local/position-complexity/stage2-formal-v1/
```

Current formal result:

```text
NOT YET GENERATED
```
