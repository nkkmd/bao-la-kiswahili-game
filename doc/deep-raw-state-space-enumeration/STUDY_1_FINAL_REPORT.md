# G2-05 第1研究 最終報告 — 深層RAW状態空間の完全列挙

更新日: 2026-08-28  
Program label: `G2-05`  
Study ID: `DRSSE-STUDY1`  
研究世代: **Research Generation 2**  
正式判断: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## 1. 研究上の問い

本prospective independent Studyでは、結果を見る前に固定したBao rootから、事前に固定したbounded depthまでのcomplete legal forward state spaceをexactかつ再現可能に列挙できるかを調べました。

同時に、authoritative RAW state、game-tree occurrence、branching、transposition、phase compositionを別々に記録しました。

本Studyはterminalまでのcomplete forward closureを求める研究ではなく、Bao全体のstate-space sizeやgame-tree complexity総量を推定する研究でもありません。

## 2. 変更しないupstream境界

本Studyはupstream研究のformal decisionやinterpretation boundaryを一切変更しません。

- `PEOCR-STUDY1 = INCONCLUSIVE`
- `SRDR-STUDY1 = INCONCLUSIVE`。firewall後の`1040 < 1050`を含む
- `STSCV-STUDY1 = INCONCLUSIVE`、T01 / T02 / T03=`NON-ESTIMABLE`、validated transform set=`[]`、canonicalization未承認
- `REEOE-STUDY1 = INCONCLUSIVE`、Stage 1 v2 complete closures=`0/8`、Stage 2=`NOT-AUTHORIZED-NOT-EXECUTED`
- G1 `SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`

G2-05は、これらのStudyに対するrescue、correction、reclassification、extension-success labelではありません。

## 3. authoritative representation

Scientific state identityはRAW-onlyです。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

identityから除外するfield:

```text
turn
reason
```

`pending`欠落時はfail closedです。represented-seed invariantは64です。

upstream validated transform setは空なので、symmetry reduction、canonicalization、seat swap、left / right quotient、orbit deduplication、symmetry-reduced countingは使用していません。

Exact move identityは次でbindingしました。

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

materializeしたすべてのedgeでは次のbindingを保持しました。

```text
source RAW key -> exact move key -> successor RAW key
```

## 4. prospective Stage構成

### Stage 0 — technical validation

`DRSSE-S0-TECHNICAL-2026-08-28-v1`では、RAW identity、deterministic enumeration、layer accounting、tree-occurrence propagation、transposition accounting、hashing、materialization、independent verificationを検証しました。

immutable G1 SSGTC depth-2 resultはtechnical positive fixtureとしてのみ使用しました。記録済みの2つのtechnical blockを経た後、accepted runはfixtureを再現し、固定corruption controlもすべて検出しました。

```text
decision = STAGE0-TECHNICAL-PASS
run = 33155526103
job = 98797262242
artifact = 9679427896
artifact ZIP SHA256 = 7cd8dbb4e61acf113c0085b79bd298a7588994447750e0f7d4d8201e51c638c4
```

Stage 0はscientific inferenceを承認しません。

### Stage 1 — fresh development / resource characterization

`DRSSE-S1-DEVELOPMENT-2026-08-28-v1`ではfresh deterministic seed block `28050001..28050064`を使用し、prospectiveにNamua 3 roots、Mtaji 3 rootsを選択しました。

6 rootsすべてでindependent depth-5 local enumerationとindependent replay / re-enumerationが完了しました。

```text
decision = STAGE1-DEVELOPMENT-PASS
run = 33155886879
job = 98798433942
artifact = 9679565765
artifact ZIP SHA256 = 47f83b614876a988495c8a68f8d63dda9bf9de105b967398178e6b4bc4fade04
complete depth-5 roots = 6/6
```

Stage 1はdevelopment-onlyです。Stage 1 row、root、state count、transposition observation、artifactをformal Stage 2 evidenceとして使用することは禁止しました。

### Stage 2 — formal bounded enumeration

formal domainはStage 1 outcomeを見る前から次のとおり固定されていました。

```text
root = fresh public/engine.js initialState()
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 9
required complete reachable layers = 0..9
required complete parent expansion layers = 0..8
```

Formal runはfrozen source blobとfrozen resource ceilingに対してexactly once承認しました。

## 5. formal result

Production enumeratorはresource / administrative stopなしにすべてのfrozen layerを完了しました。

その後independent verifierがmaterialize済みrowをすべて検証し、complete depth-9 domainを独立に再列挙しました。

```text
targetComplete = true
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
materialized verification = PASS
full independent exact recomputation = PASS
```

したがって正式判断は次です。

> **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## 6. exact reachable-state / tree structure

| depth | unique RAW states | new RAW states | cumulative RAW states | tree occurrences | cumulative tree occurrences | tree / layer RAW | terminal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 1 | 1 | 1 | 1 | 1 | 1.0000 | 0 |
| 1 | 4 | 4 | 5 | 4 | 5 | 1.0000 | 0 |
| 2 | 14 | 14 | 19 | 14 | 19 | 1.0000 | 0 |
| 3 | 38 | 38 | 57 | 38 | 57 | 1.0000 | 0 |
| 4 | 119 | 119 | 176 | 124 | 181 | 1.0420 | 0 |
| 5 | 384 | 384 | 560 | 405 | 586 | 1.0547 | 2 |
| 6 | 1,284 | 1,284 | 1,844 | 1,430 | 2,016 | 1.1137 | 3 |
| 7 | 4,706 | 4,706 | 6,550 | 5,655 | 7,671 | 1.2017 | 29 |
| 8 | 18,298 | 18,298 | 24,848 | 23,270 | 30,941 | 1.2717 | 63 |
| 9 | 78,009 | 78,009 | 102,857 | 105,704 | 136,645 | 1.3550 | 351 |

