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


# Root README: add concise G2-09 result immediately after G2-08.
p = "README.md"
t = read(p)
t = insert_after_unique_line(
    t,
    "doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md",
    "- [`doc/tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md`](doc/tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-09` / `TMGC-STUDY1`。Stage 0は`STAGE0-TECHNICAL-PASS`。Stage 1 scientific authorization前のtechnical-only tooling smokeでindependent boundary aggregatorが`ReferenceError`を発生させ、frozen no-rescue ruleに従いStage 1は`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`、Studyは`TECHNICAL-INVALID`でclosed。Stage 1/2 scientific seedsは未消費で、C03 generalization/counterexample scientific resultは未生成。",
    "root README G2-09",
)
write(p, t)


# Central research index: append Study 25 before the future-research section.
p = "doc/RESEARCH_INDEX.md"
t = read(p)
heading = "### 25. Tactical Motif Generalization / Counterexample — Study 1"
if heading not in t:
    anchor = "\n---\n\n## 将来研究\n"
    idx = t.rfind(anchor)
    if idx < 0:
        raise SystemExit("RESEARCH_INDEX: future research anchor missing")
    block = r'''

---

### 25. Tactical Motif Generalization / Counterexample — Study 1

**研究題目:** Baoにおけるmachine-confirmed tactical motifの一般化可能範囲と反例領域のprospective検証 — phase, morphology, search condition, state familyを横断したTM-S2-C03のgeneralization boundary / counterexample boundaryの再現可能な特定
**Program:** `G2-09` / **Study ID:** `TMGC-STUDY1` / **Research Generation 2**
**状態:** **Study closed / formal decision `TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

Research Generation 1で唯一machine-confirmedされた`TM-S2-C03`をimmutable upstreamとして、fresh evidence上のgeneralization domain / counterexample domainをprospectively検証する独立Studyとして開始した。Stage 0ではC03 exact semantics、RAW identity、historical source binding、independent technical reconstruction、source diversity/resource feasibilityを検証し、`STAGE0-TECHNICAL-PASS`となった。Direct Namua transportはfrozen C03 exactと同一constructにならないため`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`とした。

Stage 1/2 population、seed、marginal axes、search instruments、firewall、multiplicity、decision ruleをscientific seed消費前に固定し、Stage 1 authorization前のtechnical-only tooling smokeをrun `33287035754`で実施した。syntax checksはPASSしたが、independent boundary aggregatorが`ReferenceError: topSetRate is not defined`で停止し、mandatory canonical smoke resultをmaterializeできなかった。

Prospectively frozen smoke failure mappingはsame-study repairを認めていなかったため、変数名修正によるrerunを行わず、Stage 1を`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`、Studyを`TECHNICAL-INVALID`で閉じた。Stage 1 seeds `29110001..29114096`とStage 2 seeds `29210001..29218192`は未消費である。したがってC03 generalization / counterexampleについてscientific positive/negative resultは存在しない。

**最初に読む:**

- [`tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md`](tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md)

**詳細・正本:**

- [`tactical-motif-generalization-counterexample/STUDY_1_FINAL_REPORT.md`](tactical-motif-generalization-counterexample/STUDY_1_FINAL_REPORT.md)
- [`tactical-motif-generalization-counterexample/results/STUDY_1_FINAL_RESULT.json`](tactical-motif-generalization-counterexample/results/STUDY_1_FINAL_RESULT.json)
- [`tactical-motif-generalization-counterexample/results/STAGE_1_TECHNICAL_INVALID_RESULT.json`](tactical-motif-generalization-counterexample/results/STAGE_1_TECHNICAL_INVALID_RESULT.json)
- [`tactical-motif-generalization-counterexample/CURRENT_STATUS.md`](tactical-motif-generalization-counterexample/CURRENT_STATUS.md)
- [`tactical-motif-generalization-counterexample/DECISION_REGISTER.md`](tactical-motif-generalization-counterexample/DECISION_REGISTER.md)
- [`tactical-motif-generalization-counterexample/REPRODUCIBILITY_INDEX.md`](tactical-motif-generalization-counterexample/REPRODUCIBILITY_INDEX.md)

**Boundary:** `TM-S2-C03 = CONFIRMED`を取消さず、C01/C02/C04を救済しない。Stage 1 partial technical computationをgeneralization/counterexample evidenceへ昇格させない。実装修正版を検証する場合は、新しいprospective Studyまたは明示的新version、fresh technical-entry contract、fresh authorizationを必要とする。
'''
    t = t[:idx] + block + t[idx + len("\n---\n"):]
