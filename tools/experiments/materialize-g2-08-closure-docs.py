#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, text):
    (ROOT / path).write_text(text, encoding="utf-8")


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)


def append_once(text, marker, block, label):
    if marker in text:
        return text
    if not text.endswith("\n"):
        text += "\n"
    return text + "\n" + block.rstrip() + "\n"


def insert_after_line_containing(text, needle, line, label):
    if line in text:
        return text
    lines = text.splitlines(keepends=True)
    hits = [i for i, x in enumerate(lines) if needle in x]
    if len(hits) != 1:
        raise SystemExit(f"{label}: expected exactly one line containing {needle!r}, found {len(hits)}")
    i = hits[0]
    lines.insert(i + 1, line + "\n")
    return "".join(lines)


# Study README
p = "doc/machine-decision-failure-taxonomy/README.md"
t = read(p)
t = insert_after_line_containing(
    t,
    "`STUDY_1_OVERVIEW.md`",
    "- `STUDY_1_FINAL_REPORT.md` — Study 1の科学的・技術的最終統合",
    "study README final-report link",
)
start = "## 現在の実行状態\n"
idx = t.find(start)
if idx < 0:
    raise SystemExit("study README: current-state anchor missing")
t = t[:idx] + """## 現在の実行状態

```text
Study = CLOSED / NON-ESTIMABLE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 seeds 28910001..28914096 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
```

Stage 1は4,096 fresh gamesから512 rootsを選択し、production / independent full recomputationとmandatory artifact preservationを完了しました。しかし、prospectively frozen global readiness gateのうちopening-prefix diversity (`2836 < 3000`) とmaximum single source-policy share (`170/512 > 0.32`) が未達でした。

Leaf-level development計算ではF01/F02/F03/F05/F06/F10がpromotion formulaを満たしましたが、global readiness failureのためtaxonomyとしてfreezeせず、Stage 2 targetにも使用しません。詳細は`STUDY_1_FINAL_REPORT.md`を参照してください。
"""
write(p, t)

# Human-facing overview: replace whole study-specific file.
overview = """# G2-08 / MDFT-STUDY1 — 研究概要

更新日: 2026-08-30  
状態: **Study closed / `NON-ESTIMABLE`**

## 何を調べたか

本研究は、Baoのmachine/search decision failureを単一の「悪手」classへ圧縮せず、depth/horizon、quiescence、budget、reply resolution、capture/forcing sequence、ranking、reserve/house valuation、morphology、long-horizon structureといった複数のmechanistic failure modeへprospectively分解できるかを調べたResearch Generation 2 `G2-08`の独立研究です。

Higher-resource searchはgame-theoretic truthではなく、frozen machine referenceとしてのみ使用しました。Human difficulty、confusion、deception、error probability等は研究対象外です。

## 結果

Stage 0は`STAGE0-TECHNICAL-PASS`でした。F09 morphology-context mismatchだけは、historically frozen classifierをcurrent preserved repositoryからexact再構築できなかったため、scientific evidenceを見る前に`TECHNICALLY-INELIGIBLE`として除外しました。

Stage 1はfresh seeds `28910001..28914096`の4,096 gamesをconsume-onceで実行し、512 roots（Namua 256 / Mtaji 256）をoutcome-blindに選択しました。Productionとstructurally independent implementationはsource generation、root selection、analysis rows、development coreをexact一致させ、full artifactsも正常に保存されました。

しかしprospectively frozen global readiness gateのうち2件が未達でした。

```text
distinct opening prefixes = 2836 < 3000
LOW_CAPTURE share = 170 / 512 = 0.33203125 > 0.32
```

このためStage 1のformal dispositionは:

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

Study 1のformal decisionは:

```text
NON-ESTIMABLE
```

です。

## Leaf-level observationの扱い

Frozen development promotion formula自体はF01/F02/F03/F05/F06/F10で`true`を返しました。一方F04/F07/F08は`false`、F09は事前technical exclusionでした。

ただしglobal readiness gateが失敗しているため、F01/F02/F03/F05/F06/F10を「validated taxonomy」または「Stage 2 target」として救済しません。これらは将来の新しいprospective studyの仮説生成に使えるdevelopment observationに限られます。

## Stage 2

Stage 1がpassしなかったためStage 2は:

```text
NOT-AUTHORIZED-NOT-EXECUTED
```

です。Reserved seeds `29010001..29018192`は未消費です。

同じStage 1 evidenceを見た後でopening-prefix floorを下げる、policy-share ceilingを緩和する、rootsを間引く、seedを追加する、populationを置換する等の救済は行いません。

## 詳細

- `STUDY_1_FINAL_REPORT.md` — 最終科学的統合
- `CURRENT_STATUS.md` — formal closure state
- `DECISION_REGISTER.md` — immutable decisions / no-rescue boundary
- `REPRODUCIBILITY_INDEX.md` — source / hash / artifact / Actions run
- `results/STAGE_1_DEVELOPMENT_RESULT.json` — canonical Stage 1 result
- `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md` — Stage 1 closure checkpoint
"""
write("doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md", overview)

