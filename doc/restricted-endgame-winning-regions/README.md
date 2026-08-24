# Restricted Endgame / Winning Regions Study 1

**研究題目:** Baoにおける限定終盤と必勝圏の完全解析 — constrained endgame state spaces における exact game-theoretic value, cycle structure, and distance-to-win の列挙・後退解析

Status: **STUDY 1 COMPLETE / EXACT-SOLVED-WITHIN-FROZEN-DOMAIN**  
Study ID: `REWR-STUDY1`  
Baseline main HEAD: `626480507710e0095ef8aec6a53c3e4e0318fa4f`  
Branch: `research/restricted-endgame-winning-regions`  
Tracking PR: #38

## Conclusion

Bao全体ではなく、standard initial stateから到達証明を持つ1つのMtaji rootのcomplete legal forward closureをprospectively freezeし、raw-state identityのまま完全解析した。

Frozen exact domain:

```text
states = 8
edges = 7
symmetry reduction = none
```

Exact classification:

```text
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
```

Frozen root:

```text
state key = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
Player 0 to move
value = WIN
absolute forced winner = Player 0
DTF = 3
unique optimal move = capture:mtaji:1:4:left:::false
```

Production solverとindependent verifierは全state rows、state/edge hashes、value、DTF、optimal move set、RECURRENT SCCを完全一致させた。

Formal decision:

> **`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`**

## Critical claim boundary

この結果は**frozen 8-state domain内だけ**のexact resultである。

以下を意味しない。

```text
Bao全体が解けた
全Mtajiが解けた
全終盤が解けた
Baoにcycleがない
engine evaluationがgame-theoretically正しい
symmetryが成立する
```

`RECURRENT=0`もこのdomainだけの結果である。

## Rule semantics

`front-empty` / `no-move`をnormative terminalとした。

`MAX_RELAY=512` / `relay-limit`はimplementation guardでありgame resultへ変換していない。正式なdraw/repetition ruleも仮定していない。administrative cutoffはtechnical failure、fixed-point unresolved stateは`RECURRENT`でありformal DRAWとは別である。

## Stage 0 feasibility result

Outcome-blind v2 matrixから8-state domainを選択した。より大きい1-root候補はone-shot v3 auditで423,733 states / 426,938 edgesまで展開したが、1着手が1,000,000 microstepsの`ADMIN-CUTOFF`へ到達したためexact不適格となった。事前規則どおり追加cap拡張やpost-outcome rescueは行っていない。

## Documents

- `STUDY_1_OVERVIEW.md` — 初見向け成果概要
- `STUDY_1_FINAL_REPORT.md` — 科学的・技術的な最終統合
- `results/STAGE_1_EXACT_RESULT.json` — 8状態すべてのcanonical exact oracle
- `CURRENT_STATUS.md` — closure状態と固定境界
- `DECISION_REGISTER.md` — immutable design decisions
- `REPRODUCIBILITY_INDEX.md` — source / graph / workflow / result hashes
- `RESEARCH_LOG.md` — chronology
- `preregistration/STAGE_1_DOMAIN.json` — frozen domain
- `preregistration/STAGE_1_EXACT_SPEC.json` — frozen solution protocol
- `preregistration/STAGE_1_EXACT_AUTHORIZATION.json` — corrected authorization v2

## Scientific identities

```text
domainSha256 = acfc25413f9c237569884f166ed971ad9ee9395665ce96ec6d094d8ed4a6c56a
specSha256 = ec20df4621b7d8e50fd979bee4681c7eadb5bf2138c14911cb6ab97acd0738cc
authorizationSha256 = d3fe788e95606c6641ad4c33a396a2c02b21138b9b80bef2522f85cd124f282c
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
productionResultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
verificationResultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

This bounded oracle is intended as raw ground truth for the later Symmetry / Isomorphic Positions Study and State Space / Game Tree Complexity Study.
