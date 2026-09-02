# SFCDF-STUDY1 — Decision Register

更新日: 2026-09-02

## SFCDF-D001 — Program authorization

Decision: **ACCEPTED**

`2026-09-02-post-g3-03-g3-04-authorization-review.md`のformal decision `G3-04-AUTHORIZED`を受け、G3-04を新規・prospective・独立Studyとして定義した。

## SFCDF-D002 — Formal Study identity

Decision: **FROZEN**

```text
Study ID = SFCDF-STUDY1
G3 position = G3-04
baseline main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
branch = research/g3-04-structural-forcing-corridor-decision-funnel
```

## SFCDF-D003 — Construct separation

Decision: **FROZEN**

Corridor descriptors:

- C1 unit-width occupancy
- C2 width compression
- C3 longest unit-width run

Funnel descriptors:

- C4 reconvergent-state occupancy
- C5 root-branch overlap
- C6 cumulative tree/RAW ratio

combined corridor/funnel binary classは定義しない。`structural forcing`はbounded reply-narrowing structureだけを意味し、game-theoretic / tactical forcingではない。

## SFCDF-D004 — Measurement boundary

Decision: **FROZEN**

```text
RAW-only identity
relative horizon = 5
validated transforms = []
principal upstream = LGTGMIV F5,F2,F3,F4
auxiliary upstream = LGTGMIV F1
```

G3-02/G3-03 scientific outcomeはpositive upstream evidenceとして使用しない。

## SFCDF-D005 — Cross-implementation equality semantics

Decision: **FROZEN**

Mandatory scientific equalityはprototype-sensitive runtime object equalityではなく、canonical scientific JSON contentのSHA-256 exact equalityとする。

## SFCDF-D006 — Population / seed freeze

Decision: **FROZEN**

```text
Stage 1 = 31410001..31410192 / target 12 paired trajectories
Stage 2 = 31420001..31420288 / target 18 paired trajectories
```

Namua exact ply 24とfirst nonterminal Mtaji >=44を同一trajectoryでpair化する。

## SFCDF-D007 — Stage structure

Decision: **FROZEN**

```text
SFCDF-S0-TECHNICAL-2026-09-02-v1
SFCDF-S1-DEVELOPMENT-2026-09-02-v1
SFCDF-S2-FORMAL-2026-09-02-v1
```

各Stageは別authorizationを必要とする。

## SFCDF-D008 — Protected holdout

Decision: **FROZEN**

standard initial RAW-root complete exact depth-10 holdout:

**SEALED / NOT GENERATED / NOT READ**

G3-04では部分生成・resource estimation・peekを行わない。

## SFCDF-D009 — No-rescue rule

Decision: **FROZEN / ACTIVE**

fresh seed access後にendpoint、threshold、seed、root、representation、horizon、canonical equality ruleを変更しない。同じevidenceをimplementation修正後に再実行しない。

## SFCDF-D010 — Stage 0 v1 pre-fixture abort

Decision: **TECHNICAL ABORT / NO SCIENTIFIC CONSEQUENCE**

run `33616688284`はprereg JSON parse時にsynthetic fixture前で停止した。fresh scientific seed accessは0。

## SFCDF-D011 — Stage 0 v2 technical result

Decision: **`STAGE0-PASS`**

```text
run = 33620251552
artifact = 9842597981
artifact ZIP SHA-256 = 028ad7e5034cc4954003b081ca6f0c7ac2bc44a97db0f397fe78ea65f21b7021
deterministic core = 14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295
```

## SFCDF-D012 — Stage 1 pre-authorization tooling

Decision: **PASS**

Identity-only firewall、actual control-plane smoke、source validationをStage 1/2 seed accessなしでPASSした。

```text
tooling smoke run = 33621353261
source validation run = 33621535038
Stage 1 scientific workflow runs before authorization = 0
```

## SFCDF-D013 — Stage 1 authorization

Decision: **`STAGE1-AUTHORIZED` / exactly one execution**

```text
authorization baseline = 140d5827fea9affee46aa15f08cbe15eb7775129
nonce = SFCDF-S1-AUTH-2026-09-02-V1-01
maxScientificExecutions = 1
```

## SFCDF-D014 — Stage 1 development result

Decision: **`STAGE1-PASS`**

Single authorized run `33621863279` completed with 12 paired trajectories and exact production/independent agreement.

Promoted set:

```text
C1 SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
```

C2–C5はpromotionされなかった。

Stage 1 seed blockはCONSUMED、no-rescue boundaryはCROSSEDした。

## SFCDF-D015 — Stage 2 preparation and formal-input firewall

Decision: **`STAGE2-PREPARATION-ELIGIBLE` / PASS**

Stage 1 PASS後、Stage 2 scientific authorizationとは分離してformal inputをmaterializeした。

```text
formal input blob = 88563b39f2e9fec2bdf0e00eb40ec9debbba9ff0
Stage 1 identity firewall = 24 RAW roots / 24 trajectories / 12 first-16 prefixes
retained Stage 1 scientific fields = promotedCandidates only
Stage 2 source validation run = 33624044515 / PASS
Stage 2 fresh evidence before authorization = false
```

## SFCDF-D016 — Stage 2 authorization

Decision: **`STAGE2-AUTHORIZED` / exactly one execution**

```text
authorization baseline = 1d6ba1982855cc3ddf3abf9ebd9c9b8daa5c21c4
nonce = SFCDF-S2-AUTH-2026-09-02-V1-01
maxScientificExecutions = 1
seed block = 31420001..31420288
target pairs = 18
```

Formal candidatesはC1/C6だけに固定し、C2–C5を復活させない。

## SFCDF-D017 — Stage 2 formal result

Decision: **`STAGE2-PASS`**

Single authorized run:

```text
workflow run = 33624399706
lease commit = 325366baedcd437f45991e2941bc38fc2e04bd1f
artifact ID = 9844368476
artifact ZIP SHA-256 = c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f
result mirror commit = e850dca8236745cb611cf2e0f60ed9113b6ed4a8
production scientific core = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
independent scientific core = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
```

Formal candidate labels:

- **C1 = CONFIRMED / MTAJI-GREATER** — 18/18 same-direction nonzero differences; exact two-sided sign-test `p=1/131072`; Holm PASS.
- **C6 = CONFIRMED / NAMUA-GREATER** — 18/18 same-direction nonzero differences; exact two-sided sign-test `p=1/131072`; Holm PASS.

## SFCDF-D018 — Study closure

Decision: **`CLOSED / FORMAL-COMPLETE`**

`CLOSED / FORMAL-COMPLETE`はrepository lifecycle statusである。preregistered scientific inferenceはcandidate-levelの`CONFIRMED` / `NOT-CONFIRMED`だけであり、事後的なomnibus scientific labelは追加しない。

Formal closure:

```text
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS
Stage 2 = STAGE2-PASS
C1 = CONFIRMED / MTAJI-GREATER
C6 = CONFIRMED / NAMUA-GREATER
Stage 1 seed = CONSUMED
Stage 2 seed = CONSUMED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## SFCDF-D019 — Interpretation boundary at closure

Decision: **FROZEN**

Confirmed C1/C6 findingsは、frozen populationにおけるrelative depth 5のbounded RAW local structural descriptorsのphase差としてのみ解釈する。

以下へ拡張しない。

- game-theoretic / tactical forcing
- optimal move inevitability / best-move clarity
- search stability / search ease
- strategic simplicity
- human difficulty / ease
- position value / win probability
- causal phase effect
- deeper-tree generalization
