#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
README = ROOT / "README.md"
AGENDA = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
PROGRAM = ROOT / "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"
SELECTION = ROOT / "doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md"
INDEX = ROOT / "doc/RESEARCH_INDEX.md"
FINAL = ROOT / "doc/prospective-strategic-regime-representation-eligibility/results/STUDY_1_FINAL_RESULT.json"


def read(p): return p.read_text(encoding="utf-8")
def write(p, s): p.write_text(s, encoding="utf-8")
def require(c, m):
    if not c: raise SystemExit(m)

def replace_once(text, old, new, label):
    n = text.count(old)
    require(n == 1, f"{label}: expected 1 occurrence, got {n}")
    return text.replace(old, new, 1)

# Canonical result binding.
final = read(FINAL)
for token in [
    '"formalStudyDecision": "NON-ESTIMABLE"',
    '"g2_11CandidateInputAuthorized": false',
    '"g2_11Authorized": false',
]:
    require(token in final, f"canonical final result missing {token}")

# Root README: distinguish Stage 2 formal disposition from G2-11 authorization state.
root = read(README)
old = "representationはfreezeされず、Stage 2とG2-11は`NOT-AUTHORIZED-NOT-EXECUTED`。"
new = "representationはfreezeされず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、G2-11は`NOT-AUTHORIZED`。"
if old in root:
    root = replace_once(root, old, new, "root README PSRRE state")
else:
    require(new in root, "root README corrected PSRRE state missing")
write(README, root)

# FUTURE_RESEARCH_AGENDA: make priority line reflect the actual dependency block.
agenda = read(AGENDA)
old = "P2: G2-11, G2-12"
new = "P2: G2-11 (blocked / `NOT-AUTHORIZED`), G2-12"
if old in agenda:
    agenda = replace_once(agenda, old, new, "agenda priority")
else:
    require(new in agenda, "agenda corrected priority missing")
write(AGENDA, agenda)

# Program decision: translate the newly appended PSRRE closure section while preserving identifiers/tokens.
program = read(PROGRAM)
heading = "## 2026-08-30 — PSRRE-STUDY1 prerequisite closure"
pos = program.find(heading)
require(pos >= 0, "program PSRRE closure heading missing")
program_prefix = program[:pos]
program_section = '''## 2026-08-30 — PSRRE-STUDY1 prerequisite closure

Pre-G2-11のdependency-resolutionとして選択した研究方向は、`PSRRE-STUDY1` — **Prospective Strategic-Regime Representation Eligibility Study 1**としてprospectively実施した。本Studyは新しい`G2-xx` agenda labelを追加せず、closed済み`G2-10 / UMSSR-STUDY1`のcontract・formal decisionも変更していない。

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

Stage 1はfresh 4,096 games / 512 rootsのproduction / independent pipelineをfull-exact一致で完遂し、resource gateもすべてPASSした。一方、prospectively frozen development-readiness contractはnonzero-MAD featureを20以上要求していたが、observedは15だった。このためrepresentationをfreezeしてheld-out validationへpromoteする前に、Studyを`NON-ESTIMABLE`として閉じた。

同一Study内でのthreshold relaxation、zero-MAD featureの削除後再解析、family/K expansion、favorable subgroup rescue、seed rerun / replacement / extension、Stage 2のpost-hoc authorizationは認めない。

Program上の帰結として、representation dependencyは未解決であり、`G2-11`は引き続き`NOT-AUTHORIZED`である。`UMSSR-STUDY1`と`PSRRE-STUDY1`のいずれも、G2-11へ渡せるeligible frozen representation candidateを提供していない。

Canonical closure record: `doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`.
'''
program = program_prefix + program_section
write(PROGRAM, program)

# Historical selection record: localize only the newly added current-outcome sections.
selection = read(SELECTION)
start = selection.find("## Outcome of this selection")
end = selection.find("## Decision", start)
require(start >= 0 and end > start, "selection outcome section markers missing")
outcome = '''## この選択の実施結果

このhistorical selectionは、その後次のStudyとしてprospectively具体化された。

```text
Study ID = PSRRE-STUDY1
Formal title = Prospective Strategic-Regime Representation Eligibility Study 1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 candidate input authorized = false
```

Studyはfrozen representationを生成しなかった。Stage 1はtechnical / resource / full-exact verificationを完了したが、prospectively frozen minimum-nonzero-MAD-feature readiness gateを`15 < 20`で満たさなかった。本selection recordはhistorical sequencing provenanceとして保持し、現在のclosure stateは[`2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`](2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md)を正本とする。

'''
selection = selection[:start] + outcome + selection[end:]
selection = selection.replace("## Current closure state", "## 現在のclosure state", 1)
write(SELECTION, selection)

# Cross-document consistency audit.
docs = {
    "README": read(README),
    "INDEX": read(INDEX),
    "AGENDA": read(AGENDA),
    "PROGRAM": read(PROGRAM),
    "SELECTION": read(SELECTION),
}
required = {
    "README": ["Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、G2-11は`NOT-AUTHORIZED`"],
    "INDEX": ["formal decision `NON-ESTIMABLE`", "G2-11 remains `NOT-AUTHORIZED`"],
    "AGENDA": ["G2-11 (blocked / `NOT-AUTHORIZED`), G2-12", "PSRRE-STUDY1 prospective prerequisite"],
    "PROGRAM": ["Study formal decision = NON-ESTIMABLE", "`G2-11`は引き続き`NOT-AUTHORIZED`"],
    "SELECTION": ["## この選択の実施結果", "## 現在のclosure state"],
}
for name, toks in required.items():
    for token in toks:
        require(token in docs[name], f"{name}: missing {token}")

stale = [
    "Status: **SELECTED NEXT RESEARCH DIRECTION / NOT YET PREREGISTERED**",
    "**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite",
    "formal Study ID・最終題目・Stage IDは未固定",
    "scientific outcome generation未承認",
]
combined = "\n".join(docs.values())
for token in stale:
    require(token not in combined, f"stale current-state token remains: {token}")

print("PSRRE final documentation quality audit PASS")
