#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = root / "doc" / "FUTURE_RESEARCH_AGENDA.md"
text = path.read_text(encoding="utf-8")

old_header = "Research Generation 3: **Active / G3-10 `GCLD-STUDY1` CLOSED `FORMAL-COMPLETE` / C1+C2+C3+C5 `CONFIRMED` / C4 `NOT-CONFIRMED` / protected depth-10 SEALED / post-G3-10 next-study review is separate and NOT AUTO-AUTHORIZED / main integration NOT AUTHORIZED (2026-09-04)**"
new_header = "Research Generation 3: **Active / G3-10 `GCLD-STUDY1` CLOSED `FORMAL-COMPLETE` / main integration COMPLETE FAST-FORWARD / post-G3-10 review = `G3-11-AUTHORIZED` / G3-11 `FDEGHV-STUDY1` PRE-HOLDOUT-FREEZE / protected depth-10 SEALED (2026-09-04)**"

old_body = "main integrationは明示的ユーザー指示があるまで`NOT AUTHORIZED / NOT PERFORMED`。 G3-10 closure後の次Studyは自動authorizeしない。historical program sequenceを参照しつつ、別のpost-G3-10 current-state reviewでdependency・独立性・fresh populationを確認してから判断する。"
new_body = "G3-10のmain integrationは2026-09-04の明示的ユーザー指示に基づく`COMPLETE / FAST-FORWARD / force=false`として完了した。その後のseparate post-G3-10 current-state reviewはoutcome-blindに実施され、`G3-11-AUTHORIZED`を固定した。G3-11 `FDEGHV-STUDY1`はresearch branch上でPRE-HOLDOUT-FREEZEにあり、Stage 0 technical PASS、source/resource/authorization binding、durable leaseが完了するまでprotected depth-10 accessは禁止される。historical `PROGRAM_PLAN.md`は変更しない。"

if text.count(old_header) != 1:
    raise SystemExit("expected exactly one stale RG3 header")
if text.count(old_body) != 1:
    raise SystemExit("expected exactly one stale G3-10 integration paragraph")
text = text.replace(old_header, new_header).replace(old_body, new_body)
path.write_text(text, encoding="utf-8")
print("FDEGHV_PREACCESS_DOC_SYNC=PASS")
