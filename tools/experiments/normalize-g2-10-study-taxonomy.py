#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUDY = ROOT / "doc/unified-multiaxial-strategic-state-representation"
STAGE1 = "STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION"
STUDY_DECISION = "NOT-AUTHORIZED-NOT-EXECUTED"

IMMUTABLE = {
    "results/STAGE_1_DEVELOPMENT_RESULT.json": "21fb4cd60dbaa6761b177ad54cda5dd33c942ba3994a953ce5486917f0e440fd",
    "results/STAGE_1_CONSUMPTION_RECORD.json": "c6f95fd2bab4c21fd4b99ee6a69590861a907a001e87e0d63e3af72a7661f522",
    "results/STAGE_1_FINAL_EXACT_COMPARISON.json": "6746eb5d5213d278a7991b6613a0ebf95ed621cc1759d1128f164337583785fb",
    "results/STAGE_1_HASH_MANIFEST.json": "9010f53c676b5e588e8e4553acd6ec680bd6ca366f31a68a6f53dbe8de90c823",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def write(rel: str, text: str) -> None:
    (ROOT / rel).write_text(text, encoding="utf-8")


def replace_once(rel: str, old: str, new: str) -> None:
    text = read(rel)
    if old in text:
        if text.count(old) != 1:
            raise SystemExit(f"{rel}: expected one old taxonomy anchor, found {text.count(old)}")
        text = text.replace(old, new, 1)
        write(rel, text)
        return
    if new in text:
        return
    raise SystemExit(f"{rel}: neither old nor normalized taxonomy anchor found")


# Immutable accepted scientific artifacts must remain byte-identical.
for rel, expected in IMMUTABLE.items():
    actual = sha256(STUDY / rel)
    if actual != expected:
        raise SystemExit(f"immutable accepted artifact mismatch {rel}: {actual}")

protocol = read("doc/unified-multiaxial-strategic-state-representation/STUDY_1_PROTOCOL.md")
for token in ["### Stage 2 / Study", STAGE1, STUDY_DECISION]:
    if token not in protocol:
        raise SystemExit(f"frozen protocol taxonomy anchor missing: {token}")

# Machine-readable closure summary: separate Stage 1 disposition from Study-level token.
final_path = STUDY / "results/STUDY_1_FINAL_RESULT.json"
final = json.loads(final_path.read_text(encoding="utf-8"))
if final["stages"]["stage1"]["disposition"] != STAGE1:
    raise SystemExit("Stage 1 disposition changed unexpectedly")
if final["stages"]["stage2"]["disposition"] != STUDY_DECISION:
    raise SystemExit("Stage 2 disposition changed unexpectedly")
if final.get("formalStudyDecision") == STAGE1:
    final["formalStudyDecision"] = STUDY_DECISION
elif final.get("formalStudyDecision") != STUDY_DECISION:
    raise SystemExit(f"unexpected formalStudyDecision: {final.get('formalStudyDecision')}")
final["stage1DevelopmentDisposition"] = STAGE1
final_path.write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# Root entry: make Study-level token explicit without changing the scientific result.
replace_once(
    "README.md",
    f"、`{STAGE1}`でclosed。Stage 2は`{STUDY_DECISION}`、reserved Stage 2 seedsは未消費で",
    f"、Stage 1は`{STAGE1}`でclosed。Study formal decisionは`{STUDY_DECISION}`。Stage 2は`{STUDY_DECISION}`、reserved Stage 2 seedsは未消費で",
)

# Study-local entry points.
for rel in [
    "doc/unified-multiaxial-strategic-state-representation/README.md",
    "doc/unified-multiaxial-strategic-state-representation/CURRENT_STATUS.md",
    "doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md",
    "doc/unified-multiaxial-strategic-state-representation/RESUME_HERE.md",
]:
    replace_once(rel, f"Study formal decision = {STAGE1}", f"Study formal decision = {STUDY_DECISION}")

replace_once(
    "doc/unified-multiaxial-strategic-state-representation/REPRODUCIBILITY_INDEX.md",
    f"Stage 2 = {STUDY_DECISION}\nStudy = {STAGE1}",
    f"Stage 2 = {STUDY_DECISION}\nStudy = {STUDY_DECISION}",
)
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/results/README.md",
    f"Study final decision = {STAGE1}",
    f"Study final decision = {STUDY_DECISION}",
)
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/RESEARCH_LOG.md",
    f"Study = {STAGE1}\nStage 2 = {STUDY_DECISION}",
    f"Stage 1 = {STAGE1}\nStage 2 = {STUDY_DECISION}\nStudy = {STUDY_DECISION}",
)
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/authorizations/README.md",
    f"Stage 1 result = {STAGE1}\nStage 2 = {STUDY_DECISION}",
    f"Stage 1 result = {STAGE1}\nStage 2 = {STUDY_DECISION}\nStudy formal decision = {STUDY_DECISION}",
)

