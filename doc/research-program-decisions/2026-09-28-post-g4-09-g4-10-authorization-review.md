# 2026-09-28 — post-G4-09 current-state G4-10 認可レビュー

Review ID: `G4-10-AUTHORIZATION-REVIEW-2026-09-28-V1`  
Agenda: `Research Generation 4 / G4-10`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `7eb59518753d9b8846d5ccf32246aba1b4b301cc`  
Research branch: `research/g4-10-fresh-depth11-exact-reachability-topology`  
判定: **`G4-10-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
fresh depth-11 scientific access: **0 / NOT AUTHORIZED YET**  
formal scientific outcome: **NOT GENERATED**  
public AI change: **NOT AUTHORIZED**  
`main` integration: **NOT AUTHORIZED BY THIS REVIEW**

## 1. 審査対象

G4-10はResearch Generation 4 Wave Dのprotected deeper exact trackである。

Program Planで固定された日本語作業名は次である。

**Bao standard initial RAW rootのfresh depth-11 exact reachability topology — novelty、transposition、tree/graph divergenceの独立deeper検証**

中心課題は次である。

> standard initial RAW rootからのcomplete exact depth 11において、新規RAW state、tree occurrence、duplicate arrival、multi-predecessor state、tree/RAW divergenceはどのようなexact topologyを形成するか。

本レビューはdepth 11の科学結果を生成しない。G4-09完了後のcurrent state、G3-11 depth-10 protected evidenceとの境界、RAW identity、resource / stopping / partial-result規則、independent full re-enumeration要件、Actions実行方針を、protected depth-11 scientific accessより前に審査する。

## 2. current-state prerequisite

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING / MAIN INTEGRATED
G4-07 = COMPLETE / FORMAL-COMPLETE / MAIN INTEGRATED
G4-08 = CLOSED / FORMAL-COMPLETE / MAIN INTEGRATED
G4-09 = CLOSED / MODULE-A-NOT-ELIGIBLE-FOR-FORMAL-HOLDOUT / MODULE-B-FIXED8-EXACT-CENSUS-COMPLETE / MAIN INTEGRATED
G4-10 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED before this review
G4-P01 = INDEPENDENT / NOT-AUTHORIZED
G4-H01 = DEFERRED
public AI change authorized by RG4 = false
```

G4-09のclosureとmain integrationはG4-10を自動認可しない。G4-10は独立したprotected Studyとして、新しいStudy identity、Stage identity、source binding、resource ceiling、停止条件、partial-result rule、独立再列挙経路をfreezeする必要がある。

## 3. G3-11 depth-10との境界

G3-11 `FDEGHV-STUDY1`はstandard initial RAW rootからdepth 10までを完全列挙し、productionとmaterially separate independent full re-enumerationのexact agreementを確認した。

canonical historical result:

```text
formal decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
G4-10 depth 11 = previously NOT AUTHORIZED / NOT ACCESSED
cumulative RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
cumulative tree-node occurrences through depth 10 = 631101
production observed peak RSS = 2269167616 bytes
independent observed peak RSS = 2460262400 bytes
production elapsed = 108.530371328 seconds
independent elapsed = 117.592820799 seconds
uncompressed scientific artifact = approximately 369 MB
```

G4-10はG3-11をrepair、reopen、same-evidence rerun、target rescueするStudyではない。

ただしcomplete depth-11 exact enumerationは定義上、standard rootから0..11を構築するため0..10 prefixを新Studyの内部基盤として再構築する。これは次の条件でのみ許容候補とする。

```text
standalone G3-11 rerun = PROHIBITED
G3-11 formal decision reevaluation = PROHIBITED
G3-11 H1..H4 redecision = PROHIBITED
G3-11 artifact/result replacement = PROHIBITED
G4-10 own complete 0..11 reconstruction = REQUIRED FOR COMPLETE DOMAIN
0..10 prefix use = technical integrity / complete-domain substrate only
```

preregistrationでは、G3-11の保存済みlayer / edge digestをG4-10 prefix-integrity checkへ使うかどうかをoutcome-blindに固定する。使う場合もG3-11のscientific conclusion再評価には使用しない。

## 4. 「depth 11」と呼ばれる既存search artifactとの分離

repositoryにはjoseki / search系で`depth 11`と呼ばれるhistorical artifactが存在する。これはlimited search depth、candidate evaluation、engine scoreを扱うものであり、standard initial RAW rootからのcomplete exact reachable-state enumerationではない。

したがって:

```text
historical search depth-11 = SEARCH OUTPUT / NOT G4-10 EXACT TOPOLOGY
complete RAW reachability layer 11 = NOT READ BY THIS REVIEW
complete RAW depth-11 state count = UNKNOWN TO THIS REVIEW
complete depth-11 edge / tree / transposition topology = UNKNOWN TO THIS REVIEW
```

