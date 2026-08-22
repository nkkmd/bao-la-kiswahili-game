# DECISION_REGISTER — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22

## BMP-D001 — New prospective independent study

**Decision:** This is a new independent Study. Completed-study formal decisions, thresholds, classifiers, endpoints, populations and interpretation boundaries are immutable.

Status: **FROZEN**

## BMP-D002 — Repository baseline

```text
main baseline = b1cc7047504b73c5a848e866f795c26a64250d13
branch = research/blunder-misvaluation-patterns
```

Status: **FROZEN**

## BMP-D003 — Construct separation

**Decision:** Do not compress decision loss, rank error, structural loss, forcing vulnerability, horizon error, static misvaluation and continuation outcome into one initial blunder score.

Status: **FROZEN**

## BMP-D004 — Primary search reference

**Decision:** Before scientific data, choose D3 with quiescence depth 1 under `exact-full-window-root-candidates/phase2-value-semantics/v1` and `bao` evaluation as the primary machine reference.

D2 is the shallow comparator. D1 is additional shallow diagnostic. D4 is non-primary technical/robustness candidate only.

Status: **FROZEN**

## BMP-D005 — Root actor perspective

```text
actor = state.player
all candidate search values = root-actor relative
all static post-move comparisons = root-actor relative
```

Status: **FROZEN**

## BMP-D006 — Exact move identity

**Decision:** Enumerate `E.moveVariants(state)` and identify exact variants with `AI.moveKey`. Do not collapse distinct Namua house-choice variants.

Status: **FROZEN**

## BMP-D007 — Tie handling

**Decision:** Equal best scores belong to the same exact TopSet. A tied-best candidate has regret 0 and score rank 1.

Status: **FROZEN**

## BMP-D008 — Mate-domain boundary

**Decision:** Ordinary evaluator-domain regret, mate-distance loss and cross-domain categorical drops remain distinct. Do not average raw million-scale cross-domain differences with ordinary evaluator-point regret as one severity quantity.

Status: **FROZEN**

## BMP-D009 — Calibration boundary

**Decision:** Position Evaluation / Win-Rate Calibration Study 1 remains `INCONCLUSIVE`. Its Stage 1 isotonic mapping is not a validated probability instrument and is excluded from formal primary severity/selection decisions in this Study.

Status: **FROZEN**

## BMP-D010 — Position Complexity boundary

**Decision:** Reuse exact root/depth instrumentation only as technical infrastructure. Do not reinterpret or rescue PCX-H1/H2.

Status: **FROZEN**

## BMP-D011 — Tactical Motif boundary

**Decision:** Historical TM-S2-C03 remains exactly the frozen machine-confirmed motif from Tactical Motifs Study 1. C01/C02/C04 remain NOT-CONFIRMED. Any C03 miss/near-miss misuse pattern must be a new present-Study candidate and cannot redefine the historical motif.

Status: **FROZEN**

## BMP-D012 — Human claim boundary

**Decision:** No beginner/general-human/expert misconception, cognitive bias or perceptual difficulty claim is authorized without new human evidence.

Historical `N=0` is not negative human evidence.

Status: **FROZEN**

## BMP-D013 — Three-stage firewall

```text
Stage 0 technical/construct audit
→ Stage 1 fresh exploratory discovery
→ Stage 2 fresh formal confirmation
```

Stage 0 contains no scientific inference; Stage 1 cannot confirm itself; Stage 2 cannot reuse Stage 1 support as confirmation evidence.

Status: **FROZEN**

## BMP-D014 — Historical trajectory is the primary support unit

**Decision:** Nearby plies from one trajectory cannot inflate candidate recurrence. Stage 1/2 selection is trajectory-aware and exact duplicate rule states collapse.

Status: **FROZEN**

## BMP-D015 — All legal alternatives are measured

**Decision:** Candidate discovery measures all eligible exact root moveVariants, not only the move chosen by one AI policy.

Status: **FROZEN**

## BMP-D016 — No fabricated PV

**Decision:** Current instrumentation does not expose a search-consistent principal variation. Use bounded reply sets/response envelopes unless a separate tracer is prospectively validated before scientific generation.

Status: **FROZEN**

## BMP-D017 — Fresh seed reservation

```text
Stage 1 capacity = 22400001..22402048
Stage 2 capacity = 22500001..22504096
```

Reservation is not authorization.

Status: **FROZEN RESERVATION**

## BMP-D018 — Authorization firewall

**Decision:** A Stage spec alone never authorizes scientific generation. Require a separate authorization bound to the exact spec and scientific source-file hashes.

Status: **FROZEN**

## BMP-D019 — No scientific corpus at initiation

