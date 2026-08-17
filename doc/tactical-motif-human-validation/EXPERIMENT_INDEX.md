# EXPERIMENT_INDEX — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-18

## Final study status

**COMPLETE — HUMAN AXIS `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**

Historical `TM-S2-C03 = CONFIRMED` remains unchanged.

## Stage 0 — repository / construct / feasibility audit

Stage ID: `TMHV-S0-DESIGN-2026-08-16-v1`

### TMHV-S0-A01 — Repository source-of-truth restoration

- Status: **COMPLETE / PASS**
- baseline `main`: `3cc40d83917660dd815c785ff0e0c754666d9a0e`
- human data: none

### TMHV-S0-A02 — C03 identity / immutable boundary audit

- Status: **COMPLETE / PASS**
- historical decision: `TM-S2-C03 = CONFIRMED`
- human/expert/traditional claim inherited: `false`

### TMHV-S0-A03 — Construct / statistics / ethics design

- Status: **COMPLETE**
- primary construct: blinded cross-position principle discrimination
- inferential unit: participant
- minimum primary experts: `10`
- planned primary blocks: `12`
- human data collection: not started

## Stage 1 — prospective machine stimulus / instrument development

Stage ID: `TMHV-S1-STIMULUS-2026-08-17-v1`

### TMHV-S1-A00 — Machine stimulus contract freeze

- Status: **FROZEN / VALIDATED**
- games: `1536`
- seeds: `22100001..22101536`
- six strata × `256`
- spec SHA-256: `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`

### TMHV-S1-A01 — Tooling validation

- Status: **COMPLETE / PASS**
- implementation commit: `03838e5d88329dd4b3c1f8e06598bbbc6d6a92cc`
- CI run: `31955303204`
- CI job: `95184928361`

### TMHV-S1-A02 — Source-hash-bound generation authorization

- Status: **COMPLETE / PASS**
- authorization SHA-256: `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`
- authorization commit: `12b02975f0c0e7ad053eef6db8b6a2d2c7392d70`
- human data collection authorized: `false`

### TMHV-S1-E01 — Fresh corpus generation

- Status: **COMPLETE / PASS**
- games generated: `1536 / 1536`
- unique historical trajectories: `1453`
- distinct opening prefixes: `1278`
- generation summary hash: `6af30d6827e36a0c8a9ba0a4856b2e590da98bab0021111ba014655ffd85e581`

### TMHV-S1-E02 — Independent full verification

- Status: **COMPLETE / PASS**
- full recomputation: `true`
- games verified: `1536`
- mismatch count: `0`
- verification identity hash: `225e603e5fc60970901c89431a0155a83ffad2ed1de0ede83941cd2fc955c397`

### TMHV-S1-E03 — Target/control pool and matching

- Status: **COMPLETE / PASS**

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

- all readiness gates: `true`
- replacement: `false`
- control reuse: `false`
- pool hash: `6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

### TMHV-S1-E04 — Compact artifact audit

- Status: **COMPLETE / PASS**
- audit ID: `TMHV-S1-ARTIFACT-AUDIT-2026-08-17-v1`
- bundle SHA-256: `88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`
- stored target-control matches checked: `1554`
- same-trajectory violations: `0`
- same-opening-prefix violations: `0`
- matching-cost violations above frozen max: `0`

### TMHV-S1-A03 — Exact formal-stimulus freeze rule

- Status: **FROZEN / TOOLING VALIDATED**
- freeze ID: `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`
- selection-spec SHA-256: `67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5`
- deterministic freezer CI run: `32040413639`
- CI job: `95418609369`

### TMHV-S1-E05 — Exact private formal-stimulus materialization

- Status: **COMPLETE / PASS**
- primary blocks: `12`
- primary positions: `36`
- primary C03 targets: `24`
- primary controls: `12`
- control balance: `4 / 4 / 4`
- secondary move-choice C03 targets: `6`
- total unique formal positions: `42`
- unique rule states: `true`
- unique historical trajectories: `true`
- unique opening prefixes: `true`
- private freeze SHA-256: `2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

## Stage 2A — recruitment feasibility closure

Stage ID: `TMHV-S2A-RECRUITMENT-FEASIBILITY-2026-08-18-v1`

### TMHV-S2A-E01 — Independent-research access determination

- Status: **COMPLETE / CLOSED BEFORE SCIENTIFIC RECRUITMENT**
- study mode: independent research without institutional affiliation
- accessible eligible experts at decision point: `0`
- scientific recruitment started: `false`
- persons contacted for scientific recruitment: `0`
- consented participants: `0`
- formal responses: `0`

This is not recorded as a failed recruitment campaign.

### TMHV-S2A-E02 — Estimability gate

```text
required included primary experts = 10
observed included primary experts = 0
```

- gate: **FAIL / NOT ESTIMABLE**
- expert criteria relaxed: `false`
- minimum sample lowered: `false`

### TMHV-S2A-E03 — Human-axis final decision

- Status: **COMPLETE**
- formal human inference performed: `false`
- exact binomial test performed: `false`
- final label: **`INCONCLUSIVE-NOT-ESTIMABLE`**
- N: `0`
- reason code: `ZERO-ACCESSIBLE-ELIGIBLE-EXPERT-COHORT-PRECOLLECTION`

No human p-value or effect estimate exists.

## Final study state

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

Study 1 is complete. Future expert validation must be a new prospective study or an explicitly prospective versioned reopening before any new human response.
