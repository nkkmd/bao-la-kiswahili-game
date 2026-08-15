# Tactical Motifs / Tesuji Study 1

## 研究題目

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## 状態

**CLOSED / COMPLETE**

Stage 0 technical validation、Stage 1 prospective exploratory discovery、Stage 2 fresh prospective formal confirmationまで完了しました。

Final Stage 2 decisions:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

Study 1は、**1つのmachine-reproducible transferable tactical motifをformalに確認**して閉じています。

## 最初に読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1全体の科学的統合
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) — Stage 2 formal result
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引

## Confirmed motif — TM-S2-C03

Canonical Stage 1 rank: `5`

Canonical candidate key:

`7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`

Frozen machine definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Fresh formal corpus result:

```text
n = 1272
structural success = 1245 / 1272 = 0.978774
D3 top set = 937 / 1272 = 0.736635
D3 at-or-above median = 1106 / 1272 = 0.869497
D3 unique worst = 90 / 1272 = 0.070755
formal decision = CONFIRMED
```

Opening-prefix diversityは1,121種類、generation strataは6種類すべてに広がっています。

## Other candidates

- C01はstructural consequenceを69.44%で再現しましたが、D3 top-set率49.34%のため **NOT-CONFIRMED**。
- C02はstructural success 9.28%、D3 top-set 30.72%で **NOT-CONFIRMED**。
- C04はstructural success 41.42%、D3 top-set 31.52%で **NOT-CONFIRMED**。

Negative resultsは追加game、subset、paired-definition substitution、閾値変更、endpoint変更などで救済しません。

## Stage 1 summary

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

```text
games = 768
selected unique rule states = 715
exact move records = 3,148
raw pattern instances = 3,116,520
unique pattern keys = 323,676
detailed candidates = 105,501
promotion-gate pass = 948
promoted definitions = 8
```

The eight Stage 1 definitions form four exact support-identity pairs and remain immutable exploratory definitions.

Stage 1 discovery artifact SHA-256:

`aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

Stage 1 candidate-freeze SHA-256:

`f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`

## Stage 2 summary

Stage ID:

`TM-S2-FORMAL-2026-08-14-v1`

```text
fresh games = 3,072
seeds = 22000001–22003072
unique historical trajectories = 2,736
distinct opening prefixes = 2,220
full verification = PASS
formal measurements = 6,605
confirmed candidates = 1 / 4
```

Key hashes:

- candidates: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- spec: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- authorization: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- verification: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`
- selection: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- measurement: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- result core: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`

## Interpretation boundary

C03の`CONFIRMED`は、frozen Bao engine/search operationalizationにおける**machine-reproducible transferable tactical motif**を意味します。

以下はこのStudy 1では未確認です。

- traditional / expert-recognized tesuji
- human importance
- beginner importance
- pedagogical value
- causal strategic benefit beyond the formal construct
- other rules / engines / evaluators / search instrumentsへのgeneralization

これらは新しいprospective studyとして扱います。

## Scientific / operational documents

- `CURRENT_STATUS.md`
- `RESEARCH_PLAN.md`
- `HYPOTHESES.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`
- `STAGE_0_TECHNICAL_AUDIT.md`
- `STAGE_1_EXPLORATORY_PROTOCOL.md`
- `STAGE_1_EXECUTION_RUNBOOK.md`
- `STAGE_1_EXPLORATORY_RESULT.md`
- `STAGE_1_CANDIDATE_FREEZE.json`
- `STAGE_2_FORMAL_PROTOCOL.md`
- `STAGE_2_EXECUTION_RUNBOOK.md`
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- `preregistration/STAGE_2_FORMAL_CANDIDATES.json`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`
- `checkpoints/2026-08-15-stage2-corpus-full-verification.md`
- `checkpoints/2026-08-15-stage2-selection-estimability-pass.md`
- `checkpoints/2026-08-15-stage2-measurement-integrity-pass.md`
- `checkpoints/2026-08-15-stage2-formal-completion.md`

## Artifact policy

Large scientific artifacts remain local under:

```text
artifacts/local/tactical-motifs/stage1-exploratory-v1/
artifacts/local/tactical-motifs/stage2-formal-v1/
```

The scientific corpora and per-state/per-candidate measurements are not committed to GitHub.
