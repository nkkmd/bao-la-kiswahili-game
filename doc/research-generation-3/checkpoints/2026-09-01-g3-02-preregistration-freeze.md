# Checkpoint — G3-02 preregistration freeze

Date: 2026-09-01

## State

`EBRWS-STUDY1` has completed prospective Study-definition / preregistration freeze after the separate post-LGTGMIV authorization review returned `AUTHORIZED`.

```text
Study ID = EBRWS-STUDY1
Program position = G3-02
Baseline remote main = ca6a1e4a9b41d79d873fa71385972e402ffa5197
Research branch = research/g3-02-effective-branching-reply-width-structure
Protocol = FROZEN
Preregistration = FROZEN
Relative depth = 5
RAW identity = authoritative
Validated transform set = []
Fresh scientific evidence generated = false
Fresh scientific evidence read = false
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen stages

- `EBRWS-S0-TECHNICAL-2026-09-01-v1`
- `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`
- `EBRWS-S2-FORMAL-2026-09-01-v1`

Stage 1 seed: `31210001..31210192`; target 12 Namua + 12 Mtaji.

Stage 2 seed: `31220001..31220288`; target 18 Namua + 18 Mtaji.

Neither scientific seed block has been consumed.

## Primary endpoint freeze

Primary systems:

- `TREE-WIDTH-SHAPE`
- `REPLY-WIDTH-SHAPE`

Candidate / confirmation prevalence gate:

`3 * classCount >= 2 * eligibleRootCount`

Stage 2 can test only candidate identities promoted and frozen after Stage 1.

## Next permitted action

Stage 0 technical-only validation may be separately authorized. It must use synthetic primitive fixtures only and may not generate/read any G3-02 fresh source trajectory or root.
