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
| BECT-D012 | Stage 1 seeds | `31510001..31510240 / NOT CONSUMED` | Reserved fresh development namespace. |
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
| BECT-D026 | M5 denominator clarification | `PROSPECTIVE / PRE-STAGE0` | M5 denominator is exactly `sum uniqueTransitionCount[d], d=0..4`; clarification occurred before any fixture or fresh evidence. |
| BECT-D027 | Stage 0 v1 execution | `TECHNICAL-INVALID / NO RERUN` | Run `33631597307`; fixed technical pair 24->25 was unavailable because technical trajectory terminated early. No fresh scientific evidence was accessed. |
| BECT-D028 | Stage 0 v2 technical refreeze | `AUTHORIZED AS NEW TECHNICAL VERSION` | Scientific contract unchanged; technical pair selection alone changed to latest consecutive nonterminal post-move root pair. |
| BECT-D029 | Stage 0 v2 execution | `STAGE0-PASS` | Run `33632094597`; exactly one v2 execution; technical roots 22->23; all mandatory longitudinal/cross-implementation gates passed. |
| BECT-D030 | Stage 0 artifact durability | `PASS` | Artifact `9847240252`, ZIP SHA-256 `ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f`; repository result mirror uses exact artifact bytes only. |
| BECT-D031 | Stage 0 execution count | `PASS` | v1 = 1 authorized/1 actual; v2 = 1 authorized/1 actual; no same-version rerun. Static audits are non-computational and not Stage 0 fixture executions. |
| BECT-D032 | Stage 0 closure | `COMPLETE / STAGE0-PASS VIA v2` | Longitudinal technical readiness established; Stage 1 remains separately gated. |
| BECT-D033 | Post-Stage-0 Stage 1 review | `PREPARATION-AUTHORIZED / SCIENTIFIC-NOT-YET-AUTHORIZED` | Fresh-free identity/firewall/control-plane work may proceed; Stage 1 seed remains sealed. |
| BECT-D034 | Stage 1 coverage / identity clarification | `PROSPECTIVE / PRE-FRESH` | Coverage requires defined metric at all 48 roots of all 10 trajectories; full/prefix/segment/pair/event-window identities are fixed deterministically. |
| BECT-D035 | Upstream identity firewall | `PASS / FROZEN` | 124 RAW roots, 124 trajectory identities, 67 opening-prefix identities; identity core `5b8246ba...b7417`; scientific outcome fields retained=false. |
| BECT-D036 | Stage 1 implementation separation | `FROZEN` | Production and independent selectors/measurement/aggregation implementations bind only to corresponding upstream implementation families. |
| BECT-D037 | Stage 1 static audit | `PASS` | Run `33635090198`; source blobs, syntax, separation, prereg and protected-evidence boundary passed without seed access. |
| BECT-D038 | Stage 1 tooling smoke v1 | `TECHNICAL ASSERTION FAILURE / NO SCIENTIFIC CONSEQUENCE` | Run `33635334088`; unarmed runner fail-closed passed; only literal-count assertion failed; no seed access. |
| BECT-D039 | Stage 1 tooling smoke v2 | `PASS` | Run `33635443176`; unarmed fail-closed, single trigger, concurrency, lease declaration and artifact-before-mirror path passed. |
| BECT-D040 | Stage 1 source validation | `PASS` | Run `33635524477`; exact source bindings and preauthorization state passed with no fresh evidence. |
| BECT-D041 | Durable lease-path smoke | `PASS` | Run `33635710262`; technical marker was durably pushed as commit `a588dbba...8037`; scientific trigger did not fire. |
| BECT-D042 | Stage 1 preauthorization execution count | `PASS / ZERO SCIENTIFIC RUNS` | No Stage 1 authorization, execution trigger, scientific lease or result exists; `BECT Stage 1 Development` runs = 0. |
| BECT-D043 | Stage 1 authorization eligibility | `ELIGIBLE` | Separate explicit `STAGE1-AUTHORIZED / EXACTLY ONE EXECUTION` artifact may now be created. |

## Stage 0 version history

`BECT-S0-TECHNICAL-2026-09-02-v1` remains permanently `TECHNICAL-INVALID`. It was not retried after its one authorized execution.

`BECT-S0-TECHNICAL-2026-09-02-v2` is a separate technical version created before any fresh scientific evidence. Its scientific Study contract, endpoint universe, transition grammar, Stage 1/2 seeds/populations/tests/resource ceilings and protected-evidence boundary are identical to the original prospective contract. Only the technical fixture root-selection rule changed.

Stage 0 v2 formal result:

```text
run = 33632094597
result = STAGE0-PASS
technical seed = 31500001 / permanently prohibited from scientific use
observed technical trajectory length = 24
technical root pair = 22 -> 23
canonical deterministic core = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
fresh scientific evidence = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

## Stage 1 preauthorization boundary

Post-Stage-0 review authorized preparation only. Before any Stage 1 authorization, the following were completed without fresh seed access:

```text
identity firewall materialization = 33634116550 / PASS
identity firewall exact mirror = 33634259594 / PASS
static audit = 33635090198 / PASS
tooling smoke v1 = 33635334088 / static assertion failure only
tooling smoke v2 = 33635443176 / PASS
source validation = 33635524477 / PASS
durable lease-path smoke = 33635710262 / PASS
scientific workflow executions before authorization = 0
```

The v1 tooling-smoke failure occurred after the unarmed-runner fail-closed check had already passed and did not access Stage 1/2 seeds. It was corrected pre-fresh by narrowing a static grep assertion to the YAML trigger declaration line.

## Stage progression boundary

Stage 1 is now authorization-eligible but not yet authorized at this register state. A separate authorization artifact must bind the exact preauthorization branch HEAD and frozen scientific source blobs, set `maxScientificExecutions=1`, and name the Stage 1 seed block.

Stage 2 requires valid Stage 1 completion, a nonempty frozen promoted set and a separate Stage 2 authorization review.
