# Search Reliability / Decision Robustness Study 1 — Overview

Program label: `G2-02`
Study ID: `SRDR-STUDY1`
Research Generation: **Research Generation 2**
Status: **ACTIVE / PRE-SCIENTIFIC-GENERATION**

## 何を調べるか

同一authoritative RAW stateに対し、depth、node budget、quiescence等のprospectively frozen探索条件を変えたとき、machine search decisionがどの程度安定するかを検証する。

対象はbest moveだけではなく、TopSet、全合法手ranking、best / second-best score gap、score sign、可能ならprincipal variationまで含む。

## 何とは区別するか

```text
search reliability
!= human difficulty
!= structural complexity
!= empirical win probability
!= game-theoretic value
!= engine evaluation correctness
!= public AI strength
!= human perception
```

高resource searchは必要に応じて`frozen search reference`として使うだけで、真の最善手やgame-theoretic oracleとはみなさない。

## Current design

```text
Stage 0 = technical feasibility / non-scientific smoke
Stage 1 = fresh development / construct characterization
Stage 2 = fresh held-out formal replication
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
```

Stage 0では、既存exact root-candidate instrumentationに加えてnode-budget semanticsとPV extractionがtechnicalに成立するかを検証する。成立しないendpointは科学データを見る前に除外する。

Stage 1/2 scientific generationはまだauthorizeされていない。

## Upstream boundaries

`PEOCR-STUDY1 = INCONCLUSIVE`およびPosition Complexity / Difficulty Study 1 `INCONCLUSIVE`はimmutable。本Studyはそれらを救済せず、既存scientific rowsをformal evidenceへ再利用しない。

## Formal Study-level taxonomy

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE
```

numeric formal criterionはStage 1 development後かつStage 2 outcome前に別preregistrationでfreezeする。technical timeoutやinstrument failureをscientific `NOT-CONFIRMED`へ読み替えない。

詳細は[`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)を参照する。
