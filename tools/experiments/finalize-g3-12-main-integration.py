from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE_TIP = "146a515671838606034efd9d4c3120e9b4c597f2"
PREVIOUS_MAIN = "5597ae696d9eb76d8395e114cdb4f83af1138a3d"
INTEGRATION = (
    f"COMPLETE / FAST-FORWARD / source tip {SOURCE_TIP} / "
    f"previous main {PREVIOUS_MAIN} / force=false"
)


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def write(rel, text):
    (ROOT / rel).write_text(text, encoding="utf-8")


def replace_once(rel, old, new):
    text = read(rel)
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{rel}: expected exactly one occurrence, found {count}: {old!r}")
    write(rel, text.replace(old, new, 1))


# Root current-facing entry.
replace_once(
    "README.md",
    "research branchでclosure済み、`main` integrationは明示的指示待ち。",
    f"`main` integrationは`{INTEGRATION}`として完了。",
)

# Central research index.
replace_once(
    "doc/RESEARCH_INDEX.md",
    "`main` integrationは未実施で、research branch上のclosureを明示的ユーザー指示まで保持する。",
    f"`main` integrationは`{INTEGRATION}`として完了した。research branchはprovenanceのため保持する。",
)

# Future agenda current header and G3-12 current update.
replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "Research Generation 3: **Active / core agenda G3-01..G3-12 execution reached G3-12 capstone / G3-12 `LGTGGC-STUDY1` CLOSED `TECHNICAL-INVALID` / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / main integration pending explicit instruction (2026-09-04)**",
    "Research Generation 3: **Active / core agenda G3-01..G3-12 execution reached G3-12 capstone / G3-12 `LGTGGC-STUDY1` CLOSED `TECHNICAL-INVALID` / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / G3-12 main integration COMPLETE FAST-FORWARD (2026-09-04)**",
)
replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "`main` integrationは明示的ユーザー指示待ち。",
    f"`main` integrationは`{INTEGRATION}`として完了した。",
)

# Research Generation 3 landing/status documents.
replace_once(
    "doc/research-generation-3/README.md",
    "Status = ACTIVE / core agenda G3-01..G3-12 reached capstone / G3-12 LGTGGC-STUDY1 CLOSED TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / G3-12 MAIN INTEGRATION PENDING EXPLICIT USER INSTRUCTION",
    "Status = ACTIVE / core agenda G3-01..G3-12 reached capstone / G3-12 LGTGGC-STUDY1 CLOSED TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / G3-12 MAIN INTEGRATION COMPLETE FAST-FORWARD",
)
replace_once(
    "doc/research-generation-3/README.md",
    "G3-12 main integration = NOT AUTHORIZED / NOT PERFORMED",
    f"G3-12 main integration = {INTEGRATION}",
)

replace_once(
    "doc/research-generation-3/CURRENT_STATUS.md",
    "Program status = ACTIVE / core agenda G3-01..G3-12 reached capstone / G3-12 LGTGGC-STUDY1 CLOSED TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / main integration pending explicit user instruction",
    "Program status = ACTIVE / core agenda G3-01..G3-12 reached capstone / G3-12 LGTGGC-STUDY1 CLOSED TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / G3-12 main integration COMPLETE FAST-FORWARD",
)
replace_once(
    "doc/research-generation-3/CURRENT_STATUS.md",
    "G3-12 main integration = NOT AUTHORIZED / NOT PERFORMED",
    f"G3-12 main integration = {INTEGRATION}",
)
replace_once(
    "doc/research-generation-3/CURRENT_STATUS.md",
    "`main` integrationは明示的ユーザー指示まで行わない。",
    f"`main` integrationは`{INTEGRATION}`として完了した。",
)

# Study-facing current documents.
replace_once(
    "doc/local-game-tree-geometry-generalization-counterexample/README.md",
    "main integration = NOT AUTHORIZED / NOT PERFORMED",
    f"main integration = {INTEGRATION}",
)

