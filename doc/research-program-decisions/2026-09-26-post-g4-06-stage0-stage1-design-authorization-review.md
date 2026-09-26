# 2026-09-26 — post-G4-06 Stage 0 / pre-Stage 1 設計認可レビュー

Review ID: `LGTGECB-STUDY1-STAGE1-DESIGN-AUTH-2026-09-26-V1`  
Agenda: `Research Generation 4 / G4-06`  
Study: `LGTGECB-STUDY1`  
Stage 0: **`COMPLETE / STAGE0-TECHNICAL-PASS`**  
判定: **`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / EXECUTION-NOT-YET-AUTHORIZED`**

## 1. 審査対象

G4-06 Stage 0で、bounded RAW geometryとexact solver outputを接続し、value-preserving move、DTF整合、有限pair ordering、concordance/tie集計をproduction / independent実装で再現できるtechnical prerequisiteが成立した。

本レビューでは、G4-05 canonical Stage 2の固定8 formal domainsを使用するStage 1 formal bridge mappingについて、**科学結果を生成する前にpopulation、geometry scalar、exact consequence、relation matrix、estimability rule、resource ceilingを固定できるか**を審査する。

本レビューはStage 1 scientific executionをまだ認可しない。実装完了後、source blob SHAとworkflowを監査した別のone-shot authorizationを必須とする。

## 2. Stage 0 prerequisite

Canonical Stage 0:

```text
run = 36211754989 / attempt 1 / success
head = 355162ae40cabcc443944133aa1168a1588fcba3
artifact ID = 10896360387
artifact SHA-256 = 7cfc9c10d23886e78b8c7f0bb2a8e226c35a31035c36433c2770f32510270009
mandatory gates = 12 / 12 PASS
production / independent agreement = true
G4-05 formal-domain bridge reads = 0
G4-10 depth-11 accesses = 0
```

よってformal bridge designへ進むtechnical prerequisiteは満たされた。

## 3. formal population freeze

`STAGE_1_FORMAL_INPUT_MANIFEST.json`にG4-05 canonical Stage 2でcompleteだった8 domainをexact tupleとして固定した。

```text
N = 8 formal domain roots
WIN = 2
LOSS = 6
experimental unit = domain/root
state / edge / move pseudoreplication = forbidden
```

各domainについてseed、ply、rootStateKey、root legal move count、state/edge count、state/transition digest、maximum move microsteps、solution digest、root status、absolute winner、DTF、optimal move keysをupstream記録どおり固定した。

候補pool再scan、seed block再scan、domain追加、root replacement、G4-05 `STATE-LIMIT` candidate救済は禁止する。

## 4. root再物質化

production pathはmanifestに記録された各seedについて、**そのmanifest plyまでだけ**deterministic trajectoryを生成し、`(seed, ply, rootStateKey)`が完全一致するrootだけを採用する。

independent pathはproductionのtrajectory helperを共有せず、独立RNG・move-key・state-key pathで同じfixed tupleを再物質化する。

この処理はG4-05のcandidate selectionやformal decisionを再実行するものではない。G4-05候補集合をscanしない。

再物質化後は、manifestに固定した上限でexact closure / solutionを構築し、次がupstreamと完全一致しなければStage 1を`TECHNICAL-INVALID`としてfail-closedする。

- state count / edge count
- state-set SHA-256
- transition-set SHA-256
- solution SHA-256
- root `WIN` / `LOSS`
- absolute winner
- DTF
- optimal move keys

## 5. geometry scalar freeze

relative horizon 5 / RAW-only / transform set `[]`を維持し、次の4 scalarだけをformal relation matrixへ使用する。

1. `GEO-CORRIDOR` — `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
2. `GEO-TREE-RAW` — `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
3. `GEO-TRANSPOSITION` — `SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION`
4. `GEO-REPLY` — F5 `immediateReplyWidth`のroot legal move全体のexact rational mean

`GEO-TRANSPOSITION`にG3-04 C4の過去scientific claim statusは持ち込まない。ここではvalidated measurementから得るscalarとしてのみ扱う。