# Decision register append-only closure decisions.
p = "doc/machine-decision-failure-taxonomy/DECISION_REGISTER.md"
t = read(p)
t = replace_once(t, "更新日: 2026-08-29", "更新日: 2026-08-30", "decision register date")
block = """## D31 — Stage 1 source/spec/preflight freeze

Before scientific consumption, Stage 1 spec SHA-256 `85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203`, source blobs, runner/workflow, resource ceilings and artifact contract were frozen. Canonical technical preflight run `33258188633` and runner-readiness run `33277031634` both passed without reporting target distribution.

Status: **FROZEN PRE-CONSUMPTION CONTRACT**.

## D32 — Stage 1 authorization and consumption

Explicit authorization triggered only run `33277102013` at execution HEAD `dfb9bf316dc767ae5920aba5a3308aa5f05d3acf`. Its execution-start gate passed at `2026-08-29T21:50:53.337Z`.

```text
Stage 1 seeds 28910001..28914096 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
```

This supersedes the earlier current-state entries in D13/D26 without altering their historical meaning at reservation time.

Status: **FROZEN CONSUME-ONCE BOUNDARY**.

## D33 — Stage 1 technical integrity

Run `33277102013` completed successfully. Production and independent implementations exactly matched source generation, root selection, selected-root identity, all analysis rows and development core. Mandatory full artifacts were preserved.

```text
production core = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent core = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
production full shard = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
independent full shard = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Status: **TECHNICAL-INTEGRITY-PASS**.

## D34 — Stage 1 global readiness failure

Two prospectively frozen global readiness gates failed:

```text
distinct opening prefixes = 2836 < 3000
maximum single source-policy share = LOW_CAPTURE 170/512 = 0.33203125 > 0.32
```

No threshold relaxation, root deletion, subgrouping, seed extension or replacement is authorized.

Status: **STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE**.

## D35 — Leaf-level promotion calculations are not taxonomy promotion

The frozen formula returned `promoted=true` for F01/F02/F03/F05/F06/F10 and `false` for F04/F07/F08. F09 was prospectively technically ineligible.

Because D34 failed globally, none of the six `true` calculations becomes a frozen taxonomy leaf or Stage 2 formal target in this Study 1. They remain development observations only.

Status: **FROZEN INTERPRETATION BOUNDARY / NO RESCUE**.

## D36 — Study closure and Stage 2

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
Study = NON-ESTIMABLE
```

A future taxonomy attempt must be a new prospective study/version with fresh population and seed contracts.

Status: **FROZEN STUDY CLOSURE**.
"""
t = append_once(t, "## D31 — Stage 1 source/spec/preflight freeze", block, "decision register closure")
write(p, t)

