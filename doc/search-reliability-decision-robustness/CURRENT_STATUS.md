# SRDR-STUDY1 — 現在の状態

更新日: 2026-08-28

## 状態

**STUDY COMPLETE / STAGE 0 PASS / STAGE 1 PROFILE-FROZEN-DEVELOPMENT / STAGE 2 COMPLETE / FORMAL DECISION `INCONCLUSIVE` / SCIENTIFIC CLOSURE COMPLETE / INTEGRATED IN `main`**

## 研究識別子

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Research branch = research/g2-02-search-reliability-decision-robustness
Stage 2 source-freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
Stage 2 authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
Scientific closure head = f6814e4e828ea07ec309f6f7352c825494d8ff20
Integration PR = #68
Integration merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
```

## Stageごとの判断

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1 = PASS
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1 = PROFILE-FROZEN-DEVELOPMENT
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1 = COMPLETE / INCONCLUSIVE
Study formal decision = INCONCLUSIVE
Repository integration = COMPLETE / main
```

## Stage 2が`INCONCLUSIVE`となった理由

Independent verificationは、game replay / selection / measurement mismatchがすべて0で、selection / measurement hashもexactに一致しました。

事前登録したgateのうち、FAILしたのは次の1条件だけです。

```text
unique historical trajectories after Stage 1 firewall = 1040
required = 1050
shortfall = 10
```

したがって`primaryFormalCriterion = null`です。

seed extension、replacement、threshold relaxationは承認されていません。

## canonical provenance （記録）

```text
workflow run = 33124538584
artifact ID = 9672561139
artifact ZIP SHA-256 = c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

## `main`統合provenance

```text
integration PR = #68
merged research head = f6814e4e828ea07ec309f6f7352c825494d8ff20
merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
integration date = 2026-08-28
formal decision unchanged = INCONCLUSIVE
primaryFormalCriterion unchanged = null
scientific result changed by integration = false
```

merge前には、research branchは`main`より66 commits ahead / 0 behindで、unresolved review threadは0、通常のPR workflow 5件はすべてgreenでした。

immutable Stage 2 artifactに対するidempotent G2-02 closure finalization workflowもPASSしました。

## 変更しない境界

`PEOCR-STUDY1 = INCONCLUSIVE`とPosition Complexity / Difficulty Study 1の既存判断は変更しません。

G2-02は次を確立していません。

- game-theoretic best move
- human difficulty
- engine correctness
- public-AI strength

Higher-resource searchは引き続きfrozen referenceに限って扱います。

## 今後

`SRDR-STUDY1`は科学的に終了し、`main`へ統合済みです。

追加のG2-02 scientific generationは承認されていません。formal search-reliability confirmationを再検証する場合は、新しいprospective Study / versionと新しい独立証拠が必要です。
