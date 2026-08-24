# Restricted Endgame / Winning Regions Study 1 — Final Report

Updated: 2026-08-24  
Status: **STUDY 1 COMPLETE / EXACT-SOLVED-WITHIN-FROZEN-DOMAIN**

## 1. Research question

本Studyは、Bao全体の完全解析ではなく、prospectively frozenで有限・legal-transition-closedな終盤subspaceについて、全状態・全合法遷移とnormative terminal semanticsだけからexact game-theoretic valueを再現可能に求められるかを検証した。

扱うquantityはengine evaluation、search value、empirical continuation win rateではなく、**frozen bounded domain内のdeterministic exact value**である。

## 2. Independence from prior studies

`REWR-STUDY1`は新規prospective independent studyである。Position Evaluation / Win-Rate Calibration、Blunder / Misvaluation、Critical Positions / Outcome Branching、Position Complexity、Tactical Motifs、Namua→Mtajiその他のclosed Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryは変更していない。

## 3. Rule and terminal semantics

Primary exact solverはMtaji-onlyとした。rootでは:

```text
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
pending = [0,0]
winner = null
total kete = 64
```

Normative terminalとして使用したのは`front-empty`と`no-move`のみである。

`public/engine.js`の`MAX_RELAY=512` / `relay-limit`はimplementation safety guardであり、terminal WIN/LOSSとして使用していない。formal repetition/draw ruleも凍結ルール基準から確定できなかったため、retrograde fixed point後に未解決stateが生じた場合は`RECURRENT`として扱い、formal `DRAW`とは呼ばない設計を事前固定した。

## 4. State, move, and symmetry identity

State identityはraw/direct rule state:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

のstable serializationとSHA-256を使用する。`turn`とtextual `reason`はrule-state identityには含めない。

Move identityは:

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

を含むexact move keyである。

Primary solutionではreflection、player swap、seat canonicalization、pit renumbering等のsymmetry reductionを一切使用していない。

## 5. Reachability and domain construction

Primary populationは任意構成stateではなく、standard initial stateからの合法trajectoryで到達証明を持つrootと、その完全forward closureとした。

Frozen root identity:

```text
seed = 22800188
ply = 48
root state key = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
non-empty pits = 16
legal moves at root = 1
witness stable SHA-256 = a57e086f6e85d46052f9bacb0ad1f24851e04935b3bcd9ee41647aaa43228fa2
```

Stage 1 execution時にはこのwitnessをinitial stateから再生成し、root identityとwitness hashの一致をhard gateとした。

Domain definition:

> `D(R)` = frozen historically reachable root Rから、全exact legal moveを0回以上適用して到達するすべてのraw rule state（normative terminal successorを含む）。

Feature capはroot候補のtechnical selectionだけに使い、closure boundaryには使っていない。

## 6. Stage 0 feasibility and outcome firewall

Technical-only seed block:

```text
22800001..22800256
256 trajectories
maximum trajectory ply = 240
```

これはscientific outcome samplingではなく、reachable rootsをtechnicalに発見・再生するためのblockである。

Initial scanは3464 unique eligible Mtaji rootsを得た。v1 root capではcandidateが0だったため、WIN/LOSS等を一切生成せず、observed structural distributionsだけからv2 gridをprospectively再設計した。

v2は36 profileをoutcome-blindに比較した。selection ruleは、complete closureだけを対象にstate count最大、edge count最大、root count最大、最後にroot-set hashでtie-breakするものだった。

v2 selected graph:

```text
roots = 1
states = 8
edges = 7
max move microsteps = 10
state-set SHA-256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transition-set SHA-256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
```

Production closureと別実装verifierは全state/edge/hashで一致した。

### One-shot v3 expansion

Stage 1 freeze前に、より大きい技術候補へ1回だけcapを拡張することをprospectively許可した。

結果:

```text
states observed = 423,733
edges observed = 426,938
maximum inspected move microsteps = 1,000,000
stop reason = ADMIN-CUTOFF
```

これはgame-theoretic resultではない。事前規則に従い追加拡張を禁止し、独立検証済みv2 8-state domainへfallbackした。科学outcomeを見てdomainを変更したものではない。

## 7. Stage 1 prospective freeze

Stage 1はdomain、source files、terminal semantics、classification、DTF、optimal-move recurrence、resource limits、failure rulesをfreezeし、authorizationを別commitで発行するpre-generation firewallを採用した。

最終identity:

```text
domain SHA-256 = acfc25413f9c237569884f166ed971ad9ee9395665ce96ec6d094d8ed4a6c56a
spec SHA-256 = ec20df4621b7d8e50fd979bee4681c7eadb5bf2138c14911cb6ab97acd0738cc
authorization SHA-256 = d3fe788e95606c6641ad4c33a396a2c02b21138b9b80bef2522f85cd124f282c
```