# Research log append.
p = "doc/machine-decision-failure-taxonomy/RESEARCH_LOG.md"
t = read(p)
block = """## 2026-08-29 — Stage 1 preregistration / preflight / source freeze

1. Stage 1 exact spec SHA-256 `85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203`をscientific outcome前に固定した。
2. Production / independent Stage 1 implementationsを別実装として作成した。
3. 初回technical preflightでanalysis comparison mismatchとworkflow `tee` exit-code maskingを検出し、scientific seed未消費のまま修正した。
4. Corrected fail-closed preflight run `33258188633`がproduction/independent exact equality、resource projection、8 MiB artifact transfer probeをすべてPASSした。
5. Scientific runner readiness run `33277031634`がPASSした。
6. Source blobs、scientific runner/workflow、artifact/resource contractをsource freezeした。
7. Explicit Stage 1 authorizationを別artifactとして発行した。

## 2026-08-29 — Stage 1 consume-once execution

1. Authorized run `33277102013`のexecution-start gateがPASSした。
2. Seeds `28910001..28914096`を永久に`CONSUMED`とした。
3. same-block rerun / repair / replacement / extensionを禁止した。
4. Production / independent full development calculationを実行した。
5. Mandatory artifact uploadを完了した。

## 2026-08-30 — Stage 1 canonical result / Study closure

1. Production / independent source generation、selection、selected-root identity、analysis rows、development coreがexact一致した。
2. Development core SHA-256は双方`f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c`だった。
3. Full production / independent gzip shardは双方665,093 bytes、SHA-256 `21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830`で一致した。
4. Resource ceilingsとmandatory artifact preservationはPASSした。
5. Fresh 4,096 gamesから4,068 unique trajectories、512 roots（Namua/Mtaji 256/256）を得た。
6. Global readinessで`distinctOpeningPrefixes=2836 < 3000`と`LOW_CAPTURE=170/512 > 0.32`の2 gateがFAILした。
7. Frozen promotion formulaはF01/F02/F03/F05/F06/F10でtrueだったが、global readiness failureのためtaxonomy/Stage 2 targetへ昇格させなかった。
8. Stage 1を`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`、Studyを`NON-ESTIMABLE`として閉じた。
9. Stage 2を`NOT-AUTHORIZED-NOT-EXECUTED`とし、seeds `29010001..29018192`は`RESERVED / UNCONSUMED`のまま保持した。
"""
t = append_once(t, "## 2026-08-29 — Stage 1 preregistration / preflight / source freeze", block, "research log closure")
# Remove stale terminal Next section if present.
old_next = """## Next

Stage 1 exact machine-readable spec、production/independent implementation、technical-only scientific-scale resource/artifact preflight、source freeze、explicit Stage 1 authorizationをこの順で行う。authorization recordより前にStage 1 scientific blockを消費してはならない。
"""
if old_next in t:
    t = t.replace(old_next, "")
write(p, t)

# Resume Here: replace whole study-specific file.
resume = """# MDFT-STUDY1 — Resume Here

更新日: 2026-08-30

## 現在地

G2-08 / `MDFT-STUDY1`は完了しています。

```text
baseline main = cb660e166460e0f19d4ba16d5283fa880d55757f
branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 seeds 28910001..28914096 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
Study = NON-ESTIMABLE
```

## 最初に読む

1. `STUDY_1_OVERVIEW.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `CURRENT_STATUS.md`
4. `DECISION_REGISTER.md`
5. `results/STAGE_1_DEVELOPMENT_RESULT.json`
6. `results/STAGE_1_FINAL_EXACT_COMPARISON.json`
7. `results/STAGE_1_ARTIFACT_MANIFEST.json`
8. `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md`
9. `REPRODUCIBILITY_INDEX.md`

## Canonical Stage 1 anchors

```text
spec SHA-256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
scientific run = 33277102013
artifact = 9722157483
production/independent core = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

## Closure reason

```text
distinct opening prefixes = 2836 < 3000
LOW_CAPTURE selected share = 170/512 = 0.33203125 > 0.32
```

These are preregistered global readiness failures. F01/F02/F03/F05/F06/F10 had leaf-level promotion calculation `true`, but they are not a frozen taxonomy because the global gate failed.

## 禁止事項

- Stage 1 seed blockのsame-block rerun / repair / replacement / extension
- opening-prefix floorのpost-hoc relaxation
- source-policy maximum-share ceilingのpost-hoc relaxation
- LOW_CAPTURE rootsのpost-hoc deletionによるrescue
- leaf-level `promoted=true`をStage 2 targetへ直接昇格
- F09のreplacement/refit
- G2-07やBMPの既存formal decisionの変更
- G2-03未validated transformによるcanonicalization

将来この問いを再検討する場合は、新しいStudy/version、fresh seeds、prospectively frozen population contractを使用してください。
"""
write("doc/machine-decision-failure-taxonomy/RESUME_HERE.md", resume)

