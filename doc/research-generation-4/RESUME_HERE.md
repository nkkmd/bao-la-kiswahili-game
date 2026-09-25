# Research Generation 4 — 再開位置

更新日: 2026-09-25  
状態: **`G4-04 COMPLETE / NEXT CORE CANDIDATE = G4-05 AUTHORIZATION REVIEW`**

## 再開時の読む順序

1. remote `main` HEADとG4-04 research branch HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`../geometry-trajectory-dynamics-transfer/CURRENT_STATUS.md`](../geometry-trajectory-dynamics-transfer/CURRENT_STATUS.md)でG4-04 closureを確認する。
4. [`../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)でformal resultを確認する。
5. [`checkpoints/2026-09-25-g4-04-complete.md`](checkpoints/2026-09-25-g4-04-complete.md)でProgram-level checkpointを確認する。
6. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でG4-05のfrozen program roleを確認する。

## 現在地

```text
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN NOT INTEGRATED
G4-05 = NEXT CORE CANDIDATE / NOT AUTHORIZED
G4-06..G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-04 canonical result

```text
Stage 1 run = 36089520136 / success
Stage 1 disposition = STAGE1-PASS
Stage 2 run = 36095831961 / success
Stage 2 artifact ID = 10849029913
Stage 2 seed reads = 369
Stage 2 last seed read = 40423593
Stage 2 formal measured trajectories = 64
Stage 2 disposition = FORMAL-COMPLETE
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

G4-04ではrerun、seed extension、post-access repair-and-rerunを行っていない。G3-11 depth-10をrerunせず、G4-10 depth-11 protected evidenceにもアクセスしていない。

## G4-04 interpretation

G3-10由来のC1・C2・C3・C5 directionは、本Studyのfresh P1/P2 source-policy domainsで8/8 formal testsすべて同方向に移送された。

ただし無条件のuniversal generalizationではない。

- C1: P1/P2でpositive directionをformal confirmation
- C2: P1/P2でpositive directionをformal confirmation
- C3: P1/P2でnegative directionをformal confirmation
- C5: P1/P2でpositive directionをformal confirmation
- RF1/RF2はsupport descriptorのみでformal subgroup inferenceなし
- C4はpositive transfer targetではない

この結果はgame-theoretic value、best move correctness、AI strength、人間のdifficulty、causal mechanismを示さない。

## 次にRG4を進める場合

次のcore candidateは**G4-05 — exact microdomain oracle foundation**。

G4-05へ進む場合は、新しいAgenda/Studyとして少なくとも次をfresh evidence access前にprospectiveに固定する。

1. authorization review
2. Study ID / exact microdomain root contract
3. fresh seed / root namespace
4. complete-closure definitionとterminal/recurrent semantics
5. independent solver agreement contract
6. resource ceiling / stop rule / partial-result handling
7. execution environment
8. pre-execution binding
9. no-rescue / no-rerun rule

G4-04の結果はG4-05を自動authorizationしない。

## Main integration boundary

G4-04はresearch branch上でclosure済みだが、`main`には未統合である。

ユーザーの明示指示があるまでG4-04を`main`へ統合しない。G4-05を開始する場合も、まずG4-04のmain integration状態とprogram文書整合性を確認する。

## 禁止事項

- G4-02 Study 1〜4のrepair / reopen / rerun
- G4-03 Stage 1 / Stage 2のrerun
- G4-04 Stage 1 / Stage 2のrerun
- G4-04 scientific seedの救済目的再読
- G4-04 domain / sample / thresholdのpost-hoc変更
- G4-04 resultのRF1/RF2 subgroupやwhole-Bao universal lawへの拡張
- G3-11 depth-10 rerun
- G4-10 depth11 access
- public AIへの自動反映
