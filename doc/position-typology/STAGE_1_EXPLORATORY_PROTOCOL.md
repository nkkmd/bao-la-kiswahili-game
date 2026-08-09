# Stage 1 Exploratory Protocol — Position Typology Discovery

更新日: 2026-08-09  
Status: **exploratory protocol / not preregistered / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 目的

Stage 0で検証済みのposition-typology instrumentationを使い、fresh exploratory corpusからprovisional position typesを発見する。

本Stageの目的は**類型候補の発見と安定性診断**であり、formal hypothesisの確認ではない。

Stage 1では:

- cluster数を事前固定しない
- position-type名称を先に決めない
- playing styleをまだ定義しない
- Study 1 formal corpusを使わない
- AI conditionをfeature vectorに入れない
- 結果を見て選んだcluster definitionを同じcorpus上でconfirmatoryとは呼ばない

Stage 2 held-out replicationへ進む前に、必要なdefinitionを別途freezeする。

---

## 2. Stage 0から継承する根拠

Stage 0 smokeでは:

- 16 / 16 trajectories unique
- 970 raw observations
- 935 unique rule states
- rule-state duplicate slots 35
- within-trajectory repeated rule positions 0
- 16 / 16 opening states unique
- namua 704 / mtaji 266
- seat-canonical identity audit: 935 unique states, 3,714 legal moves / transitions, failure 0
- schema / replay / provenance / identity checks all passed

これによりinstrumentation integrityは十分と判断する。

一方:

- phase distributionは約73:27
- seat-canonical collapseはsmoke上0
- duplicate rule statesはtrajectory間で存在する

ため、Stage 1ではphaseとdeduplicationを明示的なsensitivity axisとして扱う。

---

## 3. Exploratory pilot corpus

### 3.1 Pilot size

Stage 1 pilotは **96 games** とする。

目的はlarge corpusの確定ではなく、次を診断できる中間規模を得ることである。

- feature distribution
- redundancy / deterministic relations
- phase-separated sample availability
- duplicate position structure
- generation-condition coverage
- preliminary clustering behavior
- cluster-method sensitivity

Pilot結果を見て本格exploratory corpusを拡張する場合は、同じartifactを黙って上書きせず別versionとして記録する。

### 3.2 Exploratory-only seed namespace

- base seed: `20270001`
- 96 consecutive game seeds
- Stage 1 discovery専用
- future confirmatory / Stage 2 held-out seed blockには再利用しない

これはformal seed blockではない。探索データをfuture confirmationから隔離するためのnamespaceである。

### 3.3 Game generation

- max ply: 100
- opening policy: seeded uniform legal random
- random opening plies: 8
- game generation: deterministic by seed
- full per-game artifact + observations + movesを保存
- atomic per-game write / resume
- source hashes / config hashを保存

Stage 0で16 / 16 gameがterminal observationまで到達したため、pilotではmax ply 100を維持する。max-ply truncationが実際に発生した場合はmanifestで別途監査する。

### 3.4 Generation strata

96 gamesを6 strataへ均等配分し、各16 gamesとする。

| ID | evaluator | search | depth | 目的 |
|---|---|---|---:|---|
| B-D1 | bao | phase2 | 1 | shallow-depth diversity |
| B-D2 | bao | phase2 | 2 | reference-like diversity |
| B-D3 | bao | phase2 | 3 | deeper-search diversity |
| LS-D2 | bao | legacy | 2 | search-profile diversity |
| V2-D2 | bao-v2 | phase2 | 2 | evaluator diversity |
| LE-D2 | legacy | phase2 | 2 | legacy-evaluator diversity |

これらは**sampling strata / metadata**であり、position type featureではない。

Stage 1 discoveryではconditionごとの勝率・performanceを類型定義へ使わない。

### 3.5 Opening pairing

Stage 1 pilotではcondition間でopening seedをpairしない。

理由:

- discovery corpusではcoverage / position diversityを優先する
- paired openingはcondition comparisonには有用だが、同じopening近傍のfrequencyを増やしやすい
- condition-specific sensitivityは後段でtrajectory/group単位に評価できる

