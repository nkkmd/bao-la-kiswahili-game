# CURRENT_STATUS — Symmetry / Isomorphic Positions Study 1

Updated: 2026-08-24

## Scientific status

**Stage 0 active. No formal reachable-corpus candidate outcome has been generated.**

The candidate semantics are frozen in `preregistration/CANDIDATE_TRANSFORMS.json` before any Study 1 formal-corpus transition-commutation result is inspected.

## Source identity recovered at study start

```text
repository = nkkmd/bao-la-kiswahili-game
main HEAD = f2edfe27f4e22198e28525b0ac09f6dd4834c488
public/engine.js blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
Restricted Endgame canonical result blob = 811eb78806813d236dc91c776e1e408d4feac22e
historical transform-candidates.js blob = a9117f46643fc79fc3352771d684c4ac9f7a01f6
```

## Upstream exact oracle recovered

`REWR-S1-DOMAIN-2026-08-24-v1` remains immutable:

```text
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
```

This Study may derive symmetry observations from that oracle but must not rewrite its identity or result.

## Engine semantics recovered

- rows: `FRONT=0`, `BACK=1`
- nyumba coordinate: `HOUSE=4` in each player's local coordinates
- each player's pit indices run left-to-right from that player's own viewpoint
- physical facing front pits use `opponentIndex = 7 - index`
- sowing ring is player-local and independent of numeric player id
- `side=left` enters at front index 0 and maps to sowing `direction=right`; `side=right` enters at index 7 and maps to `direction=left`
- `moveVariants()` is required for exact Namua move identity because `houseChoice=stop/use` may create distinct transitions
- raw rule-state identity contains `pits,reserve,houseOwned,player,phase,winner,pending`; `turn` and textual `reason` are excluded
- exact move identity contains `type,phase,row,index,direction,side,houseChoice,houseTwo`
- browser `MAX_RELAY=512` / `relay-limit` is an administrative guard, not a normative terminal rule

## Next authorized work

1. implement new Study-owned transform library; do not use the historical transform implementation as the formal implementation;
2. run synthetic identity/inverse fixtures and negative controls;
3. run outcome-blind Stage 0 graph-size benchmark with fresh technical seeds;
4. choose formal root count and local depth only from technical cost/coverage quantities;
5. freeze Stage 1 domain/spec and source hashes;
6. only then generate formal candidate outcomes.
