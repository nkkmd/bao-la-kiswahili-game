# State Transformation Semantics / Canonicalization Validation Study 1 — Overview

## Study identity

```text
Agenda label = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Status = STARTED / PROSPECTIVE PROTOCOL FROZEN / PRE-SCIENTIFIC-GENERATION
```

## What this Study asks

Baoの盤面を見た目だけで「左右対称」「座席交換で同じ」と扱うのではなく、状態変換が現在のrule engine上で本当に同じ意味を持つかを厳密に検証する。

検証対象は少なくとも次である。

- authoritative RAW state reconstruction;
- exact legal-move-set bijection;
- exact move identity including Namua variants;
- successor commutation;
- terminal/winner/pending semantics;
- inverse/bijection;
- bounded graph node/edge isomorphism;
- independent reconstruction;
- separate downstream canonicalization authorization.

## Why a new Study is required

Research Generation 1のSymmetry / Isomorphic Positions Study 1は5 outcomeすべて`NON-ESTIMABLE`で閉じ、ORISC-STUDY1はrepository-facing oracle representation integrityを`NOT-CONFIRMED`とし、conditional symmetry stageを実行しなかった。

したがって現在のvalidated transform setは空であり、canonicalizationやsymmetry-reduced state countingは未承認である。G2-03はそれらのclosed Studyを救済せず、fresh historically reachable RAW statesと新しいrepresentation bindingを用いる独立Studyとして開始する。

## Authoritative identity at Study start

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`はidentityから除外する。G2-03がformalに認可するまで、candidate transformをpopulation deduplicationへ使用しない。

## Important separation

A rule-semantic transform and a downstream canonicalization rule are not the same claim.

特に、state graphをisomorphicに写すtransformでも、standard fixed raw initial stateやhistorically reachable populationを同じ集合へ写すとは限らない。その場合、bounded semantic-isomorphismとしてvalidateされても、fixed-start state-space quotient countingには使用できない。

## Stages

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1
```

Stage 0はtechnical only。Stage 1はfresh development evidence。Stage 2だけがformal candidate-decision evidenceとなる。

## Controls

```text
positive: STSCV-C00-IDENTITY
negative: STSCV-C01-LR-NO-DIRECTION-FLIP
```

IDENTITYが失敗した場合はinstrument failureとしてfail closedする。故意に壊したnegative controlをexact transformとして誤認する場合もinstrument validity failureとする。

## Current status

Study-level protocolはfreeze済み。Stage 0 technical validationの実装・検証が次の作業であり、Stage 1/2 scientific outcome generationはまだauthorizeされていない。
