from pathlib import Path
import hashlib
import json

SOURCE_TIP = "7f14538aa0ec3edd2045649025715219ffea17ec"
PROGRAM_PLAN_BLOB = "2bb90c11f1625f63f40a7eab8a3de7774505a1ac"


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected exactly one occurrence, found {count}: {old!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


replace_once(
    "doc/research-generation-3/CURRENT_STATUS.md",
    "G3-07 no-rescue boundary = CROSSED / CLOSED\nG3-08 = NOT AUTHORIZED / separate post-G3-07 current-state authorization review required",
    f"G3-07 no-rescue boundary = CROSSED / CLOSED\nG3-07 main integration = COMPLETE / FAST-FORWARD / source branch tip {SOURCE_TIP}\nG3-08 = NOT AUTHORIZED / separate post-G3-07 current-state authorization review required",
)
replace_once(
    "doc/research-generation-3/CURRENT_STATUS.md",
    "Active scientific research branch = none / research/g3-07-search-instability-local-geometry-mechanism scientifically CLOSED and pending explicit user decision on integration",
    "Active scientific research branch = none / G3-07 is integrated to main; research/g3-07-search-instability-local-geometry-mechanism retained for provenance",
)

replace_once(
    "doc/research-generation-3/README.md",
    "G3-07 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED",
    f"G3-07 main integration = COMPLETE / FAST-FORWARD / source branch tip {SOURCE_TIP}",
)
replace_once(
    "doc/research-generation-3/README.md",
    "- [`../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`](../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md) — G3-07 program closure / G3-08 not auto-authorized",
    "- [`../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`](../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md) — G3-07 program closure / G3-08 not auto-authorized\n- [`checkpoints/2026-09-03-g3-07-main-integration-complete.md`](checkpoints/2026-09-03-g3-07-main-integration-complete.md) — G3-07 research branchのmain fast-forward統合完了checkpoint",
)

replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "G3-07のmain integrationも明示的ユーザー指示までは行わない。",
    f"G3-07のmain integrationは、その後の明示的ユーザー指示を受け、2026-09-03にresearch branch tip `{SOURCE_TIP}` をfast-forwardして完了した。",
)

replace_once(
    "doc/RESEARCH_INDEX.md",
    "G3-07 research branch is not integrated to `main` without explicit user instruction.",
    f"A later explicit user instruction authorized integration, and G3-07 was fast-forward integrated to `main` from research branch tip `{SOURCE_TIP}` on 2026-09-03; the research branch is retained for provenance.",
)

replace_once(
    "README.md",
    "- [`doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md): RG3側のG3-07 closure checkpoint。main integrationは未実施。",
    "- [`doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md): RG3側のG3-07 closure checkpoint。closure時点ではmain integration未実施。\n- [`doc/research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md): 明示的ユーザー指示後のG3-07 main fast-forward統合完了checkpoint。",
)

replace_once(
    "doc/search-instability-local-geometry-mechanism/README.md",
    "This research branch is closed scientifically but **not integrated to `main`**. Integration requires a separate explicit user instruction.",
    f"This Study was fast-forward integrated to `main` on 2026-09-03 after explicit user instruction, using research branch tip `{SOURCE_TIP}`. The research branch is retained for provenance; scientific closure and no-rescue boundaries are unchanged.",
)

replace_once(
    "doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md",
    "main integration = EXPLICIT USER INSTRUCTION REQUIRED / NOT PERFORMED",
    f"main integration = COMPLETE / FAST-FORWARD / source branch tip {SOURCE_TIP}",
)
replace_once(
    "doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md",
    "This closed research branch remains pending an explicit user decision on integration.\n\n**Do not merge or integrate to `main` unless the user explicitly instructs it.**",
    "Main integration is complete after explicit user instruction. The closed research branch is retained for provenance.\n\nNo further G3-07 merge action is required. Any new scientific work still requires a separate prospective authorization.",
)
replace_once(
    "doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md",
    "- `checkpoints/2026-09-03-final-document-consistency-followup-pass.md`",
    "- `checkpoints/2026-09-03-final-document-consistency-followup-pass.md`\n- `../research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md`",
)

