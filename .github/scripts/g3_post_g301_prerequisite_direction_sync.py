from pathlib import Path
import re

BASELINE_MAIN = "3301d797410f0cb4a1e392e277fc968435b36aea"
WORKING_EN = "Local Game-Tree Geometry Measurement Instrument Verification Study 1"
WORKING_JA = "Baoにおける局所ゲーム木幾何測定instrumentの新規prospective再構築と独立検証 — deterministic canonical manifest、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立"
DECISION_PATH = "doc/research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md"


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"anchor not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1))


decision = f'''# 2026-08-31 — Research Generation 3 post-G3-01 measurement-instrument prerequisite selected

## Decision status

```text
Decision type = PROGRAM-LEVEL DEPENDENCY DIRECTION
Decision date = 2026-08-31
Baseline main before this synchronization = {BASELINE_MAIN}
Scientific Study started by this decision = false
Formal Study ID assigned = false
Stage IDs assigned = false
Scientific seeds assigned or consumed = false
New scientific branch created = false
```

## Selected next scientific direction

G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`でclosedし、formal eligible measurement familiesは`[]`である。したがってG3-02を通常順序で開始せず、Research Generation 3の次のscientific actionとして、**G3-01とは別の新しいprospective independent measurement-instrument prerequisite Study**を置く。

現時点のworking titleは次とする。

**English working title**

**{WORKING_EN}**

**日本語working title**

**{WORKING_JA}**

このworking titleはprogram-level planning labelであり、正式Study title / Study ID / Stage IDではない。正式identityは新Study開始時にcurrent remote `main`、repository naming rule、Research Generation 3 governanceを再監査したうえでscientific outcome生成前にprospectively固定する。

## Program position

```text
G3-01 = CLOSED / TECHNICAL-INVALID
        ↓
new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
        ↓ only if formal eligibility is established
G3-02 and downstream geometry studies may be separately authorized
```

このprerequisiteは、

- G3-01のStudy 2ではない。
- G3-01のcorrected rerunではない。
- G3-01のformal decisionを変更・救済・再解釈しない。
- G3-02そのものではない。
- G3-01 Stage 1のconsumed seed block `31010001..31010096`を再利用しない。

## Mandatory design information carried forward

G3-01のfailure modeは**design information**としてのみ利用できる。新Studyでは少なくとも次をscientific outcome前に明示的に分離・固定する。

1. authoritative RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`を維持する。
2. validated transform setは`[]`のままとし、symmetry / canonicalizationをdeduplicationへ導入しない。
3. bounded local game tree / reachable RAW graphをproduction implementationとstructurally independent implementationで別々に再構築する。
4. scientific / verification canonical coreはdeterministic fieldsだけから構成する。
5. elapsed time、RSS、wall-clock、runner-specific telemetry等のruntime resource observationsはscientific canonical hash inputから完全に分離し、provenance / resource telemetryとして別管理する。
6. canonical serialization、canonical root ordering、traversal-order invariance、root-level digest、family-level digest、stage-level deterministic digestのcross-implementation reproducibilityを検証する。
7. fresh development evidenceと、authorization条件を満たした場合のfresh formal holdout evidenceを分離する。
8. fresh evidence read後のsame-evidence implementation repair、threshold relaxation、seed replacement、post-hoc gate変更を認めない。
9. G3-11用standard-root complete exact depth-10 holdoutはsealedのまま維持し、このprerequisiteでは生成・readしない。

具体的なmetric family、population、local horizon、sample/root count、resource ceiling、seed range、promotion / estimability gate、formal decision taxonomyはこのprogram decisionだけでは固定しない。新Study開始時にprospectively固定する。

## Downstream authorization boundary

```text
G3-02..G3-08 automatic start = BLOCKED
G3-09..G3-12 = NOT AUTHORIZED BY THIS DECISION
next prerequisite formal eligible measurement families = NOT YET ESTABLISHED
protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

新prerequisiteがformal eligible measurement familyを成立させた場合でも、その結果だけでG3-02を自動開始しない。closure後にResearch Generation 3 current stateを同期し、downstream authorization boundaryを改めて確認する。

新prerequisiteが`TECHNICAL-INVALID`、`NON-ESTIMABLE`、`INCONCLUSIVE`その他の非eligibility closureとなった場合は、G3-01をreopenせず、program dependencyを再評価する。

## Immutable upstream boundary

```text
Research Generation 2 = CLOSED
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator = null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED

G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 1 seed block = CONSUMED / NO REUSE
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Disposition

Research Generation 3は`ACTIVE`を維持する。dependency reassessmentの結果、次のscientific directionは新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisiteへ固定した。ただし本decisionは研究開始authorizationではなく、formal Study identity、scientific branch、seed、evidence generationは未開始である。
'''
Path(DECISION_PATH).write_text(decision)

