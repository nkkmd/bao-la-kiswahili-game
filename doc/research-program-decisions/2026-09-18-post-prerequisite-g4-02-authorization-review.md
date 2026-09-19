# 2026-09-18 — post-prerequisite G4-02 再認可レビュー

## 正式判定

**`AUTHORIZED`**

Authorization token:

**`G4-02-AUTHORIZED`**

このauthorizationは、新しいprospective Studyの定義・preregistration・technical validationと、Stage別authorization手続を開始することを許可する。fresh scientific seedのreadは、Study contractのfreezeと当該fresh Stageの個別authorizationが完了するまで許可しない。

## 1. review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
current remote main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
first G4-02 review = PREREQUISITE-REQUIRED
freshness prerequisite = PREREQUISITE-SATISFIED-BY-SCOPED-METHODOLOGY-AMENDMENT
G4-02 scientific seed access before this review = 0
G4-02 scientific outcome generated before this review = false
G4-10 depth 11 access = false
public AI change = false
```

## 2. 10項目authorization gate

| Gate | 判定 | 根拠 |
| --- | --- | --- |
| G4-01 prerequisite | **PASS** | `COMPATIBILITY-ELIGIBLE-ALL`; SFCDF compatible。 |
| 移送対象claim | **PASS** | G3-04 C1 `MTAJI-GREATER`、C6 `NAMUA-GREATER`だけをhistorical referenceとして移送する。 |
| C1/C6独立endpoint | **PASS** | endpoint、estimability、formal decisionをclaim別に保持する。 |
| fresh population独立性 | **PASS WITH FROZEN SCOPED AMENDMENT** | G3-04にはseed/trajectory/opening-prefix/RAW-rootの4-way exact exclusionを維持。G4-01 compatibilityにはseed/trajectory/RAW-root + no-outcome-reuseを適用し、Bloom positiveは保守的に除外。 |
| fresh seed namespace | **PASS-AS-DESIGNABLE** | 未使用namespaceをprospective freeze可能。authorization前readは0。 |
| phase/root family/source policy | **PASS-AS-DESIGNABLE** | G4-01で2 source policies × 2 root familiesのSFCDF compatibilityが確認済み。G4-02では4 cellを結果前に固定できる。 |
| production / independent分離 | **PASS** | RAW depth-5 geometryのproduction/independent exact agreement routeが既存。G4-02ではformal aggregationも独立実装する。 |
| estimability / technical / negative分離 | **PASS** | `NON-ESTIMABLE`、`TECHNICAL-INVALID`、`NOT-CONFIRMED`を別状態として固定可能。 |
| resource ceiling / stopping rule | **PASS-AS-DESIGNABLE** | seed count、source ply、per-root geometry ceiling、artifact ceilingをpre-access freeze可能。 |
| no-rescue / no-rerun | **PASS** | G3-04/G3-11/G3-12/G4-01の既存境界を保持し、G4-02でもseed extension・threshold relaxation・favorable subgroup rescueを禁止できる。 |

## 3. freshness prerequisiteの正本

- `doc/research-program-decisions/2026-09-18-g4-02-freshness-methodology-prerequisite-review.md`
- `doc/research-generation-4/g4-02-prerequisites/FRESHNESS_FIREWALL_MANIFEST.json`
- `tools/experiments/verify-g4-02-freshness-firewall.js`

G4-01 opening-prefix strict independenceが検証不能であるという限界は消去しない。G4-02 final reportでもこの方法論上の制約を明記する。

## 4. authorization scope

このauthorizationで許可するもの:

1. 正式Study ID / title / branchの固定
2. Stage structureの固定
3. C1/C6 claim contractの固定
4. 4-cell transfer domainの固定
5. fresh seed blockの予約
6. evidence、selection、endpoint、threshold、multiple-testing、estimability、resource、stopping、no-rescue contractの固定
7. technical fixture / preflightの実装と実行
8. fresh Stageごとの個別authorization artifact準備

このauthorizationだけではfresh scientific seed readを許可しない。

## 5. protected boundary

```text
G3-04 = historical formal record only / no repair / no rerun
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED
G4-01 old 401 namespace = QUARANTINED / NO REUSE
G4-01 Stage 1R source reread = NOT AUTHORIZED
G4-01 Stage 1R full fresh rerun = NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative state identity = RAW
public AI change = NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

## 6. 結論

G4-01 compatibility readiness、G3-04 formal record、freshness firewall prerequisite、no-rerun境界を同時に満たした状態で、新しいprospective G4-02 Studyを設計できる。

**`AUTHORIZED / G4-02-AUTHORIZED`**
