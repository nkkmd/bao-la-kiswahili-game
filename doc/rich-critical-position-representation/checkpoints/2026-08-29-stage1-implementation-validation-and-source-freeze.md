# RCPR-STUDY1 — Stage 1 implementation validation and source-freeze checkpoint

Date: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1`  
Stage: `RCPR-S1-DEVELOPMENT-2026-08-28-v1`

## Classification

**PREAUTHORIZATION SOURCE FREEZE COMPLETE / EXACT-HASH AUDIT PASS / ELIGIBLE FOR SEPARATE EXPLICIT STAGE 1 AUTHORIZATION / NO STAGE 1 SCIENTIFIC OUTCOME / FRESH DEVELOPMENT BLOCK UNCONSUMED AT AUDIT**

This checkpoint itself does not authorize Stage 1 scientific development outcome generation.

## Frozen scientific source commit

The scientific implementation validated by the final non-scientific implementation smoke is prospectively frozen at:

```text
a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

Commit message:

```text
research(g2-06): freeze stage1 execution and resource contract
```

Subsequent documentation, audit-result, and authorization commits may advance the research branch but must not modify any scientific source file bound below.

## Stage 1 design anchors

```text
baseline main = 37480777246aa306c6ca3d0679d936b5e0107071
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
execution addendum SHA256 = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
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

```text
workflow run = 33195723195
job = 98932225577
conclusion = success
artifact = 9695647002
artifact ZIP SHA256 = 9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11
production smoke SHA256 = e8c7a944876b370f0516b8b4dc2a1176e649202fc08354dc4663503a01d54611
independent smoke SHA256 = e0e335e85f6759178f510dc50d6ca585c35c4aa10aa933045c2f6a6f1cf89bc4
```

Validated checks included static syntax, execution-addendum validation, production non-scientific corpus/representation/measurement smoke, independent replay/root reselection, independent feature and continuation-measurement agreement, independent synthetic model-development agreement, and fail-closed refusal while authorization was absent.

No fresh Stage 1 scientific seed was consumed by these smoke validations.

## Resource preflight

```text
workflow run = 33195349152
job = 98930953453
artifact = 9695494212
artifact ZIP SHA256 = aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1
resource preflight SHA256 = 48682f9bf2c11cb7c3410d1620fe1a127cd4108befa2ddae88f20bb4697e32c0
```

The frozen execution contract requires production and independent verification to run in separate `ubuntu-24.04` / Node 22 jobs, each with a 360-minute ceiling and 6144 MB Node old-space limit. The preflight is feasibility evidence, not a runtime guarantee.

## Exact source-freeze audit

The dedicated read-only source-freeze audit completed successfully.

```text
audit commit = 7545a50524d6ef425ff97c4bc93c7138a523f967
workflow run = 33196797865
job = 98935883477
conclusion = success
artifact = 9696075216
artifact ZIP SHA256 = fabb644c69d0f5efac48f3275a1e28a008a84832c7a7c4fd99a5f199038dbd7c
audit envelope SHA256 = 03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d
```

The audit verified:

- remote `main` remained exactly `37480777246aa306c6ca3d0679d936b5e0107071`;
- `STAGE_1_EXECUTE.json` was absent;
- scientific source commit `a69ffce86cb278680ee676a2a9469aeb1d9ab1d4` was an ancestor of the audit commit;
- all 17 frozen runtime/orchestration files had exact Git-blob agreement with the scientific source commit;
- Stage 1 spec SHA256 was exactly `813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb`;
- execution-addendum SHA256 was exactly `e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64`;
- audit generated no scientific outcome and consumed no fresh Stage 1 seed.

The complete frozen source-blob map is retained in:

```text
doc/rich-critical-position-representation/results/STAGE_1_SOURCE_FREEZE_AUDIT.json
```

## Consumption and failure boundary

Before explicit authorization, the fresh block remains unconsumed.

After authorization, the production runner writes `execution-start.json` immediately before invoking the fresh Stage 1 development pipeline. Crossing that boundary permanently consumes the Stage 1 seed block for `RCPR-STUDY1`, even if production, infrastructure, timeout, memory, serialization, or independent verification later fails.

Any failure after that boundary is fail-closed as `STAGE1-TECHNICAL-INVALID`; the same Stage 1 evidence block may not be repaired and rerun, and Stage 2 remains unauthorized.

## Authorization disposition

All prospectively required pre-execution implementation, resource, baseline, and exact-source-hash gates have passed. Stage 1 is therefore **eligible for a separate explicit authorization commit**.

That authorization must bind the exact Stage 1 spec SHA256, execution-addendum SHA256, scientific source commit, complete source-blob map, source-freeze audit provenance, frozen seed block, consume-once failure contract, and `stage2Authorized = false`.
