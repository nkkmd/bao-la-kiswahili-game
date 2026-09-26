# G4-07 / MLGMR-STUDY1 — 現在の状態

更新日: 2026-09-27  
Program: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
状態: **`STAGE0-PASS / STAGE1-DEVELOPMENT-COMPLETE / STAGE2-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / STAGE2-EXECUTION-NOT-YET-AUTHORIZED`**

## 現在地

```text
reviewed main HEAD = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
research branch = research/g4-07-multiscale-geometry-memory-return
initial authorization review = G4-07-AUTHORIZATION-REVIEW-2026-09-26-V1
Study ID = MLGMR-STUDY1
protocol / preregistration = FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE
Stage 0 = COMPLETE / STAGE0-PASS
Stage 1 = COMPLETE / DEVELOPMENT-SUPPORT-ONLY
Stage 1 canonical run = 36247459779 / attempt 1 / success
fresh scientific seed reads = 96
Stage 1 scientific seed reads = 96
Stage 2 scientific seed reads = 0
formal scientific outcome = NOT GENERATED
Stage 2 design/source freeze review = MLGMR-STUDY1-STAGE2-DESIGN-AUTH-2026-09-27-V1
Stage 2 design/source freeze = AUTHORIZED
Stage 2 formal spec = FROZEN
Stage 2 identity firewall = FROZEN-PRE-STAGE2-FRESH
Stage 2 scientific execution = NOT YET AUTHORIZED
G4-10 depth-11 access = 0 / NOT AUTHORIZED
public AI change = false
main integration = NOT AUTHORIZED
```

## Stage 0 canonical execution

```text
run = 36238840292 / attempt 1 / success
head = 0c7cdb2b2fa83c4d97ec0d2ad27c6a5c9c22b2b5
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V3
mandatory gates = 18 / 18 PASS
production / independent exact agreement = true
artifact ID = 10905163005
fresh scientific seed reads = 0
```

詳細: `checkpoints/2026-09-26-stage-0-technical-pass.md`

## Stage 1 canonical execution

