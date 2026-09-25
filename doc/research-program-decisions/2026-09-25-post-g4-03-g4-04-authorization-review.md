# 2026-09-25 — post-G4-03 current-state G4-04 認可レビュー

Review ID: `G4-04-AUTHORIZATION-REVIEW-2026-09-25-V1`  
Agenda: `Research Generation 4 / G4-04`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `1274c9cf408f0e044c39751599941a6f75e96a4c`  
判定: **`G4-04-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
fresh scientific seed access: **0 / NOT AUTHORIZED YET**  
formal scientific outcome: **NOT GENERATED**

## 1. 審査対象

G4-04のAgenda上の問いは、G3-10 `GCLD-STUDY1`でformal confirmationされた次の4 claimについて、fresh trajectory policy、phase構成、root-family contractの下でも同じ方向が再現する範囲と、反対方向または非再現の境界をprospectiveに検証できるか、である。

```text
C1 DIRECTIONALITY / PATH EFFICIENCY = ACTUAL-GREATER
C2 PERSISTENCE / LAG-DISTANCE GRADIENT = ACTUAL-GREATER
C3 RETURN FRACTION = ACTUAL-LESS
C5 FIRST-ORDER DIRECTIONAL PATH DEPENDENCE = ACTUAL-GREATER
```

G3-10 C4 `chronology-conditioned circulation`は`NOT-CONFIRMED`であり、G4-04のpositive transfer targetへ含めない。

G3-10のformal resultはbounded populationと`CRCLGR-R1-EXACT-SQUASHED-L1` representation内のtrajectory-level chronology associationであり、game-theoretic value、AI strength、人間のdifficulty、因果mechanismを意味しない。この境界をG4-04でも維持する。

## 2. current-state prerequisite

```text
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED before this review
```

G4-02およびG4-03のscientific resultはG4-04のpositive/negative evidenceとして使用しない。G4-03 closureはprogram current-state確認とprotected-boundary確認の背景情報に限定する。

G4-01 canonical Stage 1R resultはGCLD familyを`compatible = true`とし、scientific effect、formal generalization decision、formal counterexample decisionを生成していない。よってG4-01はG4-04のreadiness prerequisiteを満たすが、G4-04のscientific conclusionを先取りしない。

## 3. upstream claim identity

G3-10 formal Stage 2で確認された4 claimだけをpositive transfer targetとする。

固定representation:

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
axes = CRCLGR-A1..A6
coordinate arithmetic = EXACT-REDUCED-RATIONAL
trajectory distance = equal-weight exact L1
validated transform set = []
```

固定endpoint identity:

```text
C1 = directionality / path efficiency
C2 = persistence / lag-distance gradient
C3 = return fraction
C5 = first-order directional path dependence
```

G3-10の時間順序controlはendpoint-preserving order-destroyed controlsであり、endpoint集合を同じに保ったままinternal checkpoint orderを破壊する。G4-04で同一constructを移送検証する場合、control semanticsを結果確認後に変更しない。

## 4. G4-01から利用可能なfresh transfer axes

G4-01でGCLD compatibilityを確認したsource policyは次の2つである。

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

G4-01 GCLD compatibility contractは次を確認した。

```text
unit = one source trajectory with frozen longitudinal checkpoints
compatibility checkpoints = 20,28,40,52,60
minimum support = 12 trajectories per policy with >=4 measurable checkpoints and both phases
production / independent exact agreement = required
GCLD family compatibility = true
```

ただし、このcompatibilityはG4-03 SILGMと同じ`P×RF` 4-cell formal designを直接適格化したものではない。したがってG4-04はroot-family軸を「既にformal-ready」とみなさず、preregistrationでtrajectory/root-family contractを固定し、Stage 0 technical validationでhelper precondition・measurement exactness・resource feasibilityを確認する。

## 5. representation boundary

G4-04は`CRCLGR-R1-EXACT-SQUASHED-L1`の既存eligibility範囲内でのみ進める。

次を禁止する。

- representation axisの追加・削除
- distance metricの変更
- symmetry/canonicalization導入
- relative depth変更
- floating approximationへの置換
- outcomeを見た後のcheckpoint/control定義変更

representation変更が必要になった場合、G4-04内部のtechnical amendmentでは救済せず、別の新規representation prerequisiteを先に置く。

## 6. freshness / evidence firewall

G4-04はG3-10、G3-12、G4-01のrepair/reopenではない。fresh access前にidentity-only firewallを固定する。

### G3-10

```text
Stage 1 seeds = 32210001..32210256 / excluded
Stage 2 seeds = 32220001..32220384 / excluded
prior full trajectories = excluded
prior opening prefixes = excluded
prior measured checkpoint identities = excluded where auditable
prior trajectory-level scientific measurements = selection input prohibited
```

### G3-12

