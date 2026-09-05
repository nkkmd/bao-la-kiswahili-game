# Practical Comeback / Error-Inducing Move Study 1 — Final Report （結論）

## 日本語での結論と読み方

Stage 1はEXPLORATORY-ONLYとして完了し、55 candidate auditsのうちpromotion 0件、Stage 2はNOT-AUTHORIZED-NOT-EXECUTEDである。勝負手や人間へのerror inductionを確認・否定した結果ではない。

以下には、Study closure時に固定した英語の詳細記録が含まれる。canonical decision token、数値、seed、hash、実行ID、authorization、evidence boundaryを再解釈しないため原文を保持している。初めて読む場合は`STUDY_1_OVERVIEW.md`と`CURRENT_STATUS.md`を先に参照する。

更新日: 2026-08-25  
Study ID: `PCEM-STUDY1`  
Status: **STUDY 1 COMPLETE**

## 1. 研究題目

**Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証**

Working English title: **Practical Comeback / Error-Inducing Move Study 1**

## 2. 結論

本StudyのStage 1 exploratory discoveryは、prospectively frozen designと独立再計算の下で完了した。

Canonical Stage 1 result:

```text
scientificLabel = EXPLORATORY-ONLY
candidateAuditCount = 55
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
manualPromotionPerformed = false
```

したがって、Stage 1でformal confirmationへ送るcandidate classは得られなかった。

Frozen zero-candidate ruleに従い、Stage 2は次の状態で終了する。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

これはtechnical failureではない。Stage 1のreadiness、production measurement、independent reconstructionはいずれも成功したうえで、prospectively frozen promotion criteriaを通過するcandidateが0件だったというexploratory resultである。

## 3. 研究設計の中心的分離

本Studyでは以下を同一概念にまとめなかった。

```text
A. strongest/reference-policy quality
B. bounded-horizon empirical comeback frequency under frozen imperfect opponent
C. successful-defense reply-set narrowness
D. opponent-error dependence
E. machine-operational reply difficulty / punishment concentration
F. move optimality gap
```

特に、reference best moveと、frozen imperfect opponentに対して実現するbounded comeback frequencyは別の量として扱った。

## 4. Authoritative state identity （識別と表現）

下流state identityはRAW-ONLYとし、次の7 fieldsのみをidentityに含めた。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn`と`reason`はidentityから除外した。`pending`はengine entry前必須であり、全accepted stateで

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

を要求した。

Symmetry reduction、seat swap、reflection canonicalization、quotient identity、transform-based deduplicationは使用していない。

## 5. Stage 0 （Stageの記録）

Stage 0はtechnical-only feasibility validationとして実行した。

Canonical Stage 0:

```text
stageId = PCEM-S0-TECHNICAL-2026-08-25-v1
workflowRunId = 32813154014
artifactId = 9550497573
decision = TECHNICAL-PASS
production gates = 12 / 12 PASS
independent verifier gates = 8 / 8 PASS
```

Stage 0はrepresentation、exact legal root move、first reply enumeration、D2/D3 reference search、seeded imperfect policy、asymmetric continuation、CRN binding、outcome accounting、independent verifier feasibilityを技術的に確認しただけであり、scientific effect/candidate evidenceとしては使用していない。

## 6. Stage 1 frozen design （方法と設計）

Stage 1は`PCEM-S1-EXPLORATORY-2026-08-25-v1`としてoutcome inspection前に固定した。

主要条件:

```text
source games = 3072
Stage 1 seeds = 23200001..23203072
reserved Stage 2 seeds = 23300001..23306144
root target = 300 (Namua 150 / Mtaji 150)
reference disadvantage = D3 bestScore < 0
root actor continuation = P_REFERENCE_D2_BEST
primary imperfect opponent = P_MEDIUM_D1_TOP3
primary replicates = 12 per exact root move
secondary replicates = 4 per exact root move
reference replicates = 1 per exact root move
bounded endpoint horizon = 96 post-root plies
candidate templates = PCEM-T1..T8
zeroPromotedCandidatesAllowed = true
manualPromotionAllowed = false
```

Root candidateは各trajectory内でassigned phaseにおけるhash rankによってreference score inspection前に1局面だけ選び、その後D3 `bestScore < 0`を満たす場合のみdisadvantaged root poolへ入れた。reference failure後のtrajectory内replacementは禁止した。

## 7. Stage 1 evidence accounting （Stageの記録）

Canonical run:

```text
workflowRunId = 32820391017
sourceCommit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
workflowConclusion = success
productionArtifactId = 9557783361
productionArtifactDigest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verifiedArtifactId = 9558356215
verifiedArtifactDigest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
```

Source/selection:

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2764
duplicateHistoricalTrajectoriesCollapsed = 308
unavailableAssignedPhase = 93
failedReferenceDisadvantage = 2004
disadvantagedBeforeRawStateCollapse = 667
duplicateDisadvantagedRawStatesCollapsed = 0
disadvantagedPoolNamua = 225
disadvantagedPoolMtaji = 442
selectedRoots = 300
selectedNamua = 150
selectedMtaji = 150
generatedDistinctOpeningPrefixes = 2262
selectedDistinctOpeningPrefixes = 287
```

