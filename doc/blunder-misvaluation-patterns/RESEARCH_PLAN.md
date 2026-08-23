# RESEARCH_PLAN — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23  
Status: **HISTORICAL PROSPECTIVE PLAN — STUDY 1 CLOSED**

> The prospective design below is retained as provenance. Stage 1 and Stage 2 were subsequently executed under versioned frozen specifications and authorizations. Current status and formal adjudication are canonical in [`CURRENT_STATUS.md`](CURRENT_STATUS.md), [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md), and [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json).

## 1. Objective

異なるBao局面に繰り返し現れるmachine-reproducible bad-move / value-misestimation patternsを、単一の結果や単一の評価関数ではなく、複数の分離constructとして発見し、fresh corpusで確認する。

本Studyの成功条件は「悪手辞典を必ず作ること」ではない。

```text
no promotable candidate
candidate NOT-CONFIRMED
candidate INCONCLUSIVE-NOT-ESTIMABLE
technical inconclusive
```

はいずれも正当な結果である。

## 2. Scientific construct separation

本Studyでは最初から以下を1つのblunder scoreへ圧縮しない。

1. **decision loss / regret** — 同一rootのfrozen exact search value差。
2. **rank error** — exact root candidate ranking内の順位損失。
3. **catastrophic structural loss** — move後またはbounded reply後に生じる構造悪化。
4. **forcing-response vulnerability** — 相手に限定的かつ有利なreply structureを与えること。
5. **horizon / shallow-search error** — D1/D2とD3のcandidate ranking / TopSet disagreement。
6. **static-evaluator misvaluation** — static `bao` evaluationとD3 reference searchのmove ranking/value関係の乖離。
7. **outcome consequence** — frozen continuation policy上のfresh deterministic branch outcome。game-theoretic probabilityではない。
8. **human misconception** — human dataなしでは推論しない独立future construct。

## 3. Primary reference

Primary reference search:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
D3
quiescenceDepth = 1
evaluationProfile = bao
root actor perspective
```

For root state `s`, candidate `m`:

```text
S(s,m) = exact D3+Q1 value after applying m,
         evaluated from the root actor perspective