write(p, t)


# Future agenda: convert G2-09 from planned to closed and synchronize sequence.
p = "doc/FUTURE_RESEARCH_AGENDA.md"
t = read(p)
start = t.find("#### G2-09 — Tactical Motif Generalization / Counterexample Study 1")
end = t.find("### 9.6 Wave C — Integration and Theory")
if start < 0 or end < 0 or end <= start:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: G2-09 section anchors missing")
replacement = r'''#### G2-09 — Tactical Motif Generalization / Counterexample Study 1

**状態:** **完了 / `TMGC-STUDY1 = TECHNICAL-INVALID` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

中心課題:

> 第一世代でmachine-confirmedされた`TM-S2-C03`について、phase、morphology、search condition、state familyを変えたfresh evidenceで成立範囲とcounterexample domainをformalに特定できるか。

Stage 0はC03 exact semantics、RAW identity、historical source binding、independent technical reconstruction、source diversity/resource feasibilityをPASSし、`STAGE0-TECHNICAL-PASS`となった。Direct Namua transportはfrozen Mtaji back-row C03 exactと同一constructにならないため`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`としてscientific counterexample populationから除外した。

Stage 1/2 population、seed、marginal boundary axes、5 search instruments、identity firewall、multiplicity、decision ruleはscientific seed消費前にfreezeした。しかしStage 1 scientific authorization前のtechnical-only tooling smoke run `33287035754`で、independent boundary aggregatorが`ReferenceError: topSetRate is not defined`を発生させ、canonical smoke resultをmaterializeできなかった。

Frozen smoke contractはtooling failure後のsame-study repairを認めていなかったため、変数名を修正してrerunせずStage 1を`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`、Studyを`TECHNICAL-INVALID`として閉じた。Stage 1 scientific seeds `29110001..29114096`とStage 2 seeds `29210001..29218192`はともに未消費である。

このclosureは`TM-S2-C03 = CONFIRMED`を変更せず、C03がgeneralizeしないこともcounterexample boundaryが存在することも示さない。修正版を検証する場合はnew prospective Studyまたはexplicit new versionとしてfresh technical-entry contractとauthorizationを固定する。

**Priority:** completed

'''
t = t[:start] + replacement + t[end:]
old_priority = "P1: G2-07 (completed), G2-08 (completed), G2-09, G2-10"
new_priority = "P1: G2-07 (completed), G2-08 (completed), G2-09 (completed), G2-10"
if old_priority not in t and new_priority not in t:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: priority anchor missing")
t = t.replace(old_priority, new_priority, 1)
old_tail = "G2-01..G2-08はclosure済みであり、次の未着手machine-only agenda itemは`G2-09 — Motif Generalization / Counterexample Study 1`である。"
new_tail = "G2-01..G2-09はclosure済みである。`G2-09`は`TMGC-STUDY1 = TECHNICAL-INVALID`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`で閉じ、scientific generalization/counterexample evidenceは未生成である。次のdownstream machine-only agenda itemは`G2-10 — Unified Multiaxial Strategic State Representation Study 1`だが、開始時にはG2-06〜G2-09のtechnical-invalid/non-estimable closuresをvalidated axisへ昇格させないeligibility ruleを新たにfreezeする。"
if old_tail not in t and new_tail not in t:
    raise SystemExit("FUTURE_RESEARCH_AGENDA: sequence-tail anchor missing")
t = t.replace(old_tail, new_tail, 1)
future_rule = "TMGC-STUDY1は`TECHNICAL-INVALID`で閉じ、Stage 1/2 scientific seedsは未消費である。同Study内でindependent boundary aggregatorを修正してtooling smokeをrerunし、Stage 1 authorizationを後付けしない。C03 generalization / counterexampleを再検証する場合はnew prospective Studyまたはexplicit new version、fresh technical-entry contract、fresh authorizationを使用する。"
if future_rule not in t:
    anchor = "Human evidenceなしではhuman error mechanismをformalに主張しない。"
    if anchor not in t:
        raise SystemExit("FUTURE_RESEARCH_AGENDA: future-rule anchor missing")
    t = t.replace(anchor, future_rule + "\n\n" + anchor, 1)
write(p, t)
