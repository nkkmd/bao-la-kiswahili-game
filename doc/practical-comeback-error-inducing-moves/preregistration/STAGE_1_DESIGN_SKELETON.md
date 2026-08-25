# PCEM-STUDY1 — Stage 1 Exploratory Design

Status: **PROSPECTIVELY FROZEN / NOT YET AUTHORIZED**  
Canonical machine-readable spec: `STAGE_1_EXPLORATORY_SPEC.json`

Stage 1 remains blocked until the scientific implementation, independent verifier and authorization record are hash-bound to the exact spec. Nothing in this document authorizes generation by itself.

## Scientific role

```text
stageLabel = EXPLORATORY-ONLY
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
```

Stage 1 may discover and promote candidates but cannot confirm them. `promotedCandidateCount = 0` is explicitly valid.

## Fresh source population

```text
games = 3072
seeds = 23200001..23203072
opening = 8-ply seeded-uniform exact legal moves
max game ply = 100
generation strata = 6, game-index modulo assignment
Stage 2 reserved seeds = 23300001..23306144
```

The six source-generation strata reuse tested trajectory-generation infrastructure rather than any CPOB candidate definition:

```text
B-D1
B-D2
B-D3
LS-D2
V2-D2
LE-D2
```

This reuse is infrastructure-level only. PCEM does not reopen the CPOB high-divergence endpoint, structural grammar or promotion result.

## Root disadvantage — frozen rule

A source trajectory is first collapsed by exact historical trajectory identity and assigned to Namua or Mtaji by frozen SHA-256 parity.

Within the assigned phase, exactly one base-eligible state is selected by an outcome-independent hash rank **before its reference disadvantage is inspected**.

Base eligibility:

```text
RAW representation valid
pending present
64 represented seeds
nonterminal
ply >= 8
exact legal root moves >= 2
phase = assigned phase
```

Only then is the frozen reference test applied:

```text
reference search = pcem-exact-full-window-root-candidates/bao/q0/v1
reference depth = D3
root actor = state.player
reference disadvantaged iff D3 bestScore < 0
```

If the preselected state fails that rule, that trajectory gets no second state. The study does not search within a trajectory for the most negative or most favorable root.

The rule does not use the Calibration Study isotonic mapping, empirical continuation outcomes, a game-theoretic oracle or human judgment.

Phase quotas after RAW-state deduplication:

```text
Namua = 150
Mtaji = 150
total = 300
```

No phase reassignment, replacement or seed extension is allowed after a readiness failure.

## Reference move quality

All exact legal root moves receive a D3 reference table under the same search semantics.

```text
best set = all moves tied at maximum D3 score
canonical best = lexicographically smallest exact moveKey in best set
moveOptimalityGap = bestScore - moveScore
strictReferenceInferior = moveOptimalityGap > 0
```

The central practical-alternative analysis requires a strictly reference-inferior move. Therefore a positive PCEM result cannot arise merely because the ordinary D3 best move also wins often against an imperfect policy.

D3 is a frozen machine reference, not ground truth.

## Reply structure and machine-operational defense

For each exact root move, enumerate every exact opponent first reply.

Three reply concepts remain distinct:

```text
unique legal reply
unique D2 reference-best reply
unique reference-defense-maintained reply
```

`referenceDefenseMaintained` is frozen as follows after applying an exact opponent first reply:

```text
terminal root-actor loss -> true
terminal root-actor win  -> false
otherwise                -> root-actor-to-move D2 bestScore < 0
```

Thus the condition means only that the opponent reply maintains the root actor's negative machine-reference status under the frozen D2 check. It is not a game-theoretic defense and not a humanly difficult defense.

A `referenceMostPunishingReply` is a reply minimizing the root actor's post-reply D2 best score. Ties are retained.

## Opponent policy separation

Root actor continuation policy is frozen as:

```text
P_REFERENCE_D2_BEST
```

Opponent conditions:

```text
primary imperfect = P_MEDIUM_D1_TOP3, 12 replicates per exact root move
secondary shallow = P_SHALLOW_UNIFORM, 4 replicates per exact root move
reference          = P_REFERENCE_D2_BEST, 1 deterministic trajectory per exact root move
```

Only the primary imperfect condition may drive candidate promotion. The shallow and reference conditions are sensitivity/robustness descriptors and may not be selected post-outcome as alternate primaries.

## Bounded practical comeback endpoint

Primary bounded endpoint:

```text
H = 96 post-root plies
boundedComeback96 = 1 iff root actor reaches terminal win within H
```

Terminal loss and administrative horizon exhaustion both yield `boundedComeback96 = 0`, because the endpoint is specifically **win within H**, not eventual game outcome. They remain separate outcome categories in the raw measurement record.

Administrative exhaustion is not relabeled as a draw or a terminal loss.

Primary move-level quantity:

```text
p96_medium(root, move)
  = mean boundedComeback96 over the 12 P_MEDIUM_D1_TOP3 replicates
```

Root-paired practical difference:

```text
DeltaComeback96
  = p96_medium(candidate alternative)
    - p96_medium(canonical D3 best move)
```

This is not a true Bao win-probability difference.

## First-reply reference error

The primary imperfect opponent selects uniformly from its D1-ranked top-3 pool, truncated when fewer replies exist.

If at least one `referenceDefenseMaintained` reply exists:

```text
firstReplyReferenceError = selected first reply not in referenceDefenseMaintained set
```

The exact policy-level error opportunity is:

```text
1 - |primary first-reply pool intersect defense-maintained set|
    / |primary first-reply pool|
```

If no reference-defense-maintained reply exists, the error concept is undefined rather than declaring every legal reply an error.

This is a machine-reference error label only; it does not mean human mistake.

## Move analysis eligibility

A move can enter PCEM candidate discovery only when all hold:

```text
strictReferenceInferior = true
referenceDefenseMaintainedCount >= 1
referenceDefenseMaintainedFraction <= 0.5
exact first-reply reference-error probability is finite
```

Thus the study asks whether an objectively inferior-under-reference alternative can outperform the canonical reference best against the frozen imperfect opponent **while real machine-reference defense exists but is narrow**.

## Candidate representation universe

The matcher cannot inspect continuation outcomes, `DeltaComeback96`, or reference score magnitudes.

Frozen feature families:

```text
phase
moveType
legalReplyCountBin
referenceDefenseMaintainedFractionBin
firstReplyReferenceErrorProbabilityBin
actorReserveBin
actorHouseOwned
actorReusablePitsBin
actorFrontOccupiedBin
```

Frozen templates are `PCEM-T1` through `PCEM-T8` in the JSON spec. Each template has at most four tokens including phase.

This is a new move/reply-centered PCEM representation. It is not an expansion of the CPOB pre-root one-to-two-token grammar.

When several eligible matched moves occur at one root, the representative is the lexicographically smallest exact moveKey. No within-root outcome maximization is permitted.

## Promotion gates

A candidate must satisfy all frozen support/diversity gates:

```text
unique roots >= 24
unique historical trajectories >= 24
distinct opening prefixes >= 12
generation strata >= 4
maximum single-stratum share <= 0.50
maximum single-opening-prefix share <= 0.25
```

Practical-comeback gates:

```text
median DeltaComeback96 >= 0.25
proportion roots with DeltaComeback96 >= 0.25 >= 0.60
```

Reply/error gates:

```text
median exact first-reply reference-error probability >= 0.50
median reference-defense-maintained fraction <= 0.50
error-conditioned primary replicates >= 24
defense-conditioned primary replicates >= 24
unique roots contributing error condition >= 12
unique roots contributing defense condition >= 12
pooled boundedComeback96(error) - boundedComeback96(defense) >= 0.20
```

These are exploratory promotion floors, not formal Stage 2 confirmation thresholds.

Support-equivalent patterns are collapsed by exact root set plus deterministic representative move mapping. At most four candidates may be promoted by the frozen ranking rule. Manual promotion is forbidden.

## Readiness and resources

Before candidate discovery, Stage 1 must satisfy the frozen selection/readiness gates in the JSON spec, including:

```text
unique historical trajectories >= 2500
generated opening prefixes >= 2000
selected unique raw roots = 300
Namua / Mtaji = 150 / 150
selected distinct opening prefixes >= 250
minimum selected per generation stratum >= 20
maximum selected single-stratum share <= 0.30
exact root-move interventions <= 2500
```

Resource caps:

```text
source games <= 3072
selected roots <= 300
exact root-move interventions <= 2500
planned continuation rows <= 42500
post-root horizon <= 96
wall clock per workflow job <= 18000 s
RSS <= 2048 MiB
uncompressed artifact <= 2 GiB
```

Resource exhaustion yields `RESOURCE-CENSORED`; partial candidate promotion is forbidden.

## Fresh-evidence firewall

Stage 1 rows cannot be formal Stage 2 evidence. Stage 2 must have zero overlap with Stage 1 on:

```text
seed block
historicalTrajectoryHash
openingPrefixHash
RAW state key
```

No overlap replacement is allowed. Upstream-study overlap is audited when the corresponding identity inventories are accessible; unavailable upstream inventories must be reported as unavailable rather than silently claiming zero overlap.

## Stage 1 result vocabulary

Possible execution-state labels are:

```text
EXPLORATORY-ONLY
NON-ESTIMABLE
RESOURCE-CENSORED
TECHNICALLY-INVALID
```

If:

```text
promotedCandidateCount = 0
```

then:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No threshold relaxation, opponent-strength switching, phase-only rescue, grammar expansion, manual candidate promotion, seed extension or replacement is permitted after Stage 1 outcomes are inspected.
