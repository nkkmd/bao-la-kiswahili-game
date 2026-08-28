#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def replace_once(path, old, new):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected exactly one anchor, found {count}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


def append_once(path, sentinel, addition):
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    if sentinel in text:
        raise SystemExit(f"{path}: sentinel already present")
    if not text.endswith("\n"):
        text += "\n"
    p.write_text(text + addition, encoding="utf-8")


# Root README: insert G2-05 immediately after G2-04.
readme_g204 = "- [`doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md`](doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-04` / `REEOE-STUDY1`。Stage 0 technical controlはPASS。Fresh Stage 1 v2は8 rootsを独立再構築したがcomplete closureは0/8（STATE-LIMIT 4 / ADMIN-CUTOFF 3 / MOVE-NONTERMINATION 1）でfrozen feasibility gateを満たさず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。formal decisionは`INCONCLUSIVE`、fresh exact oracleは未生成"
readme_g205 = "- [`doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`](doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-05` / `DRSSE-STUDY1`。Standard initial RAW rootをprospectively固定し、depth 0..9をcomplete enumeration。formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`、累積102,857 RAW states / 136,645 tree-node occurrences。full Bao state-space / game-tree estimateではなく、symmetry reduction / canonicalizationは未使用"
replace_once("README.md", readme_g204, readme_g204 + "\n" + readme_g205)

# Central research index: add Study 21 before the Future Research section.
index_anchor = "**Boundary:** fresh G2-04 exact oracleは生成されていない。`STATE-LIMIT` / `ADMIN-CUTOFF`はgame outcomeではなく、`MOVE-NONTERMINATION`もgame-level `RECURRENT` / `DRAW`へ読み替えない。将来別のstructural/resource contractでexact expansionを試す場合はnew prospective Study/versionとfresh evidenceを必要とする。\n\n---\n\n## 将来研究"
index_g205 = """**Boundary:** fresh G2-04 exact oracleは生成されていない。`STATE-LIMIT` / `ADMIN-CUTOFF`はgame outcomeではなく、`MOVE-NONTERMINATION`もgame-level `RECURRENT` / `DRAW`へ読み替えない。将来別のstructural/resource contractでexact expansionを試す場合はnew prospective Study/versionとfresh evidenceを必要とする。

---

### 21. Deep RAW State-Space Enumeration — Study 1

**研究題目:** Baoにおける深層RAW状態空間の完全列挙 — prospectively fixed roots に対する bounded-depth complete enumeration, reachable-state growth, branching structure, transposition structure, and tree/graph occurrence ratio の厳密解析  
**Program:** `G2-05` / **Study ID:** `DRSSE-STUDY1` / **Research Generation 2**  
**状態:** **Study complete / formal decision `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

Standard initial RAW rootをoutcome前に固定し、authoritative RAW identityのみを用いてdepth 0..9の全reachable layerとparent depths 0..8の全合法edge expansionを完全列挙した。Production materializationとmandatory independent full-domain re-enumerationはいずれもPASSした。

```text
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

Depth 9では78,009 unique RAW states、105,704 tree occurrences、3,116 duplicate arrivals、2,658 multi-predecessor statesをexactに記録した。validated transform setは`[]`のままで、symmetry reduction / canonicalizationは使用していない。

**最初に読む:**

- [`deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`](deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`deep-raw-state-space-enumeration/STUDY_1_FINAL_REPORT.md`](deep-raw-state-space-enumeration/STUDY_1_FINAL_REPORT.md)
- [`deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json`](deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json)
- [`deep-raw-state-space-enumeration/results/STUDY_1_FINAL_RESULT.json`](deep-raw-state-space-enumeration/results/STUDY_1_FINAL_RESULT.json)
- [`deep-raw-state-space-enumeration/REPRODUCIBILITY_INDEX.md`](deep-raw-state-space-enumeration/REPRODUCIBILITY_INDEX.md)
- [`deep-raw-state-space-enumeration/CURRENT_STATUS.md`](deep-raw-state-space-enumeration/CURRENT_STATUS.md)
- [`deep-raw-state-space-enumeration/DECISION_REGISTER.md`](deep-raw-state-space-enumeration/DECISION_REGISTER.md)

**Boundary:** exact claimはprospectively frozen standard-root depth-9 RAW domainだけに限定される。G2-04を救済せず、G1 SSGTCのformal decisionも変更しない。full Bao state-space / game-tree complexity、unbounded growth、asymptotic extrapolationはG2-05のendpointではなく、G2-12等のnew prospective Studyを必要とする。

---

## 将来研究"""
replace_once("doc/RESEARCH_INDEX.md", index_anchor, index_g205)

