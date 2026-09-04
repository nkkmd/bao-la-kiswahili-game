# REPRODUCIBILITY_INDEX — Critical Positions / Outcome Branching Study 1 （再現性）

## 日本語での要点

promotion candidateは0件で、Stage 2はNOT-AUTHORIZED-NOT-EXECUTEDである。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-24  
Status: **STUDY 1 CLOSED / STAGE 1 EXPLORATORY COMPLETE / STAGE 2 NOT EXECUTED**

## Repository baseline （リポジトリ状態）

```text
repository = nkkmd/bao-la-kiswahili-game
verified main baseline = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
baseline tree = 766eb3dea312669feec12f22ebe405b9d3bba78a
branch = research/critical-positions-outcome-branching
```

## Frozen scientific identities （日本語の要点）

```text
studyId = CPOB-STUDY1
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
authorization SHA-256 = 34ae3f2afb066521f2165f6e16d5edd720ab9587b71c64dce677696ad23cd941
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
discovery embedded resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
uploaded discovery artifact SHA-256 = e1931c0f84b294bf8201e7732756bf156d688e4a38d55587e61b7303848d5024
```

## Source implementation freeze （日本語の要点）

Final source-changing scientific implementation before authorization:

```text
3995932ae73e9e99a27d4143de4e359db1136060
```

Authorization commit:

```text
a85f9b36abbf492cd8085b0a95c8d10b76f849e8
```

Post-authorization documentation checkpoint used as sourceCommit in generated manifest:

```text
157a4947435213b430ae7a9a85cc861aebfc258e
sourceTreeDirty = false
```

Scientific tooling included:

```text
public/engine.js
public/ai.js
public/ai-weights.js
tools/benchmark.js
tools/experiments/lib/position-typology-features.js
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/lib/critical-positions-outcome-branching.js
tools/experiments/lib/critical-positions-stage1-corpus.js
tools/experiments/lib/critical-positions-stage1-discovery.js
tools/experiments/run-critical-positions-stage1-exploratory.js
tools/experiments/verify-critical-positions-stage1-exploratory.js
```

Exact-root diagnostic semantics:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

## Identity model （識別と表現）

Source/root provenance:

```text
historicalStateHash
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
generationStratum
rootPly
rootActor
```

Exact move identity:

```text
AI.moveKey(E.moveVariants(root)[i])
```

Stage 1 selection collapsed duplicate historical trajectories and duplicate selected rule states prospectively before quota. All final selected roots were unique on historical trajectory and rule state.

## Seed model （日本語の要点）

```text
Stage 0 scientific source seeds = none
Stage 1 source seeds = 22600001..22603072 / CONSUMED
Stage 2 reserved seeds = 22700001..22706144 / NEVER AUTHORIZED / UNCONSUMED
```

Continuation replicate RNG is deterministically derived from stage salt + root identity + replicate index. These values are nested measurement RNG seeds and do not enlarge the source-game population.

## Stage 1 source corpus （Stageの記録）

```text
games = 3072
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
summaryHash = 1a56b7afb8c6c295f827c0546a87e9c2b0788914bffd1587b47f0d778bf73d63
```

Independent corpus verification:

```text
gamesVerified = 3072
fullCorpusReplay = true
passed = true
```

## Stage 1 root selection （Stageの記録）

```text
selected roots = 600
Namua = 300
Mtaji = 300
selected distinct opening prefixes = 567
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
replacementPerformed = false
phaseReassignmentPerformed = false
```

## Stage 1 measurement （Stageの記録）

Frozen continuation:

```text
policy = P1_NORMAL_TOP3
replicates per exact legal root move = 64
maximum post-root continuation plies = 200
highDivergence = D_range >= 0.30
```

Measurement result:

```text
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
```

Independent verification:

```text
rootsReselectedIndependently = 600
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
passed = true
```

## Stage 1 discovery （Stageの記録）

Local large artifact:

```text
artifacts/local/critical-positions-outcome-branching/stage1-exploratory-v1/discovery-result.json
```

Uploaded copy used for closure audit:

```text
raw SHA-256 = e1931c0f84b294bf8201e7732756bf156d688e4a38d55587e61b7303848d5024
embedded resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
```

Top-level discovery result:

```text
selectedRoots = 600
primaryEstimableRoots = 600
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
zeroPromotedCandidatesAllowed = true
manualOverridePerformed = false
```

Descriptive high-divergence counts derived from the disjoint single-token legal-move-count partitions:

```text
Namua = 52 / 300
Mtaji = 87 / 300
overall = 139 / 600
```

## Compact repository artifacts （証拠と成果物）

```text
results/STAGE_0_TECHNICAL_RESULT.json
results/STAGE_1_EXPLORATORY_SUMMARY.json
checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md
STUDY_1_OVERVIEW.md
STUDY_1_FINAL_REPORT.md
CURRENT_STATUS.md
```

Large source games, selected-root payloads, per-root measurements and the full 1,183-candidate discovery audit remain under `artifacts/local/` and are not committed as repository-scale results.

## Final reproducibility boundary （再現性）

Stage 1 demonstrates reproducible **machine-defined, policy-conditioned empirical continuation divergence**. It does not establish game-theoretic probabilities, human/expert criticality, or validated score-to-probability conversion.

No Stage 2 data were generated. Because Stage 1 yielded zero promoted candidates, no candidate mapping existed for a prospectively frozen Stage 2 formal study. Any alternate grammar/classifier requires a new prospective independent study and fresh evidence.
