#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
README = ROOT / "README.md"
INDEX = ROOT / "doc/RESEARCH_INDEX.md"
AGENDA = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
PROGRAM = ROOT / "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"
SELECTION = ROOT / "doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md"
CLOSURE = ROOT / "doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md"
PSRRE = ROOT / "doc/prospective-strategic-regime-representation-eligibility"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    require(count == 1, f"{label}: expected exactly one match, got {count}")
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    s = text.find(start)
    require(s >= 0, f"{label}: start marker missing")
    e = text.find(end, s + len(start))
    require(e >= 0, f"{label}: end marker missing")
    return text[:s] + replacement.rstrip() + "\n\n" + text[e:]


# Canonical closure must already exist before central documentation is synchronized.
closure_text = read(CLOSURE)
for token in [
    "PSRRE-STUDY1",
    "NON-ESTIMABLE",
    "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE",
    "G2-11 candidate input authorized = false",
]:
    require(token in closure_text, f"closure record missing token: {token}")

final_result = read(PSRRE / "results/STUDY_1_FINAL_RESULT.json")
for token in [
    '"formalStudyDecision": "NON-ESTIMABLE"',
    '"disposition": "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE"',
    '"g2_11CandidateInputAuthorized": false',
]:
    require(token in final_result, f"final result missing token: {token}")

# ---------------------------------------------------------------------------
# Root README: add the completed prerequisite alongside G2-10.
# ---------------------------------------------------------------------------
root = read(README)
psrre_root_line = "- [`doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md`](doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md): Pre-G2-11 prerequisite / `PSRRE-STUDY1`。Stage 0 technical PASS後、fresh Stage 1 4,096 games / 512 rootsをproduction / independent full-exactで完遂したが、prospectively fixed nonzero-MAD feature readinessが`15 < 20`で未達となりformal decision `NON-ESTIMABLE`。representationはfreezeされず、Stage 2とG2-11は`NOT-AUTHORIZED-NOT-EXECUTED`。"
if psrre_root_line not in root:
    anchor = "- [`doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md`](doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-10` / `UMSSR-STUDY1`。Fresh Stage 1は4,096 games / 512 roots / 40 active featuresをproduction / independent exact一致で完了し、scientific readinessとresource gateもPASSしたが、prospectively fixed `K=2..6`の全候補がminimum supportまたはfive-fold assignment stabilityを満たさず、Stage 1は`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`でclosed。Study formal decisionは`NOT-AUTHORIZED-NOT-EXECUTED`。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、reserved Stage 2 seedsは未消費で、G2-11へ渡せるvalidated / frozen representationは生成されなかった。"
    root = replace_once(root, anchor, anchor + "\n" + psrre_root_line, "root README G2-10 anchor")
write(README, root)

# ---------------------------------------------------------------------------
# RESEARCH_INDEX: add Study 27 and replace stale selected-next state.
# ---------------------------------------------------------------------------
index = read(INDEX)
if "### 27. Prospective Strategic-Regime Representation Eligibility — Study 1" not in index:
    insert_marker = "\n\n## 将来研究\n"
    section = r'''

---

### 27. Prospective Strategic-Regime Representation Eligibility — Study 1

**研究題目:** Baoにおける戦略状態・regime表現の新規構築とprospective eligibility検証 — G2-11長期戦略遷移研究に先立つfresh evidenceベースの独立representation prerequisite  
**Program position:** Pre-G2-11 dependency-resolution prerequisite / **Study ID:** `PSRRE-STUDY1` / **Research Generation 2**  
**状態:** **Study closed / formal decision `NON-ESTIMABLE` / Stage 1 `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

G2-10を救済せず、fresh 28-feature contractと`RF-A-ROBUST-PCA-WARD` / `RF-B-ROBUST-PCA-PAM` / `RF-C-DIRECT-ROBUST-PAM`をprospectively固定し、G2-11へ渡せるheld-out-eligible strategic-state / regime representationを構築できるかを検証した。

Stage 0では3 familyすべてtechnical exact PASS。Stage 1 accepted run `33308337738`は4,096 games / 4,066 unique trajectories / 3,734 distinct opening prefixesから、8 phase/source-policy strata各64、計512 unique RAW rootsを選択した。Production / independent implementationはsource generation、selection、28-feature analysis、scaler、readiness、final decisionをfull-exactで一致させ、resource gateもPASSした。

一方、prospectively frozen readiness gate `minimumNonzeroMadFeatures >= 20`に対しobservedは15だった。active feature familiesは要求5/5を満たしたが、global feature-variation readinessを満たさないため、candidate family/Kの科学的promotionへ進まず`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`で閉じた。Stage 1 seeds `29510001..29514096`はconsume-onceで消費済み、same-block rerunは禁止。Stage 2 seeds `29610001..29618192`は未消費である。

**最初に読む:**

- [`prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md`](prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`prospective-strategic-regime-representation-eligibility/STUDY_1_FINAL_REPORT.md`](prospective-strategic-regime-representation-eligibility/STUDY_1_FINAL_REPORT.md)
- [`prospective-strategic-regime-representation-eligibility/results/STUDY_1_FINAL_RESULT.json`](prospective-strategic-regime-representation-eligibility/results/STUDY_1_FINAL_RESULT.json)
- [`prospective-strategic-regime-representation-eligibility/CURRENT_STATUS.md`](prospective-strategic-regime-representation-eligibility/CURRENT_STATUS.md)
- [`prospective-strategic-regime-representation-eligibility/DECISION_REGISTER.md`](prospective-strategic-regime-representation-eligibility/DECISION_REGISTER.md)
- [`prospective-strategic-regime-representation-eligibility/REPRODUCIBILITY_INDEX.md`](prospective-strategic-regime-representation-eligibility/REPRODUCIBILITY_INDEX.md)

**Boundary:** 本StudyはBaoにstrategic regimeが存在しないことを示さない。結果後に20-feature floorを下げる、zero-MAD featureを除外して同seedを再解析する、family/Kを追加する、Stage 2をpost-hoc authorizeする、といったsame-Study rescueを行わない。frozen representationは生成されず、G2-11 candidate inputとG2-11 scientific executionはいずれも未承認である。
'''
    index = replace_once(index, insert_marker, section + insert_marker, "RESEARCH_INDEX insertion")