checkpoint_path = Path("doc/research-generation-3/checkpoints/2026-08-31-post-g3-01-prerequisite-direction-selected.md")
checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
checkpoint_path.write_text(f'''# 2026-08-31 — Post-G3-01 prerequisite direction selected

```text
baseline main = {BASELINE_MAIN}
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
formal eligible measurement families = []
selected next direction = new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
working title = {WORKING_EN}
formal Study ID = NOT ASSIGNED
scientific Study execution = NOT STARTED
scientific seed consumption = NONE
G3-02..G3-08 automatic start = BLOCKED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

このcheckpointはprogram-level direction selectionのみを記録する。G3-01をreopen / rescueせず、新Studyの正式identity・Stage・seed・population・horizon・metric schema・gateは新Study開始時にcurrent repository stateを再監査してprospectively固定する。

Program-level decision: `../../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`
''')

Path("doc/research-generation-3/CURRENT_STATUS.md").write_text(f'''# Research Generation 3 — Current Status

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
Next Study working title = {WORKING_EN}
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

**{WORKING_EN}**

**{WORKING_JA}**

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
''')

Path("doc/research-generation-3/README.md").write_text(f'''# Research Generation 3

Bao第三世代研究programの文書入口です。

## 現在の状態

```text
Program = Bao Third-Generation Research Program
Status = ACTIVE / POST-G3-01 MEASUREMENT PREREQUISITE SELECTED / NOT STARTED
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Next scientific direction = new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
Next Study working title = {WORKING_EN}
Next Study formal Study ID = NOT ASSIGNED
Next Study scientific execution = NOT STARTED
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のprogram state、G3-01 closure、選択済みnext prerequisite、protected evidence
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — Research Generation 3開始前に固定したprospective program plan正本。current stateは`CURRENT_STATUS.md`を優先
- [`../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](../research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md) — G3-01後のdependency reassessmentにより次のmeasurement prerequisiteを選択したprogram-level decision
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md) — G3-01の初見向け概要
- [`../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md) — G3-01最終報告
- [`../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`](../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md) — 第三世代をlocal game-tree geometry方向として採用したprogram-level decision
- [`../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md`](../research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md) — G3-01 closureとdownstream dependency decision

## G3-01から確定したboundary

G3-01は`LGTGMF-STUDY1`としてprospectively実行した。Stage 1 fresh developmentではNamua 6 / Mtaji 6の全12 rootsについてproduction / independentのroot-level measurement coreとF1〜F5 family digestがexact一致した。

一方、凍結済みcanonical stage manifestの`stageCoreSha256`へruntime-dependentなelapsed / RSS等を含めたimplementation defectによりdeterministic stage-level verification contractを満たさなかった。fresh evidence生成後のsame-evidence repairは禁止していたため、Stage 1は`STAGE1-TECHNICAL-INVALID`、Studyは`TECHNICAL-INVALID`で閉じ、Stage 2を実行していない。

G3-01のformal eligible measurement family setは`[]`であり、この結果は変更しない。

## 次の研究方向

次のscientific actionとして、G3-01とは別の新しいprospective independent prerequisite Studyを置く。

**Working title:** {WORKING_EN}

**日本語working title:** {WORKING_JA}

このStudyはG3-01の再実行・救済・Study 2ではなく、G3-02でもない。G3-01 failure modeはdesign informationとしてのみ利用し、fresh Study identity / fresh seeds / fresh evidenceで測定instrument eligibilityを新規に検証する。

最重要設計原則は、**deterministic scientific / verification canonical coreとruntime resource telemetryの完全分離**である。production / structurally independent implementation、RAW-only identity、no symmetry reduction、canonical serialization、traversal-order invariance、root/family/stage digest reproducibilityを新Study開始時のprospective contractへ組み込む。

正式Study ID等はまだ付与しない。新Study開始時にcurrent `main`を再監査してprospectively固定する。

## Downstream boundary

G3-02〜G3-08のautomatic startは引き続きblockedである。新prerequisiteがformal eligible measurement familyを成立させた場合も、closure後のprogram state確認なしにG3-02を自動開始しない。G3-11用depth-10 exact holdoutはsealedのまま維持する。

## Upstream boundary

Research Generation 1 / 2のclosed Studyをreopen / rescueしない。

```text
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
```
''')

