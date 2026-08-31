# Research Generation 3 — Current Status

Updated: 2026-08-31

```text
Program = Bao Third-Generation Research Program
Program status = PROSPECTIVE PLAN FROZEN ON RESEARCH BRANCH / NOT YET STARTED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Planning branch = research/g3-program-plan
Baseline main = cd200b85c1eb24aa4419bd5a9573552f3682f00d
Central documentation synchronization = COMPLETE ON PLANNING BRANCH
Temporary write-capable synchronization workflow = REMOVED
Temporary synchronization fragments = REMOVED
Scientific Study execution = NOT STARTED
Formal Study ID assignment = NOT STARTED
Seed consumption = NONE
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Main integration = NOT PERFORMED
```

## Program direction

Research Generation 3は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、Baoの局所ゲーム木・局所到達グラフの構造幾何を中心研究対象とする。

主題は次である。

- effective branching
- reply-width structure
- transposition concentration
- tree / graph divergence
- structural forcing corridor / decision funnel
- branch expansion / compression transition
- Bao rule mechanismとlocal geometryの関係
- search instabilityとlocal geometryの関係
- geometry persistence / memory
- continuous local-geometry representation
- representation-free longitudinal dynamics
- protected depth-10 exact holdout
- generalization / counterexample boundary

## Immutable upstream boundaries

```text
Research Generation 2 = CLOSED
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
```

Research Generation 3は、これらを修正・救済・再判定するprogramではない。

## Protected evidence

standard initial RAW rootのdepth 10 exact layerは、G3-11の`FRESH-DEEPER-EXACT-HOLDOUT`として保護する。

G3-01〜G3-10では、depth-10 scientific counts / geometry outcomeを生成・readしない。G2-12のproduction-only estimator proposalもdepth-10 holdoutのprediction contractまたはtruthとして使用しない。

## Central documentation synchronization

第三世代program planはplanning branch上で次の中央文書へ同期済みである。

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md` Version 3.0.0 / Section 10

同期用temporary workflowの初版はYAML parse段階で停止し、repository contentまたはscientific stateを変更しなかった。workflow mechanicsのみを修正し、run `33349600721`で3中央文書への同期を完了した。同期commitは`29d60820f516aad73350d8b5cf63aaa3180025bd`である。

同期完了後、temporary workflowと同期用fragmentはplanning branchから削除した。Authorization JSONはprovenanceとして保持するが、それをtriggerするtemporary workflowは存在しない。

## Next Study candidate

次に開始する候補はAgenda label `G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1`である。

ただし、現時点ではG3-01のformal Study ID、正式題目、Stage ID、seed range、population、horizon、metric schema、threshold、formal decision taxonomyは未固定である。これらはG3-01開始時にその時点のremote `main`とrepository naming ruleを再監査し、scientific outcome生成前にprospectively固定する。

## Canonical program records

- `README.md`
- `PROGRAM_PLAN.md`
- `CURRENT_STATUS.md`
- `authorizations/PROGRAM_SYNC_EXECUTE.json`
- `checkpoints/2026-08-31-program-plan-central-sync-complete.md`
- `../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`
- `../FUTURE_RESEARCH_AGENDA.md` Section 10
- `../RESEARCH_INDEX.md` Section 30

本statusはplanning branch上の状態であり、`main`への統合はまだ実施していない。Research Generation 3のscientific Studyもまだ開始していない。
