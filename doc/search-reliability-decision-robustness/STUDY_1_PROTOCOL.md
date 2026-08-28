# Search Reliability / Decision Robustness Study 1 — Protocol

Protocol freeze date: 2026-08-27
Status: **FROZEN STUDY-LEVEL PROSPECTIVE PROTOCOL / PRE-SCIENTIFIC-GENERATION**
Program label: `G2-02`
Study ID: `SRDR-STUDY1`
Research generation: **Research Generation 2**
Baseline `main`: `db6980bffb7e6853751914da628db8936c76d81e`
Research branch: `research/g2-02-search-reliability-decision-robustness`

## 1. 研究題目

**Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証**

English formal title:

**Search Reliability / Decision Robustness Study 1**

## 2. 中心課題

> 同一authoritative RAW stateに対するmachine search decisionは、prospectively frozen depth、node budget、quiescence等の探索条件を変えたとき、best move、TopSet、全合法手ranking、score / best-second gap、principal variationの各軸でどの程度安定するか。

本Studyは`doc/FUTURE_RESEARCH_AGENDA.md`の`G2-02`を具体化した新規・prospective・独立Studyである。`G2-02`はAgenda順序ラベルであり、正式Study IDは`SRDR-STUDY1`とする。

## 3. Construct boundary

本Studyのprimary constructは次である。

```text
machine search reliability / decision robustness
under frozen search-condition perturbations
```

明確に分離する。

```text
search reliability
!= human difficulty
!= structural complexity
!= empirical win probability
!= game-theoretic value
!= engine evaluation correctness
!= public AI strength
!= human perception
```

高resource条件をreferenceとして使用する場合も、その意味は`frozen search reference`だけであり、`game-theoretic truth`、`true best move`、`validated optimal move`ではない。

## 4. Immutable upstream boundaries

### G2-01

`PEOCR-STUDY1 = INCONCLUSIVE`はimmutable。G2-01 Stage 2 rowを本Studyのformal evidenceとして再利用しない。additional seeds、replacement、gate relaxation、mapping refit、near-miss exception、favorable subgroup、alternate-primary relabelingを行わない。

### Research Generation 1 Position Complexity / Difficulty Study 1

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL = INCONCLUSIVE
```

このdecision、threshold、endpoint、formal corpusはimmutable。既存`position-complexity-search-diagnostic.js`等のinstrumentationはtechnical infrastructureとして監査・再利用可能だが、既存scientific rowsはG2-02 formal evidenceではない。

### Engineering boundary

`PBAI-P1`等のAI engineering decisionはG2-02のscientific endpoint、success criterion、formal evidenceに使用しない。

## 5. Authoritative state identity

Research Generation 2 common contractに従いformal identityはRAWのみとする。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`はidentityへ含めない。

G2-03等のvalid formal transformation Studyが成立するまで、以下をformal dedup / identityに使用しない。

- symmetry reduction
- reflection equivalence
- player-seat canonicalization
- state canonicalization
- unvalidated isomorphism

## 6. Move identity / tie discipline

Stage 1 scientific generation前に、exact move identityは`AI.moveKey()`とengine move objectの整合をtechnical validationし、正式なcanonical move-key contractをfreezeする。

Stage 1 specでは少なくとも次を固定する。

- legal root set = exact `E.moveVariants(state)`
- score perspective
- exact tie rule
- deterministic canonical-best tie-break
- TopSet definition
- Top-kの`k`
- ranking tie handling
- score toleranceを使う場合はexact tolerance
- mate/terminal score-domain handling
- PV comparison rule

結果後にtie tolerance、TopSet、Top-k、ranking rule、PV prefix ruleを変更しない。

## 7. Stage structure

### Stage 0 — Technical feasibility / non-scientific smoke

Stage ID:

`SRDR-S0-TECHNICAL-2026-08-27-v1`

Machine-readable spec:

`preregistration/STAGE_0_TECHNICAL_SPEC.json`

Stage 0はscientific inferenceを行わない。technical fixture / smoke stateはStage 1/2から永久除外する。

Mandatory candidate capabilities:

1. exhaustive exact root-candidate scores / TopSet / ranking;
2. depth-control determinism;
3. quiescence enablement/depth semantics;
4. quiescence capture-ordering semantics;
5. explicit node-budget semantics;
6. deterministic PV extraction and comparison semantics;
7. move-ordering / aspiration / adaptive / stable-best / TT/history controlsの技術的意味;
8. repeated-run determinism;
9. production vs independent implementation agreement;
10. non-mutation and RAW identity reproduction.

現行public APIに独立node-budget上限またはPV列返却がない場合、研究専用instrumentationをStage 0で実装・検証できる。検証不能ならnode-budget axisまたはPV endpointを**Stage 1前に除外**する。scientific outcomeを見てから追加・削除しない。

### Stage 1 — Fresh construct characterization / development

Stage ID:

`SRDR-S1-DEVELOPMENT-2026-08-27-v1`

Stage 1はfresh scientific development evidenceでありformal confirmationではない。Stage 1 population / seed range / search-condition grid / endpoint definitions / source hashes / independent verifier / readiness gatesはStage 0 PASS後、**最初のStage 1 scientific outcomeを見る前に**別machine-readable specでfreezeする。

Stage 1の役割:

- candidate search axesのavailability / determinism / non-degeneracy確認;
- Namua / Mtaji coverage確認;
- exact ties、legal-move count、score-domain prevalence確認;
- depth / node-budget / quiescence sensitivityを別々にcharacterize;
- formal Stage 2 endpoint / tolerance / estimability ruleを一度だけfreezeするためのdevelopment evidenceを得る。

Stage 1 row / seed / stateはinspection後にconsumedとし、Stage 2 formal evidenceへ再利用しない。