replace_once(
    "README.md",
    "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`でclosed、formal eligible measurement familiesは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、G3-02〜G3-08のautomatic startはblocked、depth 10はG3-11用holdoutとしてsealed。",
    "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`でclosed。次のscientific directionとして新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisiteを選択済みだが、正式Study ID・scientific execution・seed consumptionは未開始。G3-02〜G3-08はblocked、depth 10はG3-11用holdoutとしてsealed。\n- [`doc/research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](doc/research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md): G3-01をreopen / rescueせず、新しいprospective measurement-instrument prerequisiteを次の研究方向として選択したprogram-level decision。",
)

replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "Research Generation 3: **Active / dependency reassessment required after G3-01 (2026-08-31)**",
    "Research Generation 3: **Active / post-G3-01 measurement prerequisite selected / not started (2026-08-31)**",
)
agenda = Path("doc/FUTURE_RESEARCH_AGENDA.md")
text = agenda.read_text()
pattern = re.compile(r"### 10\.12 現在状態\n.*\Z", re.S)
if not pattern.search(text):
    raise SystemExit("FUTURE_RESEARCH_AGENDA 10.12 anchor not found")
new_1012 = f'''### 10.12 現在状態

2026-08-31、G3-01は`LGTGMF-STUDY1`としてprospectively開始され、Stage 1まで実行した後`TECHNICAL-INVALID`で閉じた。G3-01 scientific closureは`main`へ統合済みである。

```text
Research Generation 3 = ACTIVE / POST-G3-01 MEASUREMENT PREREQUISITE SELECTED / NOT STARTED
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 1 seed consumption = 31010001..31010096
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-01 Stage 2 seed consumption = NONE
next scientific direction = new post-G3-01 / pre-G3-02 measurement-instrument prerequisite
next Study working title = {WORKING_EN}
next Study formal Study ID = NOT ASSIGNED
next Study scientific execution = NOT STARTED
next Study scientific seed consumption = NONE
G3-02..G3-08 automatic start = BLOCKED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

G3-01 Stage 1では全12 selected rootsのproduction / independent root-level measurement coreとF1〜F5 family digestがexact一致したが、deterministic stage manifestを要求した凍結contractに対して、implementationがruntime-dependent resource observationsをstage hashへ含めたためtechnical integrity gateを満たさなかった。fresh evidence消費後のsame-evidence repairは禁止されているため、このdevelopment agreementをformal eligibilityへ昇格させない。

Dependency reassessmentの結果、次のscientific actionはG3-01をreopen / rescueせず、**新しいprospective independent measurement-instrument prerequisite Study**とすることをprogram-levelで選択した。working titleは`{WORKING_EN}`であるが、正式Study title / Study ID / Stage IDではない。

新StudyではG3-01のfailure modeをdesign informationとしてのみ利用する。deterministic scientific / verification canonical coreとelapsed / RSS等のruntime resource telemetryを完全分離し、production / structurally independent implementation、RAW-only identity、canonical serialization、traversal-order invariance、root/family/stage deterministic digest reproducibilityをfresh evidenceで新規検証する。G3-01 Stage 1 seed blockは再利用せず、fresh seedは新Study開始時にprospectively固定する。

新prerequisiteのformal eligibilityが成立するまでG3-02〜G3-08を開始しない。成立した場合もG3-02を自動開始せず、prerequisite closure後にdownstream authorizationを再確認する。standard-root complete exact depth-10 layerはG3-11用にsealedしたままとする。

Program-level decisionは[`research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md)を参照する。
'''
agenda.write_text(pattern.sub(new_1012, text))

