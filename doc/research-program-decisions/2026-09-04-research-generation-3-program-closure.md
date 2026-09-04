# 2026-09-04 — Research Generation 3 Program Closure

## Decision

**`RESEARCH-GENERATION-3 = CLOSED / MAIN-INTEGRATION-PENDING`**

Post-G3-12 closure review `RG3-PROGRAM-CLOSURE-AUTHORIZED`に基づき、Research Generation 3 core agenda `G3-01..G3-12`をprogram-levelにcloseする。

```text
Program = Bao Third-Generation Research Program
Core agenda = G3-01..G3-12
Closure branch = research/g3-final-program-closure
Baseline main = fd6c8e2a4510d5937b47a87735854e8459b2646f
Program closure date = 2026-09-04
Program lifecycle = CLOSED
Main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Basis

Prospective `doc/research-generation-3/PROGRAM_PLAN.md` Section 16の14 completion conditionsを、`FINAL_SYNTHESIS.md`と`PROGRAM_FINAL_RESULT.json`のmaterialization後に再評価し、全てPASSした。

本closureはpositive resultの数によらない。formal-complete、not-confirmed、non-estimable、technical-invalid、independent prerequisite eligibility、protected exact holdoutをそれぞれ元の意味のまま保存する。

## Program-level scientific record

### Formal-eligible foundation

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
representation = RAW-ONLY
relative depth = 5
eligible families = F1,F2,F3,F4,F5
```

### Formal-complete core Studies

```text
G3-04 / SFCDF-STUDY1 = CLOSED / FORMAL-COMPLETE
  C1 = CONFIRMED / MTAJI-GREATER
  C6 = CONFIRMED / NAMUA-GREATER

G3-07 / SILGM-STUDY1 = CLOSED / FORMAL-COMPLETE
  3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
  confirmed family = G1 ROOT-LEGAL-WIDTH x E3 RANKING-PREORDER-CHANGE / HIGHER-IN-HIGH
  under DEPTH / NODE-BUDGET / QUIESCENCE perturbations

G3-10 / GCLD-STUDY1 = CLOSED / FORMAL-COMPLETE
  C1 = CONFIRMED / ACTUAL-GREATER
  C2 = CONFIRMED / ACTUAL-GREATER
  C3 = CONFIRMED / ACTUAL-LESS
  C4 = NOT-CONFIRMED
  C5 = CONFIRMED / ACTUAL-GREATER

G3-11 / FDEGHV-STUDY1 = CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
  H1..H4 = DEEPER-CONFIRMED
```

### Formal-eligible continuous representation prerequisite

```text
CRCLGR-STUDY1 = CLOSED / FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION
representation = CRCLGR-R1-EXACT-SQUASHED-L1
```

### Technical-invalid core Studies

```text
G3-01 / LGTGMF-STUDY1 = TECHNICAL-INVALID
G3-02 / EBRWS-STUDY1 = TECHNICAL-INVALID
G3-03 / TCTGD-STUDY1 = TECHNICAL-INVALID
G3-05 / BECT-STUDY1 = TECHNICAL-INVALID
G3-06 / BRMGI-STUDY1 = TECHNICAL-INVALID
G3-08 / LGPML-STUDY1 = TECHNICAL-INVALID
G3-09 / CLGR-STUDY1 = TECHNICAL-INVALID
G3-12 / LGTGGC-STUDY1 = TECHNICAL-INVALID
```

これらはnegative/null scientific resultではない。

### Independent technical-invalid prerequisite

```text
RRCLGR-STUDY1 = CLOSED / TECHNICAL-INVALID
```

これも後続CRCLGRによってretroactively reclassifiedしない。

## Protected exact evidence

G3-11でprotected depth-10 holdoutをexactly once開封した。

```text
depth-10 unique RAW states = 348270
depth-10 tree occurrences = 494456
cumulative distinct RAW through depth 10 = 451127
cumulative tree occurrences through depth 10 = 631101
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

## G3-12 capstone boundary

G3-12はgeneralization/counterexample capstoneとしてformal Stage 2へ到達しなかった。

```text
G3-12 Stage 1 = exactly one execution / TECHNICAL-INVALID
G3-12 Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Stage 2 seeds = UNREAD
formal generalization decisions = NONE
formal counterexample decisions = NONE
```

したがってResearch Generation 3はgeneralization boundaryをformalに確定していない。この未確定性をprogram closureで埋めたり、upstream confirmationをuniversal lawへ拡張したりしない。

## Human track

`G3-H01`はprogram plan開始時からindependent / non-blockingである。

```text
G3-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING
human scientific outcome generated = false
N=0 is not negative human evidence
```

未実施はcore program closureを妨げない。

## Immutable interpretation boundary

Research Generation 3 closureは次を確立しない。

- whole-Bao state-space size
- whole-Bao game-tree size
- depth-11 or deeper exact growth
- validated symmetry / canonicalization
- universal effective branching law
- universal transposition law
- causal rule-mechanism law
- universal local-geometry generalization
- game-theoretic forcing / optimality
- position value / win probability
- strategic-regime validation
- human difficulty / cognition
- physical hysteresis

## No-rescue after program closure

Program closure後も以下をauthorizeしない。

- closed G3 Studyのsame-evidence rerun
- G3-11 depth-10 rerun
- depth-11 access
- G3-12 Stage 1 repair/replay
- G3-12 Stage 2 fresh access
- threshold / endpoint / population / seed rescue
- G2-12 estimator revival
- symmetry/canonicalization rescue

将来の再検証は新しいprospective Studyまたは新しいResearch Generationとして独立にauthorizeする。

## Canonical closure records

- `doc/research-generation-3/PROGRAM_PLAN.md` — immutable prospective program plan
- `doc/research-generation-3/FINAL_SYNTHESIS.md`
- `doc/research-generation-3/PROGRAM_FINAL_RESULT.json`
- `doc/research-generation-3/CURRENT_STATUS.md`
- `doc/research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`
- `doc/research-program-decisions/2026-09-04-research-generation-3-program-closure.md`

## Repository integration boundary

このprogram closureはclosure branch上で成立する。

**`main` integrationは本decisionではauthorizeも実行もしない。**

明示的ユーザー指示があるまで`research/g3-final-program-closure`に保持する。
