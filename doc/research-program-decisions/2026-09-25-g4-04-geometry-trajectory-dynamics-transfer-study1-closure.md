# 2026-09-25 — G4-04 / GTTD-STUDY1 closure

## 正式状態

**`COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED`**

fixed 8-test family の最終内訳:

```text
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

G4-04 / `GTTD-STUDY1` は、G3-10でformal confirmationされたC1・C2・C3・C5のtrajectory-level directionを、fresh P1/P2 source-policy domainへprospectiveに移送検証する予定工程を完了した。

## 1. Canonical execution

```text
Stage 2 workflow run = 36095831961
attempt = 1
trigger commit = 97d8b374d6bfe1b573b915cd52974db6f6115423
durable lease commit = fcd1f68f8c65b2f6c3359bd8b37e1c1b12261161
artifact ID = 10849029913
artifact SHA-256 = fe165e6c1735cb07e71ed49e2a1c4d3f7446e796ab63936d90c7e982edfc4bd7
STAGE_2_RESULT.json SHA-256 = 85b5cf71c63dc9baeaf78a2dab4e61f03826b6f593552d916c5f48dcacd31d76
candidate manifest SHA-256 = 08df728a97e90a3bef84c24eb107871cf93b48af8fed961fa11b42bdd8febab3
formal measurements SHA-256 = d0273d35aacd3d9fe2f7223e96065cde356d2c7d6dc5effd581a3612c96d108c
formal inference SHA-256 = af41774be427efc2cb2f9340fc9cba8af8c1660918144041540f29a8b5c8fa7c
```

Stage 2 frozen seed blockは`40423001..40424024 / 1024`。canonical runで369 seedを読み、last seed readは`40423593`だった。authorized scientific executionsは1、actual scientific executionsも1であり、rerun、seed extension、post-access repair-and-rerunは行っていない。

P1/P2とも48 candidateを確保し、resource-eligibleはP1=47、P2=46。事前登録どおり各policyのfirst 32 eligible trajectoryを測定し、formal populationは64 trajectoryとなった。production / independent exact agreementは維持した。

## 2. Formal inference

formal testはnonzero trajectory contrastに対するexact two-sided binomial sign test。8 testを単一のfixed Holm-Bonferroni family、family alpha exact `1/20`で評価した。

| Test | Endpoint | + | - | tie | nonzero | Median direction | Holm adjusted p | Decision |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| P1-C1 | C1 directionality/path efficiency | 31 | 1 | 0 | 32 | POSITIVE | 33 / 268435456 | `GENERALIZATION-CONFIRMED` |
| P1-C2 | C2 persistence lag-distance gradient | 30 | 2 | 0 | 32 | POSITIVE | 2645 / 2147483648 | `GENERALIZATION-CONFIRMED` |
| P1-C3 | C3 return fraction | 3 | 24 | 5 | 27 | NEGATIVE | 1239 / 8388608 | `GENERALIZATION-CONFIRMED` |
| P1-C5 | C5 first-order directional path dependence | 25 | 7 | 0 | 32 | POSITIVE | 4514873 / 2147483648 | `GENERALIZATION-CONFIRMED` |
| P2-C1 | C1 directionality/path efficiency | 31 | 1 | 0 | 32 | POSITIVE | 33 / 268435456 | `GENERALIZATION-CONFIRMED` |
| P2-C2 | C2 persistence lag-distance gradient | 31 | 1 | 0 | 32 | POSITIVE | 33 / 268435456 | `GENERALIZATION-CONFIRMED` |
| P2-C3 | C3 return fraction | 2 | 25 | 5 | 27 | NEGATIVE | 379 / 16777216 | `GENERALIZATION-CONFIRMED` |
| P2-C5 | C5 first-order directional path dependence | 26 | 6 | 0 | 32 | POSITIVE | 1149017 / 1073741824 | `GENERALIZATION-CONFIRMED` |

8 testすべてでminimum nonzero=20を満たし、Holm補正後もfamily alpha `1/20`を通過した。

## 3. Claim別の結論

### C1 — directionality / path efficiency

P1・P2とも`GENERALIZATION-CONFIRMED`。G3-10で確認されたpositive directionは、本Studyのfresh source-policy domainsでも同方向でformalに再現した。

### C2 — persistence / lag-distance gradient

P1・P2とも`GENERALIZATION-CONFIRMED`。G3-10のpositive persistence directionは、本Studyのfresh source-policy domainsでもformalに再現した。

### C3 — return fraction

P1・P2とも`GENERALIZATION-CONFIRMED`。G3-10で確認されたnegative directionは、本Studyでもmedian directionがNEGATIVEとなり、formalに再現した。

### C5 — first-order directional path dependence

P1・P2とも`GENERALIZATION-CONFIRMED`。G3-10のpositive directionは、本Studyのfresh source-policy domainsでもformalに再現した。

## 4. Overall interpretation

G3-10で確認されたC1・C2・C3・C5の4 trajectory-level directionは、今回prospectiveに固定したP1/P2 fresh source-policy domainsにおいて、**8/8 formal testsすべてで同方向に移送された**。

これはG3-10の結果が単一source-generation条件にだけ依存した現象ではないことを支持する。一方で、本Studyはformal domainをP1/P2 full trajectoriesへ限定している。

したがって、以下を主張しない。

- RF1/RF2ごとのformal subgroup generalization
- 任意のsource policyへの普遍的一般化
- whole-Bao state space全体へのuniversal law
- C4 circulation/hysteresis-like claimのpositive transfer

C4はG3-10で`NOT-CONFIRMED`であり、本Studyのpositive transfer targetではない。

## 5. Interpretation boundary

本Studyが検証したのは`CRCLGR-R1-EXACT-SQUASHED-L1`に基づくbounded local geometry trajectory dynamicsのtransferabilityである。

次を意味しない。

- game-theoretic valueやbest move correctness
- AI棋力・勝率の改善
- 人間が感じる難しさ
- trajectory geometryが因果的に勝敗を決めること
- public AIを変更すべきこと
- G4-04外の任意domainへの無条件な一般化

formal resultを公開AI engineeringへ自動変換しない。

## 6. Integrity / one-shot boundary

Stage 2 final authorizationはfresh access前に`GTTD-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`として固定した。24-file preexecution binding、canonical Stage 1 artifact、G3-10/G4-01 identity firewall、seed-free preflight、durable repository leaseをfresh read前に検証した。

trigger commitは`STAGE_2_ACTIONS_EXECUTION_TRIGGER.json`だけを変更するsingle-purpose commitである。canonical run内でもfresh read直前にseed-free preflightを再実行しPASSした。

G3-11 depth-10をrerunせず、G4-10 depth-11へアクセスしていない。同一Stage/versionのrerun、seed extension、trajectory replacement、root-family subgroup rescueは認可しない。

## 7. Closure decision

**G4-04 / `GTTD-STUDY1` を `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED` として閉じる。**

このStudyをrepair、rerun、seed-extensionしない。追加のtransfer boundaryを検証する場合は、結果後の救済ではなく新しいprospective Studyとして別authorizationを必要とする。

`main`統合はこのclosureとは別の操作であり、ユーザーの明示指示があるまで行わない。public AI変更も認可しない。

## 8. Durable repository evidence

- [`../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../geometry-trajectory-dynamics-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../geometry-trajectory-dynamics-transfer/STUDY_1_PROTOCOL.md`](../geometry-trajectory-dynamics-transfer/STUDY_1_PROTOCOL.md)
- [`../geometry-trajectory-dynamics-transfer/authorizations/STAGE_2_FINAL_AUTHORIZATION.json`](../geometry-trajectory-dynamics-transfer/authorizations/STAGE_2_FINAL_AUTHORIZATION.json)
- [`../geometry-trajectory-dynamics-transfer/executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json`](../geometry-trajectory-dynamics-transfer/executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json)
