# 2026-08-31 — G3-01 Stage 0 v2 corrective implementation freeze

`LGTGMF-S0-TECHNICAL-2026-08-31-v1` は実行上の全checkをpassしたが、Study-level cross-contract auditにより、凍結済みconstructである `rootBranchPairOverlap` と `narrowPathRun` のformal materializationがmeasurement coreに欠落していることをfresh scientific evidence生成前に検出した。

このためv1はStage 1 authorizationには使用せず、`STAGE0-TECHNICAL-INVALID`としてimmutableに保存する。fresh development / formal evidenceは未生成・未読で、Stage 1 / Stage 2 seed consumptionは `NONE` のため、Study開始時に凍結したtechnical-refreeze ruleに従い corrective versionを固定する。

```text
Study ID = LGTGMF-STUDY1
Corrective Stage ID = LGTGMF-S0-TECHNICAL-2026-08-31-v2
Scientific contract changed = false
Fresh development generated/read = false
Fresh formal generated/read = false
Stage 1 seed consumed = false
Stage 2 seed consumed = false
standard-root complete depth-10 generated/read = false / false
```

Corrective production path:
- `tools/experiments/lib/lgtgmf-production-v2.js`
- `tools/experiments/run-lgtgmf-stage0-technical-v2.js`

Corrective independent path:
- `tools/experiments/lib/lgtgmf-independent-v2.js`
- `tools/experiments/verify-lgtgmf-stage0-independent-v2.js`

Frozen corrective spec:
- `preregistration/STAGE_0_TECHNICAL_SPEC_V2.json`

Execution workflow:
- `.github/workflows/lgtgmf-stage0-technical-v2.yml`

v2はv1で通過したRAW identity、move identity、historical depth-2 reference、traversal-order invariance、production/independent separationを再確認したうえで、root-branch pair overlap と narrow-path run のknown synthetic expectationおよびproduction/independent exact agreementを追加で要求する。

このfreeze commit自体はscientific outcomeを生成せず、別commitのauthorization fileのみがv2 workflowをtriggerする。
