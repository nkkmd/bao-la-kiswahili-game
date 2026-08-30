# 2026-08-30 — Stage 0 upstream provenance correction

Study: `TMGC-STUDY1`  
Stage: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## Disposition

**PRE-SCIENTIFIC-PROVENANCE-CORRECTION-COMPLETE**

## 背景

開始時prospective文書を作成した直後のStage 0 code-level auditで、Research Generation 1のC03正本と開始文書の一部記述に差異があることを検出した。

誤差は次の種類だった。

- `coarse-no-index`をsource policyとして表現していた箇所があったが、正しくはmove abstraction modeである。
- primary C03 consequenceに上流candidate正本に存在しない条件を含めた箇所があった。
- 上流formal thresholdを正本と異なる簡略値で表現した箇所があった。
- REPRODUCIBILITY_INDEX / RESUME_HEREに旧推定の実装ファイル名が含まれていた。

## Correction

`STAGE_2_FORMAL_CANDIDATES.json`、`STAGE_2_FORMAL_SPEC.json`、`STAGE_2_FORMAL_AUTHORIZATION.json`、FINAL_REPORT、REPRODUCIBILITY_INDEX、runbookを正本として再構築し、`UPSTREAM_C03_FROZEN_REFERENCE.json`を作成した。

正式C03 primary definitionは、Mtaji / `coarse-no-index` / `takata row 1 right` / `reusablePits=0-2` / `actorNyumbaSeedsDeltaSign=0`である。paired consequence `worstReplyActorCaptureMoveDeltaSign=0`はdiagnostic-onlyでありprimary substituteではない。

## Firewall state at correction

- Stage 1 authorization: `NOT-AUTHORIZED`
- Stage 2 authorization: `NOT-AUTHORIZED`
- Stage 1 reserved seed state: `UNCONSUMED`
- Stage 2 reserved seed state: `UNCONSUMED`
- G2-09 scientific evidence generated: `false`

したがって本訂正はscientific outcomeに依存しないStage 0 provenance correctionであり、no-rescue ruleには抵触しない。
