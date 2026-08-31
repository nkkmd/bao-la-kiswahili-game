#!/usr/bin/env python3
from pathlib import Path


def read(path):
    return Path(path).read_text(encoding="utf-8")


def write(path, text):
    Path(path).write_text(text, encoding="utf-8")


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def replace_once(text, old, new, label):
    count = text.count(old)
    require(count == 1, f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)


# README.md — insert one program-level synthesis entry after G2-12.
path = "README.md"
text = read(path)
marker = "- [`doc/state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md`]"
lines = text.splitlines()
indices = [i for i, line in enumerate(lines) if line.startswith(marker)]
require(len(indices) == 1, f"README G2-12 marker count={len(indices)}")
new_line = "- [`doc/research-generation-2/FINAL_SYNTHESIS.md`](doc/research-generation-2/FINAL_SYNTHESIS.md): Research Generation 2 final synthesis。Core `G2-01..G2-12`はformal closure。G2-11はrequired frozen representation不成立によりagenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`（Study ID未付与）で閉じ、G2-H01はindependent / non-blocking human trackとしてdeferred。"
require(new_line not in lines, "README synthesis entry already present")
lines.insert(indices[0] + 1, new_line)
write(path, "\n".join(lines) + ("\n" if text.endswith("\n") else ""))


# RESEARCH_INDEX.md — add program closure section and replace stale future-state block.
path = "doc/RESEARCH_INDEX.md"
text = read(path)
future_heading = "## 将来研究"
require(text.count(future_heading) == 1, "RESEARCH_INDEX future heading not unique")
section = """### 29. Research Generation 2 — Program Closure / Final Synthesis

**Program:** Bao Second-Generation Research Program / **Core:** `G2-01..G2-12`  
**状態:** **PROGRAM CLOSED / G2-11 agenda-level `NON-ESTIMABLE` / G2-H01 deferred non-blocking**

Research Generation 2は、positive resultの数ではなく、各agenda questionをprospective stop rule、dependency gate、independent verification、no-rescue ruleに従ってformal closureし、その解釈境界を保存することを完了条件としていた。

G2-10 `UMSSR-STUDY1`はeligible frozen strategic representationを生成せず、独立Pre-G2-11 prerequisite `PSRRE-STUDY1`も`NON-ESTIMABLE` / `selectedRepresentation = null`で閉じた。追加representation prerequisite StudyをこのGeneration内で繰り返さないprogram decisionにより、G2-11はStudyを開始せず、formal Study IDも付与しないままagenda-level scientific disposition `NON-ESTIMABLE`、execution `NOT-AUTHORIZED-NOT-EXECUTED`として閉じた。これはlong-horizon transition structureのnegative resultではない。

G2-12 `SSGTGE-STUDY1`も`TECHNICAL-INVALID` / `selectedEstimator = null`でclosure済みであり、fresh depth 10/11は未生成・未読である。これによりcore `G2-01..G2-12`は全てformal closureを持つ。

**最初に読む:**

- [`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md) — Research Generation 2全体の科学的統合とclaim boundary

**Program closure records:**

- [`research-generation-2/PROGRAM_FINAL_RESULT.json`](research-generation-2/PROGRAM_FINAL_RESULT.json) — machine-readable program closure
- [`research-generation-2/CURRENT_STATUS.md`](research-generation-2/CURRENT_STATUS.md) — current closure state
- [`research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md`](research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md) — G2-11 dependency-gate closure
- [`research-program-decisions/2026-08-31-research-generation-2-program-closure.md`](research-program-decisions/2026-08-31-research-generation-2-program-closure.md) — program closure decision

**Boundary:** G2-11を実行済みStudyとして扱わない。G2-10 / PSRREのthresholdやrepresentationを結果後に救済しない。将来のstrategic representation、long-horizon transition、canonicalization、growth estimation等は新しい研究世代または独立prospective programとして扱う。


---

"""
text = text.replace(future_heading, section + future_heading, 1)
start_marker = "**現在のPre-G2-11 dependency state:**"
end_marker = "既存研究から切り出された独立課題や、新しい研究テーマは次に集約します。"
start = text.find(start_marker)
end = text.find(end_marker)
require(start != -1 and end != -1 and start < end, "RESEARCH_INDEX stale future-state block not found")
replacement = """**Research Generation 2 state:** core program `G2-01..G2-12` is formally closed as of 2026-08-31. G2-11はrequired strategic-regime representation dependency不成立によりagenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`で閉じ、formal Study IDは付与していない。G2-H01はindependent / non-blocking human trackとしてdeferredのままである。

第二世代の未成立課題を再検討する場合、closed G2 StudyやPSRRE-STUDY1をreopen / rescueせず、新しい研究世代または独立prospective programとしてfresh contract・fresh evidenceを用いる。Program final synthesisは[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)を参照。

"""
text = text[:start] + replacement + text[end:]
write(path, text)


