# Study 1 Final Report （結論）

## 日本語での結論と読み方

中心現象はcapture-branch-expansionである。fixed hard / bao / depth 2ではphase2 > legacy、depth 3ではlegacy > phase2をそれぞれCONFIRMEDとしたが、universal Bao phase transitionは主張しない。

以下には、Study closure時に固定した英語の詳細記録が含まれる。canonical decision token、数値、seed、hash、実行ID、authorization、evidence boundaryを再解釈しないため原文を保持している。初めて読む場合は`STUDY_1_OVERVIEW.md`と`CURRENT_STATUS.md`を先に参照する。

## Baoにおける局面相転移点の発見と、capture-branch-expansionの確認

Date: 2026-08-07  
Status: final Study 1 scientific integration  
Branch: `research/forced-capture-regime-analysis`

---

## 1. Executive summary （日本語の要点）

Study 1 investigated whether Bao la Kiswahili games contain reproducible strategic-transition candidates that can be detected from board/legal-move structure, distinguished from transient fluctuations and formal rule-state transitions, and reproduced under new seeds and controlled AI search conditions.

The central phenomenon that emerged from the exploratory program was **`capture-branch-expansion`**: a persistent local expansion in the number of legal capture choices after a Category-A transition candidate, after excluding candidates better explained as imminent `namua -> mtaji` transition or imminent forcing release.

The strongest defensible conclusion is:

> **`capture-branch-expansion` is a reproducible, persistent, structurally interpretable strategic-transition phenotype inside the observed forced-capture lifecycle, with explicit search-condition boundaries. Its manifestation rate depends on AI search profile, and the favored profile reverses between the tested fixed depth2 and depth3 conditions.**

The original master-plan six recognition criteria are not all fully satisfied: five are `satisfied`, while the requirement for a second independent feature group is conservatively `partially satisfied`. Therefore Study 1 does **not** claim an unqualified universal Bao phase transition.

Formal decisions remain exactly as preregistered:

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only at fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only at fixed `hard / bao / depth3`

No Stage B–E interpretation changes or rescues these decisions.

---

## 2. Study scope （適用範囲と制限）

The original master plan `doc/PHASE_TRANSITION_RESEARCH_PLAN.md` defined broad RQ1–RQ10 covering formal phase, reserve, nyumba, front-row structure, mobility, forcing, and state classification.

As the research progressed, the clearest reproducible candidate was the forced-capture-regime `capture-branch-expansion` phenomenon. Study 1 was therefore bounded as:

> **Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**

Questions not centrally tested in Study 1 are carried forward as Future Work rather than retrospectively labeled failures.

The Study 1 completion plan is:

- `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`

---

## 3. Data and analysis hierarchy （日本語の要点）

The dependency hierarchy used throughout the later study is:

`paired seed -> game -> forced-capture regime -> trajectory/ply -> candidate row`

This hierarchy is essential because repeated deterministic trajectories can create many candidate rows that are not independent structural examples.

Formal search-profile comparisons E-018/E-019/E-020 use paired game-level endpoints. Candidate/regime/trajectory-ply analyses are secondary structural analyses and never replace the formal paired endpoint.

---

## 4. Exploratory discovery and phenotype construction （日本語の要点）

### 4.1 Pilot corpus （日本語の要点）

The pilot-v2 corpus contained:

- 100 games
- 5650 observations
- 421 forced-capture regimes
- 15 Category-A candidate intervals
- 13 Category-A archetypes

Category A was constructed after forcing ablation so that candidate candidacy required at least two non-forcing signal groups rather than relying on the forced-capture indicator itself.

### 4.2 Forced-capture regime analysis （日本語の要点）

A forced-capture regime was defined as a maximal contiguous sequence of observations with `forcedCapture === true`.

All exploratory Category-A archetypes were found inside such regimes, making regime lifecycle structure the central frame for later interpretation.

### 4.3 Candidate phenotype classification （日本語の要点）

Candidate analysis separated:

- `capture-branch-expansion`
- `capture-branch-convergence`
- `temporary-spike`
- `namua-to-mtaji-precursor`
- `forcing-release-precursor`

The expansion classifier was fixed before later confirmation experiments with:

- pre-window: 3 ply
- post-window: 8 ply
- `expansionDelta = 3`
- `persistenceFraction = 0.5`
- `eventWindow = 8`

Precursor gates have precedence over expansion classification.

### 4.4 Candidate/control enrichment （日本語の要点）

In the exploratory control analysis:

- Category-A candidate expansion: 5/15 = 33.3%
- eligible forced-capture controls: 120/4127 = 2.9%
- risk ratio: approximately 11.46

This established `capture-branch-expansion` as the main candidate-side phenotype for confirmation work.

### 4.5 Terminal-near forcing-release confound （日本語の要点）

Forcing-release precursors were found to be concentrated near terminal positions; the earlier interpretation of forcing release as an independent strategic transition was withdrawn for Study 1.

This was an important negative result: not every visually sharp local transition was retained as a distinct strategic-transition phenomenon.

---

## 5. Formation-process evidence （証拠と成果物）

The initial formation analysis of five exploratory expansion intervals found:

- capture-option peak approximately 1.8 ply after the candidate on average;
- player-to-move maximum capturable seeds: mean change `+3.0`;
- opponent maximum capturable seeds: mean change `-1.2`;
- formal phase changes: `0/5`.

This supported the interpretation that expansion is not simply the formal `namua -> mtaji` transition and is better understood as development of future capture-option structure.

In the E-010 unused-seed secondary analysis:

- raw seven expansion rows reproduced the same maximum-capture asymmetry direction: actor `+2.57`, opponent `-0.86`;
- trajectory-ply deduplicated two structures averaged actor `+1.50`, opponent `-0.50`;
- however, only one of the two independent structures showed a clear non-zero asymmetry.

This is why Stage C treats the second-independent-feature-group criterion as only partially established.

---

## 6. Confirmation chronology （日本語の要点）

### E-010 — unused-seed confirmation （日本語の要点）

Design:

- 200 new-seed games
- primary population `pliesRemaining >= 9`
- fixed candidate and expansion thresholds

Result:

- primary candidates: 11
- candidate expansion: 7/11 = 63.64%
- controls: 8424
- control expansion: 249/8424 = 2.96%
- RR = 21.53

Formal decision: **`not-confirmed`**.

Reason: preregistered minimum primary candidate count was 12; observed was 11. The threshold was not relaxed after observing the result.

Trajectory-ply sensitivity:

- candidates: 5
- expansion candidates: 2
- controls: 7061
- control expansion: 218
- dedup RR = 12.96

The effect direction survived deduplication but did not alter the formal decision.

### E-011 — evaluator/depth/search robustness screen （日本語の要点）

Five fixed conditions, 400 games each:

- C0 `bao / phase2 / depth2`: pass
- C1 `bao / phase2 / depth1`: insufficient
- C2 `bao / phase2 / depth3`: insufficient
- C3 `bao-v2 / phase2 / depth2`: pass
- C4 `bao / legacy / depth2`: insufficient

Formal global decision: **`inconclusive`**.

The phase2 family preserved candidate enrichment direction after trajectory-ply deduplication, whereas legacy C4 had zero expansion candidates, but C4 availability was insufficient for a formal search-profile claim.

This motivated a new direct paired experiment rather than reinterpretation of E-011.

### E-017 — independent structural confirmation （日本語の要点）

Design:

- 1000 independent-seed games
- primary unit: unique `trajectoryHash + eventPly`

Observed:

- unique candidates: 21
- unique expansion trajectory-ply: 9
- unique expansion trajectories: 9
- unique controls: 23306
- candidate expansion rate: 42.86%
- control expansion rate: 3.12%
- dedup RR = 13.74

Formal decision: **`not-confirmed`**.

