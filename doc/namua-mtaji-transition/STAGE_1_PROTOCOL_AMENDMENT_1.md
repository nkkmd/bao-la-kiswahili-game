# Stage 1 Protocol Amendment 1 — Deterministic Namua Clock

Date: 2026-08-11  
Status: **PRE-GENERATION AMENDMENT / SUPERSEDES SURVIVAL INTERPRETATION**  
Study: `namua-mtaji-temporal-transition`

## 1. Reason for amendment

After Stage 0 technical artifacts were reviewed, the engine semantics were re-audited before any Stage 1 game generation.

The following rule facts are fixed in `public/engine.js`:

```text
initial reserve = [22, 22]
initial player = 0
phase = namua
```

For every non-pass Namua move:

```text
state.reserve[currentPlayer] -= 1
```

At normal turn completion:

```text
state.player = 1 - state.player
```

and when both reserves are zero:

```text
namua -> mtaji
```

Because both players begin with exactly 22 reserve seeds and turns alternate, a game that survives Namua without earlier termination uses exactly 44 Namua plies before the formal phase transition.

Therefore:

```text
first Mtaji observation ply = 44
```

for every trajectory that reaches Mtaji under the current engine from the standard initial state.

Stage 0 technical smoke independently exhibited this invariant in all 8/8 games.

## 2. Consequence for the originally proposed endpoint

The originally preferred endpoint family:

```text
time-to-first-Mtaji
```

is not a non-degenerate survival-time outcome under this engine.

For a Namua candidate at ply `t` in a trajectory that reaches Mtaji:

```text
candidate-to-first-Mtaji distance = 44 - t
```

and total reserve at that state is mechanically tied to the same clock.

Thus a class difference in raw `time-to-first-Mtaji` would primarily be a difference in **where the candidate occurs on the fixed Namua progression clock**, not evidence that a strategic phenotype accelerates or delays the formal Namua→Mtaji transition.

A Cox/Kaplan-Meier/competing-risk analysis of first-Mtaji timing is therefore not an appropriate primary model for the standard engine population.

Early natural termination before ply 44 remains a distinct competing absorbing outcome, but among trajectories that reach Mtaji the event time itself is fixed.

## 3. Revised temporal interpretation

Stage 1 must now separate three questions that were previously conflated.

### 3.1 Temporal localization

Where on the fixed Namua progression clock do inherited candidate classes occur?

Equivalent deterministic coordinates include:

```text
candidate ply
remaining total reserve
44 - candidatePly
```

These are not independent variables and must not be treated as separate evidence.

### 3.2 Post-ascertainment structural carry-through

After the phenotype is fully ascertained at:

```text
candidatePly + 8
```

what board-state / legal-move / forced-capture structure persists or changes on the remaining path to the fixed boundary at ply 44?

This is a substantive temporal-structure question and survives the deterministic-clock finding.

### 3.3 First Mtaji morphology

Does a trajectory containing a progression-matched `capture-branch-expansion` reach a different frozen first-Mtaji morphology (`MTAJI-M1 / MTAJI-M2`) than an appropriate progression-matched comparator?

This becomes a stronger candidate for the later primary formal bridge because the Mtaji **state morphology** is not mechanically fixed by the transition ply.

No formal primary endpoint is frozen by this amendment; Stage 1 remains exploratory.

## 4. Additional classifier implication

The frozen phenotype classifier gives precedence to `namua-to-mtaji-precursor` when first Mtaji lies within 8 ply.

Since first Mtaji is fixed at ply 44 for surviving trajectories:

```text
candidatePly >= 36
```

necessarily lies within the 8-ply precursor window.

Therefore a surviving-trajectory `capture-branch-expansion` cannot occur at candidate ply 36 or later under the frozen classifier.

This is a structural upper bound induced jointly by the deterministic phase clock and inherited classifier precedence. It must not be interpreted as an empirical discovery that the phenotype 'avoids late Namua'.

## 5. Stage 1 protocol changes

The already frozen Stage 1 corpus identity remains unchanged:

```text
32 paired opening replicates
6 conditions
192 games
opening seeds 20271001..20271032
opening plies = 8
max ply = 100
```

No scientific data have yet been generated, so this amendment changes only the interpretation and audit targets before data inspection.

### Removed as candidate formal-primary interpretation

Do not treat the following as a candidate primary survival endpoint:

```text
raw time-to-first-Mtaji
post-ascertainment time-to-first-Mtaji
```

They may be retained only as deterministic clock diagnostics.

### Added required clock checks

Stage 1 integrity/audit must verify:

1. every trajectory reaching Mtaji has `firstMtajiPly == 44`;
2. every non-terminal standard Namua observation satisfies the expected total-reserve progression implied by ply;
3. any exception is treated as an engine/instrumentation anomaly until explained;
4. `capture-branch-expansion` events in surviving trajectories respect the inherited late-window structural bound.

### Revised comparator feasibility requirement

Comparator feasibility must be evaluated at shared progression support.

Because total reserve and ply are mechanically linked, matching/stratifying simultaneously on both would duplicate the same clock information.

Stage 1 should therefore determine a single progression representation for later formal matching/stratification, for example:

```text
candidate ply
```

or an equivalent reserve-clock representation.

The choice is not yet formal-frozen.

## 6. Revised Stage 2 design candidates

After Stage 1, the formal study should prioritize one of the following families rather than a first-Mtaji survival model.

### Candidate family A — progression-matched first-Mtaji morphology

Compare frozen `MTAJI-M1 / MTAJI-M2` at the first Mtaji state between:

```text
capture-branch-expansion
vs
prespecified progression-matched comparator
```

while respecting trajectory dependence and condition structure.

### Candidate family B — progression-matched structural trajectory

Compare prespecified structural trajectories from the ascertainment landmark toward ply 44, with the time axis expressed relative to the fixed boundary or as remaining Namua progression.

### Candidate family C — bounded temporal localization

Describe/test whether CBE occupies a different portion of the eligible Namua clock than comparator events, with explicit acknowledgement that the late boundary is partly induced by classifier precedence.

This family is less suitable for a strong mechanistic claim and should not be interpreted as phase-transition acceleration.

## 7. Claims explicitly prohibited after this amendment

Do not claim from the standard-engine study that CBE:

- accelerates Namua→Mtaji transition;
- delays Namua→Mtaji transition;
- changes the hazard of first Mtaji;
- causes earlier/later formal phase conversion.

The formal transition time is mechanically fixed for trajectories that survive to Mtaji.

Potential claims must instead concern:

- temporal localization on the fixed Namua clock;
- structural carry-through toward the fixed boundary;
- first-Mtaji morphology;
- bounded condition dependence of those quantities.

## 8. Governance status

This amendment was made:

```text
before Stage 1 game generation
before Stage 1 event inspection
before any formal corpus exists
```

It is therefore a prospective design correction based on engine semantics, not a result-driven endpoint switch.

The original Stage 1 protocol remains part of the audit trail, but this amendment controls wherever the original text suggests first-Mtaji survival analysis as a meaningful candidate primary model.
