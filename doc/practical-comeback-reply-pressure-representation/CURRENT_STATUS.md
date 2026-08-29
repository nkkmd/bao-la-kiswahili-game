# PCRPR-STUDY1 — Current Status

更新日: 2026-08-29

## 研究識別

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline remote main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Branch = research/g2-07-practical-comeback-reply-pressure-representation
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

## 現在の正式状態

**STUDY CLOSED ON RESEARCH BRANCH / STAGE 1 TECHNICAL INVALID / STAGE 2 NOT AUTHORIZED / MAIN NOT INTEGRATED**

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
Stage 1 same-block rerun = NOT AUTHORIZED
Stage 1 repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
validated transform set = []
canonicalization = false
symmetry reduction = false
main integration = NOT PERFORMED
```

## Stage 0 canonical technical result

```text
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow run = 33238931893 / success
artifact = 9710763348
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
production mandatory gates = 18 / 18 PASS
independent gates = 9 / 9 PASS
technical rows = 9
scalar features per row = 80
exact cross-implementation equality = PASS
```

Stage 0はtechnical-onlyであり、scientific outcomeを生成していない。

## Stage 1 preauthorization

scientific block消費前に以下をすべてPASSした。

```text
production implementation smoke = run 33240901637 / PASS
resource preflight = run 33240989191 / PASS
independent exact smoke = run 33241110983 / PASS
source-freeze audit = run 33241372471 / PASS
source-freeze commit = eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237
spec SHA256 = 15aff7a35c7875c16a815ae0323b3726714b36941ce53ce4788f8947700b2f2c
computation contract SHA256 = 7f6d2c9a928392c557f31f35cd0e912ba8396055c9535872b698f8085bc282e9
feature dictionary SHA256 = 892624860ac22c722ad9877b8c93ba6c32536da98692fc6735cd86e43886ca4f
```

## Stage 1 authorization / consumption

```text
authorization commit = 64f0352e7d8b26432e2a68c408e403859c3e71bf
canonical workflow = 33241465899
authorize-and-consume job = 99071430645 / success
execution-start artifact = 9711478864
execution-start ZIP SHA256 = cf80f4b24ef9cf8996bcaa09ea4569c2030daa9640eacc0a9e864f76a35fc120
Stage 1 seed block = CONSUMED
```

consume-once gate成功後は、後続のproduction、independent replay、artifact transfer、final comparisonが失敗してもseed blockを未消費へ戻さない。

## Stage 1 production-only provenance

production jobは成功した。

```text
job = 99071451933 / success
artifact = 9714352893
artifact ZIP SHA256 = 36f0fae32f3ca9deec842602b0dbe87e933fd589643820f192c90d379b2f3b5b
production result SHA256 = dea825892090fe9b101a8bd25610c7f24b40c4aac79fd61faaff1d213a5cdf90
development core SHA256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
```

production summary:

```text
generated games = 3072
unique historical trajectories = 2757
selected roots = 400 / Namua 200 / Mtaji 200
development rows = 1429 / Namua 733 / Mtaji 696
selected family set = F05_ALL
selected lambda = 100
pooled OOF RMSE = 0.321056911294272
baseline OOF RMSE = 0.40121860916118934
relative RMSE improvement = 0.1997955629089787
pooled OOF Spearman = 0.5456632009097375
Namua OOF Spearman = 0.2897094224760121
Mtaji OOF Spearman = 0.700040881756042
top-quintile enrichment difference = 0.3337211308428414
support gates = PASS
performance gates = PASS
production disposition = STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION
```

これらはaccepted scientific resultではなく、**production-only unverified provenance**としてのみ保持する。

## Independent replay incident

```text
independent replay job = 99071451969
scientific replay step = success
artifact upload step = failure
final verification job = 99096549383 / skipped
```

replay計算はrunner teardown前に以下を報告した。

```text
generated games = 3072
selected roots = 400
rows = 1429
selected family set = F05_ALL
selected lambda = 100
independent development core SHA256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
independent result SHA256 = db7358d1308481fd4d9645fbffd79a319603ea7debd263bcaa98d2fa9fe35395
```

productionとindependentのdevelopment-core stdout hashは一致した。しかし`actions/upload-artifact`の`CreateArtifact` requestが5回連続timeoutし、full `independent-result.json` artifactは保存されなかった。

frozen final comparerはsource corpus、selection、rows、measurements、compact rows、model、final model、readinessまでfull objectsでexact比較することを必須としていたため、stdout一致だけを代替verificationとして採用できない。

## Final Stage 1 decision

事前固定したdecision mapping:

```text
technical/integrity/independent-verification failure
-> STAGE1-TECHNICAL-INVALID
```

mandatory full independent verificationが完了しなかったため、最終決定は:

```text
STAGE1-TECHNICAL-INVALID
```

で固定した。

このdecisionはreply-pressure representationの科学的否定を意味しない。同時に`F05_ALL`、`lambda=100`、production performanceをvalidated representation/modelとして採用することも禁止する。

Canonical records:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `STUDY_1_FINAL_REPORT.md`

## Immutable boundaries

`PCEM-STUDY1`のzero promotion / Stage 2 non-authorization、`RCPR-STUDY1`のStage 1 technical-invalidは変更しない。

machine reply pressureはhuman difficulty、deception、human error probability、psychological pressure、expert-perceived complexityを意味しない。

RAW identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外し、symmetry/canonicalizationは未承認のままである。

## 次の許可された工程

PCRPR-STUDY1について新しいscientific executionは行わない。Stage 2は開始しない。

研究branch上でclosure文書・workflow archival・関連indexの整合性を確認した後、main統合は**別途明示的な指示があるまで行わない**。

次の独立研究候補は`G2-08 — Machine Decision-Failure Taxonomy Study 1`だが、本研究closureとは分離して開始する。
