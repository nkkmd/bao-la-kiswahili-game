# Practical Comeback / Error-Inducing Move Study 1 — Overview

更新日: 2026-08-25  
Status: **STUDY 1 COMPLETE**

## 研究題目

> **Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証**

Working English title: **Practical Comeback / Error-Inducing Move Study 1**  
Study ID: `PCEM-STUDY1`

## 結論

本Studyは、prospectively defined disadvantaged rootsにおいて、strong/reference-policy上のmove qualityと、frozen imperfect-opponent policy下のbounded-horizon empirical comeback frequencyを分離して測定した。

Stage 1 exploratory discoveryは独立再計算を含めて成功したが、frozen promotion ruleを通過したcandidate classは0件だった。

```text
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
candidateAuditCount = 55
promotedCandidateCount = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

したがって、PCEM-STUDY1は「実用的な勝負手クラスを確認した」とは結論しない。

## Stage 1 evidence

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2764
selectedRoots = 300
Namua roots = 150
Mtaji roots = 150
exactRootMoveInterventions = 1065
primaryContinuationRows = 12780
secondaryContinuationRows = 4260
referenceContinuationRows = 1065
totalContinuationRows = 18105
primaryAdministrativeHorizonExhaustions = 2
```

All frozen readiness gates passed.

## Independent verification

Canonical workflow run `32820391017` completed successfully. The independent implementation reproduced:

- all 3072 source games;
- root selection;
- RAW-ONLY state identity;
- all selected-root measurements;
- candidate discovery and promotion result.

```text
independent decision = TECHNICAL-PASS
independence = true
sourceReplay = true
selection = true
rawIdentity = true
measurement = true
discovery = true
stage1ResultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

## Why no candidate was promoted

55 prospectively bounded candidate definitions were audited under templates `PCEM-T1..T8`. Every candidate failed at least one frozen promotion gate.

Most importantly, all 55 failed each of the following support requirements:

```text
minimumUniqueRoots
minimumUniqueHistoricalTrajectories
minimumDistinctOpeningPrefixes
minimumUniqueRootsContributingErrorCondition
minimumUniqueRootsContributingDefenseCondition
```

Some candidate definitions passed individual machine-error-dependence or reply-concentration gates, but none passed the full conjunction of support, diversity, primary comeback-difference, and error-dependence requirements. Near-miss promotion is forbidden.

## Construct separation retained

The study kept the following quantities separate:

```text
A. strongest/reference-policy quality
B. bounded-horizon empirical comeback frequency under frozen imperfect opponent
C. successful-defense reply-set narrowness
D. opponent-error dependence
E. machine-operational reply difficulty / punishment concentration
F. move optimality gap
```

## Representation boundary

Authoritative downstream state identity remained RAW-ONLY:

`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.

`turn` and `reason` were excluded. Missing `pending` was invalid before engine entry, seed conservation to 64 was mandatory, and no symmetry/canonicalization was used.

## Interpretation boundary

This study does **not** establish:

- objective move superiority;
- game-theoretic optimality;
- true Bao winning probability;
- effectiveness against all opponent strengths;
- human difficulty, deception, pressure, or psychology;
- expert/traditional recognition as a Bao “winning try”.

The zero-promotion result is specific to the frozen population, D3/D2 reference semantics, `P_MEDIUM_D1_TOP3` primary opponent, 96-ply bounded endpoint, candidate grammar, and promotion requirements.

## Upstream boundary

No formal decision, negative/null/inconclusive/non-estimable result, threshold, classifier, endpoint, population, or interpretation boundary from any completed upstream Bao study was changed or rescued.

## Canonical records

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `results/STAGE_1_EXPLORATORY_RESULT.json`
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json`
- `results/STAGE_2_NON_AUTHORIZATION.json`
- `checkpoints/2026-08-25-stage1-exploratory-complete-stage2-not-authorized.md`
