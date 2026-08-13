# Position Complexity / Difficulty Study — Stage 2 Formal Local Runbook

更新日: 2026-08-13  
Stage ID: `PCX-S2-FORMAL-2026-08-13-v1`  
Status: **FORMAL LOCAL EXECUTION AUTHORIZED / NOT YET GENERATED**

This runbook executes only the already frozen Stage 2 formal protocol:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
```

## 1. Boundary

This is a held-out formal run.

Do not:

- reuse Stage 1 seeds or states;
- alter the 1024-game count;
- alter the seed block;
- inspect partial formal outcomes and modify the protocol;
- replace unavailable assigned-phase trajectories;
- change selection salts;
- change `legalMoveCount` or the D2->D3 TopSet-disjoint endpoint;
- switch depth pair;
- change the H1/H2 logistic models, alpha, or gatekeeping rule;
- append games/seeds;
- generate the formal corpus in GitHub Actions.

If a technical failure occurs, preserve logs/artifacts and stop before interpreting outcomes.

## 2. Activate the research Python environment

Use the existing Bao research environment used by prior formal analyses:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate
```

Required for the formal analyzer:

```text
numpy
scipy
```

Check:

```bash
python3 - <<'PY'
import numpy, scipy
print("numpy", numpy.__version__)
print("scipy", scipy.__version__)
PY
```

## 3. Update the research branch

```bash
git switch research/position-complexity-difficulty
git pull --ff-only
```

Confirm tracked study source files are clean:

```bash
git status --short
```

Do not start formal generation with local edits to the frozen pipeline.

## 4. Run the authorization preflight

```bash
node tools/experiments/check-position-complexity-stage2-authorization.js
```

Required:

```text
passed = true
authorized = true
sourceHashFirewallPassed = true
pipelineHashFirewallPassed = true
stageId = PCX-S2-FORMAL-2026-08-13-v1
```

If this fails, stop. Do not regenerate authorization hashes locally or alter the source to make the check pass.

## 5. Confirm empty/new formal artifact state

Formal artifact root:

```text
artifacts/local/position-complexity/stage2-formal-v1/
```

Check:

```bash
node tools/experiments/run-position-complexity-stage2-formal.js --phase status
```

Before first execution, expected substantive state:

```text
generatedGameFiles = 0
expectedGames = 1024
hasManifest = false
hasFormalResult = false
```

If an unexpected prior Stage 2 artifact set exists, do not delete or overwrite it casually. Preserve it and resolve provenance before continuing.

## 6. Phase A — fixed formal generation

Run exactly:

```bash
node tools/experiments/run-position-complexity-stage2-formal.js --phase generate
```

Frozen corpus:

```text
games = 1024
seeds = 20410001..20411024
opening = 8 plies seeded-uniform over E.moveVariants
then = hard / bao / phase2 / depth2
quiescenceDepth = 1
timeLimitMs = Infinity
adaptive = false
max ply = 100
```

Do not use `--force` during normal formal execution.

Expected key outputs:

```text
artifacts/local/position-complexity/stage2-formal-v1/manifest.json
artifacts/local/position-complexity/stage2-formal-v1/games/
```

After generation:

```bash
node tools/experiments/run-position-complexity-stage2-formal.js --phase status
```

Required:

```text
generatedGameFiles = 1024
hasManifest = true
```

Do not inspect partial scientific outcome summaries before completing the fixed pipeline.

## 7. Phase B — independent full verification

Run:

```bash
node tools/experiments/verify-position-complexity-stage2-formal.js
```

Do not use `--no-search-recompute` for the scientific formal verification.

The verifier independently replays every game and recomputes every post-opening depth-2 trajectory-generation search.

Required:

```text
passed = true
formalExperiment = true
fullSearchRecomputation = true
gamesVerified = 1024
```

Expected output:

```text
artifacts/local/position-complexity/stage2-formal-v1/verification.json
```

If verification fails, stop before selection or measurement. Treat the cause as a technical integrity issue, not a scientific result.

## 8. Phase C — frozen trajectory/state selection

Only after full verification PASS:

```bash
node tools/experiments/run-position-complexity-stage2-formal.js --phase select
```

Frozen selection:

```text
collapse duplicate historicalTrajectoryHash
-> phase assignment with PCX-S2-PHASE-v1
-> nonterminal, ply >= 8, legalMoveCount >= 2
-> one state/trajectory using PCX-S2-STATE-v1
-> no replacement when assigned phase unavailable
-> collapse exact duplicate selected ruleStateKey
```

Expected outputs:

```text
selection-audit.json
selected-states.json
```

Do not change the population based on observed event prevalence.

## 9. Phase D — fixed D2/D3 measurement

Run:

```bash
node tools/experiments/run-position-complexity-stage2-formal.js --phase measure
```

Only D2 and D3 are measured for the formal hypotheses.

For every selected state/depth, the runner requires:

```text
exact diagnostic bestScore == normal engine rootScore
normal engine chosen move belongs to exact TopSet
```

Expected outputs:

```text
measurements/selected-*.json
measurement-manifest.json
```

Do not use `--force` during normal formal execution.

## 10. Phase E — frozen formal analysis

Only after generation, full verification, selection and measurement are complete:

```bash
python3 tools/experiments/analyze-position-complexity-stage2-formal.py
```

Expected output:

```text
artifacts/local/position-complexity/stage2-formal-v1/stage2-formal-result.json
```

The analyzer implements only the frozen formal family.

### PCX-H1

```text
outcome = D2->D3 exact TopSet disjointness
predictor = log1pLegalMoveCount
covariate = phaseMtajiIndicator
reduced = phase only
full = phase + log1pLegalMoveCount
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
```

If primary technical/estimability gates pass:

```text
p < .05  -> confirmed
p >= .05 -> not-confirmed
```

A valid nonsignificant result is not inconclusive.

### PCX-H2

```text
ordinary-domain D2 best-second margin subset only
predictor = log1pD2BestSecondGap
incremental beyond phase + log1pLegalMoveCount
```

H2 receives a confirmatory label only if H1 is confirmed.

## 11. Required formal estimability gates

H1:

```text
selected unique rule states >= 500
Namua >= 180
Mtaji >= 180
D23 instability >= 80
D23 stable >= 80
primary models finite/converged
```

H2:

```text
ordinary-domain D2 margins >= 350
H2-subset D23 instability >= 50
H2-subset D23 stable >= 50
secondary models finite/converged
```

Do not relax a failed gate or add seeds.

## 12. What to preserve for review

After the complete formal pipeline, preserve at minimum:

```text
manifest.json
verification.json
selection-audit.json
measurement-manifest.json
stage2-formal-result.json
```

Also preserve the local `games/`, `selected-states.json`, and `measurements/` directories until the formal result has been fully audited and repository closure is complete.

Do not commit the large `artifacts/local/` corpus to GitHub.

## 13. Stopping point

After `stage2-formal-result.json` exists, stop scientific extension work and submit the five key JSON records for formal audit.

Do not run alternate models, phase-stratified confirmation, other depth pairs, additional seeds, or alternative ambiguity metrics before the preregistered H1/H2 decision is recorded in GitHub.
