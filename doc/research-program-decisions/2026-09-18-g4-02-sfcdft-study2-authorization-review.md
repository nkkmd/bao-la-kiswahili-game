# 2026-09-18 — G4-02 SFCDFT-STUDY2 authorization review

## 判定

**`SFCDFT-STUDY2 = AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

Stage 1 fresh scientific seed accessは**未認可**とする。

本reviewは、`SFCDFT-STUDY1`をrepair/reopenするものではない。Study 1は`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`のままimmutableに保持し、そのtechnical failureから得た実装上の知見だけを、新しいStudy identity・fresh seed namespace・prospective serializer contractへ反映する。

## 前提

### Study 1 closure

`SFCDFT-STUDY1 / Stage 1`は次の状態で閉じている。

```text
primary reads = 384 / 384
sealed source artifacts = 375
deterministic serializer failures = 9
failure cause = short trajectory before mandatory first-16 opening-prefix serialization
paired reserve reads = 0
Stage 1 compatibility decision = NONE
Stage 2 seed reads = 0
scientific outcome = NONE
```

同一Study / Stageのrepair、replay、reserve rescue、375件subsetによるdecision生成は禁止済みである。

### Study 1 identity firewall

Study 1の375 sealed source artifactから、seed replayなしのartifact-only recoveryを実施済みである。

```text
recovery run = 35317703820
artifact = 10535439464
artifact digest = sha256:548b8ad62ad1b287b0be0e9a1624fd14252eff52af7931f12408a5a215342e3e
source trajectory hashes = 375
first-16 opening-prefix hashes = 375
RAW-root hashes = 660
identity core SHA-256 = 8836ce233aa330538defd7271d4e69389526fafb42f605b542eebf9996522430
scientific outcome fields retained = false
seed reread / replay = false
```

このidentity-only evidenceは、`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study1/`へdurableにmaterialize済みであり、artifact retentionに依存しない。

## Study 2で許可する変更

Study 1のscientific question、C1/C6 endpoint、4 domain、RAW representation、relative depth 5、formal hypothesis family、Holm family-wise alpha、resource philosophyは変更しない。

変更を許可するのは、Study 1のtechnical-invalid原因に直接対応するsource serialization contractだけである。

### 変更1 — anchor eligibilityをopening-prefix serializationより先に判定

source trajectory replay後、assigned root-family anchorsを先に判定する。

- assigned paired rootsが揃わない場合: `NO-CANDIDATE-ROOT-SHORTAGE`
- paired rootsが揃う場合: scientific candidateとしてidentity serializationへ進む

### 変更2 — short trajectoryを通常のno-candidateとして明示

`moveCount < 16`かつroot pair incompleteの場合、first-16 opening prefixは存在しないため、次を保存する。

```text
candidateStatus = NO-CANDIDATE-ROOT-SHORTAGE
openingPrefixAvailable = false
openingPrefixLength = moveCount
openingPrefixSha256 = null
```

これはscientific candidateではなく、endpoint計算・selection対象・replacement対象にならない。

RF1のNamua exact ply20またはRF2のNamua exact ply28を満たすpaired candidateでは必然的に16手以上のtrajectoryが存在するため、**pair completeなのにfirst-16 opening prefixが作れない場合はTECHNICAL-INVALID**とする。

### 変更3 — Study 1 evidenceの全面freshness exclusion

Study 2ではStudy 1の次を再利用しない。

- consumed Stage 1 primary seeds `40311001..40311384`
- unread Stage 1 paired reserve `41311001..41311384`
- unread Study 1 Stage 2 primary `40321001..40321768`
- unread Study 1 Stage 2 paired reserve `41321001..41321768`
- recovered 375 full source trajectory hashes
- recovered 375 first-16 opening-prefix hashes
- recovered 660 RAW-root hashes

failed 9 primary slotsはsealed source identityが存在しないため、seed namespace exclusionで保護する。

## 新規fresh namespace

既存repository検索で使用を確認できない次のnamespaceをStudy 2用に予約する。

```text
Stage 1 primary = 40411001..40411384
Stage 1 paired infrastructure reserve = 41411001..41411384
Stage 2 primary = 40421001..40421768
Stage 2 paired infrastructure reserve = 41421001..41421768
```

**本review時点では予約のみであり、read = 0。**

Study 1で未読だった`413…`および`4032…/4132…`を新Studyへ流用しない。

## gate review

| Gate | 判定 | 根拠 |
|---|---|---|
| Study 1 closure immutable | PASS | repair/reopenせずtechnical-invalidを保持 |
| scientific outcome contamination | PASS | Study 1ではscientific decision未生成 |
| technical defect localization | PASS | 9/9同一short-opening-prefix serializer failure |
| prospective remediation | PASS | source access前に処理順序・no-candidate semanticsを明示 |
| Study 1 freshness firewall | PASS | artifact-only recoveryをdurable repositoryへ固定 |
| G3-04/G4-01 historical firewalls | PASS-AS-REQUIRED | Study 2でも継承必須 |
| new seed namespace | PASS | `404…/414…`を新規予約、read 0 |
| C1/C6 independence | PASS | 独立constructを維持 |
| formal multiplicity | PASS-AS-REQUIRED | 4 domain × 2 claims = fixed 8-slot Holmを維持 |
| no-rescue/no-rerun | PASS-AS-REQUIRED | Study 2でもfresh access後のrepair禁止 |
| Stage 1 access authorization | NOT-YET | Stage 0 PASS後に別reviewが必要 |
| Stage 2 access authorization | NOT-YET | Stage 1 compatibility結論後も別authorizationが必要 |

## authorization scope

現在許可するもの:

- `SFCDFT-STUDY2` Study identityのfreeze
- Study 2 protocol/specのprospective freeze
- identity firewall verification tooling
- source serializer production/independent implementation
- fresh scientific seedを使わないStage 0 technical fixture
- Stage 1 pre-access design / GitHub Actions workflow preparation

現在許可しないもの:

- `40411001..40411384`または`41411001..41411384`のread
- Stage 1 scientific compatibility execution
- `40421001..40421768`または`41421001..41421768`のread
- formal scientific effect/p-value/generalization/counterexample output
- Study 1の再実行・repair・reclassification
- G4-10 depth 11 access
- public AI変更
- `main`統合

## 次のauthorization boundary

Study 2 Stage 0がPASSし、次がblob-boundで確認された場合のみ、Stage 1 pre-access authorization reviewへ進める。

1. short trajectory fixtureが`NO-CANDIDATE-ROOT-SHORTAGE`として正常終了する
2. candidate sourceではfirst-16 opening-prefixが必須である
3. production / independentがsource classificationまで完全一致する
4. Study 1 durable firewallが読み込まれ、既知collision fixtureを拒否する
5. G3-04/G4-01 firewallsが維持される
6. scientific endpoint/effect/p-valueをStage 0が生成しない
7. new fresh namespace read countが0のままである

## protected boundaries

```text
G3-11 depth 10 = NO RERUN
G3-12 Stage 1 = NO REPAIR / REPLAY
G3-12 Stage 2 = UNREAD / NOT REUSED
G4-01 = NO RERUN / historical firewall only
SFCDFT-STUDY1 = CLOSED / TECHNICAL-INVALID / NO REOPEN
SFCDFT-STUDY2 scientific seed reads = 0
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative scientific state identity = RAW
public AI change = false
main integration = NOT AUTHORIZED / NOT PERFORMED
```
