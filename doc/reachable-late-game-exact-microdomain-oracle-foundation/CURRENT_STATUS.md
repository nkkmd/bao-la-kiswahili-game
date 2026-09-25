# RLEMOF-STUDY1 — 現在の状態

更新日: 2026-09-26

```text
Agenda = G4-05
Study ID = RLEMOF-STUDY1
Baseline main = 550508f07a1026fa5f08f82343c1b13da2e0dfbd
Research branch = research/g4-05-exact-microdomain-oracle-foundation
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 0 run = 36118292862 / attempt 1 / success
Stage 1 = STAGE1-DEVELOPMENT-ACCEPTED
Stage 1 run = 36118961899 / attempt 1 / success
Stage 1 selected tier = T3
Stage 1 selected roots = 7
Stage 1 complete closures = 5
Stage 2 = FORMAL-COMPLETE
Stage 2 run = 36120286922 / attempt 1 / success
Stage 2 execution SHA = 72e45631112359346a83f9399be32ee3e6420ccb
Stage 2 artifact ID = 10858056244
Stage 2 artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
Stage 2 seed block = 40523001..40524024 / 1024 games
Stage 1 identity firewall roots = 8307
fresh RAW overlap excluded count = 0
eligible candidates = 21
inspected candidates = 10
formal complete domains = 8
production / independent agreement = true
formal exact decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
Study status = COMPLETE / CLOSED
G4-06 = ELIGIBLE FOR SEPARATE AUTHORIZATION REVIEW / NOT AUTHORIZED
main integration = COMPLETE / PR #166 / merge commit 97ffe3758157d2497b5884f7b17abe59a24159b5
public AI change = false
```

Stage 2 formal populationはcandidate orderどおりに取得した8 complete closureである。candidate 1と4は`STATE-LIMIT`のままfail-closedし、cap増加・root replacement・seed extension・same-evidence rerunは行っていない。

8 formal domainsでは`RECURRENT = 0`だったが、draw inferenceは認可しておらず、whole-Baoへの一般化もしない。

G4-05はPR #166により`main`へ統合済みである。main統合は研究結果そのもの、no-rescue境界、G4-06の未認可状態、public AI非変更を変更しない。

正本:

- [`FINAL_REPORT.md`](FINAL_REPORT.md)
- [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`../research-program-decisions/2026-09-25-g4-05-reachable-late-game-exact-microdomain-oracle-foundation-study1-closure.md`](../research-program-decisions/2026-09-25-g4-05-reachable-late-game-exact-microdomain-oracle-foundation-study1-closure.md)
- [`../research-generation-4/checkpoints/2026-09-26-g4-05-main-integration.md`](../research-generation-4/checkpoints/2026-09-26-g4-05-main-integration.md)
