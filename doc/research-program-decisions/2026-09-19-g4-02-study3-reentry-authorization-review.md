# 2026-09-19 — G4-02 Study 3 再開認可レビュー

## 判定

**`SFCDFT-STUDY3-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0`**

ただし、この判定が許可するのは次に限定する。

- 新しいStudy identity / research branchの確定
- prospective protocol / machine-readable preregistrationのfreeze
- non-scientific technical fixtureとStage 0 validation
- Study 2 identity firewallのseed-free materialization
- Stage 1 pre-access authorization文書・workflowの準備

**fresh scientific seed accessは許可しない。** Stage 1 / Stage 2はいずれも別のpre-access authorizationを必要とする。

## 審査識別情報

```text
Review ID = G4-02-SFCDFT-STUDY3-REENTRY-REVIEW-2026-09-19-V1
Agenda = Research Generation 4 / G4-02
Repository = nkkmd/bao-la-kiswahili-game
Reviewed main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
Reviewed parent research HEAD = 06515c5f8c3462e1265b40be74283f3a4deb933d
New research branch = research/g4-02-sfcdft-study3-prereg
Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 3 scientific seed access at review = 0
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 1. Study 3を新規Studyとして扱う理由

`SFCDFT-STUDY1`と`SFCDFT-STUDY2`はいずれもfresh execution後にrepair/reopenしていない。Study 1はshort trajectoryに対するserializer処理順序、Study 2はfrozen source replay中のengine `relay-limit` guardによりfail-closedとなった。

Study 3はこれらを同一Stage内で救済するものではない。新しいStudy ID、Stage ID、seed namespace、freshness firewallを持つ独立したprospective再検証とする。

G4-02 Agenda自体は既存の`G4-02-AUTHORIZED`判定により、G3-04 C1/C6のfresh source-policy × root-family transferを検証するStudy-definitionが認可されている。本レビューは、その科学課題を変更せずにStudy 2で判明したtechnical failureを次Studyの事前設計へ取り込めるかを審査する。

## 2. `relay-limit`の意味

`public/engine.js`では1手内のrelay回数に`MAX_RELAY = 512`を置き、この上限に達した場合に`state.reason = "relay-limit"`を設定する。これはBaoの自然なterminal ruleを表す科学的endpointではなく、実装上の安全ガードである。

したがってStudy 3では次を禁止する。

- `relay-limit`をBaoの自然な勝敗として科学的に解釈すること
- `relay-limit`で生成されたwinnerをC1/C6 transfer evidenceへ利用すること
- Study 2 failed seedを再読してcandidate可否を事後判定すること
- paired reserveでStudy 2 failureを救済すること

## 3. Study 3のprospective remediation

科学的root contractに必要なのはassigned Namua/Mtaji pairであり、そのpairが揃った後のsource continuationはendpoint計算に不要である。Study 3ではsource replayを次のように事前固定する。

1. policy / root-family / domainをprimary slot seedから決定する。
2. production / independentで同一move policyを逐次replayする。
3. 各ply後にassigned root-family anchor状態を更新する。
4. **assigned Namua/Mtaji pairが双方揃った最初の時点でsource replayを停止する。**
5. candidate pair完成後の追加moveを生成しない。
6. candidate完成前に自然terminalへ到達した場合は`NO-CANDIDATE-ROOT-SHORTAGE`とする。
7. candidate完成前にengine `relay-limit`へ到達した場合は`NO-CANDIDATE-ENGINE-GUARD-CENSORING`とし、Bao terminal evidenceとして扱わない。
8. candidate完成前にfrozen max source plyへ到達した場合は`NO-CANDIDATE-ROOT-SHORTAGE`とする。
9. candidate完成の場合のみfirst-16 opening-prefix identityをmandatoryとする。
10. production / independent disagreement、malformed identity、authorization/provenance breachは`TECHNICAL-INVALID`とする。

この変更はsource acquisitionの停止境界とtechnical censoring semanticsだけに限定し、C1/C6 endpointや科学的decision ruleを変更しない。

## 4. 変更しない科学的contract

次はStudy 2から変更しない。

- C1 `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
- C1 frozen direction `MTAJI-GREATER`
- C6 `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
- C6 frozen direction `NAMUA-GREATER`
- RAW-only / relative depth 5
- P1/P2 source policy
- RF1/RF2 root family
- 4 source-policy × root-family domains
- Stage 1 target 8 compatible pairs/domain
- Stage 2 target 18 pairs/domain
- fixed 8 hypotheses
- family-wise alpha `1/20`
- exact two-sided sign test
- fixed-eight Holm-Bonferroni
- production / independent exact equality
- resource ceilings
- no-rescue / no-rerun philosophy
- protected evidence boundary

Study 2のfailureを見てsample target、endpoint、direction、alpha、domain、resource ceilingを変更しない。

## 5. freshness prerequisite

Study 1 firewallは既存のdurable identity firewallをそのまま継承する。

Study 2についてはStage 1 primary namespace全体を永久除外する。

```text
40411001..40411384
41411001..41411384
40421001..40421768
41421001..41421768
```

加えて、Study 2の382 sealed source artifactsから、fresh seedを再読せずに次のidentity-only firewallをmaterializeする。

- `sourceTrajectorySha256`
- first-16 opening-prefix SHA-256（存在するrecordのみ）
- Namua/Mtaji RAW-root SHA-256（存在するrootのみ）

Study 2 failed 2 slotsにはsealed source identityがないためseed-range exclusionで保護する。

Study 3はanchor完成時にreplay停止するため、Study 2のfull trajectoryとStudy 3のdecision-prefix trajectoryは同じ意味を持たない。したがって旧full-trajectory hashとのexact collisionは除外するが、prefix-level disjointnessをfull-trajectory hashだけから主張しない。first-16 prefix、RAW root、seed namespaceを主要な監査可能firewallとする。

**このStudy 2 firewallがmaterialize・検証されるまでStage 1 fresh accessをauthorizeしない。**

## 6. 新しいprospective seed namespace

freeze候補を次で固定する。

```text
Stage 1 primary = 40511001..40511384 / 384
Stage 1 paired infrastructure reserve = 41511001..41511384 / 384
Stage 1 max fresh reads = 400
Stage 1 max infrastructure replacements = 16

