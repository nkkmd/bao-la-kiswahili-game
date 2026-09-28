# G4-10 / FDERT-STUDY1 — 最終報告

更新日: 2026-09-28  
正式判定: **`NON-ESTIMABLE / UNIQUE_STATE_CAP`**

## 1. 研究目的

G4-10はResearch Generation 4のprotected deeper exact trackとして、standard initial RAW rootからcomplete exact depth 11までのreachable-state topologyを構築し、fresh layerにおけるnovelty、tree/graph divergence、transpositionをexactに記述できるか検証した。

G3-11 depth-10 exact Studyとは別Studyであり、G3-11のformal decision、H1〜H4、artifactを再判定・置換しない。

## 2. 事前固定した主要条件

```text
Study ID = FDERT-STUDY1
Stage = FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1
root = standard initial RAW root
target depth = 11
RAW-only = true
validated transform set = []
symmetry reduction = false
canonicalization collapse = false
scientific executions authorized = 1
depth 12 access = false
same-evidence rerun = false
```

主要resource ceiling:

```text
max cumulative distinct RAW states = 2000000
max depth-labelled edges = 12000000
max parent expansions = 2000000
max move evaluations = 12000000
max cumulative tree-node occurrences = 50000000000
max RSS = 12884901888 bytes
max wall clock per enumerator = 7200 s
max uncompressed production artifact = 2147483648 bytes
```

## 3. Stage 0とpre-access gate

protected evidenceを開く前に次を完了した。

- Stage 0 v1: self-referential technical guardのfalse positiveで`TECHNICAL-INVALID`。protected evidence消費0。再実行せず閉じた。
- Stage 0 v2: technical controls PASS。real fixture最大depth 2。
- Stage 0 v3: bounded-memory enumerator hardening PASS。旧enumeratorとのdepth-2 topology / state JSONL / edge JSONLがexact一致。
- Stage 1 pre-access audit: PASS。
- Stage 1 source freeze: PASS。

この時点までdepth-11 scientific accessは0だった。

## 4. Scientific execution

Actions run:

```text
run = 36368880428
attempt = 1
trigger SHA = 787105a3016bac1172e669faf400fcc7cdd70dd5
lease = PASS
production = completed / artifact preserved
independent = completed / compact result preserved
workflow conclusion = success
```

lease jobはscientific computation前にone-shot authorizationをdurably consumeした。したがって実行後にsame Study/versionを再試行する権限は残っていない。

## 5. Production result

productionはdepth 0〜10を完全再構築した。

depth 10 complete後、depth 11を構築している途中でprospectively frozen state ceilingへ到達した。

```text
targetDepth = 11
targetComplete = false
lastCompleteDepth = 10
firstIncompleteDepth = 11
stopReason = UNIQUE_STATE_CAP
technicalStopClassification = RESOURCE-LIMIT
```

resource ceilingは`maxCumulativeDistinctRawStates = 2,000,000`である。

partial depth-11 layerはcompleteとしてcommitされず、formal topology resultに含めていない。

## 6. Integrity result

### G3-11 historical prefix binding

G4-10でfresh reconstructionしたcomplete 0..10 prefixは、G3-11 canonical exact prefixと完全一致した。

```text
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
integrity = PASS
```

### Independent verification

production materialized state/edge filesのhash verificationはPASSした。

productionがdepth 11 completeではなかったため、independent側はfresh depth-11 exact outcomeを完成させる目的で続行せず、productionがcompleteと主張したprefix through depth 10をmaterially separate implementationで独立再列挙した。

```text
independent complete-prefix verification = PASS
integrityPassed = true
full independent exact depth-11 recomputation = not performed
```

これはpartial resultを救済するためではなく、`NON-ESTIMABLE` closureに必要なcomplete-prefix integrityを確認するための事前固定経路である。

## 7. Formal decision

正式判定:

**`NON-ESTIMABLE`**

事前固定したT1〜T4:

| Target | 内容 | 判定 |
| --- | --- | --- |
| T1 | depth-11 novelty continuation | `NON-ESTIMABLE` |
| T2 | depth-11 tree/RAW divergence | `NON-ESTIMABLE` |
| T3 | cumulative tree/RAW inflation continuation | `NON-ESTIMABLE` |
| T4 | depth-11 transposition / multi-predecessor persistence | `NON-ESTIMABLE` |

complete depth-11 layerがないため、いずれも`DEEPER-CONFIRMED`または`COUNTEREXAMPLE-BOUNDARY`へ分類しない。

## 8. Complete prefixとして検証されたexact topology

fresh G4-10 reconstructionでcompleteとして確認でき、かつhistorical G3-11 exact prefixと一致した範囲:

```text
cumulative distinct RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
tree-edge occurrences through parent depth 9 = 631100
```

これらは新しいdepth-11結果ではなく、G4-10のintegrity resultである。

## 9. Resource telemetry

formal artifactに保存されたtelemetry:

```text
production final resource gate = PASS
production artifact bytes = 369298243
production elapsed = 427.201679358 s
production peak RSS = 3472441344 bytes
independent resource gate = PASS
independent elapsed = 43.037369478 s
independent peak RSS = 1247752192 bytes
```

ここで`production final resource gate = PASS`と`UNIQUE_STATE_CAP`は矛盾しない。state ceilingはdepth-11 incomplete layerの構築中に発火した。一方、formal recordへ残したcomplete prefix artifact自体はfinal artifact/RSS/wall-clock gate内にある。

## 10. Provenance

```text
lease artifact ID = 10948226759
lease digest = sha256:575b35ee5963d9846d363680c5718184bdae9d1339d91bc1f484fe35fedf11fc
production artifact ID = 10949100069
production digest = sha256:af6654f082da6478ed94f6852b57b1330ae77f3ed2eb491644844a108c4ec0c8
compact artifact ID = 10948857115
compact digest = sha256:ae7ff0f641f0997687268c3bc804f3128feac1c1bb48b7a5c61b027cde26991d
formal-result file SHA-256 = 7be828231d25ad0e9ee0a698992c3ccb726768b6329a6ad935548d4a46c72e1d
scientific-result core SHA-256 = a9649b654ae315fe7d234ccc5511252db6154e84d146bd9444185e9441f52484
production-result core SHA-256 = 81915a36f5350ae5559f5e82dbde8248776e628a5e54862b4accfe21054341b5
independent core SHA-256 = 2e913c8458037db33de0083981bf4442316bb28d7bf7dc4d05419b8e4a0057d5
```

## 11. 科学的意味

この結果から言えるのは、**事前固定したresource envelopeではcomplete exact depth-11 topologyを確立できなかった**ということだけである。

`UNIQUE_STATE_CAP`に到達したことを、depth-11 state countの正式な下限推定、growth rate、whole-Bao size、計算困難性の普遍則へ読み替えない。

また、T1〜T4が成立しなかったとも、反例が存在したとも言えない。

## 12. Closure / no-rescue

G4-10はこの`NON-ESTIMABLE`を正式closureとする。

同一Study/versionで禁止するもの:

- state ceiling増加
- wall-clock延長
- large runner / local machineへの救済移行
- depth 11 same-evidence rerun
- depth 12 extension
- endpoint変更
- partial subset claim
- symmetry / canonicalization rescue
- independent requirement relaxation
- G2-12 estimator導入

## 13. Research Generation 4への帰結

G4-10はpositive exact resultを得られなかったが、Program Planの完了条件はpositive resultを要求していない。protected depth 11が明示的にauthorizedされた場合、complete exact resultまたは事前規定resource/technical closureを持てばcore agendaをcloseできる。

したがってG4-10 `NON-ESTIMABLE` closureはResearch Generation 4 coreの正当な最終状態である。

その後、RG4 current-facing文書同期、program final synthesis、pre-main consistency audit、final documentation auditを完了し、research HEAD `0a2fb472686f90f0cdb70f89b6d9daaf91068764`を`main`へnon-force fast-forward統合した。これはrepository integrationであり、本報告のscientific decisionやno-rescue boundaryを変更しない。