R(s,m) = max_a S(s,a) - S(s,m)
```

`R=0`はexact TopSet membershipと整合する。tiesはlossとして扱わない。

Mate-score domainsはordinary evaluator domainと分離して記録する。cross-domain差をそのまま通常点差のseverityとして平均しない。

## 4. Stage 0 — technical / construct audit

Stage 0ではscientific corpusを生成せず、以下をfixture/smoke stateで監査する。

- evaluator/search perspective
- terminal score / mate-distance semantics
- D3 + Q1 exact candidate values
- D1/D2/D3 trace
- optional D4 feasibility
- exact `E.moveVariants` enumeration
- `AI.moveKey` exact move identity
- Namua house-choice variants
- tie / TopSet / ranking semantics
- static post-move evaluator semantics
- structural transition features
- reply envelope / forced reply semantics
- lack of search-consistent PV in current instrumentation
- historical trajectory / opening / rule-state identity
- deterministic replay and non-mutation
- compute feasibility
- source-hash authorization firewall

Stage 0でtechnical invalidityが判明した場合は、scientific data生成前にversioned design amendmentを行う。結果を見た後のdepth変更は認めない。

## 5. Stage 1 — fresh exploratory discovery

Stage 1は専用specとauthorization後にのみ開始する。

### 5.1 Population principles

- globally fresh scientific seed block
- fixed game count / max ply before generation
- opening diversification fixed prospectively
- no outcome-dependent extension
- no favorable replacement
- independent full replay/search verification before selection
- one trajectory cannot contribute many nearby roots as independent support

### 5.2 Root selection

Preferred design:

```text
generated trajectories
→ collapse duplicate historicalTrajectoryHash
→ outcome/value-independent phase assignment or fixed phase quota
→ eligible nonterminal roots with >=2 exact legal moveVariants
→ deterministic hash-ranked root selection
→ at most one selected root per unique trajectory
→ collapse duplicate ruleStateKey without replacement
```

Exact phase-balancing ruleはStage 1 specでfreezeする。

### 5.3 Per-root measurement

全exact legal moveVariantsを測定する。

Per move:

- exact move identity
- immediate transition/event summary
- actor/opponent structural deltas
- opponent immediate reply set and response envelope
- static post-move evaluation from root actor perspective
- D1/D2/D3 root-candidate score/rank/TopSet
- D3 regret and score-domain class
- D1/D2→D3 rank/TopSet disagreement
- structural failure tokens
- optional frozen continuation metadata if Stage 1 spec authorizes descriptive use

### 5.4 Candidate grammar

Initial prospective grammar family:

```text
phase
+ 1–2 structural precondition tokens
+ one move-abstraction token
+ one failure / misvaluation token
```

Candidate examples are hypothesis-generating only. Discovery may produce different families or none.

Possible failure / misvaluation axes include:

- D3 below-root-median / bottom-ranked structure
- D2 top-set but D3 non-top / below-median
- static post-move overvaluation relative to D3 ranking
- forced beneficial opponent reply
- mobility / capture-mobility collapse
- front-row / nyumba / reusable-pit structural concession
- apparent immediate gain followed by bounded forced structural loss
- C03 opportunity miss or C03-like near-miss misuse, without changing C03's historical definition

### 5.5 Promotion discipline

Before Stage 1 scientific generation, freeze exact promotion gates and deterministic cap. At minimum audit:

- unique historical trajectory support
- unique rule states
- distinct opening prefixes
- maximum opening-prefix concentration
- generation-stratum diversity
- decision-loss magnitude/consistency
- failure-signature consistency
- support identity hash
- deterministic ranking and candidate cap

Manual post-hoc candidate selection is prohibited.

## 6. Stage 2 — fresh formal confirmation

Stage 1 promoted definitions remain immutable exploratory artifacts.

Before Stage 2 data exist:

- audit support-equivalent candidates
- freeze a small canonical candidate set
- freeze candidate matching rule
- freeze primary decision-loss endpoint
- freeze candidate-specific failure endpoint
- freeze sample/estimability gates
- freeze multiplicity control
- freeze decision labels
- freeze Stage 1→Stage 2 identity firewall
- freeze exact Stage 2 game count within the reserved namespace
- issue a separate source-bound generation authorization

Candidate eligibility in Stage 2 may use only precondition/move-matching information. D3 loss, downstream failure and game outcome may not determine inclusion.

## 7. Proposed formal endpoint architecture

Working recommendation to be operationally frozen before Stage 2:

1. **co-primary decision-loss success** — candidate is strictly below the state-level D3 reference median or falls into a prospectively defined worse score-domain category;
2. **co-primary candidate-specific failure success** — the frozen structural/reply/misvaluation signature occurs.

Additional consistency gates may include low D3 top-set rate / bottom-rank concentration or horizon/static disagreement for candidate families where those are definitional.

The exact success thresholds and multiplicity family are not yet Stage 2-frozen at Study initiation. They must be fixed before Stage 2 generation and cannot be chosen from Stage 2 outcomes.

## 8. Calibration boundary

Position Evaluation / Win-Rate Calibration Study 1 closed `INCONCLUSIVE`.

Therefore:

```text
validated win-probability loss = NOT AVAILABLE
```

Its Stage 1 isotonic mapping is excluded from this Study's formal primary endpoint. If referenced later, it must be labeled exploratory/descriptive and must not affect formal candidate selection or decision.

## 9. Human boundary

Without new human participants/data, this Study can support only machine-level claims. `misconception`, `beginner error`, `expert oversight`, or cognitive-bias claims remain future human-validation questions.

## 10. Executed resolution

The prospective plan was materialized through a frozen Stage 1 exploratory specification and a separate frozen Stage 2 formal specification. Stage 2 used fresh seeds `22500001..22504096`, passed independent corpus and measurement verification, retained final Stage 1 identity overlap `0 / 0 / 0`, and formally evaluated all four promoted candidates.

```text
Stage 2 games = 4096
formal measurements = 2678
formal candidates = 4
estimable = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
```

No seed extension, replacement, candidate retuning, endpoint change, threshold change, multiplicity change, favorable subgroup promotion, alternate primary depth/evaluator, or manual override was used. The completed Study 1 is not reopened by this plan; any materially different follow-up requires a new prospective study/version and fresh evidence.