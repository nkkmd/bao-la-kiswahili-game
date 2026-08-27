# PEOCR-STUDY1 — Research Log

## 2026-08-26 — Study initiation

- remote `main` reacquired: `9e9cb6e2525f09a873e741db9f8fa42696839fbe`
- open PR audit: none
- G2-01 selected as first Research Generation 2 Study
- new branch created: `research/g2-01-position-evaluation-empirical-outcome-calibration-replication`
- Research Generation 1 PEC final report audited
- PEC Stage 2 estimability failure mechanism audited
- formal title assigned
- Study ID `PEOCR-STUDY1` assigned
- Stage IDs assigned
- Stage 0/1/2 contracts prospectively frozen
- Stage 1 = 2,048 fresh development games
- Stage 2 = 8,192 fresh formal games
- strict Stage 1→2 trajectory/opening/RAW-state firewall retained
- phase-stratified isotonic PAVA fixed as the only primary development family
- prediction clipping `[0.01,0.99]` frozen before outcomes
- Brier + log-loss paired skill formal criteria frozen
- Research Generation 1 Brier maxima retained only as prospective replication targets
- calibration slope/intercept, reliability bins, ECE, raw-score AUC required as diagnostics
- no scientific outcome generated
- Stage 1/2 generation remain unauthorized

Next scientific action is Stage 0 technical implementation and validation. Failure at Stage 0 does not authorize relaxing the formal Study contract; a material contract change would require a new prospective version before scientific generation.

## 2026-08-27 — Stage 1 complete development run

- first authorized run `32971272256` stopped at 1536/2048 solely due to a 120-minute administrative Actions ceiling; partial artifact retained for provenance only
- execution ceiling changed to 360 minutes without changing any scientific source hash or contract element
- recovery run `33017663172` completed successfully
- 2048/2048 fresh games generated from the original fixed seed range
- independent verifier replayed all 2048 games
- replay mismatches = 0; measurement mismatches = 0
- unique historical trajectories = 1602
- selected unique RAW states = 1547 (Namua 806; Mtaji 741)
- administrative truncation rate = 0
- all Stage 1 readiness gates passed
- Stage 1 decision = `MODEL-FROZEN-DEVELOPMENT`
- frozen PAVA mapping SHA-256 = `b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac`
- Stage 2 remains unauthorized pending its own technical smoke and exact authorization freeze

## 2026-08-27 — Stage 2 technical smoke

- Stage 2 production, independent verifier and formal evaluator implementations completed before formal outcomes
- Stage 1 reference universe manifest frozen: `5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063`
- execution sharding frozen prospectively as 8 contiguous shards × 1024 games
- technical smoke run `33037897038` completed successfully
- production smoke PASS; independent smoke verification PASS
- no Stage 2 scientific seed used; no formal inference performed
- Stage 2 scientific generation remains unauthorized pending explicit source-bound authorization

## 2026-08-27 — Stage 2 formal replication and closure

- source-bound formal authorization commit `5d1b4a40ef95ac639787aa0abf040a455c3c2995`
- formal workflow run `33038132423` completed successfully
- 8 fixed shards × 1024 = 8192/8192 scientific games generated
- all 8 shard independent replay verifications passed
- merged fixed population audit passed
- trajectories before firewall = 4714; Stage 1 trajectory overlap excluded = 816; opening overlap excluded = 0
- trajectories after trajectory/opening firewall = 3898
- Stage 1 RAW-state observations excluded = 4765
- selected unique RAW states = 3570 (Namua 1823; Mtaji 1747)
- independent selection/measurement verification passed; measurement mismatches = 0; final overlap = `0 / 0 / 0`
- failed estimability gates = trajectories 3898<4500; RAW states 3570<4000; Mtaji 1747<1750
- formal decision = `INCONCLUSIVE`; primary formal branch not entered; canonical `primary = null`
- no rescue/extension/replacement/refit/threshold relaxation performed
- Study scientific closure complete
