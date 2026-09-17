# LGTTCI-STUDY1 — 入口

更新日: 2026-09-17  
Program position: `Research Generation 4 / G4-01`  
状態: **`STAGE 1R PRE-EXECUTION READY / FINAL EXECUTION AUTHORIZATION ABSENT`**

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

## Stage 0

Stage 0 `LGTTCI-S0-TECHNICAL-2026-09-17-v1`は`STAGE0-PASS`で完了した。G3-12で問題になったroot legal width 1のhelper precondition gapを、scientific populationへ進む前に検出・遮断できることをnegative control込みで確認した。

## 旧Stage 1の中断

旧Stage 1 `LGTTCI-S1-COMPATIBILITY-2026-09-17-v1`はfresh compatibility seedへのアクセス開始後、ローカル長時間processの実行環境が失われ、監査可能な最終artifactを残せなかった。

このため正式状態を`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`とし、旧`401...` seed namespaceを全体quarantineした。旧Stage 1を同じseedで再実行しない。

詳細は[`checkpoints/2026-09-17-stage1-execution-interrupted.md`](checkpoints/2026-09-17-stage1-execution-interrupted.md)を参照する。

## Stage 1R再試験

再試験は新しいStage IDで固定した。

`LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`

科学的contractのsource policy、root family、RAW identity、search condition、support gateは旧Stage 1から変更していない。変更したのはexecution architectureとfresh evidence namespaceである。

primary fresh namespace:

```text
SFCDF = 40211001..40211384
SILGM = 40212001..40212768
GCLD  = 40213001..40213384
```

各primaryには`primary + 1000000`のpaired reserveを事前対応させている。reserveはprimaryがdurable `SOURCE-START`後`SOURCE-COMMIT`前にインフラ中断した場合だけ使用でき、結果・support不足・root不足・preflight不適格の救済には使えない。

## 耐障害設計

Stage 1Rでは、前回の単一長時間processを廃止する。

- slot単位のdurable journalをfresh read前にfsyncする。
- slot単位でsealed source artifactをatomic commitする。
- committed slotをresume時に再読しない。
- 明示的source process failureではreserve禁止。
- reserve-of-reserveは禁止。
- fresh read上限1584、infrastructure replacement上限48。
- 重いdepth-5 preflight、search、continuous geometryはsource acquisition後のseed-free measurementへ分離する。
- measurementはsealed source artifactだけを読むため、インフラ中断時に安全に再実行できる。
- 最終aggregationもfresh seedを読まない。

## pre-execution readiness

technical-only GitHub Actions preflightはrun `35220959149` / job `105200705604`でsuccessした。

`authorizations/STAGE_1R_PRE_EXECUTION_BINDING.json`でStage 1R spec、runner、wrapper、source identityをblob SHA固定済みである。

現在は`STAGE1R-PRE-EXECUTION-READY`で停止している。

**`STAGE_1R_EXECUTION_AUTHORIZATION.json`はまだ存在せず、fresh `402...` / `412...` seedへのアクセスは0である。**

## 次の工程

ユーザーが再試験開始を明示した場合のみ、pre-execution bindingを再確認し、final execution authorizationを新規作成してfresh acquisitionを開始する。

`main`への統合はまだ認めない。
