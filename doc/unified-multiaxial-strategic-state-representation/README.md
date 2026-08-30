# UMSSR-STUDY1 — 研究ディレクトリ

Research Generation 2 `G2-10` の独立研究 **Unified Multiaxial Strategic State Representation Study 1** の正本ディレクトリである。

日本語題目は、**Baoにおける多軸戦略状態表現の統合的構築とprospective検証 — search reliability, structural state, reply pressure, decision-failure evidence, tactical structure等のevidence-eligible axesを用いた再現可能なstrategic-state / regime representationの構築** とする。

## 現在地

Study 1はclosure済みである。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study formal decision = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

Stage 1はscientific readiness、production / independent exact verification、resource gateをすべてPASSしたが、事前固定した`K=2..6`の全候補がpromotion criterionを満たさなかった。このためeligible representationを凍結せず、Stage 2を実行しない。

## 読む順序

1. `STUDY_1_FINAL_REPORT.md` — 結論、結果、解釈境界
2. `CURRENT_STATUS.md` — 現在の正式状態
3. `STUDY_1_OVERVIEW.md` — 研究の問いと開始時境界
4. `STUDY_1_PROTOCOL.md` — prospective Stage構成とno-rescue rule
5. `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md` — upstream evidenceの利用資格
6. `UPSTREAM_STUDY_AUDIT.md` — G2-01〜G2-09の開始時監査
7. `CANDIDATE_AXIS_INVENTORY.md` — candidate axisの開始時inventory
8. `DECISION_REGISTER.md` — prospective decisionとclosure判断の台帳
9. `REPRODUCIBILITY_INDEX.md` — source / seed / run / artifact / hash
10. `results/README.md` — canonical machine-readable result
11. `RESUME_HERE.md` — closure後の引継ぎ位置

## accepted Stage 1 result

```text
workflow run = 33297178656
artifact id = 9727918107
Stage 1 seeds = 29310001..29314096 / CONSUMED
selected roots = 512
active features = 40 / 40
production / independent full exact = true
eligible K = 0
selectedRepresentation = null
```

## 不変の境界

- RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`である。
- validated transform setは`[]`であり、canonicalization / symmetry reductionは未承認である。
- G2-06〜G2-09のtechnical-invalid / non-estimable / not-authorized resultをvalidated inputへ昇格させない。
- `TM-S2-C03 = CONFIRMED`をoriginal frozen scope外へ一般化しない。
- Stage 1のminimum support、stability、K rangeを結果後に変更して救済しない。
- Stage 1 seed blockをrerun / extensionしない。
- Stage 2 seed `29410001..29418192`は未消費のままとする。
- G2-11へ渡せるvalidated / frozen representationは本Studyから得られていない。
- public AIの棋力向上をscientific endpointとしない。

## repository境界

closureはresearch branch上で完了させる。`main`への統合は明示的な統合指示があるまで行わない。
