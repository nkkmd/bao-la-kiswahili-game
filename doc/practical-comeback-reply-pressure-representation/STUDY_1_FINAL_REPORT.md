# Practical Comeback / Reply-Pressure Representation Study 1 — 最終報告

更新日: 2026-08-29

## 研究識別

```text
Program label = G2-07
Study ID = PCRPR-STUDY1
Research Generation = Research Generation 2
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Research branch = research/g2-07-practical-comeback-reply-pressure-representation
```

日本語作業表記:

**Baoにおける実戦的逆転可能性とreply pressureの豊かな機械表現の構築・prospective検証 — reply-set width, defense-maintaining reply fraction, reply-quality distribution, punishment concentration, and opponent-policy sensitivity によるpractical comeback structureの再現可能な記述**

## 最終決定

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block 28710001..28713072 = CONSUMED
same-block rerun = NOT AUTHORIZED
repair / replacement / extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed block 28810001..28816144 = RESERVED / UNCONSUMED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

本研究はStage 1で閉じる。productionと構造的に独立したreplayはどちらも科学計算そのものを完走し、3072 games、400 roots、1429 rows、`F05_ALL`、`lambda=100`、同一の`developmentCoreSha256`を報告した。しかしindependent replayのfull result artifactがGitHub Actionsのartifact transport timeoutにより保存されず、prospectively必須としたfull final exact comparerを実行できなかった。

したがって、これはrepresentationの科学的否定ではない一方、production-only resultをaccepted Stage 1 evidenceへ昇格させることもできない。事前固定したfailure semanticsに従い、最終決定は`STAGE1-TECHNICAL-INVALID`である。

## 研究課題

本研究は、完了済み`PCEM-STUDY1`の55 candidate audits / promoted 0という結果を救済せず、新しいreply-pressure representationをfresh evidence上で構成し、machine-operational practical comeback structureを再現可能に記述できるかを問う独立研究として開始した。

対象とした表現には、reply-set width、defense-maintaining reply fraction、reply-quality distribution、punishment concentration、best-reply gap、forcing structure、reply branch asymmetry、reply search stability、opponent-policy sensitivity、root-move reference context、local tactical context、local temporal contextを含めた。

本研究のmachine reply pressureは、人間の難しさ、錯覚、欺瞞、誤答確率、心理的圧力、expert-perceived complexityとは同一視しない。

## 既存研究との境界

以下は本研究によって変更されない。

