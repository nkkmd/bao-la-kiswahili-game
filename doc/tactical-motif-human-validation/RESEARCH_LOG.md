# RESEARCH_LOG — Tactical Motif Human / Expert Validation Study 1

## 2026-08-16 — Study initiation / Stage 0

- Verified study-start `main` HEAD `3cc40d83917660dd815c785ff0e0c754666d9a0e`.
- Recovered Tactical Motifs Study 1 decisions and immutable C03 definition.
- Reconfirmed evidence-layer boundary: machine confirmation is separate from human/expert/traditional/pedagogical claims.
- Selected blinded cross-position principle discrimination as the primary human construct.
- Defined outcome-blind expert eligibility and prior-C03-exposure handling.
- Fixed participant as the primary inferential unit.
- Fixed minimum included primary experts at `10`, planned primary blocks at `12`, minimum usable blocks at `10/12`.
- Established ethics/privacy/data-governance firewall before any scientific recruitment.
- No human scientific data were collected.

Stage 0 conclusion:

`PASS FOR STAGE 1 MACHINE/INSTRUMENT DEVELOPMENT — HUMAN DATA COLLECTION NOT AUTHORIZED`

## 2026-08-17 — Stage 1 prospective machine-stimulus contract

- Froze Stage ID `TMHV-S1-STIMULUS-2026-08-17-v1`.
- Froze 1,536 games / seeds `22100001..22101536` / six strata ×256 / first 8 plies seeded-uniform exact legal moves / max ply100 / no extension / no replacement.
- Froze Stage 1 spec SHA-256 `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`.
- Bound historical C03 by immutable candidate-definition hash and key.
- Defined `C03_TARGET`, `P_ONLY`, `M_ONLY`, and `MORPH_NEAR` before scientific corpus generation.
- Froze deterministic one-state-per-trajectory-per-class selection and no-reuse matching.
- Defined the three-position primary block: two C03 targets + one matched control.
- Implemented actor-to-South position-only rendering without column/direction reversal.

## 2026-08-17 — Stage 1 tooling validation / authorization

Implementation commit:

`03838e5d88329dd4b3c1f8e06598bbbc6d6a92cc`

GitHub Actions run `31955303204`, job `95184928361`: success.

Source-hash-bound generation authorization:

- authorization SHA-256 `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`
- authorization commit `12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`
- authorization-binding run `31955362114`, job `95185068008`: success
- machine stimulus generation authorized: true
- human data collection authorized: false

## 2026-08-17 — Local pre-generation validation

- User local environment checked out detached authorized commit `12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`.
- Worktree clean.
- Runtime Node `v24.6.0`, Git `2.43.0`, Linux x64.
- Stage 1 spec validator passed.
- Dedicated tooling tests passed.
- All authorization-bound source hashes matched.

## 2026-08-17 — Fixed 1,536-game machine corpus generated

Generation completed under the exact authorized clean source tree.

```text
games = 1536 / 1536
unique historical trajectories = 1453
distinct opening prefixes = 1278
six strata = 256 each
source tree dirty = false
```

Generation summary hash:

`6af30d6827e36a0c8a9ba0a4856b2e590da98bab0021111ba014655ffd85e581`

No extension, replacement, or selective regeneration occurred.

## 2026-08-17 — Independent full verification PASS

Independent verifier recomputed all fixed games.

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 1536
mismatchCount = 0
```

Verification identity hash:

`225e603e5fc60970901c89431a0155a83ffad2ed1de0ede83941cd2fc955c397`

## 2026-08-17 — Outcome-blind stimulus selection / readiness PASS

Class counts:

```text
C03_TARGET = 687
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

Matched counts:

```text
P_ONLY     = 277
M_ONLY     = 605
MORPH_NEAR = 672
```

All ten frozen readiness gates passed.

- selection outcome-blind: true
- human responses inspected: false
- replacement: false
- control reuse: false

Pool hash:

`6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

Stage 1 machine conclusion:

`MACHINE STIMULUS POOL READY`

## 2026-08-17 — Compact artifact identity audit PASS

Return bundle SHA-256:

`88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`

Artifact SHA-256 values were fixed for `manifest.json`, `verification.json`, `stimulus-pool-audit.json`, and `stimulus-pool.json`.

Independent audit checked all 1,554 stored target-control pairs:

```text
same historical trajectory violations = 0
same opening-prefix violations = 0
duplicate controls within family = 0
duplicate targets within family = 0
matching cost > 10 violations = 0
```

Participant-facing hidden-cue scan passed.

## 2026-08-17 — Prospective exact formal-stimulus freeze rule

Before exact identities were materialized, froze:

`TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

Rule fixed:

- 12 three-position primary blocks;
- four controls per primary control family;
- 24 unique primary C03 targets;
- global no-reuse of rule state, historical trajectory, and opening prefix across all 36 primary positions;
- six secondary C03 targets, one per generation stratum;
- total formal positions 42;
- no manual aesthetic replacement;
- no human-outcome-dependent reselection.

Deterministic freezer CI run `32040413639`, job `95418609369`: success.

## 2026-08-18 — Exact private formal-stimulus materialization PASS

Selection-spec SHA-256:

`67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5`

Private exact freeze SHA-256:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

Materialized set:

```text
primary blocks = 12
primary positions = 36
primary C03 targets = 24
primary controls = 12
control balance = 4 / 4 / 4
secondary move-choice C03 targets = 6
total unique formal positions = 42
```

All uniqueness and human-data-firewall checks passed.

Observed aggregate generation-condition counts were preserved exactly rather than post hoc rebalanced:

```text
LS-D2 = 10
LE-D2 = 10
B-D1  = 10
V2-D2 = 10
B-D2  = 1
B-D3  = 1
```

## 2026-08-18 — Independent-research access determination

The investigator specified that the study is being conducted without institutional affiliation and that there is currently no feasible route to contact qualified Bao experts, researchers, or competitive players for the frozen primary cohort.

This determination occurred before scientific recruitment was launched.

Observed access state:

```text
accessible eligible experts = 0
scientific recruitment started = false
persons contacted for scientific recruitment = 0
consented participants = 0
included primary experts = 0
formal human responses = 0
```

This is not recorded as a failed recruitment campaign.

## 2026-08-18 — Stage 2A estimability closure

Frozen minimum included primary experts remained `10`.

```text
required = 10
observed = 0
estimability gate = FAIL
```

No exact binomial test or human outcome analysis was run.

Final human-axis decision:

`INCONCLUSIVE-NOT-ESTIMABLE (N=0)`

Reason code:

`ZERO-ACCESSIBLE-ELIGIBLE-EXPERT-COHORT-PRECOLLECTION`

Zero participants are not negative human evidence.

## 2026-08-18 — Study 1 closure

Final evidence state:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

No institutional ethics approval or exemption is claimed. No scientific recruitment, consent execution, identifiable participant-data collection, or formal human response occurred.

No rescue was performed by lowering expert minimum, relaxing eligibility, substituting non-experts or AI, reselecting formal stimuli, or reinterpreting N=0 as a human negative result.

Study 1 conclusion:

`COMPLETE — MACHINE/INSTRUMENT STAGE COMPLETE / HUMAN AXIS INCONCLUSIVE-NOT-ESTIMABLE (N=0)`

Any future qualified-expert validation must be a new prospective study or an explicitly prospective versioned reopening before new human responses.
