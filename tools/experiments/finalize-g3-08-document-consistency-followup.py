from __future__ import annotations

from pathlib import Path
import hashlib
import os
import subprocess

BRANCH = "research/g3-08-local-geometry-persistence-memory-length"
MAIN_BASE = "9f6abd3c9b146bb88c11dd04963052300e4cdc3b"
PROGRAM_PLAN_BLOB = "2bb90c11f1625f63f40a7eab8a3de7774505a1ac"
ROOT = Path(".")


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    Path(path).write_text(text, encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one replacement target, found {count}")
    write(path, text.replace(old, new, 1))


def append_once(path: str, marker: str, block: str) -> None:
    text = read(path)
    if marker in text:
        return
    write(path, text.rstrip() + "\n\n" + block.strip() + "\n")


# 1. RG3 central README: remove the stale duplicate pre-G3-08 line from the live status block.
replace_once(
    "doc/research-generation-3/README.md",
    "G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state review required\nG3-08 = NOT AUTHORIZED / separate post-G3-07 current-state review required\nProtected depth-10 exact holdout",
    "G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state review required\nProtected depth-10 exact holdout",
)

# 2. G3-07 current-facing downstream metadata: preserve closure-time boundary as history and state the later outcome.
replace_once(
    "doc/search-instability-local-geometry-mechanism/README.md",
    "G3-08 — Local Geometry Persistence / Memory-Length Study 1 — remains **`NOT AUTHORIZED`**. A separate post-G3-07 current-state authorization review is required before any G3-08 scientific execution.",
    "**Historical closure-time boundary:** at G3-07 closure, G3-08 — Local Geometry Persistence / Memory-Length Study 1 — was **`NOT AUTHORIZED`** and required a separate post-G3-07 current-state authorization review. That review was later completed. Current program state is recorded in `../research-generation-3/CURRENT_STATUS.md`: G3-08 / `LGPML-STUDY1` is now **`CLOSED / TECHNICAL-INVALID`**, and G3-09 remains not authorized pending a separate post-G3-08 review.",
)
replace_once(
    "doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md",
    "Program-level next scientific action is a **separate post-G3-07 current-state G3-08 authorization review**. G3-08 remains **NOT AUTHORIZED** and must not start automatically.",
    "**Historical closure-time downstream boundary:** at G3-07 closure, the next program-level scientific action was a separate post-G3-07 current-state G3-08 authorization review, and G3-08 was not authorized automatically. That review was later completed. Current program state: G3-08 / `LGPML-STUDY1` is `CLOSED / TECHNICAL-INVALID`; G3-09 remains `NOT AUTHORIZED` pending a separate post-G3-08 current-state authorization review.",
)
replace_once(
    "doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md",
    "本closureはresearch branch上の研究完了記録であり、**mainへの統合を意味しない**。main integrationはユーザーからの明示的指示があるまで実施しない。",
    "本closure作成時点ではresearch branch上の研究完了記録であり、**その時点ではmainへの統合を意味しなかった**。その後、ユーザーの明示的指示を受け、2026-09-03にresearch branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` を`main`へfast-forward統合した。これはrepository lifecycleの後続更新であり、G3-07のscientific result、formal labels、threshold、seed、claim boundaryを変更しない。",
)
replace_once(
    "doc/search-instability-local-geometry-mechanism/DECISION_REGISTER.md",
    "| SILGM-D066 | Main integration | `EXPLICIT USER INSTRUCTION REQUIRED / NOT PERFORMED` | Study closure does not authorize merge/integration to main. |",
    "| SILGM-D066 | Main integration at Study closure | `EXPLICIT USER INSTRUCTION REQUIRED / NOT PERFORMED AT CLOSURE` | Study closure itself did not authorize merge/integration to main. |\n| SILGM-D067 | Post-closure main integration | `COMPLETE / FAST-FORWARD` | Later explicit user instruction authorized integration of research branch tip `7f14538aa0ec3edd2045649025715219ffea17ec`; scientific decisions unchanged. |\n| SILGM-D068 | Post-G3-07 downstream review | `COMPLETED / G3-08 CLOSED TECHNICAL-INVALID` | Separate review later authorized G3-08; `LGPML-STUDY1` subsequently closed technical-invalid. This does not modify G3-07 evidence or formal decisions. |",
)

# 3. Earlier adjacent RG3 Study CURRENT_STATUS/README next-action text: mark it explicitly historical.
replace_once(
    "doc/bao-rule-mechanism-geometry-intervention/README.md",
    "G3-07は自動authorizeしない。次に進む場合はseparate post-G3-06 current-state authorization reviewを行う。\n\nBRMGI selection diagnosticsをG3-07のvalidated scientific inputとして利用しない。protected depth-10 holdoutは引き続きsealed。",
    "**Historical closure-time boundary:** G3-06 closure時点ではG3-07は自動authorizeされず、separate post-G3-06 current-state authorization reviewが必要だった。そのreviewは後に完了し、G3-07は独立に実施・閉鎖された。現在のprogram stateは`../research-generation-3/CURRENT_STATUS.md`を参照する。\n\nBRMGI selection diagnosticsを後続Studyのvalidated scientific inputとして利用しない。protected depth-10 holdoutは引き続きsealed。",
)
replace_once(
    "doc/bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md",
    "Historical agenda上のG3-07は自動authorizeしない。次に進む場合はseparate post-G3-06 current-state authorization reviewが必要で、BRMGI selection diagnosticsをvalidated scientific inputとして継承しない。\n\nMain integration is **COMPLETE**. The next scientific action remains the separate post-G3-06 current-state authorization review for G3-07.",
    "**Historical closure-time downstream boundary:** G3-06 closure時点ではG3-07を自動authorizeせず、separate post-G3-06 current-state authorization reviewを必要とした。BRMGI selection diagnosticsをvalidated scientific inputとして継承しない。このreviewは後に完了し、G3-07も独立に実施・閉鎖された。\n\nMain integration is **COMPLETE**. Current program-level next actionは`../research-generation-3/CURRENT_STATUS.md`を参照する。現在はG3-08までclosure済みで、G3-09はseparate post-G3-08 review前の`NOT AUTHORIZED`である。",
)
replace_once(
    "doc/branch-expansion-compression-transition/CURRENT_STATUS.md",
    "BECT-STUDY1は **`CLOSED / TECHNICAL-INVALID`** としてclosure済みで、final report / reproducibility / central research-program documentsの同期と`main`へのfast-forward統合も完了しています。Study内の追加scientific executionはありません。次のprogram-level scientific actionはseparate post-G3-05 current-state G3-06 authorization reviewであり、G3-06は現時点で`NOT AUTHORIZED`です。",
    "BECT-STUDY1は **`CLOSED / TECHNICAL-INVALID`** としてclosure済みで、final report / reproducibility / central research-program documentsの同期と`main`へのfast-forward統合も完了しています。Study内の追加scientific executionはありません。**G3-05 closure時点では**次のprogram-level scientific actionはseparate post-G3-05 current-state G3-06 authorization reviewで、G3-06は当時`NOT AUTHORIZED`でした。そのreviewは後に完了し、G3-06以降も独立に進行しました。現在のprogram stateは`../research-generation-3/CURRENT_STATUS.md`を参照します。",
)
replace_once(
    "doc/structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md",
    "`main`統合は通常PR #95により完了し、merge commitは`ad3dc26e0e2b1ccf1179eda9fe1ebbfa2a61f9bf`。post-merge記録は`../research-generation-3/checkpoints/2026-09-02-g3-03-g3-04-main-integration-complete.md`。program上の次科学作業はseparate post-G3-04 G3-05 authorization reviewであり、G3-05はまだauthorizeされていない。",
    "`main`統合は通常PR #95により完了し、merge commitは`ad3dc26e0e2b1ccf1179eda9fe1ebbfa2a61f9bf`。post-merge記録は`../research-generation-3/checkpoints/2026-09-02-g3-03-g3-04-main-integration-complete.md`。**G3-04 closure時点では**次科学作業はseparate post-G3-04 G3-05 authorization reviewで、G3-05は当時未authorizeだった。そのreviewは後に完了し、G3-05以降も独立に進行した。現在のprogram stateは`../research-generation-3/CURRENT_STATUS.md`を参照する。",
)

# 4. Final-report repository lifecycle addenda for Studies integrated after scientific closure.
replace_once(
    "doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md",
    "main integration = NOT PERFORMED",
    "main integration at scientific closure = NOT PERFORMED",
)
append_once(
    "doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md",
    "<!-- BECT-POST-CLOSURE-INTEGRATION-ADDENDUM -->",
    """<!-- BECT-POST-CLOSURE-INTEGRATION-ADDENDUM -->\n## Post-closure repository lifecycle addendum\n\nScientific closure時点ではmain integrationは未実施だった。その後、明示的ユーザー指示を受けてresearch head `49f868103b186c8bc00a188afd185a620a797e55` のfast-forward統合が完了した。このrepository lifecycle更新はBECT-STUDY1のscientific result、technical-invalid disposition、formal promoted set、no-rescue boundaryを変更しない。""",
)
replace_once(
    "doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md",
    "main integration = NOT PERFORMED",
    "main integration at scientific closure = NOT PERFORMED",
)
append_once(
    "doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md",
    "<!-- BRMGI-POST-CLOSURE-INTEGRATION-ADDENDUM -->",
    """<!-- BRMGI-POST-CLOSURE-INTEGRATION-ADDENDUM -->\n## Post-closure repository lifecycle addendum\n\nScientific closure時点ではmain integrationは未実施だった。その後、明示的ユーザー指示を受けてaudited head `f8eda131b81f0d6e3bc9f804ddfce875c9cd8d2b` のfast-forward統合が完了した。このrepository lifecycle更新はBRMGI-STUDY1のscientific result、technical-invalid disposition、formal promoted set、no-rescue boundaryを変更しない。""",
)

# 5. Central index/agenda: clarify the G3-07 -> G3-08 boundary as historical and record the later review outcome.
replace_once(
    "doc/RESEARCH_INDEX.md",
    "**Downstream boundary:** G3-08 — Local Geometry Persistence / Memory-Length Study 1 is not automatically authorized. A separate post-G3-07 current-state authorization review is required. Protected depth-10 remains sealed. A later explicit user instruction authorized integration, and G3-07 was fast-forward integrated to `main` from research branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` on 2026-09-03; the research branch is retained for provenance.",
    "**Historical downstream boundary at G3-07 closure:** G3-08 — Local Geometry Persistence / Memory-Length Study 1 was not automatically authorized and required a separate post-G3-07 current-state authorization review. That review later completed; G3-08 / `LGPML-STUDY1` was independently executed and is now `CLOSED / TECHNICAL-INVALID`. Protected depth-10 remains sealed. A later explicit user instruction also authorized G3-07 integration, and G3-07 was fast-forward integrated to `main` from research branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` on 2026-09-03; the research branch is retained for provenance.",
)
replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "historical plan上のG3-08は自動authorizeされず、separate post-G3-07 current-state reviewが必要。G3-07のmain integrationは、その後の明示的ユーザー指示を受け、2026-09-03にresearch branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` をfast-forwardして完了した。",
    "**G3-07 closure時点では**historical plan上のG3-08は自動authorizeされず、separate post-G3-07 current-state reviewが必要だった。そのreviewは後に完了し、G3-08 / `LGPML-STUDY1`も独立に実施され現在は`CLOSED / TECHNICAL-INVALID`である。G3-07のmain integrationは、その後の明示的ユーザー指示を受け、2026-09-03にresearch branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` をfast-forwardして完了した。",
)

