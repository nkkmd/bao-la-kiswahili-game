# G4-07 / MLGMR-STUDY1 — 現在の状態

更新日: 2026-09-26  
Program: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
状態: **`AUTHORIZED FOR PREREGISTRATION + STAGE0 ONLY / FRESH SCIENTIFIC ACCESS NOT AUTHORIZED`**

## 現在地

```text
reviewed main HEAD = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
research branch = research/g4-07-multiscale-geometry-memory-return
authorization review = G4-07-AUTHORIZATION-REVIEW-2026-09-26-V1
authorization decision = G4-07-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Study ID = MLGMR-STUDY1
protocol = FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE
preregistration = FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE
Stage 0 = AUTHORIZED / TECHNICAL-ONLY / NOT YET EXECUTED
Stage 1 = NOT AUTHORIZED / seed block reserved only
Stage 2 = NOT AUTHORIZED / seed block reserved only
fresh scientific seed reads = 0
formal scientific outcome = NOT GENERATED
G4-10 depth-11 access = 0 / NOT AUTHORIZED
public AI change = false
main integration = NOT AUTHORIZED
```

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
axes = CRCLGR-A1..A6
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
```

Stage 2 seed reservation:

```text
40723001..40724024 / 1024
```

これらは**予約のみ**であり、生成・readは未認可である。

## 次に許可される作業

- Stage 0 technical specのfreeze
- technical/synthetic fixtureの作成
- production / independent verifierの実装
- GitHub Actions Stage 0 workflowの作成
- scientific seedを読まないStage 0 technical execution

Stage 0 PASS後もStage 1 fresh accessは別authorization reviewを必要とする。

## 禁止事項

- G4-07 Stage 1 / Stage 2 seed generation/read
- G3-08 scientific seed/evidence reuse
- G4-02 C1/C6 transfer成立の仮定
- G4-04 same-evidence rerun
- lag/checkpoint/axisをscientific outcome後に変更すること
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AI変更
- main統合

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`../research-program-decisions/2026-09-26-post-g4-06-g4-07-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-06-g4-07-authorization-review.md)
