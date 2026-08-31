# Research Generation 3 — Current Status

Updated: 2026-08-31

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / POST-G3-01 MEASUREMENT PREREQUISITE SELECTED / NOT STARTED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Program plan main integration = COMPLETE
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-01 Stage 1 seed consumption = 31010001..31010096
G3-01 Stage 2 seed consumption = NONE
G3-01 main integration = COMPLETE
Next scientific direction = new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
Next Study working title = Local Game-Tree Geometry Measurement Instrument Verification Study 1
Next Study formal Study ID = NOT ASSIGNED
Next Study scientific execution = NOT STARTED
Next Study scientific seed consumption = NONE
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Active scientific research branch = NONE / next prerequisite not started
```

## Program direction

Research Generation 3は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、Baoの局所ゲーム木・局所到達グラフの構造幾何を中心研究対象とする。

G3-01がformal eligible measurement familyを生成せず`TECHNICAL-INVALID`で閉じたため、G3-02〜G3-08を同じinstrumentのまま自動開始しない。2026-08-31のprogram-level dependency decisionにより、次のscientific actionはG3-01とは別の新しいprospective measurement-instrument prerequisite Studyとすることを選択した。

## Selected next scientific direction

Working title:

**Local Game-Tree Geometry Measurement Instrument Verification Study 1**

**Baoにおける局所ゲーム木幾何測定instrumentの新規prospective再構築と独立検証 — deterministic canonical manifest、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**

Program positionは**post-G3-01 / pre-G3-02 prerequisite**である。これはG3-01のStudy 2、corrected rerun、rescue、G3-02そのものではない。

正式Study title、Study ID、Stage構成・Stage ID、fresh seed range、population、local horizon、metric schema、resource ceiling、promotion / estimability gate、formal decision taxonomyはまだ固定していない。新Study開始時にcurrent remote `main`とrepository governanceを再監査し、scientific outcome生成前にprospectively固定する。

## Mandatory design boundary for the next Study

- G3-01 Stage 1 seed block `31010001..31010096`は再利用しない。
- authoritative RAW identityを維持する。
- validated transform set `[]`を維持する。
- production / structurally independent implementationsを維持する。
- deterministic scientific / verification coreとruntime resource telemetryを完全に分離する。
- stage-level canonical digestはdeterministic scientific / identity fieldsだけから構成する。
- fresh developmentとfresh formal holdoutを分離する。
- fresh evidence read後のsame-evidence repairを認めない。
- standard initial RAW rootのcomplete exact depth-10 layerはG3-11用にsealedしたままとする。

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

standard initial RAW rootのdepth 10 exact layerはG3-11の`FRESH-DEEPER-EXACT-HOLDOUT`として引き続き保護する。

```text
complete depth-10 enumeration generated = false
depth-10 scientific counts / geometry outcome read = false
G2-12 estimator input to depth-10 holdout = false
```

## Downstream authorization boundary

```text
G3-02..G3-08 automatic start = BLOCKED
G3-09..G3-12 = NOT AUTHORIZED BY NEXT-DIRECTION SELECTION
next prerequisite formal eligible measurement families = NOT YET ESTABLISHED
```

新prerequisiteがformal eligibilityを成立させてもG3-02は自動開始しない。prerequisite closure後にcurrent stateとdownstream authorizationを改めて確認する。

## Canonical records

Program:
- `README.md`
- `PROGRAM_PLAN.md` — Research Generation 3開始前に固定したhistorical prospective plan
- `CURRENT_STATUS.md` — current-facing state
- `../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`
- `../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`

G3-01:
- `../local-game-tree-geometry-measurement-foundation/STUDY_1_PROTOCOL.md`
- `../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`
- `../local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md`
- `../local-game-tree-geometry-measurement-foundation/DECISION_REGISTER.md`
- `../local-game-tree-geometry-measurement-foundation/REPRODUCIBILITY_INDEX.md`

Research Generation 3 program planとG3-01 scientific closureはいずれも`main`へ統合済みである。次のprerequisite Studyはまだscientific startしていない。
