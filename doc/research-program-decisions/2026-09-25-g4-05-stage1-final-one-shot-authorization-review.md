# 2026-09-25 — G4-05 / RLEMOF-STUDY1 Stage 1 final one-shot authorization review

Review ID: `G4-05-STAGE1-FINAL-AUTHORIZATION-2026-09-25-V1`  
Preparation commit: `eabf9d803641d7b933c11f9ce445b7dbb630df3f`  
判定: **`RLEMOF-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

## 1. pre-access freeze確認

Stage 1 development spec、production runner、independent verifier、Actions workflowをfresh seed access前のcommit `eabf9d803641d7b933c11f9ce445b7dbb630df3f`で固定した。

主要blob:

```text
STAGE_1_DEVELOPMENT_SPEC.json = 03a9e27b977ce398f1b5dd06cc0ff648953bfe69
run-rlemof-stage1-development.js = b7f52b447b31f5c6ca3c8cad78cacb8619fa041f
verify-rlemof-stage1-development-independent.js = 44244f2b0207633c3ef8f056e4f63a0cd0974c19
rlemof-g4-05-stage1-development.yml = 36e835ad0f4f1dd2b4abdc1e41f47803b324f424
restricted-endgame-stage0.js = c0391da999314c4709e5002e73eae42ef3048436
restricted-endgame-transition.js = 7ca35ef03ecad102b9a9e1fa6c4767f72d409961
restricted-endgame-independent-verifier.js = 94a79d140803802acf607bbaf02d570aa3b6f362
public/engine.js = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
```

## 2. fresh access範囲

```text
seed block = 40513001..40513512
seed count = 512
max ply = 320
purpose = development/resource characterization only
retrograde outcome generation = forbidden
formal exact decision = forbidden
Stage 2 execution = forbidden
```

全seedと遭遇RAW root identityはStage 2 formal evidenceから消費済みとして扱う。

## 3. one-shot execution

認可する実行は、authorization file追加をtriggerとするGitHub Actions push runのattempt 1だけとする。

- event = `push`
- `GITHUB_RUN_ATTEMPT = 1`
- source blob mismatch = fresh access前にhard fail
- workflow rerun attempt 2+ = unauthorized / hard fail
- workflow_dispatch = Stage 1には用意しない
- resultの成否にかかわらずartifact uploadを試みる

同一fresh blockのrepair-and-rerunは認可しない。

## 4. allowed endpoints

root availability、tier counts、選択identity、closure complete/stop classification、state/edge counts、complete graph digest、branching resource summary、move microsteps、deterministic work unitsだけを許可する。

WIN/LOSS/RECURRENT、DTF、optimal moves、winner-based selection、cycle-interest selectionは生成しない。

## 5. 最終判定

**`RLEMOF-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

この認可はStage 1 developmentに限る。Stage 1結果を確認してもStage 2へ自動進行しない。