# Reproducibility index: targeted updates + append.
p = "doc/machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md"
t = read(p)
t = replace_once(t,
    "更新日: 2026-08-29  \n状態: **STAGE 0 TECHNICAL PASS / STAGE 1 RESERVED UNCONSUMED**",
    "更新日: 2026-08-30  \n状態: **STUDY CLOSED / NON-ESTIMABLE**",
    "repro status")
t = replace_once(t,
    "Stage 1 = 28910001..28914096 / 4096 / RESERVED / UNCONSUMED\nStage 2 = 29010001..29018192 / 8192 / RESERVED / UNCONSUMED",
    "Stage 1 = 28910001..28914096 / 4096 / CONSUMED\nStage 2 = 29010001..29018192 / 8192 / RESERVED / UNCONSUMED",
    "repro seeds")
block = """## Stage 1 canonical closure

```text
spec SHA-256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
technical preflight run = 33258188633 / PASS
runner readiness run = 33277031634 / PASS
scientific run = 33277102013 / success
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
actions artifact id = 9722157483
artifact ZIP SHA-256 = bb34d16874175dcb581ad8725983a3ed4778687c0f3a2965ae929daaffbfe921
```

Exact development core:

```text
production = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
match = true
```

Full shards:

```text
production/full-shard-0001.json.gz = 665093 bytes / 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
independent/full-shard-0001.json.gz = 665093 bytes / 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Canonical repository outputs:

```text
results/STAGE_1_DEVELOPMENT_RESULT.json
results/STAGE_1_FINAL_EXACT_COMPARISON.json
results/STAGE_1_ARTIFACT_MANIFEST.json
checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md
STUDY_1_FINAL_REPORT.md
```

Scientific closure:

```text
unique trajectories = 4068
distinct opening prefixes = 2836 / required >= 3000 / FAIL
selected roots = 512
LOW_CAPTURE selected = 170/512 = 0.33203125 / required <= 0.32 / FAIL
reference consensus = 473
reference disagreement events = 110
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```
"""
t = append_once(t, "## Stage 1 canonical closure", block, "repro closure")
write(p, t)

# Root README: one localized research-index bullet.
p = "README.md"
t = read(p)
t = insert_after_line_containing(
    t,
    "doc/practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md",
    "- [`doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md`](doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-08` / `MDFT-STUDY1`。Stage 0 technical PASS後、fresh Stage 1 4,096 gamesをproduction/independent exact一致で完遂したが、opening-prefix diversityとmaximum source-policy shareの2 preregistered readiness gate未達によりStudy formal decision `NON-ESTIMABLE`。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。",
    "root README G2-08 registration",
)
write(p, t)

# RESEARCH_INDEX: insert one section before Future Research.
p = "doc/RESEARCH_INDEX.md"
t = read(p)
if "### 24. Machine Decision-Failure Taxonomy — Study 1" not in t:
    anchor = "\n## 将来研究\n"
    if t.count(anchor) != 1:
        raise SystemExit(f"RESEARCH_INDEX future-research anchor count={t.count(anchor)}")
    section = """
### 24. Machine Decision-Failure Taxonomy — Study 1

**研究題目:** Baoにおける機械的意思決定失敗の構造分類 — horizon failure, reply undercoverage, ranking instability, tactical oversight, valuation failure, morphology mismatch, and long-horizon structural misvaluation のprospective分離・再現可能なtaxonomy構築  
**Program:** `G2-08` / **Study ID:** `MDFT-STUDY1` / **Research Generation 2**  
**状態:** **Study closed / formal decision `NON-ESTIMABLE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

Stage 0は`STAGE0-TECHNICAL-PASS`。Fresh Stage 1では4,096 gamesから512 roots（Namua/Mtaji 256/256）を選択し、productionとstructurally independent implementationがsource generation、selection、analysis rows、development coreをexact一致させ、mandatory full artifactsも保存した。

一方、prospectively frozen global readiness gateのうち、distinct opening prefixesが`2836 < 3000`、最大single source-policy shareがLOW_CAPTURE `170/512 = 0.33203125 > 0.32`で未達となった。このためStage 1は`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`、Studyは`NON-ESTIMABLE`で閉じた。

F01/F02/F03/F05/F06/F10はleaf-level development promotion formulaを満たしたが、global readiness failureのためvalidated/frozen taxonomyまたはStage 2 targetへ昇格しない。F04/F07/F08はpromotion false、F09はscientific entry前にtechnical-ineligibleだった。Stage 2 seeds `29010001..29018192`は未消費である。

**最初に読む:**

- [`machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md`](machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`machine-decision-failure-taxonomy/STUDY_1_FINAL_REPORT.md`](machine-decision-failure-taxonomy/STUDY_1_FINAL_REPORT.md)
- [`machine-decision-failure-taxonomy/CURRENT_STATUS.md`](machine-decision-failure-taxonomy/CURRENT_STATUS.md)
- [`machine-decision-failure-taxonomy/DECISION_REGISTER.md`](machine-decision-failure-taxonomy/DECISION_REGISTER.md)
- [`machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md`](machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md)

---
"""
    t = t.replace(anchor, "\n" + section + anchor, 1)
