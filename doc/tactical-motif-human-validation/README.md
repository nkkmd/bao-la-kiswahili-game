# Tactical Motif Human / Expert Validation Study 1

## 研究題目

**Baoにおけるmachine-confirmed tactical motifのHuman / Expert Validation — TM-S2-C03は人間の熟練者にも手筋として認識されるか**

## 状態

**STAGE 0 COMPLETE — DESIGN COMPLETE / HUMAN DATA COLLECTION NOT STARTED**

- repository baseline: `main` `3cc40d83917660dd815c785ff0e0c754666d9a0e`
- study branch: `research/tactical-motif-human-validation`
- Stage 0 ID: `TMHV-S0-DESIGN-2026-08-16-v1`
- human recruitment: **NOT AUTHORIZED**
- human scientific data collection: **NOT STARTED / NOT AUTHORIZED**
- Stage 2 formal preregistration: **NOT YET FROZEN**

## 研究目的

Tactical Motifs / Tesuji Study 1でformalに確認された`TM-S2-C03`について、Baoの熟練者が異なるopening / trajectory由来の局面を、同じ再利用可能なmove principleとして認識するかをprospectiveに検証する。

この研究はC03を「人間にも手筋だと認めさせる」研究ではない。negative / null / heterogeneous / inconclusive resultを完全に許容する。

## Immutable historical machine evidence

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

C03 frozen machine definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Canonical Stage 1 rank: `5`  
Canonical candidate key: `7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`

Study 1のmachine confirmationは本研究のhuman outcomeにより変更しない。

## Evidence layers

本研究では少なくとも次を別軸として記録する。

1. `machine-confirmed tactical motif` — historical / immutable
2. `human-recognized transferable tactical motif` — 本研究の対象
3. `expert-recognized tesuji` — label-based secondary construct
4. `traditional tesuji` — 本研究では判定しない
5. `pedagogically useful tesuji` — 本研究では判定しない

## Confirmatory center

Primary constructは**blinded cross-position principle discrimination**とする。

異なるopening prefix / historical trajectory由来のC03局面を、matched decoy/controlよりも一貫して「同じ再利用可能なmove-selection principle」として識別できるかをparticipant-levelで評価する。

単一局面でのC03 matching move選択は重要だが、transferability recognitionを直接測らないためsecondaryとする。

## Stage構成

- **Stage 0** — repository / construct / feasibility / ethics / statistics audit。human dataなし。
- **Stage 1** — fresh machine stimulus pool、matching、renderer/questionnaire、identity audit、non-scientific dry run。formal human endpointへのpilot再利用なし。
- **Stage 2** — participant/stimulus/endpoint/test/exclusion/stopping/no-rescueをmachine-readableにfreeze後、初めてformal human data collectionを開始。

## 最初に読む

- `CURRENT_STATUS.md`
- `RESEARCH_PLAN.md`
- `CONSTRUCT_REGISTER.md`
- `EXPERT_ELIGIBILITY.md`
- `STIMULUS_AND_BLINDING_PLAN.md`
- `STATISTICAL_ANALYSIS_PLAN.md`
- `ETHICS_AND_DATA_GOVERNANCE.md`
- `STAGE_0_TECHNICAL_AUDIT.md`
- `DECISION_REGISTER.md`

## Data boundary

個人識別可能なparticipant data、contact information、raw free textはpublic GitHubへcommitしない。`artifacts/local/`はgitignore済みだが、identifiable raw dataのdurable storageにはprivate/encrypted storageを優先する。
