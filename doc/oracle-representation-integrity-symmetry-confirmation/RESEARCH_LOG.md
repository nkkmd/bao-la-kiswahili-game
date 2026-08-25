# RESEARCH_LOG — ORISC-STUDY1

## 2026-08-25 — Study initialization

- Rechecked remote `main`; baseline fixed at `e8f0a3c360d9e7c9f7f6882fb212a32921040912`.
- Confirmed open PRs at study start: 0.
- Created `research/oracle-representation-integrity-symmetry-confirmation` from that `main`.
- Assigned new Study ID `ORISC-STUDY1`.
- Restored `REWR-STUDY1` and `SIP-STUDY1` as immutable upstream boundaries.
- Explicitly prohibited treating this work as SIP Stage 2, corrected v2, rescue, or retrospective candidate reanalysis.

The GitHub repository interface exposes remote state, not a local checkout worktree; no local uncommitted-worktree assertion was made.

## 2026-08-25 — Engine and representation semantics re-audited

Re-read current engine and exact-solver paths. Raw identity was re-derived as:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

with `turn` and textual `reason` excluded from the primary state key.

Confirmed current engine semantics:

```text
FRONT = 0
BACK = 1
HOUSE = 4
facing opponent front index = 7 - index
```

The terminal capture path transfers the removed captured amount into `pending[player]` before winner assignment when the capture empties the opponent front row.

## 2026-08-25 — Original REWR scientific artifact recovered

Recovered original scientific workflow artifact read-only:

```text
workflow run = 32702596730
artifact id = 9511074442
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
workflow head = 85c6a85fada301fcba526142549945e25a659855
```

The original production and independent files each contained eight rows, were row-for-row equal, and all raw rows represented 64 seeds.

For the three terminal keys known from SIP's read-only diagnostic, both original files contained `pending=[1,0]`; the later repository-facing `STAGE_1_EXACT_RESULT.json` contained `pending=[0,0]`.

The repository-facing result first appears in commit `eb6052679e94de62bacec0eebe13758c7e85638d`, whose parent is the scientific workflow head. No result-materialization implementation was introduced in that commit. The mechanism of the changed values was therefore left as `UNRESOLVED-PROVENANCE-GAP`, without attributing manual, serializer, or solver corruption.

## 2026-08-25 — Stage 0A technical audit completed

Dedicated production and independent serializers were implemented separately. Unlike earlier helper behavior, missing `pending` is rejected rather than silently defaulted.

Oracle-independent synthetic fixtures passed for:

- production / independent canonical serialization and state-key equality;
- `pending` participation in raw identity;
- `turn` / `reason` exclusion;
- missing-`pending` rejection;
- terminal capture transfer into `pending`;
- 64-seed conservation;
- no invented `pending` on non-capture front-empty termination;
- exact `houseChoice=stop/use` move identity separation.

Stage 0A CI:

```text
runId = 32751644956
jobId = 97509741453
artifactId = 9529232934
artifact ZIP SHA-256 = ceeeeb7190a17784708d8e20f7d7d5a71910add8417b1effb2c561864b5d41af
audit JSON SHA-256 = 290aec0eab51226695a1f4d0246cd40b5366a6ffa2ec107646f6cdb7b7fb1914
```

Stage 0A generated no formal Axis A decision.

## 2026-08-25 — Conditional Stage 2 design frozen before Axis A outcome

Rule semantics were used to derive a new ORISC candidate set before formal Stage 1 outcome generation:

```text
ORISC-C00-IDENTITY
ORISC-C01-LR-NO-DIRECTION-FLIP
ORISC-T01-SEAT-SWAP-LOCAL
ORISC-T02-LR-MTAJI-HOUSELESS
ORISC-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

Fresh conditional Stage 2 population was frozen as:

```text
seeds = 23110001..23110128
maximum trajectory ply = 160
roots per stratum = 12
local expansion depth = 4
strata = namua / mtaji / mtaji-houseless
```

Candidate contract SHA-256:

```text
6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
```

No ORISC Stage 1 outcome existed when these choices were frozen.

## 2026-08-25 — Stage 0B prefreeze completed

Two separate reconstruction tracks regenerated the frozen REWR witness root and complete raw graph without evaluating repository-row semantic gates.

Final workflow-bound prefreeze:

```text
stageId = ORISC-STAGE0B-PREFREEZE-2026-08-25-v2
runId = 32752858110
jobId = 97513606755
artifactId = 9529690660
artifact ZIP SHA-256 = 6305da6b61c1eaa296ca65696c51f81a0e2eb62072dc5aa1bae4e7c9555e06ec
result JSON SHA-256 = ce37364ad472903bc6449ff402b527e2a5a193a28f2196c3ec2b2ebc1756d581
```

Both tracks produced the exact frozen 8 states / 7 edges, identical state and transition hashes, and represented-seed totals `{64}`.

## 2026-08-25 — Pre-authorization formal-spec hardening

An initial frozen spec was validated but never authorized and generated no scientific outcome. Before authorization it was superseded solely to bind the already-defined formal GitHub Actions workflow by byte SHA-256.

No endpoint, population, identity field, gate, candidate, seed block, threshold, decision rule, or interpretation boundary changed.

```text
priorSpecSha256 = 7ebc1cfc5e7b6e503fb8351d7748002809a3cdf2cd4c38ad7b8fb235fdc1d2be
finalSpecSha256 = 5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
formal workflow SHA-256 = 0f5e5da13e84e9511a477a8fdfc01133e3a36cc08e908e16a31b71517e3b429f
```

Final source/spec validation passed before authorization:

```text
runId = 32752984778
artifactId = 9529734028
artifact ZIP SHA-256 = 38def67acb004b76cd014f3f419dee73022fb77812896520f824c2d9fc0cc50c
validation JSON SHA-256 = 059e0eef5ada46b89c1e0589fc5032d4503b7d4aaad894337a66d7cb4383881c
```

## 2026-08-25 — Stage 1 authorization issued

Axis-A-only authorization:

```text
authorizationId = ORISC-S1-REPRESENTATION-INTEGRITY-AUTH-2026-08-25-v1
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
```

Stage 2 execution and upstream oracle mutation were explicitly not authorized.

## 2026-08-25 — Formal Axis A executed

Canonical authorized workflow:

```text
runId = 32753073798
jobId = 97514309075
artifactId = 9529771157
artifact ZIP SHA-256 = 13844208eeaaa4ae8eedc35724a0d71ed043f982cfaaa48cf1d692133d74d6e8
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
```

Both implementations independently reconstructed the immutable raw 8-state / 7-edge graph, agreed on canonical serializers, preserved 64 represented seeds, reproduced terminal accounting, and produced zero repository transition-successor mismatches.

Formal gates:

```text
PASS = A-G1 A-G2 A-G3 A-G4 A-G5 A-G6 A-G7 A-G10 A-G12
FAIL = A-G8 A-G9 A-G11
```

Exactly three repository-facing terminal rows failed stored-row re-hash and raw-state binding. For all three, the only identity-field difference was `pending`; repository rows represented 63 seeds and reconstructed states represented 64.

Formal decision:

```text
ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
```

Because `A-G12=PASS`, this is an interpretable representation-integrity failure rather than an implementation disagreement or technical `NON-ESTIMABLE` result.

## 2026-08-25 — Axis B blocked by prospective authorization gate

The frozen conditional gate required Stage 1 `CONFIRMED`, IDENTITY PASS, production/independent equality PASS, and a separate Stage 2 authorization.

Stage 1 was `NOT-CONFIRMED` and IDENTITY failed repository reconstruction. Therefore:

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
nontrivial candidate formal decisions generated = 0
```

No candidate pass/fail label was created, no Stage 2 authorization was issued, and no Stage 2 seed block was consumed for scientific symmetry evidence.

## 2026-08-25 — Study closure

Canonical closure artifacts were created:

- `results/STAGE_1_FORMAL_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`

Final downstream contract:

```text
validated symmetry transformation set = []
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative
State Space / Game Tree Complexity may proceed = RAW-ONLY
```

`REWR-STUDY1` remains `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`; `SIP-STUDY1` remains closed at 0 validated / 0 rejected / 5 `NON-ESTIMABLE`.

No further scientific outcome generation is authorized within `ORISC-STUDY1`. Repository closure documentation may be updated on the study branch, but `main` integration is deferred until explicit instruction.

## 2026-08-25 — Post-closure workflow audit and execution lock

During the final document-consistency audit, a workflow-orchestration issue was detected: the historical formal workflow still had a `pull_request.paths` trigger. Because the authorization file was already part of PR #48's changed-file set, a later documentation-only PR synchronization automatically triggered the consumed formal workflow again.

Post-closure duplicate:

```text
runId = 32797248144
jobId = 97650964412
artifactId = 9545248579
artifact ZIP SHA-256 = 1b339c75af3ee7a514a04c51902934c8b0930d792cfcc19f8c320cae181053e0
classification = POST-CLOSURE-AUTOMATIC-DUPLICATE / NON-CANONICAL / NO-NEW-SCIENTIFIC-EVIDENCE
```

The duplicate reproduced the exact same frozen contract, decision and result identities:

```text
specSha256 = 5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
formalDecision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
A-G12 = PASS
IDENTITY = FAIL
Stage 2 authorization = false
```

It was therefore classified as a non-canonical execution duplicate, not a new replication, additional evidence, or reopened scientific run. The canonical evidence remains run `32753073798` / artifact `9529771157` only.

To prevent any further scientific generation inside the closed Study, the four ORISC workflows were changed to archival stubs:

```text
Stage 0A workflow archival commit = cfb292af840818e5767149969a86772c2e567eac
Stage 0B workflow archival commit = 0caf5b791d2bf08622d992dd2a11fff6248ec47e
Stage 1 spec-freeze archival commit = b626d60c4cc2a71ad4c8c7572328ee862b0f76c7
Stage 1 formal workflow archival commit = 8f6ecf623abd733bc7d5333f124b8923d4456141
```

The archival stubs have no automatic push/pull-request trigger and execute no scientific ORISC tooling. The historical executable workflow used for the canonical result remains preserved in Git history and is bound by its pre-outcome SHA-256 in the final formal spec. This post-closure lock changes no formal result or scientific input retroactively.

`main` remains untouched; PR #48 remains the integration boundary pending explicit user instruction.