# Final report: distinguish development disposition from Study-level terminal decision.
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md",
    f"正式判断: **`{STAGE1}`**",
    f"Study-level正式判断: **`{STUDY_DECISION}`**\nStage 1 development disposition: **`{STAGE1}`**",
)
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md",
    f"Study 1の正式判断は:\n\n```text\n{STAGE1}\n```\n\nである。",
    f"Stage 1 development dispositionは:\n\n```text\n{STAGE1}\n```\n\nである。Study-level formal decisionは、凍結protocol §13の`Stage 2 / Study` vocabularyに従い:\n\n```text\n{STUDY_DECISION}\n```\n\nである。",
)

# Decision register: correct D-032 and retain an explicit audit trail.
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md",
    "Study 1のformal decisionは、prospectively fixed Stage 1 terminal tokenをそのまま使用する。",
    "Stage 1 development dispositionとStudy-level formal decisionを、凍結protocol §13のそれぞれのvocabularyに従って分離する。",
)
replace_once(
    "doc/unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md",
    f"Study = {STAGE1}\nvalidated strategic representation = false",
    f"Stage 1 = {STAGE1}\nStage 2 = {STUDY_DECISION}\nStudy = {STUDY_DECISION}\nvalidated strategic representation = false",
)
decision_rel = "doc/unified-multiaxial-strategic-state-representation/DECISION_REGISTER.md"
decision_text = read(decision_rel)
if "## D-033 — final documentation taxonomy normalization" not in decision_text:
    decision_text += f'''\n\n## D-033 — final documentation taxonomy normalization\n\n最終文書監査で、closure文書の一部がStage 1 disposition `{STAGE1}`をStudy-level formal decisionとしても記載していたことを検出した。凍結protocol §13はStage 1 vocabularyと`Stage 2 / Study` vocabularyを分離しているため、Study-level tokenだけを次へ正規化する。\n\n```text\nStage 1 = {STAGE1}\nStage 2 = {STUDY_DECISION}\nStudy = {STUDY_DECISION}\n```\n\nこれはscientific resultの再判定ではない。accepted Stage 1 artifact、seed consumption、feature、K候補、threshold、promotion rule、Stage 2 non-authorization、G2-11 boundaryは一切変更していない。\n\nStatus: **DOCUMENTATION-TAXONOMY-NORMALIZED / SCIENTIFIC-RESULT-UNCHANGED**.\n'''
    write(decision_rel, decision_text)

# Reproducibility index points to the normalization checkpoint.
repro_rel = "doc/unified-multiaxial-strategic-state-representation/REPRODUCIBILITY_INDEX.md"
repro = read(repro_rel)
checkpoint_line = "- `checkpoints/2026-08-30-final-documentation-taxonomy-normalization.md`\n"
if checkpoint_line not in repro:
    anchor = "- `checkpoints/2026-08-30-stage1-scientific-no-representation-closure.md`\n"
    if anchor not in repro:
        raise SystemExit("REPRODUCIBILITY_INDEX normalization checkpoint anchor missing")
    repro = repro.replace(anchor, anchor + checkpoint_line, 1)
    write(repro_rel, repro)

# Research log records the documentation-only correction.
log_rel = "doc/unified-multiaxial-strategic-state-representation/RESEARCH_LOG.md"
log = read(log_rel)
if "## 2026-08-30 — final documentation taxonomy normalization" not in log:
    log += f'''\n\n## 2026-08-30 — final documentation taxonomy normalization\n\n最終関連文書監査で、Stage 1 dispositionとStudy-level terminal tokenの表記混同を検出した。凍結protocol §13に従い、科学結果を変更せず次のように分離した。\n\n```text\nStage 1 = {STAGE1}\nStage 2 = {STUDY_DECISION}\nStudy = {STUDY_DECISION}\n```\n\naccepted Stage 1 artifact、preregistration、seed、threshold、K結果は変更していない。\n'''
    write(log_rel, log)

