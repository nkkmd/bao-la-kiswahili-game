# STAGE_0_CONSTRUCT_DESIGN — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24  
Status: PROSPECTIVE TECHNICAL DESIGN

## 1. Purpose

Resolve the construct question before any scientific tablebase is generated:

> Under what exact state, terminal, transition, reachability and closure semantics can a bounded Bao domain legitimately support an `exact game-theoretic value` claim?

## 2. Runtime semantics recovered from `public/engine.js`

Initial state fields:

```text
pits: 2 players x 2 rows x 8 pits
reserve: [22,22]
houseOwned: [true,true]
player: 0
phase: namua
winner: null
reason: ""
turn: 1
pending: [0,0]
```

`legalMoves` is phase-dispatched and suppresses all moves when `winner !== null`. Capture priority is enforced in both Namua and Mtaji. `moveVariants` expands Namua house stop/use alternatives when they produce distinct states.

Mtaji legal candidates originate from pits containing at least 2 seeds. Captures suppress takata; otherwise front-row moves suppress back-row moves when front candidates exist. `emptiesOwnFront` removes certain sole-front outward moves.

`finishTurn` declares front-empty wins, changes Namua to Mtaji when both reserves reach zero, toggles player, then declares `no-move` loss if the next player has no legal move.

## 3. Implementation guard separation

`MAX_RELAY = 512` causes the runtime engine to set the opponent as winner with `reason="relay-limit"` if a relay has not stopped by the cap.

`RULES_BASELINE.md` states this cap is a safety limit protecting the browser implementation and is **not** an added normal Bao rule.

Therefore:

```text
relay-limit terminal -> forbidden as exact game-theoretic base case
```

Stage 0 must implement a guard-free transition auditor that detects exact move-internal recurrence instead of substituting an opponent win at 512 relays.

## 4. State identity

Primary exact identity will use direct rule-relevant fields equivalent to existing `ruleState(state)` infrastructure:

```json
{
  "pits": "2x2x8 nonnegative integer arrays",
  "reserve": "2 integers",
  "houseOwned": "2 booleans",
  "player": "0 or 1",
  "phase": "namua or mtaji",
  "winner": "null, 0, or 1",
  "pending": "2 integers"
}
```

`turn` and textual `reason` are not future-rule inputs and are excluded from rule-state identity. They may be preserved as provenance metadata but cannot split otherwise identical game states.

No symmetry transformation is applied.

## 5. Exact move identity

Use a deterministic key over:

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

This matches the information retained by `AI.moveKey`. Do not rely only on `engine.sameMove`, because that legality comparison intentionally does not distinguish `houseChoice`.

## 6. Canonical validity rules — Stage 0 hypotheses to verify

For primary nonterminal Mtaji closure states:

```text
phase == "mtaji"
reserve == [0,0]
winner == null
pending == [0,0]
all pit/reserve/pending counts are nonnegative integers
total kete across pits + reserve + pending == 64
both players have at least one occupied front pit
current player has at least one exact legal move
```

Primary roots additionally target `houseOwned=[false,false]`; closure must verify this remains invariant.

A syntactically constructible object failing these canonical conditions is not silently promoted to a rule state.

## 7. Historical reachability

Primary roots must be generated from the standard initial state and store their full move witness. Independent replay must reproduce the exact direct rule-state hash.

All states reached through the complete legal closure inherit historical reachability:

```text
initial -> witness root -> legal closure path -> state
```

This proves reachability for the bounded oracle without claiming that all possible Bao endgames are enumerated.

## 8. Transition closure

For frozen roots `R`:

```text
D(R) = least set containing R such that
       for every nonterminal s in D(R),
       for every exact legal move m in s,
       exactApply(s,m) is in D(R).
```

Normative terminal successors are members of `D(R)`.

Any administrative resource cutoff during construction invalidates closure unless construction resumes to completion. A partial prefix may be used only as technical feasibility evidence, never as an exact solved domain.

## 9. Terminal canonicalization problem

Runtime `engine.js` guarantees canonical terminalization for states reached through `applyMove`, but arbitrary constructed states can have front-empty/no-move conditions while `winner === null`.

Because primary states are witness-reachable closure states, the main path should avoid such pre-terminal constructions. Independent enumeration must still assert that every nonterminal closure node is canonical and must never infer a scientific terminal from a malformed constructed state without a frozen normalization rule.

## 10. Game-level recurrence

After complete graph construction and WIN/LOSS attractor propagation, unresolved nodes require SCC decomposition.

Allowed labels before a formal draw rule exists:

```text
RECURRENT
CYCLIC_SCC
RECURRENCE-PRESERVING MOVE
```

Forbidden automatic label:

```text
DRAW
```

## 11. Exact-eligibility gate

A candidate domain is exact-eligible only if all are true:

1. root witnesses independently replay;
2. direct state serialization is deterministic;
3. exact legal move set is independently reproducible;
4. every legal move terminates under guard-free semantics;
5. complete forward closure finishes within frozen resource limits;
6. zero outgoing legal edges are omitted;
7. independent state/edge hashes match;
8. normative terminal labels match independently.

Only after these gates may Stage 1 freeze a scientific exact domain.