Reason: preregistered minimum unique control trajectory-ply was 30000; observed was 23306. All effect-direction and candidate-structure criteria passed.

Again, the formal threshold was not altered post hoc.

---

## 7. Search-profile dependence （日本語の要点）

### 7.1 E-018 / H16 — fixed depth2 direct comparison （日本語の要点）

Condition:

- `hard / bao / depth2`
- phase2 vs legacy
- 2000 paired shared-seed games

Primary endpoint:

- whether a paired game contains at least one eligible Category-A `capture-branch-expansion` candidate

Test:

- two-sided exact McNemar
- alpha 0.05
- minimum discordants 20
- preregistered direction P2-only > LG-only

Result:

- n00 = 1928
- LG-only = 9
- P2-only = 63
- n11 = 0
- discordants = 72
- P2 event-game rate = 3.15%
- LG event-game rate = 0.45%
- risk difference = +2.70 pp
- discordant OR = 7.0
- exact p = `4.1812279092751445e-11`

Formal decision: **`confirmed`**.

Scope: only fixed `hard / bao / depth2`.

Trajectory-ply secondary:

- P2 11/34 = 32.35%
- LG 7/31 = 22.58%
- P2/LG RR = 1.433

The secondary contrast is smaller than the raw/game-level contrast but retains the P2 > LG direction.

### 7.2 E-019 / H17 — generalization test （日本語の要点）

Preregistered strata:

- D1: `bao / depth1`, 6500 pairs
- D3: `bao / depth3`, 4500 pairs
- V2: `bao-v2 / depth2`, 2000 pairs

Global rule:

- all three strata must pass the preregistered phase2 > legacy direction under an intersection-union framework

Results:

| stratum | P2-only | LG-only | RD P2-LG | exact p | decision |
|---|---:|---:|---:|---:|---|
| D1 | 67 | 4 | +0.9692 pp | `8.735848890518809e-16` | pass |
| D3 | 13 | 140 | -2.8222 pp | `4.614222568073049e-28` | fail |
| V2 | 63 | 18 | +2.25 pp | `5.204403564731451e-7` | pass |

Formal global decision: **`not-confirmed`**.

The D3 result was strongly opposite to the preregistered direction. It was not re-labeled as a confirmatory legacy > phase2 result inside E-019.

### 7.3 E-020 / H18 — prospective independent D3 reversal replication （日本語の要点）

Condition:

- fixed `hard / bao / depth3`
- phase2 vs legacy
- 4500 independent paired seeds / 9000 games
- seed `20275001–20279500`

Primary test:

- paired game-level exact McNemar
- two-sided alpha 0.05
- minimum discordants 20
- prospective direction LG-only > P2-only

Result:

- n00 = 4353
- LG-only = 129
- P2-only = 18
- n11 = 0
- discordants = 147
- P2 event-game rate = 0.40%
- LG event-game rate = 2.8667%
- RD P2-LG = -2.4667 pp
- discordant OR LG/P2 = 7.1667
- exact p = `7.0456833990241785e-22`

Formal decision: **`confirmed`**.

Scope: only fixed `hard / bao / depth3`.

This confirmation does not turn E-019/H17 into a confirmed global interaction hypothesis and does not by itself establish a general non-monotonic depth law.

---

## 8. Stage B — mechanism decomposition （Stageの記録）

Stage B used only fixed formal corpora and archived secondary outputs. No games were generated and no formal decision was changed.

### 8.1 Candidate availability versus manifestation （日本語の要点）

The observed game-level expansion contrast can be descriptively factored as:

`P(expansion game) = P(candidate-bearing game) × P(expansion | candidate-bearing game)`

Results showed that the favored profile in each comparison had both:

1. more candidate-bearing games; and
2. a much higher candidate-to-expansion manifestation probability.

The larger multiplicative component was manifestation rather than candidate availability, especially in both D3 corpora.

This factorization is descriptive, not causal mediation.

### 8.2 Forced-capture morphology （日本語の要点）

