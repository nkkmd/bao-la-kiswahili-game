# G4-10 / FDERT-STUDY1 — 現在の状態

更新日: 2026-09-28  
状態: **`CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP`**

## 正式状態

```text
Agenda = Research Generation 4 / G4-10
Study ID = FDERT-STUDY1
Stage 0 v1 = TECHNICAL-INVALID / self-check false positive / protected access 0
Stage 0 v2 = PASS / protected access 0
Stage 0 v3 hardening = PASS / protected access 0
Stage 1 pre-access audit = PASS / protected access 0
Stage 1 source freeze = PASS / protected access 0
Stage 1 = ONE AUTHORIZED / ONE ACTUAL
formal decision = NON-ESTIMABLE
target T1 = NON-ESTIMABLE
target T2 = NON-ESTIMABLE
target T3 = NON-ESTIMABLE
target T4 = NON-ESTIMABLE
same-evidence rerun = NOT AUTHORIZED
depth 12 = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
main integration = COMPLETE / FAST-FORWARD
```

## Stage 1 結果

Protected exact run:

```text
Actions run = 36368880428 / attempt 1 / success
trigger SHA = 787105a3016bac1172e669faf400fcc7cdd70dd5
scientific executions authorized = 1
scientific executions actual = 1
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
stop reason = UNIQUE_STATE_CAP
frozen state ceiling = 2000000 cumulative RAW states
```

productionはdepth 10までを完全再構築した後、depth 11を構築中に事前固定した`maxCumulativeDistinctRawStates = 2,000,000`へ到達し、fail closedした。

したがって、depth 11 layerのcomplete exact topologyは確立されていない。partial depth-11 state、partial edge、partial countをformal resultへ昇格しない。

## 完全に確認できた範囲

complete prefix through depth 10:

```text
cumulative distinct RAW states = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
tree-edge occurrences through parent depth 9 = 631100
```

このprefixはG3-11 canonical depth-10 exact resultと事前固定projectionで完全一致した。

```text
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
prefix integrity = PASS
```

Independent verifierはこのclaimed-complete prefixをmaterially separate implementationで再列挙し、exact agreementを確認した。

## T1〜T4

事前固定したdepth-11 targetは次だった。

- T1: depth-11 novelty continuation
- T2: depth-11 tree/RAW divergence
- T3: cumulative tree/RAW inflation continuation
- T4: depth-11 transposition / multi-predecessor persistence

complete depth-11 layerが成立しなかったため、4 targetすべてを**`NON-ESTIMABLE`**とする。

これはcounterexampleでもnegative resultでもない。partial evidenceから方向判定を行わない。

## Resource / integrity

```text
production final resource gate = PASS
production preserved artifact bytes = 369298243
production elapsed = 427.201679358 s
production peak RSS = 3472441344 bytes
production materialized-file hash verification = PASS
independent integrity = PASS
independent complete-prefix verification = PASS
independent resource gate = PASS
```

`UNIQUE_STATE_CAP`は実行途中のprospectively frozen scientific resource ceilingであり、final complete-prefix artifact自体のresource gate failureではない。

## Artifact provenance

```text
lease artifact = 10948226759
lease digest = sha256:575b35ee5963d9846d363680c5718184bdae9d1339d91bc1f484fe35fedf11fc
production artifact = 10949100069
production digest = sha256:af6654f082da6478ed94f6852b57b1330ae77f3ed2eb491644844a108c4ec0c8
compact artifact = 10948857115
compact digest = sha256:ae7ff0f641f0997687268c3bc804f3128feac1c1bb48b7a5c61b027cde26991d
formal-result file SHA-256 = 7be828231d25ad0e9ee0a698992c3ccb726768b6329a6ad935548d4a46c72e1d
scientific-result core SHA-256 = a9649b654ae315fe7d234ccc5511252db6154e84d146bd9444185e9441f52484
```

Repository canonical summary:

- [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)

## Closure boundary

G4-10はこの`NON-ESTIMABLE`で閉じる。

禁止:

- ceilingを増やしてsame Studyを再実行する
- alternate runner / larger machineで救済する
- depth 11 partial resultをformal topologyへ昇格する
- depth 12を追加する
- symmetry / canonicalizationで救済する
- G2-12 estimatorで結果を補う
- whole-Bao size / growth lawへ外挿する
- public AI変更へ自動接続する

G4-10 closure document、Research Generation 4 final synthesis、pre-main consistency audit、final documentation auditを完了後、research HEAD `0a2fb472686f90f0cdb70f89b6d9daaf91068764`を`main`へnon-force fast-forward統合した。追加scientific executionは行っていない。