```text
run = 36247459779 / attempt 1 / success
head = cf9244d760fac807c604fef1ae9639103bfa4b31
binding = MLGMR-STUDY1-STAGE1-BINDING-2026-09-26-V1
frozen source commit = acae88384e74d9d8b7d2661adcee69d1fe1f3175
artifact ID = 10908816662
artifact ZIP SHA-256 = 65081316d7f3dc0f59b7da5a527af65c052ea33b0ab7e8e8b07d06d764f27469
STAGE_1_RESULT.json SHA-256 = 2a712105917da91c954689f42665fc248fdf16e22721e13726e7e0cfd356d196
Stage 1 identity SHA-256 = bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b
fresh scientific seed reads = 96
first / last read = 40713001 / 40713145
measured trajectories = 16 (P1 8 / P2 8)
production / independent exact agreement = true
formal inference = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

Canonical repository record:

- `results/stage-1/STAGE_1_CANONICAL_RECORD.json`

Byte-exact raw result / identity files remain pinned by artifact ID and SHA-256 in the checkpoint.

詳細: `checkpoints/2026-09-27-stage-1-development-complete.md`

## Stage 1 support-only result

24個の preregistered axis×lag slot のうち、凍結済みsupport gateを満たしたのは **16 slot**。

```text
lag 1 = 6 / 6 supported
lag 2 = 6 / 6 supported
lag 4 = 4 / 6 supported
lag 8 = 0 / 6 supported
```

lag 4でsupportedなのは A1 / A2 / A3 / A6。A4 / A5は非support。

これは **formal scientific confirmationではない**。Stage 1ではeffect directionをpromotionへ使用せず、p-value・formal confirmation labelを生成していない。

## Stage 2 authorization state

post-Stage-1 / pre-Stage-2 reviewの判定:

**`STAGE2-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / STAGE2-EXECUTION-NOT-YET-AUTHORIZED`**

認可済み:

- `prereg/STAGE_2_FORMAL_SPEC.json` のfreeze
- `prereg/STAGE_2_IDENTITY_FIREWALL.json` のfreeze
- formal inference adapter / independent cross-check実装
- Stage 2 runner実装
- GitHub Actions one-shot workflow実装
- syntax / static / source-separation検査
- frozen blob-SHA binding準備
- 最終one-shot Stage 2 execution authorizationの作成準備

未認可:

- Stage 2 fresh scientific seedのgeneration/read
- Stage 2 formal inferenceの科学実行
- workflow triggerによるscientific execution

## Stage 2 frozen formal family

Stage 1の凍結済みsupport gateだけから導出した16 slotをfixed familyとする。

```text
A1: lag 1,2,4
A2: lag 1,2,4
A3: lag 1,2,4
A4: lag 1,2
A5: lag 1,2
A6: lag 1,2,4
```

No lag-8 slot is in the formal family. A4-lag4 / A5-lag4も非familyである。Stage 1 effect directionはfamily membershipに使用しない。

## Stage 2 frozen contract

```text
seed reservation = 40723001..40724024 / 1024
candidate target = 48 per policy
minimum fully eligible = 40 per policy
measured = 32 per policy
formal measured trajectories = 64
formal family = fixed 16 slots
supporting trajectory = comparableNonzero >= 3
minimum support trajectories = 48 total / 20 per policy
minimum nonzero trajectory balances = 40
formal test = exact two-sided binomial sign test
zero trajectory balances in formal n = false
multiplicity = Holm-Bonferroni across fixed 16
family alpha = exact 1/20
NON-ESTIMABLE Holm input = exact 1
```

formal labels:

```text
PERSISTENCE-CONFIRMED
REVERSAL-CONFIRMED
NOT-CONFIRMED
NON-ESTIMABLE
TECHNICAL-INVALID
```

## Stage 2 identity firewall

Stage 2では、Stage 1までのupstream identityに加え、G4-07 Stage 1 artifactの96 identityを必須検証対象とする。

```text
Stage 1 artifact ID = 10908816662
Stage 1 identity rows = 96
Stage 1 identity SHA-256 = bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b
Stage 1 reserved namespace excluded in full = 40713001..40713512
Stage 2 reservation = 40723001..40724024
Stage 2 reservation accessed = false
```

artifact/digest/row-count/repository identity mismatchは、**Stage 2 fresh seed read前にfail-closed**する。

## No-rescue boundary

Stage 1 fresh accessは完了したため、以下は禁止。

- Stage 1 same-evidence rerun
- 未読Stage 1 seedを使ったseed extension / replacement population
- support gate、lag、axis、checkpoint、policyの結果後変更
- favorable subgroup rescue
- Stage 1 effect directionを用いたStage 2 familyの追加・削除

Stage 2も最終実行が認可された場合はone-shotとし、first fresh read以降のsame-evidence rerun、seed extension、replacement population、post-access design changeを認めない。

## 次に許可される作業

1. Stage 2 formal inference adapterと独立cross-checkの実装
2. Stage 2 runner実装
3. GitHub Actions one-shot workflow実装
4. scientific seedを読まないsyntax/static/source-separation検証
5. 実行依存ファイルのGit blob SHA固定
6. 最終one-shot Stage 2 execution authorization review
7. 認可された場合のみtrigger作成と唯一のscientific execution

## 引き続き禁止

- Stage 2 fresh seed generation/read（最終one-shot認可前）
- Stage 2 scientific execution（最終one-shot認可前）
- Stage 1の再実行・救済
- G3-08 scientific evidence reuse
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AI変更
- main統合

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`prereg/STAGE_2_FORMAL_SPEC.json`](prereg/STAGE_2_FORMAL_SPEC.json)
- [`prereg/STAGE_2_IDENTITY_FIREWALL.json`](prereg/STAGE_2_IDENTITY_FIREWALL.json)
- [`checkpoints/2026-09-26-stage-0-technical-pass.md`](checkpoints/2026-09-26-stage-0-technical-pass.md)
- [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)
- [`../research-program-decisions/2026-09-26-post-g4-06-g4-07-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-06-g4-07-authorization-review.md)
- [`../research-program-decisions/2026-09-26-post-g4-07-stage0-stage1-design-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-07-stage0-stage1-design-authorization-review.md)
- [`../research-program-decisions/2026-09-27-post-g4-07-stage1-stage2-authorization-review.md`](../research-program-decisions/2026-09-27-post-g4-07-stage1-stage2-authorization-review.md)