### Pre-generation correction

最初のauthorization後、scientific runnerを一度も実行する前のmanual contract inspectionで、spec field `administrativeMaximumMoveMicrostates` とrunner側参照名の不一致を発見した。

そのため:

1. authorization v1を削除してunlockを無効化;
2. production runnerとindependent verifierのfield参照だけを修正;
3. synthetic/technical fixturesを再PASS;
4. source hashesを再freeze;
5. authorization v2を発行;

した。domain、classification、DTF、outcome endpointは変更しておらず、このcorrection以前にscientific outcomeは生成していない。

## 8. Retrograde semantics

Terminal stateは`TERMINAL + absoluteWinner`としてbase caseにした。終局後のruntime `state.player`に依存してterminal WIN/LOSSを定義しない。

Nonterminal classification:

```text
WIN       = player-to-moveが勝者となるresolved successorを少なくとも1つ持つ
LOSS      = 全successorがopponent勝利へresolvedする
RECURRENT = WIN/LOSS fixed point後もunresolved
```

Distanceは`DTF` (distance-to-forced-terminal), legal moves単位:

```text
TERMINAL = 0
WIN      = 1 + min DTF(winning successors)
LOSS     = 1 + max DTF(all opponent-winning successors)
RECURRENT = null
```

WIN側は最短terminal、LOSS側は最大抵抗を選ぶ。

## 9. Independent solver design

Production:

```text
raw-state graph construction
research guard-free Mtaji transition
synchronous-wave retrograde fixed point
```

Independent verifier:

```text
independent Mtaji legal-move generator
independent guard-free transition
independent state serialization
independent closure traversal
predecessor propagation + unresolved-successor counting
```

reachability witness regenerationだけは同じfrozen witness-generation infrastructureを共有した。

## 10. Formal exact result

Graph identityはStage 0 freezeと完全一致した。

```text
states = 8
edges = 7
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
```

Canonical solution SHA-256:

```text
4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Frozen root result:

```text
state key = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
player to move = Player 0
value = WIN
absolute forced winner = Player 0
DTF = 3
optimal move set = { capture:mtaji:1:4:left:::false }
```

唯一のLOSS state:

```text
state key = 6de4c58523ec71d1365d3dcb2f834c98ffb762c3562bfb4beea538e872a02d67
player to move = Player 1
value = LOSS
absolute forced winner = Player 0
DTF = 2
maximum-resistance moves = {
  takata:mtaji:1:0:left:::false,
  takata:mtaji:1:0:right:::false
}
```

2つのnonterminal DTF=1 WIN statesは、それぞれPlayer 0に2つのDTF-minimizing capture moveを持つ。

全8 state rowは`results/STAGE_1_EXACT_RESULT.json`をcanonical state-level resultとする。

## 11. Independent exact verification

Scientific workflow run `32702596730` でproduction generation後にindependent reconstruction/recomputationを実施した。

完全一致項目:

```text
rootKeys = true
stateCount = true
edgeCount = true
stateSetSha256 = true
transitionSetSha256 = true
counts = true
fullStateRows = true
recurrentSccs = true
solutionSha256 = true
```

Verification:

```text
passed = true
exactClaimAuthorized = true
production result SHA-256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
verification result SHA-256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

## 12. Formal decision

> **`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`**

Frozen `REWR-S1-DOMAIN-2026-08-24-v1`について、全state・全legal edge・terminal winner・WIN/LOSS/RECURRENT value・optimal move set・DTFがproduction solverとindependent verifierで完全一致したため、bounded exact oracleとして承認する。

## 13. Interpretation boundary

許可されるclaim:

> 標準初期局面から到達証明を持つ1つのfrozen Mtaji rootの完全forward closure（8 states / 7 edges）について、exact game-theoretic solutionが得られた。rootはPlayer 0のforced WINでDTF=3、unique optimal moveは`capture:mtaji:1:4:left:::false`である。

許可されない一般化:

- Bao全体が解けた;
- 全Mtajiが解けた;
- 全終盤が解けた;
- Baoにcycle/drawが存在しない;
- engine evaluationやempirical win rateの正しさが証明された;
- symmetry/isomorphismが証明された;
- 8-state domainがBao終盤の代表サンプルである。

RECURRENT=0は、この8-state domainについてのみexactである。

## 14. Scientific value despite small domain

Domainは小さいが、Study 1の目的は最大規模tablebaseを作ることではなく、Bao engine/rules上で**bounded exact oracleをprospectively選択・freeze・二重実装で完全検証できる研究手順**を確立することだった。

このoracleは今後のSymmetry / Isomorphic Positions Studyで、候補変換がvalue、optimal move set、DTFを保存するかを検証するground truthとして利用できる。またState Space / Game Tree Complexity Studyでは、symmetry reduction前のraw exact identity referenceとして使用できる。
