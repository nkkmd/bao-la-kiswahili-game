# fresh depth-11 exact reachability topology — `G4-10` / `FDERT-STUDY1`

更新日: 2026-09-28  
状態: **`CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP`**

## この研究は何を調べたか

Research Generation 4最後のcore agendaとして、Baoのstandard initial RAW rootから**complete exact depth 11**までのreachable topologyを、fresh protected evidenceとして一度だけ構築できるか検証した。

中心対象は次である。

- 新規RAW state
- tree occurrence
- duplicate arrival
- multi-predecessor state
- tree / RAW graph divergence

G3-11 depth-10 exact Studyの再実行や救済ではなく、独立した新規Studyとして設計した。

## 結論

正式判定は次である。

**`NON-ESTIMABLE`**

productionは0..10を完全再構築し、depth 11を構築中に事前固定した`2,000,000 cumulative RAW states` ceilingへ到達したため、complete depth-11 layerを確定せず停止した。

```text
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
stop reason = UNIQUE_STATE_CAP
```

complete depth-11 layerが存在しないため、事前固定したT1〜T4はすべて`NON-ESTIMABLE`である。

## Integrity

0..10 complete prefixはG3-11 canonical exact resultと完全一致した。

```text
prefix integrity = PASS
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
production materialized-file hash verification = PASS
independent complete-prefix verification = PASS
```

これはG3-11のformal decisionを再判定したものではなく、G4-10のfresh reconstructionが既知のcomplete prefixと整合したことを示すintegrity checkである。

## Complete prefixとして残るexact値

```text
cumulative distinct RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
tree-edge occurrences through parent depth 9 = 631100
```

これらは既存G3-11 exact prefixの再現確認であり、新しいdepth-11 topology claimではない。

## なぜdepth 11の数値を残さないのか

resource ceiling到達時点のdepth-11構築はpartialである。Study protocolはpartial state count、partial edge count、partial topologyをformal scientific evidenceへ昇格しないことを事前固定していた。

したがって、途中で何個までstateが生成されたかをdepth-11 exact topologyの推定値・下限・傾向として使用しない。

## 一回性

```text
Actions run = 36368880428 / attempt 1
scientific executions authorized = 1
scientific executions actual = 1
same-evidence rerun = NOT AUTHORIZED
```

認可はproduction開始前にdurable leaseと`STAGE_1_CONSUMED.json`で消費済みである。resource ceilingを引き上げたり別machineへ移してsame Studyを救済しない。

## 読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`FINAL_REPORT.md`](FINAL_REPORT.md)
3. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
4. [`STAGE_1_RESOURCE_PLAN.md`](STAGE_1_RESOURCE_PLAN.md)
5. [`prereg/STAGE_1_PROTECTED_EXACT_SPEC.json`](prereg/STAGE_1_PROTECTED_EXACT_SPEC.json)
6. [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)
7. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)

## 解釈上の境界

本Studyはdepth-11 exact topologyを完成できなかったため、depth-11 novelty、transposition、tree/graph divergenceについてpositive/negative directionを確立しない。

また、次も確立しない。

- depth 12以深
- Bao全状態空間または全game treeの大きさ
- asymptotic growth law
- symmetry-reduced size
- game-theoretic value
- AI棋力やbest move correctness
- human difficulty
- public AI improvement

`NON-ESTIMABLE`は科学的な失敗ではなく、事前に固定したresource boundaryを守った正式closureである。
