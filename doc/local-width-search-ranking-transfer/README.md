# G4-03 — Local Width / Search-Ranking Transfer Study 1

Program: `Research Generation 4 / G4-03`  
Study ID: `LWSRT-STUDY1`  
Branch: `research/g4-03-width-ranking-transfer`  
状態: **`COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE`**

正式日本語題目:

**Baoのroot legal widthとsearch ranking変化の移送可能性研究1 — fresh source policy・reachable-root family・phase strataにおけるG3-07 confirmed associationのprospective再検証**

## 結論

G3-07で確認された、`root legal width` HIGH stratumで`ranking-preorder change`が多いという非因果的associationを、G4-01でcompatibilityを確認したfresh domainsへ移送した。

Stage 2 fixed 12-test familyの最終結果は次のとおり。

```text
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

- `SC1 DEPTH`: 4/4 domainで`GENERALIZATION-CONFIRMED`
- `SC2 NODE-BUDGET`: P1×RF1 / P1×RF2で`GENERALIZATION-CONFIRMED`、P2×RF1 / P2×RF2はMtaji support不足で`NON-ESTIMABLE`
- `SC3 QUIESCENCE`: 3/4 domainで`GENERALIZATION-CONFIRMED`、P2×RF2は`NOT-GENERALIZED`
- 反対方向のformal counterexampleは確認されなかった

したがって、対象associationは本Studyのfresh domainsで**広く移送可能だったが、無条件・普遍的ではない**。support不足domainと、Holm補正後にformal confirmationへ届かなかったdomainが存在する。

## Canonical Stage 2 execution

```text
workflow run = 35993172710 / attempt 1 / success
seed block = 40322001..40323536 / 1536
fresh reads = 1536 / exactly once
selected roots = 192 / 192
production / independent exact = true
stage disposition = STAGE2-COMPLETE-WITH-NON-ESTIMABLE
artifact ID = 10805571797
artifact SHA-256 = c4449f9a034f30a501f60c6ee90b07426bd1c42aa3b0bbc150fd8d3e1199b597
STAGE_2_RESULT.json SHA-256 = 88dd8c2e586f36692d5d0cb1d66847affe0151a803f9230eb7d8425f93469bf3
```

final authorizationはfresh access前に`LWSRT-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`として固定した。専用trigger、24-file frozen binding、identity firewall、seed-free preflight、durable repository leaseを通過した後に一回だけ本実行した。

rerun、seed extension、root replacement、threshold relearningは行っていない。G3-11 depth-10 / G4-10 depth-11 protected evidenceにもアクセスしていない。

## Study structure

### Stage 0

technical-only validation。source replay、anchor selection、width threshold boundary、search production/independent exactness、exact inference arithmeticなどを検証し`STAGE0-PASS`。

### Stage 1

`40312001..40312768` / 768 fresh development seedsを一回だけ使用。16 strataすべてで`8 HIGH + 8 LOW`、合計128 rootsを確保し、SC1/SC2/SC3 endpointは128/128 defined。Stage 1ではeffect direction、risk difference、p-value、generalization/counterexample decisionを生成しなかった。

### Stage 2

`40322001..40323536` / 1536 fresh formal held-out seedsを一回だけ使用。各`policy × root-family × phase`で`12 HIGH + 12 LOW`、計192 rootsを固定selectionした。

各domainでNamua/Mtajiのexact hypergeometric PMFをconvolutionし、3 contrasts × 4 domains = 12 testsを単一Holm-Bonferroni family、FWER `1/20`で評価した。

## Interpretation boundary

本Studyが検証したのはroot legal widthとdeterministic search-condition間のranking-preorder changeの**associationのtransferability**である。

次を検証していない。

- best move correctness
- game-theoretic value
- AI棋力や勝率
- 人間の難しさ
- causal mechanism
- どちらのsearch conditionが「正しい」か

`GENERALIZATION-CONFIRMED`はこの固定domain・固定contrast・固定endpointにおける統計的な移送確認であり、whole-Bao universal lawを意味しない。`NON-ESTIMABLE`はnegative evidenceではない。`NOT-GENERALIZED`も反対方向のcounterexampleと同義ではない。

研究結果は公開AIの採用判断と分離する。public AI変更は認可していない。

## 正本

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
3. [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
4. [`authorizations/STAGE_2_FINAL_AUTHORIZATION.json`](authorizations/STAGE_2_FINAL_AUTHORIZATION.json)
5. [`executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json`](executions/STAGE_2_ACTIONS_EXECUTION_LEASE.json)
6. [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
7. [`../research-program-decisions/2026-09-24-g4-03-local-width-search-ranking-transfer-study1-closure.md`](../research-program-decisions/2026-09-24-g4-03-local-width-search-ranking-transfer-study1-closure.md)

## Main integration

G4-03の研究作業は完了しているが、研究ブランチは`main`から隔離したままである。`main`統合はユーザーの明示指示があるまで行わない。
