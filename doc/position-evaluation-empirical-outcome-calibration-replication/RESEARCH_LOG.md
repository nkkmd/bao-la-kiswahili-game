# PEOCR-STUDY1 — 研究ログ

## 2026-08-26 — Study開始

- remote `main`を再取得: `9e9cb6e2525f09a873e741db9f8fa42696839fbe`
- open PR audit: none
- Research Generation 2の最初のStudyとしてG2-01を選択
- 新branchを作成: `research/g2-01-position-evaluation-empirical-outcome-calibration-replication`
- Research Generation 1 PEC final reportをaudit
- PEC Stage 2 estimability failure mechanismをaudit
- formal titleを確定
- Study ID `PEOCR-STUDY1`を確定
- Stage IDを確定
- Stage 0 / 1 / 2 contractをprospectiveに固定
- Stage 1 = 2,048 fresh development games
- Stage 2 = 8,192 fresh formal games
- strict Stage 1→2 trajectory / opening / RAW-state firewallを維持
- phase-stratified isotonic PAVAを唯一のprimary development familyとして固定
- outcome確認前にprediction clipping `[0.01,0.99]`を固定
- Brier + log-loss paired skill formal criteriaを固定
- Research Generation 1 Brier maximaはprospective replication targetとしてのみ保持
- calibration slope / intercept、reliability bins、ECE、raw-score AUCを必須diagnosticとした
- scientific outcomeは未生成
- Stage 1 / 2 generationは未承認

次のscientific actionはStage 0 technical implementation / validationです。Stage 0 failureを理由にformal Study contractを緩和してはいけません。material contract changeが必要な場合はscientific generation前に新しいprospective versionを必要とします。

## 2026-08-27 — Stage 1 complete development run

- 最初のauthorized run `32971272256`は120-minute administrative Actions ceilingだけを理由として1536/2048で停止。partial artifactはprovenance用にのみ保持
- scientific source hashやcontract elementを変更せずexecution ceilingだけを360 minutesへ変更
- recovery run `33017663172`が成功
- original fixed seed rangeから2048/2048 fresh gamesを生成
- independent verifierが全2048 gamesをreplay
- replay mismatches = 0; measurement mismatches = 0
- unique historical trajectories = 1602
- selected unique RAW states = 1547 (Namua 806; Mtaji 741)
- administrative truncation rate = 0
- Stage 1 readiness gateはすべてPASS
- Stage 1 decision = `MODEL-FROZEN-DEVELOPMENT`
- frozen PAVA mapping SHA-256 = `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`
- Stage 2は独自technical smokeとexact authorization freezeが完了するまで未承認

## 2026-08-27 — Stage 2 technical smoke

- formal outcome前にStage 2 production、independent verifier、formal evaluator implementationを完了
- Stage 1 reference universe manifestを固定: `5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063`
- execution shardingを8 contiguous shards ×1024 gamesとしてprospectiveに固定
- technical smoke run `33037897038`が成功
- production smoke PASS; independent smoke verification PASS
- Stage 2 scientific seedは未使用、formal inferenceも未実施
- explicit source-bound authorizationまでStage 2 scientific generationは未承認

## 2026-08-27 — Stage 2 formal replication / closure

- source-bound formal authorization commit `5d1b4a40ef95ac639787aa0abf040a455c3c2995`
- formal workflow run `33038132423`が成功
- 8 fixed shards ×1024 = 8192/8192 scientific gamesを生成
- 8 shardすべてのindependent replay verificationがPASS
- merged fixed population auditがPASS
- trajectories before firewall = 4714; Stage 1 trajectory overlap excluded = 816; opening overlap excluded = 0
- trajectory / opening firewall後 trajectories = 3898
- Stage 1 RAW-state observations excluded = 4765
- selected unique RAW states = 3570 (Namua 1823; Mtaji 1747)
- independent selection / measurement verification PASS; measurement mismatches = 0; final overlap = `0 / 0 / 0`
- failed estimability gates = trajectories 3898<4500; RAW states 3570<4000; Mtaji 1747<1750
- formal decision = `INCONCLUSIVE`; primary formal branchには入らずcanonical `primary = null`
- rescue / extension / replacement / refit / threshold relaxationは未実施
- Study scientific closure完了

## 2026-08-27 — Repository integration

- final cross-document / CI audit完了
- G2-01 calibration replication contract: PASS
- Second-generation research agenda audit: PASS
- SSGTC closure consistency audit: authoritative Version 2.0.0へstale agenda-version assertionを同期後PASS
- PCEM closure consistency audit: PASS
- Phase Transition Research CI: PASS
- PR #67をready for reviewへ変更
- expected research head `6e64cd5bb252eab40c2608fc88562ba7371b2602`を確認
- PR #67を`main`へmerge
- integration merge commit = `12ce1f5f212349cc827147adcb5de8e7eadb98f3`
- repository integrationによってscientific decision、canonical artifact、gate、interpretation boundaryは変更されていない
