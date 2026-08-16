# Tactical Motif Human / Expert Validation Study 1 — Research Plan

Updated: 2026-08-16  
Status: **STAGE 0 DESIGN / PRE-HUMAN / PRE-FORMAL**

## 1. Primary research question

> TM-S2-C03に対応する局面横断的move principleは、Baoの熟練者によって、opening sequenceに依存しない再利用可能なtactical motif / tesujiとして認識されるか。

## 2. What this study does not do

本研究はTactical Motifs Study 1の再解析・救済・再定義ではない。以下は変更禁止である。

- C01/C02/C03/C04 formal decisions
- C03 candidate key / precondition / move abstraction / consequence
- prior endpoints, thresholds, seed blocks, gates, populations
- prior interpretation boundaries

`traditional tesuji`、歴史的伝承、初心者教育価値、普遍的Bao戦略原理は本研究のformal claim対象外。

## 3. Construct hierarchy

### Primary — Cross-position principle discrimination

異なるtrajectory / opening由来のC03 statesを、matched controlsよりも同一の再利用可能なmove-selection principleとして識別する能力。

### Secondary A — Move-choice recognition

individual C03 stateで、expertがC03 matching move abstractionを有力候補として選択するか。

### Secondary B — Tesuji-label recognition

後段の非誘導順序を守ったlabel taskで、構造を`tesuji / reusable local principle / position-specific best move / joseki component / coincidental similarity / other`のどれとして分類するか。

### Secondary C — Transfer-consistent explanation

別局面にも適用可能な理由として説明するか。

### Exploratory — Explanation ontology agreement

自由記述に`reusable pits`, rightward row-1 takata, nyumba preservation/transformation, position-transfer rationale等に対応する内容が現れるか。coding schemeはformal data前に固定し、独立coderを確保できなければexploratory onlyとする。

## 4. Why the primary is not move-choice alone

C03 matching moveを選ぶだけでは、participantが局面横断的な共通原理を認識しているか分からない。best/strong move recognitionとtransferable motif recognitionを分離するため、cross-position discriminationをprimary、move-choiceをsecondaryに置く。

## 5. Participant definition

Primary expert cohortは18歳以上とし、outcome-blindな経験基準とC03非関連competence screenを満たす者に限定する。詳細は`EXPERT_ELIGIBILITY.md`。

C03 Study 1のformal definition/resultを事前に知っていた参加者はprimary confirmatory cohortから除外し、必要ならseparate exploratory exposed cohortとしてのみ扱う。

## 6. Stimulus strategy

Stage 1でfresh/non-overlapping machine corpusを作る。Stage 2 Study 1 rootsをhuman formal stimuliへ直接再利用しない。

Primary formal stimuliはposition-onlyを原則とし、opening historyを見せない。全target/control positionはdistinct historical trajectories、distinct rule statesを要求する。primary/secondary task間のformal position reuseも禁止する。

詳細は`STIMULUS_AND_BLINDING_PLAN.md`。

## 7. Controls

Primary controlsはC01/C02/C04ではなく、fresh poolからprospectively構成するC03 near-miss controlsとする。

Control classes候補:

1. precondition-only near miss — `reusablePits=0-2`だがC03 move abstractionが利用不能
2. move-only near miss — C03 move abstractionが利用可能だが`reusablePits=0-2`を満たさない
3. direction/morphology near miss — Mtaji row-1 takataの局所構造を共有するがcanonical rightward C03 combinationを満たさない

C01/C02/C04はsecondary calibration候補としてのみ利用できる。machine negativeとhuman negativeを同一視しない。

## 8. Blinding and task order

Formal task order:

1. primary cross-position discrimination
2. move-choice task on non-overlapping positions
3. free-text rationale
4. explicit label / `tesuji` classification

participantへ先に`C03`, `reusablePits=0-2`, `rightward takata`, `nyumba consequence`, `machine-confirmed`, `tesuji`を教えない。

## 9. Primary formal statistical unit

Raw responseは`participant × block`だがprimary inferential unitは**participant**。

各participantについてprimary block accuracyを集約し、`score > 0.5`をparticipant-level successとする。formal inferenceはparticipant-level success prevalenceが0.5を超えるかをexact one-sided binomialで検定する計画とする。詳細は`STATISTICAL_ANALYSIS_PLAN.md`。

## 10. Estimability

Planned minimum primary experts: `10`.

Planned primary blocks per participant: `12`.

Primary inclusionには最低`10/12` usable blocksを要求する。minimum expert count未達なら`INCONCLUSIVE-NOT-ESTIMABLE`で停止し、expert criterion・endpoint・alphaを緩めない。

## 11. Formal label vocabulary

```text
HUMAN-EXPERT-VALIDATED
NOT-HUMAN-EXPERT-VALIDATED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Historical machine axisは独立に保持する。

Example:

```text
machineEvidence = CONFIRMED
humanExpertEvidence = NOT-HUMAN-EXPERT-VALIDATED
```

は有効な最終状態である。

## 12. Ethics/privacy

scientific recruitment前にconsent、data inventory、pseudonymization、withdrawal、retention、quotation permission、public/private boundaryを固定する。raw identifiable dataはpublic repositoryへ入れない。詳細は`ETHICS_AND_DATA_GOVERNANCE.md`。

## 13. Stage plan

### Stage 0 — complete

Repository recovery、construct decomposition、technical feasibility、participant/statistics/ethics design。human dataなし。

### Stage 1 — planned

Fresh machine corpus、stimulus/control matching、identity audit、renderer/questionnaire、technical/non-scientific dry run。instrument pilotを行う場合、そのresponseはformal endpointへ再利用しない。

### Stage 2 — blocked until preregistration

participants、stimuli、primary endpoint、secondary endpoints、exact test、alpha、exclusion、missing data、stopping、no-rescue、source hashesをmachine-readableにfreezeしてからhuman data collectionを開始する。

## 14. No-rescue

formal human data collection開始後、expert definition、sample inclusion、stimulus set、C03 definition、matching、primary/secondary、alpha、test、response categories、free-text ontologyをoutcomeに応じて変更しない。exploratory analysisはformal resultから分離する。
