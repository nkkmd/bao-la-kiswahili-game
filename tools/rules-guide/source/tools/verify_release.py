"""Check repository references and numbering; does not certify Bao rules or a release.

Run from any directory: python3 tools/verify_release.py
Uses the standard library. External URL availability and rendered layout need review.
"""

import json
from pathlib import Path
import re
import unicodedata
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]


def anchors(text):
    result, duplicates = set(), {}
    for heading in re.findall(r"^#{1,6}\s+(.+)$", text, re.M):
        heading = re.sub(r"<[^>]*>", "", heading).strip().lower()
        slug = "".join(c for c in heading if c in "_- " or
                       unicodedata.category(c)[0] in "LN").replace(" ", "-")
        count = duplicates.get(slug, 0)
        duplicates[slug] = count + 1
        result.add(slug if count == 0 else f"{slug}-{count}")
    return result


def verify():
    errors, links, image_links = [], 0, 0
    documents = sorted(ROOT.rglob("*.md"))
    documents = [p for p in documents if ".git" not in p.parts]
    for path in documents:
        text = path.read_text()
        for image, destination in re.findall(r"(!?)\[[^\]\n]*\]\(([^)\n]+)\)", text):
            url = urlsplit(destination)
            if url.scheme or url.netloc:
                continue
            links += 1
            image_links += bool(image)
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            if not target.is_relative_to(ROOT) or not target.is_file():
                errors.append(f"{path.relative_to(ROOT)}: missing {destination}")
            elif url.fragment and target.suffix == ".md":
                if unquote(url.fragment) not in anchors(target.read_text()):
                    errors.append(f"{path.relative_to(ROOT)}: missing anchor {destination}")
            if image and not re.search(r"!\[[^\]\n]+\]\(" + re.escape(destination) + r"\)", text):
                errors.append(f"{path.relative_to(ROOT)}: empty image alternative text")

    sequences = {
        "FAQ": (ROOT / "guide/13-faq.md", r"^### Q(\d+)\.", 50),
        "examples": (ROOT / "guide/examples/README.md", r"^### E(\d+):", 32),
    }
    for name, (path, pattern, count) in sequences.items():
        numbers = [int(n) for n in re.findall(pattern, path.read_text(), re.M)]
        if numbers != list(range(1, count + 1)):
            errors.append(f"{name}: numbering differs from 1..{count}")
    chapters = sorted(int(p.name[:2]) for p in (ROOT / "guide").glob("[0-9][0-9]-*.md"))
    if chapters != list(range(14)):
        errors.append("chapters: numbering differs from 00..13")
    glossary_count = len(re.findall(r"^### ", (ROOT / "guide/04-glossary.md").read_text(), re.M))
    if glossary_count != 40:
        errors.append(f"glossary: {glossary_count} entries, expected 40")

    figures = sorted((ROOT / "assets/images").glob("*.svg"))
    catalog = (ROOT / "docs/figures/FIGURE_CATALOG.md").read_text()
    guide_text = "\n".join(p.read_text() for p in (ROOT / "guide").rglob("*.md"))
    for path in figures:
        root = ET.parse(path).getroot()
        ids = {node.get("id"): node for node in root.iter() if node.get("id")}
        labels = root.get("aria-labelledby", "").split()
        if not labels or any(label not in ids or not ids[label].text for label in labels):
            errors.append(f"{path.name}: missing accessible title/description")
        if path.name not in guide_text or path.name not in catalog:
            errors.append(f"{path.name}: missing guide reference or catalog entry")
    return {"status": "FAIL" if errors else "PASS", "markdown_files": len(documents),
            "local_links": links, "image_links": image_links, "svg_figures": len(figures),
            "FAQ": 50, "examples": 32, "glossary": glossary_count, "errors": errors}


if __name__ == "__main__":
    result = verify()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(bool(result["errors"]))
