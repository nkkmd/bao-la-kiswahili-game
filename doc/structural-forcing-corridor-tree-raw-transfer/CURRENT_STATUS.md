# G4-02 — 現在の状態

更新日: 2026-09-20  
Agenda: `Research Generation 4 / G4-02`  
最終Study: `SFCDFT-STUDY4`  
状態: **`CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED`**

## 現在地

G4-02は、G3-04でformalに確認されたC1/C6 phase-structure claimをfresh source-policy × root-family domainへ移送できる範囲と反例境界を検証するAgendaとして実施した。

Study 1〜4をprospectiveに分離し、各Studyでfail-closed、freshness、no-rescue / no-rerun境界を維持した。最終Study 4ではStage 1 compatibilityを正常に通過したが、Stage 2 canonical one-shot executionがformal measurement開始前のmandatory `bundle-source`工程で停止した。したがって、G4-02からgeneralization / counterexampleに関するformal scientific decisionは得られていない。

```text
SFCDFT-STUDY1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
SFCDFT-STUDY3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
SFCDFT-STUDY3 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED / NO RERUN
SFCDFT-STUDY4 Stage 0 = PASS / TECHNICAL PIPELINE VALIDATED
SFCDFT-STUDY4 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
SFCDFT-STUDY4 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED / NO RERUN
G4-02 scientific transfer decision = NONE
G4-02 overall = CLOSED / NO SCIENTIFIC DECISION
Public AI change = false
main integration = COMPLETE / PR #154 / merge commit 8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd
```

## 凍結済みscientific contract