# 6. Latest G3-08 reproducibility/current-facing navigation points to this follow-up audit.
append_once(
    "doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md",
    "<!-- LGPML-FINAL-DOC-FOLLOWUP -->",
    """<!-- LGPML-FINAL-DOC-FOLLOWUP -->\n## Final document consistency follow-up\n\nA post-closure read-through found stale downstream/lifecycle wording in inherited G3-04..G3-07 current-facing documents and one duplicate obsolete G3-08 status line in the RG3 README. These are repository-documentation metadata only; no scientific content changed. The correction is recorded in `checkpoints/2026-09-03-final-document-consistency-followup-pass.md`.\n\nCurrent authoritative program state remains: G3-08 / `LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID`; G3-09 `NOT AUTHORIZED`; protected depth-10 sealed; G3-08 main integration not performed.\n""",
)

# 7. Verification gates.
rg3 = read("doc/research-generation-3/README.md")
if rg3.count("G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID") != 1:
    raise RuntimeError("RG3 README must contain exactly one live closed G3-08 status")
if "G3-08 = NOT AUTHORIZED / separate post-G3-07 current-state review required" in rg3.split("Protected depth-10 exact holdout")[0]:
    raise RuntimeError("stale G3-08 status remains in live RG3 README block")

for path in [
    "doc/local-geometry-persistence-memory-length/README.md",
    "doc/local-geometry-persistence-memory-length/CURRENT_STATUS.md",
    "doc/local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md",
    "doc/research-generation-3/CURRENT_STATUS.md",
]:
    text = read(path)
    if "CLOSED / TECHNICAL-INVALID" not in text:
        raise RuntimeError(f"{path}: G3-08 closure token missing")

