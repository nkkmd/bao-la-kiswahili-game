# RCPR-STUDY1 — Research Log

## 2026-08-28 — Startup audit and prospective freeze

- Re-fetched remote `main` directly from GitHub.
- Verified full SHA `37480777246aa306c6ca3d0679d936b5e0107071`.
- Verified equality with the expected post-G2-05-hardening SHA supplied at study start.
- Verified zero open pull requests.
- Audited historical G2-01..G2-05 and G2-05 hardening branches against `main`; audited branches were ahead by zero commits and contained no residual unmerged scientific work.
- Read central program state and G2-05 hardening decision.
- Confirmed G2-06 start conditions were satisfied.
- Created `research/g2-06-rich-critical-position-representation` directly from the verified baseline SHA.
- Froze `RCPR-STUDY1` and Stage IDs before any G2-06 scientific outcome generation.
- Froze RAW scientific identity and `validated transform set = []`.
- Froze A/B/C/D leakage classes and the eight prospectively declared representation families.
- Froze no-rescue, Stage transition, independent-verification and interpretation boundaries.

Scientific outcome generated: **none**.

## 2026-08-28 — Stage 0 source audit

Historical Critical Positions reproducibility material was inspected strictly as method/technical reference.

Relevant historical primitives identified:

```text
public/engine.js
public/ai.js
public/ai-weights.js
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/lib/critical-positions-outcome-branching.js
tools/experiments/lib/tactical-motif-features.js
tools/experiments/lib/position-typology-features.js
```

Important identity finding:

`position-typology-features.js::identityKeys()` computes both a direct `ruleStateKey` and a seat-swapped canonical key using `mirrorState()`.

Disposition:

- do not use that helper as RCPR scientific identity;
- implement a dedicated RAW-only serializer/keyer;
- retain `public/engine.js` as the shared authoritative rule primitive;
- permit search code only under an explicitly frozen search profile;
- do not read historical CPOB Stage 1 corpus, selected-root payloads, measurements or discovery audit in the RCPR development/formal pipeline.

Scientific outcome generated: **none**.

## 2026-08-28 — Stage 0 technical acceptance

- Stage 0 source commit `dca7a70e75fb1014b752f4549bd6d1164b1feecb` executed in GitHub Actions run `33179301221`.
- Workflow conclusion was `success`.
- Artifact `9688987798` (`rcpr-stage0-technical-v1`) was archived with ZIP SHA256 `442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269`.
- Six fixtures (Namua 3 / Mtaji 3) exercised all eight declared candidate families and 310 scalar features.
- Production and structurally independent representations agreed exactly.
- RAW identity implementations agreed exactly.
- All mandatory positive and negative controls passed.
- Feature schema SHA256 was frozen as `1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b`.
- Stage 0 result core SHA256 was frozen as `d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac`.
- Decision recorded: `STAGE0-TECHNICAL-PASS`.

Scientific outcome generated: **none**.

## 2026-08-28 — Stage 1 development design freeze

- Committed `preregistration/STAGE_1_DEVELOPMENT_SPEC.json` at branch commit `efe44154c0fcfc99df492dc6680f59bf3a3d1f29`.
- Froze fresh development games `3072` and seed block `28610001..28613072` as `CONSUME-ONCE-DEVELOPMENT-ONLY`.
- Froze six generation strata, outcome-blind root selection, Namua/Mtaji quotas of `300/300`, RAW/trajectory/opening-prefix identity semantics, 310-feature representation contract, continuation instrument, `D_range >= 0.30` construct boundary, candidate family sets, deterministic 5-fold development rule, operating-threshold rule and readiness gates.
- Froze the requirement for independent full-corpus replay, root reselection, feature recomputation, continuation remeasurement and model-development recomputation.
- Explicitly retained `scientificInferenceAuthorized = false` and `developmentOutcomeGenerationAuthorizedBySpecAlone = false`.
- Required authorization path frozen as `doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json` after implementation/source-hash/contract-smoke validation.

Scientific outcome generated: **none**.

## 2026-08-29 — Restart audit and resume synchronization

The previous chat became unstable, so repository state was re-audited before continuation.

Verified:

```text
remote main = 37480777246aa306c6ca3d0679d936b5e0107071
research branch pre-sync head = efe44154c0fcfc99df492dc6680f59bf3a3d1f29
branch relation to main = ahead 17 / behind 0
G2-06 PR = none
Stage 0 workflow 33179301221 = completed / success
Stage 0 decision = STAGE0-TECHNICAL-PASS
Stage 1 spec = prospectively frozen
Stage 1 scientific execution authorization = absent
Stage 1 scientific outcome generated = none
Stage 2 authorization = absent
```