Study 4でもStudy 3から科学的contractを変更していない。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
representation = RAW-ONLY
relative depth = 5
validated transform set = []
source policies = P1 / P2
root families = RF1 / RF2
four domains = P1/P2 × RF1/RF2
Stage 1 target = 8 compatible pairs/domain
Stage 2 target = 18 selected pairs/domain
formal family = fixed 8 hypotheses
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
minimum nonzero = 12/hypothesis
resource ceilings = unchanged
```

Technical failureを見てendpoint、方向、alpha、sample target、domain、root family、source policy、representation、resource ceilingを変更していない。

## Study 4 Stage 0 — PASS

Canonical GitHub Actions execution:

```text
run ID = 35435952961
execution SHA = 9eca4c249566a2c068083ba334fd47ca8d7aed4c
overall conclusion = success
```

Stage 0はnon-scientific synthetic fixtureだけを使い、source classificationからbundle、artifact upload/retrieval、measurement consumer parse、production / independent dry-run agreement、aggregate schema、negative fixturesまでをend-to-endで検証した。

```text
fresh scientific seed reads = 0
scientific outputs generated = 0
result deterministic core SHA-256 = ebcffb9ab33acbafa6f5344740f0cc93d12fbd330911a2f96cac76b6c66d2133
```

正本:

- [`results/stage-0-study4/STUDY_4_STAGE_0_TECHNICAL_RESULT.json`](results/stage-0-study4/STUDY_4_STAGE_0_TECHNICAL_RESULT.json)
- [`checkpoints/2026-09-19-study4-stage0-pass.md`](checkpoints/2026-09-19-study4-stage0-pass.md)

## Study 4 Stage 1 — FORMAL-PREPARATION-ELIGIBLE

Canonical GitHub Actions execution:

```text
run ID = 35441719931
execution SHA = b84b53a3369490cafad2b428feddee20323f3e82
run attempt = 1
primary sources = 384 / 384
retry = 0
paired reserve = 0
candidate pair complete = 297
root shortage = 87
engine guard = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 success
final decision = FORMAL-PREPARATION-ELIGIBLE
```

全4 domainで8/8 pairについてC1/C6 definedかつresource passを確認した。Stage 1は禁止されたeffect direction、human-readable endpoint magnitude、p-value、generalization/counterexample decisionを生成していない。

```text
final result artifact ID = 10584535311
artifact digest = sha256:b6b9c8987be5da9b9d52405ae98eef897af7b725f11f350a958d1443aae8abcf
deterministic core SHA-256 = 24ef523c374ba2afb8cd79726be7531fffc602f5936534ff82a016ef08fc411f
```

Durable Stage 1 identity firewallも固定済みである。

```text
firewall ID = G4-02-SFCDFT-STUDY4-STAGE1-IDENTITY-FIREWALL
identity core SHA-256 = f9ed5a91c1db6985d3daca62e384940b7ef804940a79b20ef651c6fc2514634f
```

正本:

- [`results/stage-1-study4/STUDY_4_STAGE_1_COMPATIBILITY_RESULT.json`](results/stage-1-study4/STUDY_4_STAGE_1_COMPATIBILITY_RESULT.json)
- [`authorizations/STUDY_4_STAGE_1_EXECUTION_AUTHORIZATION.json`](authorizations/STUDY_4_STAGE_1_EXECUTION_AUTHORIZATION.json)

## Study 4 Stage 2 — TECHNICAL-INVALID

Stage 2は別個のpre-access review、pre-execution binding、seed-free preflight、final execution authorizationを経たうえでone-shot executionした。

Canonical execution:

```text
run ID = 35450625402
execution SHA = 0acd54a23fd8e1f1226c307fe948c251d64f336d
run attempt = 1
event = push
workflow conclusion = failure
primary source acquisition = 768 / 768 completed
retry = 0
paired reserve = 0
deterministic failure = 0
classify-final = success / ready=true
bundle-source = failure
bundle-source job ID = 105919448021
recovered error = source identity mismatch
formal measurement = skipped / not started
formal aggregate = skipped / not started
```

Formal measurementに到達しなかったため、8-cell decision vector、effect direction、p-value、Holm判定、generalization/counterexample labelは生成されていない。

`STUDY_4_PROTOCOL.md`の事前規則に従い、正式裁定は次である。

```text
SFCDFT-STUDY4 Stage 2 = TECHNICAL-INVALID
scientific decision = NONE
8-cell decision vector = NOT GENERATED
rerun = NOT AUTHORIZED / NOT PERFORMED
```

正本:

- [`results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)
- [`checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](checkpoints/2026-09-20-study4-stage2-technical-invalid.md)
- [`authorizations/STUDY_4_STAGE_2_PRE_EXECUTION_BINDING.json`](authorizations/STUDY_4_STAGE_2_PRE_EXECUTION_BINDING.json)
- [`authorizations/STUDY_4_STAGE_2_EXECUTION_AUTHORIZATION.json`](authorizations/STUDY_4_STAGE_2_EXECUTION_AUTHORIZATION.json)

## Post-failure identity-only audit

Stage 2 failure後、canonical runのsealed source artifactsだけを対象とするread-only identity auditを実行した。fresh seedの再読、scientific endpoint read、effect計算は行っていない。

```text
audit run ID = 35452797563
audit execution SHA = 9a2abaa3b45e2eaac532ea9c7c1ba284e22d4688
conclusion = success
canonical source artifacts inspected = 768
top-level studyId mismatch = 0
top-level stageId mismatch = 0
duplicate slot = 0
fresh scientific seed reads = 0
```

Audit artifact:

```text
artifact ID = 10587421372
name = sfcdft4-s2-canonical-identity-audit-35450625402
digest = sha256:dae4371a2b06d3c6085a502b310b5af55dc0c439ec2d91268d2f7fbc219e2af8
```

したがって、canonical bundlerの `source identity mismatch` は保存済み768 source artifactのtop-level identity監査では再現しなかった。root causeは未確定であり、これを根拠にsame-evidence repairやformal measurementの救済実行はしない。

## Study 1〜3の保持境界

Study 1 / 2はそれぞれのtechnical-invalid closureを維持する。Study 3 Stage 2もcanonical bundle-stage technical failureにより`TECHNICAL-INVALID / NO SCIENTIFIC DECISION`で閉鎖済みであり、repair/reopenしていない。

Study 4はこれらの科学的結果を後付けで再解釈しない。各Studyのtechnical failureはC1/C6のpositive/negative scientific evidenceではない。

## G4-02 最終disposition

G4-02の正式状態を次とする。

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
GENERALIZES-WITHIN-FROZEN-DOMAIN = NOT ASSIGNED
COUNTEREXAMPLE-BOUNDARY-DETECTED = NOT ASSIGNED
NOT-CONFIRMED = NOT ASSIGNED
NON-ESTIMABLE = NOT ASSIGNED
final Stage2 status = TECHNICAL-INVALID
successor study within G4-02 = NOT AUTHORIZED
```

これはG3-04 C1/C6がfresh domainへ一般化しないという結論ではない。G4-02で計画したformal transfer判定を、凍結済みone-shot条件下で有効に取得できなかったことを意味する。

将来同じ科学的問いを再検討する場合は、G4-02をrepair/reopenせず、別Agendaまたは別Study identityとしてprospective authorizationから開始する。

## Main integration

ユーザーの明示承認に基づき、G4-02の完了済み研究成果はPR #154で`main`へ統合済みである。

```text
source branch = research/g4-02-sfcdft-study4-prereg
source head = 3316f254c115e57e0ec557e2b33a57be90b3e173
integration PR = #154
merge commit = 8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd
main integration = COMPLETE
```

統合はG4-02の科学的裁定を変更せず、public AI changeも伴わない。統合記録は[`../research-generation-4/checkpoints/2026-09-20-g4-02-main-integration-complete.md`](../research-generation-4/checkpoints/2026-09-20-g4-02-main-integration-complete.md)を参照する。

## 保護境界

- Study 1〜4のclosed scientific executionをrerun / repairしない。
- fresh scientific seedをclosure後の救済目的で再読しない。
- deterministic scientific failureをreserveで救済しない。
- frozen selection後のreplacementを行わない。
- threshold / endpoint / direction / alpha / domain / sample target / resource ceilingを事後変更しない。
- G4-10 depth11へアクセスしない。
- G4-02の結果を公開AIへ自動反映しない。