All frozen selection/readiness gates passed.

Measurement accounting:

```text
exactRootMoveInterventions = 1065
primaryContinuationRows = 12780
secondaryContinuationRows = 4260
referenceContinuationRows = 1065
totalContinuationRows = 18105
primaryAdministrativeHorizonExhaustions = 2
```

## 8. Independent verification （日本語の要点）

Independent verifierはproduction PCEM measurement coreをimportせず、source generation、root selection、RAW identity、measurement、discoveryを再計算した。

Canonical independent result:

```text
decision = TECHNICAL-PASS
passed = true
independence = true
sourceReplay = true
selection = true
rawIdentity = true
measurement = true
discovery = true
gamesVerified = 3072
selectedRootsVerified = 300
rootMoveInterventionsVerified = 1065
candidateAuditCountVerified = 55
promotedCandidateCountVerified = 0
```

Stage 1 result hash:

```text
4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

Selection hash:

```text
5bf65534e88500b5d30565a1a9266664375a1d43b9a374b69aa7dd14c1409339
```

Discovery hash:

```text
3cd0df252036aa5794a7699b21d833e1f68b854cb8b5ec25ec59d65a314b81e8
```

## 9. Candidate promotion result （結果）

55 candidate definitions were audited under the frozen `PCEM-T1..T8` grammar. None passed all promotion gates.

最も重要なsupport resultは次の通りである。

```text
minimumUniqueRoots: 0 / 55 candidates passed
minimumUniqueHistoricalTrajectories: 0 / 55 passed
minimumDistinctOpeningPrefixes: 0 / 55 passed
minimumUniqueRootsContributingErrorCondition: 0 / 55 passed
minimumUniqueRootsContributingDefenseCondition: 0 / 55 passed
```

Frozen minimumsはそれぞれ、24 unique roots、24 unique historical trajectories、12 distinct opening prefixes、12 error-condition roots、12 defense-condition rootsであった。

その他のgate pass counts:

```text
minimumGenerationStrata: 12 / 55
maximumSingleGenerationStratumShare: 29 / 55
maximumSingleOpeningPrefixShare: 19 / 55
minimumMedianPrimaryComebackDifferenceVersusCanonicalBest: 5 / 55
minimumProportionRootsWithPrimaryComebackDifferenceAtLeast0_25: 4 / 55
minimumMedianExactFirstReplyReferenceErrorProbability: 28 / 55
maximumMedianReferenceDefenseMaintainedFraction: 55 / 55
minimumErrorConditionedReplicates: 15 / 55
minimumDefenseConditionedReplicates: 22 / 55
minimumPooledBoundedComebackDifferenceErrorMinusDefense: 35 / 55
```

一部candidateではconditional error/dependence metric自体は大きかった。しかしsupport・diversity・primary comeback-difference requirementsを同時に満たしていないため、post-outcomeに「near miss」「promising class」としてpromotionすることはしない。

## 10. Scientific interpretation （解釈）

本Studyから許可される解釈は限定的である。

- Frozen machine populationでは、strict-reference-inferior move、reply-defense concentration、first-reply reference-error dependenceを同時に扱うmeasurement systemは技術的・探索的に実行可能だった。
- 3072 fresh games、300 roots、1065 exact root movesの範囲で55 candidate definitionsが生成された。
- しかし、事前固定したsupport/diversity/effect/error-dependence promotion criteriaをすべて満たす再現可能なcandidate classは得られなかった。

したがって、PCEM-STUDY1は「実用的勝負手クラスを確認した」とは結論しない。

## 11. Unauthorized interpretations （解釈）

本Studyは以下を示さない。

- objectively superior move;
- game-theoretically optimal or winning move;
- true Bao winning probability;
- all-opponent-strength comeback effectiveness;
- human opponent error probability;
- human reply difficulty, deception, pressure, confusion;
- expert/traditional recognition as a Bao winning try;
- existence/nonexistence of practical comeback structures outside the frozen population, policies, horizons, grammar, and support rules.

## 12. Stage 2 disposition （Stageの記録）

Frozen promotion resultが0件なので、Stage 2は実行しない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
stage2GenerationAuthorized = false
reserved seeds 23300001..23306144 consumed = false
```

以下の救済は禁止される。

- promotion threshold relaxation;
- near-miss candidate promotion;
- favorable subgroup selection;
- candidate grammar expansion after outcome inspection;
- replacement of the frozen imperfect-opponent policy to obtain favorable results;
- reuse of Stage 1 rows as Stage 2 formal evidence.

## 13. Final study state （結論）

```text
PCEM-STUDY1 = COMPLETE
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

This terminal state does not alter or rescue any completed upstream Bao study.