**Decision:** Initial repository work is documentation/design/technical validation only. No Stage 1/2 scientific corpus is generated until its explicit authorization gate passes.

Status: **FROZEN**

## BMP-D020 — Negative/non-estimable closure is acceptable

**Decision:** Zero promoted candidates, zero confirmed candidates, NOT-CONFIRMED, INCONCLUSIVE-NOT-ESTIMABLE and TECHNICAL-INCONCLUSIVE are valid outcomes. Do not extend data or loosen thresholds to produce a positive catalogue.

Status: **FROZEN**

## BMP-D021 — Stage 0 compute feasibility

**Decision:** The deterministic no-RNG Stage 0 benchmark executed at exact returned HEAD `45ce006eb63d5555a030d50fe7aa4e97637db327` passed phase coverage and showed D3+Q1 workload is technically feasible. Retain D3+Q1 as the primary machine reference.

Status: **FROZEN**

## BMP-D022 — Exact Stage 1 population

```text
games = 2048
seeds = 22400001..22402048
maxPly = 100
```

**Decision:** Use the full previously reserved Stage 1 seed block. No unused within-study extension capacity remains.

Status: **FROZEN**

## BMP-D023 — Exact Stage 1 root budget

```text
Namua = 600
Mtaji = 600
total = 1200 if readiness passes
```

**Decision:** Root selection is trajectory-aware, phase-hash-assigned and outcome/value-independent. Unavailable assigned phases, duplicate rule states or inadequate pools do not trigger replacement, phase reassignment or corpus extension.

Status: **FROZEN**

## BMP-D024 — Matcher/failure separation

**Decision:** Candidate matching uses only phase + 1–2 structural preconditions + move abstraction. The failure token is excluded from the matcher. Failure and D3-inferior rates are computed over all matcher opportunities.

This prevents failure-positive observations from defining their own denominator.

Status: **FROZEN**

## BMP-D025 — Stage 1 exploratory promotion gate

A candidate requires:

```text
opportunity trajectories >= 24
opportunity rule states >= 24
failure-positive trajectories >= 16
distinct opening prefixes >= 6
maximum one prefix share <= 0.40
generation strata >= 3
maximum one stratum share <= 0.60
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

Automatic cap is 6 total, 3 per phase and 2 per failure family. Manual override is forbidden.

Status: **FROZEN**

## BMP-D026 — Stage 1 spec identity and authorization boundary

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
contract freeze commit = 94b565468a9222dcaee0576529147ef032a284e6
```

**Decision:** Freezing the Stage 1 spec does not authorize generation. Canonical contract validation, runner/verifier technical validation, exact source-file hash binding and a separate explicit authorization commit remain mandatory.

Status: **FROZEN**

## BMP-D027 — Stage 1 readiness chain passed without rescue

**Decision:** Accept the executed Stage 1 population, selection and measurement as readiness-valid because all frozen gates passed under the preregistered no-replacement/no-reassignment rules.

```text
games = 2048
unique historical trajectories = 1884
selected unique rule states = 1200
Namua / Mtaji selected = 600 / 600
measured legal moves = 5295
all selected roots finite D3 candidate tables = true
```

No seed extension, replacement, phase reassignment or threshold relaxation was used.

Status: **FROZEN**

## BMP-D028 — Stage 1 discovery closure

**Decision:** Freeze the exact deterministic Stage 1 exploratory discovery output as:

```text
matcherCount = 16421
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
promotedCandidateCount = 4
manualOverridePerformed = false
```

The four promoted candidate IDs follow exact deterministic promoted order:

```text
BMP-S1-C01
BMP-S1-C02
BMP-S1-C03
BMP-S1-C04
```

Exact definitions and metrics are canonical in `results/STAGE_1_DISCOVERY_RESULT.json`.

Status: **FROZEN**

## BMP-D029 — Stage 1 interpretation boundary

**Decision:** Promotion means exploratory eligibility for fresh-data confirmation only.

It does not authorize:

```text
confirmed Bao blunder claim
game-theoretic blunder claim
human misconception claim
expert/traditional recognition claim
pedagogical importance claim
generalization beyond frozen Stage 1 source/population
```

Stage 1 data may not be reused as Stage 2 confirmation evidence.

Status: **FROZEN**

## BMP-D030 — Stage 2 may be designed but generation remains blocked

**Decision:** After Stage 1 repository closure, prospective Stage 2 formal-confirmation design may begin for the exact frozen candidates `BMP-S1-C01..C04`.

Stage 2 scientific generation remains unauthorized until a separate formal spec, canonical contract/tooling validation, exact source-file hash freeze, and explicit source-bound authorization are complete.

The reserved Stage 2 capacity `22500001..22504096` remains reservation only.

Status: **FROZEN**
