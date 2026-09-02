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
| TCTGD-D007 | Stage 1 seeds | `31310001..31310192 / CONSUMED` | Fresh development block was consumed by the single authorized Stage 1 execution; no same-evidence rerun. |
| TCTGD-D008 | Stage 2 seeds | `31320001..31320288 / NOT CONSUMED` | Fresh formal holdout remains unexecuted. |
| TCTGD-D009 | Endpoint set | `C1..C5 frozen` | No result-dependent endpoint replacement. |
| TCTGD-D010 | Stage 1 promotion | `coverage + >=2/3 nonzero + >=2/3 dominant sign` | Only candidates from a valid Stage 1 could enter Stage 2. |
| TCTGD-D011 | Stage 2 formal test | `exact sign test + Holm, FWER=1/20` | Never executed because Stage 1 was technical-invalid. |
| TCTGD-D012 | Stage 0 | `STAGE0-PASS` | Synthetic instrument/endpoint/statistical boundary passed; did not auto-authorize Stage 1. |
| TCTGD-D013 | G3-02 reuse | `PROHIBITED AS SCIENTIFIC EVIDENCE` | Runner-local summaries, duplicate run, failed artifact and root reconstruction were excluded. |
| TCTGD-D014 | Cross-depth state presence | `CONTEXTUAL, NOT CYCLE PROOF` | Repeated RAW identity across depth labels does not itself establish recurrence/cycle. |
| TCTGD-D015 | Original scientific workflow trigger contract | `workflow_dispatch only / SUPERSEDED PRE-FRESH BY TECHNICAL V2` | Retained as historical prospective record; not used for fresh execution after tooling smoke exposed branch-only dispatch unavailability. |
| TCTGD-D016 | Scientific execution count | `max 1 per fresh Stage` | Stage 1 actual scientific executions = 1; execution-count contract satisfied. |
| TCTGD-D017 | Result durability | `Actions artifact before repository mirror` | Stage 1 canonical bytes survived independently of repository mirror and were then mirrored exactly. |
| TCTGD-D018 | Protected depth-10 holdout | `SEALED / NOT GENERATED / NOT READ` | No generation/read/peek/resource partial generation. |
| TCTGD-D019 | Stage 1 | `TECHNICAL-INVALID` | Mandatory root/stage in-memory exact-agreement gate failed after fresh evidence; no rescue rerun. |
| TCTGD-D020 | Stage 2 | `NOT-AUTHORIZED-NOT-EXECUTED` | Invalid Stage 1 cannot authorize formal validation. |
| TCTGD-D021 | Technical execution v2 refreeze | `AUTHORIZED PRE-FRESH` | Only execution control plane and upstream identity firewall changed; scientific seed/population/horizon/endpoints/gates/tests/ceilings unchanged. |
| TCTGD-D022 | Stage 1 scientific content baseline | `3b31c0e853b99d50e6e4cd924984342535c22547` | Authorization bound exact source blobs and allowed only declared control-plane advancement before lease. |
| TCTGD-D023 | Stage 1 authorization | `STAGE1-AUTHORIZED / EXACTLY ONCE` | Nonce `TCTGD-S1-AUTH-2026-09-02-V2-01`; run `33592380079`. |
| TCTGD-D024 | Stage 1 population/resource gates | `PASS` | 12/12 paired roots selected; `populationComplete=true`; `stageResourcePass=true`. |
| TCTGD-D025 | Cross-implementation reconstruction/family identity | `PASS` | Source identity, upstream reconstruction/family hashes, static independence, paired comparisons and development summary agreed. |
| TCTGD-D026 | Root endpoint in-memory exact gate | `FAIL` | `Object.create(null)` independent endpoint map differed in prototype from production object; prototype-sensitive deep equality returned false. |
| TCTGD-D027 | Canonical stage scientific core | `SHA-256 IDENTICAL` | Production/independent canonical SHA both `d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f`; does not rescue failed frozen in-memory gate. |
| TCTGD-D028 | Diagnostic candidate directions | `C1,C2,C3 NAMUA-GREATER; C4 MTAJI-GREATER` | Diagnostic provenance only; formal promoted candidate set remains `[]`. |
| TCTGD-D029 | Same-evidence correction/rerun | `PROHIBITED` | Prototype fix, equality-rule substitution, or same-seed rerun after no-rescue boundary would be post hoc rescue. |
| TCTGD-D030 | Study closure | `CLOSED / TECHNICAL-INVALID` | G3-03 ends at Stage 1; a separate program review is required before any later Study. |

## Immutable G3-02 closure

G3-02 `EBRWS-STUDY1` remains `CLOSED / TECHNICAL-INVALID`; formal promoted candidate set `[]`; Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`. TCTGD-STUDY1 does not reopen or rescue it.

## Technical execution v2 boundary

The initial scientific execution contract used branch-only `workflow_dispatch`. A non-scientific tooling smoke showed that the workflow could not be dispatched by GitHub REST while it existed only on the research branch. Before any fresh scientific seed access, the execution control plane was refrozen to a dedicated path-filtered push trigger with a durable pre-computation lease and remote-advancement allowlist.

This was a technical execution correction only. The original prospective protocol/spec remains preserved; Stage 1 seed, population, relative horizon, candidate endpoints, promotion rule, formal test, resource ceilings and claim boundary were unchanged.

## Stage 1 technical-invalid boundary

The frozen Stage 1 runner required both:

- canonical scientific agreement; and
- prototype-sensitive in-memory deep strict equality.

The production endpoint map was a normal object; the independent endpoint map used `Object.create(null)`. Exact rational values and canonical stage SHA agreed, but `util.isDeepStrictEqual` rejected the prototype difference. The mandatory frozen integrity gate therefore failed.

Because this defect was identified after fresh evidence generation, the Study is not re-run or reclassified.

## No-rescue boundary

Crossed and active. Stage 1 seed block is consumed. The following are prohibited for TCTGD-STUDY1:

- same-seed rerun;
- post hoc endpoint-map prototype normalization;
- replacing the frozen deep-strict gate with canonical equality;
- threshold/endpoint/population/seed/resource-ceiling change to obtain a favorable decision;
- promotion of diagnostic C1–C4 directions into Stage 2.

Formal promoted candidate set remains `[]`.