write(p, t)

# FUTURE_RESEARCH_AGENDA: localized G2-08 block replacement and sequence summary update.
p = "doc/FUTURE_RESEARCH_AGENDA.md"
t = read(p)
pattern = re.compile(r"#### G2-08 — Machine Decision-Failure Taxonomy Study 1\n.*?(?=#### G2-09 )", re.S)
matches = list(pattern.finditer(t))
if len(matches) != 1:
    raise SystemExit(f"FUTURE_RESEARCH_AGENDA G2-08 block count={len(matches)}")
replacement = """#### G2-08 — Machine Decision-Failure Taxonomy Study 1

**状態:** completed / `MDFT-STUDY1 = NON-ESTIMABLE`

中心課題:

> 「悪手class」を直接promotionするのではなく、machine/search decision failureを再現可能なmechanistic failure modesへ分解できるか。

Stage 0は`STAGE0-TECHNICAL-PASS`。Fresh Stage 1は4,096 games、4,068 unique trajectories、512 selected roots（Namua/Mtaji 256/256）を用い、production / independent full recomputationとmandatory artifact preservationをexact一致で完了した。しかしprospectively frozen global readiness gateのうち、distinct opening prefixes `2836 < 3000`とLOW_CAPTURE selected share `170/512 = 0.33203125 > 0.32`が未達となったため、Stage 1は`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`、Study formal decisionは`NON-ESTIMABLE`である。

Leaf-level development promotion formulaはF01/F02/F03/F05/F06/F10でtrueだったが、global readiness failure後にこれらをtaxonomy/Stage 2 targetへ救済しない。F04/F07/F08はfalse、F09はhistorical morphology classifierをexact再構築できずscientific evidence前にtechnical-ineligibleだった。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、reserved seeds `29010001..29018192`は未消費である。

BMP Study 1の0 `CONFIRMED` / 4 `NOT-CONFIRMED`、G2-07 technical-invalid closure、その他既存研究のformal decisionは変更しない。同じStage 1 evidenceへのthreshold relaxation、source-policy reweighting、root deletion、seed extension、replacement populationによる救済は禁止する。

**Priority:** completed

"""
t = pattern.sub(replacement, t, count=1)
old = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`、`G2-05`は`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`として、それぞれprospective ruleに従い完了した。`G2-06`は`RCPR-STUDY1`としてStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。`G2-07`も`PCRPR-STUDY1`として実行され、mandatory full independent final verificationをartifact-transfer failureによりmaterializeできなかったためStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。G2-03のvalidated transform setは空のままで、G2-04/G2-06/G2-07の未実行Stage 2を後続Studyで救済しない。G2-01..G2-07はclosure済みであり、次の未着手machine-only agenda itemは`G2-08 — Machine Decision-Failure Taxonomy Study 1`である。"
new = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`、`G2-05`は`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`として、それぞれprospective ruleに従い完了した。`G2-06`は`RCPR-STUDY1`としてStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`、`G2-07`は`PCRPR-STUDY1`としてStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。`G2-08`も`MDFT-STUDY1 = NON-ESTIMABLE`としてclosedとなり、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。G2-03のvalidated transform setは空のままで、既存Studyの未実行Stage 2を後続Studyで救済しない。G2-01..G2-08はclosure済みであり、次の未着手machine-only agenda itemは`G2-09 — Motif Generalization / Counterexample Study 1`である。"
t = replace_once(t, old, new, "FUTURE_RESEARCH_AGENDA sequence summary")
write(p, t)

print("G2-08 closure documentation materialized safely")
