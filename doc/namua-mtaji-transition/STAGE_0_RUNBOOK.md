# Stage 0 Runbook — Namua→Mtaji Temporal Transition Instrumentation

更新日: 2026-08-10  
Status: **local technical validation required / exploratory only / no formal experiment authorized**

研究:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Branch:

```text
research/namua-mtaji-temporal-transition
```

## 1. このrunbookの目的

Stage 0で実装したtemporal-transition instrumentationについて、ローカル環境で以下を確認する。

- closed phase-transition Study 1の観測量と新研究schemaの互換性
- frozen `capture-branch-expansion` classifier設定の継承
- formal Namua→Mtaji engine boundary
- full deterministic replay
- first Mtaji detection
- terminal-before-Mtajiとmax-ply truncationの区別
- frozen MTAJI-M1/MTAJI-M2 artifactのexact hash / representation compatibility
- source provenance

このStage 0 smokeは**technical QA**であり、科学的pilotではない。

ここで生成したゲームから:

- phenotype頻度を推定しない
- comparatorを選ばない
- formal endpointを選ばない
- time originを選ばない
- survival modelを選ばない
- search/depth効果を推定しない
- formal seed blockを定義しない

## 2. 実装ファイル

```text
schemas/namua-mtaji-transition-observation.schema.json
schemas/namua-mtaji-transition-game.schema.json

tools/experiments/lib/namua-mtaji-transition-features.js
tools/experiments/run-namua-mtaji-transition-smoke.js
tools/experiments/verify-namua-mtaji-transition-smoke.js
tools/experiments/audit-namua-mtaji-mtaji-artifact.py

test/namua-mtaji-transition-features.test.js
test/namua-mtaji-transition-engine.test.js
```

既存closed Studyのclassifier実装は編集していない。

## 3. 実行環境

Node.jsは既存position-typology instrumentationと同様に **Node.js 24推奨**。

Mtaji artifact auditはPython標準ライブラリだけを使用するため、このaudit自体には過去研究で使用したPython venvは不要。

repository rootで実行する。

## 4. branchを取得

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git status --short
git rev-parse HEAD
node --version
python3 --version
```

可能ならsource treeをcleanにしてからsmokeを実行する。

## 5. Unit / engine regression tests

新研究固有test:

```bash
node test/namua-mtaji-transition-features.test.js
node test/namua-mtaji-transition-engine.test.js
```

継承元の重要testも実行する:

```bash
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

いずれかが失敗した場合はsmoke generationへ進まない。

## 6. Stage 0 technical smoke

既定値:

```text
games = 8
base seed = 20260810
max ply = 100
opening = seeded-uniform legal / 8 ply
```

technical sampling conditions:

```text
P2-D1 = hard / bao / phase2 / depth1
P2-D2 = hard / bao / phase2 / depth2
LG-D2 = hard / bao / legacy / depth2
V2-D2 = hard / bao-v2 / phase2 / depth2
```

これらは**technical coverage metadata**であり、新研究のformal populationではない。

実行:

```bash
node tools/experiments/run-namua-mtaji-transition-smoke.js
```

出力:

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/
├── games/
│   └── game-XXXX.json
└── manifest.json
```

状態確認:

```bash
node tools/experiments/run-namua-mtaji-transition-smoke.js --status
```

source/configが変わった後に意図的に再生成する場合のみ:

```bash
node tools/experiments/run-namua-mtaji-transition-smoke.js --force
```

## 7. Replay / compatibility verification

```bash
node tools/experiments/verify-namua-mtaji-transition-smoke.js
```

成功時は最低限:

```text
passed = true
schemaFilesReadable = passed
observationValidation = passed
fullReplay = passed
storedObservationRecomputation = passed
legacyPhaseTransitionCompatibility = passed
moveLegality = passed
beforeAfterStateIdentity = passed
phaseMonotonicity = passed
phaseEventLinkage = passed
firstMtajiReserveExhaustion = passed
temporalOutcomeRecomputation = passed
trajectoryHash = passed
summaryRecomputation = passed
sourceProvenance = passed
```

となることを要求する。

出力:

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/verification.json
```

