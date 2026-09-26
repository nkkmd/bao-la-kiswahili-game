# G4-07 / MLGMR-STUDY1 — 現在の状態

更新日: 2026-09-26  
Program: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
状態: **`STAGE0-PASS / STAGE1-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED / STAGE1-EXECUTION-NOT-YET-AUTHORIZED`**

## 現在地

```text
reviewed main HEAD = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
research branch = research/g4-07-multiscale-geometry-memory-return
initial authorization review = G4-07-AUTHORIZATION-REVIEW-2026-09-26-V1
initial decision = G4-07-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Study ID = MLGMR-STUDY1
protocol = FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE
preregistration = FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE
Stage 0 = COMPLETE / STAGE0-PASS
Stage 1 design/source freeze review = MLGMR-STUDY1-STAGE1-DESIGN-AUTH-2026-09-26-V1
Stage 1 design/source freeze = AUTHORIZED
Stage 1 scientific execution = NOT YET AUTHORIZED
Stage 2 = NOT AUTHORIZED / seed block reserved only
fresh scientific seed reads = 0
Stage 1 scientific seed reads = 0
Stage 2 scientific seed reads = 0
formal scientific outcome = NOT GENERATED
G4-10 depth-11 access = 0 / NOT AUTHORIZED
public AI change = false
main integration = NOT AUTHORIZED
```

## Stage 0 canonical execution

```text
run = 36238840292 / attempt 1 / success
head = 0c7cdb2b2fa83c4d97ec0d2ad27c6a5c9c22b2b5
binding = MLGMR-STUDY1-STAGE0-BINDING-2026-09-26-V3
frozen source commit = 0886bb6786c38b35c5285dd87da8edaf7c6cb5f8
mandatory gates = 18 / 18 PASS
production / independent exact agreement = true
artifact ID = 10905163005
artifact ZIP SHA-256 = cf5b96e4fb63786e085bf9719beed6ff125f588d623657ed7450031b1a20614f
result.json SHA-256 = d6854bd00454288e76de2274990571f6c5d0249b7b8ee8f632c53e8a4fe6e0a5
fresh scientific seed reads = 0
Stage 1 seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

Stage 0 result mirror:

`results/stage-0/STAGE_0_TECHNICAL_RESULT.json`

Execution history and remediation provenance:

`checkpoints/2026-09-26-stage-0-technical-pass.md`

## Dependency disposition

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
G4-02 positive evidence contribution to G4-07 = NONE
G4-03 = methodological/background only for this Study
G4-04 = direct scientific foundation / 8-of-8 transfer confirmed
G3-08 = CLOSED / TECHNICAL-INVALID / scientific reuse prohibited
```

G4-07はG4-02の未取得scientific decisionを代理生成せず、G3-08をrepair/reopenしない。G4-04でfresh transfer確認済みのcontinuous trajectory constructを直接的な上流foundationとする。

## Frozen scientific design

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
axes = canonical CRCLGR A1..A6
source policies = P1 / P2
checkpoints = 16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
lag checkpoint intervals = 1,2,4,8
lag ply-equivalent = 4,8,16,32
primary candidate slots = 24 axis×lag
primary unit = source trajectory
return module = descriptive-only
phase crossing = primary-censored / descriptive count
```

Stage 1 seed reservation:

```text
40713001..40713512 / 512
candidate target = 16 per policy
minimum fully eligible = 12 per policy
measured = 8 per policy
```

Stage 2 seed reservation:

```text
40723001..40724024 / 1024
```

これらのscientific seedは**まだgeneration/read未認可**である。

## Stage 1 support-only boundary

Stage 1はdevelopment / support-onlyとする。

```text
complete measured trajectories required = 16
measured per policy = 8
per-policy support trajectories required = 6
combined support trajectories required = 12
minimum comparable-nonzero per supporting trajectory = 3
production/independent exact agreement required = true
effect direction used for promotion = false
formal inference allowed = false
```

Stage 1 outcomeの方向、p-value、favorable subgroupをStage 2 promotion条件へ使用しない。

## 次に許可される作業

Stage 1 design/source freeze reviewにより、次だけが許可される。

- Stage 1 development spec / source manifestの最終freeze
- identity-only firewall manifest作成
- Stage 1 production implementation
- Stage 1 independent implementation
- Stage 1 GitHub Actions workflow作成
- syntax / static guard / source separation検査
- scientific runner/helper/workflowのGit blob SHA取得
- final one-shot Stage 1 execution authorization文書 / JSONの作成準備

**Stage 1 scientific seed accessはまだ禁止。**

## 禁止事項

- Stage 1 seed `40713001..40713512` のgeneration/read
- Stage 1 candidate scan / scientific measurement
- Stage 2 seed generation/read
- G3-08 scientific seed/evidence reuse
- G4-02 C1/C6 transfer成立の仮定
- G4-04 same-evidence rerun
- lag/checkpoint/axis/policy/support gateの結果後変更
- seed extension / replacement population / favorable subgroup rescue
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AI変更
- main統合

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`checkpoints/2026-09-26-stage-0-technical-pass.md`](checkpoints/2026-09-26-stage-0-technical-pass.md)
- [`../research-program-decisions/2026-09-26-post-g4-06-g4-07-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-06-g4-07-authorization-review.md)
- [`../research-program-decisions/2026-09-26-post-g4-07-stage0-stage1-design-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-07-stage0-stage1-design-authorization-review.md)
