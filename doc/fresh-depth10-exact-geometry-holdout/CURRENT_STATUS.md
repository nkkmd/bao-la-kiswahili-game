# FDEGHV-STUDY1 — CURRENT STATUS

更新日: 2026-09-04

## Current state

```text
Program = Research Generation 3 / G3-11
Study = FDEGHV-STUDY1
Program authorization = G3-11-AUTHORIZED
Lifecycle = CLOSED / FORMAL-COMPLETE
Reviewed main anchor = e537199a959c0808cbef6cf8aaeb1caab91e3702
Research branch = research/g3-11-fresh-depth10-exact-geometry-holdout
Stage 0 = FDEGHV-S0-TECHNICAL-2026-09-04-v1 / STAGE0-PASS / scientific access false
Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / FORMAL-COMPLETE / 1 authorized / 1 actual
Formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
Protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
Same-evidence rerun = NOT AUTHORIZED
Depth-11 access = PROHIBITED / NOT ACCESSED
G2-12 estimator scientific input = PROHIBITED / NOT USED
Main integration = COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false
```

## Formal result

```text
H1 = DEEPER-CONFIRMED / 348270 == 348270
H2 = DEEPER-CONFIRMED / 494456 > 348270
H3 = DEEPER-CONFIRMED / 64913155557 > 61644248915
H4 = DEEPER-CONFIRMED / duplicate arrivals 11725 / multi-predecessor states 10383
```

Exact cumulative domain through depth 10:

```text
distinct RAW states = 451127
depth-labelled legal edges = 466768
unique RAW graph edges = 466768
tree-node occurrences = 631101
tree-edge occurrences = 631100
cumulative RAW state-set SHA-256 = 7cff40d1c55876555bd3dc07cb0836bc209ed83554847ab297a51e3fb95748f7
canonical scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
```

Materialized verificationは11 reachable layers / 10 parent layersでPASSし、materially separate independent full exact depth-10 re-enumerationもPASSした。Production、independent、final artifact resource gatesはいずれもfrozen ceiling内でPASSした。

## No-rescue boundary

Protected evidence opening後のno-rescue boundaryはactiveである。same-Study rerun、resource ceiling increase、endpoint change、subset promotion、root replacement、symmetry/canonicalization rescue、G2-12 prediction use、depth-11 extensionを行わない。

G3-11はG3-04/G3-07/G3-10等の既存formal decisionを変更しない。Depth 11が必要なら別のfresh prospective Studyとして新しいauthorization reviewを要する。

## Repository state

Study-local final report、decision register、reproducibility index、program closure decision、RG3 closure checkpoint、およびcurrent-facing central documentationはresearch branch上で同期済みである。

```text
final documentation sync run = 33839438986 / success
scientific recomputation during documentation sync = false
historical PROGRAM_PLAN Git blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac / UNCHANGED
```

`main` integrationは科学的closureとは別操作であり、2026-09-04の明示的ユーザー指示に基づき`COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false`として完了した。
