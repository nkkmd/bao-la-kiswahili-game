# PSRRE-STUDY1 — 判断登録簿

更新日: 2026-08-30

## D-001 — 本Studyはcore agenda labelを追加しない

**状態:** FIXED

`PSRRE-STUDY1`は`G2-10`と`G2-11`の間に置くdependency-resolution prerequisite Studyであり、新しい`G2-xx` sequence labelを付けない。

## D-002 — G2-10 closureをimmutableとする

**状態:** FIXED

`UMSSR-STUDY1`のStage 1=`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`、`selectedRepresentation=null`、Study / Stage 2=`NOT-AUTHORIZED-NOT-EXECUTED`を変更しない。

## D-003 — G2-10 rescueを禁止する

**状態:** FIXED

G2-10 threshold relaxation、K range変更、40-feature dictionaryへの後付け、favorable subgroup、near-miss promotion、consumed Stage 1 seed rerun、reserved Stage 2 seed流用を禁止する。

## D-004 — RAW identityをauthoritativeとする

**状態:** FIXED

```text
included = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## D-005 — upstream eligibility vocabulary

**状態:** FIXED

```text
FORMALLY-ELIGIBLE
BOUNDED-EXACT-ELIGIBLE
TECHNICAL-REFERENCE-ONLY
DEVELOPMENT-CANDIDATE-ONLY
INELIGIBLE
```

詳細は`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`を正本とする。

## D-006 — Study IDとStage ID

**状態:** FIXED

```text
Study ID = PSRRE-STUDY1
Stage 0 = PSRRE-S0-TECHNICAL-2026-08-30-v1
Stage 1 = PSRRE-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = PSRRE-S2-FORMAL-2026-08-30-v1
```

## D-007 — representation family technical shortlist

**状態:** FIXED FOR STAGE-0 TECHNICAL QUALIFICATION

```text
RF-A-ROBUST-PCA-WARD
RF-B-ROBUST-PCA-PAM
RF-C-DIRECT-ROBUST-PAM
```

Stage 0ではscientific fitを見ない。technical nondeterminism、independent reconstruction failure、serialization failure、resource ceiling failureだけをtechnical disqualification reasonとする。

## D-008 — candidate observable family

**状態:** FIXED AT CONCEPT LEVEL / EXACT FEATURE DICTIONARY NOT YET FROZEN

```text
RAW-STRUCTURAL
LEGAL-ACTION-STRUCTURE
ONE-PLY-SUCCESSOR-STRUCTURE
SEARCH-RELIABILITY-RAW
REPLY-PRESSURE-RAW
TACTICAL-C03-ORIGINAL-SCOPE-ONLY
```

exact feature dictionary、formula、missing semantics、scaling、hyperparameter、model-selection ruleはStage 1 scientific seed消費前のprefreezeで固定する。

## D-009 — fresh seed reservation

**状態:** RESERVED / NOT AUTHORIZED

```text
Stage 0 technical-only = 29500001..29500064
Stage 1 scientific = 29510001..29514096
Stage 2 scientific = 29610001..29618192
```

Stage 1 / 2 scientific blocksは未消費・未承認である。

## D-010 — development / held-out separation

**状態:** FIXED

Stage 1とStage 2のseed、historical trajectory、opening prefix、selected RAW stateのoverlapを0とする。Stage 1 populationをStage 2 formal evidenceへ再利用しない。

## D-011 — independent verification

**状態:** FIXED

formal evidenceではproductionとindependent implementationを分離し、同じStudy helperの単純import / recallだけをindependent verificationとしない。

## D-012 — G2-11 outcome firewall

**状態:** FIXED

transition matrix、long-horizon persistence、recurrence、bottleneck / transient structure、trajectory-family prevalence、transition asymmetry、survival / hazard、time-to-first-Mtaji、acceleration / delayをrepresentation selectionに使用しない。

## D-013 — authorization state at Study start

**状態:** HISTORICAL START STATE

Study開始時点ではStage 0 / 1 / 2 / G2-11はいずれも未承認だった。Stage 0は後続のsource freezeと別authorizationを経てtechnical-only executionが承認された。

## D-014 — failureを正常なclosureとして扱う

**状態:** FIXED

eligible representationが得られない場合、`NOT-ELIGIBLE`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`、`RESOURCE-CENSORED`、`NOT-AUTHORIZED-NOT-EXECUTED`等をprospectively fixed ruleに従って保存する。同じStudy内で結果後の救済をしない。

## D-015 — Stage 0 source freeze / authorization

**状態:** FIXED / EXECUTED

```text
source freeze commit = 724e05ef6a730593aab2f9165a0d02216e372c6d
authorization commit = 2c1dea4f7f5c98497333d9ec325931e9091ba0df
workflow run = 33304155488
job = 99237601518
artifact = 9729904359
```

Stage 0 authorizationはtechnical-onlyであり、scientific seed、scientific performance inspection、G2-11 outcome inspectionを許可しなかった。

## D-016 — Stage 0 disposition

**状態:** FIXED

```text
PSRRE-S0-TECHNICAL-2026-08-30-v1 = STAGE0-TECHNICAL-PASS
mandatory gate failures = 0
missing mandatory gates = 0
```

3 familyはいずれもtechnical exact reconstructionをPASSした。

```text
RF-A-ROBUST-PCA-WARD = PASS
RF-B-ROBUST-PCA-PAM = PASS
RF-C-DIRECT-ROBUST-PAM = PASS
```

これはscientific family selectionではない。Stage 1は自動承認しない。Stage 1 feature dictionary、hyperparameter、selection rule、numeric threshold、Stage 2 held-out contractを別prefreezeで固定する。
