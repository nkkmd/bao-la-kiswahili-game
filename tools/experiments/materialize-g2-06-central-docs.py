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


# Root README: insert G2-06 immediately after G2-05.
readme_g205 = "- [`doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`](doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-05` / `DRSSE-STUDY1`。Standard initial RAW rootをprospectively固定し、depth 0..9をcomplete enumeration。formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`、累積102,857 RAW states / 136,645 tree-node occurrences。full Bao state-space / game-tree estimateではなく、symmetry reduction / canonicalizationは未使用"
readme_g206 = "- [`doc/rich-critical-position-representation/STUDY_1_OVERVIEW.md`](doc/rich-critical-position-representation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-06` / `RCPR-STUDY1`。Stage 0 technical representation validationはPASSし、fresh Stage 1 productionでは599 primary-estimable roots / 134 high-divergence rootsを得たが、mandatory independent feature recomputationが4/600 rowsでexact vector hash不一致となった。frozen fail-closed ruleによりformal Stage 1 dispositionは`STAGE1-TECHNICAL-INVALID`、seed blockは消費済み、same-block rerun禁止、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`"
replace_once("README.md", readme_g205, readme_g205 + "\n" + readme_g206)

# Central research index: add G2-06 Study 22 before the Future Research section.
index_anchor = """**Boundary:** exact claimはprospectively frozen standard-root depth-9 RAW domainだけに限定される。G2-04を救済せず、G1 SSGTCのformal decisionも変更しない。full Bao state-space / game-tree complexity、unbounded growth、asymptotic extrapolationはG2-05のendpointではなく、G2-12等のnew prospective Studyを必要とする。

---

## 将来研究"""
index_g206 = """**Boundary:** exact claimはprospectively frozen standard-root depth-9 RAW domainだけに限定される。G2-04を救済せず、G1 SSGTCのformal decisionも変更しない。full Bao state-space / game-tree complexity、unbounded growth、asymptotic extrapolationはG2-05のendpointではなく、G2-12等のnew prospective Studyを必要とする。

---

### 22. Rich Critical-Position Representation — Study 1

**研究題目:** Baoにおける重要局面の豊かな構造表現の構築とprospective検証 — rich pre-root representationによるdecision-critical structureの再現可能な識別  
**Program:** `G2-06` / **Study ID:** `RCPR-STUDY1` / **Research Generation 2**  
**状態:** **Study closed / Stage 1 `STAGE1-TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

Stage 0では8 representation families / 310 scalar featuresのproduction・independent exact agreementとmandatory controlsをPASSした。Stage 1はfresh 3,072-game blockと600-root targetをprospectively freezeし、consume-once authorizationの下でproductionを一度だけ実行した。

Productionでは599 rootsがprimary-estimable、134 rootsが`D_range >= 0.30` high-divergenceで、`RICH_ALL`がselected family setとなった。Production readiness checksはPASSしたが、mandatory independent verifierで4/600 representation rowsのexact feature-vector hashが不一致となったため、production-only readinessをformal target formationへ昇格させなかった。

Post-failure read-only postmortemでは4件すべての差分が`MOVE_SET_ENTROPY.indexEntropy`の浮動小数点加算順に由来する最下位bit級差と特定された。ただしこれは結果後のdiagnosticであり、frozen exact-equality gateをtoleranceへ変更してStudyを救済していない。

**最初に読む:**

- [`rich-critical-position-representation/STUDY_1_OVERVIEW.md`](rich-critical-position-representation/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`](rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json)
- [`rich-critical-position-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json`](rich-critical-position-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json)
- [`rich-critical-position-representation/CURRENT_STATUS.md`](rich-critical-position-representation/CURRENT_STATUS.md)
- [`rich-critical-position-representation/DECISION_REGISTER.md`](rich-critical-position-representation/DECISION_REGISTER.md)
- [`rich-critical-position-representation/REPRODUCIBILITY_INDEX.md`](rich-critical-position-representation/REPRODUCIBILITY_INDEX.md)

**Boundary:** Stage 1 seed block `28610001..28613072`は消費済みでsame-block repair/rerun、replacement、extensionは未承認。Stage 1 rowsはStage 2 formal evidenceへ再利用しない。G2-06を結果後に修正して再判定せず、次のindependent agenda itemはG2-07として別prospective contractで扱う。

---

## 将来研究"""
replace_once("doc/RESEARCH_INDEX.md", index_anchor, index_g206)

# Future agenda: update date and replace the prospective G2-06 block with its closure.
replace_once("doc/FUTURE_RESEARCH_AGENDA.md", "更新日: 2026-08-28", "更新日: 2026-08-29")

