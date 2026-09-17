# LGTTCI-STUDY1 — Stage 1R pre-execution readiness

日付: 2026-09-17  
対象Stage: `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`  
判定: **`STAGE1R-PRE-EXECUTION-READY`**

## 現在状態

Stage 1Rは、fresh evidenceへアクセスする直前までのspec、runner、耐障害境界、source identity、technical-only CI、pre-execution bindingを固定した。

```text
fresh 402... primary seed access = 0
paired 412... reserve seed access = 0
final execution authorization = ABSENT
Stage 1R execution = NOT-AUTHORIZED-NOT-EXECUTED
main integration = NOT AUTHORIZED
```

このcheckpoint自体は実行承認ではない。次に進むには、別stepで`STAGE_1R_EXECUTION_AUTHORIZATION.json`を作成する必要がある。

## technical-only preflight

```text
workflow = LGTTCI Stage 1R pre-execution validation
run = 35220959149
job = 105200705604
conclusion = success
```

PASSした項目:

- Stage 1R runner 4本のNode syntax
- final execution authorizationが存在しないこと
- Stage 1R fresh resultが存在しないこと
- technical fixtureに対するSFCDF / SILGM / GCLD source-unit production/independent一致

## 再試験で追加した耐障害境界

- 1 primary slotごとにdurable `SOURCE-START`をfsyncしてからfresh readへ進む。
- 1 slotごとにsealed JSON artifactをatomic commitする。
- `SOURCE-COMMIT`済みslotはresume時に再読しない。
- primaryが`START`後`COMMIT`前にインフラ中断した場合のみ、事前対応する`primary + 1000000` reserveを1回使用できる。
- 明示的source process failureではreserveを使用しない。
- reserve中断後のreserve-of-reserveは禁止する。
- 全block通算でfresh readは最大1584、infrastructure replacementは最大48。
- depth-5 preflight/search/continuous geometryはsource acquisition後のseed-free measurementへ分離する。
- measurement taskはsealed source artifactだけを読むため、インフラ中断時の再実行を許可する。

## 旧Stage 1との分離

旧`401...` namespaceは`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`としてquarantine済みで、Stage 1Rでは再利用しない。Stage 1Rは新しい`402...` primary namespaceと`412...` paired reserveだけを使用する。

## 次の一手

ユーザーが再試験開始を明示した場合のみ、pre-execution bindingを再確認して`STAGE_1R_EXECUTION_AUTHORIZATION.json`を作成し、その後fresh acquisitionを開始する。
