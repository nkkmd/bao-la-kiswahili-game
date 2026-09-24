# 2026-09-24 — G4-03 / LWSRT-STUDY1 closure

## 正式状態

**`COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE`**

固定12 test の最終内訳:

```text
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

G4-03 / `LWSRT-STUDY1` は、G3-07で確認された root legal width HIGH stratum と ranking-preorder change の association を、fresh source policy × reachable-root familyへprospectiveに移送検証する予定工程を完了した。

## 1. Canonical execution

```text
Stage 2 workflow run = 35993172710
attempt = 1
trigger commit = f52fcd5a16028bac8e97a5b714b87c72853628e4
durable lease commit = 3ca186b448460e42f9057fbef9a741982550bbaa
artifact ID = 10805571797
artifact SHA-256 = c4449f9a034f30a501f60c6ee90b07426bd1c42aa3b0bbc150fd8d3e1199b597
STAGE_2_RESULT.json SHA-256 = 88dd8c2e586f36692d5d0cb1d66847affe0151a803f9230eb7d8425f93469bf3
identity manifest SHA-256 = 9989a42656cac788e6d6207516103ba5f79678d4ba1d501fb2c676ef83ae1312
```

Stage 2 fresh seed block `40322001..40323536` / 1536 は、このcanonical runで一回だけ読み取った。authorized scientific executionsは1、actual scientific executionsも1であり、rerun、seed extension、root replacement、threshold relearningは行っていない。

192/192 rootsを固定selection contractに従って取得し、production / independent implementationはexact agreementを維持した。G3-11 depth-10およびG4-10 depth-11 protected evidenceにはアクセスしていない。

## 2. Formal inference

各`policy × root-family` domainについてNamua/Mtajiをstrataとし、phase-wise exact hypergeometric PMFをconvolutionした。12 testを単一のfixed Holm-Bonferroni family、FWER `1/20`で評価した。

| Contrast | Domain | Decision | Direction | Risk difference | exact p | Holm adjusted p |
| --- | --- | --- | --- | ---: | ---: | ---: |
| SC1-DEPTH | P1×RF1 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.625000 | 2.12968677e-05 | 0.000191671809 |
| SC1-DEPTH | P1×RF2 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.458333 | 0.00136060844 | 0.00952425910 |
| SC1-DEPTH | P2×RF1 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.625000 | 1.73853830e-05 | 0.000173853830 |
| SC1-DEPTH | P2×RF2 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.541667 | 0.000320637559 | 0.00256510047 |
| SC2-NODE-BUDGET | P1×RF1 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.666667 | 7.88441682e-07 | 8.67285850e-06 |
| SC2-NODE-BUDGET | P1×RF2 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.750000 | 8.17355619e-08 | 9.80826742e-07 |
| SC2-NODE-BUDGET | P2×RF1 | `NON-ESTIMABLE` | — | — | — | 1.0* |
| SC2-NODE-BUDGET | P2×RF2 | `NON-ESTIMABLE` | — | — | — | 1.0* |
| SC3-QUIESCENCE | P1×RF1 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.458333 | 0.00297695919 | 0.0148847960 |
| SC3-QUIESCENCE | P1×RF2 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.458333 | 0.00228544856 | 0.0137126914 |
| SC3-QUIESCENCE | P2×RF1 | `GENERALIZATION-CONFIRMED` | HIGHER-IN-HIGH | 0.458333 | 0.00297695919 | 0.0148847960 |
| SC3-QUIESCENCE | P2×RF2 | `NOT-GENERALIZED` | HIGHER-IN-HIGH | 0.333333 | 0.0316829217 | 0.0950487652 |

`*` `NON-ESTIMABLE` slotの1.0はfixed-12 multiplicity bookkeepingのための保守的placeholderであり、scientific p-valueではない。

## 3. Claim別の結論

### SC1 — DEPTH

4/4 fresh domainsで`GENERALIZATION-CONFIRMED`。

G3-07で確認された「root legal width HIGHでdepth contrastに対するranking-preorder changeが多い」というassociationは、本Studyで使用したP1/P2 × RF1/RF2の全fresh domainにおいて同方向でformalに再現した。

### SC2 — NODE-BUDGET

P1×RF1、P1×RF2は`GENERALIZATION-CONFIRMED`。

P2×RF1、P2×RF2は`NON-ESTIMABLE`。両方ともMtaji phaseでpreregistered `minimum changed = 6` を満たさず、formal effect testを成立させないという事前規則を適用した。

したがってP2系domainについて「一般化しなかった」「反対方向だった」と解釈してはならない。formal判定に必要なphase supportが不足した、という限定的な結論である。

### SC3 — QUIESCENCE

P1×RF1、P1×RF2、P2×RF1は`GENERALIZATION-CONFIRMED`。

P2×RF2は`NOT-GENERALIZED`。観測方向自体は`HIGHER-IN-HIGH`でrisk difference `0.333333...`、raw exact pは`0.0316829...`だったが、fixed 12-test Holm補正後pは`0.0950488...`であり、事前登録済みFWER `0.05`を通過しなかった。

これは反対方向のcounterexampleではない。

## 4. Overall interpretation

G4-03の対象範囲では、G3-07のpositive associationは**広いが完全ではない移送可能性**を示した。

- estimable 10 test中9 testが`GENERALIZATION-CONFIRMED`
- 1 testが`NOT-GENERALIZED`
- 2 testはsupport不足で`NON-ESTIMABLE`
- `COUNTEREXAMPLE-CONFIRMED`は0

特にdepth contrastは4/4 domainで再現し、node-budget contrastはP1 domainsで強く再現した。quiescence contrastは3/4 domainで再現し、P2×RF2だけがHolm補正後のformal confirmationに届かなかった。

この結果から、root legal width HIGHとranking-preorder changeの関係をwhole-Bao universal lawとして扱ってはならない。source policy、root family、phase、search contrastによってformal supportの強さとestimabilityが異なる。

## 5. Interpretation boundary

本Studyが検証したのは、deterministic search-condition間のranking-preorder changeとroot legal widthの**非因果的associationのtransferability**である。

次を意味しない。

- HIGH-width局面が「難しい」と人間に感じられること
- HIGH-width局面でAIが必ず悪手を指すこと
- depth / node-budget / quiescenceの一方がtruthまたはbest searchであること
- game-theoretic value、best move correctness、勝率、AI棋力の改善
- public AIを変更すべきこと
- G3-07やG4-03外の任意domainへの普遍的一般化

formal resultを公開AIの採否へ自動変換しない。

## 6. Integrity / one-shot boundary

Stage 2 final authorizationはfresh access前に`LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`として固定した。trigger commitはtrigger fileのみを変更し、pre-freshで24個のbound blob、canonical Stage 1 artifact、upstream firewalls、Stage 2 seed-free preflightを再検証した。

最初のStage 2 fresh seed readより前にdurable repository execution leaseを取得した。run完了後のre-runは認可されない。

## 7. Closure decision

**G4-03 / `LWSRT-STUDY1` を `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE` として閉じる。**

このStudyをrepair、rerun、seed-extensionしない。同じ科学的問いを追加検証する場合は、結果後の救済ではなく新しいprospective Studyとして別authorizationを必要とする。

`main`統合はこのclosureとは別の操作であり、ユーザーの明示指示があるまで行わない。public AI変更も認可しない。

## 8. Durable repository evidence

- [`../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../local-width-search-ranking-transfer/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../local-width-search-ranking-transfer/STUDY_1_PROTOCOL.md`](../local-width-search-ranking-transfer/STUDY_1_PROTOCOL.md)
- [`../local-width-search-ranking-transfer/authorizations/STAGE_2_FINAL_AUTHORIZATION.json`](../local-width-search-ranking-transfer/authorizations/STAGE_2_FINAL_AUTHORIZATION.json)
- [`../local-width-search-ranking-transfer/executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json`](../local-width-search-ranking-transfer/executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json)
