# Research Generation 4 — 再開位置

更新日: 2026-09-24  
状態: **`G4-03 COMPLETE / NEXT CORE CANDIDATE = G4-04 AUTHORIZATION REVIEW`**

## 再開時の読む順序

1. remote `main` HEADとG4-03 research branch HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`../local-width-search-ranking-transfer/CURRENT_STATUS.md`](../local-width-search-ranking-transfer/CURRENT_STATUS.md)でG4-03 closureを確認する。
4. [`../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)でformal resultを確認する。
5. [`checkpoints/2026-09-24-g4-03-complete.md`](checkpoints/2026-09-24-g4-03-complete.md)でProgram-level closureを確認する。
6. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)で次Agendaのfrozen dependencyを確認する。

## 現在地

```text
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = ELIGIBILITY-GATE-SATISFIED / NOT AUTHORIZED
G4-05 = CANDIDATE / NOT AUTHORIZED
G4-06..G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-03 canonical result

```text
Stage 1 run = 35987703180 / success
Stage 1 fresh seeds = 768 / exactly once
Stage 1 selected roots = 128
Stage 2 run = 35993172710 / success
Stage 2 fresh seeds = 1536 / exactly once
Stage 2 selected roots = 192
Stage 2 disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

G4-03ではrerun、seed extension、root replacement、threshold relearningを行っていない。G3-11 depth-10 / G4-10 depth-11 protected evidenceにもアクセスしていない。

## G4-03 interpretation

G3-07由来のroot legal width HIGH / ranking-preorder change associationは、対象fresh domainsへ広く移送された。

ただし無条件のuniversal generalizationではない。

- SC1 DEPTHは4/4 domainsでformal generalization
- SC2 NODE-BUDGETはP1 domainsでformal generalization、P2 domainsはMtaji support不足でnon-estimable
- SC3 QUIESCENCEは3/4 domainsでformal generalization、P2×RF2はHolm補正後`NOT-GENERALIZED`
- reverse-direction counterexampleは0

この結果はbest move correctness、game-theoretic value、AI strength、人間のdifficulty、causal mechanismを示さない。

## 次にRG4を進める場合

次のcore candidateは**G4-04**。

G4-04へ進む場合は、既存G4-01 compatibility evidenceとG4-03 closureを背景情報として利用できるが、新しいAgendaとして次をprospectiveに固定する必要がある。

1. authorization review
2. Study ID / claim / transfer domains
3. fresh seed namespace
4. protected evidence boundary
5. execution environment
6. pre-execution binding
7. no-rescue / no-rerun rule

G4-01のeligibility gateだけでscientific executionを自動開始しない。

## Main integration boundary

G4-03はPR #164で`main`へ統合済みである。merge commitは`73ac1920177c2451669e5ceeccaed53e34459df9`。

以後、G4-03をrepair/reopenせず、RG4を継続する場合はG4-04の個別authorization reviewから開始する。

## 禁止事項

- G4-02 Study 1〜4のrepair / reopen / rerun
- G4-03 Stage 1 / Stage 2のrerun
- G4-03 scientific seedの救済目的再読
- G4-03 threshold / sample / domainのpost-hoc変更
- G4-03 resultのwhole-Bao universal lawへの拡張
- G3-12 repair/replay
- G4-10 depth11 access
- public AIへの自動反映
