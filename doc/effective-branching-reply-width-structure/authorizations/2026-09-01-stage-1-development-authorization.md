# EBRWS-STUDY1 — Stage 1 Development Authorization

Date: 2026-09-01

## Authorization

`EBRWS-S1-DEVELOPMENT-2026-09-01-v1` is:

`AUTHORIZED`

This authorization permits exactly one prospective fresh-development execution under the frozen `EBRWS-STUDY1` protocol.

## Frozen contract anchors

- Study protocol blob SHA: `cc367fe5315d1553f75cf3b95e629184070f05ac`
- machine-readable preregistration blob SHA: `bdf7d35bcf8554e5a29bd5f2e92b27bb7edc8498`
- Study baseline remote `main`: `ca6a1e4a9b41d79d873fa71385972e402ffa5197`
- research branch: `research/g3-02-effective-branching-reply-width-structure`
- authoritative state identity: RAW-only `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- relative local horizon: depth 5

## Preconditions confirmed

- post-LGTGMIV G3-02 authorization review = `AUTHORIZED`
- protocol / preregistration = prospectively frozen before scientific outcome
- Stage 0 = `EBRWS-S0-TECHNICAL-2026-09-01-v1 / STAGE0-PASS`
- Stage 0 production / independent scientific core exact match = `ad4ebd825b7fd63cd7b202686feff9155974d127f5e8e98ad4f2092ae42370fd`
- central current-facing documentation synchronization = complete
- Stage 1 seed `31210001..31210192` consumed = false
- Stage 2 seed `31220001..31220288` consumed = false
- G3-02 fresh scientific evidence generated/read = false
- protected depth-10 exact holdout = `SEALED / NOT GENERATED / NOT READ`

## Authorized Stage 1 population

```text
seed block = 31210001..31210192
target roots = 12 Namua + 12 Mtaji
relative depth = 5
evidence class = FRESH-DEVELOPMENT
source policy = deterministic Mulberry32 / canonical move ordering
Namua candidate = exact ply 24 nonterminal namua
Mtaji candidate = first nonterminal mtaji at ply >= 44
max source ply = 240
```

Selection is geometry-blind and outcome-blind. Fixed upstream identity firewall exclusions apply before phase-wise source-seed-ascending first-N selection.

No seed extension beyond `31210192` is authorized.

## Authorized scientific endpoints

Only the frozen primary systems may generate formal Stage 1 candidates:

1. `TREE-WIDTH-SHAPE`
2. `REPLY-WIDTH-SHAPE`

A construct / phase / class candidate promotes only if:

`3 * classCount >= 2 * eligibleRootCount`

Stage 1 target phase count is 12, so promotion requires at least 8/12 roots in the same frozen class.

Secondary endpoints remain descriptive and cannot rescue a failed primary promotion gate.

## Independence requirement

Production and independent implementations must separately compute the G3-02 derived endpoint/class/candidate logic. Sharing the authoritative Bao rule engine contract is allowed; sharing G3-02 derived-metric, class, promotion, or canonical-hash helpers is prohibited.

Exact production / independent agreement is mandatory for selected-root identities, endpoint objects, class counts, and promoted candidate set.

## No-rescue boundary activation

The no-rescue boundary becomes active at the earlier of:

- first Stage 1 fresh scientific evidence generation, or
- first Stage 1 fresh scientific evidence read.

After that point, the same evidence cannot be rescued by changing threshold, endpoint, family usage, phase subset, root selection, seed range, horizon, class rule, resource ceiling, or candidate identity.

## Protected evidence

The standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

This authorization does not permit any depth-10 complete enumeration or inspection and does not use G2-12 as depth-10 truth.

## Stage 2 boundary

Stage 2 remains:

`NOT-AUTHORIZED-NOT-EXECUTED`

Stage 1 completion does not automatically authorize Stage 2. If and only if Stage 1 global gates PASS and the frozen promoted primary candidate set is non-empty, a separate Stage 2 authorization decision may be considered.
