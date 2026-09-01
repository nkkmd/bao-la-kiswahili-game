# PBAI-P2 Evidence Firewall

Status: **FROZEN / PRE-OUTCOME**  
Program: `PBAI-P2`  
Freeze date: 2026-09-01

## 1. Scientific evidence universe

```text
allowed scientific evidence
= Research Generation 2 canonical evidence at or before
  cd200b85c1eb24aa4419bd5a9573552f3682f00d

Research Generation 1 scientific evidence
= NOT AN AUTHORIZED PBAI-P2 CANDIDATE PREMISE

Research Generation 3 influence
= ZERO
```

`cd200b85...`は`Record Research Generation 2 main integration checkpoint`であり、immediate child `c5e33524c32b9ce9994760bababa08a85b6570d8`が`Add Research Generation 3 program plan`であることをhistory auditで確認した。このcutoffをcandidate outcome前にimmutable freezeする。

## 2. current mainとの分離

Program開始時のremote `main`:

```text
2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

`current main`は次の目的にのみ使用できる。

- integration base / repository operational state確認
- current public AI sourceのread-only identity監査
- AI Engineeringのcurrent naming / governance確認
- PBAI-P2自身のbranch / documentation integration

`current main`に存在するpost-cutoff research contentはscientific evidence universeを拡張しない。

## 3. Research Generation 3 hard exclusion

以下はPBAI-P2 candidate設計、selection、threshold、validation、interpretation、release decisionへの入力を禁止する。

```text
Research Generation 3 scientific evidence
Research Generation 3 development observations
Research Generation 3 formal results
Research Generation 3 diagnostic results
Research Generation 3 hypotheses
Research Generation 3 measurements
Research Generation 3 candidate mechanisms
Research Generation 3 documentation-derived engineering ideas
Research Generation 3 post-cutoff hindsight
```

原則として`doc/research-generation-3/`、Research Generation 3 Study directories、results、checkpoints、program decisionsを読まない。operational history確認でpost-cutoff commit/fileの存在を認識しても、その内容をcandidate decisionへ使用しない。

## 4. PBAI-P1 use boundary

PBAI-P1から再利用できるのはengineering governanceだけである。

Allowed:

- prospective gate design discipline
- exact baseline freeze procedure
- candidate lifecycle / feature-off ablation
- development / validation / protected holdout separation
- no-rescue semantics
- AI generation naming
- release / rollback record structure

Not allowed as PBAI-P2 scientific premise:

- Research Generation 1 scientific evidence used by PBAI-P1
- `PBAI-C001-v1`〜`PBAI-C005`のfailed/held outcomeをthreshold変更等で救済すること
- PBAI-P1 candidate outcomeから都合のよいPBAI-P2 scientific claimを作ること

## 5. immutable Research Generation 2 boundaries

PBAI-P2 engineering resultは次を変更しない。

```text
G2-01 / PEOCR-STUDY1 = INCONCLUSIVE
G2-02 / SRDR-STUDY1 = INCONCLUSIVE
G2-03 / STSCV-STUDY1 = INCONCLUSIVE
validated transform set = []
G2-04 / REEOE-STUDY1 = INCONCLUSIVE
G2-05 / DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
G2-06 / RCPR-STUDY1 = STAGE1-TECHNICAL-INVALID
G2-07 / PCRPR-STUDY1 = STAGE1-TECHNICAL-INVALID
G2-08 / MDFT-STUDY1 = NON-ESTIMABLE
G2-09 / TMGC-STUDY1 = TECHNICAL-INVALID
G2-10 / UMSSR-STUDY1 selectedRepresentation = null
G2-10 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Pre-G2-11 / PSRRE-STUDY1 = NON-ESTIMABLE
Pre-G2-11 selectedRepresentation = null
G2-11 = NON-ESTIMABLE
G2-11 execution = NOT-AUTHORIZED-NOT-EXECUTED
G2-12 / SSGTGE-STUDY1 = TECHNICAL-INVALID
G2-12 selectedEstimator = null
```

## 6. prohibited inference ledger

```text
engine score -> validated Bao win probability = NOT AUTHORIZED
validated transform / canonicalization = none
symmetry-reduced state identity = NOT AUTHORIZED
validated strategic-regime representation = none
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
G2 technical-invalid production-only result -> validated scientific result = NOT AUTHORIZED
machine-only evidence -> human difficulty/error/deception claim = NOT AUTHORIZED
higher-resource search -> game-theoretic truth = NOT AUTHORIZED
```

## 7. contamination handling

Research Generation 3由来情報を偶然認識した場合:

1. candidate/design/threshold/interpretationへ使用しない。
2. PBAI-P2 canonical decision recordへscientific supportとして引用しない。
3. その情報が既にdecisionに混入した疑いがある場合、affected decisionを`TECHNICAL-INVALID`または`NOT-AUTHORIZED`としてfail closedし、outcomeを見る前に独立したclean contractを作り直せる場合だけ再開する。
4. protected holdoutを消費済みなら同じholdoutで救済しない。

## 8. firewall status

```text
cutoff verified = true
cutoff frozen = true
Research Generation 3 content used for candidate design = false
Research Generation 3 result used for threshold setting = false
Research Generation 3 result used for baseline choice = false
PBAI-P1 Research Generation 1 evidence reused as PBAI-P2 premise = false
firewall status = ACTIVE / PASS
```