replace_once(
    "doc/local-game-tree-geometry-generalization-counterexample/CURRENT_STATUS.md",
    "Main integration = NOT AUTHORIZED / NOT PERFORMED",
    f"Main integration = {INTEGRATION}",
)
replace_once(
    "doc/local-game-tree-geometry-generalization-counterexample/CURRENT_STATUS.md",
    "`main` integration is **NOT AUTHORIZED / NOT PERFORMED**. Explicit user instruction is required.",
    f"`main` integration is **{INTEGRATION}**. The research branch is retained for provenance.",
)

replace_once(
    "doc/local-game-tree-geometry-generalization-counterexample/REPRODUCIBILITY_INDEX.md",
    "Main integration remains outside this reproducibility record until explicit user authorization.",
    f"Main integration completed by non-forced fast-forward: `{INTEGRATION}`. The research branch is retained for provenance.",
)

# Decision register: preserve D029 as the historical pre-integration boundary and append D030.
decision_path = ROOT / "doc/local-game-tree-geometry-generalization-counterexample/DECISION_REGISTER.md"
decision = decision_path.read_text(encoding="utf-8")
marker = "## LGTGGC-D030 — Main integration complete"
if marker in decision:
    raise SystemExit("DECISION_REGISTER already contains D030")
decision += f"\n\n{marker}\n\n**Decision:** `MAIN-INTEGRATION-COMPLETE / FAST-FORWARD / force=false`.\n\nExplicit user authorization was received after the pre-main consistency audit. `main` was advanced from `{PREVIOUS_MAIN}` to source research tip `{SOURCE_TIP}` by non-forced fast-forward. No scientific computation, Stage 1 replay, Stage 2 access, depth-10 rerun, depth-11 access, or G2-12 estimator input was performed as part of integration.\n"
decision_path.write_text(decision, encoding="utf-8")

# Post-integration checkpoint.
checkpoint = ROOT / "doc/research-generation-3/checkpoints/2026-09-04-g3-12-main-integration-complete.md"
if checkpoint.exists():
    raise SystemExit("integration checkpoint already exists")
checkpoint.write_text(
    f"""# 2026-09-04 — G3-12 main integration complete\n\n## Decision\n\n**`COMPLETE / FAST-FORWARD / force=false`**\n\nG3-12 `LGTGGC-STUDY1`のresearch branch closureを、明示的ユーザー指示に基づいて`main`へ統合した。\n\n```text\nStudy = LGTGGC-STUDY1\nFinal scientific decision = CLOSED / TECHNICAL-INVALID\nSource research tip = {SOURCE_TIP}\nPrevious main = {PREVIOUS_MAIN}\nIntegration method = fast-forward\nForce = false\n```\n\n## Scientific boundary\n\n本統合はrepository integration/bookkeepingのみであり、科学的判断を変更しない。\n\n```text\nStage 0 = v3 / STAGE0-PASS\nStage 1 = EXECUTED EXACTLY ONCE / TECHNICAL-INVALID\nSFCDF Stage 1 = STAGE1-PASS / development readiness only\nSILGM Stage 1 = STAGE1-TECHNICAL-INVALID\nGCLD Stage 1 = NOT EXECUTED / seeds unread\nStage 2 = NOT AUTHORIZED / NOT EXECUTED / seeds unread\nFormal generalization decisions = NONE\nFormal counterexample decisions = NONE\nsame-evidence rerun = NOT AUTHORIZED\nG3-11 depth-10 rerun = false\ndepth 11 access = false\nG2-12 estimator scientific input = false\n```\n\n## Documentation bookkeeping\n\n統合後のcurrent-facing整合性を保つため、root README、Research Index、Future Research Agenda、RG3 README/CURRENT_STATUS、G3-12 README/CURRENT_STATUS/Reproducibility Indexを`main integration COMPLETE`へ更新した。Decision RegisterのD029は統合前のhistorical boundaryとして保持し、D030で統合完了を追記した。Final Reportおよびpre-main checkpointは当時の記録として変更していない。\n\n## Result\n\n**G3-12 main integration and post-integration bookkeeping are complete.**\n""",
    encoding="utf-8",
)

print("G3-12 main integration bookkeeping prepared")
