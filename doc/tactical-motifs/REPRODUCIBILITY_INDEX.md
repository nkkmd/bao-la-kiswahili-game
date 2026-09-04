# Reproducibility Index — Tactical Motifs / Tesuji Study 1 （再現性）

## 日本語での要点

TM-S2-C03だけがCONFIRMEDで、残る3候補はNOT-CONFIRMEDである。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-15

## Study status （日本語の要点）

**CLOSED / COMPLETE**

## Stage 1 exploratory identity （Stageの記録）

- Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`
- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`
- discovery-result SHA-256: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- candidate-freeze SHA-256: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`
- verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`

Local artifact root:

`artifacts/local/tactical-motifs/stage1-exploratory-v1/`

## Stage 2 formal identity （Stageの記録）

- Stage ID: `TM-S2-FORMAL-2026-08-14-v1`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- formal spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`
- verification identity hash: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- result-core hash: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`
- uploaded/local result artifact SHA-256: `f13f5a87464a5c8b360695977edc5fca4348f438fbf20c4bd5be682ed80d4dd4`

Local artifact root:

`artifacts/local/tactical-motifs/stage2-formal-v1/`

## Stage 2 source provenance （Stageの記録）

Generation source commit:

`3082cd2132cdd572e43f5f78e8d662271a9ed492`

Measurement source commit:

`e6f5e9528d523e7710a953020b1719abf60a26e8`

Evaluation source commit:

`d41b061067ab2e5dbe65294d3860586d9d3c1454`

All recorded source trees were clean. Scientific source-file SHA-256 values matched the active source-hash-bound authorization.

## Stage 2 compact artifacts （Stageの記録）

Expected local compact artifacts:

```text
manifest.json
verification.json
selection-audit.json
measurement-manifest.json
stage2-formal-result.json
```

Large `games/` and `measurements/` directories remain local and are not committed.

## Key repository documents （リポジトリ状態）

### Study overview / integration （概要）

- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `STAGE_2_FORMAL_RESULT.md`
- `CURRENT_STATUS.md`
- `README.md`

### Scientific contract （日本語の要点）

- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- `preregistration/STAGE_2_FORMAL_CANDIDATES.json`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`

### Protocol / execution （方法と設計）

- `STAGE_0_TECHNICAL_AUDIT.md`
- `STAGE_1_EXPLORATORY_PROTOCOL.md`
- `STAGE_1_EXECUTION_RUNBOOK.md`
- `STAGE_2_FORMAL_PROTOCOL.md`
- `STAGE_2_EXECUTION_RUNBOOK.md`

### Stage 1 result （結果）

- `STAGE_1_EXPLORATORY_RESULT.md`
- `STAGE_1_CANDIDATE_FREEZE.json`

### Scientific governance （日本語の要点）

- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`

## Final formal decisions （結論）

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

Only C03 supports the machine-reproducible transferable tactical-motif claim under the frozen Study 1 operationalization.
