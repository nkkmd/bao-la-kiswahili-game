# G3-04 / SFCDF-STUDY1 — 研究概要

更新日: 2026-09-02  
状態: **CLOSED / FORMAL-COMPLETE**

## 研究題目

**Structural Forcing-Corridor and Decision-Funnel Study 1 — Prospective exact validation of sustained reply narrowing and branch-to-RAW convergence in bounded Bao local geometry**

日本語正式題目:

**Baoにおけるstructural forcing corridorとdecision funnelのprospective exact検証 — sustained reply narrowingとbranch-to-RAW convergenceによるbounded局所経路構造の再現可能なphase差の検証**

## 研究目的

Baoのbounded local RAW geometryにおいて、次を別constructとしてprospectively測定・検証した。

- **forcing corridor**: legal reply widthが狭く、とくにone-reply stateが持続・占有する構造
- **decision funnel**: tree occurrenceがunique RAW graphへ圧縮され、root branchが再収束する構造

`forcing`は構造上の呼称であり、最善手・強制勝ち・tactical inevitabilityを意味しない。

## 測定基盤

独立prerequisite `LGTGMIV-STUDY1 = FORMAL-ELIGIBLE-ALL`でformal eligibilityを得たRAW-only / relative depth-5 measurement familyを使用した。

Principal:

- F5 reply geometry
- F2 RAW graph
- F3 transposition / reconvergence
- F4 tree / graph relation

Auxiliary:

- F1 tree occurrence

## 結果を見る前に固定したcandidate

Corridor:

1. C1 unit-width occupancy fraction（幅1が占める割合）
2. C2 width-compression fraction
3. C3 longest unit-width run（幅1が連続する最長区間）

Funnel:

4. C4 reconvergent-state occupancy fraction（再合流stateの占有率）
5. C5 root-branch overlap fraction（root branch間の重複率）
6. C6 cumulative tree / RAW ratio（累積tree / RAW比）

corridorとfunnelを一つのcombined classへ統合しなかった。

## Stage 1 developmentの結果

Fresh seed `31410001..31410192`から12 paired trajectoriesをprospectively選択した。

Stage 1 promotion result:

- C1 → **PROMOTED / MTAJI-GREATER**
- C6 → **PROMOTED / NAMUA-GREATER**
- C2〜C5はpromoteしなかった

Stage 1は`STAGE1-PASS`で、production / independent scientific coreはexact一致した。

## Stage 2のformal validation

Fresh held-out seed `31420001..31420288`から18 paired trajectoriesを選択した。Stage 1のRAW-root / trajectory / first-16-prefix identityをprospective firewallで除外した。

Formal result:

| Candidate | Frozen direction | Formal result | Pair signs | Exact p | Holm |
|---|---|---|---|---|---|
| C1 unit-width occupancy | Mtaji > Namua | **CONFIRMED** | 18/18 same direction | `1/131072` | PASS |
| C6 cumulative tree/RAW ratio | Namua > Mtaji | **CONFIRMED** | 18/18 same direction | `1/131072` | PASS |

Stage 2 production / independent Stage scientific core SHA-256は双方:

`e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039`

でexact一致した。

## 何が確認されたか

Frozen paired population / relative depth 5では:

- Mtaji rootsはNamua rootsより、depth-labelled nonterminal unique RAW-state presenceのうちlegal replyがちょうど1つである割合（C1）が一貫して高かった。
- Namua rootsはMtaji rootsより、tree occurrence総数 / global distinct RAW-state数（C6）が一貫して高かった。

C1とC6が逆方向でconfirmされたことは、reply narrowingとtree-to-RAW graph inflationを単一の“forcing”軸として扱わないというprospective construct separationと整合する。

## 何は確認されていないか

この結果は次を意味しない。

- Mtajiがgame-theoreticallyよりforcing
- Namuaがtacticallyより複雑
- one-reply occupancyがbest-move clarityを示す
- C6がtransposition concentrationそのものを証明する
- search stability / search easeとの関係
- strategic simplicity
- human difficulty
- position value / win probabilityとの関係
- phaseの因果効果
- depth 5より深いgame treeへの一般化

## execution integrity （実行記録）

```text
Stage 1 scientific executions = 1 authorized / 1 actual
Stage 2 scientific executions = 1 authorized / 1 actual
same-evidence reruns = 0
Stage 2 artifact ID = 9844368476
Stage 2 artifact ZIP SHA-256 = c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f
```

## protected evidence （証拠の状態）

standard initial RAW root complete exact depth-10 holdoutは:

**`SEALED / NOT GENERATED / NOT READ`**

のまま維持されている。