search-depth artifactをG4-10 scientific prior、expected count、resource-fit target、truth sourceへ使用しない。

## 5. authoritative scientific identity

G4-10のauthoritative state identityはResearch Generation 4 common contractを維持する。

```text
state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
symmetry reduction = false
canonicalization-based state collapse = false
```

move / transition identityは既存exact enumeration contractとの互換性をStage 0で確認する。未検証のsymmetryやG4-P01将来結果を先取りしてstate reductionへ使わない。

## 6. G4-10のprospective Study identity候補

preregistrationで正式freezeする候補を次とする。

```text
Study ID = FDERT-STUDY1
English title = Fresh Depth-11 Exact Reachability Topology Study 1
Japanese title = Bao standard initial RAW rootのfresh depth-11 exact reachability topology — novelty、transposition、tree/graph divergenceの独立deeper検証
research branch = research/g4-10-fresh-depth11-exact-reachability-topology
evidence class = FRESH-DEEPER-EXACT-HOLDOUT
authoritative state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
```

`FDERT-STUDY1`はG3-11のversion incrementではなく、Research Generation 4の新規独立Studyである。

## 7. Stage構成

最低2段階とする。

### Stage 0 — TECHNICAL / NO DEPTH-11 SCIENTIFIC ACCESS

Stage 0はtechnical-onlyであり、complete depth-11 scientific evidenceを生成・readしてはならない。

Stage 0で固定・検証する候補:

- source SHA / branch / engine binding
- standard initial RAW root identity
- production enumerator semantics
- materially separate independent enumerator semantics
- synthetic / shallow fixed fixtureによるset・edge・tree・arrival accounting
- zero / duplicate / multi-predecessor negative controls
- exact integer / rational comparison logic
- resource ceiling enforcement path
- wall-clock / RSS / artifact cap failure path
- partial-result quarantine
- durable one-shot authorization / lease semantics
- artifact manifest / digest / post-execution verification path
- GitHub Actions runnerでのexecution survivability

Stage 0はdepth 11へのpartial probe、count probe、memory probe、sampled expansion、one-parent-layer probeを行わない。

### Stage 1 — PROTECTED EXACT HOLDOUT

Stage 1だけがcomplete depth-11 scientific access候補となる。

Stage 1は別authorizationを必要とし、次がdurably frozenになるまで開始しない。

```text
Study / Stage IDs
source/code freeze
standard root identity
complete-domain endpoint
metric schema
resource ceilings
stopping rules
partial-result rule
production implementation
materially separate independent full re-enumeration
one-shot authorization / durable lease
artifact retention / digest contract
post-execution verification
```

## 8. Stage 1 exact-domain endpoint候補

formal scientific endpointの中心はsample inferenceではなく、frozen complete finite domainのexact censusである。

preregistrationで少なくとも次を固定する候補とする。

```text
root = standard initial RAW state
target depth = 11
complete reachable layers = 0..11
complete parent expansion layers = 0..10
RAW-only = true
symmetry reduction = false
canonicalization collapse = false
```

exact topology output family候補:

- per-layer unique RAW state count
- per-layer new RAW state count relative to cumulative prior layers
- cumulative distinct RAW state count
- parent-layer legal edge count
- exact RAW graph edge set / depth-labelled edge set digest
- tree-node / tree-edge occurrence count
- duplicate arrival count
- predecessor multiplicity / multi-predecessor state count
- branching distribution at parent depth 10
- layer and cumulative tree/RAW relation
- exact set / edge / topology digests

G3-11で成立したdirectional continuationを当然視しない。G4-10ではdepth-11 actual topologyをexact censusとして記録し、directional checkをformal claimにする場合はprotected access前に別途prospectively freezeする。

## 9. independent verification contract

exact-complete labelにはmaterially separate full independent enumerationを要求する。

independent実装はproduction enumerator、production serializer、production scientific aggregation logicをそのままimportしてはならない。

少なくとも独立に再構築・照合する候補:

- standard root RAW identity
- exact RAW-state set for every layer 0..11
- cumulative RAW-state set
- exact legal transition relation for parent layers 0..10
- per-layer / cumulative tree occurrences
- duplicate-arrival / predecessor multiplicity
- parent-depth-10 branching distribution
- per-layer / cumulative state / edge digests
- frozen exact topology descriptors

production-only completion、partial independent verification、prefix-only verificationでは`EXACT-WITHIN-FROZEN-DEPTH-11-DOMAIN`を付与しない。

## 10. resource planning boundary

G4-10はprotected holdoutであり、resource ceilingをactual depth-11 resultに合わせて調整してはならない。

利用可能なplanning evidenceは次に限定する。

- G3-11までのpublished / canonical depth<=10 exact telemetry
- current implementationのtechnical benchmark
- synthetic / shallow Stage 0 fixture
- selected execution environmentのdocumented administrative limits