agenda_old = """#### G2-06 — Rich Critical-Position Representation Study 1

**状態:** planned / new prospective independent study

中心課題:

> Critical Positions / Outcome Branching Study 1で139/600 high-divergence rootsが観測された一方simple one-to-two-token grammarでpromotion 0だったことを踏まえ、outcome前に固定したより豊かなrepresentationならfresh populationでdecision-critical structureを再現可能に識別できるか。

候補representation familyにはlocal pit topology、capture graph、legal-move geometry、reply graph、reserve / house relation、move-set entropy、search-gap vector、local temporal context等を含め得るが、formal familyとfeature-selection ruleはoutcome前にfreezeする。

第一世代1183 auditsのnear-miss promotion、threshold relaxation、manual Stage 2 target selectionは行わない。

**Priority:** P0"""
agenda_new = """#### G2-06 — Rich Critical-Position Representation Study 1

**状態:** **完了 / `RCPR-STUDY1` / Stage 1 `STAGE1-TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> Critical Positions / Outcome Branching Study 1で139/600 high-divergence rootsが観測された一方simple one-to-two-token grammarでpromotion 0だったことを踏まえ、outcome前に固定したより豊かなrepresentationならfresh populationでdecision-critical structureを再現可能に識別できるか。

Stage 0でlocal pit topology、capture graph、legal-move geometry、reply graph、reserve / house relation、move-set entropy、search-gap vector、local temporal contextの8 families / 310 scalar featuresをtechnical validationした。Stage 1はfresh 3,072-game block、600 roots、`D_range >= 0.30`、deterministic model-selection / readiness ruleをoutcome前にfreezeしてconsume-once実行した。

Productionでは599 primary-estimable roots、134 high-divergence rootsを得てproduction readiness checksをPASSした。一方、mandatory independent recomputationはcorpus / root selection / continuation / model / readinessを再現したものの、4/600 rowsでrepresentation exact hashが一致しなかった。frozen fail-closed ruleに従いStage 1は`STAGE1-TECHNICAL-INVALID`で閉じ、production-only readinessをformal targetへ昇格させなかった。

Read-only postmortemでは4件の差は`MOVE_SET_ENTROPY.indexEntropy`における浮動小数点加算順の差と局所化されたが、outcome後にexact-equality gateをtoleranceへ変更して救済しない。Stage 1 seed blockは消費済みでsame-block rerun / replacement / extensionは禁止、Stage 2は未承認・未実行である。

第一世代1183 auditsのnear-miss promotion、threshold relaxation、manual Stage 2 target selectionも行っていない。

**Priority:** P0 / completed"""
replace_once("doc/FUTURE_RESEARCH_AGENDA.md", agenda_old, agenda_new)

agenda_old_status = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`として、それぞれprospective stop/global-failure/feasibility ruleに従い完了した。`G2-05`も`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`としてbounded exact enumerationを完了した。G2-03のvalidated transform setは空のままで、G2-04のStage 2未実行結果は変更されていない。次の未着手P0候補は`G2-06` Rich Critical-Position Representationである。"
agenda_new_status = "`G2-01`は`PEOCR-STUDY1 = INCONCLUSIVE`、`G2-02`は`SRDR-STUDY1 = INCONCLUSIVE`、`G2-03`は`STSCV-STUDY1 = INCONCLUSIVE`、`G2-04`は`REEOE-STUDY1 = INCONCLUSIVE`、`G2-05`は`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`として、それぞれprospective ruleに従い完了した。`G2-06`も`RCPR-STUDY1`として実行され、mandatory independent representation equality failureによりStage 1 `STAGE1-TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`でclosedとなった。G2-03のvalidated transform setは空のままで、G2-04/G2-06の未実行Stage 2を後続Studyで救済しない。P0 sequence G2-01..G2-06はclosure済みであり、次の未着手machine-only agenda itemは`G2-07 — Practical Comeback / Reply-Pressure Representation Study 1`である。"
replace_once("doc/FUTURE_RESEARCH_AGENDA.md", agenda_old_status, agenda_new_status)

# Program decision: append G2-06 closure without rewriting prior chronology.
program_addition = """

## 2026-08-29 — G2-06 Rich Critical-Position Representation Study 1 closure

Agenda label `G2-06` was instantiated as `RCPR-STUDY1` — **Rich Critical-Position Representation Study 1** — under a fresh prospective rich pre-root representation contract.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
same-block rerun = NOT AUTHORIZED
```

Stage 0 independently validated eight declared representation families and a 310-scalar feature schema. Stage 1 then consumed the prospectively frozen fresh seed block `28610001..28613072` once. Production completed and its readiness checks passed, but the mandatory independent verifier failed the prospectively required exact representation equality gate on 4 of 600 rows.

The verifier independently reproduced corpus generation, root selection, continuation measurement, divergence labels, model development, and readiness. A post-failure read-only diagnostic localized the four mismatches to floating-point summation order in `MOVE_SET_ENTROPY.indexEntropy`; the differences were last-bit scale. This diagnostic does not authorize changing the frozen exact-equality criterion, repairing and rerunning the consumed block, or promoting production-only readiness.

Accordingly `RCPR-STUDY1` is closed as `STAGE1-TECHNICAL-INVALID`. Stage 2 was not authorized or executed. Research Generation 1 Critical Positions results, G2-01..G2-05 decisions, thresholds, endpoints, populations, and representation boundaries remain unchanged.

The program does not reopen G2-06 as a result-driven "Study 2" rescue. The next uncompleted machine-only agenda item is `G2-07 — Practical Comeback / Reply-Pressure Representation Study 1`, which requires a separate prospective contract and fresh evidence.
"""
append_once(
    "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md",
    "G2-06 Rich Critical-Position Representation Study 1 closure",
    program_addition,
)

print("G2-06 central documentation materialization: PASS")