# Central research index and agenda.
replace_once(
    "doc/RESEARCH_INDEX.md",
    f"**状態:** **Study closed / formal decision `{STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
    f"**状態:** **Study closed / formal decision `{STUDY_DECISION}` / Stage 1 `{STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
)
replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    f"**状態:** **完了 / `UMSSR-STUDY1 = {STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
    f"**状態:** **完了 / `UMSSR-STUDY1 = {STUDY_DECISION}` / Stage 1 `{STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
)
replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    f"Stage 1 = {STAGE1}\nselectedRepresentation = null\nStage 2 = {STUDY_DECISION}\nStage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED",
    f"Stage 1 = {STAGE1}\nselectedRepresentation = null\nStage 2 = {STUDY_DECISION}\nStudy formal decision = {STUDY_DECISION}\nStage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED",
)
replace_once(
    "doc/FUTURE_RESEARCH_AGENDA.md",
    f"`G2-10`はscientific readiness、resource gate、production / independent exact verificationをPASSした一方、prospectively fixed `K=2..6`の全候補がpromotion criterionを満たさず`{STAGE1}`で閉じ、Stage 2は`{STUDY_DECISION}`、Stage 2 seedsは未消費である。",
    f"`G2-10`はscientific readiness、resource gate、production / independent exact verificationをPASSした一方、prospectively fixed `K=2..6`の全候補がpromotion criterionを満たさずStage 1を`{STAGE1}`で閉じ、Study formal decisionとStage 2は`{STUDY_DECISION}`、Stage 2 seedsは未消費である。",
)

# Future central-doc materialization must not reintroduce the taxonomy error.
mat_rel = "tools/experiments/materialize-g2-10-closure-docs.py"
replace_once(
    mat_rel,
    f"、`{STAGE1}`でclosed。Stage 2は`{STUDY_DECISION}`、reserved Stage 2 seedsは未消費で",
    f"、Stage 1は`{STAGE1}`でclosed。Study formal decisionは`{STUDY_DECISION}`。Stage 2は`{STUDY_DECISION}`、reserved Stage 2 seedsは未消費で",
)
replace_once(
    mat_rel,
    f"**状態:** **Study closed / formal decision `{STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
    f"**状態:** **Study closed / formal decision `{STUDY_DECISION}` / Stage 1 `{STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
)
replace_once(
    mat_rel,
    f"**状態:** **完了 / `UMSSR-STUDY1 = {STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
    f"**状態:** **完了 / `UMSSR-STUDY1 = {STUDY_DECISION}` / Stage 1 `{STAGE1}` / Stage 2 `{STUDY_DECISION}`**",
)
replace_once(
    mat_rel,
    f"Stage 1 = {STAGE1}\nselectedRepresentation = null\nStage 2 = {STUDY_DECISION}\nStage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED",
    f"Stage 1 = {STAGE1}\nselectedRepresentation = null\nStage 2 = {STUDY_DECISION}\nStudy formal decision = {STUDY_DECISION}\nStage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED",
)
replace_once(
    mat_rel,
    f"`G2-10`はscientific readiness、resource gate、production / independent exact verificationをPASSした一方、prospectively fixed `K=2..6`の全候補がpromotion criterionを満たさず`{STAGE1}`で閉じ、Stage 2は`{STUDY_DECISION}`、Stage 2 seedsは未消費である。",
    f"`G2-10`はscientific readiness、resource gate、production / independent exact verificationをPASSした一方、prospectively fixed `K=2..6`の全候補がpromotion criterionを満たさずStage 1を`{STAGE1}`で閉じ、Study formal decisionとStage 2は`{STUDY_DECISION}`、Stage 2 seedsは未消費である。",
)

