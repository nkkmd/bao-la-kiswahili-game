# LGTTCI-STUDY1 — 入口

更新日: 2026-09-17  
Program position: `Research Generation 4 / G4-01`  
状態: **`AUTHORIZED / STAGE 0 TECHNICAL ONLY / FRESH COMPATIBILITY NOT AUTHORIZED`**

正式Study ID:

`LGTTCI-STUDY1`

英語正式題目:

**Local Game-Tree Geometry Transfer Compatibility Instrument Study 1 — Prospective validation of root contracts, helper preconditions, measurement agreement, and resource readiness for fresh-domain claim transfer**

日本語作業名:

**Bao局所ゲーム木幾何claim移送Compatibility Instrument研究1 — fresh domain移送に必要なroot contract、helper precondition、測定一致、resource readinessのprospective検証**

## このStudyが調べること

Research Generation 3でformal-completeとなったG3-04、G3-07、G3-10由来のclaim familyを将来のfresh domainへ移す前に、科学的effectを見ずに次を検証する。

- root contractを再現可能に判定できるか
- source policyをproduction/independentで同一にreplayできるか
- RAW局所幾何をrelative depth 5でexact一致して測定できるか
- SILGM系search helperのhard preconditionをroot selection前に検出できるか
- root legal width 1をhard failureではなくclean `NON-ESTIMABLE`として扱えるか
- continuous geometryを必要とするfamilyでproduction/independentの境界を維持できるか
- resource ceiling内で後続Studyのcompatibility populationを評価できるか

このStudyではformal effect direction、p-value、generalization/counterexample decisionを生成しない。

## G3-12との関係

G3-12 `LGTGGC-STUDY1`の修理・再実行ではない。G3-12のStage 1/Stage 2 seed、partial measurement、selected root identityを再利用しない。

G3-12から引き継ぐのは、**Stage 0でpopulation/helper compatibilityを先に検証しなければならないというtechnical failure lesson**と、既に検証済みのmeasurement implementationだけである。

## Stage構成

| Stage | ID | 証拠区分 | 現在状態 |
| --- | --- | --- | --- |
| Stage 0 | `LGTTCI-S0-TECHNICAL-2026-09-17-v1` | `TECHNICAL-FIXTURE` | `AUTHORIZED / NOT-EXECUTED` |
| Stage 1 | `LGTTCI-S1-COMPATIBILITY-2026-09-17-v1` | `FRESH-COMPATIBILITY` | `NOT-AUTHORIZED-NOT-EXECUTED` |

Stage 0はscientific effectを生成しない。Stage 1はStage 0 PASS後の別authorizationがない限りseedへアクセスしない。

## 新しいdomain contract

G3-12と同一populationのretryにならないよう、source policyとroot familyを新しく固定する。

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
RF1 = LGTTCI-RF1-MID-ANCHOR
RF2 = LGTTCI-RF2-OFFSET-ANCHOR
```

P2は各合法手のauthoritative immediate capture-event seed countをexactに評価し、最小countのmove poolからcanonical ordering上でMulberry32により選択する。geometry、search output、engine evaluation、game outcomeをsource-policy selectionへ使用しない。

root familyは次で固定する。

```text
RF1 Namua = exact ply 20 / nonterminal / phase=namua
RF1 Mtaji = first nonterminal phase=mtaji state at ply >= 40
RF2 Namua = exact ply 28 / nonterminal / phase=namua
RF2 Mtaji = exact ply 52 / nonterminal / phase=mtaji
```

rootが存在しないtrajectoryは事前固定の理由コードで不適格とし、置換rootを探索しない。

## protected evidence

次へアクセスしない。

- G3-11 depth 10のsame-evidence rerun
- G3-12 Stage 1 consumed seeds
- G3-12 Stage 2 unread seed blocks
- G4-10 depth 11
- unvalidated symmetry/canonicalization

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のauthorization状態
2. [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json) — frozen machine-readable Study contract
3. [`authorizations/STAGE_0_AUTHORIZATION.json`](authorizations/STAGE_0_AUTHORIZATION.json) — Stage 0の実行境界
4. [`RESUME_HERE.md`](RESUME_HERE.md) — 次に行う作業
5. [`../research-program-decisions/2026-09-17-post-rg3-pre-g4-01-authorization-review.md`](../research-program-decisions/2026-09-17-post-rg3-pre-g4-01-authorization-review.md) — authorization review

## 解釈上の境界

- compatibility PASSはupstream claimのgeneralization確認ではない。
- root support不足による`NON-ESTIMABLE`はclaimの否定ではない。
- search ranking compatibilityは最善手の正しさを示さない。
- engine scoreはgame-theoretic valueまたはBao win probabilityではない。
- machine-only compatibilityからhuman difficultyを主張しない。
- G4-01の結果だけで公開AIを変更しない。
