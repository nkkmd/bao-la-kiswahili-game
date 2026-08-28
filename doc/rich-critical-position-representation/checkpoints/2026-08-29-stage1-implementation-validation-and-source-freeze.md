# RCPR-STUDY1 — Stage 1 implementation validation and source-freeze checkpoint

Date: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1`  
Stage: `RCPR-S1-DEVELOPMENT-2026-08-28-v1`

## Classification at checkpoint creation

**PREAUTHORIZATION SOURCE FREEZE / EXACT-HASH AUDIT PENDING / NO STAGE 1 SCIENTIFIC OUTCOME / FRESH DEVELOPMENT BLOCK UNCONSUMED**

This checkpoint does not authorize Stage 1 scientific development outcome generation.

## Frozen scientific source commit

The scientific implementation validated by the final non-scientific implementation smoke is prospectively frozen at:

```text
a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

Commit message:

```text
research(g2-06): freeze stage1 execution and resource contract
```

The research branch may subsequently receive documentation, audit-result, and authorization commits. Such commits must not modify any scientific source file bound by the source-freeze audit.

## Stage 1 design anchors

```text
baseline main = 37480777246aa306c6ca3d0679d936b5e0107071
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
fresh games = 3072
fresh seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
selected roots target = 600 (Namua 300 / Mtaji 300)
representation width = 310
replicates per exact root move = 64
continuation horizon = 200 post-root plies
high-divergence boundary = D_range >= 0.30
```

## Final implementation validation

Final smoke validation was executed from the frozen scientific source lineage and passed all mandatory implementation checks.

```text
workflow run = 33195723195
job = 98932225577
conclusion = success
artifact = 9695647002
artifact ZIP SHA256 = 9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11
production smoke SHA256 = e8c7a944876b370f0516b8b4dc2a1176e649202fc08354dc4663503a01d54611
independent smoke SHA256 = e0e335e85f6759178f510dc50d6ca585c35c4aa10aa933045c2f6a6f1cf89bc4
```

Validated checks included:

- static syntax checks;
- prospective execution-addendum contract validation;
- production non-scientific corpus generation and representation/measurement smoke;
- structurally independent game replay and root reselection;
- independent feature and continuation-measurement agreement;
- independent synthetic model-development agreement;
- fail-closed refusal of the scientific runner while authorization is absent.

No fresh Stage 1 scientific seed was consumed by the smoke validation.

## Resource preflight and execution separation

The full 200-ply technical resource preflight passed using non-scientific technical fixtures only.

```text
workflow run = 33195349152
job = 98930953453
artifact = 9695494212
artifact ZIP SHA256 = aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1
resource preflight SHA256 = 48682f9bf2c11cb7c3410d1620fe1a127cd4108befa2ddae88f20bb4697e32c0
```

The prospectively frozen execution addendum therefore requires production and independent verification to run in separate `ubuntu-24.04` / Node 22 jobs, each with a 360-minute ceiling and 6144 MB Node old-space limit.

The preflight is feasibility evidence only. It is not a runtime guarantee.

## Consumption and failure boundary

Before explicit authorization and exact source-hash agreement, the fresh block is not consumed.

After authorization, the production runner writes `execution-start.json` immediately before invoking the fresh Stage 1 development pipeline. Crossing that boundary permanently consumes the Stage 1 seed block for `RCPR-STUDY1`, even if production, infrastructure, timeout, memory, serialization, or independent verification later fails.

Any failure after that boundary is fail-closed as `STAGE1-TECHNICAL-INVALID`; the same Stage 1 evidence block may not be repaired and rerun, and Stage 2 remains unauthorized.

## Exact source-hash audit required next

Before any explicit authorization, the dedicated read-only source-freeze audit must:

1. verify remote `main` remains the frozen baseline SHA;
2. verify `STAGE_1_EXECUTE.json` is absent;
3. verify the scientific source commit is an ancestor of the audit commit;
4. compare every current scientific runtime/orchestration source Git blob against the corresponding blob at `a69ffce86cb278680ee676a2a9469aeb1d9ab1d4`;
5. compute the exact Stage 1 spec and execution-addendum SHA256 values;
6. emit the source-blob map required by the later authorization;
7. generate no scientific outcome and consume no fresh Stage 1 seed.

Only a PASS audit permits a separate authorization commit. This checkpoint itself is not authorization.
