#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, text):
    (ROOT / path).write_text(text, encoding="utf-8")


def insert_after_unique_line(text, needle, new_line, label):
    if new_line in text:
        return text
    lines = text.splitlines(keepends=True)
    hits = [i for i, line in enumerate(lines) if needle in line]
    if len(hits) != 1:
        raise SystemExit(f"{label}: expected exactly one anchor line, found {len(hits)}")
    lines.insert(hits[0] + 1, new_line + "\n")
    return "".join(lines)


# Root README: add concise G2-10 result immediately after G2-09.
p = "README.md"
t = read(p)
t = insert_after_unique_line(
    t,
    "doc/tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md",
    "- [`doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md`](doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-10` / `UMSSR-STUDY1`。Fresh Stage 1は4,096 games / 512 roots / 40 active featuresをproduction / independent exact一致で完了し、scientific readinessとresource gateもPASSしたが、prospectively fixed `K=2..6`の全候補がminimum supportまたはfive-fold assignment stabilityを満たさず、`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`でclosed。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、reserved Stage 2 seedsは未消費で、G2-11へ渡せるvalidated / frozen representationは生成されなかった。",
    "root README G2-10",
)
write(p, t)


# Central research index: append Study 26 immediately before the future-research section.
p = "doc/RESEARCH_INDEX.md"
t = read(p)
heading = "### 26. Unified Multiaxial Strategic State Representation — Study 1"
if heading not in t:
    anchor = "\n## 将来研究\n"
    idx = t.rfind(anchor)
    if idx < 0:
        raise SystemExit("RESEARCH_INDEX: future research anchor missing")
    block = r'''

---

### 26. Unified Multiaxial Strategic State Representation — Study 1

**研究題目:** Baoにおける多軸戦略状態表現の統合的構築とprospective検証 — search reliability, structural state, reply pressure, decision-failure evidence, tactical structure等のevidence-eligible axesを用いた再現可能なstrategic-state / regime representationの構築  
**Program:** `G2-10` / **Study ID:** `UMSSR-STUDY1` / **Research Generation 2**  
**状態:** **Study closed / formal decision `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

G2-01〜G2-09のformal closureを救済せず、upstream evidence eligibilityを先に固定したうえで、fresh population上に40-feature multiaxial strategic-state vectorを構築し、deterministic K-means `K=2..6`からStage 2へ昇格可能なregime representationを選択できるかをprospectively検証した。

Stage 1 accepted run `33297178656`は4,096 gamesを生成し、4,068 unique trajectories、3,711 distinct opening prefixesを得た。8 phase/source-policy strataから各64 roots、計512 rootsを選択し、40/40 featuresがactiveだった。Production / independent implementationはsource records、selection、analysis rows、scaler、candidate K metrics、representation decision、readiness objectをすべてexact一致させ、scientific readiness gateとresource gateも全項目PASSした。

一方、scientific seed消費前に固定したpromotion criteriaはminimum cluster support `>= 0.10`、mean silhouette `>= 0.05`、five-fold assignment stability `>= 0.80`を全て要求した。K=2はstability未達、K=3はsupport/stability未達、K=4とK=5はsupport未達、K=6はsupport/stability未達で、eligible candidateは0だった。このため`selectedRepresentation = null`とし、`FROZEN_REPRESENTATION.json`を生成しなかった。

この結果はtechnical-invalidでもnon-estimableでもなく、凍結したStudy 1 contract内でStage 2へpromoteできるrepresentationが得られなかった正式なnegative development resultである。Threshold relaxation、K range変更、PCA等の事後追加、favorable subgroup、Stage 1 rerun / seed extensionによる救済は行わない。

Stage 2はfrozen representationを検証する契約だったため、authorization prerequisiteを満たさず`NOT-AUTHORIZED-NOT-EXECUTED`で閉じた。Stage 2 seeds `29410001..29418192`は未消費である。`UMSSR-STUDY1`からG2-11へ渡せるvalidated / frozen representationはない。

**最初に読む:**

- [`unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md`](unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md)

**詳細・正本:**

- [`unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json`](unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json)
- [`unified-multiaxial-strategic-state-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`](unified-multiaxial-strategic-state-representation/results/STAGE_1_DEVELOPMENT_RESULT.json)
- [`unified-multiaxial-strategic-state-representation/CURRENT_STATUS.md`](unified-multiaxial-strategic-state-representation/CURRENT_STATUS.md)
- [`unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md`](unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md)
- [`unified-multiaxial-strategic-state-representation/REPRODUCIBILITY_INDEX.md`](unified-multiaxial-strategic-state-representation/REPRODUCIBILITY_INDEX.md)

**Boundary:** 本StudyはBaoにstrategic regimeが存在しないことを示さない。凍結した40-feature / deterministic K-means `K=2..6` / promotion ruleの組合せではeligible representationが得られなかったことだけを示す。別representationを検証する場合はnew prospective Studyまたはexplicit versioned protocolとfresh evidenceを必要とし、G2-11へ本Studyのunvalidated representationを持ち込まない。
'''
    t = t[:idx] + block + "\n" + t[idx:]
write(p, t)


