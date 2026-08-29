# PCRPR-STUDY1 — Research Log

## 2026-08-29 — Study start

- remote `main` HEAD `e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5`を再取得し、G2-06 closure後の期待SHAと一致確認。
- central research docs、PCEM-STUDY1、RCPR-STUDY1を監査。
- `PCRPR-STUDY1`、branch `research/g2-07-practical-comeback-reply-pressure-representation`、Stage 0/1/2 IDsをprospectively固定。
- RAW identityを`pits,reserve,houseOwned,player,phase,winner,pending`に固定し、transform/canonicalizationなし。
- 12-family reply-pressure representationを固定。
- fresh Stage 1 seeds `28710001..28713072`、Stage 2 seeds `28810001..28816144`を予約。

## 2026-08-29 — Stage 0 technical validation

- G2-06のfloating-point ordering lessonをpre-outcome technical requirementとして取り込み、canonical lexical ordering、deterministic binary64 accumulation、big-endian binary64 encoding、integer-like-key/reply-permutation controlsを固定。
- workflow `33238931893`成功。
- production 18/18 gates PASS、independent 9/9 PASS、9 rows × 80 scalars exact一致。
- Decision: `STAGE0-TECHNICAL-PASS`。
- scientific blocksは未消費。

## 2026-08-29 — Stage 1 prospective freeze

- 3072 games、400 roots（Namua/Mtaji 200/200）、occurrence-first root selection、D3 `bestScore < 0`、all exact root-move rowsを固定。
- strong/medium/weak continuationを1/16/8 replicates、96-ply horizonで固定。
- primary targetを`medium bounded-win rate - strong bounded-win indicator`に固定。
- deterministic ridge、5-fold grouped CV、5 family sets、lambda `0.1,1,10,100`を固定。
- initial specの`F03_REPLY_POLICY`重複をscientific outcome・authorization・seed consumption前に検出し、valid pre-outcome correctionとして修正。
- exact computation contractを別途freeze。

## 2026-08-29 — Preauthorization validation

- 初回smokeはsyntax defectでscientific execution前に停止。scientific seed消費なし。
- corrected production smoke `33240901637` PASS。
- resource preflight `33240989191` PASS。
- structurally separate independent exact smoke `33241110983` PASS。
- source-freeze audit初回はStage 0 result schema field-name mismatchでfail-closed。scientific sourceを変更せずauditorのみcanonical schemaへ修正。
- source-freeze audit `33241372471` PASS。
- source-freeze commit `eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237`。

## 2026-08-29 — Stage 1 authorization and consumption

- execution addendumでconsume-once semanticsを固定。
- explicit authorization commit `64f0352e7d8b26432e2a68c408e403859c3e71bf`。
- canonical workflow `33241465899`開始。
- authorize-and-consume job `99071430645`成功。
- execution-start artifact `9711478864`、ZIP SHA256 `cf80f4b24ef9cf8996bcaa09ea4569c2030daa9640eacc0a9e864f76a35fc120`。
- この時点でStage 1 seeds `28710001..28713072`を永久に`CONSUMED`とした。
- same-block rerun/repair/replacement/extensionは以後禁止。

## 2026-08-29 — Production completion

- production job `99071451933`成功。
- 3072 games、2757 unique historical trajectories、400 roots、1429 rows。
- selected family = `F05_ALL`、lambda = `100`。
- pooled OOF RMSE `0.321056911294272`、baseline `0.40121860916118934`、relative improvement `0.1997955629089787`。
- pooled/Namua/Mtaji Spearman = `0.5456632009097375 / 0.2897094224760121 / 0.700040881756042`。
- top-quintile enrichment difference `0.3337211308428414`。
- support/performance gatesはproduction側でPASS。
- production disposition = `STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION`。
- artifact `9714352893`、ZIP SHA256 `36f0fae32f3ca9deec842602b0dbe87e933fd589643820f192c90d379b2f3b5b`。
- development core SHA256 `4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2`。
- このoutputは独立verification完了前なのでaccepted scientific resultではない。

## 2026-08-29 — Independent replay completion and artifact incident

- independent replay job `99071451969`のscientific replay stepは成功。
- terminal stdoutは3072 games / 400 roots / 1429 rows / `F05_ALL` / lambda `100`を報告。
- independent development core SHA256はproductionと同一の`4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2`。
- independent result SHA256 `db7358d1308481fd4d9645fbffd79a319603ea7debd263bcaa98d2fa9fe35395`をrunner上で生成。
- 直後の`actions/upload-artifact@v4`で`CreateArtifact` timeoutが5回連続発生し、full independent artifactはmaterializeされなかった。
- incident classを`EXTERNAL-ARTIFACT-TRANSPORT-FAILURE-AFTER-SUCCESSFUL-INDEPENDENT-COMPUTATION`とした。

## 2026-08-29 — Final verification unavailable

- frozen final comparerはsource corpus、selection、rows、measurements、compact rows、model、final model、readiness等をfull production/independent objectsからexact比較する契約。
- independent full artifact不在によりfinal-verification job `99096549383`はskipped。
- stdout development-core matchをfull verificationの代替とするpost-outcome relaxationは採用しない。
- artifact uploadだけのrerun、independent replay rerun、same-block repairも行わない。

## 2026-08-29 — Terminal closure

- prospectively frozen rule `technical/integrity/independent-verification failure -> STAGE1-TECHNICAL-INVALID`を適用。
- Final Stage 1 decision: `STAGE1-TECHNICAL-INVALID`。
- Stage 1 blockは`CONSUMED`のまま。
- `scientificInferenceAuthorized=false`、`confirmatoryReuseAllowed=false`。
- Stage 2 = `NOT-AUTHORIZED-NOT-EXECUTED`。
- Stage 2 seeds `28810001..28816144`は`RESERVED / UNCONSUMED`。
- production metricsおよびindependent terminal stdoutはunverified provenance / future hypothesis-generation contextとしてのみ保持。
- `results/STAGE_1_DEVELOPMENT_RESULT.json`、`results/STAGE_1_TECHNICAL_POSTMORTEM.json`、`STUDY_1_FINAL_REPORT.md`をmaterialize。
- PCRPR-STUDY1をresearch branch上でclosedとした。
- main integrationは実施しない。
