# SFCDFクロスドメイン移送研究1 — 研究プロトコル

## 1. 問い

G3-04で確認されたC1/C6のphase差は、G4-01でcompatibility確認済みの新しいsource policyとroot familyの組合せでも同じ方向に再現されるのか。それとも、逆方向のfresh evidenceが現れるdomain boundaryがあるのか。

本研究は「普遍法則」を主張する研究ではない。4つのfrozen cell内でのbounded generalizationまたはcounterexample boundaryを判定する。

## 2. frozen domain

source policy:

- `SFCDFT-P1-UNIFORM-LEGAL`: canonical legal ordering + Mulberry32 uniform selection
- `SFCDFT-P2-MIN-IMMEDIATE-CAPTURE`: immediate capture-event seed countが最小のlegal move poolからMulberry32 selection

root family:

- `SFCDFT-RF1-MID-ANCHOR`: Namua exact ply 20 / Mtaji first nonterminal mtaji at ply >=40
- `SFCDFT-RF2-OFFSET-ANCHOR`: Namua exact ply 28 / Mtaji exact ply 52

4 cell = P1×RF1, P1×RF2, P2×RF1, P2×RF2。

experimental unitは、1 fresh source trajectoryから得るpaired Namua/Mtaji rootsである。phase contrastは同一unit内の `Mtaji - Namua` とする。

## 3. endpoint

relative depthは5、RAW-only、validated transform setは空集合。

C1:
`sum(unitWidthStateCount[d], d=0..5) / sum(replyWidthHistogram[d][w], d=0..5, w>0)`

C6:
`sum(treeNodeOccurrences[d], d=0..5) / count(distinct authoritative RAW states across d=0..5)`

C1/C6ともexact reduced rationalで計算する。tree occurrenceとRAW graph stateは同一視しない。

## 4. evidence separation

G3-04 scientific evidenceとはseed / full trajectory / first-16 prefix / RAW rootの4 identityで分離する。

G4-01 Stage 1R legacy compatibilityとは、保存済みseed / full trajectory / RAW rootの3 identityを完全排除する。opening prefixは当時保存されていないため、非重複を主張しない。

G4-01旧Stage 1 SFCDF namespace `40111001..40111384`は永久quarantine。

G4-02 Stage 1とStage 2の間では4 identityすべてを分離する。

## 5. Stage構造

### Stage 0 — technical fixture

`SFCDFT-S0-TECHNICAL-2026-09-18-v1`

科学的結果を生成しない。identity、source policy、root selection、firewall、endpoint exact arithmetic、production/independent agreement、sign test、Holm、decision mapping、resource cutoffをfixtureで検証する。

### Stage 1 — fresh compatibility/development

`SFCDFT-S1-COMPATIBILITY-2026-09-18-v1`

予約seed: `40421001..40421384`、4 cell ×96 slots。各cell 8 paired unitsをoutcome-blind hash orderで選ぶ。

保存してよいものはidentity、support、resource、production/independent measurement digest。C1/C6 value、差、sign、direction、p-value、generalization/counterexample decisionは出力禁止。

Stage 0後の別authorizationなしにseed accessしない。

### Stage 2 — formal heldout

`SFCDFT-S2-FORMAL-2026-09-18-v1`

予約seed: `40422001..40422768`、4 cell ×192 slots。各cell 18 paired unitsを選ぶ。

Stage 1との4-way firewallをmaterializeし、別authorization後にのみアクセスする。

## 6. selection

selectionはidentity/firewallとresource preflightだけで決める。endpoint値、historical direction、C1/C6 resultはselectionに使わない。

cell内selection key:
`SHA-256(stageId | policyId | rootFamilyId | seed | fullTrajectorySha | namuaRawSha | mtajiRawSha)`

ascending order。seed extension、reserve replacement、root replacementはしない。

## 7. formal inference

2 claims × 4 cells = 8 frozen test slots。

各claim-cellで18 paired differencesを計算し、exact zeroをsign testから除外する。nonzero pairが12未満ならそのslotは`NON-ESTIMABLE`。

exact two-sided sign testを使い、8 slots全体をfamily alpha `1/20` のHolm step-downで補正する。non-estimable slotはmultiplicity bookkeeping上p=1として残す。

### claim-level decision

優先順:

1. `TECHNICAL-INVALID`
2. `COUNTEREXAMPLE-BOUNDARY-DETECTED`
3. `GENERALIZES-WITHIN-FROZEN-DOMAIN`
4. `NON-ESTIMABLE`
5. `NOT-CONFIRMED`

`COUNTEREXAMPLE-BOUNDARY-DETECTED`: 少なくとも1 estimable cellでHolm PASSかつhistorical directionと逆。

`GENERALIZES-WITHIN-FROZEN-DOMAIN`: 4 cellすべてestimable、4つすべてHolm PASS、4つすべてhistorical directionと一致。

`NON-ESTIMABLE`: opposite Holm-passがなく、少なくとも1 required cellがsupport/definedness/nonzero/resource gateを満たせない。

`NOT-CONFIRMED`: 全domainはestimableだがgeneralization条件を満たさず、opposite Holm-passもない。

## 8. resourceとstopping

per depth-5 root:

- distinct RAW states <= 100,000
- unique transitions <= 750,000
- parent expansions <= 100,000
- legal move evaluations <= 750,000
- tree node occurrences <= 1,000,000,000
- elapsed <= 180 s
- peak RSS <= 4 GB
- root artifact <= 64 MB

normal stoppingはfrozen source slotsの消費完了。結果に基づくearly stoppingは禁止。support不足はseed追加せず`NON-ESTIMABLE`。

fresh access後にexecutionが監査不能な形で中断した場合、fail closedとしてそのStage namespaceをquarantineし、full scientific rerunを行わない。

## 9. 実行経路

heavy scientific executionはChatGPTの一時runtimeでは行わない。

frozen mode:
`EXTERNAL-DURABLE-ONE-SHOT-RUNBOOK`

Stage 1/2の実アクセス前にproduction/independent implementation hashesとrunbook hashを別authorizationへbindする。Stage 0のtechnical verificationにはGitHub Actionsを使用できる。

## 10. 保護境界

本研究は次へ触れない。

- G3-11 depth 10 rerun
- G3-12 repair/replay/Stage 2 seed
- G4-10 depth 11
- unvalidated symmetry/canonicalization
- public AI
- main integration（明示指示まで禁止）
