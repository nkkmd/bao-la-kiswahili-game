# REEOE-STUDY1 — Study-start prospective freeze checkpoint

Date: 2026-08-28

## Repository audit

```text
remote main = aba61596e6440e9d54be6f1e9520f65e983000b3
expected prior main = aba61596e6440e9d54be6f1e9520f65e983000b3
match = true
open PRs before Study start = 0
competing active Research Generation 2 branch = none found
```

All residual G2 branches had zero commits ahead of `main`.

## Frozen Study identity

```text
Program = G2-04
Study ID = REEOE-STUDY1
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Branch = research/g2-04-restricted-endgame-exact-oracle-expansion
```

Stages:

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
REEOE-S1-DEVELOPMENT-2026-08-28-v1
REEOE-S2-FORMAL-2026-08-28-v1
```

## Representation freeze

```text
RAW include = pits,reserve,houseOwned,player,phase,winner,pending
RAW exclude = turn,reason
missing pending = fail closed
validated transform set = []
symmetry/canonicalization/quotient counting = prohibited
```

## Upstream no-rescue freeze

G2-01, G2-02, G2-03 and all Research Generation 1 formal decisions remain immutable. The prior REWR 8-state oracle is a technical positive control only. The historical 423,733-state REWR candidate remains an `ADMIN-CUTOFF` technical history item and is not resumed by cap increase.

## Stage 0 source-audit finding recorded prospectively

Before any G2-04 scientific generation, the existing REWR production and independent raw-state helpers were observed to include a compatibility fallback that substitutes `[0,0]` when `pending` is missing.

This is incompatible with the G2-04 strict identity contract. The historical source will not be rewritten. Instead, Stage 0 requires separate G2-04 production and independent strict validation layers that reject missing `pending` before historical exact-transition components can be used as technical fixtures.

This finding occurred before Stage 1 or Stage 2 scientific outcome generation and does not change any scientific endpoint.

## Authorization state

```text
Stage 0 technical work = eligible
Stage 0 scientific inference = false
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
```

No G2-04 scientific exact result existed at this checkpoint.
