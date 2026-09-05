# SSGTGE-STUDY1 — Current Status （現在の状態）

更新日: 2026-08-31

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Branch = research/g2-12-state-space-game-tree-growth-estimation
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Study status = COMPLETE / TECHNICAL-INVALID
Formal decision = TECHNICAL-INVALID
Fresh depth 10/11 holdout outcome = NOT GENERATED / NOT READ
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / permanently closed
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / same-evidence rerun NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Canonical selectedEstimator = null
Central documentation synchronization = COMPLETE
Main integration = COMPLETE
Integrated research-branch head = 741ba02ffa944a9569b262841465bfc78db8220a
G2-11 = NOT-AUTHORIZED / unchanged
```

## Scientific identity （識別情報）

正式な局面同一性は、引き続きRAW stateだけで判定する。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn,reason`は同一性に含めない。検証済みtransform setは引き続き`[]`であり、canonicalizationやsymmetry reductionは承認されていない。

## Stage 0 （Stageの記録）

Stage 0 v1はsource-binding gateでoutput生成前に失敗し、恒久的に`STAGE0-TECHNICAL-INVALID`である。

別versionとして作成したcorrective v2は、technicalなsource bindingとorchestrationだけを変更した。production / independent双方によるdepth-2 technical validationをPASSした。

```text
v2 source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
Stage 0 v2 = STAGE0-TECHNICAL-PASS
```

## Stage 1 （Stageの記録）

Stage 1は結果を見る前に固定し、別commitで実行を承認した。

```text
source freeze = 3d93b6cb228bc314819495e89c1521859bf258b6
authorization = bba6d55b1a22e403976ced5ef05ed5b9d3c99f6e
run = 33324107667
job = 99291109199
artifact = 9735723141
artifact ZIP SHA256 = 7b415b0fad9cadf92568d0b1103b44d9325d8b4c2a729edb40cb1f673e3af09f
```

production実装はG2-05 depth 0..9を使ったcandidate比較を完了し、`E2-LOG-QUADRATIC-D2PLUS`を提案した。しかし必須のindependent verificationは、固定済みcross-implementation relative tolerance `1e-12`を超える差を検出して失敗した。

```text
prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
```

したがって、最終状態は次のとおりである。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
canonical selectedEstimator = null
production-only E2 proposal = diagnostic only / not authorized for Stage 2
```

authorizationでは`sameStage1EvidenceRerunAuthorized=false`を固定している。結果確認後のverifier修正、tolerance緩和、同一evidenceの再実行は認められない。

## Stage 2 and holdout （Stageの記録）

Stage 1を通過したcanonical estimatorはない。Stage 2は承認されず、fresh depth 10/11のexact scientific countは生成もreadもしていない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal depth-10 validation = NOT PERFORMED
full Bao state-space/game-tree estimate = NOT AUTHORIZED
```

## Central documentation synchronization （日本語の要点）

Study内のclosureはcommit `4f63d615ef25702d99881aedf4a4054fbe7c275b`で固定した。`main`統合前には、`mainIntegrationAuthorized=false`を明示したbranch限定の中央文書同期だけを承認し、正常に完了した。

```text
authorization commit = 57c813726e72486f38f3da86216523afbccdafd7
workflow run = 33339370675
job = 99332085365
central-doc sync commit = f69e4a7912e39bfd424969e5cd220ac36baa5d15
workflow conclusion = success
```

同期した中央文書は次の4件である。

- ルートの`README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`

同期後、一時的にwrite権限を持たせたworkflowとmaintenance scriptは削除した。

```text
workflow removal commit = 9651f62c8f07605800b6a9103d9d6966c389870d
maintenance-tool removal commit = 8ef6b0329d386db48c729ea5017cfe6f4e21eb10
```

## Main integration （リポジトリ状態）

最終文書とbranch divergenceを改めて監査した後、利用者が`main`への統合を明示的に承認した。統合直前の状態は次のとおりである。

```text
remote main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
research branch = 741ba02ffa944a9569b262841465bfc78db8220a
compare = ahead 16 / behind 0
merge base = c5efcdb7972d1bc775a2857c1b0641c35c9df622
```

`main`はforceを使わず`741ba02ffa944a9569b262841465bfc78db8220a`へfast-forwardした。この統合は、科学的判断、threshold、estimatorの状態、authorization、evidence boundaryを変更しない。

## Canonical closure records （最終状態）

- `results/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `checkpoints/2026-08-31-stage1-technical-invalid.md`
- `checkpoints/2026-08-31-central-documentation-sync-complete.md`
- `STUDY_1_FINAL_REPORT.md`

## Interpretation boundary （解釈上の境界）

G2-05は`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`のままである。G2-11も`NOT-AUTHORIZED`から変わらない。growth estimatorを再検証するには、新しいprospective Studyまたは明示的なnew versionが必要であり、このStudyを再開・救済してはならない。

このStudyはclosure、中央文書の同期、`main`への統合まで完了している。
