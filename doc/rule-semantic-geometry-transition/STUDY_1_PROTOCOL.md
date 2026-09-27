# G4-08 / BRSGT-STUDY1 — Study 1 Protocol

更新日: 2026-09-27  
状態: **PROSPECTIVE / STAGE 0 TECHNICAL CONTRACT FROZEN / FRESH SCIENTIFIC EXECUTION NOT AUTHORIZED**

## 1. Formal identity

```text
Program position = Research Generation 4 / G4-08
Study ID = BRSGT-STUDY1
English title = Bao Rule-Semantic Geometry Transition Study 1
日本語題目 = capture、nyumba、reserve、Namua→Mtajiに伴う局所幾何変化の分解 — event-specific compatibilityとreachable contextを用いたmove-conditioned exact解析
reviewed main = 2023860419d13b6f294b0600943de8fb4e50b1bb
research branch = research/g4-08-rule-semantic-geometry-transition
authorization review = G4-08-AUTHORIZATION-REVIEW-2026-09-27-V1
```

本StudyはG3-06 `BRMGI-STUDY1`のrepair/version incrementではない。new Study identity、new scientific namespace、new event-selection contractを持つ独立prospective Studyである。

## 2. Authorized scope

現時点で認可されるのはpreregistrationとtechnical-only Stage 0のみ。

```text
fresh scientific seed access = false
scientific outcome generation = false
Stage 1 = NOT AUTHORIZED
Stage 2 = NOT AUTHORIZED
G4-10 depth-11 access = false
public AI change = false
```

## 3. Immutable representation / instrument boundary

Authoritative RAW state identity:

`pits,reserve,houseOwned,player,phase,winner,pending`

Canonical move identity:

`type,phase,row,index,direction,side,houseChoice,houseTwo`

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED
measurement foundation = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
```

使用可能なmeasurement familyはLGTGMIV F1-F5の適格範囲内だけとする。

## 4. Event-unit identity

通常eventの基本unitは:

```text
(eventFamily, RAW pre-state, canonical legal move, RAW complete post-state)
```

`post-state`はrelay、capture、nyumba処理、turn finish、player switch、phase transitionを含むcomplete move後のRAW stateとする。

NYUMBA familyだけはsame-root variant pairを基本unitとする。

```text
(eventFamily=E2, RAW common pre-state, canonical physical move,
 stop legal variant, use legal variant, stop complete post-state, use complete post-state)
