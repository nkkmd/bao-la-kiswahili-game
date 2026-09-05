# Research Generation 4 — 再開位置

更新日: 2026-09-05  
状態: **`PROGRAM PLAN FROZEN / SCIENTIFIC EXECUTION NOT AUTHORIZED`**

## 再開時の読む順序

1. repositoryのremote `main` HEADを取得し、完全SHAを記録する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)を読み、計画統合状態とauthorization状態を確認する。
3. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)を読み、G4-01の役割、証拠区分、no-rescue boundaryを確認する。
4. [`../research-generation-3/FINAL_SYNTHESIS.md`](../research-generation-3/FINAL_SYNTHESIS.md)を読み、G3のformal-complete、not-confirmed、non-estimable、technical-invalidを区別する。
5. [`../local-game-tree-geometry-generalization-counterexample/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-generalization-counterexample/STUDY_1_FINAL_REPORT.md)を読み、G3-12のtechnical-invalid原因と未使用evidenceを確認する。
6. [`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)と[`../JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](../JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を読む。

## 現在地

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN
G4-01 = CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED
Scientific evidence generated under RG4 = none
Scientific seeds accessed under RG4 = none
Depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

## 次に実施する判断

最初に行うのは、**post-RG3 / pre-G4-01 current-state authorization review**である。G4-01のscientific executionを自動開始してはならない。

reviewでは少なくとも次を判定する。

- current `main`と第三世代closure文書が整合しているか
- G4-01がG3-12のrepair、replay、same-evidence rescueになっていないか
- G3-12 Stage 2 seedを含む既存protected evidenceを再利用しない設計になっているか
- claim familyごとのroot contractとhelper preconditionをscientific effectから分離して検証できるか
- technical fixtureとfresh compatibility populationのidentityを固定できるか
- productionと独立実装の境界が現実的か
- GitHub Actionsへ重いformal generationを押し込まず、local reproducible runbookを用意できるか

## Review後の分岐

`AUTHORIZED`の場合:

1. G4-01の正式Study IDと最終題目を固定する。
2. Stage構成、Stage ID、fresh compatibility seed、root contract、測定schema、resource ceiling、停止条件を固定する。
3. authorization artifactとpre-access firewallを作成する。
4. scientific effectを生成しないStage 0 technical validationから開始する。

`NOT-AUTHORIZED`または`PREREQUISITE-REQUIRED`の場合:

- scientific seedへアクセスしない。
- 欠けている前提または停止理由をdecision recordへ残す。
- G4-02以降を自動的に開始しない。

## 禁止事項

- G3-12のrepair、reopen、Stage 1 replay
- G3-12 Stage 2 seedの流用
- G3-11 depth 10の再実行
- G4-10 authorization前のdepth 11 access
- closed Studyのthreshold、population、endpoint、representation変更
- unvalidated symmetry / canonicalizationによるdeduplication
- engine score、deeper search、machine geometryからの過剰なvalue / human claim
- authorization review前のscientific outcome生成