Stage 2 replicationやplaying-style比較でpaired designが必要なら別途定義する。

---

## 4. Position population

### 4.1 Raw corpus

全observationを保存する。

これには:

- initial state
- random-opening中のpositions
- AI continuation positions
- terminal position

を含む。

raw corpusはprovenance、trajectory occupancy、playing-style、transition analysis用に保持する。

### 4.2 Primary exploratory discovery population

初期position-type discoveryでは次のみをeligibleとする。

- `terminal == false`
- `ply >= 8`

すなわちrandom openingを完了したpositionから、terminal直前までを対象とする。

理由:

- ply 0–7はposition diversificationのためのrandom policyであり、AI trajectoryと生成機構が異なる
- terminal positionはactive decision stateではなくlegal-action structureが特異
- ただし両者ともraw corpusから削除しない

### 4.3 Opening / terminal sensitivity

secondary sensitivityとして:

- all nonterminal positions including ply 0–7
- terminal positionsを含むdescriptive view

を必要に応じて確認できる。

これらをprimary discovery geometryの救済分析には使わない。

---

## 5. Phase policy

### Primary exploratory view

**namua / mtajiを分離してclusteringする。**

理由:

- mechanicsが異なる
- reserveの存在 / disappearanceが大きなstructural discontinuity
- Stage 0 smokeは約73:27のphase imbalance
- joint clusteringではphaseそのものがdistance geometryを支配する可能性が高い

### Secondary diagnostic

同じeligible populationをjoint feature spaceでも分析する。

目的は:

- phaseが実際に最上位分割になるか
- phase-separated typesにcross-phase analogueがあるか
- joint representationが有益なstructureを保持するか

を確認することである。

joint resultを理由にprimary phase-separated resultをpost-hocで置き換えない。

---

## 6. Identity / deduplication policy

### Primary pilot view

`ruleStateKey`でexact duplicate positionを1つにする。

raw frequencyは別テーブルへ保持する。

理由:

- Stage 0で35 duplicate slotsが確認された
- position geometryをtrajectory convergenceやcommon opening frequencyで水増ししない
- seat-canonical collapseの実効的影響はまだsmokeで観測されていない

### Sensitivity view

`seatCanonicalKey`でdedupしたdatasetも作る。

比較項目:

- sample count
- collapsed pair count
- feature distribution
- clustering solution / stability

South/North seat exchange transformのvalidityはStage 0でpass済みだが、primary dedupとしての必要性はlarger corpusで判断する。

### Raw frequency preservation

各unique positionについて少なくとも:

- raw occurrence count
- number of trajectories containing the position
- condition count
- first / last observed ply

を保持できるようにする。

frequencyは後のplaying-style / occupancy分析には意味があるため捨てない。

---

## 7. Trajectory balance

positionを独立なsampling unitとはみなさない。

Pilotでは次の3 viewを比較する。

1. **unique-position unweighted**
2. **trajectory-balanced weighted**
3. **deterministic trajectory-balanced subsample**

trajectory-balanced weightでは、各game × phaseがanalysisへ与えるtotal weightを極端にgame lengthへ依存させない。

sample weightを扱えないalgorithmではdeterministic capped subsamplingを使う。

stability resamplingの基本単位はgame / trajectoryとする。

---

## 8. Candidate feature representations

final feature setはまだ固定しない。

### Matrix S — Structural primitives

actor / opponent perspectiveのboard / legal-state primitiveを使用する。

候補:

- reserve
- houseOwned
- nyumbaSeeds
- frontSeeds / backSeeds
- frontOccupied / backOccupied
- reusablePits
- frontConnections
- legalMoveCount
- captureMoveCount
- forcedCapture
- maxPitSeeds
- pitSeedVariance
- seedConcentration
- max / mean capturable seeds
- max / mean capture events
- max / mean relay events
- max / mean chain events

決定論的に他featureから算出できるsummaryはredundancy auditで除外候補とする。

### Matrix C — Contrast representation

actor/opponentのabsolute primitivesに加え、または置き換えて:

- actor − opponent differences
- actor + opponent totals

を使うrepresentationを比較する。

absolute state informationを失う可能性があるため、difference-onlyを自動的にprimaryとはしない。

### Matrix P — Actor-oriented raw pits + summaries

Matrix Sに、actor-to-moveを先頭側へ揃えたraw pit vectorを追加する。

- actor front 8
- actor back 8
- opponent front 8
- opponent back 8

player 0 / 1というseat labelをraw dimensionの意味へ持ち込まない。

raw 32-pit vectorを保存することと、それをcluster inputへ採用することを区別する。

---

## 9. Preprocessing candidates

比較対象:

- raw numeric + standard scaling
- skewed non-negative countsへの`log1p` + standard scaling
- robust scaling sensitivity

booleanは0/1として扱う。

phase-separated primary analysisではphase dummyをfeatureへ入れない。

次をcluster featureへ入れない。

- gameId
- seed
- conditionId
- ply / turn
- trajectory id
- evaluation / rootScore
- search depth / nodes
- Study 1 classifier / regime lifecycle

---

## 10. Exploratory clustering methods

初期比較は標準Python scientific stackで再現可能な方法を優先する。

### Baseline methods

- K-means
- Gaussian mixture model
- agglomerative clustering / Ward linkage

cluster数候補は固定せず、まず `k = 2..10` をdiagnostic rangeとして比較する。

このrangeはposition-type数のformal hypothesisではない。

### Dimensionality reduction

- PCAをdiagnostic / visualizationに使用する

PCA componentをそのままposition type定義とはしない。

UMAP / HDBSCAN等は追加依存性とparameter sensitivityがあるため、必要性が生じた場合にsecondary exploratory methodとして追加する。

---

## 11. Cluster diagnostics

単一指標でcluster数を決めない。

少なくとも:

- silhouette score
- Calinski–Harabasz score
- Davies–Bouldin score
- cluster size balance
- method間agreement
- preprocessing sensitivity
- rule-state / seat-canonical dedup sensitivity
- trajectory-balanced sensitivity
- condition composition
- representative positions
- nearest counterexamples / boundary positions

を併記する。

condition compositionは「clusterをconditionで定義していないか」を監査するために使い、AI condition自体をcluster labelにはしない。

---

## 12. Provisional position typeへの昇格

Stage 1ではclusterを即座にBao語彙へしない。

provisional candidateとして残すには少なくとも:

- 複数method / preprocessingで類似structureが現れる
- 一つのgeneration conditionだけで説明されない
- representative positionsにboard-level共通性がある
- feature差が解釈可能
- trajectory重複だけによるclusterではない
- phase / applicability boundaryを記述できる

ことを確認する。

これはformal success thresholdではなくexploratory screening disciplineである。

---

## 13. Python analysis environment

Stage 0 data generationはNode.jsのみで完結したが、Stage 1 clustering / statisticsではPython environmentを使用する。

必要候補:

- Python
- numpy
- pandas
- scipy
- scikit-learn
- matplotlib

以前の研究用venvにこれらが入っていれば再利用できる。

分析開始時に:

- Python version
- package versions

をartifactへ記録し、後でreproducibility environmentを固定する。

探索初期に既存venvを無意味に作り直す必要はない。

---

## 14. Pilot停止点

96-game pilotを生成・verifyした後、直ちにlarge corpusへ拡張しない。

まず:

1. corpus integrity
2. max-ply truncation
3. phase counts
4. unique position counts
5. seat-canonical collapse
6. trajectory / opening duplication
7. feature missing / constant / deterministic redundancy
8. phase別sample availability

を監査する。

その結果を記録してからPython exploratory analysisへ進む。

---

## 15. Stage 2との境界

Stage 1 pilot / expanded exploratory corpusで選択した:

- position population
- feature representation
- preprocessing
- clustering / assignment method
- number/range of types
- dedup rule
- stability criterion

を、その同じデータだけでformal confirmationしない。

Stage 2へ進む前にheld-out seedsとdecision rulesを事前固定する。
