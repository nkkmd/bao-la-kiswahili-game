# PBAI-C005 — Read-Only Production-Surface Semantics Audit

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
Candidate: `PBAI-C005` — Evaluation Semantics Sanitation  
Audit source `main`: `7f3ea339f7eec0668c641774eb6c2dcd37040a38`  
Scientific evidence cutoff: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
Baseline: `AI-GEN2-BASELINE-2026-08-26-v1`  
Status: **COMPLETE / NO ACTIONABLE CURRENT PRODUCTION SEMANTICS DEFECT**

## 1. Audit question

This audit was intentionally read-only. It asked whether the current public Bao product, code, diagnostics or current technical documentation presents the engine evaluation score as any of the following:

```text
validated Bao win probability
win rate / winning chance
calibrated probability
confidence probability
```

or otherwise violates the formal interpretation boundary of Position Evaluation / Win-Rate Calibration Study 1.

No C005 implementation was authorized before this audit.

## 2. Scientific boundary preserved

Position Evaluation / Win-Rate Calibration Study 1 remains:

```text
FORMAL DECISION = INCONCLUSIVE
```

The following distinction remains binding:

```text
engine evaluation
!= validated Bao win probability
!= game-theoretic winning probability
!= human perception of advantage
```

The completed study found that static `bao` evaluation is actor-relative and not intrinsically probabilistic. Its exploratory isotonic mapping was not formally validated because Stage 2 estimability gates failed. PBAI-C005 does not revise or rescue that result.

## 3. Production surfaces inspected

Minimum required public surfaces were inspected at the audit source commit:

```text
public/index.html
public/main.js
public/ai.js
public/ai-config.js
public/diagnostics.js
public/ai-worker.js
```

Additional current public diagnostic surfaces were also inspected because they are loaded by `public/index.html`:

```text
public/review-suggestion.js
public/diagnostic-download.js
```

Documentation inspected:

```text
doc/AI_DEVELOPMENT_LOG.md
doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md
doc/position-evaluation-calibration/DECISION_REGISTER.md
doc/position-evaluation-calibration/TECHNICAL_SEMANTICS_AUDIT.md
```

## 4. Baseline identity check

The current `main` public engine and AI blobs matched the frozen baseline source blobs. Therefore the frozen public-source SHA-256 identities remain applicable:

```text
public/engine.js
SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c

public/ai.js
SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

No C005 code had been merged or activated before the audit.

## 5. User-facing public UI finding

`public/index.html` contains difficulty selection, gameplay/status text, rules/help and AI-improvement diagnostics. It does not display an engine evaluation score, win percentage, winning chance, probability or confidence value.

The AI-review panel explicitly frames its output as a machine-generated investigation candidate rather than a declaration that a move is bad.

Result:

```text
user-facing score -> win-probability semantics = NOT PRESENT
```

## 6. Diagnostics finding

`public/diagnostics.js` exports a strict allow-list of search statistics including elapsed time, nodes, quiescence nodes, completed depth, timeout state and evaluation-call counters.

`stats.rootScore` is not in the exported diagnostic `STAT_FIELDS` allow-list. Therefore the normal diagnostic JSON path does not publish the search root score to the user.

`public/diagnostic-download.js` only saves the already-created diagnostic JSON and does not reinterpret numerical values.

Result:

```text
diagnostic score -> win-probability semantics = NOT PRESENT
```

## 7. `score`-named internal values

Several internal variables contain the word `score`, but none constitute the prohibited production semantics.

### 7.1 Engine evaluation / search scores

`public/ai.js` contains heuristic evaluation values and search values, including `rootScore`. These values are used internally for move ranking/search and are not labeled or converted to win probability in the public product.

The function `normalizedScore()` applies `tanh(evaluator / 400)` for historical MCTS reward normalization. This is an internal bounded numerical transform, not a calibrated probability mapping. MCTS is not the current public-default hard/expert path.

### 7.2 Review suggestion score

`public/review-suggestion.js` uses `analysis.score` as a simple weighted sum of machine audit signals such as timeout, shallow depth, capture-option increase and immediate loss. It is used only to decide whether to recommend saving a position for later review.

It is not the engine evaluation score, a confidence value or a win probability.

### 7.3 Complexity score

`public/ai-config.js` contains `complexityScore()` for a historical adaptive-search helper. The current `searchOptions()` returns the base options directly, so adaptive search is not enabled by default. The complexity value is not represented as a probability.

## 8. Repository terminology search

Repository-wide searches were performed for at least:

```text
win probability
win rate
winning chance
probability
confidence
evaluation score
score
勝率
確率
```

For the current `public/` surface, the following prohibited/ambiguous probability terminology had zero code-search hits:

```text
probability = 0
win rate = 0
winning chance = 0
confidence = 0
勝率 = 0
確率 = 0
evaluation score = 0
```

The broad term `score` occurs in internal code as expected. Repository-level uses of win-rate/probability terminology are primarily research constructs, benchmark outcomes or explicit interpretation boundaries. In particular, `doc/AI_DEVELOPMENT_LOG.md` uses win rate for observed AI-vs-AI match results, not as a conversion from engine evaluation score.

## 9. Audit decision

No concrete current production semantics defect was identified.

```text
PBAI-C005 audit finding
= NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT

code correction required = false
candidate contract required = false
implementation authorization = false
implementation created = false
validation execution = false
release holdout execution = false
public adoption = false
AI-GEN3 promotion = false
```

Creating a code change solely to consume the candidate inventory would introduce unnecessary public-surface change without a demonstrated defect. That would be contrary to the prospective PBAI-P1 decision rule.

## 10. Candidate disposition

The correct engineering disposition is:

```text
PBAI-C005
= NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
= CLOSED WITHOUT IMPLEMENTATION
```

This is not evidence that a future public surface can safely expose evaluation as probability. The standing prohibition remains:

```text
engine score -> validated Bao win probability = NOT AUTHORIZED
```

Any future public score/probability feature would require a new prospective engineering candidate and evidence appropriate to that new surface.

## 11. Program implication

C005 was the final undisposed candidate in the original PBAI-P1 candidate inventory. After this closure:

```text
original candidate inventory remaining = 0
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
PBAI-P1 public releases = 0
```

Therefore PBAI-P1 can close with:

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
AI-GEN3 = NOT PROMOTED
```

No validation or release holdout is required because there is no surviving release candidate to validate or adopt.