idx = Path("doc/RESEARCH_INDEX.md")
text = idx.read_text()
sec_pattern = re.compile(r"### 30\. Research Generation 3 — G3-01 closure / dependency reassessment\n.*?\n---\n\n## 将来研究", re.S)
if not sec_pattern.search(text):
    raise SystemExit("RESEARCH_INDEX section 30 anchor not found")
new_sec = f'''### 30. Research Generation 3 — G3-01 closure / next measurement prerequisite selected

**Program:** Bao Third-Generation Research Program / **Core:** `G3-01..G3-12`  
**状態:** **ACTIVE / G3-01 `TECHNICAL-INVALID` / post-G3-01 prerequisite selected / not started**

Research Generation 3はRAW-only bounded exact analysisを基盤としてlocal game-tree geometryを扱うprogramである。最初のmeasurement foundation Study `G3-01`は正式に`LGTGMF-STUDY1`として開始・実行され、`TECHNICAL-INVALID`で閉じた。

Stage 0 corrective v2はtechnical pass。Fresh Stage 1ではNamua 6 / Mtaji 6の全12 rootsをdepth 5までproduction / independent双方でcomplete reconstructionし、root-level measurement coreとF1〜F5 family digestはすべてexact一致した。しかし、凍結済みcanonical stage manifestの`stageCoreSha256`へelapsed / RSS等のnon-deterministic resource observationsを含めたimplementation defectによりstage-level digestが一致しなかった。fresh seed消費後のsame-evidence repairは禁止されていたためfail-closedとした。

```text
LGTGMF-STUDY1 = TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed consumption = 31010001..31010096
Stage 2 seed consumption = NONE
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

Program contract上、G3-02〜G3-08は原則としてG3-01でformal eligibilityを得たmeasurement familyだけを利用する。本Studyのeligible setは空なので、同instrumentのまま後続Studyを自動開始しない。

2026-08-31のdependency reassessmentでは、次のscientific actionとして**G3-01とは別の新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisite Study**を置くことを選択した。

Working title:

**{WORKING_EN}**

このworking titleは正式Study identityではない。formal Study ID、Stage、seed、population、horizon、metric schema、resource ceiling、gateは未固定で、scientific executionも未開始である。G3-01 failure modeはdesign informationとしてのみ用い、runtime telemetryをdeterministic scientific canonical hashから分離し、fresh evidenceでinstrument reproducibilityを新規検証する。G3-01 Stage 1 seed blockは再利用しない。

**G3-01を最初に読む:**

- [`local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`](local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md)
- [`local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`](local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md)
- [`local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md`](local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md)
- [`local-game-tree-geometry-measurement-foundation/REPRODUCIBILITY_INDEX.md`](local-game-tree-geometry-measurement-foundation/REPRODUCIBILITY_INDEX.md)

**Program / next-direction records:**

- [`research-generation-3/PROGRAM_PLAN.md`](research-generation-3/PROGRAM_PLAN.md)
- [`research-generation-3/CURRENT_STATUS.md`](research-generation-3/CURRENT_STATUS.md)
- [`research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`](research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md)
- [`research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md`](research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md)
- [`research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md)

**Boundary:** G3-01をreopen / rescueせず、Stage 1 exact family agreementをformal eligibilityへ昇格しない。G2-05 depth-9 exact result、validated transform set `[]`、G2-11 / G2-12 closureを変更しない。standard-root depth 10はG3-11用にsealedしたまま維持する。G3-02〜G3-08はnew prerequisite closure後のauthorization reviewまでblockedである。

---

## 将来研究'''
text = sec_pattern.sub(new_sec, text)
old_future = "**Research Generation 3 state:** G3-01 `LGTGMF-STUDY1` is closed `TECHNICAL-INVALID`; formal eligible measurement families are empty and G3-02〜G3-08 automatic start is blocked pending a new prospective prerequisite or program-level dependency decision. Standard-root depth 10 remains sealed for G3-11."
new_future = f"**Research Generation 3 state:** G3-01 `LGTGMF-STUDY1` is closed `TECHNICAL-INVALID`. Dependency reassessment selected a new post-G3-01 / pre-G3-02 measurement-instrument prerequisite as the next scientific direction (`{WORKING_EN}` working title), but formal Study ID, scientific execution and fresh seed consumption are not started. G3-02〜G3-08 remain blocked and standard-root depth 10 remains sealed for G3-11."
if old_future not in text:
    raise SystemExit("RESEARCH_INDEX future-state anchor not found")
