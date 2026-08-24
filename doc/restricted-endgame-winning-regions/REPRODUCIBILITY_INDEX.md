# REPRODUCIBILITY_INDEX — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24

## Baseline identities

```text
main HEAD = 626480507710e0095ef8aec6a53c3e4e0318fa4f
public/engine.js blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js blob = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
doc/RULES_BASELINE.md blob = 9a07ce6c2895cd4b4048af71a41fc5de02f87129
test/engine.test.js blob = 12b864edf114e1967964cdde74bddfcd30f89d0d
rule-state infrastructure blob = 2ea6c226561f1b7e59926caa39c0ebee28cf6b65
```

## Identity conventions

Primary state identity: direct stable serialization of `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending` followed by SHA-256.

Primary move identity: exact key including `houseChoice` and `houseTwo` as in `AI.moveKey`.

Forbidden primary reduction: `seatCanonicalKey` or any symmetry/isomorphism canonicalization.

## Planned reproducibility artifacts

```text
Stage 0 rule/terminal audit
synthetic graph fixture manifest
witness-root manifest with full move paths
candidate closure benchmark manifest
state-set hash
transition-set hash
independent reconstruction audit
Stage 1 frozen spec and authorization
production tablebase manifest
independent exact verification manifest
```

No Stage 1 scientific artifact exists yet.
