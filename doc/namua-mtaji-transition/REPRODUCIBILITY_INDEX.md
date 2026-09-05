# Namua→Mtaji Strategic Temporal Transition — Reproducibility Index （再現性）

## 日本語での要点

formal decisionはNOT-CONFIRMEDで、CBEとMtaji morphologyの普遍的な時間接続は確認していない。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

更新日: 2026-08-12  
Status: **CLOSED / Study 1 reproducibility record**

## 1. Purpose （日本語の要点）

This document is the reproducibility and provenance index for:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

It records the frozen protocol/spec, source identity, formal corpus identity, preoutcome matching identity, outcome unlock, frozen classifier identity, analysis tooling, and expected local artifact locations.

The large generated corpus remains under `artifacts/local/` and is gitignored. It is not committed to the repository.

## 2. Canonical scientific documents （日本語の要点）

```text
doc/namua-mtaji-transition/STUDY_1_OVERVIEW.md
doc/namua-mtaji-transition/STUDY_1_FINAL_REPORT.md
doc/namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md
doc/namua-mtaji-transition/CURRENT_STATUS.md
```

Formal design:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_PROTOCOL.md
doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json
doc/namua-mtaji-transition/STAGE_2_RUNBOOK.md
```

Outcome firewall:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

## 3. Frozen source identity （識別と表現）

Formal generation source commit:

```text
b0e04a1c53d9c4d982a37c9489f3b56d9e6282ca
```

The formal generation manifest recorded:

```text
sourceTreeDirty = false
node = v24.6.0
platform = linux
arch = x64
```

Formal input config hash:

```text
9485ef557e3ee00e3719e754c4ed202ca408a2bd0866a9f596896046406a17c3
```

Formal instrumentation hash:

```text
fc8ebad0d26fd501a116e78c14e82aa416c06b3b00aa34a9bb722df0a34d0f23
```

## 4. Frozen formal spec identity （識別と表現）

Formal spec path:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json
```

SHA-256 used by the formal analysis:

```text
92d763e2ae9a1c05c414946bb9425b00f3865eed0dfcd6cf65aa7a20a57574bc
```

Formal corpus:

```text
condition = P2-D2
level = hard
evaluator = bao
search = phase2
maxDepth = 2
games = 4096
opening seeds = 20280001..20284096
opening policy = seeded-uniform-legal
opening plies = 8
max ply = 100
```

## 5. Frozen inherited definitions （日本語の要点）

CBE:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Category A:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
```

Frozen Mtaji candidate definition:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Historical local artifact path:

```text
artifacts/local/position-typology/stage1-pilot-v1/
  mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

This artifact must not be regenerated, refit, restandardized, or relabeled for reproduction of this study.

## 6. Formal local artifact root （証拠と成果物）

```text
artifacts/local/namua-mtaji-transition/stage2-formal-v1/
```

Expected key artifacts:

```text
manifest.json
verification.json
clock-audit.json
candidate-pipeline-audit.json
stage2-event-audit.json
stage2-event-table.csv
stage2-matching-audit.json
stage2-matched-sets-preoutcome.csv
mtaji-artifact-audit.json
stage2-matched-sets-with-morphology.csv
stage2-formal-result.json
```

The generated per-game corpus under this local root remains gitignored.

## 7. Aggregate corpus identity （識別と表現）

From the frozen formal manifest:

```text
games-summary.json
sha256 = 83adc8ca40e07fd2212dea71e98ba9af64f1b94b97533c4b256a6664015b9b6c
records = 4096

legacy-observations.jsonl
sha256 = b2d4c073d5ae4a85c1481159c14eceaf38dece64806ee1eeaeeae05640f80ffb
records = 227040
```

Summary hash:

```text
c4b3e7a460ab10d1f43e6cb273924cf8b3420e71dcb1ca73abd071d511ab430a
```

Observed corpus summary:

```text
games = 4096
observations = 227040
unique historical trajectories = 2874
duplicate historical trajectory groups = 615
largest trajectory group = 21
reached Mtaji games = 3886
first-Mtaji morphology-eligible games = 3885
terminal before Mtaji games = 210
administrative truncation games = 3
```

## 8. Verification identity （識別と表現）

Full verification result:

```text
passed = true
legal moves checked = 977285
legacy compatibility checks = 227040
phase transition events = 3886
opening seeds verified = 4096
source hashes match = true
```

Passed checks:

```text
fullReplay
storedObservationRecomputation
legacyPhaseTransitionCompatibility
moveLegality
beforeAfterStateIdentity
phaseMonotonicity
phaseEventLinkage
firstMtajiReserveExhaustion
temporalOutcomeRecomputation
trajectoryHash
formalSeedRange
singleFormalCondition
aggregateLegacyView
aggregateGameSummary
summaryRecomputation
sourceProvenance
```

## 9. Deterministic clock identity （識別と表現）

```text
reached Mtaji games = 3886
firstMtajiPly 44 = 3886
terminal before Mtaji = 210
violations = 0
```

Permanent interpretation:

```text
candidate-to-Mtaji distance = deterministic clock distance
not survival time
```

## 10. Event and preoutcome identities （結果）

Stage 2 event table SHA-256:

