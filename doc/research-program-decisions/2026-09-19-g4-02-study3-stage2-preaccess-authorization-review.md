# 2026-09-19 — G4-02 Study 3 Stage 2 pre-access authorization review

## 判定

**`SFCDFT3-STAGE2-PREACCESS-REVIEW-PASS`**

`SFCDFT-STUDY3` の Stage 2 formal held-out execution は、frozen contract、Stage 1 prerequisite、freshness firewall、実行実装 binding、seed-free preflight のすべてが整合しているため、**fresh scientific namespace への初回アクセスを認可可能**と判定する。

この認可は `SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1` の one-shot execution に限定する。workflow rerun、same-evidence repair、manual dispatch、main integration、public AI change は認可しない。

## 審査識別情報

```text
Review ID = G4-02-SFCDFT3-STAGE2-PREACCESS-REVIEW-2026-09-19-V1
Agenda = Research Generation 4 / G4-02
Study = SFCDFT-STUDY3
Stage = SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1
Branch = research/g4-02-sfcdft-study3-prereg
Reviewed HEAD = eb3299e4e40bfdea690707d1b29bec62c5c80856
Stage 1 decision = FORMAL-PREPARATION-ELIGIBLE
Stage 2 preflight run = 35426064344 / completed / success
Stage 2 preflight artifact = 10578818245
Stage 2 preflight artifact digest = sha256:f29c74f0d3199628bb2cfdcb103620ab51409cd4e4b19231784dcb77e6c9d17b
Preflight deterministic core = ec28638a57ae31e54ccd342974f4985a8760eab1e3c4089d346d0cfdf280dd9e
Fresh scientific seed reads at review = 0
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 1. Stage 1 prerequisite

Study 3 Stage 1 の canonical one-shot run `35396341311` は `completed / success` で終了し、正式 decision は **`FORMAL-PREPARATION-ELIGIBLE`** である。

```text
primary START = 384 / 384
sealed primary source = 384 / 384
paired reserve use = 0
candidate pair complete = 285
selected pairs = 32 / 32
measurement tasks = 8 / 8 SUCCESS
C1 defined = 8 / 8
C6 defined = 8 / 8
resource pass = 8 / 8
```

Stage 1 は compatibility / formal-preparation gate に限定されており、formal effect、effect direction、p-value、generalization/counterexample decision を生成していない。

よって Stage 2 への移行条件は満たされている一方、Stage 1 evidence を Stage 2 formal evidence として流用していない。

## 2. Frozen Stage 2 contract

Stage 2 contract は `STUDY_3_STAGE_2_FORMAL_HELDOUT_SPEC.json` に prospective freeze 済みである。

主要条件は次のとおり固定されている。

```text
primary namespace = 40521001..40521768 / 768
paired reserve = 41521001..41521768 / 768
max infrastructure replacements = 24
max fresh seed reads = 792
source policies = P1 / P2
root families = RF1 / RF2
four frozen domains
selected pairs = 18/domain = 72 total
selected roots = 144 total
endpoints = C1 / C6
C1 frozen direction = MTAJI-GREATER
C6 frozen direction = NAMUA-GREATER
formal family size = 8
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
minimum nonzero = 12
```

sample target、endpoint、direction、alpha、domain、resource ceiling は Stage 1 結果を見て変更していない。

## 3. Freshness / identity firewall

Stage 2 binding は以下の既存 evidence を protected evidence として固定している。

- G3-04 Stage 1 / Stage 2
- G4-01 legacy SFCDF compatibility population
- G4-02 Study 1
- G4-02 Study 2
- G4-02 Study 3 Stage 1

Study 1 / Study 2 / Study 3 Stage 1 の scientific seed namespace は再利用禁止であり、trajectory / opening-prefix / RAW-root identity firewall も binding に含まれている。

Stage 2 primary / reserve namespace は本レビュー時点まで **UNREAD** である。

## 4. Pre-execution binding

`STUDY_3_STAGE_2_PRE_EXECUTION_BINDING.json` は `FROZEN-PRE-EXECUTION` 状態で、frozen spec、Stage 1 canonical result、identity firewall、public engine/AI files、Stage 2 source/measurement/inference implementation、GitHub Actions workflow の Git blob SHA を固定している。

最新 binding ID:

`SFCDFT3-STAGE2-PRE-EXECUTION-BINDING-2026-09-19-R2`

binding 後に Stage 2 scientific seed access は行われていない。

## 5. Seed-free preflight

canonical preflight run:

`35426064344`

結果:

```text
conclusion = success
artifact = 10578818245
artifact digest = sha256:f29c74f0d3199628bb2cfdcb103620ab51409cd4e4b19231784dcb77e6c9d17b
decision = PREFLIGHT-PASS
freshScientificSeedReads = 0
stage2ScientificSeedAccess = false
assignmentStable = true
sourceMatrixQuartets = 192
primarySlots = 768
measurementTasks = 18
selectedPairTarget = 72
selectedRootTarget = 144
fixedFormalFamilySize = 8
minimumNonzero = 12
workflowRunAttempt = 1
deterministicCoreSha256 = ec28638a57ae31e54ccd342974f4985a8760eab1e3c4089d346d0cfdf280dd9e
```

preflight では次を seed-free に確認した。

1. pre-execution binding の整合性
2. frozen Stage 2 implementation の syntax
3. assignment / effective-seed separation
4. 768-slot source matrix と classifier
5. exact two-sided sign test
6. fixed-eight Holm-Bonferroni
7. selected-pair / selected-root target
8. Stage 2 scientific seed access が 0 のままであること

## 6. One-shot execution boundary

Stage 2 execution は最終 authorization file の**初回作成**のみを trigger とする。

次を禁止する。

- workflow rerun
- `GITHUB_RUN_ATTEMPT > 1`
- manual workflow dispatch
- full fresh workflow rerun
- same-evidence repair rerun
- deterministic scientific failureのpaired reserve救済
- Stage 1 populationの再読・再利用
- Study 1 / Study 2 のrepair / reopen
- resource ceiling の事後増加
- selection後のreplacement
- G4-10 depth 11 access
- public AI change
- main integration

paired reserve は durable START 後に sealed source が存在せず、かつ infrastructure interruption と証明された場合にのみ利用できる。root shortage、engine-guard censoring、identity firewall reject、endpoint undefined、effect magnitude/direction、formal decision を理由に reserve を使ってはならない。

## 7. Authorization gate

| Gate | 判定 |
| --- | --- |
| G4-02 Agenda authorization | PASS |
| Study 3 Stage 0 | PASS |
| Study 3 Stage 1 prerequisite | PASS / FORMAL-PREPARATION-ELIGIBLE |
| scientific contract frozen | PASS |
| Stage 2 namespace previously unread | PASS |
| protected-evidence firewall | PASS |
| pre-execution binding | PASS |
| 768-slot matrix | PASS |
| exact inference implementation | PASS |
| seed-free preflight | PASS |
| fresh scientific reads before authorization | 0 / PASS |
| one-shot / no-rerun boundary | PASS |
| main integration | NOT AUTHORIZED |
| public AI change | NOT AUTHORIZED |

## 8. 正式判定

**`SFCDFT3-STAGE2-PREACCESS-REVIEW-PASS`**

したがって、`SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1` に限り、final execution authorization を発行し、GitHub Actions による one-shot formal held-out execution を開始してよい。

この判定は Stage 2 の科学的結果を予断しない。`GENERALIZES-WITHIN-FROZEN-DOMAIN`、`COUNTEREXAMPLE-BOUNDARY-DETECTED`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、`TECHNICAL-INVALID` のいずれも frozen decision mapping に従って結果から決定する。
