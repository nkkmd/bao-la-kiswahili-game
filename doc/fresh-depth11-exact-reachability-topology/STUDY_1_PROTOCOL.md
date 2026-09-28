# FDERT-STUDY1 — Study 1 Protocol

更新日: 2026-09-28

## 1. Study identity

```text
Program = Research Generation 4 / G4-10
Study ID = FDERT-STUDY1
Stage 0 = FDERT-S0-TECHNICAL-2026-09-28-v1
Stage 1 candidate = FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1
Reviewed main anchor = 7eb59518753d9b8846d5ccf32246aba1b4b301cc
Research branch = research/g4-10-fresh-depth11-exact-reachability-topology
```

## 2. Formal question

standard initial Bao RAW rootからcomplete exact depth 11を、symmetry reductionやcanonicalization collapseを用いず、productionとmaterially separate independent full re-enumerationで構築できるか。また、そのfrozen finite domainにおけるnovelty、transposition、tree/graph divergenceはどのようなexact topologyを形成するか。

本StudyはG3-11 `FDEGHV-STUDY1`の再実行、repair、version incrementではなく、新しいprotected deeper exact Studyである。

## 3. Evidence classes

```text
Stage 0 = TECHNICAL-FIXTURE / HISTORICAL-REFERENCE ONLY
Stage 1 = FRESH-DEEPER-EXACT-HOLDOUT
```

Stage 0はsynthetic controlと浅いreal fixtureだけを使用し、complete depth-11 scientific evidenceを生成・readしない。

Stage 1だけがprotected depth-11 scientific evidenceへアクセスできる候補である。Stage 0 PASSはStage 1を自動認可しない。

## 4. Representation contract

Authoritative state identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded identity fields:

```text
turn,reason
```

Move identity:

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

Boundary:

```text
mode = RAW-ONLY
validated transform set = []
symmetry reduction = false
canonicalization-based deduplication = false
seat-swap equivalence = false
left/right quotient = false
```

## 5. Exact domain contract candidate

Stage 1 authorization前に最終freezeする候補は次である。

```text
root = public/engine.js initialState() reconstructed fresh in the authorized run
required root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 11
complete reachable layers = 0..11
complete parent expansion layers = 0..10
complete forward closure to terminal = not required
```

Stage 0ではtarget depth 11、depth-11 successor、count、partial probe、memory probeを一切生成しない。

## 6. G3-11 boundary

G3-11 depth-10 evidenceはhistorical closed evidenceであり、same-evidence rerunは禁止されたままとする。

G4-10 complete 0..11 enumerationでは定義上0..10 prefixを新Study内部で再構築する必要があるが、これはG4-10 complete-domain substrate / integrity checkとしてのみ扱う。

禁止事項:

- G3-11 formal decisionの再判定
- G3-11 H1..H4の再判定
- G3-11 result/artifactの置換
- standalone depth-10 scientific rerun
- depth-10 resultをG4-10 outcomeの予測値として使用

G3-11保存済みdigestをStage 1 prefix-integrity checkへ使用する場合は、protected depth-11 access前に用途をfreezeする。

## 7. Stage 0 technical contract

Stage 0は次のみを検証する。

1. current source / engine / enumerator binding
2. standard initial RAW root identity
3. depth-2 production exact positive fixture
4. depth-2 independent materialized verification
5. depth-2 independent full recomputation agreement
6. unique-state / work / tree / artifact capのfail-closed path
7. final-resource gateのsynthetic boundary
8. corrupted completion metadata rejection
9. partial-result quarantine / classification semantics
10. production / independent static separation
11. GitHub Actions artifact retention path
12. `protectedDepth11Access=false`

Stage 0のmaximum real fixture depthは2に固定する。

## 8. Stage 1 exact topology output family candidate

Stage 1 authorization前に正式freezeする候補:

- per-layer unique RAW state count
- per-layer new RAW state count
- cumulative distinct RAW state count
- parent-layer legal edge count
- RAW graph / depth-labelled edge digests
- tree-node / tree-edge occurrence count
- duplicate arrival count
- predecessor multiplicity / multi-predecessor state count
- parent-depth-10 branching distribution
- layer / cumulative tree-to-RAW relation
- per-layer / cumulative set and topology digests

G3-11で確認されたdirectionを当然視しない。directional continuationをformal targetにする場合は、depth-11 access前に別途固定する。

## 9. Independent verification contract

exact-complete labelにはmaterially separate full independent enumerationを要求する。

Independent implementationはproduction enumerator、production serializer、production scientific aggregation logicをそのままimportしてはならない。

Stage 1で少なくとも独立再構築・照合する候補:

- standard root RAW identity
- exact RAW-state set for layers 0..11
- cumulative RAW-state set
- exact legal transition relation for parent layers 0..10
- tree occurrence propagation
- duplicate-arrival / predecessor multiplicity
- parent-depth-10 branching distribution
- per-layer / cumulative state / edge digests
- frozen topology descriptors

production-only completion、prefix-only independent verification、partial independent verificationではexact-completeとしない。

## 10. Resource planning boundary

Stage 1 numerical resource ceilingはdepth-11 evidenceに接触する前にfreezeする。

利用可能:

- canonical G3-11 depth<=10 telemetry
- Stage 0 shallow fixture
- execution environmentのadministrative limits
- current implementationのnon-depth-11 technical behavior

禁止:

- depth-11 partial enumeration for sizing
- depth-11 count probe
- depth-11 RSS probe
- G2-12 estimator revival
- historical engine search-depth-11をexact topology sizingへ利用
- first protected access後のcap increase

## 11. Decision rule candidate

Stage 1正式freeze時に最終確定する。

```text
complete 0..11 + complete parent 0..10 + resource/integrity PASS + full independent exact agreement
  => EXACT-WITHIN-FROZEN-DEPTH-11-DOMAIN

frozen resource/admin ceiling prevents completion with integrity classification valid
  => NON-ESTIMABLE

source/integrity/serialization/resource-classification/independent-agreement defect
  => TECHNICAL-INVALID
```

Partial resultはdiagnostic provenanceに限定し、formal topology resultへ昇格しない。

## 12. No-rescue rule

最初のprotected depth-11 access後、same Study/versionでは次を禁止する。

- resource ceiling increase
- wall-clock extension
- target depth change
- depth 12追加
- endpoint change
- favorable subset claim
- symmetry/canonicalization rescue
- production-only exact promotion
- independent requirement relaxation
- root replacement
- same-evidence rerun / repair
- G2-12 estimatorによるreinterpretation
- partial resultのcomplete promotion

## 13. Interpretation boundary

G4-10がexact-completeでも確立するのは、standard initial RAW rootからfrozen depth 11までのcomplete exact reachability topologyだけである。

確立しないもの:

- depth 12以深
- Bao全状態空間 / 全game tree size
- asymptotic growth law
- symmetry-reduced size
- game-theoretic value
- best move correctness
- search strength
- human difficulty
- public AI improvement

## 14. Repository workflow

1. current main identity / authorization review記録
2. Study protocol / Stage 0 technical spec freeze
3. Stage 0 implementation / source binding freeze
4. Stage 0 one-shot authorization
5. GitHub Actions technical execution
6. artifact-only verificationとcanonical Stage 0 record
7. Stage 0 closure
8. 別途Stage 1 design / resource / source / metric freeze
9. Stage 1 pre-access audit
10. 別途protected Stage 1 authorization / durable lease
11. exactly one protected scientific execution
12. canonical result / closure / cross-document audit
13. stop before `main` integration