### Stage 2 — Fresh held-out formal replication

Stage ID:

`SRDR-S2-FORMAL-2026-08-27-v1`

Stage 2はStage 1とは別のfresh population / seed blockを使用する。Stage 2 spec、formal endpoint、reference condition、numeric threshold / tolerance、estimability gates、decision rule、source hashes、independent verifier、authorization recordをoutcome生成前にfreezeする。

Stage 2はStage 1 resultだけで自動authorizeしない。explicit authorizationを必要とする。

## 8. Population principle

Stage 1/2はfresh historically reachable RAW statesを使用する。

Selectionはsearch-reliability outcome-blindとし、少なくとも次を事前検討・freezeする。

```text
historical trajectory dedup
opening-prefix dependence
RAW-state dedup
one-state-per-trajectory principle
Namua/Mtaji prospective balance
no replacement for unavailable assigned phase
```

同一trajectoryから多数のstateを独立sampleとして数えない。Stage間firewallは最低限trajectory、opening-prefix、RAW stateの3軸を候補とし、exact ruleをStage 1 spec前に固定する。

## 9. Search-condition grid principle

Stage 0 technical resultを受け、Stage 1 scientific generation前に有限gridをfreezeする。

Primary candidate axes:

```text
depth sensitivity
node-budget sensitivity
quiescence sensitivity
```

Candidate technical controls:

```text
quiescence capture ordering
move ordering
TT move-first
history heuristic
aspiration
adaptive allocation
stable-best early stopping
```

全組合せのfactorial explosionは避ける。各sensitivity axisを独立に識別できるone-factor-at-a-timeまたはsmall prespecified factorialを採用し、複数axisを曖昧な単一difficulty scoreへ圧縮しない。

一度Stage 1 scientific gridをfreezeした後、結果を理由にdepth / budget / quiescence条件を追加・削除・差替えしない。

## 10. Measurement families

### Best-move stability

- canonical-best exact agreement
- tie-aware best-move agreement
- reference-best retention / inclusion

### TopSet / Top-k stability

- exact TopSet equality
- TopSet intersection
- Jaccard overlap
- fixed Top-k overlap
- reference-best inclusion

### Ranking stability

- Spearman rank correlation
- Kendall rank correlation
- pairwise ordering agreement

合法手数不足またはtie prevalenceにより定義不能なmetricは事前規則で`not-estimable`として扱い、0へ置換しない。

### Score / gap stability

- best score change
- best-second gap sign / magnitude change
- score-domain transition
- evaluation-sign stability

Scoreをvalidated win probabilityとして解釈しない。

### Principal variation stability

technical validationに成功した場合のみ候補とする。

- PV first-move agreement
- common-prefix length
- normalized common-prefix fraction
- divergence ply

PV長が異なる場合の比較規則はStage 1前にfreezeする。

## 11. Phase / structural descriptors

最低限Namua / Mtajiをseparate strataとして報告する。

Secondary descriptorsとしてlegal-move count、capture availability、best-second gap、既存morphology等を使用できるが、search reliabilityをhuman difficulty constructへ再定義しない。Research Generation 1 classifier / thresholdのformal statusを変更しない。

## 12. Formal decision taxonomy

Study-level taxonomyは開始時点で次に固定する。

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE
```

Meaning:

- `CONFIRMED`: all identity / measurement / reproducibility / estimability gates PASS and the prospectively frozen Stage 2 scientific reliability criterion passes.
- `NOT-CONFIRMED`: all prerequisite gates PASS but the prospectively frozen Stage 2 scientific criterion fails.
- `INCONCLUSIVE`: any preregistered identity / measurement / reproducibility / estimability gate fails before the scientific criterion can be validly decided.

Stage 0 technical failure、workflow timeout、administrative infrastructure failureはscientific `NOT-CONFIRMED`へ変換しない。scientific instrumentを変えずに同一authorized populationを再実行できるexecution-only failure policyは、各Stage spec / authorizationで明示する。

Stage 1 readiness failure時はStage 2を`NOT-AUTHORIZED-NOT-EXECUTED`とし、Study-level closure labelはpreregistered gate semanticsに従い`INCONCLUSIVE`とする。numeric formal success criterionはStage 1 development後かつStage 2 outcome前に一度だけfreezeする。

## 13. Independent verification

Formal evidenceではproduction analysisだけに依存しない。independent verifierは可能な限り別実装で次を再構築する。

- fresh source generation replay
- authoritative RAW identity
- selected population
- exact legal moves / move keys
- search conditions
- per-move scores
- best move / TopSet / ranking
- PV（正式endpointに昇格した場合）
- selection / measurement hashes
- formal decision inputs

Productionとverifier間でdecision logicを安易に共有しない。

## 14. Hash / reproducibility contract

各Stageで最低限次を記録する。

```text
spec SHA-256
source-file SHA-256
authorization record
population / seed range
selection hash
measurement hash
artifact ZIP SHA-256
canonical result SHA-256
```

scientific generation開始後にsource変更が必要なら、scientific instrument変更かexecution-only変更かを判定し、前者なら新version / reauthorizationを必要とする。

## 15. No-rescue rule

Scientific outcome inspection後の以下は禁止する。

- sample追加 / seed extension
- favorable state replacement
- threshold relaxation
- primary metric substitution
- TopSet / tie tolerance変更
- search-grid差替え
- favorable subgroup選択
- failed gate例外化
- alternate primary relabeling
- prior-study rowのformal pooling

negative / null / inconclusive / non-estimable resultも正常なclosure outcomeとして保存する。

## 16. Research / engineering separation

G2-02は純粋なscientific Studyである。public AIを変更するか、AI-GEN lineageを昇格させるかは本Studyのendpointではない。研究結果がengineering inputになり得ても、そのtranslationは別engineering decisionとする。
