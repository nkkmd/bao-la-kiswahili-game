# Stage 0 Instrumentation Runbook

更新日: 2026-08-09  
Status: **local validation required / exploratory only / no formal experiment authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 目的

このrunbookは、Stage 0で追加したposition-typology instrumentationをローカル環境で検証するための手順である。

ここで生成するデータは**instrumentation smoke**であり、formal corpusでもtypology discovery corpusでもない。

このsmokeでは:

- clusteringを行わない
- position typeを命名しない
- playing styleを推定しない
- formal hypothesisを判定しない
- Study 1のformal decisionを変更しない

## 2. 実装済みファイル

```text
schemas/position-typology-observation.schema.json

tools/experiments/lib/position-typology-features.js
tools/experiments/run-position-typology-smoke.js
tools/experiments/verify-position-typology-smoke.js
tools/experiments/audit-position-typology-identity.js

test/position-typology-features.test.js
```

主な実装:

- full 32-pit state保存
- historical state hash
- `ruleStateKey`
- South/North seat exchangeを使った`seatCanonicalKey`
- actor/opponent別primitive board/legal-state features
- maximum capturable seeds
- relay / capture-chain primitive
- seed-distribution summary
- source-file SHA-256 provenance
- per-game atomic save / resume
- replay verification
- position / trajectory duplication summary
- reachable-state seat-symmetry identity audit

AI evaluation値、node数、探索深度などはposition observationのprimary featuresへ入れない。runnerのmove metadataに保存されるsearch diagnosticsはsecondary metadataである。

## 3. 前提

- Node.js 24推奨
- repository rootで実行
- branchが `research/position-typology-and-playing-style`
- working treeは可能ならcleanにする

確認:

```bash
git status --short
git branch --show-current
node --version
```

## 4. branch更新

```bash
git switch research/position-typology-and-playing-style
git pull --ff-only
```

## 5. Unit / regression checks

まず新instrumentation単体を確認する。

```bash
node test/position-typology-features.test.js
```

続いて既存symmetryの重要回帰を確認する。

```bash
node test/symmetry-transform.test.js
node test/transition-symmetry.test.js
node test/evaluation-symmetry.test.js
```

いずれかが失敗した場合、smoke generationへ進まない。

## 6. Stage 0 instrumentation smoke

既定条件:

- 16 games
- base seed `20260809`
- maximum 100 ply
- 最初の8 plyはseeded uniform legal random opening
- 4 generation strataを均等に巡回
  - `P2-D1`: phase2 / bao / depth1
  - `P2-D2`: phase2 / bao / depth2
  - `LG-D2`: legacy search / bao / depth2
  - `V2-D2`: phase2 / bao-v2 / depth2

これらのcondition labelはsampling metadataであり、position-type featureには入らない。

実行:

```bash
node tools/experiments/run-position-typology-smoke.js
```

出力:

```text
artifacts/local/position-typology/stage0-smoke-v1/
├── games/
│   └── game-XXXX.json
└── manifest.json
```

`artifacts/local/` は `.gitignore` 対象であり、smoke corpusをrepositoryへcommitしない。

中断後は同じコマンドで既存gameを再利用する。source instrumentationが変わった場合はconfig hashが変わるため、古いgameの誤再利用を拒否する。

状態確認:

```bash
node tools/experiments/run-position-typology-smoke.js --status
```

明示的に再生成する場合のみ:

```bash
node tools/experiments/run-position-typology-smoke.js --force
```

## 7. Replay / schema / provenance verification

smoke完了後:

```bash
node tools/experiments/verify-position-typology-smoke.js
```

成功時に以下を確認する。

```text
passed: true
schemaValidation: passed
fullReplay: passed
storedObservationRecomputation: passed
moveLegality: passed
stateIdentity: passed
trajectoryHash: passed
summaryRecomputation: passed
sourceProvenance: passed
```

出力:

```text
artifacts/local/position-typology/stage0-smoke-v1/verification.json
```

## 8. Seat-canonical identity audit

次に、smokeで得たunique reachable rule statesを使い、既存symmetry研究から継承したSouth/North seat exchangeが新しいtypology identityでも成立するか再監査する。

```bash
node tools/experiments/audit-position-typology-identity.js
```

監査項目:

- `mirror(mirror(state)) == state`
- mirrored stateで同じ`seatCanonicalKey`
- legal move集合のseat-symmetry
- 全合法着手のapply後state symmetry
- namua / mtaji双方のcoverage

出力:

```text
artifacts/local/position-typology/stage0-smoke-v1/identity-audit.json
```

`passed: true` と `failures: []` を要求する。

## 9. Stage 0 data-quality inspection

`manifest.json` の `summary` から最低限次を確認する。

- `games`
- `observations`
- `phaseCounts`
- `conditionCounts`
- `positions.raw`
- `positions.uniqueRuleState`
- `positions.duplicateRuleStateSlots`
- `positions.uniqueSeatCanonical`
- `positions.seatCanonicalCollapse`
- `positions.withinTrajectoryRepeatedRulePositions`
- `trajectories.uniqueHistorical`
- `trajectories.uniqueRuleState`
- `trajectories.uniqueSeatCanonical`
- `trajectories.dominantHistoricalTrajectoryRate`
- `openings.uniqueRuleState`
- `openings.dominantRate`

この段階では数値thresholdを後付けでformal gateにしない。目的はStage 1 exploratory corpusのsampling designを決めるためのdistribution auditである。

## 10. 研究再開時に共有するもの

ローカル実行後、研究判断に必要なのは次の3ファイルである。

```text
artifacts/local/position-typology/stage0-smoke-v1/manifest.json
artifacts/local/position-typology/stage0-smoke-v1/verification.json
artifacts/local/position-typology/stage0-smoke-v1/identity-audit.json
```

これらはGitへcommitせず、次の研究セッションで内容を確認する。

## 11. 次工程へ進む条件

次のすべてを満たすまではStage 1 clusteringへ進まない。

1. new feature unit tests pass
2. existing symmetry regression tests pass
3. smoke generation complete
4. replay / schema / provenance verification pass
5. identity audit pass
6. phase / opening / trajectory / position duplication summaryをinspection済み
7. Stage 1 corpus sampling designを結果と区別して明文化

これらを満たした後に初めて、次をdecisionする。

- namua / mtaji分離
- exact / seat-canonical dedup policy
- raw pit vector vs structural summaries
- trajectory-balanced weighting / subsampling
- exploratory generation strata
- clustering / rule-based / semi-supervised比較方針

formal confirmationはさらに後段であり、新規preregistrationと未使用seed blockを要求する。