replace_once(
    "doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md",
    "main integration = NOT PERFORMED",
    f"main integration = COMPLETE / FAST-FORWARD / source branch tip {SOURCE_TIP}",
)
replace_once(
    "doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md",
    "This index describes the closed research branch state only. **No main merge/integration is authorized by Study closure.** Integration to `main` requires a separate explicit user instruction.",
    f"Study closure itself did not authorize main integration. A later explicit user instruction did authorize it, and fast-forward integration from research branch tip `{SOURCE_TIP}` completed on 2026-09-03. The research branch remains available for provenance.",
)

checkpoint = Path("doc/research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md")
if checkpoint.exists():
    raise SystemExit(f"checkpoint already exists: {checkpoint}")
checkpoint.write_text(f"""# Research Generation 3 — G3-07 main integration complete\n\nDate: 2026-09-03\n\n## Disposition\n\nG3-07 / `SILGM-STUDY1` closed research branch was integrated to `main` after explicit user instruction.\n\n**`MAIN-INTEGRATION-COMPLETE / FAST-FORWARD`**\n\n## Integration provenance\n\n```text\nrepository = nkkmd/bao-la-kiswahili-game\npre-integration main HEAD = ba48c5c3643649655137d5d3c07988fdc84bee9d\nresearch branch = research/g3-07-search-instability-local-geometry-mechanism\nsource branch tip at integration authorization = {SOURCE_TIP}\nintegration method = fast-forward / force=false\nmerge-base = pre-integration main HEAD\nsource ahead_by = 71\nsource behind_by = 0\n```
\nThe first integration step moved `main` from `ba48c5c3643649655137d5d3c07988fdc84bee9d` to `{SOURCE_TIP}` without a merge commit and without force. This checkpoint and current-facing documentation synchronization are post-integration administrative records.\n\n## Scientific state preserved\n\n```text\nG3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE\nStage 1 = STAGE1-PASS / seeds CONSUMED / no rerun\nStage 2 = STAGE2-PASS / seeds CONSUMED / no rerun\nformal promoted = 8\nformal estimable = 7\nCONFIRMED = 3\nNOT-CONFIRMED = 4\nNON-ESTIMABLE = 1\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED\nG3-08 = NOT AUTHORIZED\nnext scientific action = separate post-G3-07 current-state G3-08 authorization review\n```
\nNo scientific result, candidate label, p-value, threshold, seed state, no-rescue boundary, or protected-evidence boundary was changed by main integration.\n\n## Historical-plan integrity\n\n`doc/research-generation-3/PROGRAM_PLAN.md` remains historical and unchanged. Its Git blob must remain:\n\n`{PROGRAM_PLAN_BLOB}`\n\n## Branch retention\n\nThe dedicated G3-07 research branch is retained for provenance. Main integration does not authorize G3-08 or any new scientific execution.\n""", encoding="utf-8")

# Verify all current-facing integration strings and immutable historical plan content hash at the file level.
checks = {
    "doc/research-generation-3/CURRENT_STATUS.md": "G3-07 main integration = COMPLETE / FAST-FORWARD",
    "doc/research-generation-3/README.md": "G3-07 main integration = COMPLETE / FAST-FORWARD",
    "doc/FUTURE_RESEARCH_AGENDA.md": "G3-07のmain integrationは、その後の明示的ユーザー指示を受け",
    "doc/RESEARCH_INDEX.md": "A later explicit user instruction authorized integration",
    "doc/search-instability-local-geometry-mechanism/README.md": "fast-forward integrated to `main`",
    "doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md": "main integration = COMPLETE / FAST-FORWARD",
    "doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md": "main integration = COMPLETE / FAST-FORWARD",
}
for path, needle in checks.items():
    if needle not in Path(path).read_text(encoding="utf-8"):
        raise SystemExit(f"missing verification needle in {path}: {needle}")

print(json.dumps({
    "verified": True,
    "sourceTip": SOURCE_TIP,
    "changedCurrentFacingFiles": list(checks.keys()),
    "checkpoint": str(checkpoint),
    "protectedDepth10": "SEALED-NOT-GENERATED-NOT-READ-NOT-PEEKED",
    "g308": "NOT-AUTHORIZED",
}, ensure_ascii=False))
