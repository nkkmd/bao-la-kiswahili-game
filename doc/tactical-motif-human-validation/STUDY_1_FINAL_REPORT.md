# Tactical Motif Human / Expert Validation — Study 1 Final Report （結論）

## 日本語での結論と読み方

formal decisionはINCONCLUSIVE-NOT-ESTIMABLE (N=0)である。適格なexpert recruitment経路を確保できず、人間がC03を認識しないというnegative resultではない。

以下には、Study closure時に固定した英語の詳細記録が含まれる。canonical decision token、数値、seed、hash、実行ID、authorization、evidence boundaryを再解釈しないため原文を保持している。初めて読む場合は`STUDY_1_OVERVIEW.md`と`CURRENT_STATUS.md`を先に参照する。

Updated: 2026-08-18  
Study ID: `TMHV-STUDY1`  
Final status: **COMPLETE — MACHINE/INSTRUMENT STAGE COMPLETE; HUMAN AXIS INCONCLUSIVE-NOT-ESTIMABLE (N=0)**

## 1. Research question （日本語の要点）

This prospective independent study asked whether the machine-confirmed tactical motif `TM-S2-C03` from Tactical Motifs / Tesuji Study 1 would also be recognized by qualified human Bao experts as a transferable move principle across distinct positions.

Historical machine evidence was imported without redefinition:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

The present study was not designed to rescue, overturn, or reinterpret those machine decisions.

## 2. Confirmatory human construct （日本語の要点）

The planned primary human construct was blinded cross-position principle discrimination.

Each formal primary block was prospectively defined as:

```text
C03 target A
C03 target B
matched non-C03 control
```

The participant would select the pair believed to share the same reusable move principle. Chance correctness per block is `1/3`.

The participant, not the individual block, was the planned primary inferential unit.

## 3. Frozen expert and estimability requirements （日本語の要点）

The primary expert cohort required the previously frozen eligibility rules in `EXPERT_ELIGIBILITY.md`.

Formal estimability required:

```text
minimum included primary experts = 10
planned primary blocks / expert = 12
minimum usable primary blocks / included expert = 10
```

The planned participant-level success definition was `primaryScore > 0.5`, with a one-sided exact binomial test against prevalence 0.5 and an additional median-score gate `>=2/3` for positive human validation.

These criteria were never relaxed.

## 4. Stage 1 machine/instrument development （Stageの記録）

### 4.1 Fresh machine population （日本語の要点）

Stage ID:

`TMHV-S1-STIMULUS-2026-08-17-v1`

Population:

```text
games = 1536
seeds = 22100001..22101536
six generation strata × 256
first 8 plies = seeded-uniform exact legal moves
max ply = 100
no extension / no replacement
```

Stage 1 spec SHA-256:

`c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`

### 4.2 Generation and independent verification （日本語の要点）

Generation completed for all 1,536 fixed games.

Independent full replay/search verification result:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 1536
mismatchCount = 0
```

Verification identity hash:

`225e603e5fc60970901c89431a0155a83ffad2ed1de0ede83941cd2fc955c397`

### 4.3 Prospective target/control pool （日本語の要点）

Observed class counts:

```text
C03_TARGET = 687
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

Matched control counts:

```text
P_ONLY     = 277
M_ONLY     = 605
MORPH_NEAR = 672
```

All ten frozen readiness gates passed. No replacement and no control reuse were performed.

Pool hash:

`6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

### 4.4 Artifact audit （証拠と成果物）

The compact Stage 1 artifact bundle passed identity/integrity audit.

Bundle SHA-256:

`88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`

All 1,554 stored target-control matches were independently checked with zero same-trajectory violations, zero same-opening-prefix violations, zero duplicate target/control reuse within family, and zero matching-cost violations above the frozen maximum.

### 4.5 Exact formal machine stimulus freeze （日本語の要点）

Freeze ID:

`TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

Selection-spec SHA-256:

`67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5`

The exact formal machine stimulus set was deterministically materialized as:

```text
primary blocks = 12
primary positions = 36
primary C03 targets = 24
primary controls = 12
P_ONLY / M_ONLY / MORPH_NEAR controls = 4 / 4 / 4
secondary move-choice C03 targets = 6
total unique formal positions = 42
```

All 42 formal positions have unique rule states, historical trajectories, and opening prefixes under the frozen constraints.

Private freeze SHA-256 commitment:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

Exact board states and participant SVGs remain private to avoid pre-collection contamination and are not committed to public Git.

## 5. Human recruitment feasibility closure （結論）

The study was conducted as independent research without institutional affiliation.

Before scientific recruitment began, the investigator determined that there was currently no feasible route to contact qualified Bao experts, researchers, or competitive players for the frozen primary cohort.

Operational state at closure:

```text
accessible eligible experts = 0
scientific recruitment started = false
persons contacted for scientific recruitment = 0
consented participants = 0
included primary experts = 0
formal human responses = 0
```

This is explicitly not described as a failed recruitment campaign because no scientific recruitment campaign was launched.

## 6. Final human-axis decision （結論）

Because the frozen minimum included expert count was 10 and the observed accessible cohort was 0, the human endpoint was not estimable.

Final human-axis decision:

> **INCONCLUSIVE-NOT-ESTIMABLE (N=0)**

Reason:

`ZERO-ACCESSIBLE-ELIGIBLE-EXPERT-COHORT-PRECOLLECTION`

No formal human statistical test was performed. There is no human p-value, no participant score distribution, and no median primary score.

## 7. Interpretation （解釈）

The study established that a machine-confirmed Bao tactical motif can be taken through a rigorous prospective machine-to-human validation pipeline up to the point of a blinded, exact, non-reused formal stimulus set.

It did **not** establish whether qualified human experts recognize C03 as a transferable tactical motif, because no qualified expert observations were collected.

Therefore:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
```

is the correct final evidence state.

Zero participants are not negative human evidence.

## 8. Claims not authorized （日本語の要点）

This study does not authorize claims that:

- human experts validate C03;
- human experts reject C03;
- C03 is or is not a traditional tesuji;
- C03 is pedagogically useful;
- non-experts can substitute for experts;
- AI can substitute for human expert evidence.

## 9. Ethics/data-governance boundary （適用範囲と制限）

No institutional ethics approval or exemption is claimed.

Because the study closed before human-facing research began:

- no scientific recruitment was initiated;
- no consent procedure was executed;
- no identifiable participant data were collected;
- no human responses were collected.

This closure does not imply that ethics review would be unnecessary in a future human study.

## 10. No-rescue and future-work boundary （適用範囲と制限）

The human endpoint was not rescued by lowering the minimum sample, weakening expert criteria, substituting general users, substituting AI, or changing the frozen stimuli.

If qualified expert access becomes available later, the new work must be a new prospective study or an explicitly prospective versioned reopening established before new human responses.

The historical Study 1 result remains:

```text
TM-S2-C03 machine decision = CONFIRMED
TMHV Study 1 human axis = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
```

## 11. Canonical records （日本語の要点）

- `CURRENT_STATUS.md`
- `STAGE_1_ARTIFACT_AUDIT.json`
- `STAGE_1_FORMAL_STIMULUS_FREEZE_AUDIT.json`
- `STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`
- `STAGE_2A_RECRUITMENT_FEASIBILITY_CLOSURE.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`