Stage 2 primary = 40521001..40521768 / 768
Stage 2 paired infrastructure reserve = 41521001..41521768 / 768
Stage 2 max fresh reads = 792
Stage 2 max infrastructure replacements = 24

Stage 0 technical fixture namespace = 49031001..49031256 / NON-SCIENTIFIC
```

本レビュー時点で上記scientific namespaceは`UNREAD`である。

## 7. Stage IDs

```text
SFCDFT3-S0-TECHNICAL-2026-09-19-v1
SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1
SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1
```

## 8. Stage 0で必須のtechnical fixture

Stage 0ではfresh scientific seedを使わず、少なくとも次を検証する。

1. candidate pair完成時にreplayが即停止すること
2. candidate完成後のcontinuationを生成しないこと
3. natural terminal前にpair incompleteなら`NO-CANDIDATE-ROOT-SHORTAGE`
4. engine `relay-limit`がpair完成前に発生したfixtureは`NO-CANDIDATE-ENGINE-GUARD-CENSORING`
5. `relay-limit`のwinner/reasonをscientific terminal evidenceへ利用しないこと
6. complete candidateはfirst-16 prefix必須
7. production / independent source decision-prefixがcanonical exact一致
8. Study 1 / Study 2 known identity collisionをrejectできること
9. effect direction / endpoint magnitude / p-value / generalization outputがないこと

Study 2 failed scientific seeds `40411112` / `40411312`をtechnical fixtureとして再読してはならない。relay-limit fixtureはtechnical namespaceまたはsynthetic engine fixtureから新規に用意する。

## 9. authorization gate

| Gate | 判定 |
| --- | --- |
| G4-02 Agenda authorization | PASS |
| Study 1/2 repair prohibition | PASS |
| scientific contract unchanged | PASS |
| engine-guard / Bao-terminal separation | PASS-AS-DESIGN |
| anchor-bounded replay | PASS-AS-DESIGN |
| new seed namespace | PASS-AS-DESIGN |
| Study 1 firewall | PASS |
| Study 2 seed-range firewall | PASS |
| Study 2 durable identity firewall | **PREREQUISITE-REQUIRED-BEFORE-STAGE1** |
| Stage 0 technical execution | AUTHORIZED AFTER PREREG FREEZE |
| Stage 1 fresh access | NOT AUTHORIZED |
| Stage 2 fresh access | NOT AUTHORIZED |
| main integration | NOT AUTHORIZED |

## 10. 正式判定

**`SFCDFT-STUDY3-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0`**

Study 3は、Study 2を修理・再実行せず、科学的仮説を変更せず、engine guardと科学的terminalを明示的に分離した新規prospective Studyとして設計できる。

次の安全な作業は、Study 3 protocol/specのfreeze、Study 2 identity firewallのseed-free materialization、Stage 0 technical fixtureの実装・検証である。Stage 1 scientific seed accessは別途pre-access reviewを通過するまで禁止する。