# FUTURE_RESEARCH_AGENDA.md — close G2-11 and Research Generation 2 without marking the whole future agenda inactive.
path = "doc/FUTURE_RESEARCH_AGENDA.md"
text = read(path)
status_line = "更新日: 2026-08-31"
require(text.count(status_line) == 1, "FUTURE agenda update-date anchor not unique")
text = text.replace(status_line, status_line + "\nResearch Generation 2: **Closed (2026-08-31)**", 1)
start_heading = "#### G2-11 — Long-Horizon Strategic Transition Structure Study 1"
end_heading = "#### G2-12 — State-Space / Game-Tree Growth Estimation Study 1"
start = text.find(start_heading)
end = text.find(end_heading)
require(start != -1 and end != -1 and start < end, "G2-11 section bounds not found")
new_g211 = """#### G2-11 — Long-Horizon Strategic Transition Structure Study 1

**状態:** **formal agenda closure / scientific disposition `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED` / formal Study ID not assigned**

中心課題は、frozen strategic-state / regime representationを用いて、対局中のregime transition、persistence、transient structure、bottleneck、recurrent structure等を再現可能に記述することだった。

しかしG2-10 `UMSSR-STUDY1`は`selectedRepresentation = null`で閉じ、その後の独立Pre-G2-11 prerequisite `PSRRE-STUDY1`もfrozen readiness failureにより`NON-ESTIMABLE` / `selectedRepresentation = null`で閉じた。したがってG2-11へ渡せるeligible / frozen representation inputは得られなかった。

Research Generation 2を完了させる目的だけで追加representation prerequisite Studyを繰り返さず、G2-10またはPSRREのthreshold・feature・family・seedを結果後に救済しないことをprogram-levelに決定した。このためG2-11はscientific executionをauthorizeせず、Study IDも付与しないまま次でformal closureする。

```text
scientific disposition = NON-ESTIMABLE
execution = NOT-AUTHORIZED-NOT-EXECUTED
formal Study ID = NOT ASSIGNED
scientific outcome generated = false
```

これはlong-horizon strategic transition structureが存在しないことを示すnegative resultではない。現Generationで要求したinput representationがformalに成立せず、追加prerequisite研究を行わないため、問いをformalに評価できなかったというclosureである。

将来再検討する場合はResearch Generation 2の未完作業として再開せず、新しい研究世代または独立prospective programでrepresentation identity、fresh population、eligibility criteria、transition endpoint、authorizationをoutcome前に新規固定する。

Program decision: [`research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md`](research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md)

**Priority:** completed by dependency-gate formal closure


"""
text = text[:start] + new_g211 + text[end:]
old_priority = "P2: G2-11 (blocked / `NOT-AUTHORIZED`), G2-12 (completed / `TECHNICAL-INVALID`)"
new_priority = "P2: G2-11 (closed / `NON-ESTIMABLE` / `NOT-AUTHORIZED-NOT-EXECUTED`), G2-12 (completed / `TECHNICAL-INVALID`)"
text = replace_once(text, old_priority, new_priority, "FUTURE priority line")
text = text.replace("**Priority:** completed prerequisite; G2-11 dependency remains unresolved", "**Priority:** completed prerequisite; G2-11 subsequently closed as agenda-level `NON-ESTIMABLE` without scientific execution")
text = text.replace("G2-11 remains NOT-AUTHORIZED; dependency resolution required", "G2-11 = agenda-level NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED; Research Generation 2 closed")
old_hold = "したがってG2-11へ`UMSSR-STUDY1`または`PSRRE-STUDY1`由来のunvalidated representationを持ち込まず、G2-11は`NOT-AUTHORIZED`のまま保持する。"
new_hold = "したがってG2-11へ`UMSSR-STUDY1`または`PSRRE-STUDY1`由来のunvalidated representationを持ち込まず、追加prerequisite研究をこのGeneration内では行わない。G2-11はagenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`としてformal closureする。"
if old_hold in text:
    text = text.replace(old_hold, new_hold, 1)
