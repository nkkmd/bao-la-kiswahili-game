# 2026-09-04 — G3-11 / FDEGHV-STUDY1 formal-complete closure

## Decision

Research Generation 3 `G3-11` / `FDEGHV-STUDY1`を、以下のformal dispositionでcloseする。

**`CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`**

Endpoint-level decisions:

```text
H1-EXACT-DEPTH-NOVELTY-CONTINUATION = DEEPER-CONFIRMED
H2-LAYER-TREE-RAW-DIVERGENCE-CONTINUATION = DEEPER-CONFIRMED
H3-CUMULATIVE-TREE-RAW-INFLATION-CONTINUATION = DEEPER-CONFIRMED
H4-TRANSPOSITION-PERSISTENCE = DEEPER-CONFIRMED
```

`FORMAL-COMPLETE`はStudy lifecycle labelであり、Bao全状態空間・全ゲーム木・depth 11以深を解いたことを意味しない。

## Basis

Formal Stage:

```text
Stage = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1
Actions run = 33837413663
run number = 1
workflow conclusion = success
protected evidence execution count = 1 / 1 authorized
complete reachable layers = 0..10
complete parent expansion layers = 0..9
production materialization verification = PASS
full independent exact depth-10 re-enumeration = PASS
resource gates = PASS
artifact finalization gate = PASS
```

Exact domain summary:

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
depth-10 duplicate arrivals = 11725
depth-10 multi-predecessor states = 10383
cumulative distinct RAW states through depth 10 = 451127
cumulative tree-node occurrences through depth 10 = 631101
depth-labelled legal edges through parent depth 9 = 466768
```

Canonical identity:

```text
scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
production result-core SHA-256 = 13f42d92549b9f796ef963aad3883f72bf63e27908cee2245d1dd4b8b73e4876
independent core SHA-256 = 2e913c8458037db33de0083981bf4442316bb28d7bf7dc4d05419b8e4a0057d5
verified Actions artifact ID = 9923817605
verified artifact digest = sha256:d7c5b87954fdc472e989f27ef30389fcda7fe6196e8ab86493fdd9a080b94ff5
exact-byte compact mirror commit = 498cd3a0210169f8a692c52d6961c317d20ae81e
```

## H1–H4

H1:

```text
348270 == 348270
```

H2:

```text
494456 > 348270
```

H3 exact cross-product:

```text
64913155557 > 61644248915
```

H4:

```text
duplicateArrivalCount[10] = 11725 > 0
statesWithMultiplePredecessors[10] = 10383 > 0
```

したがって、4 targetはいずれもfrozen decision ruleにより`DEEPER-CONFIRMED`である。

## Stage 0 treatment

Stage 0 technical controlsは`STAGE0-PASS`。Actions run `33834641015`はPASS artifact upload後のdocumentation sync defectによりworkflow全体としてfailureになったが、protected depth-10 access前のcontrol-plane failureであり、Stage 0 executionそのものは再実行していない。

Stage 0 canonical result SHA-256:

`cbe1a078568a4d1162c9703dc089c1f9413cb0c2f34dd4f0b2925550ef3e1ea9`

## Interpretation boundary

本decisionは、standard initial RAW rootのcomplete exact depth-10 domainにおいて、prospectively fixed H1–H4が成立したことを確定する。

本decisionは次を意味しない。

- Bao全状態空間または全ゲーム木の規模確定
- depth 11以深への外挿
- symmetry-reduced / canonicalized exact count
- G3-04 phase contrastの再判定
- G3-07 search-condition associationの再判定
- G3-10 longitudinal trajectory claimの再判定
- G2-12 estimatorのvalidationまたは復活
- causal mechanism、human difficulty、game-theoretic valueの確認

## Immutable boundaries after evidence opening

- protected depth-10は`OPENED / CONSUMED EXACTLY ONCE`である。
- same-evidence rerunを行わない。
- resource ceilingを結果後に増加しない。
- targetを変更しない。
- subset/root replacementで救済しない。
- symmetry/canonicalizationを事後導入しない。
- G2-12 estimatorをscientific inputとして使用しない。
- depth 11へ延長しない。必要なら別Studyとする。
- upstream formal decisionsを変更しない。
- historical `doc/research-generation-3/PROGRAM_PLAN.md`を変更しない。

## Repository boundary

このdecisionはscientific closureを確定するが、`main` integrationをauthorizeしない。

```text
main integration = NOT AUTHORIZED / NOT PERFORMED
```

明示的ユーザー指示があるまで、G3-11成果はresearch branch上に保持する。