## 8. Frozen Mtaji classifier artifact audit

必要なhistorical artifact:

```text
mtaji-candidate-definition.json
```

canonical hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

過去研究と同じworking copyにartifactが残っている場合の既定path:

```text
artifacts/local/position-typology/stage1-pilot-v1/
  mtaji-candidate-definition-v1/
  mtaji-candidate-definition.json
```

まず:

```bash
python3 tools/experiments/audit-namua-mtaji-mtaji-artifact.py
```

を実行する。

artifactが別の過去研究working copyにある場合は**再生成せず**、その実ファイルを指定する:

```bash
python3 tools/experiments/audit-namua-mtaji-mtaji-artifact.py \
  --candidate /absolute/path/to/mtaji-candidate-definition.json
```

所在不明の場合の検索例:

```bash
find ~ -type f -name 'mtaji-candidate-definition.json' 2>/dev/null
```

このauditは:

1. stored `candidateDefinitionHash`
2. hash fieldを除いたcanonical JSONから再計算したSHA-256
3. 40-dimensional field order
4. discovery StandardScaler dimension
5. frozen two centroids
6. raw-label → `MTAJI-M1/MTAJI-M2` mapping

を検査する。

さらにStage 0 smoke内にeligible first Mtaji stateが存在すれば、exact frozen transformで分類し、**refit / restandardize / relabelなし**でclassifierが適用可能かを確認する。

出力:

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/mtaji-artifact-audit.json
```

### artifactが見つからない場合

RQ3を実施可能と扱ってはいけない。

次をしてはいけない:

- 文書からcentroidを推測する
- Stage 0 smoke上でscalerをfitする
- 新しいMtaji classifierを作る
- held-out dataからM1/M2を再構築する

historical frozen artifactのprovenanceを復元するか、RQ3を明示的にdeferしてからStage 1 designへ進む。

## 9. Stage 0でinspectionしてよいもの

technical feasibilityのため、次は確認してよい。

- smoke games数
- replay pass/fail
- Namua/Mtaji coverageの有無
- first Mtajiを含むgame数
- terminal-before-Mtaji game数
- administrative truncation game数
- duplicate trajectoryの有無
- frozen artifact hash pass/fail
- first Mtaji stateへfrozen classifierを適用できるか

ただし、これらのtechnical smoke値を後のformal effect estimateとして再利用しない。

## 10. Stage 0完了判定

以下をすべて満たしたときStage 0 technical feasibilityをcompleteとする。

1. 新研究固有test pass
2. 継承元critical regression test pass
3. Stage 0 smoke generation complete
4. full replay / recomputation pass
5. new/legacy observation compatibility pass
6. formal phase transition regression pass
7. first Mtaji detection / reserve exhaustion pass
8. terminal-before-Mtaji / max-ply distinctionがartifactで表現可能
9. source provenance pass
10. frozen Mtaji artifact exact hash pass、またはRQ3 deferを正式記録
11. smokeがtechnical-onlyでありscientific inferenceへ使用されていない

## 11. Stage 0完了後に共有するファイル

次の3ファイルを研究チャットへ共有する。

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/manifest.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/verification.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/mtaji-artifact-audit.json
```

もしMtaji artifact auditだけ失敗した場合は、エラーメッセージと、見つかったcandidate artifact path候補も共有する。

## 12. 次段階

Stage 0 technical validationが完了した後に、Stage 1 **fresh exploratory temporal pilot** のprotocolを固定する。

そのpilotで初めて次をauditする。

- candidate/event incidence
- multiple event per trajectory
- reserve/progression support overlap
- comparator support
- first-Mtaji event rate
- terminal-before-Mtaji frequency
- max-ply censoring frequency
- candidate-ply time originとpost-ascertainment landmarkの関係
- MTAJI-M1/M2 endpoint availability

formal endpoint、comparator、statistical unit、censoring rule、model、formal seed blockはStage 1結果を踏まえてStage 2でfreezeし、fresh held-out corpusのinspection前にpreregisterする。
