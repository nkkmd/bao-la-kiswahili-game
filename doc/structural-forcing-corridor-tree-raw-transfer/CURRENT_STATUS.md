# G4-02 — 現在の状態

更新日: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
現在のStudy: `SFCDFT-STUDY4`  
状態: **`STUDY 4 PREREGISTRATION FROZEN / STAGE 0 ONLY AUTHORIZED / NO FRESH SCIENTIFIC ACCESS`**

## 現在地

G4-02はG3-04でformalに確認されたC1/C6 phase-structure claimをfresh source-policy × root-family domainへ移送できる範囲と反例境界を検証するAgendaである。

Study 3はStage 2 formal measurement前のmandatory `bundle-source`工程で停止し、`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / NO RERUN`として正式閉鎖した。G4-02の科学的問いは未解決のため、Study 3をrepair/reopenせず、独立したsuccessor `SFCDFT-STUDY4` をprospectiveに開始した。

```text
SFCDFT-STUDY1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
SFCDFT-STUDY3 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED / NO RERUN
SFCDFT-STUDY4 authorization review = PASS FOR PREREGISTRATION AND STAGE0 ONLY
SFCDFT-STUDY4 preregistration = FROZEN
SFCDFT-STUDY4 Stage 0 = AUTHORIZED / NOT YET EXECUTED
SFCDFT-STUDY4 Stage 1 fresh access = NOT AUTHORIZED
SFCDFT-STUDY4 Stage 2 fresh access = NOT AUTHORIZED
G4-02 scientific generalization/counterexample decision = NONE YET
G4-02 overall = IN PROGRESS
Public AI change = false
main merge = false
```

## Study 4 authorization

正式判定:

`SFCDFT-STUDY4-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`

```text
branch = research/g4-02-sfcdft-study4-prereg
parent Study 3 closure HEAD = 91e83b0757c02cd11e2a5f463407a342a91ce3ce
baseline main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
fresh scientific seed reads authorized = 0
```

本認可で許可されるのはpreregistration、non-scientific Stage 0 implementation/execution、synthetic fixture、seed-free firewall preparationまでである。

Stage 1 / Stage 2 fresh scientific seed access、scientific effect/direction/p-value、formal decision、main integration、public AI changeは認可していない。

正本:

- [`../research-program-decisions/2026-09-19-g4-02-study4-authorization-review.md`](../research-program-decisions/2026-09-19-g4-02-study4-authorization-review.md)
- [`authorizations/STUDY_4_PREREG_STAGE0_AUTHORIZATION.json`](authorizations/STUDY_4_PREREG_STAGE0_AUTHORIZATION.json)

## Study 4 scientific contract

Study 3から変更していない。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
representation = RAW-ONLY
relative depth = 5
source policies = P1 / P2
root families = RF1 / RF2
four domains = P1/P2 × RF1/RF2
Stage 1 target = 8 compatible pairs/domain
Stage 2 target = 18 selected pairs/domain
formal family = fixed 8 hypotheses
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
resource ceilings = unchanged
```

Study 3のtechnical failureを見てendpoint、方向、alpha、sample target、domain、resource ceiling、representationを変更していない。

## Study 4 technical remediation

Study 4で追加した唯一のsubstantive technical changeは、fresh scientific namespaceへアクセスする前の **end-to-end artifact-pipeline validation** である。

Stage 0ではnon-scientific synthetic fixtureのみを使い、次のproduction-equivalent pathを通す。

```text
synthetic source fixture generation
-> source classification
-> frozen selection representation
-> source bundle construction
-> artifact upload
-> artifact retrieval
-> digest / manifest verification
-> measurement input parse
-> production / independent dry-run exact agreement
-> aggregate schema validation
```

missing / malformed / digest-mismatched bundle等のnegative fixtureもfail-closedで検証する。

このStage 0はscientific effect magnitude、effect direction、p-value、generalization/counterexample decisionを生成しない。

正本:

- [`STUDY_4_PROTOCOL.md`](STUDY_4_PROTOCOL.md)
- [`prereg/STUDY_4_SPEC.json`](prereg/STUDY_4_SPEC.json)
- [`prereg/STUDY_4_STAGE_0_TECHNICAL_SPEC.json`](prereg/STUDY_4_STAGE_0_TECHNICAL_SPEC.json)

## Study 4 seed boundary

```text
Stage 0 fixture = 49041001..49041256 / NON-SCIENTIFIC / AUTHORIZED
Stage 1 primary = 40611001..40611384 / UNREAD / NOT AUTHORIZED
Stage 1 paired reserve = 41611001..41611384 / UNREAD / NOT AUTHORIZED
Stage 2 primary = 40621001..40621768 / UNREAD / NOT AUTHORIZED
Stage 2 paired reserve = 41621001..41621768 / UNREAD / NOT AUTHORIZED
```

Study 1–3の全scientific namespaceは再利用禁止。

Study 4 Stage 1 authorization前に、Study 3の既存immutable artifactsからseed-freeにmaterialize可能なsource trajectory / opening-prefix / RAW-root identityをdurable firewall化する。Study 3 scientific seedの再読やsource regenerationは行わない。

## Study 3 closure boundary

Study 3 Stage 2 canonical run:

```text
run ID = 35427427920
execution SHA = dec9a91d5860b9f3d927d632a7165bcbf99f5f63
classify-final = success / ready=true
bundle-source = failure
formal measurement = skipped / not started
formal aggregate = skipped / not started
8-cell decision vector = NOT GENERATED
formal closure = TECHNICAL-INVALID
```

Study 4はこのfresh scientific contentを設計判断に使わない。利用したのは「artifact pipelineをfresh execution前にend-to-end技術検証する必要がある」というtechnical failure factだけである。

## 次の安全な作業

1. Study 4 Stage 0用のsynthetic fixture / source-bundle / consumer / aggregate dry-run実装を用意する。
2. fresh scientific seedを読まないGitHub Actions Stage 0 workflowを構成する。
3. Stage 0を一度実行し、artifact upload/retrievalを含むend-to-end gateを検証する。
4. Stage 0 resultを固定し、別個のformal reviewを行う。
5. `STAGE0-PASS` の場合でもStage 1は自動認可せず、Study 3 durable firewallを完成させた後にStage 1 pre-access authorization reviewを行う。

## 禁止事項

- Study 1 / Study 2 scientific replay
- Study 3 Stage 1 replay
- Study 3 Stage 2 rerun / repair / manual dispatch
- Study 3 Stage 2 namespaceへの追加アクセス
- Study 3 scientific seedの再読
- Study 4 Stage 1 / Stage 2 scientific seed access
- Study 3 fresh evidenceを使ったscientific contract調整
- deterministic scientific failureのreserve救済
- frozen selection後のreplacement
- resource ceilingの事後増加
- G4-10 depth11 access
- public AIへの自動反映
- `main`統合
