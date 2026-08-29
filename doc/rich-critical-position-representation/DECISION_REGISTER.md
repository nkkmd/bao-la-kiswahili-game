# RCPR-STUDY1 — 判断台帳

更新日: 2026-08-29

## D01 — Study identity

```text
Program = G2-06
Study ID = RCPR-STUDY1
Formal title = Rich Critical-Position Representation Study 1
```

判断: G2-06 scientific outcome生成前にprospectiveに固定しました。

## D02 — Stage architecture

```text
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
```

Stage 0はtechnical-only、Stage 1はfresh development only、Stage 2はfresh formal validation onlyで、別のexplicit authorizationを必要とします。

## D03 — upstream immutability

Research Generation 1およびG2-01..G2-05の判断はすべてimmutableです。

Historical Critical Positionsの600 roots、139 high-divergence roots、1,183 candidate audits、zero-promotion closureをG2-06のtraining、tuning、formal evidenceとして使用しません。

## D04 — RAW-only scientific identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外します。`pending`欠落時はfail closedです。`validated transform set = []`であり、canonicalization / symmetry reductionは承認されていません。

## D05 — historical identity helperはRCPR identityとして未承認

seat-canonical / mirrored identityを作るhistorical helperはG2-06 scientific identityとして使用しません。RCPRはdedicated RAW-only serialization / keyingを使用します。

## D06 — leakage taxonomy

```text
A PRE_ROOT_OBSERVABLE
B ROOT_DERIVED_OUTCOME_INDEPENDENT
C SEARCH_DERIVED_OUTCOME_INDEPENDENT
D CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

predictorとしてeligibleなのはA-Cだけです。Dは禁止します。

## D07 — prospectively declared representation families

```text
LOCAL_PIT_TOPOLOGY
CAPTURE_GRAPH
LEGAL_MOVE_GEOMETRY
REPLY_GRAPH
RESERVE_HOUSE_RELATION
MOVE_SET_ENTROPY
SEARCH_GAP_VECTOR
LOCAL_TEMPORAL_CONTEXT
```

Stage 1 scientific outcome確認後に新しいfamilyを追加してはいけません。

## D08 — criticality construct continuity

frozen continuation policy下のexact root move間`D_range`は、fresh G2-06 evidence上のmeasurement definitionとしてのみ再利用します。

frozen high-divergence boundaryは`D_range >= 0.30`です。historical measured root / outcomeは使用禁止です。

## D09 — Stage 1 / 2 identity firewall

Stage 1とStage 2は、source-game seed、historical trajectory、利用可能な場合のopening prefix、selected RAW state key、representation-row identity、temporal context利用時のcomplete pre-root history-window hashでoverlap 0を要求します。

## D10 — independent verifier structure

Independent verifierはauthoritative Bao rule engineを共有できますが、production RCPR feature extractor、classifier helper、RAW serializerをimportしてはいけません。

raw inputからrepresentationとendpointを独立再計算します。

## D11 — G2-05 hardening applicability

G2-06は、pre-formal control、scientific source変更後のfresh source identity / authorization、read-only closure auditingなどG2-05のrelevant governance principleを採用します。

exact-enumeration ruleを本Studyへ主張するものではありません。

## D12 — fail-closed formal behavior

relevant scientific outcome確認後、望ましい結果を得る目的でscientific threshold、feature family、classifier、distance、clustering、aggregation、interaction、phase population、primary endpoint、verifier acceptance criterionを修復・変更してはいけません。

## D13 — Stage 1 seed blockは永久にconsumed

Authorized workflow run `33196954082`はfrozen execution-start boundaryを越えました。archived `execution-start.json`には次を記録しています。

```text
scientificStage1SeedBlockConsumed = true
seedStart = 28610001
seedEnd = 28613072
```

判断: このblockは`RCPR-STUDY1`に対して永久にconsumedです。same-block rerun、replacement、extensionは承認しません。

## D14 — production-only outputはaccepted Stage 1 resultではない

Production job `98936414477`は成功し、production readiness gateもすべてPASSしました。

production outputには599 primary-estimable roots、134 high-divergence roots、selected family set=`RICH_ALL`、overall OOF AUROC=`0.7093403948001926`が含まれます。

判断: independent verificationがPASSしなかったため、これらは**production-only unverified development output**としてprovenanceのためだけに保持します。

Stage 2を承認せず、positive G2-06 scientific resultを確立せず、confirmatory evidenceとして扱いません。

## D15 — exact independent representation mismatchを優先する

Independent job `99007180273`の記録:

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
technicalPass = false
```

600 rows中exactに4 rowsでfeature-vector hash equalityがFAILしました。

prospectively frozen verifierはexact equalityを要求しているため、数値差が小さくてもtechnical gateはFAILします。

## D16 — Stage 1 final decision

判断:

**`STAGE1-TECHNICAL-INVALID`**

technical postmortemではmismatchを`MOVE_SET_ENTROPY.indexEntropy`へ局在させました。productionの`Map` insertion-order accumulationとindependent object integer-key enumerationの違いにより、4 rowsで約`2.22e-16`〜`4.44e-16`のIEEE-754差が生じました。

この原因特定は説明のためだけです。`RCPR-STUDY1`を救済するためのpost-hoc tolerance、rounding rule、verifier replacement、same-seed replayは承認しません。

## D17 — Stage 2 blockとsuccessor boundary

`RCPR-S2-FORMAL-2026-08-28-v1`は**`NOT-AUTHORIZED-NOT-EXECUTED`**のままであり、Stage 1 production-only outputを根拠に承認しません。

continuationを行う場合は新しいprospective successor studyでなければなりません。successor scientific evidence生成前に最低限次を必要とします。

1. canonical entropy category-order / numeric-hash semanticsを固定する。
2. nonnumeric encounter orderのinteger-like keyを含むadversarial independent technical fixtureをPASSする。
3. 310 featuresすべてでexact equalityを示す。
4. 新しいstudy / spec / source commitを固定する。
5. fresh consume-once scientific seed blockを割り当てる。
6. 新しいexplicit authorizationを取得する。

`RCPR-STUDY1` development rowをsuccessor formal evidenceとして使用してはいけません。
