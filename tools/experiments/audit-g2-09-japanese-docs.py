#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUDY = ROOT / "doc/tactical-motif-generalization-counterexample"
EXTRA = [ROOT / "doc/research-program-decisions/2026-08-30-g2-09-tactical-motif-generalization-counterexample-closure.md"]
JP = re.compile(r"[\u3040-\u30ff\u3400-\u9fff]")
LATIN_WORD = re.compile(r"[A-Za-z][A-Za-z0-9_-]*")

# Official/canonical headings may remain English when they are literal titles rather than explanatory headings.
ALLOWED_ENGLISH_HEADINGS = {
    "# Tactical Motif Generalization / Counterexample Study 1",
}

# Exact machine/status/error lines are allowed outside fenced blocks when their role is clearly canonical.
CANONICAL_LINE_PATTERNS = [
    re.compile(r"^[-*]\s+`[^`]+`(?:\s*=\s*`?[^`]+`?)?\.?$"),
    re.compile(r"^[-*]\s+(?:Study ID|Research Generation|baseline|branch|Stage|Study|G2):\s+`.*`.*$"),
    re.compile(r"^\|.*\|$"),
    re.compile(r"^https?://"),
]


def markdown_files():
    files = sorted(STUDY.rglob("*.md"))
    files.extend(p for p in EXTRA if p.exists())
    return files


def is_canonical_line(line):
    if line.startswith("[") and line.endswith(")"):
        return True
    return any(p.search(line) for p in CANONICAL_LINE_PATTERNS)


def audit_file(path):
    violations = []
    in_fence = False
    for lineno, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if line.startswith("```") or line.startswith("~~~~"):
            in_fence = not in_fence
            continue
        if in_fence or not line:
            continue
        if line.startswith("#"):
            if line in ALLOWED_ENGLISH_HEADINGS:
                continue
            if not JP.search(line):
                violations.append({"line": lineno, "kind": "english-only-heading", "text": line})
            continue
        # Link-only navigation and exact canonical/status lines are permitted.
        if is_canonical_line(line):
            continue
        # Human-facing English prose: no Japanese and at least four Latin words.
        words = LATIN_WORD.findall(re.sub(r"`[^`]*`", "", line))
        if not JP.search(line) and len(words) >= 4:
            violations.append({"line": lineno, "kind": "english-only-prose", "text": line})
    return violations


def main():
    report = {}
    for path in markdown_files():
        violations = audit_file(path)
        if violations:
            report[str(path.relative_to(ROOT))] = violations
    result = {
        "schemaVersion": "TMGC_G2_09_JAPANESE_DOC_AUDIT_V1",
        "studyId": "TMGC-STUDY1",
        "filesScanned": len(markdown_files()),
        "filesWithViolations": len(report),
        "violationCount": sum(len(v) for v in report.values()),
        "violations": report,
        "passed": not report,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if report:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