このfrozen range内では、すべてのdepthで`newRawStateCount[d] == uniqueRawStateCount[d]`でした。つまり、depth 9までのstandard-root domainではauthoritative RAW stateが異なるexact depth labelで再出現していません。

これはbounded descriptive factであり、global acyclicity claimではありません。

Cumulative exact endpoint:

```text
distinct RAW states through depth 9 = 102857
depth-labelled legal edges from parent depths 0..8 = 106773
unique RAW graph edges from parent depths 0..8 = 106773
tree node occurrences through depth 9 = 136645
tree edge occurrences from parent depths 0..8 = 136644
tree / cumulative RAW-state occurrence ratio = 1.328494900687362
```

## 7. branching structure

| parent depth | RAW parents | legal edges | mean branching | median | terminal parents |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 1 | 4 | 4.0000 | 4 | 0 |
| 1 | 4 | 14 | 3.5000 | 4 | 0 |
| 2 | 14 | 38 | 2.7143 | 2 | 0 |
| 3 | 38 | 124 | 3.2632 | 4 | 0 |
| 4 | 119 | 388 | 3.2605 | 3 | 0 |
| 5 | 384 | 1,325 | 3.4505 | 3 | 2 |
| 6 | 1,284 | 4,895 | 3.8123 | 4 | 3 |
| 7 | 4,706 | 18,860 | 4.0076 | 4 | 29 |
| 8 | 18,298 | 81,125 | 4.4335 | 4 | 63 |

完全列挙済みparent layerでは、legal move 0のnonterminal parentは観測されませんでした。full branching histogramとedge-set hashはStage 2 artifact / resultに保存しています。

## 8. transposition structure

Transpositionはexact RAW state identityだけで定義しました。duplicate arrivalはdepth 4で初めて現れました。

| child depth | duplicate arrivals | states with multiple predecessor RAW states |
| ---: | ---: | ---: |
| 0–3 | 0 | 0 |
| 4 | 5 | 5 |
| 5 | 4 | 1 |
| 6 | 41 | 22 |
| 7 | 189 | 171 |
| 8 | 562 | 473 |
| 9 | 3,116 | 2,658 |

Depth 9のexact predecessor multiplicity histogram:

```text
1 -> 75351 states
2 -> 2514
3 -> 61
4 -> 81
5 -> 2
```

exact arrival multiplicity histogram:

```text
1 -> 75132 states
2 -> 2723
3 -> 71
4 -> 81
5 -> 2
```

したがってdepth 9までにgraph-state countとgame-tree occurrenceの差が明瞭になりますが、enumerated domain外へのextrapolationは承認しません。

## 9. phase composition

exact layer 0..9のすべてのnonterminal stateはNamuaでした。frozen depth-9 domainにはMtaji nonterminal stateは存在しませんでした。terminal stateはdepth 5で初めて現れ、depth 9では351 statesでした。

これはMtajiがglobally absentまたはunreachableだという意味ではありません。事前固定したstandard rootから9 plies以内には存在しなかった、という限定された結果です。

## 10. independent verification / exact identity

Canonical provenance:

```text
authorization/head SHA = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

Exact identities:

```text
cumulativeRawStateSetSha256 = 993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816
cumulativeGlobalRawGraphEdgeSetSha256 = da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654
cumulativeDepthLabelledEdgeSetSha256 = 3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed
productionResultCoreSha256 = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independentCoreSha256 = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
decisionCoreSha256 = c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f
```

Production resource measurementは24,848 parent expansions、106,773 move evaluations、22.9188 seconds elapsed、peak RSS 680,075,264 bytes、final uncompressed artifact content約84.25 MBでした。

これらはcomputational provenanceであり、extrapolation用scientific endpointではありません。

## 11. G1 SSGTCとの関係

G2-05は、standard-root cumulative depth-8の`24,848` RAW statesと`30,941` tree occurrencesを、新しく固定したdepth-9 domainのprefixとして独立再現し、その後fresh formal enumerationとindependent verificationによってdepth 9を完了しました。

これはG1 decisionを変更しません。`SSGTC-STUDY1`は従来どおり、そのfrozen depth-8 domain内だけでexactです。

## 12. G2-04との関係

G2-04は、結果を見る前に選定したrestricted endgame domainについて、retrograde exact solutionへ進む前にterminalまでのcomplete forward closureを要求しました。

G2-05は別の固定rootからfixed bounded depthまでのcomplete enumerationだけを問いとしました。

G2-04 selected rootやpartial closureは再利用していません。G2-04 decisionは`INCONCLUSIVE`のままであり、G2-05をそのrescueとは記述しません。

## 13. G2-12との境界

観測したdepth-wise growth、branching、transposition statisticはenumerated domain内部のexact descriptionに限られます。

本Studyではasymptotic modelをfitせず、次を推定しません。

- total Bao state-space size
- total game-tree complexity
- unbounded reachable states
- full-game growth rate

これらはdesignated G2-12 estimation studyを含む将来のprospective workです。

## 14. 最終結論

frozen standard initial Bao RAW stateは、authoritative RAW identityの下でdepth 9まで完全列挙され、state、tree、branching、transposition、phase、hash accountingをexactに記録し、complete independent reproductionを達成しました。

したがって正しいscientific statementは次です。

> **G2-05 / `DRSSE-STUDY1` = `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`.**

これより強いfull-game、symmetry-reduced、game-theoretic、engineering conclusionは承認しません。