# Closure audit must enforce the separated taxonomy.
audit_rel = "tools/experiments/audit-g2-10-closure.py"
audit = read(audit_rel)
audit = audit.replace(f'FINAL_TOKEN = "{STAGE1}"\nSTAGE2_TOKEN = "{STUDY_DECISION}"', f'STAGE1_TOKEN = "{STAGE1}"\nSTUDY_TOKEN = "{STUDY_DECISION}"')
audit = audit.replace('stage1["disposition"] == FINAL_TOKEN', 'stage1["disposition"] == STAGE1_TOKEN')
audit = audit.replace('final["formalStudyDecision"] == FINAL_TOKEN', 'final["formalStudyDecision"] == STUDY_TOKEN')
audit = audit.replace('final["stages"]["stage2"]["disposition"] == STAGE2_TOKEN', 'final["stages"]["stage2"]["disposition"] == STUDY_TOKEN')
audit = audit.replace('require(FINAL_TOKEN in text, f"final token missing from {rel}")\n    require(STAGE2_TOKEN in text, f"Stage 2 token missing from {rel}")', 'require(STAGE1_TOKEN in text, f"Stage 1 token missing from {rel}")\n    require(STUDY_TOKEN in text, f"Study/Stage 2 token missing from {rel}")')
audit = audit.replace('require(FINAL_TOKEN in text, f"final token missing from {name}")', 'require(STAGE1_TOKEN in text, f"Stage 1 token missing from {name}")\n    require(STUDY_TOKEN in text, f"Study token missing from {name}")')
audit = audit.replace('"formalDecision": FINAL_TOKEN,\n    "stage2": STAGE2_TOKEN,', '"formalDecision": STUDY_TOKEN,\n    "stage1Disposition": STAGE1_TOKEN,\n    "stage2": STUDY_TOKEN,')
if "FINAL_TOKEN" in audit or "STAGE2_TOKEN" in audit:
    raise SystemExit("audit taxonomy replacement incomplete")
protocol_guard = 'protocol = (STUDY / "STUDY_1_PROTOCOL.md").read_text(encoding="utf-8")\nrequire("### Stage 2 / Study" in protocol and STUDY_TOKEN in protocol and STAGE1_TOKEN in protocol, "frozen protocol taxonomy mismatch")\n\n'
needle = '# Every machine-readable JSON in the Study directory must parse.\n'
if protocol_guard not in audit:
    if needle not in audit:
        raise SystemExit("audit protocol guard anchor missing")
    audit = audit.replace(needle, protocol_guard + needle, 1)
write(audit_rel, audit)

# Canonical documentation-only correction checkpoint.
checkpoint = STUDY / "checkpoints/2026-08-30-final-documentation-taxonomy-normalization.md"
checkpoint.write_text(f'''# UMSSR-STUDY1 — 最終文書taxonomy正規化\n\n日付: 2026-08-30\n状態: **DOCUMENTATION-TAXONOMY-NORMALIZED / SCIENTIFIC-RESULT-UNCHANGED**\n\n## 検出事項\n\n最終関連文書監査で、Stage 1の正式development disposition `{STAGE1}`を、一部closure文書がStudy-level formal decisionとしても記載していた。\n\n凍結済み`STUDY_1_PROTOCOL.md` §13では、Stage 1 vocabularyと`Stage 2 / Study` vocabularyを明示的に分離している。Stage 1ではeligible representationが0だったためStage 2 prerequisiteを満たさず、Stage 2は`{STUDY_DECISION}`である。\n\n## 正規化後\n\n```text\nStage 1 = {STAGE1}\nStage 2 = {STUDY_DECISION}\nStudy formal decision = {STUDY_DECISION}\nselectedRepresentation = null\nStage 1 seeds = CONSUMED\nStage 2 seeds = RESERVED / UNCONSUMED\n```\n\n## 科学的非変更事項\n\n次は変更していない。\n\n- accepted Stage 1 scientific artifact\n- Stage 1 seed consumption\n- 40-feature dictionary / active feature set\n- deterministic K-means `K=2..6`\n- support / silhouette / stability threshold\n- candidate K metrics\n- production / independent exact verification\n- Stage 2 non-authorization\n- G2-11 candidate-input prohibition\n- no-rescue rule\n\nこの正規化はscientific resultの再判定ではなく、凍結済みdecision taxonomyへclosure文書を整合させるdocumentation-only correctionである。\n''', encoding="utf-8")

# Re-check immutable accepted artifacts after all documentation edits.
for rel, expected in IMMUTABLE.items():
    actual = sha256(STUDY / rel)
    if actual != expected:
        raise SystemExit(f"immutable accepted artifact changed during normalization {rel}: {actual}")

print(json.dumps({
    "studyId": "UMSSR-STUDY1",
    "stage1Disposition": STAGE1,
    "formalStudyDecision": STUDY_DECISION,
    "scientificResultChanged": False,
    "immutableAcceptedArtifactsVerified": True,
}, ensure_ascii=False, indent=2))
