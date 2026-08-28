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

A documentation inconsistency was identified: `CURRENT_STATUS.md` and `REPRODUCIBILITY_INDEX.md` still described the pre-Stage-0-execution state even though Stage 0 acceptance and the Stage 1 prospective freeze were already committed. This restart synchronization updates only status/reproducibility/resume documentation. It does not change any scientific threshold, classifier, endpoint, population, feature family, seed block, representation boundary, upstream decision, or authorization state.

Next scientific task remains Stage 1 implementation and implementation-validation preparation **without consuming the frozen Stage 1 outcome block**. Explicit Stage 1 execution authorization may be created only after the source/hash/contract-smoke gates required by the frozen Stage 1 spec pass.

Scientific outcome generated during restart synchronization: **none**.
