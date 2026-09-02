# BECT-STUDY1 — Decision Register

更新日: 2026-09-02

| ID | Decision | Status | Scientific consequence |
|---|---|---|---|
| BECT-D001 | G3-05 program review | `G3-05-AUTHORIZED` | New prospective Study definition and technical-only Stage 0 may proceed; fresh Stage 1 remains blocked. |
| BECT-D002 | Additional prerequisite | `NONE` | LGTGMIV F1-F5 / RAW-only / depth 5 are sufficient; longitudinal alignment is validated inside Stage 0. |
| BECT-D003 | Formal Study ID | `BECT-STUDY1` | Immutable after prereg freeze. |
| BECT-D004 | Representation | `RAW-ONLY / transforms=[] / depth=5` | No symmetry/canonical quotient. |
| BECT-D005 | Formal titles | `FROZEN` | English/Japanese titles fixed in protocol/spec. |
| BECT-D006 | Level endpoint universe | `M1..M8 FROZEN` | No positive-only selection from G3-04 and no post hoc endpoint expansion. |
| BECT-D007 | Transition grammar | `EXACT SIGN / NO MAGNITUDE THRESHOLD` | Adjacent exact rational deltas define onset/persistence/reversal/stall. |
| BECT-D008 | Rule phase boundary | `SEPARATE CONSTRUCT` | Primary event windows spanning multiple rule phases are excluded; phase is contextual only. |
| BECT-D009 | Experimental unit | `SOURCE TRAJECTORY` | Adjacent roots/windows are dependent repeated measures, not independent samples. |
| BECT-D010 | Formal trajectory reduction | `PERSISTENCE COUNT - REVERSAL COUNT` | One sign per trajectory/candidate enters formal inference. |
| BECT-D011 | Stage IDs | `FROZEN` | S0 technical / S1 development / S2 formal as preregistered. |
| BECT-D012 | Stage 1 seeds | `31510001..31510240 / NOT CONSUMED` | Reserved fresh development namespace; not authorized. |
| BECT-D013 | Stage 2 seeds | `31520001..31520384 / NOT CONSUMED` | Reserved fresh formal namespace; not authorized. |
| BECT-D014 | Stage 1 population | `10 trajectories / 48 roots each` | Seed-ascending first eligible trajectories, plies 16..63, no replacement. |
| BECT-D015 | Stage 2 population | `16 trajectories / 48 roots each` | Separate fresh held-out population with Stage 1 identity firewall. |
| BECT-D016 | Stage 1 promotion | `FROZEN` | Coverage + onset prevalence + nonzero balance + >=2/3 positive balance required. |
| BECT-D017 | Stage 2 test | `EXACT SIGN TEST + HOLM / FWER 1/20` | Only Stage 1 frozen promoted candidates may be tested. |
| BECT-D018 | G3-03 outcome reuse | `PROHIBITED` | Technical-invalid diagnostic directions/values cannot select roots, endpoints, thresholds or event classes. |
| BECT-D019 | G3-04 outcome reuse | `CONTEXT ONLY` | C1/C6 remain immutable; values/directions not used as BECT evidence or candidate selection inputs. |
| BECT-D020 | Canonical equality | `CANONICAL SCIENTIFIC SHA-256 EXACT` | Prototype-sensitive runtime equality is not a scientific gate. |
| BECT-D021 | Resource ceilings | `FROZEN` | Ceiling failure is fail-closed; no seed extension/root replacement. |
| BECT-D022 | Execution integrity | `MAX 1 SCIENTIFIC EXECUTION PER FRESH STAGE` | Lease, trigger, source binding, artifact-before-mirror, exact-byte recovery and audit required. |
| BECT-D023 | No-rescue | `FROZEN` | Activates at first fresh generation/read; same-evidence rescue prohibited. |
| BECT-D024 | Protected depth-10 | `SEALED / NOT GENERATED / NOT READ` | No generation/read/peek/partial enumeration/resource peek. |
| BECT-D025 | Main integration | `EXPLICIT USER INSTRUCTION REQUIRED` | Research branch is not merged automatically. |

## Stage progression boundary

Stage 0 PASS alone does not authorize Stage 1. Stage 1 scientific execution requires a separate post-Stage-0 authorization review and explicit Stage 1 authorization artifact.

Stage 2 requires valid Stage 1 completion, a nonempty frozen promoted set and a separate Stage 2 authorization review.
