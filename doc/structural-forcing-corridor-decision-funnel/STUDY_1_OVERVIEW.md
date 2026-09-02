# G3-04 / SFCDF-STUDY1 — 研究概要

更新日: 2026-09-02  
状態: **PROSPECTIVE / FRESH SCIENTIFIC EVIDENCE NOT YET AUTHORIZED**

## 研究題目

**Structural Forcing-Corridor and Decision-Funnel Study 1 — Prospective exact validation of sustained reply narrowing and branch-to-RAW convergence in bounded Bao local geometry**

日本語正式題目:

**Baoにおけるstructural forcing corridorとdecision funnelのprospective exact検証 — sustained reply narrowingとbranch-to-RAW convergenceによるbounded局所経路構造の再現可能なphase差の検証**

## 何を調べるか

Baoの局所ゲーム木では、rootに複数の合法手があっても、その後に一手しか返せない状態が連続することがある。また、別々に始まったbranchが同じRAW stateへ再収束し、treeとしての見かけよりgraphとして強く圧縮される場合がある。

本Studyはこの2種類を分けて検証する。

- **forcing corridor**: bounded horizon内でreply widthが持続的に狭まる構造
- **decision funnel**: 複数のroot branchがdescendant RAW stateを共有し、再収束する構造

`forcing`は構造上の呼称であり、最善手や強制勝ちを意味しない。

## 測定基盤

独立prerequisite `LGTGMIV-STUDY1 = FORMAL-ELIGIBLE-ALL`でformal eligibilityを得たRAW-only / relative depth-5 measurement familyだけを使用する。

Principal families:

- F5 reply geometry
- F2 RAW graph
- F3 transposition / reconvergence
- F4 tree/graph relation

F1 tree occurrenceはdenominator等の補助primitiveに限定する。

## Frozen candidate descriptors

Corridor:

1. unit-width occupancy fraction
2. width-compression fraction
3. longest unit-width run

Funnel:

4. reconvergent-state occupancy fraction
5. root-branch overlap fraction
6. cumulative tree/RAW ratio

corridorとfunnelを一つのcombined classへは統合しない。

## Population

Stage 1はfresh seed `31410001..31410192`から12 paired trajectories、Stage 2は`31420001..31420288`から18 paired trajectoriesを予定する。

各pairは同一source trajectoryの:

- exact ply 24 Namua root
- first nonterminal Mtaji root at ply >=44

から成る。selectionはseed ascending、geometry-blind、endpoint-blind、outcome-blindである。

## 現在地

Program-levelには`G3-04-AUTHORIZED`だが、これはStudy definition/preregistrationだけのauthorizationである。

現在はStudy ID、Stage、seed、endpoint、firewall、resource ceiling、canonical equality、no-rescue contractまでfresh evidence前にfreezeしている段階である。

fresh Stage 1はまだ未承認・未実行である。

## 重要な境界

- G3-02 / G3-03のtechnical-invalid scientific outcomeをpositive evidenceとして再利用しない
- G3-03 diagnostic candidate directionを使用しない
- symmetry/canonicalizationを使用しない
- relative depth 5を越えない
- structural forcingをgame-theoretic forcingへ読み替えない
- standard initial RAW root depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ`を維持する
