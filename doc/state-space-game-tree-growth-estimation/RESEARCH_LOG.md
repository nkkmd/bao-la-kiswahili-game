# SSGTGE-STUDY1 — Research Log （研究ログ）

## 2026-08-30 — Study startup audit （日本語の要点）

- remote `main` HEADが`c5efcdb7972d1bc775a2857c1b0641c35c9df622`であることを確認した。
- ルート`README.md`、`doc/FUTURE_RESEARCH_AGENDA.md`、`doc/RESEARCH_INDEX.md`、Research Generation 2のprogram decisionを確認した。
- G2-05 `DRSSE-STUDY1`を監査し、その境界を変更不能として固定した。

```text
DRSSE-STUDY1 formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
complete exact layers = 0..9
cumulative RAW states = 102857
depth 9 new RAW states = 78009
depth 9 tree node occurrences = 105704
validated transform set = []
```

## 2026-08-30 — G2-12 prospective freeze （固定した条件）

固定した識別情報:

```text
Study ID = SSGTGE-STUDY1
Formal title = State-Space / Game-Tree Growth Estimation Study 1
Stage 0 = SSGTGE-S0-TECHNICAL-2026-08-30-v1
Stage 1 = SSGTGE-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = SSGTGE-S2-FORMAL-2026-08-30-v1
branch = research/g2-12-state-space-game-tree-growth-estimation
```

fresh depth 10/11を生成する前に、RAW identity、3種類のestimator candidate、rolling-origin cell、selection rule、uncertainty rule、formal depth-10 endpoint、resource ceiling、decision taxonomy、no-rescue ruleを固定した。

## 2026-08-30 — Stage 0 v1 （Stageの記録）

implementation / sourceのfreeze:

```text
00b89802c9d40313cc0309bc36f59eecc53899b2
```

実行authorization:

```text
76afec9b0ba3d1c5ef84cb42bc3d205360da9b97
```

run `33315971968` / job `99269373670`は、technical outputを生成する前にsource-binding gateで失敗した。workflow pipelineが`pipefail`なしの`tee`で終了していたため、Nodeの失敗がActions metadata上では見えなくなっていた。

```text
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
fresh depth 10/11 = not generated/read
real development candidate evaluation = not performed
```

v1 runは再実行しない。

## 2026-08-30 — Stage 0 v2 prospective corrective design （Stageの記録）

v1はscientific output生成前に停止したため、technical entry v2を別versionとして準備した。変更対象はGit blobによるsource binding、fail-closed shell orchestration、version付きrunner / verifier / workflow pathだけで、科学的なestimator / holdout contractは変更していない。

sourceのfreeze:

```text
a699beb6afe7681227d0ecc8328d527ac34ff7f6
```

実行authorization:

```text
6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
```

## 2026-08-31 — Stage 0 v2 accepted PASS （Stageの記録）

workflow実行記録:

```text
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
```

production / independent processは、どちらも`set -euo pipefail`の下でexit 0となった。standard rootのdepth-2 fixtureでは、cumulative RAW states 19、depth-labelled edges 18、cumulative tree node occurrences 19を再現した。synthetic estimator fixtureとnegative controlもPASSした。

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v2 = STAGE0-TECHNICAL-PASS
```

受理したcommit:

```text
e452aaaa10666369daa065d06a6d14abe53ddd6e
```

Stage 0では、実development candidateの比較もfresh holdoutも消費していない。

## 2026-08-31 — Stage 1 development freeze （固定した条件）

Stage 1のsource / spec / toolingは次のcommitで別途固定した。

```text
3d93b6cb228bc314819495e89c1521859bf258b6
```

固定したcontract:

```text
maximum depth read = 9
real development candidate evaluation = authorized only after separate commit
fresh depth 10/11 generation/read = forbidden
same Stage 1 evidence rerun = forbidden
Stage 2 = unauthorized
```

別commitで行った実行authorization:

```text
bba6d55b1a22e403976ced5ef05ed5b9d3c99f6e
```

## 2026-08-31 — Stage 1 production outcome and independent failure （Stageの記録）

workflow実行記録:

```text
run = 33324107667
job = 99291109199
artifact = 9735723141
artifact ZIP SHA256 = 7b415b0fad9cadf92568d0b1103b44d9325d8b4c2a729edb40cb1f673e3af09f
workflow conclusion = failure
```

production実装はexit 0となり、承認済みG2-05 depth 0..9 development competitionを実行した。

production実装だけで得たsummary:

```text
E1 max error = 0.2813333110915206 / ineligible
E2 max error = 0.07917793679237395 / eligible
E3 max error = 0.1129709359542721 / eligible
production proposed winner = E2-LOG-QUADRATIC-D2PLUS
productionCoreSha256 = 0dde91343fd7ff1c7736eda2629d4c0f1c04c32b7aad0afee5613e6432cba194
```

続く必須のindependent verificationはexit 1となった。

```text
Error: prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
```

固定済みcross-implementation toleranceは`1e-12`だった。production predictionは`4729.18318822039`で、失敗後に診断目的で再構築したindependent numerical pathは約`4729.1831882325705`、relative differenceは約`2.57568e-12`だった。

この診断用reconstructionはacceptance evidenceではなく、固定済みtoleranceも緩和しない。

## 2026-08-31 — No-rescue Stage 1 closure （解釈上の境界）

production pathが実development outputをすでに生成し、authorizationが`sameStage1EvidenceRerunAuthorized=false`を固定していたため、verifier / solver / tolerance / cell setを変更せず、同じevidenceも再実行しない。

受理したclosure:

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
canonical selectedEstimator = null
production-only E2 proposal = diagnostic only
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh depth 10/11 = not generated/read
Study formal decision = TECHNICAL-INVALID
```

G2-05とG2-11の境界は変更しない。

## 2026-08-31 — Study-local closure and central documentation synchronization （最終状態）

Study内のclosure commit:

```text
4f63d615ef25702d99881aedf4a4054fbe7c275b
```

無関係な内容を置き換えず4件の中央文書を更新するため、branch限定のfail-closed同期を別途承認した。このauthorizationは`mainIntegrationAuthorized=false`を明示し、対象をresearch branchと4文書に限定した。科学的判断の変更、Stage 1再実行、Stage 2 entry、depth 10/11生成は承認していない。

```text
central-sync authorization commit = 57c813726e72486f38f3da86216523afbccdafd7
workflow run = 33339370675
job = 99332085365
workflow conclusion = success
central-doc sync commit = f69e4a7912e39bfd424969e5cd220ac36baa5d15
```

実行直後の確認では、次の文書にG2-12 closureが反映されていることを確認した。

- ルート`README.md`
- section 28としての`doc/RESEARCH_INDEX.md`
- 完了済み/`TECHNICAL-INVALID`の状態とpriority行を含む`doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`

同期後、一時的にwrite権限を持たせたworkflowとmaintenance scriptをbranchから削除した。

```text
workflow removal commit = 9651f62c8f07605800b6a9103d9d6966c389870d
maintenance-tool removal commit = 8ef6b0329d386db48c729ea5017cfe6f4e21eb10
```

この同期では`main`へのmergeやref updateを行っていない。authorization JSONはprovenanceとしてのみ保存する。