禁止:

```text
depth-11 partial enumeration for sizing = PROHIBITED
depth-11 count probe = PROHIBITED
depth-11 RSS probe = PROHIBITED
G2-12 estimator revival = PROHIBITED
historical search-depth-11 nodes/time as topology sizing input = PROHIBITED
post-access cap increase = PROHIBITED
```

numerical Stage 1 resource ceilingはpreregistration / Stage 1 authorizationでfreezeする。本レビューではまだ科学accessを認可しないため、ceilingをactual depth-11 evidenceに接触せず設計する余地を残す。

## 11. GitHub Actions execution policy

現在のResearch Generation 4運用に合わせ、長時間または中断耐性が必要なtechnical / formal executionは**GitHub Actionsを第一候補**として設計する。

ただしStage 1 protected exact runをActionsへ載せるのは、Stage 0で次を確認できた場合だけとする。

- frozen ceilingをrunner環境でenforceできる
- artifactがlossしないretention pathを持つ
- remote branch競合でrunner-local canonical resultを失わない
- one-shot leaseが重複実行を防げる
- timeout / cancellationをnegative scientific resultへ変換しない
- productionとindependentの両方をcompleteに実行できる設計が成立する

Actionsがpre-access technical reviewで不適格と判定された場合、depth-11をprobeせず、別execution environmentを新しいauthorizationで固定する。

## 12. stopping / partial-result rule

Stage 1ではfail-closedを必須とする。

exact completion候補:

**`EXACT-WITHIN-FROZEN-DEPTH-11-DOMAIN`**

必要条件:

- complete 0..11 materialization
- complete parent 0..10 expansion
- all frozen resource / integrity checks PASS
- production / independent full exact agreement
- artifact integrity PASS

resource / administrative cutoff:

**`NON-ESTIMABLE`**

partial layers、partial parent expansion、prefix counts、partial hashesはdiagnostic provenanceとして保存できるが、formal depth-11 topology resultへ昇格しない。

technical / integrity defect:

**`TECHNICAL-INVALID`**

source mismatch、enumeration defect、digest defect、resource-classification defect、production / independent disagreement、lease / one-shot integrity failureなどを含む。

## 13. no-rescue boundary

最初のprotected depth-11 scientific access後は、same Study/version内で次を禁止する。

- resource ceiling increase
- wall-clock extension
- target depth変更
- depth 12追加
- endpoint change
- favorable subset claim
- symmetry / canonicalization rescue
- production-only exact promotion
- independent implementation relaxation
- root replacement
- same-evidence rerun / repair
- G2-12 estimatorによるreinterpretation
- partial resultをcomplete resultへ昇格

resource不足が事前固定ceilingで生じた場合は`NON-ESTIMABLE`として閉じる。technical defectは`TECHNICAL-INVALID`として閉じる。outcomeを見た後に条件を緩めない。

## 14. interpretation boundary

G4-10がexact-completeになっても、確立できるのはstandard initial RAW rootからfrozen depth 11までのcomplete exact reachability topologyに限定される。

確立しないもの:

- depth 12以深
- Bao全状態空間または全game tree size
- whole-Bao asymptotic growth law
- symmetry-reduced size
- game-theoretic value
- best move correctness
- search strength
- human difficulty
- causal mechanism
- public AI improvement

G4-10 resultから公開AI変更を自動認可しない。

## 15. pre-access audit requirements

Stage 1 authorization前に少なくとも次を監査する。

```text
reviewed main SHA = exact match
research branch ancestry = exact match
G4-10 Study / Stage IDs = frozen
protected depth-11 access before authorization = 0
G3-11 standalone rerun = 0
G2-12 estimator input = 0
symmetry reduction = false
validated transform set = []
production / independent structural separation = PASS
resource ceilings = frozen
stopping / partial-result rules = frozen
one-shot / durable lease = PASS
actions artifact retention path = PASS
public AI change authorization = false
main integration authorization = false
```

## 16. authorization conclusion

G4-09はclosed / main integratedであり、G4-10はProgram Plan上の次のprotected core agendaである。G3-11 depth-10 exact resultはimmutable historical prerequisiteとして利用できるが、same-evidence rerunやredecisionは認めない。existing search-depth-11 artifactはG4-10 complete exact topologyとは別constructであり、protected holdoutを開いたものとは扱わない。

現時点では、outcome-blindなpreregistration、Stage 0 technical implementation、source / identity / resource / one-shot infrastructureの準備を開始できる。

Therefore:

# `G4-10-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`

この認可はcomplete depth-11 scientific enumerationを認可しない。protected depth-11 accessは、Stage 0 PASS後に、resource ceiling・停止条件・partial-result rule・independent full re-enumeration・one-shot leaseを含むStage 1 preregistrationと別authorizationがdurably frozenされた場合に限り解禁候補となる。
