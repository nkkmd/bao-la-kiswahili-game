# 2026-08-30 — Stage 0 source preflightの凍結

Study: `TMGC-STUDY1`  
Stage: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## 凍結内容

source-only technical preflightの実行前に、`preregistration/STAGE_0_SOURCE_PREFLIGHT_SPEC.json`のtechnical population、8 generation strata、C03-exact eligibility supply rule、RAW/trajectory/opening-prefix identity、diversity gate、resource gateを固定した。

Technical seedsは`8090001..8090128`であり、Stage 1/2 scientific seedとは完全に分離する。

## scientific leakageの禁止

このpreflightでは以下を計算・判定しない。

- `actorNyumbaSeedsDeltaSign=0`の成立率
- paired consequence成立率
- D1/D2/D3のcandidate tactical-value/ranking
- winner/outcomeによるroot selectionまたはgate
- future motif occurrenceによるselection

C03 exactのpreconditionとlegal move familyだけを、将来のscientific populationが十分供給可能かを確認するtechnical eligibility filterとして使用する。

Gate不合格後に同一Study内でtechnical seed追加、gate緩和、source-policy差替えを行わない。
