# G4-02 — 現在の状態

更新日: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
現在のStudy: `SFCDFT-STUDY3`  
状態: **`STUDY 3 STAGE 0 PASS / STAGE 1 PRE-ACCESS REVIEW NEXT`**

## 現在地

G4-02はG3-04でformalに確認されたC1/C6 phase-structure claimをfresh source-policy × root-family domainへ移送できる範囲と反例境界を検証するAgendaである。科学的contractはStudy 1から一貫して変更していない。

```text
SFCDFT-STUDY1 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY2 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY3 preregistration = FROZEN
SFCDFT-STUDY3 Study2 firewall prerequisite = SATISFIED
SFCDFT-STUDY3 Stage 0 = STAGE0-PASS
SFCDFT-STUDY3 Stage 1 = NOT AUTHORIZED / fresh reads 0
SFCDFT-STUDY3 Stage 2 = NOT AUTHORIZED / fresh reads 0
G4-02 scientific compatibility/generalization/counterexample decision = NONE
Public AI change = false
main merge = false
```

## Study 3の設計

Study 3はStudy 1/2をrepair/reopenせず、新しいStudy identityとfresh namespaceを持つprospective再検証である。

中心となるtechnical remediationはanchor-bounded source replayである。

```text
policy/root-family assignment
-> source replay
-> assigned anchorを各plyで評価
-> Namua/Mtaji pair完成
-> 即停止
```

pair完成後のcontinuationは生成しない。

candidate完成前の停止は次で分離する。

- natural terminal / max source ply → `NO-CANDIDATE-ROOT-SHORTAGE`
- engine `relay-limit` → `NO-CANDIDATE-ENGINE-GUARD-CENSORING`
- mandatory identity / implementation / authorization failure → `TECHNICAL-INVALID`

`relay-limit`は`public/engine.js`の`MAX_RELAY=512` safety guardであり、そこから設定されるwinnerをBaoの自然なterminal evidenceへ利用しない。

## Study 2 identity firewall

Study 2の382 sealed source artifactだけからseed-freeでdurable firewallをmaterializeした。Study 2 scientific seedは再読していない。

```text
materialization run = 35388490684
install run = 35388715102
identity core = 7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc
source records = 382
unique source trajectory hashes = 380
unique first-16 opening-prefix hashes = 372
unique RAW-root hashes = 657
```

正本:

`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study2/`

Study 2のfailed slots `40411112` / `40411312`にはsealed source identityがないためseed namespace exclusionで保護する。

## Stage 0

Stage ID:

`SFCDFT3-S0-TECHNICAL-2026-09-19-v1`

canonical run `35389371946`は全step SUCCESSだった。

```text
decision = STAGE0-PASS
scientific seed reads = 0
technical seeds scanned = 16
candidate fixture domains = 4 / 4
artifact ID = 10564654680
artifact digest = sha256:0da2a47c4b4df3cc209217d2eab4c07785d520bca672725ab836b8c3b93b918a
deterministic core = d823461f553da8fc8bab27845c38bfcb7552e5acc771968e6e212a0dcd4294ff
```

確認済みfixture:

- candidate pair完成時に即停止
- post-candidate continuation 0
- natural terminal incomplete → root shortage
- max source ply incomplete → root shortage
- relay-limit before complete → engine-guard censoring
- relay-limit winnerをscientific terminalへ流用しない
- complete candidate first-16 prefix mandatory
- production / independent exact一致
- Study 1 / Study 2 identity collision reject
- malformed identity fail-closed
- scientific effect outputなし

正本:

- [`results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json`](results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json)
- [`checkpoints/2026-09-19-study3-stage0-pass.md`](checkpoints/2026-09-19-study3-stage0-pass.md)

## 科学的contract

Study 2から変更していない。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
representation = RAW-only
relative depth = 5
source policies = P1 / P2
root families = RF1 / RF2
Stage 1 target = 8 compatible pairs/domain
Stage 2 target = 18 pairs/domain
formal family = fixed 8 hypotheses
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
```

## Study 3 scientific seed boundary

全て未読である。

```text
Stage 1 primary = 40511001..40511384 / UNREAD
Stage 1 paired reserve = 41511001..41511384 / UNREAD
Stage 2 primary = 40521001..40521768 / UNREAD
Stage 2 paired reserve = 41521001..41521768 / UNREAD
```

Stage 0 technical namespace `49031001..49031256`はscientific evidenceではない。

## 次の安全な作業

1. Stage 1 compatibility-only specをfreezeする。
2. GitHub Actions one-shot source acquisition / seed-free measurement pipelineを準備する。
3. exact blob bindingとpre-access reviewを実施する。
4. reviewがPASSした場合だけStage 1 scientific namespaceへのfresh accessをauthorizeする。

Stage 1はcompatibility/readinessのみを扱い、effect direction、p-value、generalization/counterexample decisionを生成してはならない。

## 禁止事項

- Study 1/2 scientific seedの再読・repair・rerun
- Study 3 Stage 1/2 scientific seedへのpre-authorization access
- Stage 1 fresh populationのfull rerun
- deterministic scientific failureのreserve救済
- Stage 2自動認可
- G4-10 depth11 access
- public AIへの研究結果の自動反映
- current branchの`main`統合

## 正本

- [`STUDY_3_PROTOCOL.md`](STUDY_3_PROTOCOL.md)
- [`prereg/STUDY_3_SPEC.json`](prereg/STUDY_3_SPEC.json)
- [`../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md`](../research-program-decisions/2026-09-19-g4-02-study3-reentry-authorization-review.md)
- [`results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json`](results/stage-0-study3/STUDY_3_STAGE_0_TECHNICAL_RESULT.json)