old_future = """## 将来研究\n\n**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite\n\n`G2-10 / UMSSR-STUDY1`はeligible frozen representationを生成せず閉じたため、`G2-11`を直接開始しない。次はG2-10を救済・再定義しない**新しいprospective independent strategic-representation prerequisite Study**を実施し、G2-11へ入力可能なrepresentation eligibilityをfresh evidenceで検証する。正式Study ID・最終題目・Stage構成は研究開始時にcurrent remote `main`を再監査して固定する。詳細は[`research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md`](research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md)を参照。\n"""
new_future = """## 将来研究\n\n**現在のPre-G2-11 dependency state:** `PSRRE-STUDY1` completed / formal decision `NON-ESTIMABLE` / G2-11 remains `NOT-AUTHORIZED`.\n\nG2-10後に選択したstrategic representation prerequisiteは`PSRRE-STUDY1`としてprospectively実施し、Stage 1をtechnical/resource/full-exact verification PASSのうえで完遂した。しかし、frozen readiness gate `nonzero-MAD features >= 20`に対し15だったためStudyは`NON-ESTIMABLE`で閉じ、frozen representationを生成しなかった。したがってG2-11へ入力可能なrepresentation dependencyは依然未解決であり、`UMSSR-STUDY1`または`PSRRE-STUDY1`のunvalidated representationを事後昇格させてG2-11を開始しない。Program-level closureは[`research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`](research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md)を参照。\n"""
if old_future in index:
    index = replace_once(index, old_future, new_future, "RESEARCH_INDEX future-state replacement")
else:
    require(new_future in index, "RESEARCH_INDEX current future state neither old nor new")
write(INDEX, index)

