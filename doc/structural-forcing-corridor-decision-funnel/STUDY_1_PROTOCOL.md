# SFCDF-STUDY1 — Study 1 Protocol

Updated: 2026-09-02  
Status: **PROSPECTIVE / FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE**

## 1. Formal identity

```text
Program = Research Generation 3 / G3-04
Study ID = SFCDF-STUDY1
English title = Structural Forcing-Corridor and Decision-Funnel Study 1 — Prospective exact validation of sustained reply narrowing and branch-to-RAW convergence in bounded Bao local geometry
Japanese title = Baoにおけるstructural forcing corridorとdecision funnelのprospective exact検証 — sustained reply narrowingとbranch-to-RAW convergenceによるbounded局所経路構造の再現可能なphase差の検証
baseline main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
research branch = research/g3-04-structural-forcing-corridor-decision-funnel
```

Program authorizationは`G3-04-AUTHORIZED`である。ただしこのauthorizationはStudy-definition / preregistration freezeのみを許可し、fresh scientific executionを許可しない。

## 2. Scientific question

中心課題は次である。

> rootでは複数の合法手が存在していても、その後にreply widthが持続的に狭くなるbounded local corridor、または複数のroot branchが少数のRAW stateへ再収束するdecision funnelが、fresh paired Namua/Mtaji roots上で再現可能な局所構造差として成立するか。

ここでいう`forcing`は**structural forcing**だけを意味する。game-theoretic forcing、tactical inevitability、best-move uniquenessを意味しない。

## 3. Immutable upstream boundary

G3-02 `EBRWS-STUDY1`とG3-03 `TCTGD-STUDY1`はどちらも`CLOSED / TECHNICAL-INVALID`のまま不変である。

次をG3-04のcandidate selection、threshold selection、positive prior、confirmation evidenceとして使用しない。

- G3-02 runner-local reply-compression summaries
- G3-02 selected roots / unintended duplicate run
- G3-03 diagnostic C1–C4 directions
- G3-03 technical-invalid Stage 1 outcome-derived classes / thresholds

G3-04のscientific foundationは独立prerequisite `LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`のみである。

## 4. Representation and exact horizon

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transform set = []
relative local horizon = depth 5
canonicalization / symmetry quotient = NOT AUTHORIZED
```

Rule semanticsは`public/engine.js` blob `2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c`へbindする。

## 5. Eligible measurement families

Principal:

1. `LGTGMIV-F5-REPLY-GEOMETRY`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary tree-side denominator:

5. `LGTGMIV-F1-TREE-OCCURRENCE`

新しいendpointは上記eligible exact primitiveのdeterministic functionだけで構成する。

## 6. Construct separation

formalにも次を分離する。

```text
reply narrowing != transposition concentration
reply narrowing != single-layer low legal-move count
branch convergence != best-move uniqueness
structural forcing != game-theoretic forcing
structural forcing != tactical forcing
structural forcing != search stability
funnel != strategic simplicity
```

G3-04ではcorridor/funnelを一つのbinary combined classへ統合しない。

## 7. Frozen candidate endpoints

### C1 — Unit-width occupancy fraction

`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`

- numerator: depth 0..5の`unitWidthStateCount`合計
- denominator: depth 0..5の`replyWidthHistogram`中、reply width > 0のunique RAW-state presence合計
- terminal width 0はdenominatorから除外
- denominator 0はundefined

### C2 — Width-compression fraction

`SFCDF-C2-WIDTH-COMPRESSION-FRACTION`

- numerator: parent depth 0..4の`widthCompressionCount`合計
- denominator: compression + expansion + stable countの合計
- terminal childもF5の既定width comparison分類に従う
- branch extinctionは別primitiveとして保存

### C3 — Longest unit-width run

`SFCDF-C3-LONGEST-UNIT-WIDTH-RUN`

- F5 `narrowPathGeometry.records`の最大length
- recordなしは0
- exact integer / denominator 1
- horizon censoringはraw recordで保持する

### C4 — Reconvergent-state occupancy fraction

`SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION`

- numerator: depth 1..5の`reconvergentRawStateCount`合計
- denominator: depth 1..5の`uniqueRawStateCount`合計
- rootは除外
- 同じRAW stateのcross-depth presenceはdepth-labelled occurrenceとして複数回寄与可能

### C5 — Root-branch overlap fraction

`SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION`

- numerator: depth 1..5のどこかでpositive descendant RAW-state overlapを持つunordered root-move pair数
- denominator: `choose(rootLegalMoveCount,2)`
- pairは最大1回count
- root legal move <2はundefined

### C6 — Cumulative tree/RAW ratio

`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

- numerator: depth 0..5のtree node occurrence合計
- denominator: depth 0..5のglobal distinct RAW state数
- rootは双方へ含む

C6はtree/graph inflation descriptorであり、単独でfunnelやtranspositionを証明しない。

## 8. Population and fresh seeds

### Stage 1

```text
seed block = 31410001..31410192
target = 12 source-seed paired trajectories
roots = 12 Namua + 12 Mtaji
```

### Stage 2

```text
seed block = 31420001..31420288
target = 18 source-seed paired trajectories
roots = 18 Namua + 18 Mtaji
```

Source trajectory rule:

- PRNG = Mulberry32
- canonical legal-move ordering ascending
- Namua root = exact ply 24、nonterminal、phase Namua
- Mtaji root = first nonterminal Mtaji state at ply >=44
- both rootsが揃わないseedはpair全体reject
- seed ascendingで最初のeligible N pairs
- max source ply 240
- selectionはgeometry-blind / endpoint-blind / outcome-blind

## 9. Freshness firewall

禁止seed namespace:

```text
31010001..31010096
31110001..31110128
31120001..31120192
31210001..31210192
31220001..31220288
31310001..31310192
31320001..31320288
```

LGTGMIV Stage 1/2およびG3-03 Stage 1のcanonical root / trajectory / first-16-prefix identitiesは、identity-only exclusion manifestとしてのみ使用できる。scientific geometry outcomeはselectionへloadしない。

Stage 2はStage 1のRAW root identity、source trajectory identity、first-16 move-prefix identityを全て除外する。

## 10. Development promotion

paired differenceは各endpointについて`Mtaji - Namua`のexact rationalとする。

Stage 1 target = 12 pairs。

Coverage:

- C1,C2,C3,C4,C6: 12/12 defined
- C5: >=10/12 defined

Promotionにはすべて必要:

1. coverage PASS
2. `3 * nonZero >= 2 * comparable`
3. dominant directionがtieでない
4. `3 * dominantSignCount >= 2 * nonZero`

Direction label:

- `MTAJI-GREATER`
- `NAMUA-GREATER`

promoted setが空ならStage 2はauthorizeせず、そのままnegative development resultとしてcloseできる。

## 11. Stage 2 formal validation

Stage 2はStage 1でfreezeされたcandidate identityとdirectionだけを評価する。

- 18 fresh pairs
- C1,C2,C3,C4,C6 coverage = 18/18
- C5 coverage >=15/18
- nonzero gateはStage 1と同一
- exact two-sided sign test
- zero differenceはsign-test nから除外
- family-wise alpha = 0.05 = 1/20
- promoted set内でHolm-Bonferroni
- observed dominant directionはStage 1 frozen directionと一致必須

formal candidate labelは`CONFIRMED`または`NOT-CONFIRMED`。

## 12. Cross-implementation exact agreement

production:

`tools/experiments/lib/sfcdf-production.js`

independent:

`tools/experiments/lib/sfcdf-independent.js`

independent側はG3-04 production helperをimportしてはならない。

G3-03で生じたprototype-sensitive verification failureを再発させないため、G3-04のmandatory equalityは次とする。

```text
scientific equality = SHA-256 equality of canonical scientific JSON content
```

JavaScript object prototype、key insertion order、implementation ID、runtime metadataはscientific identityへ入らない。`util.isDeepStrictEqual`等のprototype-sensitive in-memory equalityはmandatory gateに使用しない。

root-levelでは少なくとも以下をcanonical contentとして比較する。

- root/source identity
- upstream reconstruction core hash
- used family core hashes
- G3-04 raw primitives
- all candidate endpoints

Stage-levelではordered root scientific hashes、ordered pair comparisons、development/formal summaryを比較する。

Tolerance = 0。

## 13. Resource ceilings

Per root:

- unique RAW states <=100,000
- unique transitions <=750,000
- parent expansions <=100,000
- legal-move evaluations <=750,000
- summed tree node occurrences <=1,000,000,000
- elapsed <=180,000 ms
- peak RSS <=4 GiB
- root artifact <=64 MiB

Stage totals:

- Stage 0 <=120,000 ms / <=1 GiB RSS / <=32 MiB artifact
- Stage 1 <=7,200,000 ms / <=1 GiB total scientific artifact
- Stage 2 <=10,800,000 ms / <=1.5 GiB total scientific artifact

integrity mismatchなしでpopulation/resource gateを満たせない場合は`NON-ESTIMABLE`。

## 14. Technical-invalid rules

少なくとも次はfail-closedで`TECHNICAL-INVALID`。

- frozen source/blob mismatch
- production / independent canonical scientific content mismatch
- upstream reconstruction/family core mismatch
- authorized回数を超えるscientific execution
- fresh computation後のdurable canonical artifact欠損
- protected depth-10 access
- post-freeze scientific-contract mutation

prototype-sensitive equalityだけのfailureはmandatory scientific gateではない。

## 15. Execution integrity

Stage 1前にnon-scientific smokeで実際のcontrol pathを検証する。

要求:

- Stage-specific dedicated one-shot trigger
- workflow armingとscientific computationを分離
- trigger commit自身以外で再帰queueしないpath filter
- single concurrency group
- durable pre-computation lease
- authorization baselineからのremote advancement allowlist
- source blob exact binding
- artifact uploadをrepository mirrorより先に実施
- Actions history execution-count audit
- automatic rerunなし

fresh seedへ一度でもaccessした後はsame-evidence rerunを禁止する。

## 16. Stage structure

```text
SFCDF-S0-TECHNICAL-2026-09-02-v1
SFCDF-S1-DEVELOPMENT-2026-09-02-v1
SFCDF-S2-FORMAL-2026-09-02-v1
```

Stage遷移は自動ではない。各Stageは別authorizationを必要とする。

## 17. No-rescue boundary

fresh access後に次を行わない。

- endpoint再定義
- threshold/gate緩和
- seed追加・置換
- root replacement
- favorable subgroup選択
- representation変更
- horizon変更
- canonical equality rule変更
- implementation defect修正後のsame-seed rerun

必要な修正は新しい独立Study/versionへ送る。

## 18. Protected depth-10 holdout

standard initial RAW-root complete exact depth-10 holdoutは全期間:

**`SEALED / NOT GENERATED / NOT READ`**

G3-04ではresource estimation目的の部分生成も禁止する。

## 19. Interpretation boundary

corridor/funnelを以下へ自動的に読み替えない。

- optimal-play forcing
- tactical inevitability
- best-move clarity
- search difficulty / search stability
- strategic simplicity
- human difficulty
- position value
- win probability
- causal rule effect

本StudyのclaimはRAW-only relative depth-5 bounded local structural geometryに限定する。
