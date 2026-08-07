# Study 1 — Machine Definitions and Bao Research Vocabulary

Date: 2026-08-07  
Status: fixed for Study 1 final integration  
Scope: 第1研究「Baoにおける局面相転移点の発見と、capture-branch-expansionの確認」

## 1. Purpose

This document fixes the terminology used in the Study 1 final report by separating:

1. **machine definitions** already implemented in the analysis pipeline;
2. **empirical structural findings** observed in the fixed corpora;
3. **human-facing research vocabulary** used to explain the phenomenon.

No threshold, classifier order, formal endpoint, or experiment decision is changed here.

Where an empirical observation is stronger than the machine definition, the observation is recorded as scope/evidence rather than silently added to the classifier.

---

## 2. Category-A candidate

### Machine definition

Category A originates from the pilot candidate / forcing-ablation pipeline.

The primary candidate rule uses:

- `signalThreshold = 2.0`;
- `persistenceThreshold = 0.75`;
- non-forcing signal groups:
  - reserve;
  - mobility;
  - capture;
  - front-row structure.

In the forcing-excluded analysis, at least two non-forcing signal groups must be active and the candidate point must satisfy the fixed persistence requirement. Candidate points are clustered by the existing candidate pipeline.

A cluster is classified as **Category A** when:

1. it survives the candidate rule with forcing omitted from candidacy; and
2. it is not coincident with a forcing event (`nearestForcingDistance > 0` or unavailable rather than zero).

Implementation sources:

- `tools/experiments/analyze-phase-transition-forcing-ablation.py`
- `tools/experiments/analyze-phase-transition-archetypes.py`

### Human-facing meaning

> A transition candidate supported by at least two non-forcing structural signal groups, rather than being created only by the forced-capture indicator itself.

### Boundary

Category A identifies a **candidate transition context**. It does not mean the candidate is a `capture-branch-expansion`.

---

## 3. Forced-capture regime

### Machine definition

A **forced-capture regime** is a maximal contiguous sequence of observations within one game for which:

`forcedCapture === true`

For each regime the implementation records:

- `regimeId = gameId:startPly-endPly`;
- `startPly`;
- `endPly`;
- `length = endPly - startPly + 1`;
- phase at start/end;
- mean and maximum `captureMoveCount`.

Implementation:

- `tools/experiments/lib/forced-capture-regimes.js`

### Candidate-relative regime quantities

For a candidate inside a regime:

- `positionInRegime = candidatePly - regimeStartPly`;
- if `regimeLength > 1`:
  - `normalizedPositionInRegime = positionInRegime / (regimeLength - 1)`;
- for a one-ply regime:
  - `normalizedPositionInRegime = 0`.

### Human-facing meaning

> A continuous part of the game in which the player to move is constrained to capture on every observed ply.

### Boundary

A forced-capture regime is a property of the observed legal-move state sequence. It is not the same as an internal AI search regime.

---

## 4. Capture-move branching proxy

### Machine quantity

`captureMoveCount` is the number of legal capture moves in the observed position.

### Preferred term

> **legal capture-option count**

or, in mechanism discussion:

> **capture-move branching proxy**

### Avoid

Do not call `captureMoveCount` a complete `search-tree branching factor`. It describes legal capture choices at an observed board state, not all internal search nodes or branches.

---

## 5. Capture-branch-expansion

### Machine definition

Candidate metrics use the fixed defaults:

- `before = 3` ply;
- `after = 8` ply;
- `expansionDelta = 3`;
- `persistenceFraction = 0.5`;
- `eventWindow = 8` ply.

For a candidate at ply `t`:

1. `preCaptureMean` is the mean `captureMoveCount` over available observations in `[t-3, t-1]`;
2. `candidateCaptureMoveCount` is `captureMoveCount` at `t`;
3. `captureDelta = candidateCaptureMoveCount - preCaptureMean`;
4. the post window contains observations in `[t+1, t+8]`;
5. a post-window observation is elevated when:

   `captureMoveCount >= preCaptureMean + 3`;

6. `postPersistenceFraction` is the fraction of available post-window observations that are elevated.

The existing classifier order is material:

1. if the candidate is in `namua` and first future `mtaji` occurs within 8 ply, classify `namua-to-mtaji-precursor`;
2. else if forcing release occurs within 8 ply, classify `forcing-release-precursor`;
3. else if `captureDelta >= 3` and `postPersistenceFraction >= 0.5`, classify **`capture-branch-expansion`**;
4. else if `captureDelta >= 3`, classify `temporary-spike`;
5. else if `captureDelta <= -2`, classify `capture-branch-convergence`;
6. otherwise classify `temporary-spike`.

Implementation:

- `tools/experiments/lib/forced-capture-regimes.js`

### Human-facing meaning

> A candidate position where the number of legal capture choices rises strongly relative to the immediately preceding local baseline and remains elevated over a meaningful portion of the following sequence, after excluding candidates that are better described as imminent formal-phase transition or imminent forcing release.

### Important boundary

**Being inside a forced-capture regime is not part of the machine classifier.**

Study 1 empirically found that the relevant expansion events are overwhelmingly / effectively located inside forced-capture regimes, and Stage B uses that as a structural explanation. This empirical fact must not be inserted post hoc as a new classifier requirement.

---

## 6. Temporary spike

### Machine meaning

A candidate with strong local capture-option increase (`captureDelta >= 3`) that does not meet the fixed persistence requirement, unless an earlier classifier gate assigns it to another precursor class.

### Human-facing meaning

> A short-lived burst of capture choices that is not sufficiently persistent to count as capture-branch-expansion.

This is an explicit counterexample class and is essential to separating sustained transition from momentary fluctuation.

---

## 7. Namua-to-mtaji precursor

### Machine meaning

A candidate where:

- `phaseAtCandidate === "namua"`; and
- the first future `mtaji` observation is within the fixed 8-ply event window.

This classifier has precedence over capture-branch-expansion.

### Human-facing meaning

> A candidate occurring immediately before the formal rules-state transition from namua to mtaji.

### Boundary

It is not automatically treated as an independent strategic transition.

---

## 8. Forcing-release precursor

### Machine meaning

A candidate for which the first later observation with `forcedCapture !== true` lies within the fixed 8-ply event window.

This classifier has precedence over capture-branch-expansion after the namua-to-mtaji check.

### Human-facing meaning

> A candidate located shortly before the current forced-capture sequence is released.

### Study 1 empirical boundary

Earlier control analysis found these candidates strongly concentrated near game termination. Study 1 therefore treats them as a terminal-near subtype / confound rather than evidence of a separate general strategic transition.

---

## 9. Event persistence

### Machine definition

For capture-branch-expansion, persistence is represented by:

`postPersistenceFraction`

with an expansion threshold of:

`postPersistenceFraction >= 0.5`

under the fixed post window of up to 8 ply.

### Human-facing meaning

> The elevated legal-capture-option state continues beyond the candidate move instead of immediately collapsing.

### Boundary

Persistence is part of the phenotype definition. It must not be presented as an independent statistical validation of the same phenotype.

---

## 10. Trajectory

### Machine definition

During game generation, every observation contributes its `stateHash` to an ordered state sequence.

`trajectoryHash = SHA-256(stateHash_0 + "\n" + stateHash_1 + ... )`

Implementation:

- `tools/experiments/run-phase-transition-research.js`

### Human-facing meaning

> The complete deterministic sequence of recorded board states for a game under the experiment configuration.

Two games with the same `trajectoryHash` followed the same recorded state sequence, even if they are separate generated game rows.

---

## 11. Trajectory-ply

### Machine definition

For a candidate or control event:

`trajectoryPlyKey = trajectoryHash + ":" + eventPly`

where `eventPly` is resolved from the candidate/control ply field.

Implementation:

- `tools/experiments/analyze-confirmation-trajectory-duplication.js`

### Human-facing meaning

> A structural sensitivity unit representing the same deterministic game trajectory at the same ply.

### Boundary

Trajectory-ply deduplication is a secondary sensitivity analysis. It does not replace paired game-level formal endpoints or retrospectively change any formal decision.

---

## 12. Candidate availability

### Machine / descriptive quantity

At a fixed experiment condition:

> whether a game contains at least one eligible Category-A candidate in the fixed primary population.

Stage B reports:

- candidate-bearing game count;
- candidate-game rate;
- eligible candidate rows per game;
- trajectory-ply deduplicated candidate counts where available.

### Human-facing meaning

> How often a search condition reaches a position that the fixed candidate detector considers structurally transition-like.

---

## 13. Candidate-to-expansion manifestation

### Descriptive quantity

At game level:

`P(any eligible capture-branch-expansion | game has any eligible candidate)`

Candidate-row and trajectory-ply manifestation rates may also be reported, but the unit must always be named explicitly.

### Human-facing meaning

> Given that a candidate context is reached, how often it develops into the sustained capture-option expansion phenotype.

### Boundary

Candidate rows, games, regimes, and trajectory-ply units are not interchangeable independent units.

---

## 14. Search-profile dependence

### Study 1 operational meaning

A difference in capture-branch-expansion manifestation between AI search profiles while the comparison experiment fixes the other preregistered conditions such as evaluator, search depth, level, opening pairing, eligibility boundary, and endpoint definition.

### Confirmed / bounded examples

