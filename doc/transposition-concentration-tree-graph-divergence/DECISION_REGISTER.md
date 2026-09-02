# TCTGD-STUDY1 — Decision Register

Updated: 2026-09-02

| ID | Decision | Status | Scientific consequence |
|---|---|---|---|
| TCTGD-D001 | G3-03 program review | `G3-03-AUTHORIZED` | A new prospective independent Study may be defined; no G3-02 positive result is required. |
| TCTGD-D002 | Additional prerequisite | `NONE` | LGTGMIV F2/F3/F4 within RAW-only depth 5 are sufficient. |
| TCTGD-D003 | Formal Study ID | `TCTGD-STUDY1` | Immutable after prereg freeze. |
| TCTGD-D004 | Representation | `RAW-ONLY / transforms=[] / depth=5` | No symmetry/canonical quotient. |
| TCTGD-D005 | Principal families | `F2 + F3 + F4` | F1 auxiliary only; F5 excluded from primary contract. |
| TCTGD-D006 | Population design | `paired fresh trajectory` | Namua ply-24 and first Mtaji >=44 from same seed are compared. |
| TCTGD-D007 | Stage 1 seeds | `31310001..31310192` | Fresh development block; unconsumed. |
| TCTGD-D008 | Stage 2 seeds | `31320001..31320288` | Fresh formal holdout; unconsumed. |
| TCTGD-D009 | Endpoint set | `C1..C5 frozen` | No result-dependent endpoint replacement. |
| TCTGD-D010 | Stage 1 promotion | `coverage + >=2/3 nonzero + >=2/3 dominant sign` | Only promoted ID/direction may enter Stage 2. |
| TCTGD-D011 | Stage 2 formal test | `exact sign test + Holm, FWER=1/20` | No floating-point decision. |
| TCTGD-D012 | Stage 0 | `STAGE0-PASS` | Synthetic instrument/endpoint/statistical boundary validated; Stage 1 not auto-authorized. |
| TCTGD-D013 | G3-02 reuse | `PROHIBITED AS SCIENTIFIC EVIDENCE` | Runner-local summaries, duplicate run, failed artifact and root reconstruction are excluded. |
| TCTGD-D014 | Cross-depth state presence | `CONTEXTUAL, NOT CYCLE PROOF` | Repeated RAW identity across depth labels does not itself establish recurrence/cycle. |
| TCTGD-D015 | Scientific workflow trigger | `workflow_dispatch only` | Push-triggered Stage 1/2 scientific computation is prohibited. |
| TCTGD-D016 | Scientific execution count | `max 1 per fresh Stage` | Unauthorized duplicate scientific execution -> `TECHNICAL-INVALID`. |
| TCTGD-D017 | Result durability | `Actions artifact before repository mirror` | Push failure cannot erase result or authorize recomputation. |
| TCTGD-D018 | Protected depth-10 holdout | `SEALED / NOT GENERATED / NOT READ` | No generation/read/peek/resource partial generation. |
| TCTGD-D019 | Stage 1 | `NOT-AUTHORIZED-NOT-EXECUTED` | Tooling smoke and separate authorization review remain required. |
| TCTGD-D020 | Stage 2 | `NOT-AUTHORIZED-NOT-EXECUTED` | Requires valid Stage 1, nonempty frozen candidate set and separate authorization. |

## Immutable G3-02 closure

G3-02 `EBRWS-STUDY1` remains `CLOSED / TECHNICAL-INVALID`; formal promoted candidate set `[]`; Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`. TCTGD-STUDY1 does not reopen or rescue it.

## No-rescue boundary

Not yet crossed. It activates on the first Stage 1 fresh scientific evidence generation or read. After activation, threshold, endpoint, representation, horizon, seed/root, subgroup, test, resource ceiling or same-evidence rerun cannot be changed to obtain a favorable outcome.