# ---------------------------------------------------------------------------
# FUTURE_RESEARCH_AGENDA: close prerequisite and mark G2-11 dependency blocked.
# ---------------------------------------------------------------------------
agenda = read(AGENDA)
pre_section = r'''#### Pre-G2-11 prerequisite — Prospective Strategic-Regime Representation Eligibility Study 1

**状態:** **完了 / `PSRRE-STUDY1` / formal decision `NON-ESTIMABLE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

G2-10 `UMSSR-STUDY1`がeligible frozen representationを生成しなかったため、G2-11を直接開始せず、新しいagenda labelを追加しないdependency-resolution prerequisiteとして`PSRRE-STUDY1`をprospectively実施した。

Study開始時にformal identity、Stage IDs、fresh seed blocks、28-feature dictionary、RAW identity、3 representation families、`K=2..8`、support / silhouette / five-fold assignment-stability、source-policy concentration、Stage 1 readiness、Stage 2 held-out endpoint、production / independent exact verification、resource ceiling、consume-once / no-rescue ruleをoutcome生成前にfreezeした。

Stage 0は3 familyすべてtechnical exact PASS。Stage 1はfresh 4,096 games / 512 rootsをproduction / independent full-exactで完遂し、population / resource / artifact gateもPASSした。しかし、frozen readiness `minimumNonzeroMadFeatures >= 20`に対してobserved 15だったため、candidate family/Kをscientific promotionする前に`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`で閉じた。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study formal decision = NON-ESTIMABLE
selectedRepresentation = null
Stage 1 seeds 29510001..29514096 = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29610001..29618192 = RESERVED / UNCONSUMED
G2-11 candidate input authorized = false
G2-11 scientific execution authorized = false
```

20-feature floorを結果後に15へ下げる、zero-MAD featureを削除して同seedを再解析する、family/Kを追加する、favorable subgroupを抽出する、Stage 2をpost-hoc authorizeする、といったsame-Study rescueは行わない。

この結果は「Baoに有用なstrategic regimeがない」ことを示さない。`PSRRE-STUDY1`のprospectively fixed representation-readiness contractがformal validation entryへ到達できなかったことを示す。

- 初見向け概要: [`prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md`](prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md)
- 科学的正本: [`prospective-strategic-regime-representation-eligibility/STUDY_1_FINAL_REPORT.md`](prospective-strategic-regime-representation-eligibility/STUDY_1_FINAL_REPORT.md)
- Program closure: [`research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`](research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md)

**Priority:** completed prerequisite; G2-11 dependency remains unresolved
'''
agenda = replace_between(
    agenda,
    "#### Pre-G2-11 prerequisite — new prospective strategic representation Study",
    "#### G2-11 — Long-Horizon Strategic Transition Structure Study 1",
    pre_section,
    "FUTURE_RESEARCH_AGENDA prerequisite section",
)
agenda = agenda.replace(
    "**状態:** planned / downstream temporal study",
    "**状態:** **blocked / `NOT-AUTHORIZED` — required frozen representation unavailable after G2-10 and PSRRE-STUDY1 closures**",
    1,
)
old_g211_boundary = "G2-10 `UMSSR-STUDY1`は実際にrepresentation gateを満たさず、`selectedRepresentation = null`で閉じた。したがって`UMSSR-STUDY1`由来representationをG2-11のinputとして使用しない。G2-11を開始する前に、long-horizon transitionへ入力可能なrepresentationを新しいprospective Studyまたは明示的versioned protocolで構築・freezeし、そのeligibilityをoutcome前に固定する必要がある。"
new_g211_boundary = "G2-10 `UMSSR-STUDY1`は`selectedRepresentation = null`で閉じ、その後のPre-G2-11 prerequisite `PSRRE-STUDY1`もfrozen readiness failureにより`NON-ESTIMABLE`で閉じ、representationをfreezeしなかった。したがって両Study由来のunvalidated representationをG2-11のinputとして使用しない。G2-11は現在`NOT-AUTHORIZED`であり、開始する場合はrepresentation dependencyの解決方法、input identity、endpoint、fresh population、authorizationを新しいprospective decisionでoutcome前に固定する必要がある。"
agenda = replace_once(agenda, old_g211_boundary, new_g211_boundary, "G2-11 dependency paragraph")
old_dependency = """G2-02 + G2-06..09 closures
        ↓
G2-10 Unified Multiaxial Strategic State
        ↓
NO ELIGIBLE FROZEN REPRESENTATION
        ↓
new prospective representation protocol required before G2-11
        ↓
G2-11 Long-Horizon Strategic Transitions
"""
new_dependency = """G2-02 + G2-06..09 closures
        ↓
G2-10 Unified Multiaxial Strategic State
        ↓
NO ELIGIBLE FROZEN REPRESENTATION
        ↓
PSRRE-STUDY1 prospective prerequisite
        ↓
NON-ESTIMABLE / NO FROZEN REPRESENTATION
        ↓
G2-11 remains NOT-AUTHORIZED; dependency resolution required
"""
agenda = replace_once(agenda, old_dependency, new_dependency, "dependency diagram")
old_tail = "したがってG2-11へ`UMSSR-STUDY1`由来representationを持ち込まず、G2-11開始前にnew prospective representation Studyまたはexplicit versioned protocolを必要とする。"
new_tail = "その後のPre-G2-11 prerequisite `PSRRE-STUDY1`もStage 1 `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE` / Study `NON-ESTIMABLE`で閉じ、frozen representationを生成しなかった。したがってG2-11へ`UMSSR-STUDY1`または`PSRRE-STUDY1`由来のunvalidated representationを持ち込まず、G2-11は`NOT-AUTHORIZED`のまま保持する。"
agenda = replace_once(agenda, old_tail, new_tail, "agenda priority tail")
write(AGENDA, agenda)