```

## 5. Event family contracts

### E1 — `BRSGT-E1-CAPTURE`

transitionのcanonical legal moveが`move.type == "capture"`ならE1。

capture可能rootではcaptureがmandatoryなため、generic same-root non-capture counterfactualを要求しない。primary constructはcapture move前後のevent-conditioned geometry difference。

### E2 — `BRSGT-E2-NYUMBA-USE-VS-STOP`

Namua capture rootで、同じphysical move identityについて`houseChoice=stop`と`houseChoice=use`の両variantが合法であり、complete post RAW stateが異なり、moverのhouse ownershipが:

```text
pre = true
stop post = true
use post = false
```

となるpair。

same-root / same-physical-move exact pairとして扱う。複数pairが存在する場合のselectionはcanonical physical move key昇順で固定する。

### E3 — `BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION`

```text
pre.phase = namua
post.phase = namua
pre.reserve[mover] - post.reserve[mover] = 1
```

となるcomplete move transition。

Namua→Mtaji transitionとは分離し、E4へpoolしない。

### E4 — `BRSGT-E4-NAMUA-TO-MTAJI`

```text
pre.phase = namua
post.phase = mtaji
```

となるcomplete move transition。

reserve depletionとphase transitionがengine semantics上mechanically linkedしていても、E3とは別familyとして記録する。E4をgeneric reserve-decrement causal effectへ読み替えない。

## 6. Compound / overlap handling

E1、E3、E4は同一transition上で重なり得るためfull event-label vectorを保存する。

E3とE4は定義上mutually exclusive。

E2はsame-root variant-pair constructであり、source actual move labelとは別に保持する。

結果後のcompound exclusion、exclusive reclassification、favorable subtype rescueは禁止する。

## 7. Geometry endpoint family

pre/post rootで次の6 exact metricを計算する。

1. `BRSGT-M1-ROOT-LEGAL-WIDTH` — root legal move count
2. `BRSGT-M2-CUMULATIVE-TREE-OCCURRENCE` — relative depth 0..5 tree occurrence total
3. `BRSGT-M3-GLOBAL-DISTINCT-RAW-STATES` — relative depth 0..5 distinct RAW state total
4. `BRSGT-M4-DUPLICATE-TRANSITION-FRACTION` — duplicate encounter / unique transition occurrence exact rational
5. `BRSGT-M5-CUMULATIVE-TREE-RAW-RATIO` — M2 / M3 exact rational
6. `BRSGT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION` — reply width 1 state presence / positive reply-width nonterminal state presence exact rational

M1-M6はF1-F5からdeterministically派生する。新しいunvalidated geometry primitiveをStage 0で追加しない。

## 8. Exact arithmetic

通常event transitionについて各metric `m`のpre/post differenceを:

`D_m = G_m(post) - G_m(pre)`

とする。

E2についてはcommon pre-rootからstop/useをそれぞれ計算し、primary pair contrastを:

`N_m = G_m(use_post) - G_m(stop_post)`

とする。

integerまたはreduced rationalだけをcanonical scientific/technical coreに使用する。float toleranceやpost-hoc roundingを使わない。

## 9. Causality boundary

default interpretationは:

**`EVENT-CONDITIONED PRE/POST ASSOCIATION`**

E2のsame-root pairも、それだけでwhole-Bao causal mechanismを確立しない。

legal no-event counterfactualが存在しないfamilyでcausal effectを主張しない。counterfactual module追加には別prospective authorizationを要求する。

## 10. Stage structure

### Stage 0 — `BRSGT-S0-TECHNICAL-2026-09-27-v1`

Evidence class: `TECHNICAL-FIXTURE`

fresh scientific seedを生成・readしない。

Stage 0は以下を検証する。

1. RAW state/move serialization
2. complete move application
3. E1-E4 event predicate semantics
4. E2 same-root pair extraction
5. compound label vector
6. production/independent unit-by-unit selection exact agreement
7. pre/post measurement binding
8. M1-M6 exact endpoint agreement
9. exact difference/pair arithmetic
10. undefined denominator handling
11. terminal / relay-limit fail-closed semantics
12. canonical JSON/digest determinism
13. firewall marker semantics
14. resource ceiling
15. scientific execution flag false
16. scientific seed reads 0
17. G4-10 depth-11 access 0

Stage 0 PASSはStage 1を自動認可しない。

### Stage 1 — development / event-specific compatibility

`NOT AUTHORIZED`。

fresh access前に別reviewでsource policy、seed block end/count、event support target、selection contract、estimability gate、resource ceiling、firewallをfreezeする。

### Stage 2 — formal heldout

`NOT AUTHORIZED`。

valid Stage 1 closure後に別reviewを要求する。

## 11. Stage 0 fixture policy

Stage 0は次のtechnical fixtureだけを使用できる。

- `public/engine.js`から生成するinitial RAW state
- protocol内event semanticsを満たすため手作業で構成したsynthetic RAW states
- それらの全canonical legal move / moveVariants
- deterministic canonical ordering

PRNG seed、G3/G4 scientific seed namespace、historical scientific trajectory/rootを使用しない。

G3-06 technical implementationはhistorical referenceとして読めるが、そのStage 1 selector outputやscientific evidenceをfixtureへ取り込まない。

## 12. Stage 0 selector-agreement gate

G3-06 technical-invalidの再発防止のため、単なるcount一致を禁止する。

production / structurally independent implementation間で、各fixtureについて次をcanonical exact比較する。

```text
fixture ID
event family labels
pre RAW identity
canonical move identity
post RAW identity
inclusion/exclusion disposition
NYUMBA physical-move key / stop-use identities
overlap label vector
canonical ordering
```

1 rowでも不一致なら`TECHNICAL-INVALID`。

## 13. Stage 0 resource ceiling

```text
relative depth = exactly 5
max distinct geometry root measurements = 8
max Stage 0 event transitions materialized = 128
fresh scientific seed reads = 0
protected G4-10 depth-11 reads = 0
```

resource ceilingを超えた場合は`TECHNICAL-INVALID`またはtechnical fail-closedとし、ceilingを緩和して同じauthorized executionを救済しない。

## 14. Candidate future namespace

```text
Stage 1 candidate block start = 40813001
Stage 2 candidate block start = 40823001
```

衝突確認済み候補にすぎず、現時点で生成・readを認可しない。

G3-06 `3161.../3162...` namespaceは使用しない。

## 15. Freshness firewall requirements for future Stage 1

fresh Stage 1前にidentity-only manifestで少なくとも次をexcludeする。

- G3-06 scientific identities and both Stage namespaces
- relevant G4-01 compatibility scientific/reserve identities
- G4-03 scientific identities when source-policy overlap is possible
- G4-04 Stage 1/2 seeds, trajectories, prefixes, roots
- G4-07 Stage 1/2 seeds, trajectories, prefixes, roots

Stage 2ではさらにBRSGT Stage 1 identityをexcludeする。

prior outcome、effect direction、p-value、winnerをselection inputにしない。

## 16. Failure handling

以下はscientific negative resultではなく`TECHNICAL-INVALID`またはtechnical fail-closedとする。

- production/independent event-unit mismatch
- production/independent geometry endpoint mismatch
- noncanonical serialization/digest mismatch
- malformed transition
- unexpected relay-limit inside required reconstruction
- resource ceiling breach
- authorization/source binding failure
- scientific seed access during Stage 0
- G4-10 depth-11 access

## 17. No-rescue

fresh Stage 1開始後のselector/event grammar修正、event pooling変更、seed extension、support gate relaxation、metric family変更、relative depth変更、resource ceiling relaxation、same-evidence repair rerunを禁止する。

## 18. Interpretation exclusions

本Studyから自動的に次を主張しない。

- universal causal rule-event law
- whole-Bao geometry law
- game-theoretic value / best move correctness
- search reliability
- AI strength / win rate
- human difficulty / cognition
- G4-07 reversalの因果説明
- public AI変更