if "G3-09 = NOT AUTHORIZED" not in read("doc/research-generation-3/CURRENT_STATUS.md"):
    raise RuntimeError("RG3 current status missing G3-09 boundary")
if "main integration = NOT AUTHORIZED / NOT PERFORMED" not in read("doc/local-geometry-persistence-memory-length/CURRENT_STATUS.md"):
    raise RuntimeError("G3-08 main integration boundary changed")
if "SEALED / NOT GENERATED / NOT READ / NOT PEEKED" not in read("doc/local-geometry-persistence-memory-length/CURRENT_STATUS.md"):
    raise RuntimeError("protected depth-10 boundary changed")

program_blob = subprocess.check_output(
    ["git", "hash-object", "doc/research-generation-3/PROGRAM_PLAN.md"], text=True
).strip()
if program_blob != PROGRAM_PLAN_BLOB:
    raise RuntimeError(f"historical PROGRAM_PLAN changed: {program_blob}")

# Follow-up checkpoint generated as part of the same documentation-only commit.
run_id = os.environ.get("GITHUB_RUN_ID", "unknown")
trigger_head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
checkpoint = f"""# G3-08 / LGPML-STUDY1 — Final Document Consistency Follow-up Pass\n\nDate: 2026-09-03\n\n## Disposition\n\n**`PASS`**\n\nThe first final consistency pass correctly fixed the G3-08 Study and central current state, but a subsequent full inherited-document read-through found repository-lifecycle wording that remained stale in G3-04..G3-07 current-facing documents, plus one duplicate obsolete G3-08 status line in `doc/research-generation-3/README.md`.\n\nThis follow-up normalizes only historical downstream-authorization / main-integration metadata. It does **not** change any scientific result, candidate label, threshold, endpoint, seed, hash, population, representation, no-rescue boundary, or protected-evidence state.\n\n## Corrections\n\n- removed duplicate live `G3-08 = NOT AUTHORIZED` line from RG3 README;\n- marked G3-04..G3-07 closure-time next-study authorization statements as historical;\n- updated G3-07 README/CURRENT_STATUS to state that the separate G3-08 review later completed and G3-08 is now closed technical-invalid;\n- added post-closure main-integration metadata to G3-05/G3-06/G3-07 final reports without changing science;\n- appended G3-07 Decision Register lifecycle follow-up decisions;\n- clarified G3-07 downstream history in RESEARCH_INDEX / FUTURE_RESEARCH_AGENDA.\n\n## Immutable current state\n\n```text\nG3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seeds = NOT CONSUMED\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED\nG3-08 main integration = NOT AUTHORIZED / NOT PERFORMED\nG3-09 = NOT AUTHORIZED / separate post-G3-08 review required\nPROGRAM_PLAN blob = {PROGRAM_PLAN_BLOB}\n```\n\nWorkflow run = `{run_id}`  \nAudit trigger HEAD = `{trigger_head}`  \nResearch branch = `{BRANCH}`\n\nThis checkpoint supersedes the earlier consistency pass only with respect to documentation-lifecycle completeness; the earlier scientific/technical closure checks remain valid.\n"""
Path("doc/local-geometry-persistence-memory-length/checkpoints/2026-09-03-final-document-consistency-followup-pass.md").write_text(checkpoint, encoding="utf-8")

print("G3_08_FINAL_DOCUMENT_CONSISTENCY_FOLLOWUP=PASS")