- E-018/H16: at fixed `hard / bao / depth2`, phase2 > legacy was formally confirmed;
- E-020/H18: at fixed `hard / bao / depth3`, legacy > phase2 was prospectively and independently confirmed.

### Human-facing meaning

> Whether the search procedure changes how often the same operational transition phenotype appears under otherwise fixed test conditions.

### Boundary

Search-profile dependence does **not** mean one profile is globally superior, nor does E-018 + E-020 alone constitute a formal general search-profile × depth interaction test.

---

## 15. Sustained-forcing window

### Status

**Interpretive Stage B structural term; not a new classifier.**

### Empirical meaning

Stage B found that expansion-compatible candidate pools tend to occupy a structural context characterized by:

- membership in a forced-capture regime;
- relatively longer regimes;
- relatively earlier normalized position in the regime;
- enough distance from imminent forcing release;
- enough distance from imminent formal phase transition;
- sufficient remaining sequence for elevated capture branching to persist.

The search profile preferentially occupying this morphology changes between tested depth2 and depth3 conditions.

### Human-facing meaning

> A part of a forced-capture sequence where the forcing structure still has enough remaining life for a newly expanded set of capture choices to develop and persist.

### Boundary

There is no newly fitted single numeric `sustained-forcing-window` threshold in Study 1. Do not back-fit one from Stage B outcomes.

---

## 16. Strategic-transition phenotype

### Preferred Study 1 term

`capture-branch-expansion strategic-transition phenotype`

### Meaning

A reproducible operational pattern that:

- arises from a transition-candidate context;
- shows sustained expansion of legal capture options;
- is structurally interpretable inside the forced-capture lifecycle;
- recurs on new seeds and multiple trajectory-ply structures;
- has explicit search-condition boundaries and counterexamples.

### Why “phenotype”

The term separates an observable, machine-detectable game-position pattern from a stronger claim about a unique causal mechanism or universal phase transition.

---

## 17. Phase-transition candidate / recognition wording

Stage C found the original six recognition criteria to be:

- five `satisfied`;
- the second-independent-feature-group criterion `partially satisfied`.

Therefore final Study 1 language should use bounded wording.

Preferred:

- **capture-branch-expansion phenomenon**;
- **capture-branch-expansion strategic-transition phenotype**;
- **strong phase-transition candidate with bounded recognition scope**.

Allowed only with explicit scope qualification:

- **phase-transition phenotype under the tested operational definition**.

Avoid as an unqualified Study 1 conclusion:

- universal Bao phase transition;
- general depth interaction;
- all-search-profile invariant transition;
- causal search-tree mechanism.

---

## 18. Unit hierarchy

Study 1 uses the following dependency hierarchy:

`paired seed -> game -> forced-capture regime -> trajectory/ply -> candidate row`

Interpretation and uncertainty must respect this hierarchy.

In particular:

- the formal E-018/E-019/E-020 profile comparisons use paired game-level endpoints;
- candidate/regime metrics are secondary structural analyses;
- trajectory-ply deduplication is a secondary structural sensitivity unit;
- raw candidate rows must not be treated as independent games.

---

## 19. Fixed vocabulary summary

| term | machine / research status | short human meaning |
|---|---|---|
| Category-A candidate | fixed candidate classification | non-forcing-supported transition candidate |
| forced-capture regime | fixed contiguous-state definition | continuous forced-capture sequence |
| captureMoveCount | recorded feature | number of legal capture choices |
| capture-branch-expansion | fixed classifier | sustained local expansion of legal capture choices |
| temporary spike | fixed classifier | non-persistent capture-choice burst |
| namua-to-mtaji precursor | fixed classifier | candidate just before formal phase transition |
| forcing-release precursor | fixed classifier | candidate just before forced-capture release |
| event persistence | fixed metric | persistence of elevated capture choices |
| trajectory | fixed hash definition | complete recorded state sequence |
| trajectory-ply | fixed sensitivity key | same state trajectory at same ply |
| candidate availability | Stage B descriptive measure | frequency of reaching candidate contexts |
| manifestation | Stage B descriptive measure | candidate developing into expansion |
| search-profile dependence | bounded experimental relation | profile changes event manifestation under fixed conditions |
| sustained-forcing window | interpretive, non-classifier | regime region compatible with persistent expansion |
| strategic-transition phenotype | preferred final interpretation | reproducible bounded observable transition pattern |

## 20. Governance

This vocabulary document does not alter:

- any historical classifier output;
- any formal experiment decision;
- any threshold or eligibility boundary;
- H16/H17/H18 scope;
- formal archives.

Any future change to machine definitions belongs to a new analysis/study version and must not be silently applied to Study 1 historical results.