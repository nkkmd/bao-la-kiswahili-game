# Restricted Endgame / Winning Regions Study 1

**研究題目:** Baoにおける限定終盤と必勝圏の完全解析 — constrained endgame state spaces における exact game-theoretic value, cycle structure, and distance-to-win の列挙・後退解析

Status: **ACTIVE / STAGE 0 TECHNICAL DESIGN**  
Study ID: `REWR-STUDY1`  
Baseline main HEAD: `626480507710e0095ef8aec6a53c3e4e0318fa4f`  
Branch: `research/restricted-endgame-winning-regions`

## Purpose

Bao全体を解くのではなく、prospectively frozenで有限・transition-closedなbounded domainについて、全状態・全合法遷移を列挙し、normative terminal semanticsだけをbase caseとしてexact retrograde analysisを行う。

このStudyは既存のengine evaluation、search value、empirical continuation outcomeをgame-theoretic valueへ再解釈する研究ではない。完了済みStudyのformal decisionを変更・救済しない。

## Initial Stage 0 direction

Primary候補は、**historically reachableであることをwitness pathにより証明できるMtaji rootから、全合法遷移を再帰的に展開したforward closure**とする。単純なseed-count/non-empty-pit capそのものをdomain boundaryには使わない。capはroot候補のtechnical benchmark filterとしてのみ扱い、closure外遷移をheuristicで埋めない。

Primary exact enumerationではsymmetry canonicalizationを使用しない。direct raw rule-state identityを使う。

## Critical semantic firewall

`public/engine.js` の `MAX_RELAY = 512` / `reason = "relay-limit"` は `doc/RULES_BASELINE.md` がBaoの通常規則ではないimplementation safety guardと明示している。したがって、`relay-limit`をgame-theoretic LOSS/WIN terminalとして使用しない。

Stage 0ではguard-free move semanticsを独立に監査し、各合法手について normal termination / within-move recurrence をdeterministically判定できることをexact-domain成立条件とする。normative semanticsを確定できないmove-level recurrenceがdomain内に存在する場合、そのcandidate domainはexact claim不適格とする。

## Documents

- `CURRENT_STATUS.md` — 現在地
- `RESEARCH_PLAN.md` — Study 1 plan
- `VOCABULARY.md` — exact / recurrent / reachability terminology
- `DECISION_REGISTER.md` — immutable design decisions
- `STAGE_0_CONSTRUCT_DESIGN.md` — construct/rule/closure design
- `STAGE_0_TECHNICAL_PLAN.md` — technical benchmark and feasibility gates
- `STAGE_1_RUNBOOK.md` — prospective freeze prerequisites; scientific generation is currently blocked
- `EXPERIMENT_INDEX.md` / `REPRODUCIBILITY_INDEX.md` / `RESEARCH_LOG.md`

## Current authorization state

```text
Stage 0 technical fixtures = AUTHORIZED
Stage 0 scientific outcome inspection = FORBIDDEN
Stage 1 scientific tablebase generation = NOT AUTHORIZED
Stage 1 spec = NOT YET FROZEN
```
