# SFCDF-STUDY1 — Decision Register

Updated: 2026-09-02

## SFCDF-D001 — Program authorization

Decision: **ACCEPTED**

`2026-09-02-post-g3-03-g3-04-authorization-review.md`のformal decision `G3-04-AUTHORIZED`を受け、G3-04を新規・prospective・独立Studyとして定義する。

このdecisionはfresh scientific executionをauthorizeしない。

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

combined corridor/funnel binary classは定義しない。

`structural forcing`をgame-theoretic forcingまたはtactical forcingとして扱わない。

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

Mandatory scientific equalityはprototype-sensitive in-memory object equalityではなく、**canonical scientific JSON contentのSHA-256 exact equality**とする。

次はscientific identityから除外する。

- JavaScript object prototype
- property insertion order
- implementation identity
- runtime/timestamp/memory metadata

このruleをfresh evidence後に変更して救済しない。

## SFCDF-D006 — Population / seed freeze

Decision: **FROZEN**

Stage 1:

`31410001..31410192` / target 12 paired trajectories / NOT CONSUMED

Stage 2:

`31420001..31420288` / target 18 paired trajectories / NOT CONSUMED

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

G3-04で部分生成・resource estimation・peekを行わない。

## SFCDF-D009 — No-rescue rule

Decision: **FROZEN**

fresh seed access後にendpoint、threshold、seed、root、representation、horizon、canonical equality ruleを変更しない。同じevidenceをimplementation修正後に再実行しない。

## SFCDF-D010 — Next action

Decision: **STAGE 0 TECHNICAL AUTHORIZATION REQUIRED**

synthetic fixtureとexecution/equality/materializationのみを検証する。Stage 0ではfresh scientific seedを使用しない。