```text
84e80ce832e5f10c627f4fb09d906adaf201ecd1350b7764624b973af4af8d82
```

Event counts relevant to CBE:

```text
raw Namua CBE rows = 37
fully ascertained Namua CBE rows = 37
unique earliest-CBE historical trajectories = 31
morphology-eligible unique exposed trajectories = 30
```

Matching assignment hash:

```text
b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1
```

Preoutcome assignment CSV SHA-256:

```text
bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374
```

Preoutcome structure:

```text
matched sets = 30
20 controls per exposure
unique control trajectories = 600
control reuse = 0
progression violations = 0
G1 = PASS
G2 = PASS
morphologyLabelsRead = false
frozenMtajiClassifierLoaded = false
```

## 11. Outcome unlock identity （結果）

Unlock path:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

Unlock commit:

```text
afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
```

Unlock file SHA-256 observed by formal evaluation:

```text
b0d9f7832b565a2f558bb7c86514768f1b8c525719ab3a4deaf508cbf62ac271
```

The unlock binds exactly:

```text
inputConfigHash
formalSourceCommit
matchingAssignmentHash
preoutcomeAssignmentCsvSha256
formalSpecSha256
eventTableSha256
```

## 12. Outcome artifact identity （結果）

Morphology assignment CSV SHA-256:

```text
961f5ef1c08447331642f10dbd4b67b9166f443a5909855ca2ac8ae38fe5e592
```

Post-evaluation audit:

```text
rows = 630
matched sets = 30
firstMtajiPly = 44 for 630 / 630
M1/M2-to-Y coding mismatches = 0
preoutcome assignment columns/order changed = no
```

Primary formal result:

```text
Exposed M1/M2 = 26 / 4
Controls M1/M2 = 509 / 91
matched risk difference = +0.0183333333
MH common OR = 1.1617647059
T = 26
p_lower = 0.6873577200535744
p_upper = 0.5180837673658513
p_two_sided = 1.0
formal decision = not-confirmed
```

## 13. Frozen analysis tooling （日本語の要点）

```text
tools/experiments/run-namua-mtaji-stage2-formal.js
tools/experiments/verify-namua-mtaji-stage2-formal.js
tools/experiments/audit-namua-mtaji-stage2-clock.js
tools/experiments/extract-namua-mtaji-stage2-candidates.py
tools/experiments/analyze-namua-mtaji-stage2-events.js
tools/experiments/analyze-namua-mtaji-stage2-formal.py
tools/experiments/audit-namua-mtaji-mtaji-artifact.py
```

Manifest-recorded SHA-256:

```text
run-namua-mtaji-stage2-formal.js
bf5da636a1e36091d21a8027a453611b662e8f99500f3c6dad37ef2b2c2e66df

verify-namua-mtaji-stage2-formal.js
a537746cff0bce302c83271105e422bd2071f1b16857e71e1eab56862aeb38a5

audit-namua-mtaji-stage2-clock.js
08321468e1b4f5f1152b5aa3d03023ce2bbe9b667e4102ce2358de69a83e096d

extract-namua-mtaji-stage2-candidates.py
1ecbf60c00c3445edfb4a9d12a6651f362cb26175b3cadc90849b119953e9316

analyze-namua-mtaji-stage2-events.js
61af6d6307099ea686aa69b5807a8da15e2d345a58658b5d679cb31375aaf7b9

analyze-namua-mtaji-stage2-formal.py
2cfa9c2228c326543d26b3f0ee99ddc727d8a88fba106a9482d79b503b323ab9

audit-namua-mtaji-mtaji-artifact.py
f4dffc6da11e93d0358aef20f9674115d414ff33fe94defa0426a9aa57c2a3a2
```

## 14. Execution sequence （日本語の要点）

The completed formal execution sequence was:

```bash
node tools/experiments/run-namua-mtaji-stage2-formal.js
node tools/experiments/verify-namua-mtaji-stage2-formal.js
node tools/experiments/audit-namua-mtaji-stage2-clock.js
python3 tools/experiments/extract-namua-mtaji-stage2-candidates.py
node tools/experiments/analyze-namua-mtaji-stage2-events.js
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

Then a hard stop and independent preoutcome review occurred.

After the exact unlock commit was pulled:

```bash
python3 tools/experiments/audit-namua-mtaji-mtaji-artifact.py \
  --no-smoke-classification \
  --output artifacts/local/namua-mtaji-transition/stage2-formal-v1/mtaji-artifact-audit.json

python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase evaluate
```

## 15. Reproduction boundary （適用範囲と制限）

A reproduction of the already-frozen result must not be converted into a new inferential run by changing:

- seed range;
- game count;
- condition;
- CBE/Category-A thresholds;
- control ratio;
- comparator definition;
- Mtaji classifier;
- subgroup selection;
- primary test.

Any run with such changes is a new study or exploratory analysis, not a reproduction of this formal result.

## 16. Local artifact policy （証拠と成果物）

`artifacts/local/` remains gitignored.

Do not commit the 4096-game corpus or local morphology assignments to the repository unless a separately designed archival policy explicitly authorizes it. The repository preserves protocols, hashes, tooling, formal decisions, and reproducibility identities without treating generated local data as source code.
