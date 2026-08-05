# Stage A — D3逆転 独立確認設計チェックポイント

更新日: 2026-08-05  
Status: **Design selected / not preregistered / no formal data generated**  
Study: 第1研究「Baoにおける局面相転移点の発見と、capture-branch-expansionの確認」

## 1. 目的

E-019 D3 (`hard / bao / depth 3`) では、事前登録方向 `phase2 > legacy` と逆に、`legacy > phase2` の非常に強い観測が得られた。

- paired games: 4500
- phase2 event games: 13
- legacy event games: 140
- phase2-only (`n10`): 13
- legacy-only (`n01`): 140
- discordants: 153
- paired risk difference: approximately -2.8222pp
- phase2/legacy discordant OR: approximately 0.09286
- exact two-sided McNemar p: `4.614222568073049e-28`

しかし、この方向はE-019/H17の事前登録方向とは逆であるため、E-019内で `legacy > phase2` をconfirmatory claimへ変更しない。

本checkpointはStudy 1 completion planのStage Aとして、**D3逆転を独立seedで直接replicateする場合の設計候補を選定する**。新規仮説・新規experiment ID・preregistration・execution policyの正式登録はまだ行わない。

## 2. 設計方針の比較

### Option A — D3直接replication

`hard / bao / depth 3`だけを対象に、phase2とlegacyを新規shared seed / same-opening paired designで比較する。

利点:

- E-019で新規に観測された境界条件そのものを最短距離で独立確認できる。
- E-019 D3とprimary endpointを一致させられる。
- 新しい主張を「depth全体の非単調性」まで広げずに済む。
- Study 1の完了条件であるD3境界条件の確定に直接対応する。

### Option B — search-profile × depth interactionを同時にformal検定

Depth 1/2/3を新規seedで同時比較し、search-profile effectのdepth interactionまたは非単調性を直接検定する。

問題:

- D3独立再現より主張範囲が広い。
- interaction endpoint、multiplicity、global decision contractの新設が必要になる。
- 第1研究の完了に必要な最小検証を超え、Stage Bの機構・一般化問題まで一つのconfirmatory experimentへ混在させる。

### 選定

**Option A — D3直接replicationをStage Aの第一選択とする。**

interaction / depth非単調性のformal claimは、D3逆転が独立再現した後に必要性を再評価する。Stage Aの結果だけから結果後にinteraction hypothesisへ拡張しない。

## 3. 次のconfirmatory hypothesis候補 — 未登録

番号はまだ付与しない。

候補hypothesis:

> 固定条件 `hard / bao / depth 3` において、eligible category-A `capture-branch-expansion` のゲーム単位manifestationは、phase2 searchよりlegacy searchで高い。

これはE-019/H17を修正する仮説ではなく、E-019 D3で新たに観測された逆方向現象を**新しい独立データでprospectiveに検定する新規仮説候補**である。

現時点では:

- H18: **未登録**
- E-020: **未登録**
- preregistration: **未作成**
- execution policy: **未作成**
- execution lock: **未作成**
- formal execution approval: **未承認**
- formal corpus generated: **no**

## 4. 推奨primary design

E-019 D3との比較可能性を最大化するため、primary endpointは原則としてE-019 D3を継承する。

### Conditions

- level: `hard`
- evaluator: `bao`
- maxDepth: `3`
- P2: `phase2`
- LG: `legacy`
- random opening: paired within seed

### Primary population

- `pliesRemaining >= 9`
- category-A candidate detection条件をE-019から変更しない
- capture-branch-expansion classification条件をE-019から変更しない

### Primary unit

`paired shared-seed game`

同一pair内でphase2 / legacyは:

- 同一seed
- 同一game index
- 同一random-opening boundary state

を要求する。

### Binary endpoint

各conditionについて、そのgame内にprimary populationのeligible category-A `capture-branch-expansion` candidateが1件以上あればevent=1、なければ0。

### Primary test

- two-sided exact McNemar test
- alpha: `0.05`
- minimum discordant paired games: `20`
- prospective direction candidate: **legacy-only > phase2-only**

E-019で使ったtwo-sided exact testを維持し、方向だけを新しい仮説としてdata generation前にprospective固定する。E-019結果を理由にone-sided testへ変更しない。

### Candidate decision contract

正式preregistration時の候補contract:

