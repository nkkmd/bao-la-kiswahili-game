# CURRENT_STATUS — Tactical Motif Human / Expert Validation Study 1 （日本語の要点）

## 日本語での要点

formal decisionはINCONCLUSIVE-NOT-ESTIMABLE (N=0)で、人間側のnegative resultではない。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-18

## Current state （日本語の要点）

**STUDY 1 COMPLETE — MACHINE/INSTRUMENT STAGE COMPLETE / HUMAN AXIS `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`**

The machine/instrument side of the study was completed through exact formal stimulus freeze. The human-facing phase was not launched because, before scientific recruitment began, the independent investigator reported no feasible current route to contact qualified Bao experts, researchers, or competitive players for the already frozen primary expert cohort.

This is not a failed recruitment campaign and not a negative human result. Scientific recruitment was never started and formal human responses collected = `0`.

## Repository baseline （リポジトリ状態）

Study-start `main` HEAD:

`3cc40d83917660dd815c785ff0e0c754666d9a0e`

Study branch:

`research/tactical-motif-human-validation`

## Historical evidence boundary （適用範囲と制限）

Immutable Tactical Motifs Study 1 decisions remain:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

C03 machine evidence remains `CONFIRMED` regardless of the present human-axis non-estimability.

Final evidence state:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

## Stage 1 machine execution （Stageの記録）

Stage ID:

`TMHV-S1-STIMULUS-2026-08-17-v1`

Frozen population:

```text
games = 1536
seeds = 22100001..22101536
six generation strata × 256
first 8 plies = seeded-uniform exact E.moveVariants
max ply = 100
no extension / no replacement
```

Stage 1 spec SHA-256:

`c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`

Generation:

- games generated: `1536 / 1536`
- unique historical trajectories: `1453`
- distinct opening prefixes: `1278`
- source tree dirty: `false`
- generation summary hash: `6af30d6827e36a0c8a9ba0a4856b2e590da98bab0021111ba014655ffd85e581`

Independent verification:

- `passed = true`
- `fullSearchRecomputation = true`
- games verified: `1536`
- mismatch count: `0`
- verification identity hash: `225e603e5fc60970901c89431a0155a83ffad2ed1de0ede83941cd2fc955c397`

## Stage 1 stimulus pool （Stageの記録）

Class counts:

```text
C03_TARGET = 687
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

Matched counts:

```text
P_ONLY     = 277
M_ONLY     = 605
MORPH_NEAR = 672
```

All ten frozen readiness gates passed. No replacement and no control reuse were performed.

Pool hash:

`6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

## Compact artifact audit （証拠と成果物）

Audit ID:

`TMHV-S1-ARTIFACT-AUDIT-2026-08-17-v1`

Bundle SHA-256:

`88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`

All 1,554 stored target-control matches passed independent recurrence/matching audit.

## Exact formal machine stimulus freeze （日本語の要点）

Freeze ID:

`TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`

Selection-spec SHA-256:

`67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5`

Private exact freeze SHA-256 commitment:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

Formal set:

```text
primary blocks              = 12
primary positions           = 36
primary C03 targets         = 24
primary controls            = 12
P_ONLY / M_ONLY / MORPH_NEAR controls = 4 / 4 / 4
secondary move-choice C03   = 6
total unique formal states  = 42
```

All 42 formal positions passed unique rule-state / historical-trajectory / opening-prefix constraints. Exact identities remain private and were not reselected after materialization.

## Stage 2A recruitment-feasibility closure （結論）

Stage ID:

`TMHV-S2A-RECRUITMENT-FEASIBILITY-2026-08-18-v1`

Study mode:

`independent-research-without-institutional-affiliation`

Operational access state at closure:

```text
accessible eligible experts = 0
scientific recruitment authorized = false
scientific recruitment started = false
persons contacted for scientific recruitment = 0
consented participants = 0
included primary experts = 0
formal human responses = 0
```

The frozen minimum included primary expert count remained `10` and was not relaxed.

Estimability gate:

```text
required included primary experts = 10
observed included primary experts = 0
gate passed = false
```

Formal human statistical inference was therefore not performed.

Final human-axis decision:

> **INCONCLUSIVE-NOT-ESTIMABLE (N=0)**

Reason code:

`ZERO-ACCESSIBLE-ELIGIBLE-EXPERT-COHORT-PRECOLLECTION`

No human p-value, participant-level score distribution, or median primary score exists.

## Ethics/data-governance closure （結論）

No institutional ethics approval or exemption is claimed.

No human-facing scientific procedure was initiated:

- no scientific recruitment;
- no consent execution;
- no identifiable participant data;
- no formal human response.

This closure does not imply that a future human study would not require its own applicable ethics determination.

## Interpretation boundary （適用範囲と制限）

The final result does **not** authorize any conclusion that experts accepted or rejected C03.

Zero participants are not negative human evidence.

Not authorized:

- `HUMAN-EXPERT-VALIDATED`;
- `NOT-HUMAN-EXPERT-VALIDATED`;
- traditional-tesuji claim;
- pedagogical claim;
- substitution of novices/general users for experts;
- substitution of AI for human experts.

## No-rescue （適用範囲と制限）

The study was not rescued by:

- lowering the expert minimum below 10;
- relaxing expert eligibility;
- extending/replacing the machine corpus;
- reselecting the frozen 42 positions;
- treating N=0 as a negative human outcome.

## Canonical closure records （結論）

- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`
- `STAGE_2A_RECRUITMENT_FEASIBILITY_CLOSURE.md`
- `STAGE_1_ARTIFACT_AUDIT.json`
- `STAGE_1_FORMAL_STIMULUS_FREEZE_AUDIT.json`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`

## Future-work boundary （適用範囲と制限）

If qualified expert access becomes feasible later, this closed Study 1 is not retroactively rewritten. Future human validation requires a new prospective independent study or an explicitly prospective, versioned reopening established before any new human response.