idx.write_text(text.replace(old_future, new_future, 1))

replace_once(
    "doc/local-game-tree-geometry-measurement-foundation/README.md",
    "G3-01のformal eligible measurement family setは空である。したがって、G3-02〜G3-08をこのinstrumentのまま自動開始してはならない。新しいprospective prerequisite StudyまたはResearch Generation 3 program-level dependency decisionが必要である。",
    f"G3-01のformal eligible measurement family setは空である。したがって、G3-02〜G3-08をこのinstrumentのまま自動開始してはならない。2026-08-31のprogram-level dependency decisionにより、次のscientific directionとしてG3-01とは別の新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisite（working title: `{WORKING_EN}`）を選択した。formal Study ID、scientific execution、fresh seed consumptionはまだ開始していない。",
)
replace_once(
    "doc/local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md",
    "Research Generation 3のdependency graphを再評価し、measurement instrumentを再構築する新しいprospective prerequisite Studyを設けるか、program-level dispositionを別途決定する必要がある。G3-01のclosed resultを修正・救済することは、その新しいStudyの目的には含めない。",
    f"2026-08-31のprogram-level dependency reassessmentにより、次のscientific directionとしてmeasurement instrumentを新規に再構築・検証するpost-G3-01 / pre-G3-02 prospective prerequisite Study（working title: `{WORKING_EN}`）を選択した。これはG3-01のStudy 2、corrected rerun、rescue、G3-02そのものではない。formal Study ID、scientific execution、fresh seed consumptionはまだ開始しておらず、G3-01のclosed resultは変更しない。",
)

checks = {
    "doc/research-generation-3/CURRENT_STATUS.md": [
        "Next Study formal Study ID = NOT ASSIGNED",
        "Next Study scientific execution = NOT STARTED",
        "Next Study scientific seed consumption = NONE",
        "Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ",
    ],
    DECISION_PATH: [
        "Scientific Study started by this decision = false",
        "Formal Study ID assigned = false",
        "Scientific seeds assigned or consumed = false",
    ],
}
for path, needles in checks.items():
    text = Path(path).read_text()
    for needle in needles:
        if needle not in text:
            raise SystemExit(f"sanity check failed: {path}: {needle}")

print("RG3 prerequisite direction synchronization prepared successfully")
