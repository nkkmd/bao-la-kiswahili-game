# EBRWS-STUDY1 — Current Status

Updated: 2026-09-02

```text
Program = Research Generation 3
Agenda position = G3-02
Study ID = EBRWS-STUDY1
Study status = CLOSED / TECHNICAL-INVALID
Authorization review = AUTHORIZED
Study protocol = FROZEN / unchanged after fresh evidence
Stage 0 = EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS
Stage 1 = EBRWS-S1-DEVELOPMENT-2026-09-01-v1 / TECHNICAL-INVALID
Stage 2 = EBRWS-S2-FORMAL-2026-09-01-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Formal promoted candidate set = []
Stage 1 seed consumed = 31210001..31210192
Stage 2 seed consumed = false
No-rescue boundary = CROSSED / ACTIVE
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Authoritative identity = RAW-only
Validated transform set = []
Research branch = research/g3-02-effective-branching-reply-width-structure
Study baseline remote main = ca6a1e4a9b41d79d873fa71385972e402ffa5197
```

## Upstream immutable state

- Research Generation 2 = CLOSED
- G3-01 `LGTGMF-STUDY1` = `CLOSED / TECHNICAL-INVALID`
- G3-01 formal eligible families = `[]`
- G3-01 Stage 2 = `NOT-AUTHORIZED-NOT-EXECUTED`
- `LGTGMIV-STUDY1` = `CLOSED / FORMAL-ELIGIBLE-ALL`
- LGTGMIV eligible families = F1..F5 exactly

G3-02 does not alter or rescue G3-01 and does not re-run or re-decide LGTGMIV.

## Stage 0

Formal disposition:

`STAGE0-PASS`

Production / independent stage scientific core:

`ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`

Stage 0 used synthetic primitive fixtures only and consumed no fresh scientific seed.

## Stage 1 one-shot execution

Authorized fresh block:

```text
seed = 31210001..31210192
target = 12 Namua + 12 Mtaji
relative depth = 5
evidence class = FRESH-DEVELOPMENT
```

GitHub Actions run `33569323221`, job `100059596453`, completed the frozen scientific runner. The runner-local computation reported:

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
production / independent stage scientific core =
4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 =
4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
```

Runner-local diagnostic candidates:

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12

These are **diagnostic provenance only**, not formal promoted candidates.

## Technical-invalid trigger

After the scientific files were generated, the workflow created local commit `709bc393` containing:

- `scientific-result.json`
- `telemetry.json`
- `execution-summary.json`

The subsequent push was rejected non-fast-forward because the remote research branch had advanced during the one-shot execution. The ephemeral local commit is not present in GitHub after runner teardown and cannot be recovered.

Logged file commitments:

```text
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

The no-rescue boundary had already been crossed by fresh evidence generation/read. Stage 1 was authorized for exactly one execution, so the same evidence is not re-run merely to reconstruct missing repository artifacts.

The frozen protocol requires no technical-integrity violation and an immutable promoted-candidate artifact before Stage 2 authorization. Those conditions cannot be satisfied from the unrecoverable runner-local canonical files. Therefore the formal fail-closed Stage 1 and Study disposition is:

`TECHNICAL-INVALID`

Formal promoted candidate set remains `[]`.

## Stage 2

Stage 2 is permanently unexecuted for this Study closure:

`NOT-AUTHORIZED-NOT-EXECUTED`

The runner-local diagnostic candidates do not authorize Stage 2 and must not be rescued into formal promotion.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

G3-02 did not generate or inspect it and did not use G2-12 as depth-10 truth.

## Canonical closure records

- `STUDY_1_PROTOCOL.md` — immutable prospective protocol
- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json` — formal Stage 1/Study disposition
- `checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md` — incident and fail-closed rationale
- `DECISION_REGISTER.md` — formal decisions
- `STUDY_1_FINAL_REPORT.md` — integrated scientific/technical closure

No same-evidence repair, rerun, threshold change, endpoint change, seed extension, or favorable subgroup rescue is authorized.
