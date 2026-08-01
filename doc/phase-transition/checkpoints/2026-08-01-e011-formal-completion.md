# E-011 固定ローカル正式実験 完了チェックポイント

更新日: 2026-08-01  
Experiment: `E-011`  
analysisVersion: `12-ai-depth-robustness`  
Formal decision: `inconclusive`

## 1. 実行固定情報

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- Node.js: `v24.6.0`
- platform: Linux
- formal corpus: 5 conditions × 400 games = 2000 games
- shared seeds: `20262001–20262400`
- run order: `C0 → C1 → C2 → C3 → C4`
- preregistration SHA-256: `65253e719463b4e60527bdb96cb4ce234aae76df39d5d2727bd9d09849c7eb69`

## 2. Formal integrity

`run-phase-transition-robustness-formal.js --phase verify` succeeded with:

- `mode: formal`
- `expectedGamesPerCondition: 400`
- `conditionCount: 5`
- `allConditionsPresent: true`
- `uniqueConditionConfigHashes: true`
- `commonSourceCommit: true`
- `pairedOpeningHashes: true`
- `conditionIdentityClean: true`
- `errors: []`
- `valid: true`

All five conditions used the same locked source commit and paired openings. Each condition completed 400 games.

## 3. Preregistered condition results

Primary population: `pliesRemaining >= 9`.

| Condition | evaluator | search | depth | A candidates | expansion | controls | candidate rate | control rate | RR | status |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| C0 | bao | phase2 | 2 | 16 | 9 | 16395 | 56.25% | 2.95% | 19.09 | `pass` |
| C1 | bao | phase2 | 1 | 15 | 2 | 15679 | 13.33% | 2.05% | 6.49 | `insufficient` |
| C2 | bao | phase2 | 3 | 12 | 3 | 15801 | 25.00% | 1.75% | 14.26 | `insufficient` |
| C3 | bao-v2 | phase2 | 2 | 19 | 11 | 16437 | 57.89% | 2.88% | 20.08 | `pass` |
| C4 | bao | legacy | 2 | 8 | 0 | 15412 | 0.00% | 1.68% | 0.00 | `insufficient` |

Condition criteria were not changed after observing results:

- primary A candidates >= 12
- expansion candidates >= 5
- controls >= 10000
- RR >= 3
- candidate rate > control rate

C1 and C2 miss only the minimum expansion-candidate count. C4 misses the minimum primary-candidate count and minimum expansion-candidate count, so the preregistered status function classifies it as `insufficient` rather than an evaluable `fail`.

## 4. Trajectory-ply sensitivity

Deduplication key: `trajectoryHash + candidatePly`.

| Condition | unique candidates | unique expansion | unique controls | unique control expansion | dedup candidate rate | dedup control rate | dedup RR |
|---|---:|---:|---:|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 387 | 25.00% | 3.18% | 7.87 |
| C1 | 13 | 2 | 11407 | 240 | 15.38% | 2.10% | 7.31 |
| C2 | 10 | 2 | 11695 | 213 | 20.00% | 1.82% | 10.98 |
| C3 | 11 | 4 | 12160 | 378 | 36.36% | 3.11% | 11.70 |
| C4 | 6 | 0 | 11412 | 180 | 0.00% | 1.58% | 0.00 |

The enrichment direction survives trajectory-ply deduplication in all four `phase2` conditions. C4 (`legacy`) has no expansion candidate in either the raw or deduplicated endpoint.

## 5. Formal global decision

The combined evaluator returned:

```text
decision: inconclusive
trajectorySensitivityComplete: true
```

This is the preregistered global result and must not be rewritten post hoc.

Why the result is `inconclusive`:

- C0 reference passes.
- C3 evaluation-profile perturbation passes.
- C1 and C2 are `insufficient`, not `fail`, because minimum expansion counts are not met.
- C4 has RR 0 and reversed direction, but is also `insufficient` because minimum count criteria are not met; the preregistered global rule does not use an `insufficient` condition as an evaluable reversal.
- There are not enough perturbation `pass` conditions for `partially-robust`.
- The registered `not-robust` conditions are therefore not satisfied.

Formal conclusion: **E-011 is `inconclusive`.**

## 6. Scientific interpretation

The result does not support a claim that the capture-branch-expansion signal is globally robust across the preregistered AI/search perturbations.

At the same time, the signal is not generally absent:

- C0 (`bao / phase2 / depth2`) shows strong enrichment.
- C1 (`depth1`) and C2 (`depth3`) retain RR > 3 and retain enrichment after trajectory-ply deduplication, but do not yield enough expansion candidates for confirmation.
- C3 (`bao-v2 / phase2 / depth2`) independently passes with strong enrichment.
- C4 (`bao / legacy / depth2`) yields zero expansion candidates, suggesting a potentially important search-profile dependence that requires a separately preregistered follow-up rather than post-hoc reclassification of E-011.

Accordingly, the most defensible interpretation is: **directional robustness is visible within the phase2 family, but the preregistered experiment does not establish global robustness, and the legacy-search result raises a specific search-profile-dependence question.**

## 7. Evaluator exit-code anomaly

The evaluator successfully writes:

- `robustness-result.json`
- `condition-summary.csv`
- `robustness-summary.csv`

and prints the complete result before executing:

```js
if (decision === "inconclusive") process.exitCode = 2;
```

The formal runner invokes the evaluator through `execFileSync`, so this valid scientific outcome is surfaced afterward as `Error: Command failed`.

This is an infrastructure/interface issue, not a corpus or scientific-evaluation failure. The formal result remains `inconclusive`. Any code fix must be made only after preserving this locked-run result and must not be used to retroactively change the formal outcome.

## 8. Next research constraints

- Do not relax E-011 thresholds after observing these results.
- Keep PR #26 draft until explicit instruction changes that policy.
- E-017 remains separately preregistered and formally unapproved; E-011 approval does not authorize E-017.
- A future targeted comparison of `phase2` versus `legacy` search should be separately preregistered if pursued.
