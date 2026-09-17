# LGTTCI-STUDY1 — 現在の状態

更新日: 2026-09-18

## 正式状態

```text
Program position = Research Generation 4 / G4-01
Study = LGTTCI-STUDY1
Study authorization = G4-01-AUTHORIZED
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = LGTTCI-S0-TECHNICAL-2026-09-17-v1 / STAGE0-PASS
Stage 1 = LGTTCI-S1-COMPATIBILITY-2026-09-17-v1 / EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1 / COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
G4-01 / LGTTCI-STUDY1 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
execution route = GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE + DOWNSTREAM-ONLY-RECOVERY
old 401... compatibility namespace = QUARANTINED / NO REUSE
Stage 1R primary source coverage = 1536 / 1536
Stage 1R paired reserve use = 0
fresh workflow rerun = 0
downstream recovery fresh seed access = 0
formal scientific effects generated = 0
formal generalization decision generated = false
formal counterexample decision generated = false
G3-12 evidence reused = false
G3-11 depth 10 rerun = false
G4-10 depth 11 access = false
public AI change authorized = false
main integration authorized = false
```

## Stage 0

`LGTTCI-S0-TECHNICAL-2026-09-17-v1`は`STAGE0-PASS`で完了した。G3-12で見逃されたroot legal width 1のhelper precondition gapを、scientific populationへ進む前に検出・遮断できることをnegative control込みで確認した。

## 旧Stage 1

旧Stage 1はfresh seedへのアクセス開始後にローカル長時間processの実行環境が失われ、監査可能な最終result artifactを残せなかった。このため`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じた。

旧`401...` seed namespaceは正確な最終read境界を証明できないため全体をquarantineし、再試験・後続研究とも再利用しない。partial telemetryも科学的結果へ使用しない。

## Stage 1R

再試験は`LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`として実施した。source policy、root family、RAW identity、search condition、support gateは旧Stage 1から変更していない。

fresh execution run:

```text
run = 35224920019
head = 90aff0561538113c203cbf8efa8977420a19dca1
primary source coverage = 1536 / 1536
paired reserve use = 0
full fresh workflow rerun = 0
```

元workflowはfresh acquisition完了後のdownstream工程でtechnical failureとなった。fresh evidenceを再取得せず、元runに保存されたimmutable source artifactだけを入力とするdownstream-only recoveryをprospectiveに固定して実施した。

recovery run:

```text
run = 35265290422
authorization commit = 2216c19e52bd0a7ce2680426183c058ecb8fce1c
conclusion = success
fresh seed access during recovery = 0
fresh workflow rerun = 0
```

## 最終結果

canonical source bundleの監査結果:

```text
source artifacts = 1536 / 1536
primary = 1536
reserve = 0
source manifest deterministic core SHA256 = 8111413773dfd9899b4562ee5089223a0aef75b6885041f4eacb1006111d7cdd
source bundle artifact ID = 10517090411
source bundle artifact digest = sha256:3e1312fbd2fed104dc25ea53448b5f76feee2f37bc2b34ef09274e4df690a65b
```

22個のseed-free measurement taskはすべてsuccessし、aggregateもsuccessした。

```text
SFCDF = compatible
SILGM = compatible
GCLD = compatible
decision = COMPATIBILITY-ELIGIBLE-ALL
measurement task count = 22
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
final result artifact ID = 10516843232
final artifact digest = sha256:06a7232a423fdf32fce863a938b097fc97fe3f8bf29148b8cf6638500d17e630
```

canonical repository result:

- [`results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json`](results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json)
- [`results/stage-1r/STAGE_1R_RECOVERY_EXECUTION_PROVENANCE.json`](results/stage-1r/STAGE_1R_RECOVERY_EXECUTION_PROVENANCE.json)
- [`results/stage-1r/STAGE_1R_DOWNSTREAM_RECOVERY_PROVENANCE.json`](results/stage-1r/STAGE_1R_DOWNSTREAM_RECOVERY_PROVENANCE.json)
- [`results/stage-1r/ARTIFACT_ATTESTATION.json`](results/stage-1r/ARTIFACT_ATTESTATION.json)

詳細は[`checkpoints/2026-09-18-stage1r-final-result.md`](checkpoints/2026-09-18-stage1r-final-result.md)を参照する。

## 解釈上の境界

`COMPATIBILITY-ELIGIBLE-ALL`は、SFCDF・SILGM・GCLDの3 familyすべてで後続のfresh-domain transfer研究に必要なcompatibility/readiness条件を満たしたことを示す。

この結果は次を意味しない。

- Research Generation 3由来claimがfresh domainへ一般化した
- scientific effectの方向・大きさが確認された
- counterexampleが存在する／存在しない
- G4-02/G4-03/G4-04が自動的にauthorizationされた
- public AIを変更すべきことが示された

## Study closure

G4-01 / `LGTTCI-STUDY1`は予定したtechnical validationとfresh compatibility validationを完了したため、研究完了として閉じた。

正式closure state:

`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`

closure decision:

[`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md)

G4-02/G4-03/G4-04などの後続研究は、それぞれ別のauthorization reviewを経て開始する。`main`への統合もユーザーの明示指示があるまで行わない。