```text
PCEM-STUDY1 promoted candidates = 0
PCEM Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
RCPR-STUDY1 Stage 1 = STAGE1-TECHNICAL-INVALID
RCPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

PCEM grammarの拡張、near-miss promotion、threshold relaxation、favorable subgroup、opponent-policy substitution、RCPR consumed blockの救済はいずれも行っていない。

## RAW state identity

authoritative state identityはRAW-onlyを維持した。

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0 — technical validation

Stage 0は科学outcomeを生成しないtechnical-only validationとして実施した。

```text
Stage ID = PCRPR-S0-TECHNICAL-2026-08-29-v1
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow run = 33238931893 / success
artifact = 9710763348
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
production mandatory gates = 18 / 18 PASS
independent gates = 9 / 9 PASS
technical rows = 9
scalar features per row = 80
```

G2-06の浮動小数点順序問題を事前technical lessonとして取り込み、exact move/reply lexical ordering、deterministic binary64 accumulation、big-endian binary64 encoding、integer-like key adversarial controls、reply-order permutation controlsを固定した。productionとindependentのfeature/vector equalityはexactにPASSした。

Decision:

```text
STAGE0-TECHNICAL-PASS
```

これはG2-06のformal decisionを救済しない。

## Stage 1 — prospective development freeze

scientific outcome生成前に以下を固定した。

```text
Stage ID = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
source games = 3072
fresh seeds = 28710001..28713072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
root target = 400 / Namua 200 / Mtaji 200
rows = selected historical root occurrence × all exact legal root moves
maximum post-root horizon = 96 plies
strong opponent = canonical D2 best / 1 replicate
medium opponent = seeded D1 top3 / 16 replicates
weak opponent = seeded uniform exact replies / 8 replicates
primary target = medium bounded-win rate - strong bounded-win indicator
model = deterministic ridge linear regression
CV = 5-fold grouped by historicalTrajectoryHash
```

80 scalar featuresは12のprospectively declared familyに属し、continuation/future outcome由来のclass-D情報はpredictorから禁止した。

Stage 1 contract hashes:

```text
STAGE_1_DEVELOPMENT_SPEC.json SHA256 = 15aff7a35c7875c16a815ae0323b3726714b36941ce53ce4788f8947700b2f2c
STAGE_1_COMPUTATION_CONTRACT.json SHA256 = 7f6d2c9a928392c557f31f35cd0e912ba8396055c9535872b698f8085bc282e9
FEATURE_DICTIONARY.md SHA256 = 892624860ac22c722ad9877b8c93ba6c32536da98692fc6735cd86e43886ca4f
```

最初のspec commit直後に`F03_REPLY_POLICY`が`F04_ALL_NO_TEMPORAL`と重複している記述上の欠陥を検出した。これはimplementation validation、authorization、scientific seed consumption、scientific outcome観測のすべてより前に修正し、machine-readable specへpre-outcome correctionとして記録した。

## preauthorization validation

scientific blockを消費する前に以下がPASSした。

```text
production implementation smoke = run 33240901637 / PASS
resource preflight = run 33240989191 / PASS
independent exact smoke = run 33241110983 / PASS
source-freeze audit = run 33241372471 / PASS
source-freeze commit = eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237
```

independent smokeではsource corpus、root selection、row identity、80-feature representation、reduced continuation、development core、final fitがexact一致した。

resource preflightはtechnical-only seedsを用い、target prevalenceを観測せずに実行時間とRSSを評価した。

## explicit authorizationとconsume-once境界

Stage 1 authorization commit:

```text
64f0352e7d8b26432e2a68c408e403859c3e71bf
```

canonical workflow:

```text
run = 33241465899
```

consume-once gate:

```text
job = 99071430645 / success
execution-start artifact = 9711478864
artifact ZIP SHA256 = cf80f4b24ef9cf8996bcaa09ea4569c2030daa9640eacc0a9e864f76a35fc120
```

このgate成功時点で`28710001..28713072`は永久にCONSUMEDとなった。事前のexecution addendumは、gate後にproduction、independent replay、artifact upload、final comparisonのいずれが失敗してもblockを未消費へ戻さないことを明記している。

## Stage 1 production

production job:

```text
job = 99071451933 / success
artifact = 9714352893
artifact ZIP SHA256 = 36f0fae32f3ca9deec842602b0dbe87e933fd589643820f192c90d379b2f3b5b
production result SHA256 = dea825892090fe9b101a8bd25610c7f24b40c4aac79fd61faaff1d213a5cdf90
development core SHA256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
```

production-only output:

```text
generated games = 3072
unique historical trajectories = 2757
generated distinct opening prefixes = 2272
selected roots = 400
Namua / Mtaji = 200 / 200
development rows = 1429
Namua / Mtaji rows = 733 / 696
selected distinct opening prefixes = 386
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
```

production dispositionは:

```text
STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION
```

であった。

これらは**production-only unverified provenance**であり、accepted scientific Stage 1 resultではない。

## mandatory independent replay

independent replay job:

```text
job = 99071451969
scientific replay step = success
artifact upload step = failure
```

runner teardown前のterminal stdout:

```text
generated games = 3072
selected roots = 400
rows = 1429
reported disposition = STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION
selected family set = F05_ALL
selected lambda = 100
independent development core SHA256 = 4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
independent result SHA256 = db7358d1308481fd4d9645fbffd79a319603ea7debd263bcaa98d2fa9fe35395
```

したがって、terminal summaryのdevelopment coreはproductionと一致した。

しかし、直後の`actions/upload-artifact@v4`で`CreateArtifact` requestが5回連続timeoutし、`independent-result.json`はGitHub artifactとしてmaterializeされなかった。

## なぜstdout一致だけではPASSにできないか

frozen final comparerはdevelopment-core hashだけでなく、以下をfull production/independent result objectからexact比較するよう事前固定していた。

```text
same workflow run
source corpus
root selection
rows
measurements
compact rows
development core
selected model
final model
readiness/support/performance
production/independent disposition
Stage 2 authorization state
```

independent full artifactが存在しないため、final verification job `99096549383`はskippedとなり、このmandatory comparerを実行できなかった。

artifact upload failure後に、stdoutだけを代替verificationとして採用する、artifact uploadだけをrerunする、independent replayを再実行する、verification requirementを緩和する、といった処置は事前契約に存在しない。

## technical postmortem

事故の分類:

```text
EXTERNAL-ARTIFACT-TRANSPORT-FAILURE-AFTER-SUCCESSFUL-INDEPENDENT-COMPUTATION
```

観測されたerror:

```text
Failed to CreateArtifact:
Failed to make request after 5 attempts:
Request timeout: /twirp/github.actions.results.api.v1.ArtifactService/CreateArtifact
```

canonical machine-readable postmortem:

- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`

将来の別prospective studyでは、mandatory verifier outputをartifact service単一経路へ依存させない冗長なimmutable保存経路や、小さな独立hash shardを事前設計することが技術的改善候補となる。ただしこの改善をPCRPR-STUDY1へ後付けして再判定することは認めない。

## fail-closed closure

事前固定したStage 1 decision mappingは:

```text
technical/integrity/independent-verification failure
-> STAGE1-TECHNICAL-INVALID
```

である。

full mandatory final verificationが成立しなかったため、以下を最終固定する。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
same-block repair = NOT AUTHORIZED
replacement / extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

post-hoc rescueは行わない。

## 解釈境界

このclosureは、reply-pressure representationがmachine-operational practical comeback structureの記述に役立たないことを示す科学的negative evidenceではない。

同時に、`F05_ALL`、`lambda=100`、production OOF performance、top-quintile enrichmentをvalidated scientific representation/modelとして扱うこともできない。

production observationsとindependent terminal stdout一致は、provenanceおよび将来の仮説形成のために保存できるが、accepted Stage 1 evidence、Stage 2 formal evidence、validated practical-comeback representation、人間の難しさ・欺瞞・error probabilityに関するclaimへ昇格させない。

## 研究継続

PCRPR-STUDY1はこのdecisionで閉じる。結果駆動のsame-study retryや`PCRPR-STUDY1`のrepair versionは作成しない。

Research Generation 2の次の独立machine-only agenda itemは:

```text
G2-08 — Machine Decision-Failure Taxonomy Study 1
```

である。

G2-08を開始する場合は、新しいチャットまたは新しい研究開始工程でcurrent remote `main`を再取得し、新しいStudy ID / Stage IDs、fresh source population、fresh seed blocks、decision taxonomy、independent verification、artifact-preservation contractをprospectively固定する。PCRPR Stage 1 rowsやproduction modelをformal evidenceとして継承しない。

## main統合状態

G2-07 closureは最終整合性監査後、PR #77でmainへ統合された。

```text
main integration = COMPLETE
merge PR = #77
merge commit = 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

このpost-merge記録はintegration provenanceのみを更新し、Stage 1 / Stage 2のscientific decisionを変更しない。
