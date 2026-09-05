# LGTGMIV-STUDY1 — 現在の状態

Updated: 2026-09-01

## formal state（正式状態）

- Study: `LGTGMIV-STUDY1`
- program内の位置づけはpost-G3-01 / pre-G3-02 independent prerequisiteである
- Status: **`CLOSED / FORMAL-ELIGIBLE-ALL`**
- Stage 0: `LGTGMIV-S0-TECHNICAL-2026-08-31-v1 / STAGE0-PASS`
- Stage 1: `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1 / STAGE1-PASS`
- Stage 2: `LGTGMIV-S2-FORMAL-2026-08-31-v1 / FORMAL-ELIGIBLE-ALL`
- formal eligible measurement familyは固定済みLGTGMIV family 5件すべてである
- scientific execution: complete
- Study-level scientific rerun authorizationはない
- main integration: **COMPLETE**
- integrated research-branch head: `1777ba717ced88be64cbaf981ce7096372046334`
- final closure audit: `33466581297 / success`

Formal eligible families:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

## Stage 0の記録

- prospective Study freeze: `1ffdfb631cd1f7f56a798fe62c6e0cd732547b17`
- implementation: `aa8dee624c09ff03af476bb7d82f850d7c8c3223`
- formal run: `33386868192`
- result commit: `044b39cd414f208226c989c17aeb61ae412d80a2`
- disposition: `STAGE0-PASS`
- `stageReconstructionCoreSha256 = 33c63d62cfaf9f38d81680f42e799a5084e2ef86686810bbe46f543a9fbe42b9`
- `stageScientificCoreSha256 = 38871e544593fa4e0120fe77bbb48c47e643bb89d816acfde2dfd1dd9bdc0c0b`

## Stage 1の記録

- authorization: `df40f33f136568f79debeb8011c04e11786169e2`
- formal run: `33450205296`
- result commit: `52812f37197df74e90d1864720ad1b7e6f13d7fa`
- read-only audit result commitは`c81b52d32b6c53dbb6eefb851663bfacbab05a6e`
- populationは8 Namua + 8 Mtajiで16 unique RAW root
- depth: 5
- consumed block: `31110001..31110128`
- disposition: `STAGE1-PASS`
- global gate: PASS
- promoted families: 5/5
- `stageReconstructionCoreSha256 = 2f641919bf067428416afd65a9a502c30c2ad3261cfe6b1355499809076505ac`
- `stageScientificCoreSha256 = 91c4ed0a23edbf12398ca644db7d6864011f4d26c88da93019095decf524f271`

Stage 1 evidenceはimmutableである。same-block formal rerun / repairは禁止する。

## Stage 2のformal record

- separate authorization: `authorizations/2026-09-01-stage-2-formal-authorization.md`
- tooling smoke run: `33451567682 / success`
- pre-execution audits: `33451887834 / success`, `33451948317 / success`
- execution trigger commit: `ba1358b39b30b042b7aedb5eaca819147d6d54ee`
- formal run: `33452082425 / success`
- immutable result commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`
- read-only post-result audit runは`33452400324 / success`
- read-only audit result commitは`ad057e499e34f70493ac1d7332fe42332323d293`
- populationは12 Namua + 12 Mtajiで24 unique RAW root
- depth: 5
- consumed block: `31120001..31120192`
- production / independent exact root reconstructionは24/24
- 各formal familyのexact rootは24/24
- global gate: PASS
- resource gate: PASS
- formal decision: `FORMAL-ELIGIBLE-ALL`

Canonical Stage 2 hashes:

- `stageReconstructionCoreSha256 = 307c907a90cd7239a617278a2378f4e048b10f16877428a3c886de5377b01a1d`
- `stageScientificCoreSha256 = 97ad7dc21e1758d31fa09e487389bf5d3935b1d98daf3eaa2f1b524d7169f9a4`
- scientific result fileのSHA-256は`9a28e629440a1d9212ad67ef78451deba869747d313dc75462693701074e1f96`
- telemetry file SHA-256: `0db24cc1d1f59432a519dfaad88ffffe8d2217d1cebf4291b6361dc8f2778bc0`

read-only auditは`stageElapsedMs = 159574.533277`、`stageArtifactBytes = 6086521`、resource PASS、engine importなし、scientific re-executionなしを確認した。

Stage 2 evidenceはimmutableである。same-block formal rerun / repairは禁止する。

## `main` integrationの記録

閉じたresearch branchはnon-force fast-forwardで`main`へ統合した。

- main before integration: `a53aabd26f78ac408445aff2d18ace3b21b827d7`
- integrated research-branch head: `1777ba717ced88be64cbaf981ce7096372046334`
- pre-integration relation: `ahead_by = 57 / behind_by = 0`
- 統合直前に行ったclosure後のaudit: `33466581297 / success`
- checkpoint: `checkpoints/2026-09-01-main-integration-complete.md`

このrepository synchronizationでは、scientific evidenceをregenerateまたはreinterpretしていない。

## 科学的な境界

本Studyは、固定済みRAW-only depth-5 local tree / graph reconstruction instrumentについて、5件のLGTGMIV familyがbounded formal eligibilityを持つことを確立した。Bao全体のstate / game-tree size、deeper-horizon validity、symmetry-reduced geometry、strategic value、search causality、game-theoretic value、人間にとっての難しさは確立しない。

authoritative state identityはRAW-onlyのままである。

`pits,reserve,houseOwned,player,phase,winner,pending`

validated transform setは`[]`のままである。

## 恒久的なupstream boundary

`LGTGMF-STUDY1` remains permanently:

`CLOSED / TECHNICAL-INVALID`

G3-01 eligible familyは`[]`、G3-01 Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`のままである。本StudyはG3-01をrepairまたはrescueしない。

Research Generation 2はclosedのままである。

## protected evidence （証拠の状態）

protected standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

`SEALED / NOT GENERATED / NOT READ`

## downstream boundary （適用範囲と制限）

G3-02の自動開始承認は`automaticG302StartAuthorized = false`である。

この文書のclosure時点ではG3-02〜G3-08はblockedであり、G3-02開始前に別個のResearch Generation 3 post-closure authorization reviewを必要とした。後続状態は中央の`research-generation-3/CURRENT_STATUS.md`を正本とする。