結果確認後のmetric追加・削除、depth変更、別のscalarへの置換は禁止する。

## 6. exact consequence freeze

Primary exact consequenceは次の3個だけとする。

1. `EXACT-VALUE` — root exact `WIN` / `LOSS`
2. `EXACT-DTF` — root exact distance-to-finish
3. `EXACT-VPMC` — **rootと同じabsolute winnerを維持する合法root move数**

`EXACT-VPMC`はterminal childを含む。rootは固定8 domainすべてdecisiveであるため、この定義を使用可能とする。

DTF-optimal moveは補助integrity constructとし、`child DTF + 1 = root DTF`を満たすvalue-preserving move key集合がexact solver `optimalMoveKeys`と完全一致することを要求する。primary relationには追加しない。

## 7. relation matrix

4 geometry × 3 consequence = **12 relation**を全て報告する。

```text
R-VALUE-CORRIDOR
R-VALUE-TREE-RAW
R-VALUE-TRANSPOSITION
R-VALUE-REPLY
R-DTF-CORRIDOR
R-DTF-TREE-RAW
R-DTF-TRANSPOSITION
R-DTF-REPLY
R-VPMC-CORRIDOR
R-VPMC-TREE-RAW
R-VPMC-TRANSPOSITION
R-VPMC-REPLY
```

結果に応じてrelationを削除・追加しない。

## 8. finite exact summary

### EXACT-VALUE

2 WIN × 6 LOSS = 12 cross-class pairsを全て比較する。

- `WIN_GREATER`
- `WIN_LESS`
- `TIE`

をexact countする。

方向を事前選択しない。informative pairが0なら`NON-ESTIMABLE-NO-INFORMATIVE-CROSS-CLASS-PAIRS`。片方向のみなら対応するorder-consistent token、両方向が存在すれば`MIXED-ORDER`とする。tieは除去せず別countとして保持する。

### DTF / VPMC

8 rootsの全unordered pair = 28 pairsについて、

- `CONCORDANT`
- `DISCORDANT`
- `GEOMETRY_TIE`
- `CONSEQUENCE_TIE`
- `BOTH_TIE`

をexact countする。

geometryまたはconsequenceにvariationがなければ`NON-ESTIMABLE`。informative pairが0なら`NON-ESTIMABLE-NO-INFORMATIVE-PAIRS`。concordantのみならincreasing order-consistent、discordantのみならdecreasing order-consistent、両方があれば`MIXED-ORDER`とする。

通常の大標本近似p-valueを主張しない。

## 9. Study-level decision

12 relationの全てがpositiveである必要はない。

8 fixed rootのidentity / exact digest / geometryをproductionとindependentで一致して再構築し、12 relationをfrozen ruleで全て出力できた場合、Study-level tokenは

**`FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS`**

とする。

relation単位の`MIXED-ORDER`や`NON-ESTIMABLE`はStudy failureではない。

root identity、upstream exact digest、production / independent agreementの不一致は`TECHNICAL-INVALID`としてfail-closedする。

## 10. resource ceiling

upstream G4-05で完全closure済みのdomainを再構築するため、各rootのexact resource ceilingはmanifestの既知upstream値を超えない。

```text
maxStates = manifest stateCount
maxEdges = manifest edgeCount
maxMoveMicrostates = manifest maximumMoveMicrosteps
geometry horizon = exactly 5
```

resource増加によるrescueを認めない。

## 11. 認可される次工程

本レビューで認可するのは次だけ。

- formal production implementation
- formal independent implementation
- formal workflow作成
- source separation検査
- exact source Git blob SHAの取得
- final one-shot authorization文書 / JSONの作成準備

以下はまだ認可しない。

- fixed 8-domainへのformal geometry計算
- fixed 8-domainへのVPMC計算
- 12 relation matrixの生成
- formal workflow execution
- G4-05 candidate rescan
- G4-10 depth-11 access
- public AI変更
- main統合

## 12. 判定

**`STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / EXECUTION-NOT-YET-AUTHORIZED`**

次はformal implementationを作成し、source blob SHA・workflow event・run attempt・branchを固定した最終one-shot authorization reviewを行う。