closure_section = """

### 9.10 Research Generation 2 formal closure — 2026-08-31

`G2-01..G2-12`のcore agendaはformal closureした。G2-11はrequired frozen strategic-regime representationが得られなかったため、Studyを開始せずformal Study IDも付与せず、agenda-level scientific disposition `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`で閉じた。これはtransition structureのnegative resultではない。

Section 9.9のcompletion conditionsは、G2-11 dependency-gate closureとResearch Generation 2 final synthesisの作成により満たされた。Canonical synthesisは[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)、program closure decisionは[`research-program-decisions/2026-08-31-research-generation-2-program-closure.md`](research-program-decisions/2026-08-31-research-generation-2-program-closure.md)を参照する。

G2-H01は当初からcore machine programに対してindependent / non-blockingであり、qualified participant accessがないためdeferredのままとする。human claimをmachine-only evidenceで代替しない。

第二世代でformalに成立しなかった課題を将来再検討する場合、closed Studyのreopen / rescueではなく、新しい研究世代または独立prospective programとして扱う。
"""
require("### 9.10 Research Generation 2 formal closure — 2026-08-31" not in text, "FUTURE closure section already present")
text = text.rstrip() + closure_section + "\n"
write(path, text)


# Program decision ledger — append immutable closure entries.
path = "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"
text = read(path)
require("## 2026-08-31 — G2-11 dependency-gate formal closure" not in text, "program ledger G2-11 closure already present")
appendix = """

## 2026-08-31 — G2-11 dependency-gate formal closure

G2-10 `UMSSR-STUDY1`はeligible frozen strategic representationを生成せず、独立Pre-G2-11 prerequisite `PSRRE-STUDY1`も`NON-ESTIMABLE` / `selectedRepresentation = null`で閉じた。

追加representation prerequisite StudyをResearch Generation 2内で繰り返さず、closed Studyのthreshold / feature / family / seedを結果後に救済しないprogram decisionを採用した。

```text
G2-11 formal Study ID = NOT ASSIGNED
G2-11 scientific disposition = NON-ESTIMABLE
G2-11 execution = NOT-AUTHORIZED-NOT-EXECUTED
scientific outcome generated = false
```

これはlong-horizon transition structureへのnegative evidenceではなく、required input representation dependency不成立によるagenda-level estimability closureである。

Canonical decision: `doc/research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md`。

## 2026-08-31 — Research Generation 2 program closure

Core agenda `G2-01..G2-12`はprospective stop rule / dependency gateに従ってformal closureした。G2-11を上記dependency-gated `NON-ESTIMABLE` closureとし、G2-12 `SSGTGE-STUDY1 = TECHNICAL-INVALID`を含む全core agenda itemに明示的なterminal dispositionが存在する。

Section 9.9のprogram completion conditionsを監査し、final synthesisを作成したためResearch Generation 2 core programを`CLOSED`とする。

```text
Research Generation 2 core = CLOSED
G2-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING
RAW identity = authoritative
validated transform set = []
validated strategic-regime representation = none
formal whole-Bao state-space/game-tree estimate = not authorized
public AI engineering = separate from scientific success
```

Canonical synthesis: `doc/research-generation-2/FINAL_SYNTHESIS.md`。  
Machine-readable closure: `doc/research-generation-2/PROGRAM_FINAL_RESULT.json`。  
Program closure decision: `doc/research-program-decisions/2026-08-31-research-generation-2-program-closure.md`。
"""
write(path, text.rstrip() + appendix + "\n")

print("G2 final program central documentation sync prepared successfully")