# Future agenda: convert G2-10 from planned to closed and tighten G2-11 dependency boundary.
p = "doc/FUTURE_RESEARCH_AGENDA.md"
t = read(p)
start = t.find("#### G2-10 — Unified Multiaxial Strategic State Representation Study 1")
end = t.find("#### G2-11 — Long-Horizon Strategic Transition Structure Study 1")
if start < 0 or end < 0 or end <= start:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: G2-10/G2-11 section anchors missing")
replacement = r'''#### G2-10 — Unified Multiaxial Strategic State Representation Study 1

**状態:** **完了 / `UMSSR-STUDY1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> phase、search reliability、structural state、legal branching、reply-pressure raw structure、tactical structure、decision raw observable、local graph等を単一scalarへ早期圧縮せず、複数軸を保持するBao strategic-state / regime representationとしてfresh evidence上で再現可能に構成できるか。

開始前にG2-01〜G2-09を監査し、`FORMALLY-ELIGIBLE` / `BOUNDED-EXACT-ELIGIBLE` / `TECHNICAL-REFERENCE-ONLY` / `DEVELOPMENT-CANDIDATE-ONLY` / `INELIGIBLE`のupstream evidence eligibility contractをfreezeした。G2-06/07のtechnical-invalid representation、G2-08のnon-estimable taxonomy、G2-09の未生成generalization boundaryをvalidated inputへ昇格させず、validated transform set `[]`のためRAW identityを維持した。

Stage 1はfresh 4,096 gamesを生成し、4,068 unique trajectories / 3,711 distinct opening prefixesから、8 phase/source-policy strata各64、計512 unique RAW rootsをoutcome-blind ruleで選択した。40/40 featuresがactiveとなり、production / independent implementationはsource、selection、feature analysis、scaler、candidate K metrics、representation decision、readiness objectを全てexact一致させた。Scientific readinessとresource gateも全項目PASSした。

Representation selectionはdimensionality reductionなし、deterministic K-means `K=2..6`とし、minimum cluster support `>= 0.10`、mean silhouette `>= 0.05`、five-fold assignment stability `>= 0.80`をscientific seed消費前に固定した。K=2はstability、K=3はsupport/stability、K=4/K=5はsupport、K=6はsupport/stabilityが未達となり、eligible candidateは0だった。

したがってfrozen decision mappingをそのまま適用し:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

で閉じた。これはtechnical failureやnon-estimable resultではなく、凍結したStudy 1 contract内でStage 2へ昇格可能なrepresentationを得られなかったformal negative development resultである。

このclosureをminimum support / stability threshold緩和、K range変更、PCA / latent representation /別clustering法の事後追加、favorable subgroup、Stage 1 seed rerun / extensionで救済しない。また`UMSSR-STUDY1`からG2-11へ渡せるvalidated / frozen representationは生成されなかった。

**Priority:** completed

'''
t = t[:start] + replacement + t[end:]

old_g211 = "G2-10が必要なrepresentation gateを満たさない場合、結果後に別representationへ差し替えて同じStudyを救済しない。新しいprotocolを必要とする。"
new_g211 = "G2-10 `UMSSR-STUDY1`は実際にrepresentation gateを満たさず、`selectedRepresentation = null`で閉じた。したがって`UMSSR-STUDY1`由来representationをG2-11のinputとして使用しない。G2-11を開始する前に、long-horizon transitionへ入力可能なrepresentationを新しいprospective Studyまたは明示的versioned protocolで構築・freezeし、そのeligibilityをoutcome前に固定する必要がある。"
if old_g211 not in t and new_g211 not in t:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: G2-11 boundary anchor missing")
t = t.replace(old_g211, new_g211, 1)

old_dep = "G2-02 + G2-06..09 closures\n        ↓\nG2-10 Unified Multiaxial Strategic State\n        ↓\nG2-11 Long-Horizon Strategic Transitions"
new_dep = "G2-02 + G2-06..09 closures\n        ↓\nG2-10 Unified Multiaxial Strategic State\n        ↓\nNO ELIGIBLE FROZEN REPRESENTATION\n        ↓\nnew prospective representation protocol required before G2-11\n        ↓\nG2-11 Long-Horizon Strategic Transitions"
if old_dep not in t and new_dep not in t:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: dependency diagram anchor missing")
t = t.replace(old_dep, new_dep, 1)

old_priority = "P1: G2-07 (completed), G2-08 (completed), G2-09 (completed), G2-10"
new_priority = "P1: G2-07 (completed), G2-08 (completed), G2-09 (completed), G2-10 (completed)"
if old_priority not in t and new_priority not in t:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: priority anchor missing")
t = t.replace(old_priority, new_priority, 1)

old_tail = "G2-01..G2-09はclosure済みである。`G2-09`は`TMGC-STUDY1 = TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`で閉じ、scientific generalization/counterexample evidenceは未生成である。次のdownstream machine-only agenda itemは`G2-10 — Unified Multiaxial Strategic State Representation Study 1`だが、開始時にはG2-06〜G2-09のtechnical-invalid/non-estimable closuresをvalidated axisへ昇格させないeligibility ruleを新たにfreezeする。"
new_tail = "G2-01..G2-10はclosure済みである。`G2-10`はscientific readiness、resource gate、production / independent exact verificationをPASSした一方、prospectively fixed `K=2..6`の全候補がpromotion criterionを満たさず`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`で閉じ、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、Stage 2 seedsは未消費である。したがってG2-11へ`UMSSR-STUDY1`由来representationを持ち込まず、G2-11開始前にnew prospective representation Studyまたはexplicit versioned protocolを必要とする。"
if old_tail not in t and new_tail not in t:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: sequence-tail anchor missing")
t = t.replace(old_tail, new_tail, 1)

write(p, t)