# Future agenda: replace the prospectively planned G2-05 block with completed state.
agenda_old = """#### G2-05 — Deep RAW State-Space Enumeration Study 1

**状態:** planned / new prospective bounded-exact study

中心課題:

> standard rootまたはprospectively fixed rootsから、第一世代depth-8 domainを超えるbounded depthまでRAW-only complete enumerationを行い、per-depth reachable-state growth、branching、transposition structure、tree/graph occurrence比をexactに記述できるか。

SSGTC-STUDY1のpartial depth-9 rowsはformal evidenceまたはestimateへ再利用しない。target depth、resource ceiling、complete-layer requirement、stop ruleをoutcome前にfreezeし、未完layerをexact countとして扱わない。

本Studyは**bounded exact enumerationだけ**を扱い、full-game growth estimationを同一Study内で結果後に追加しない。

**Priority:** P0"""
agenda_new = """#### G2-05 — Deep RAW State-Space Enumeration Study 1

**状態:** **完了 / `DRSSE-STUDY1` / formal decision `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

中心課題:

> standard rootまたはprospectively fixed rootsから、第一世代depth-8 domainを超えるbounded depthまでRAW-only complete enumerationを行い、per-depth reachable-state growth、branching、transposition structure、tree/graph occurrence比をexactに記述できるか。

Study-start時点でstandard initial RAW root、target depth 9、resource ceilings、complete-layer rule、formal decision taxonomyをfreezeした。Stage 0 technical validationとfresh Stage 1 development readinessを通過後、Stage 2を一度だけauthorizeして実行し、productionとindependent full-domain re-enumerationが一致した。

```text
complete layers = 0..9
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

SSGTC-STUDY1のpartial depth-9 rows、G2-04 selected roots / partial closures、G2-05 Stage 1 rows / rootsはformal evidenceへ再利用しなかった。validated transform setは`[]`で、symmetry reduction / canonicalizationは未使用である。

本Studyは**bounded exact enumerationだけ**を扱い、full-game growth estimationを同一Study内で結果後に追加しない。したがってfull Bao state-space / game-tree sizeの推定はG2-12へ残す。

**Priority:** P0 / completed"""
replace_once("doc/FUTURE_RESEARCH_AGENDA.md", agenda_old, agenda_new)

agenda_old_status = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`として、それぞれprospective stop/global-failure/feasibility ruleに従い完了した。G2-03のvalidated transform setは空のままで、G2-04はRAW-only development feasibilityを満たせずStage 2未実行で閉じた。次の未着手P0候補はdependencyを確認したうえで`G2-05` Deep RAW State-Space Enumerationまたは`G2-06` Rich Critical-Position Representationから選択する。"
agenda_new_status = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`として、それぞれprospective stop/global-failure/feasibility ruleに従い完了した。`G2-05`も`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`としてbounded exact enumerationを完了した。G2-03のvalidated transform setは空のままで、G2-04のStage 2未実行結果は変更されていない。次の未着手P0候補は`G2-06` Rich Critical-Position Representationである。"
replace_once("doc/FUTURE_RESEARCH_AGENDA.md", agenda_old_status, agenda_new_status)

# Program decision: append the G2-05 closure without rewriting prior history.
program_addition = """

## 2026-08-28 — G2-05 Deep RAW State-Space Enumeration Study 1 closure

Agenda label `G2-05` was instantiated as `DRSSE-STUDY1` — **Deep RAW State-Space Enumeration Study 1** — under a fresh prospective RAW-only bounded-exact contract.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-PASS
Stage 2 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

The standard initial RAW root, target depth 9, resource ceilings, complete-layer requirement, decision taxonomy, and independent-verification requirement were frozen before formal outcome generation. Stage 2 completed all reachable layers 0..9 and all parent expansion layers 0..8; a separate independent implementation re-enumerated the full bounded domain.

```text
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

No G2-04 root/partial closure, G1 SSGTC partial depth-9 row, G2-05 Stage 1 root/row, symmetry transform, or canonicalization result entered formal Stage 2 evidence. `G2-04 / REEOE-STUDY1 = INCONCLUSIVE` and G1 `SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN` remain unchanged.

G2-05 does not estimate total Bao state-space size or total game-tree complexity. Those questions remain separate prospective work, including `G2-12 — State-Space / Game-Tree Growth Estimation Study 1`. The next uncompleted P0 agenda item is `G2-06 — Rich Critical-Position Representation Study 1`.
"""
append_once(
    "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md",
    "G2-05 Deep RAW State-Space Enumeration Study 1 closure",
    program_addition,
)

print("G2-05 central documentation materialization: PASS")