```text
scientific seed/evidence reuse = prohibited
LGTGGC-STUDY1 = historical methodology reference only
technical-invalid result = neither positive nor negative scientific evidence
```

### G4-01 GCLD compatibility

```text
interrupted Stage 1 GCLD seeds = 40113001..40113384 / quarantined
Stage 1R GCLD primary seeds = 40213001..40213384 / excluded
Stage 1R GCLD paired reserve namespace = 41213001..41213384 / excluded
```

G4-01 Stage 1Rでreserve useが0でも、namespace全体をG4-04から除外する。

G4-04 Stage 2はG4-04 Stage 1のseed、full trajectory、opening-prefix、checkpoint RAW-state identity、trajectory identityを排除する。

## 7. fresh seed namespace readiness

repository default branchの事前検索で次の候補開始seedに予約衝突を認めなかった。

```text
Stage 1 candidate block start = 40413001
Stage 2 candidate block start = 40423001
```

正式なend、count、policy assignment、reserve ruleはpreregistrationでscientific access前に固定する。seed extensionは認可しない。

このレビュー時点では候補seedを生成・readしていない。

## 8. inferential design readiness

G3-10 claim identityを変更せずtransferを検証するため、次をpreregistrationでfreeze可能である。

- C1/C2/C3/C5の4 endpoint
- upstream direction `GREATER/GREATER/LESS/GREATER`
- G4-01 compatible P1/P2 source policies
- fresh trajectory/root-family domain contract
- phase composition/support gate
- endpoint-preserving order-destroyed controls
- exact reduced-rational endpoint arithmetic
- exact two-sided sign-based transfer inferenceまたは同等の事前固定exact procedure
- fixed family multiplicity control
- `GENERALIZATION-CONFIRMED` / `COUNTEREXAMPLE-CONFIRMED` / `NOT-GENERALIZED` / `NON-ESTIMABLE` / `TECHNICAL-INVALID`の分離

Stage 1はeffect discoveryやcheckpoint relearningに使用せず、population support、endpoint definedness、production/independent exactness、resource readiness、firewall exactnessだけを確認する設計とする。

## 9. 認可gate

| Gate | 判定 | 根拠 |
|---|---|---|
| G4-01 prerequisite | PASS | GCLD=`compatible=true` / `COMPATIBILITY-ELIGIBLE-ALL` |
| G3-10 upstream claims | PASS | C1/C2/C3/C5がformal `CONFIRMED` |
| C4 exclusion | PASS | C4は`NOT-CONFIRMED`のためpositive transfer targetから除外 |
| representation identity | PASS | `CRCLGR-R1-EXACT-SQUASHED-L1`を変更せず固定可能 |
| fresh source policy | PASS | G4-01 compatibility済みP1/P2 |
| root-family contract | PASS-AS-PREREQUISITE | G4-04専用にfresh evidence前の固定とStage 0確認が必要 |
| G3-10 scientific firewall | PASS-AS-PREREQUISITE | prior seed namespace既知、identity-only exclusion可能 |
| G4-01 compatibility firewall | PASS-AS-PREREQUISITE | GCLD seed namespaces既知、fresh access前に除外可能 |
| G3-12 separation | PASS | evidence/seed reuse禁止、methodology referenceのみ |
| new seed namespace | PASS-AS-DESIGN | candidate starts `40413001` / `40423001`に予約衝突なし |
| exact measurement | PASS-AS-DESIGN | CRCLGR/GCLD production-independent exact implementationsが利用可能 |
| protected boundaries | PASS | G3-11 depth10 rerun、G4-10 depth11 access、public AI変更なしで実施可能 |

## 10. 認可される次工程

本レビューにより次を認可する。

- formal Study ID / titlesの固定
- research branch `research/g4-04-geometry-trajectory-transfer` の使用
- preregistrationの作成・freeze
- Stage 0 technical fixtures / verification
- Stage 1 / Stage 2 fresh seed namespaceの予約のみ
- G3-10 / G4-01 / G4-04内部identity firewall契約の固定
- source policy、trajectory/root-family contract、checkpoint/control contract、endpoint、formal test、multiplicity、resource ceiling、stopping/no-rescue、decision mappingの固定

本レビューだけでは次を認可しない。

- fresh Stage 1 scientific seed generation/read
- fresh Stage 2 formal seed generation/read
- formal effect / p-value / generalization / counterexample decision生成
- G3-10 scientific evidence replay
- G3-12 seed/evidence reuse
- G3-11 depth10 rerun
- G4-10 depth11 access
- `main`統合
- public AI変更

## 11. 最終判定

**`G4-04-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

次工程ではG4-04を独立したfresh prospective Studyとして完全freezeし、Stage 0 technical verificationを通過した後にのみ、fresh Stage 1 accessについて別authorization reviewを行う。
