# 連続的な局所ゲーム木幾何表現 — `CLGR-STUDY1`

Research Generation 3 `G3-09` / `CLGR-STUDY1` の研究ディレクトリ。

現在のlifecycle状態:

**`CLOSED / TECHNICAL-INVALID`**
<!-- CLGR-G3-09-FINAL-AUDIT:README -->

リポジトリと文書のclosure状態は **`FINAL CONSISTENCY AUDIT PASS / RESEARCH BRANCH REVIEW-READY`**（`33754250314`）です。

## 正式なStudy識別情報

- Study ID: `CLGR-STUDY1`
- English title: **Continuous Local-Geometry Representation Study 1 — Prospective construction and fresh-holdout eligibility validation of an exact multiaxial bounded RAW local game-tree geometry representation in Bao**
- 日本語正式題目: **Baoにおける局所ゲーム木幾何の連続多軸表現のprospective構築とfresh holdout eligibility検証 — bounded RAW depth-5 exact geometryを離散candidateへ早期縮約しない再現可能representationの確立**
- Program position: Research Generation 3 / `G3-09`
- Reviewed baseline main: `6c218b9cc3f492fb96d051768702682fef9bb66a`
- Research branch: `research/g3-09-continuous-local-geometry-representation`

## 最終判断

**`G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Stage 1 developmentでは、48個のfresh rootについて事前固定したrepresentation gateを通過しました。別途承認した1回限りのStage 2 formal holdoutでは72 rootsを選択しましたが、61 rootsの測定完了後、Mtaji source seed `31920066`の必須depth-5 RAW enumerationで`relay-limit` errorが発生したため、fail-closedで停止しました。

したがって、このcontinuous representationのformal eligibilityは**確立していません**。Stage 2のpartial measurementは完成したformal sampleではなく、positive・negative・nullのformal scientific evidenceとして再利用できません。

## 測定基盤

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
```

## 固定済みの主要表現

主要representation familyは`CLGR-R1-EXACT-SQUASHED-L1`だけです。

この表現は、結果を見る前に固定した次の6つのexact geometry axisを保持します。

1. `CLGR-A1-ROOT-LEGAL-WIDTH`
2. `CLGR-A2-CUMULATIVE-TREE-OCCURRENCE`
3. `CLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES`
4. `CLGR-A4-CUMULATIVE-TREE-RAW-RATIO`
5. `CLGR-A5-DUPLICATE-TRANSITION-FRACTION`
6. `CLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION`

非負のexact rational `q=n/d`に対する座標変換は、既約分数の`q/(1+q)=n/(n+d)`に固定しました。整数では`d=1`を使用します。centering、z-scoring、phase別standardization、learned weighting、PCA、spectral embedding、clustering、development後のfeature selectionはいずれも認めていません。

距離は、変換後の6座標に対するequal-weight exact L1です。

## 各Stageの記録

- `CLGR-S0-TECHNICAL-2026-09-03-v1` — `TECHNICAL-INVALID`, pre-fresh, no rerun
- `CLGR-S0-TECHNICAL-2026-09-03-v2` — `STAGE0-PASS`
- `CLGR-S1-DEVELOPMENT-2026-09-03-v1` — `STAGE1-PASS`。1回限りのfresh executionでNamua 24 + Mtaji 24を測定
- `CLGR-S2-FORMAL-2026-09-03-v1` — `TECHNICAL-INVALID`。1回限りのfresh executionでNamua 36 + Mtaji 36を選び、61 rootsの測定後にfail-closed

Stage 1 canonical result SHA-256:

`1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529`

Stage 2 formal-result JSON SHA-256:

`11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73`

## 結果確認後の救済を禁止する境界

Stage 2のfresh evidenceへアクセスしたため、`CLGR-STUDY1`をrerun、seed extension、root replacement、relay-limit処理変更、resource ceiling緩和、representation再設計、formal gate変更によって修正してはなりません。

relay-limitに耐えるcontinuous representationを将来再検証する場合は、新しい事前規定・独立Study/versionとして行う必要があります。

## 保護された証拠

standard initial RAW rootのcomplete exact depth-10 holdoutは、次の状態を維持しました。

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

本Studyでは必要とせず、開封もしていません。

## 後続研究との境界

G3-09のclosureだけでは、G3-10は**自動承認されません**でした。historical G3-10 designはvalidated local-geometry coordinatesを前提とする一方、G3-09ではformal representation eligibilityを確立できなかったため、別のpost-G3-09 current-state authorization reviewを必要としました。

過去の計画を記録する`doc/research-generation-3/PROGRAM_PLAN.md`は変更していません。

## mainへの統合

2026-09-03の明示的なユーザー指示に基づき、監査済みのG3-09 closure tip `64ada67b058811c18d81e7286fd3b12df6964459`を`force=false`のfast-forwardで`main`へ統合しました。squash、rebase、history rewrite、scientific recomputation、seed reuse、protected holdoutへのaccessは行っていません。終了済み研究ブランチはprovenanceのため保持しています。

## 次に読む文書

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 最終報告
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の状態
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 判断記録
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — 再現性索引
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- `prereg/STUDY_1_SPEC.json`