A documentation inconsistency was identified: `CURRENT_STATUS.md` and `REPRODUCIBILITY_INDEX.md` still described the pre-Stage-0-execution state even though Stage 0 acceptance and the Stage 1 prospective freeze were already committed. This restart synchronization updated only status/reproducibility/resume documentation and did not change any scientific threshold, classifier, endpoint, population, feature family, seed block, representation boundary, upstream decision, or authorization state.

Scientific outcome generated during restart synchronization: **none**.

## 2026-08-29 — Stage 1 implementation validation

- Implemented the frozen Stage 1 production pipeline and structurally independent verifier.
- Added non-scientific implementation smoke controls using technical seeds outside the fresh Stage 1 development block.
- Final implementation smoke executed in workflow `33195723195`, job `98932225577`, and passed all steps.
- Production smoke SHA256: `e8c7a944876b370f0516b8b4dc2a1176e649202fc08354dc4663503a01d54611`.
- Independent smoke SHA256: `e0e335e85f6759178f510dc50d6ca585c35c4aa10aa933045c2f6a6f1cf89bc4`.
- Final smoke artifact `9695647002` ZIP SHA256: `9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11`.
- Confirmed the scientific runner refused execution while explicit authorization was absent.

Scientific outcome generated: **none**. Fresh Stage 1 block consumed: **no**.

## 2026-08-29 — Stage 1 resource and execution-contract freeze

- Ran full 200-ply non-scientific resource preflight in workflow `33195349152`, job `98930953453`.
- Preflight artifact `9695494212` ZIP SHA256: `aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1`.
- Resource preflight result SHA256: `48682f9bf2c11cb7c3410d1620fe1a127cd4108befa2ddae88f20bb4697e32c0`.
- Prospectively froze `STAGE_1_EXECUTION_ADDENDUM.json`, including deterministic implementation encodings, separate production/independent 360-minute jobs, 6144 MB Node old-space ceiling, and consume-once failure semantics.
- Scientific implementation/source contract frozen at commit `a69ffce86cb278680ee676a2a9469aeb1d9ab1d4`.
- Stage 1 spec SHA256 remained `813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb`.
- Execution addendum SHA256 later independently measured as `e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64`.

Scientific outcome generated: **none**. Fresh Stage 1 block consumed: **no**.

## 2026-08-29 — Exact source-freeze audit

- Added a dedicated preauthorization, read-only source-freeze audit without modifying the scientific source commit.
- Audit commit: `7545a50524d6ef425ff97c4bc93c7138a523f967`.
- Workflow run `33196797865`, job `98935883477`, completed `success`.
- Artifact `9696075216` ZIP SHA256: `fabb644c69d0f5efac48f3275a1e28a008a84832c7a7c4fd99a5f199038dbd7c`.
- Audit envelope SHA256: `03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d`.
- Verified remote `main` remained `37480777246aa306c6ca3d0679d936b5e0107071`.
- Verified authorization was still absent at audit time.
- Verified all 17 frozen runtime/orchestration files exactly matched their Git blobs at scientific source commit `a69ffce86cb278680ee676a2a9469aeb1d9ab1d4`.
- Persisted the complete source-blob map in `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`.
- Source-freeze checkpoint closed at commit `4366e439c2838dd7f2f388e834ecc93aed7efcb6`.

Scientific outcome generated by audit: **none**. Fresh Stage 1 block consumed by audit: **no**.

## 2026-08-29 — Stage 1 explicit authorization and consume-once execution start

- Created explicit authorization `RCPR-S1-EXECUTE-2026-08-29-v1` in `authorizations/STAGE_1_EXECUTE.json`.
- Authorization commit: `a0d630df2ee5fbd943d306ab959ce509cbcc2330`.
- Authorization binds the exact Stage 1 spec SHA256, execution-addendum SHA256, scientific source commit, complete source-blob map, source-freeze audit provenance, fixed seed block, and consume-once failure contract.
- Authorization retains `scientificInferenceAuthorized = false`, `confirmatoryReuseAllowed = false`, and `stage2Authorized = false`.
- Authorization push triggered Stage 1 workflow run `33196954082`.
- Production job: `98936414477`.
- The step `Execute fresh Stage 1 development population once` entered `in_progress`.
- Under the prospectively frozen execution contract, once this production step has started and there is no evidence that execution remained before `execution-start.json`, the Stage 1 seed block is conservatively and irreversibly classified as consumed for this Study.

```text
fresh games = 3072
seed block = 28610001..28613072
consumption state = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
Stage 1 result = PENDING
Stage 2 = NOT AUTHORIZED
```

No completed Stage 1 scientific result is recorded at this log point. The only authorized next action while run `33196954082` is active is read-only workflow inspection.