The profile with the higher expansion-game rate consistently occupied a more expansion-compatible morphology:

- longer forced-capture regimes;
- earlier normalized position within the regime;
- higher post-candidate capture-option ceiling;
- greater persistence;
- longer recovery distance;
- longer distance to forcing release.

At D2 these properties favor phase2; at D3 they favor legacy.

Instantaneous candidate capture-option count and capture delta alone do not track the favored profile across depths and therefore do not explain the reversal.

### 8.3 Fixed categorical context （日本語の要点）

Restricting to the common recorded context `namua × inside-regime` did not eliminate the reversal:

- E-018 D2: P2 63/77 = 81.82%, LG 9/46 = 19.57%
- E-019 D3: P2 13/68 = 19.12%, LG 140/175 = 80.00%
- E-020 D3: P2 18/73 = 24.66%, LG 129/157 = 82.17%

Therefore coarse phase composition and simple regime membership do not explain the profile reversal.

### 8.4 Fixed classifier-gate decomposition （日本語の要点）

Using only pre-existing classifier defaults, the largest profile separation appears in:

- distance from imminent `namua -> mtaji` transition;
- distance from imminent forcing release;
- persistence of the elevated capture-option state.

The fixed capture-delta gate contributes comparatively little after earlier gates are passed.

Because these are components of the phenotype classifier, this is a decision-path decomposition rather than independent predictor validation.

### 8.5 Trajectory-ply deduplication （日本語の要点）

Final Stage B sensitivity:

| comparison | P2 dedup rate | LG dedup rate | direction |
|---|---:|---:|---|
| E-018 D2 | 11/34 = 32.35% | 7/31 = 22.58% | P2 > LG |
| E-019 D3 | 6/49 = 12.24% | 17/36 = 47.22% | LG > P2 |
| E-020 D3 | 5/42 = 11.90% | 13/35 = 37.14% | LG > P2 |

Deduplication attenuates effect magnitude but preserves the D2/D3 ordering reversal.

Large repeated trajectory groups therefore amplify raw candidate-row contrasts but cannot explain the reversal itself.

### 8.6 Stage B structural explanation （Stageの記録）

The strongest explanation supported by existing data is:

> Search profile and search depth alter where Category-A candidates fall within the lifecycle of a forced-capture regime. Capture-branch-expansion is most compatible with a **sustained-forcing window**: a relatively early part of a sufficiently long forced-capture regime, not immediately before formal phase transition or forcing release, with enough remaining structure for elevated legal capture branching to persist. At fixed depth2 phase2 preferentially reaches this morphology; in both fixed depth3 corpora legacy preferentially reaches it.

The remaining question — why depth changes which search profile reaches this structural window — requires internal search-tree / PV / cutoff / leaf-evaluation / horizon diagnostics absent from the archived corpus and belongs to a future preregistered study if pursued formally.

---

## 9. Stage C — original recognition criteria （Stageの記録）

The original master plan required six criteria for strong phase-transition recognition.

| criterion | Study 1 assessment |
|---|---|
| recurrence across different games | `satisfied` |
| changes in >=2 independent feature groups | `partially satisfied` |
| persistence for prespecified period | `satisfied` |
| reproduction on new seeds | `satisfied` |
| explainability as game-position structure | `satisfied` |
| counterexamples and applicability boundaries | `satisfied` |

### Why criterion 2 remains partial （リポジトリ状態）

The legal capture-option structure is strongly established.

A distinct second feature group — maximum capturable seed asymmetry — was observed in exploratory formation analysis and reproduced in mean direction on E-010 unused seeds, but after trajectory-ply deduplication only one of two independent E-010 structures showed clear non-zero asymmetry.

Study 1 therefore does not upgrade this criterion to fully satisfied after the fact.

### Recognition consequence （日本語の要点）

Preferred final wording:

- `capture-branch-expansion phenomenon`
- `capture-branch-expansion strategic-transition phenotype`
- `strong phase-transition candidate with bounded recognition scope`

