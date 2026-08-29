# STSCV-STUDY1 — 状態変換意味論とcanonicalizationの検証

Research Generation 2 `G2-03` — **State Transformation Semantics / Canonicalization Validation Study 1**。

## 状態

```text
Study = COMPLETE
Formal decision = INCONCLUSIVE
T01 = NON-ESTIMABLE
T02 = NON-ESTIMABLE
T03 = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

Stage 2のheld-out production measurementは完了しましたが、mandatory independent verifierがformal-result assembly中に失敗しました。

そのため、結果を見る前に固定していたglobal-failure ruleを適用し、Studyは`INCONCLUSIVE`、3 candidateすべては`NON-ESTIMABLE`で終了しています。

Production-onlyのzero-mismatch diagnosticはnon-decisional evidenceとして保存していますが、formal validationではありません。

## 最初に読む文書

1. `STUDY_1_OVERVIEW.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `CURRENT_STATUS.md`
4. `DECISION_REGISTER.md`
5. `REPRODUCIBILITY_INDEX.md`
6. `RESEARCH_LOG.md`
7. `STUDY_1_PROTOCOL.md` — original prospective protocol / historical contract

## 最終machine-readable result

- `results/STAGE_2_FORMAL_RESULT.json` — repository-facing fail-closed formal closure
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json` — failed Stage 2 workflow provenance
- `checkpoints/2026-08-28-stage2-fail-closed-closure.md` — closure checkpoint

## Stage 2 prospective contract

- `preregistration/STAGE_2_SPEC.json`
- `preregistration/STAGE_2_FIREWALL.json`
- `preregistration/STAGE_2_DECISION_RULE.json`
- `preregistration/STAGE_2_AUTHORIZATION.json`
- `results/STAGE_2_PREFREEZE_MANIFEST.json`
- `results/STAGE_2_PREFREEZE_WORKFLOW_PROVENANCE.json`

Explicit formal authorization commit:

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

Authorized Stage 2 workflow:

```text
run = 33145860098
job = 98766622115
conclusion = failure
```

Independent verifier failure:

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

同じevidenceに対するsource repair / rerunは行っていません。

## Earlier-stage record

Stage 0:

- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_0_WORKFLOW_PROVENANCE.json`

Stage 1:

- `preregistration/STAGE_1_CANDIDATE_CONTRACT.json`
- `preregistration/STAGE_1_SPEC.json`
- `preregistration/STAGE_1_AUTHORIZATION.json`
- `results/STAGE_1_PREFREEZE_MANIFEST.json`
- `results/STAGE_1_PREFREEZE_WORKFLOW_PROVENANCE.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1はdevelopment-onlyであり、formal candidate decisionを生成していません。

## representation boundary

Authoritative scientific input identityはRAW-onlyを維持します。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`は除外します。

Study closure時点の状態:

```text
canonicalization for scientific population identity = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
```

## upstream immutability

本StudyはG2-01、G2-02、SIP-STUDY1、ORISC-STUDY1、REWR-STUDY1、SSGTC-STUDY1、その他の完了済みStudyを変更・救済しません。

これらのtransformation hypothesisを将来formalに再検証する場合は、新しいprospective Studyまたは明示的に新しいversioned protocol、fresh authorization、fresh formal evidenceが必要です。
