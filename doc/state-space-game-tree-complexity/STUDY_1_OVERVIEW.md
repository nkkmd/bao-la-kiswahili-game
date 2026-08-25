# State Space / Game Tree Complexity Study 1 — Overview

**Study ID:** `SSGTC-STUDY1`  
**State:** COMPLETED  
**Formal decision:** `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`  
**Representation:** RAW-ONLY

## What was studied

This prospective independent study quantified Bao reachable-state growth, branching, transpositions, and bounded game-tree expansion using authoritative raw rule-state identity without unvalidated symmetry reduction or canonicalization.

It deliberately did **not** ask for one unsupported global number of Bao positions. Exact bounded counts, observed/censored rows, game-tree path occurrences, unique raw states, and estimates were kept separate.

## Raw identity

```text
include: pits, reserve, houseOwned, player, phase, winner, pending
exclude: turn, reason
seed invariant: sum(pits)+sum(reserve)+sum(pending)=64
```

Missing `pending` was a hard error. The study used no seat swap, reflection, compound transform, SIP/ORISC transformation, canonicalization, or symmetry quotient.

## Formal bounded result

Stage 2 prospectively froze the standard initial state and complete enumeration through raw-state depth 8 / parent expansion depth 7, plus a non-deduplicated game tree through depth 8.

```text
reachable raw states through depth 8 = 24,848
transition occurrences from parent depths 0..7 = 25,648
duplicate encounters = 801
multi-parent raw states = 763

game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940

raw-state / tree-node ratio = 0.803076823632074
```

Raw-state growth by minimum depth was:

```text
0: 1
1: 4
2: 14
3: 38
4: 119
5: 384
6: 1,284
7: 4,706
8: 18,298
```

Game-tree node occurrences by depth were:

```text
0: 1
1: 4
2: 14
3: 38
4: 124
5: 405
6: 1,430
7: 5,655
8: 23,270
```

For completely expanded nonterminal raw states at parent depths 0..7, arithmetic mean branching was `3.936157151626765`, geometric mean branching was `3.4331822270441013`, forced single-move proportion was `0.06476365868631062`, and capture-forced proportion was `0.8276550030693677`.

All 24,848 raw states in this depth-8 domain were Namua. This means only that Mtaji was not reached **within this bounded depth**, not that Bao does not reach Mtaji.

## Verification

Production and independent implementations agreed exactly on state count, transition count, tree occurrences, and set hashes:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

The formal GitHub Actions run was `32805975114`; the independent verifier re-enumerated the entire frozen graph and tree domains without importing the production serializer/runner or Stage 1 evidence.

## What this does not establish

This Study does **not** establish:

- the exact full Bao state-space size;
- the exact full Bao game-tree size;
- a validated full-game growth law or state-space estimator;
- a global transposition ratio;
- a symmetry-reduced count;
- validated canonicalization;
- absence of Mtaji or cycles in Bao generally.

The exact claim is confined to the frozen depth-8 RAW-ONLY domain. Deeper enumeration, full-game estimation, or symmetry-reduced counting requires a new prospective study/versioned protocol.

## Where to read next

- `STUDY_1_FINAL_REPORT.md` — scientific and technical integrated report
- `results/STAGE_2_FORMAL_RESULT.json` — canonical machine-readable result
- `REPRODUCIBILITY_INDEX.md` — runs, hashes, tooling, and artifact provenance
- `DECISION_REGISTER.md` — no-rescue and claim-boundary decisions