Avoid unqualified:

- universal Bao phase transition
- generally confirmed search-profile × depth interaction
- universal evaluator/search robustness
- established causal search-tree mechanism

---

## 10. Stage D — fixed vocabulary （Stageの記録）

The canonical Study 1 terminology is defined in:

- `doc/phase-transition/STUDY_1_VOCABULARY.md`

Key distinctions:

- Category A is a candidate-context classification, not an expansion event.
- forced-capture regime is an observed contiguous legal-state sequence, not an AI search regime.
- `captureMoveCount` is a legal capture-option count / branching proxy, not complete search-tree branching.
- forced-capture-regime membership is an empirical structural finding and was not added post hoc to the expansion classifier.
- `sustained-forcing window` is interpretive Stage B vocabulary, not a newly fitted threshold.
- trajectory-ply is a secondary structural sensitivity unit and does not replace formal paired-game endpoints.

---

## 11. Formal decision table （結論）

| Experiment | Question | Formal decision | Main boundary |
|---|---|---|---|
| E-010 | unused-seed candidate enrichment | `not-confirmed` | minimum candidate count missed by 1 |
| E-011 | evaluator/depth/search robustness | `inconclusive` | several conditions insufficient |
| E-017 | independent structural enrichment | `not-confirmed` | minimum unique controls unmet |
| E-018 / H16 | phase2 vs legacy at depth2 | `confirmed` | fixed `hard / bao / depth2` only |
| E-019 / H17 | same-direction generalization D1/D3/V2 | `not-confirmed` | D3 reversed direction |
| E-020 / H18 | independent D3 legacy > phase2 replication | `confirmed` | fixed `hard / bao / depth3` only |

These decisions are final for Study 1 and are not modified by the integrative interpretation.

---

## 12. Reproducibility and final archives （再現性）

Formal final-export storage is indexed in:

- `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

Key archives:

### E-011 （日本語の要点）

- archive: `e011-final-formal-evaluation.tar.gz`
- SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- directory: `/home/oruorane/bao-e011-exports/`

### E-018 （日本語の要点）

- archive: `e018-final-formal-evaluation.tar.gz`
- SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- directory: `/home/oruorane/bao-e018-exports/`
- audited member count: 4046
- unsafe paths: 0

### E-019 （日本語の要点）

- archive: `e019-final-formal-evaluation.tar.gz`
- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- directory: `/home/oruorane/bao-e019-exports/`
- audited member count: 26120
- unsafe paths: 0

### E-020 （日本語の要点）

- archive: `e020-final-formal-evaluation.tar.gz`
- SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`
- directory: `/home/oruorane/bao-e020-exports/`
- audited member count: 9049
- unsafe paths: 0
- deterministic external rebuild match: `true`

The repository-local E-020 analysis-root lifecycle anomaly is recorded separately and does not alter the locked formal corpus or scientific decision.

---

## 13. Negative results and interpretation discipline （結果）

Study 1 deliberately preserves negative and inconclusive outcomes.

Examples:

- E-010 was not rescued by lowering the candidate-count threshold from 12 to 11.
- E-011 `inconclusive` was not rewritten as partial robustness or failure after observing mixed conditions.
- E-017 was not rescued by reducing the unique-control minimum.
- E-019 D3 was not reoriented post hoc to confirm H17.
- E-018 depth2 confirmation was not revoked after E-019/E-020 showed depth3 reversal.
- E-020 depth3 confirmation was not generalized to a universal depth interaction.
- structural secondary analyses were never substituted for preregistered primary endpoints.

This decision discipline is part of the Study 1 result, not merely an implementation detail.

---

## 14. What Study 1 establishes （日本語の要点）

Within its bounded operational scope, Study 1 establishes that:

1. Bao games contain reproducible structural transition candidates that can be extracted from multiple non-forcing feature groups.
2. `capture-branch-expansion` is a persistent candidate-side phenotype strongly enriched relative to controls in exploratory and independent-seed datasets.
3. the phenotype recurs across multiple independent trajectories and trajectory-ply structures.
4. it is not simply an immediate high-capture move; it concerns subsequent capture-option structure.
5. it is structurally associated with the forced-capture regime lifecycle and can be separated from temporary spikes and terminal-near forcing release.
6. its manifestation depends on search profile under controlled conditions.
7. the search-profile ordering is not invariant across tested depths:
   - depth2: phase2 > legacy confirmed;
   - depth3: legacy > phase2 independently confirmed.
8. the reversal is not explained by candidate count alone, coarse phase/regime composition, instantaneous capture amplitude alone, or repeated deterministic trajectories alone.
9. the best existing-corpus mechanism description is a reversal in which search profile preferentially reaches an expansion-compatible sustained-forcing morphology.

---

## 15. What Study 1 does not establish （日本語の要点）

Study 1 does **not** establish:

- a universal Bao phase-transition law;
- a fully satisfied second-independent-feature-group criterion across broad independent structures;
- a formally confirmed general search-profile × depth interaction;
- monotonic or non-monotonic behavior for arbitrary depths;
- generalization to all evaluators or future search implementations;
- internal search-tree mediation;
- a general theory covering reserve, nyumba, front-row control, mobility, forcing release, formal phase transition, and all other original RQs.

---

## 16. Future Work （今後の課題）

### 16.1 Internal search mechanism （日本語の要点）

If pursued, a new preregistered study should instrument:

- principal variation changes;
- node expansions;
- alpha-beta cutoffs or equivalent pruning events;
- leaf evaluations;
- horizon-boundary structure;
- same-opening direct depth1/depth2/depth3 move divergence.

The goal would be to explain why depth changes which search profile reaches the sustained-forcing window.

### 16.2 Second independent feature group （日本語の要点）

A future confirmation study may preregister maximum-capturable-seed asymmetry or another genuinely independent board feature group before data generation and test it across unique trajectory-ply structures.

### 16.3 Original RQs carried forward （日本語の要点）

Additional independent research remains for:

- reserve thresholds;
- nyumba state changes;
- front-row dominance;
- capture-to-mobility transitions;
- non-terminal forcing-to-free-choice transitions;
- timing between formal `namua -> mtaji` and strategic transitions;
- multiple transition types per game;
- broader state-based transition taxonomy;
- external validity across additional evaluators and search implementations.

These questions were not failed by Study 1; they were outside its final confirmatory center.

---

## 17. Final Study 1 conclusion （結論）

Study 1 successfully moved from broad exploratory change-point detection to a bounded, reproducible strategic-transition phenotype with explicit formal and structural limits.

`capture-branch-expansion` should be retained as the central Study 1 phenomenon and described as:

> **a reproducible strategic-transition phenotype characterized by sustained expansion of legal capture options within the observed forced-capture lifecycle, whose manifestation is search-profile dependent and whose favored search profile reverses between the tested fixed depth2 and depth3 conditions.**

The scientific record remains deliberately asymmetric:

- several enrichment/robustness confirmation attempts are `not-confirmed` or `inconclusive` because their preregistered availability thresholds were not met;
- direct fixed-condition search-profile effects are formally confirmed at depth2 and independently in the opposite direction at depth3;
- the original six phase-transition recognition criteria are almost, but not completely, satisfied.

Accordingly, Study 1 closes with a **strong but bounded recognition claim**, not a universal phase-transition claim.

---

## 18. Study 1 completion state （日本語の要点）

Scientific stages:

- Stage A — D3 independent replication: **complete**
- Stage B — depth/search-profile mechanism analysis: **complete**
- Stage C — final recognition scope: **complete**
- Stage D — machine definition / vocabulary: **complete**
- Stage E — final integration: **complete**

Repository workflow is separate from scientific completion.

PR #26 must remain **open / draft / unmerged** until explicit user instruction.
