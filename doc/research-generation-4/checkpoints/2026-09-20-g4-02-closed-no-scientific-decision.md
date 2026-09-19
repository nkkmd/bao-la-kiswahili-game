# G4-02 — CLOSED / NO SCIENTIFIC DECISION

日付: 2026-09-20  
Program: `Bao Fourth-Generation Research Program`  
Agenda: `G4-02 — corridor / tree-graph transfer`  
最終状態: **`CLOSED / NO SCIENTIFIC DECISION`**

## 1. Closure decision

G4-02を正式に終了する。

```text
G4-02 scientific transfer decision = NONE
final formal Stage2 status = TECHNICAL-INVALID
GENERALIZES-WITHIN-FROZEN-DOMAIN = NOT ASSIGNED
COUNTEREXAMPLE-BOUNDARY-DETECTED = NOT ASSIGNED
NOT-CONFIRMED = NOT ASSIGNED
NON-ESTIMABLE = NOT ASSIGNED
successor Study within G4-02 = NOT AUTHORIZED
```

これはG3-04由来C1/C6のfresh-domain一般化失敗、counterexample成立、effect不在を意味しない。G4-02でprospectively固定したformal transfer判定を、one-shot scientific boundaryの内側で有効に取得できなかった、という終了状態である。

## 2. Study sequence

### Study 1

Stage 1でmandatory first-16 opening-prefix serializer invariantを満たさないsourceが発生したため、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`として閉じた。repair/reopen/rerunしていない。

### Study 2

Stage 1でdeterministic relay-limit failureが発生し、`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`として閉じた。reserve救済やrerunを行っていない。

### Study 3

scientific contractを維持してanchor-bounded source replayを導入した。Stage 0はPASS、Stage 1は`FORMAL-PREPARATION-ELIGIBLE`。

Stage 2 canonical run `35427427920` はclassify-finalまで成立したが、mandatory `bundle-source`でtechnical failureとなりformal measurementへ到達しなかった。`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED / NO RERUN`として閉じた。

### Study 4

scientific contractを変更せず、fresh access前のartifact-pipeline end-to-end validationを強化したprospective successorとして実施した。

Stage 0:

```text
run = 35435952961
status = PASS
fresh scientific seed reads = 0
```

Stage 1:

```text
run = 35441719931
execution SHA = b84b53a3369490cafad2b428feddee20323f3e82
primary sources = 384 / 384
retry = 0
reserve = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 success
decision = FORMAL-PREPARATION-ELIGIBLE
```

Stage 2:

```text
canonical run = 35450625402
execution SHA = 0acd54a23fd8e1f1226c307fe948c251d64f336d
run attempt = 1
primary source acquisition = 768 / 768 completed
retry = 0
paired reserve = 0
deterministic failure = 0
classify-final = success / ready=true
bundle-source = failure
recovered error = source identity mismatch
formal measurement = NOT STARTED
formal aggregate = NOT STARTED
8-cell decision vector = NOT GENERATED
```

frozen protocolのdecision mappingにより、Study 4 Stage 2を`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / FAIL-CLOSED`で閉じた。

## 3. Identity-only audit

canonical source artifactsのtop-level identityだけを確認するread-only auditを実施した。

```text
audit run = 35452797563
execution SHA = 9a2abaa3b45e2eaac532ea9c7c1ba284e22d4688
conclusion = SUCCESS
canonical source artifacts = 768
top-level studyId mismatch = 0
top-level stageId mismatch = 0
duplicate slot = 0
fresh scientific seed reads = 0
scientific endpoint reads = 0
effect computation = false
```

```text
audit artifact ID = 10587421372
audit artifact digest = sha256:dae4371a2b06d3c6085a502b310b5af55dc0c439ec2d91268d2f7fbc219e2af8
```

bundle時の`source identity mismatch`はこの限定監査では再現しなかった。root causeを科学的結果へ読み替えず、identity auditをsame-evidence rescueやformal measurement実行の根拠にしない。

## 4. Scientific contract preservation

Study 4でもStudy 3から次を変更していない。

```text
C1 frozen direction = MTAJI-GREATER
C6 frozen direction = NAMUA-GREATER
representation = RAW-ONLY
relative depth = 5
transform set = []
source policies = P1 / P2
root families = RF1 / RF2
Stage 2 selected pairs = 18/domain = 72 total
formal family = fixed 8 hypotheses
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
minimum nonzero = 12/hypothesis
resource ceilings = unchanged
```

technical failureを見た後にsample size、endpoint、direction、alpha、domain、root family、source policy、representation、resource ceilingを変更していない。

## 5. No-rerun / no-rescue boundary

G4-02 closure後も次を禁止する。

- Study 1〜4のscientific executionのrerun / repair / reopen
- closed scientific seedの救済目的の再読
- deterministic scientific failureのreserve replacement
- frozen selection後のreplacement
- formal measurementのpost-hoc rescue
- threshold / endpoint / direction / alpha / domain / sample target / resource ceilingの事後変更
- G3-12のrepair/replay
- G4-10 depth11への未承認アクセス

将来同じscientific questionを再検討する場合は、G4-02を再開せず、別Agendaまたは新規prospective Study identityとしてauthorizationから開始する。

## 6. Documentation disposition

次の入口文書をG4-02最終状態へ更新した。

- repository root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`

frozen prospective `PROGRAM_PLAN.md`は事後結果に合わせて改変しない。

## 7. Main / public boundary

```text
G4-02 research branch = research/g4-02-sfcdft-study4-prereg
main integration = NOT AUTHORIZED / NOT PERFORMED
public AI change authorized by G4-02 = false
current public AI = unchanged
G4-10 depth11 = NOT AUTHORIZED / NOT ACCESSED
```

G4-02 branchの`main`統合はユーザーの明示指示がある場合にのみ行う。

## 8. Authoritative records

- [`../../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](../../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)
- [`../../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](../../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md)
- [`../CURRENT_STATUS.md`](../CURRENT_STATUS.md)
- [`../README.md`](../README.md)