# ---------------------------------------------------------------------------
# Program decision: preserve historical selection, append realized closure.
# ---------------------------------------------------------------------------
program = read(PROGRAM)
closure_heading = "## 2026-08-30 — PSRRE-STUDY1 prerequisite closure"
if closure_heading not in program:
    program += r'''

## 2026-08-30 — PSRRE-STUDY1 prerequisite closure

The selected Pre-G2-11 dependency-resolution direction was prospectively instantiated as `PSRRE-STUDY1` — **Prospective Strategic-Regime Representation Eligibility Study 1**. This did not add a new `G2-xx` agenda label and did not modify the closed `G2-10 / UMSSR-STUDY1` contract or decision.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study formal decision = NON-ESTIMABLE
selectedRepresentation = null
Stage 1 seeds 29510001..29514096 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29610001..29618192 = RESERVED / UNCONSUMED
G2-11 candidate input authorized = false
G2-11 scientific execution authorized = false
```

Stage 1 completed the fresh 4,096-game / 512-root production and independent pipelines with full-exact agreement and all resource gates passing. The prospectively frozen development-readiness contract required at least 20 nonzero-MAD features; 15 were observed. Therefore the Study closed as non-estimable before a representation could be frozen or promoted to held-out validation.

No same-Study threshold relaxation, zero-MAD feature deletion/re-analysis, family/K expansion, favorable-subgroup rescue, seed rerun/replacement/extension, or post-hoc Stage 2 authorization is permitted.

Program consequence: `G2-11` remains not authorized because the representation dependency is still unresolved. Neither `UMSSR-STUDY1` nor `PSRRE-STUDY1` supplies an eligible frozen representation candidate.

Canonical closure record: `doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`.
'''
write(PROGRAM, program)

# ---------------------------------------------------------------------------
# Historical selection decision: mark as realized and append outcome.
# ---------------------------------------------------------------------------
selection = read(SELECTION)
selection = selection.replace(
    "Status: **SELECTED NEXT RESEARCH DIRECTION / NOT YET PREREGISTERED**",
    "Status: **HISTORICAL SELECTION DECISION / REALIZED AS `PSRRE-STUDY1` / CLOSED `NON-ESTIMABLE`**",
    1,
)
if "## Outcome of this selection" not in selection:
    outcome = r'''## Outcome of this selection

This historical selection was subsequently instantiated prospectively as:

```text
Study ID = PSRRE-STUDY1
Formal title = Prospective Strategic-Regime Representation Eligibility Study 1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 candidate input authorized = false
```

The Study generated no frozen representation. Stage 1 completed technical/resource/full-exact verification but failed the prospectively frozen minimum-nonzero-MAD-feature readiness gate (`15 < 20`). This selection record remains as historical sequencing provenance; current closure state is recorded in [`2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`](2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md).

'''
    selection = replace_once(selection, "## Decision\n", outcome + "## Decision\n", "selection outcome insertion")
selection = selection.replace("## Authorization state\n", "## Historical authorization state at selection\n", 1)
if "## Current closure state" not in selection:
    selection += r'''

## Current closure state

```text
formal Study ID fixed = PSRRE-STUDY1
formal Stage IDs fixed = true
Stage 1 scientific seeds = CONSUMED
Stage 2 scientific seeds = RESERVED / UNCONSUMED
Stage 2 authorized = false
G2-11 candidate input authorized = false
G2-11 authorized = false
Study closed = NON-ESTIMABLE
```
'''
write(SELECTION, selection)

# ---------------------------------------------------------------------------
# Final consistency audit.
# ---------------------------------------------------------------------------
root = read(README)
index = read(INDEX)
agenda = read(AGENDA)
program = read(PROGRAM)
selection = read(SELECTION)

required = {
    "README": ["PSRRE-STUDY1", "formal decision `NON-ESTIMABLE`"],
    "RESEARCH_INDEX": ["### 27. Prospective Strategic-Regime Representation Eligibility — Study 1", "G2-11 remains `NOT-AUTHORIZED`"],
    "FUTURE_RESEARCH_AGENDA": ["`PSRRE-STUDY1` / formal decision `NON-ESTIMABLE`", "G2-11 remains NOT-AUTHORIZED"],
    "PROGRAM": [closure_heading, "Neither `UMSSR-STUDY1` nor `PSRRE-STUDY1` supplies an eligible frozen representation candidate"],
    "SELECTION": ["REALIZED AS `PSRRE-STUDY1`", "## Current closure state"],
}
texts = {"README": root, "RESEARCH_INDEX": index, "FUTURE_RESEARCH_AGENDA": agenda, "PROGRAM": program, "SELECTION": selection}
for name, tokens in required.items():
    for token in tokens:
        require(token in texts[name], f"{name}: required token missing: {token}")

stale = {
    "RESEARCH_INDEX": ["**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite"],
    "FUTURE_RESEARCH_AGENDA": ["formal Study ID・最終題目・Stage IDは未固定", "scientific outcome generation未承認"],
    "SELECTION": ["Status: **SELECTED NEXT RESEARCH DIRECTION / NOT YET PREREGISTERED**"],
}
for name, tokens in stale.items():
    for token in tokens:
        require(token not in texts[name], f"{name}: stale token remains: {token}")

print("PSRRE central documentation synchronized and audited")