- `confirmed`: formal integrity / exact pairingが通過し、discordants >=20、two-sided exact McNemar p <=0.05、かつ legacy-only > phase2-only
- `not-confirmed`: formal integrity / exact pairingが通過し、discordants >=20だが、significanceまたはprospective direction criterionが不通過
- `inconclusive`: formal corpus/integrity/pairing/required output constructionに失敗、またはdiscordants <20

このcontractはformal data generation開始後に変更しない。

## 5. Sample-size design候補

### 推奨値

- paired seeds: **4500**
- games per condition: **4500**
- total formal games: **9000**

E-019 D3と同じpaired Nとし、独立replicationとして比較可能性を保つ。

### 保守的planning assumption

E-019 D3実測値そのものを期待値として採用せず、次まで弱めてplanningする。

- discordance probability: `0.01`
- legacy share among discordant pairs: `0.75`
- corresponding legacy/phase2 discordant OR: `3.0`
- minimum discordants: `20`
- alpha: `0.05`
- test: two-sided exact McNemar

4500 paired gamesでは、この保守的仮定下で:

- probability of at least 20 discordant pairs: approximately **0.9999905**
- unconditional exact-McNemar power for the prospective legacy > phase2 direction: approximately **0.9128**

E-019 D3実測はdiscordance `153/4500 = 3.4%`、legacy share among discordants `140/153 ≈ 91.5%`であり、planning assumptionは観測効果より意図的に弱い。

このsample-size計算は次experimentの事前設計にのみ使用し、E-019 decisionや過去thresholdを変更しない。

## 6. Seed independence候補

新しいformal experimentではE-019を含む過去の探索/formal seedを再利用しない。

過去使用済み範囲には少なくとも次を含む。

- pilot: `20260721–20260820`
- E-010: `20261001–20261200`
- E-011: `20262001–20262400`
- E-017: `20263001–20264000`
- E-018: `20265001–20267000`
- E-019 master block: `20268001–20274500`

候補として、4500連続seedの新規block `20275001–20279500` を使用できる。

**このseed blockは本checkpointではまだformal固定しない。** 正式preregistrationを作成する場合に、過去範囲との非重複を再監査したうえで固定する。

## 7. Secondary analysis境界

Stage Aのprimary decisionはpaired game-level McNemarだけで行う。

preregistered secondary候補:

- trajectory-ply (`trajectoryHash + eventPly`) deduplicated candidate counts
- unique expansion trajectory-ply / trajectory / archetype counts
- phase2 / legacy別のcandidate→expansion manifestation率
- within-condition candidate/control enrichment
- forced-capture regime length / candidate positionの記述統計
- terminal-distance strata

Structural secondaryはprimary decisionを置き換えない、救済しない、反転しない。

trajectoryの分岐点、合法手数、捕獲手数、最大捕獲可能量、depth 1/2/3の選択手境界などの詳細な機構解析は原則Stage Bへ置く。Stage Aの結果を見てからsecondaryを新しいconfirmatory endpointへ昇格しない。

## 8. 実装方針候補

新規formal experimentとして登録する場合、E-018/E-019 infrastructureを参考にしつつ、experiment固有のrunner / verifier / evaluator / lockを用意する。

必須:

- experiment固有preregistration
- experiment固有execution policy
- experiment固有approval token
- experiment固有execution lock
- source commit固定
- clean worktree確認
- Node/runtime固定
- paired seed sequence監査
- paired opening hash監査
- condition identity/config hash分離
- trajectory hash存在確認
- GitHub Actions formal generation禁止

E-018/E-019のapproval token、lock、formal output pathを再利用しない。

## 9. 次のゲート

次工程は、このdesignを正式confirmatory experimentへ昇格させるかの判断である。

昇格する場合に初めて:

1. 新規hypothesis IDを登録
2. 新規experiment IDを登録
3. exact seed block / N / endpoint / direction / decision contractをpreregistrationで固定
4. execution policyを作成
5. implementation / fixture / validatorを準備・監査
6. **その後に別途、experiment固有の明示的formal開始承認を要求**
7. fixed-local execution lockを生成
8. formal data generation開始

本checkpoint自体はformal experiment registrationでもformal execution approvalでもない。

## 10. 既存formal decisionsの不変性

変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

E-018は固定`hard / bao / depth2`で維持する。E-019 global H17は`not-confirmed`のまま維持する。D3逆転は独立確認されるまでconfirmed扱いしない。

PR #26は引き続きopen / draftを維持する。
