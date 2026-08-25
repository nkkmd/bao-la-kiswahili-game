# PBAI-P1 Generation-1 Evidence → Engineering Audit

Status: INITIAL MAP / AUDIT NOT-YET-COMPLETE  
Evidence cutoff anchor: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`

## 1. 目的

第一世代研究をproduction ruleへ直接変換せず、各結果について、(a) scientific status、(b) engineering implication、(c) prohibited inference、(d) candidate/constraint、を明示する。

Phase A完了時には`doc/RESEARCH_INDEX.md`と各Studyのfinal/status/decision文書を再読し、canonical evidence setとsource commit/artifactを確定する。下表はProgram開始時のseed mapであり、まだPhase A完了を意味しない。

## 2. Initial evidence map

| Generation-1 area | Scientific state retained | Engineering use | Tier | Must not infer / implement directly |
| --- | --- | --- | --- | --- |
| Phase Transition Study 1 | bounded `capture-branch-expansion` phenotype等。universal lawではない | phase/transition-aware search・evaluation hypothesis | E2 | universal phase lawとしてhard-codeしない |
| Position Typology / Playing Style Study 1 | Mtaji `MTAJI-M1/MTAJI-M2` confirmed within frozen representation; other axes mixed/exploratory | morphology-aware candidate設計、stratified benchmark | E1/E2 | exploratory style geometryをvalidated style classにしない |
| Namua→Mtaji Transition Study 1 | `NOT-CONFIRMED`; first Mtaji timingはdeterministic progression | timing heuristicを避け、state morphology中心に監査 | E3 | `time-to-first-Mtaji`をstrategic signalとして復活させない |
| Position Complexity / Difficulty Study 1 | overall `INCONCLUSIVE`; machine complexity ≠ human difficulty | search-instability/ambiguityをengineering trigger候補として再設計 | E2/E3 | 既存complexity metricをhuman difficulty classifierにしない |
| Tactical Motifs / Tesuji Study 1 | `TM-S2-C03` confirmed machine motif; C01/C02/C04 `NOT-CONFIRMED` | C03周辺のselective extension/move ordering候補、tactical regression stratum | E1 | C03をgame-theoretic win/traditional tesuji/human importanceとみなさない |
| Tactical Motif Human / Expert Validation Study 1 | human axis `INCONCLUSIVE-NOT-ESTIMABLE`, N=0 | human claimをUI/説明へ追加しないconstraint | E3 | human recognition/difficulty evidenceとして利用しない |
| Position Evaluation / Win-Rate Calibration Study 1 | formal `INCONCLUSIVE` | evaluation sanitation、score semantics監査 | E3 | isotonic mappingやengine scoreをvalidated Bao win probabilityとして表示しない |
| Blunder / Misvaluation Patterns Study 1 | 0 `CONFIRMED` / 4 `NOT-CONFIRMED`;一部failure signature descriptive recurrence | error-mode hypothesis、regression audit設計 | E2/E3 | BMP C01-C04をblunder rulesとしてhard-codeしない |
| Critical Positions / Outcome Branching Study 1 | 139/600 high-divergence roots; promoted class 0; Stage 2未実施 | uncertainty/disagreement-aware selective deepening hypothesis | E2 | simple grammarをvalidated critical-position detectorとして実装しない |
| Restricted Endgame / Winning Regions Study 1 | exact only frozen 8-state domain | exact-oracle lookup plumbingのproof-of-concept、exact regression fixture | E1 | Bao全終盤tablebaseやglobal valueへ一般化しない |
| Symmetry / Isomorphic Positions Study 1 | 5 scopes `NON-ESTIMABLE`; validated transform 0 | symmetry optimization禁止constraint | E3 | reflection/seat swap/canonicalizationをproduction keyへ使用しない |
| ORISC-STUDY1 | Axis A `NOT-CONFIRMED`; Axis B `NOT-AUTHORIZED-NOT-EXECUTED`; validated transform set empty | raw identity / representation-binding guard | E3/E4 | repository row repairを既存Study confirmationとみなさない |
| State Space / Game Tree Complexity Study 1 | exact bounded depth-8 RAW domain | transposition/branching benchmark design、RAW identity infrastructure | E2/E4 | 24,848をBao全state-space sizeとみなさない |
| PCEM-STUDY1 | Stage 1 `EXPLORATORY-ONLY`; 55 audits; promoted 0; Stage 2 not authorized | reply-pressure/opponent-policy sensitivityをengineering hypothesisとして再設計 | E2/E3 | PCEM-T1..T8をwinning-try/error-inducing detectorとしてproduction化しない |

## 3. Reusable engineering infrastructure (E4)

第一世代から少なくとも次を再利用候補とする。

- authoritative RAW state identity and conservation guards
- deterministic seeds and opening identity
- exact legal-move enumeration
- replay / intervention tooling
- source / artifact hash provenance
- independent recomputation patterns
- fresh evidence / identity firewall concepts
- bounded exact oracle fixtures
- full-search recomputation tools where operationally feasible

再利用時は研究artifactを書き換えず、engineering側のderived artifactとして保存する。

## 4. Initial engineering opportunity families

現時点では候補を**提案状態**に置くだけで、実装authorizationではない。

1. phase/morphology-aware search or evaluation
2. `TM-S2-C03` evidenceを起点にしたtactical selective extension / move ordering
3. validated bounded exact-oracle lookup architecture
4. search-instability-aware selective deepening
5. evaluation-score / win-probability semantics sanitation

Phase Aでは各candidateについてsource evidence、mechanism、risk、expected cost、required benchmarkを明示し、evidenceが弱いcandidateは削除可能とする。

## 5. Phase A completion gate

- canonical Generation-1 study list fixed
- each Study source documents identified
- each finding assigned E1/E2/E3/E4 engineering use without changing scientific label
- prohibited inferences recorded
- candidate families traced to source evidence
- Generation-2 outcomes absent
- no public AI implementation change performed
