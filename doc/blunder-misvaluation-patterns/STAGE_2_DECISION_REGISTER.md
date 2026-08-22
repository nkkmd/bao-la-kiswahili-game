# Stage 2 Decision Register — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-22  
Status: **FROZEN PRE-AUTHORIZATION DESIGN DECISIONS**

This register records Stage 2-specific prospective decisions. It supplements the Study-level `DECISION_REGISTER.md` and does not modify any Stage 1 decision.

## BMP-S2-D001 — One-to-one candidate freeze

**Decision:** Formal candidates are exact one-to-one mappings from the four Stage 1 promoted exploratory candidates.

```text
BMP-S1-C01 -> BMP-S2-C01
BMP-S1-C02 -> BMP-S2-C02
BMP-S1-C03 -> BMP-S2-C03
BMP-S1-C04 -> BMP-S2-C04
```

No merge, split, rename, broadening, narrowing, paired substitution, or post-outcome replacement is allowed.

Status: **FROZEN**

## BMP-S2-D002 — Shared Namua denominator

**Decision:** C01/C02/C03 share exactly one Stage 2 Namua support group, selected root set, and deterministic candidate move. They differ only in failure token.

This prevents candidate-specific outcome-dependent denominator construction.

Status: **FROZEN**

## BMP-S2-D003 — Full reserved fresh seed block

```text
games = 4096
seeds = 22500001..22504096
```

**Decision:** Use the complete previously reserved Stage 2 block. No unused in-study extension capacity remains.

Status: **FROZEN**

## BMP-S2-D004 — Six generation strata retained

**Decision:** Use the same six deterministic generation conditions as Stage 1, assigned by zero-based game index modulo 6:

```text
B-D1 683
B-D2 683
B-D3 683
LS-D2 683
V2-D2 682
LE-D2 682
```

These diversify generated trajectories; formal measurement itself is standardized to `bao / D3 / Q1 / root actor`.

Status: **FROZEN**

## BMP-S2-D005 — Three-axis Stage 1 identity firewall

**Decision:** Stage 2 confirmation evidence must end with zero overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

Trajectory/opening overlap drops a trajectory before root selection. Rule-state overlap is checked after outcome-blind root selection; the selected root/trajectory is dropped with no alternate root.

No replacement or seed extension.

Status: **FROZEN**

## BMP-S2-D006 — Outcome-blind support-group root selection

**Decision:** Root eligibility uses only frozen phase, structural preconditions, nonterminal status, minimum ply/legal-move count, and existence of a move matching the frozen move abstraction.

It cannot use failure token, D1/D2/D3 value, D3-inferior status, TopSet, normalized rank loss, reply outcome, or game outcome.

Within each eligible trajectory, select deterministic minimum SHA-256 rank under the support-group salt.

Status: **FROZEN**

## BMP-S2-D007 — Deterministic candidate move

**Decision:** At a selected root, the formal candidate move is the lexicographically smallest exact `AI.moveKey` among legal moves matching the frozen move abstraction. All legal root moves are measured for the D3 table.

Status: **FROZEN**

## BMP-S2-D008 — Formal machine reference

```text
evaluation = bao
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
primary depth = D3
quiescence depth = 1
perspective = root actor
```

Stage 1 D3-inferior, TopSet, mate-domain and normalized-rank-loss semantics are unchanged.

Status: **FROZEN**

## BMP-S2-D009 — Estimability / transferability gates

Per formal candidate:

```text
unique historical trajectories >= 96
unique rule states >= 96
distinct opening prefixes >= 48
maximum one opening-prefix share <= 0.10
generation strata >= 4
maximum one generation-stratum share <= 0.50
```

Failure -> `INCONCLUSIVE-NOT-ESTIMABLE`; no extension or rescue.

Status: **FROZEN**

## BMP-S2-D010 — Two co-primary recurrence endpoints

Per candidate:

```text
P1 frozen failure-signature recurrence
P2 D3-inferior-v1 recurrence
```

Each uses exact one-sided binomial `H0: p <= 0.50`.

Absolute confirmation floors:

```text
failure-signature rate >= 0.65
D3-inferior rate >= 0.70
```

Status: **FROZEN**

## BMP-S2-D011 — Eight-test Holm family

**Decision:** The formal multiplicity family contains exactly `4 candidates x 2 endpoints = 8` tests. FWER = 0.05 with Holm-Bonferroni.

A non-estimable/technical candidate contributes `p=1.0` for its planned endpoints rather than shrinking the family.

Status: **FROZEN**

## BMP-S2-D012 — Additional consistency gates

A candidate cannot be confirmed unless:

```text
D3 TopSet rate <= 0.20
median normalized rank loss >= 0.50
```

These are inherited from Stage 1 promotion criteria and are not Stage 2-retuned.

Status: **FROZEN**

## BMP-S2-D013 — Candidate decision labels

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

Status: **FROZEN**

## BMP-S2-D014 — Independent two-layer verification

Execution order:

```text
generate
-> independent full replay + generation-search verification
-> support-group select
-> formal measure
-> independent formal measurement verification
-> formal evaluate
```

Formal evaluation is blocked unless independent formal measurement verification reproduces the exact D3 candidate tables, candidate/failure classification, measurement hash, and Stage 1 identity firewall.

Status: **FROZEN**

## BMP-S2-D015 — Stage 2 failure-token scope

**Decision:** Formal measurement directly recomputes only the four frozen Stage 2 failure tokens. It does not recompute unused Stage 1 D1/D2/static failure families merely to support Stage 2.

This does not change the frozen semantics of the four candidate tokens.

Status: **FROZEN**

## BMP-S2-D016 — No rescue

After scientific generation begins, forbid:

```text
seed extension
replacement sampling
identity-overlap replacement
alternate root after rule-state overlap
candidate edit/merge/split/rename
matcher retuning
failure-token substitution
phase reassignment
endpoint substitution
null/floor retuning
multiplicity/alpha changes
post-outcome primary depth/evaluator selection
favorable subgroup promotion
manual override
```

Status: **FROZEN**

## BMP-S2-D017 — Interpretation boundary

Even `CONFIRMED` means only fresh-data recurrence of the exact frozen machine pattern under the frozen Bao engine/search/population.

It does not establish game-theoretic blunder status, human misconception, expert/traditional recognition, pedagogical importance, causal mechanism, or external validity.

Status: **FROZEN**

## BMP-S2-D018 — Authorization firewall

**Decision:** Candidate/spec freeze and tooling materialization do not authorize scientific generation.

Generation requires validator/test PASS, clean source tree, exact scientific source-file SHA-256 freeze, and a separate source-bound `STAGE_2_FORMAL_AUTHORIZATION.json` commit.

Status: **FROZEN**
