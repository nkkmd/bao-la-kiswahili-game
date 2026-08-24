# STAGE_0_TECHNICAL_PLAN — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24  
Status: AUTHORIZED FOR TECHNICAL WORK ONLY

## 1. Firewall

Stage 0 exists to choose a scientifically defensible domain **without seeing the scientific solution outcome**.

Authorized selection variables:

```text
raw candidate roots
witness replay validity
state count
edge count
branching distribution
transition closure completeness
maximum / distribution of guard-free relay microsteps
move-internal recurrence count
runtime
peak memory
serialization determinism
state-set hash
transition-set hash
independent reconstruction equality
```

Forbidden selection variables:

```text
WIN count / rate
LOSS count / rate
RECURRENT count / rate
winning-region size
DTF distribution
optimal-move-set size/frequency
which player wins particular candidate roots
engine/search/evaluation favorability
```

If a technical tool computes forbidden quantities internally, they must not be emitted before the Stage 1 domain is frozen.

## 2. Work packages

### T0 — Generic retrograde fixture validation

Use synthetic directed game graphs only. Required fixtures:

- one-ply forced win;
- one-ply forced loss;
- branching state with a unique winning move;
- forced loss with multiple resistance lengths;
- pure cycle with no terminal;
- mixed resolved/recurrent graph.

Verify absolute-winner propagation, optimal move set for resolved states, DTF recurrence, and recurrent SCC identification.

### T1 — Guard-free Bao move transition audit

Implement a research-owned move executor or microstep adapter that reproduces current engine behavior for normal terminating moves but does not convert relay count 512 into a game result.

For each move, record:

```text
status = TERMINATED | MOVE-NONTERMINATION | SEMANTICS-ERROR
microstepCount
successor direct state hash when TERMINATED
repeatedMicrostateHash when MOVE-NONTERMINATION
```

Cross-check normal terminating cases against `E.applyMove` whenever the runtime engine does not hit `relay-limit`.

### T2 — Witness trajectory generator

Generate deterministic technical trajectories from `E.initialState()` and record every exact `AI.moveKey` plus before/after direct rule-state hashes.

Technical seed use, if any, is fixed and explicitly labeled non-scientific. No prior scientific seed block is reused implicitly.

### T3 — Candidate root scan

Scan only witness-reachable states satisfying:

```text
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
winner = null
pending = [0,0]
```

Benchmark predeclared root-filter grid:

```text
nonEmptyPitCount <= {8,10,12,14}
legalMoveCount <= {2,4,6}
```

Within each cell, sort by direct rule-state hash and benchmark root prefixes `{1,2,4}` where available.

### T4 — Complete forward closure

For each technical candidate root set, enumerate every exact successor breadth-first or depth-first until the set is closed or a technical resource gate is exceeded.

Resource exceedance produces `INCOMPLETE-TECHNICAL-CLOSURE`; the partial graph must never be solved scientifically.

### T5 — Independent graph reconstruction

Production constructor and verifier should not share the transition queue/state-set implementation. They may share the frozen runtime engine only where unavoidable, but the verifier must independently recompute legal move sets, direct serialization and edge rows.

Required equality:

```text
root set
state count
edge count
state-set SHA-256
transition-set SHA-256
terminal state set and winners
```

### T6 — Domain selection

Select the Stage 1 candidate solely by:

1. exact-semantic eligibility;
2. complete closure;
3. independent equality;
4. nontriviality;
5. feasible resource margin.

Tie-break among technically equivalent candidates by deterministic root-filter order then direct root hash, never by game-theoretic outcomes.

## 3. Provisional resource gates

Before real benchmark execution, implementation should expose configurable limits rather than silently truncating. Stage 0 benchmark may stop individual candidates at:

```text
states > 1,000,000
edges > 10,000,000
wall-clock > explicitly recorded runner budget
memory > explicitly recorded runner budget
```

These are **technical benchmark stop limits**, not scientific game semantics. Final Stage 1 limits must be frozen after Stage 0 technical evidence and before scientific generation.

## 4. Hashing

Use stable deterministic UTF-8 serialization and SHA-256.

State-set hash: hash sorted direct state keys.  
Transition-set hash: hash sorted rows of `(sourceStateKey, exactMoveKey, successorStateKey, terminalWinner)`.

No symmetry canonical key may enter these hashes.

## 5. Stage 0 acceptance

Stage 0 may recommend a Stage 1 freeze only when:

```text
generic solver fixtures PASS
guard-free transition audit PASS for candidate closure
witness replay PASS
complete closure PASS
independent reconstruction PASS
resource margin acceptable
no scientific outcome peeking occurred
```

Otherwise Stage 0 remains open or closes Study 1 as technically infeasible.
