# Stage 1 Exploratory Pilot Runbook

更新日: 2026-08-09  
Status: **local pilot execution required / exploratory only / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 目的

`STAGE_1_EXPLORATORY_PROTOCOL.md` に従い、96-game exploratory pilotを生成し、clustering前のcorpus integrity / population / duplication / phase coverageを監査する。

この段階ではPython venvは不要である。

- generation: Node.js
- replay verification: Node.js
- population audit: Node.js

Python venvはpilot auditを確認した後のclustering / statisticsで使用する。

## 2. Branch更新

repository rootで:

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
node --version
```

Stage 1 generatorは研究ソースに未commit変更がある場合、provenance保護のため実行を拒否する。

## 3. Regression checks

```bash
node test/position-typology-features.test.js
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

失敗した場合はpilot generationへ進まない。

## 4. 96-game Stage 1 pilot

既定条件:

- 96 games
- base seed `20270001`
- max ply 100
- random opening 8 ply
- six generation strata, 16 games each
- unpaired opening seeds across conditions
- exploratory only
- future confirmatory seedとして再利用しない

実行:

```bash
node tools/experiments/run-position-typology-stage1-pilot.js
```

出力:

```text
artifacts/local/position-typology/stage1-pilot-v1/
├── games/
│   └── game-XXXX.json
└── manifest.json
```

中断後は同じコマンドでresumeする。

状態確認:

```bash
node tools/experiments/run-position-typology-stage1-pilot.js --status
```

source/config変更後に古いgameを誤再利用しないようconfig hashで拒否する。

## 5. Full verification

pilot生成完了後:

```bash
node tools/experiments/verify-position-typology-stage1-pilot.js
```

成功時:

```text
passed: true
exploratoryBoundary: passed
schemaValidation: passed
fullReplay: passed
storedObservationRecomputation: passed
moveLegality: passed
stateIdentity: passed
trajectoryHash: passed
summaryRecomputation: passed
sourceProvenance: passed
cleanSourceTree: passed
```

出力:

```text
artifacts/local/position-typology/stage1-pilot-v1/verification.json
```

## 6. Eligible-population audit

verification pass後:

```bash
node tools/experiments/audit-position-typology-stage1-pilot.js
```

Primary discovery populationは:

```text
terminal == false
ply >= 8
```

である。

Auditでは少なくとも次を出力する。

- terminal / max-ply-truncated games
- game length
- eligible positions per game
- phase counts
- condition counts
- phase × condition counts
- unique rule states
- duplicate rule-state slots by phase
- repeated rule-state keys
- rule states shared across trajectories
- largest rule-state occurrence
- unique seat-canonical states
- seat-canonical collapse

出力:

```text
artifacts/local/position-typology/stage1-pilot-v1/pilot-audit.json
```

## 7. この時点で停止

次はまだ実行しない。

- large corpus expansion
- clustering
- PCA
- position-type naming
- playing-style analysis
- Study 1 cross-study analysis

まずpilot結果をinspectionし、feature table / preprocessing / Python analysis toolingを確定する。

## 8. 研究再開時に共有するファイル

次の3ファイルを共有する。

```text
artifacts/local/position-typology/stage1-pilot-v1/manifest.json
artifacts/local/position-typology/stage1-pilot-v1/verification.json
artifacts/local/position-typology/stage1-pilot-v1/pilot-audit.json
```

`artifacts/local/` はGit commit対象外である。
