#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = root / "doc" / "FUTURE_RESEARCH_AGENDA.md"
text = path.read_text(encoding="utf-8")

old_header = "Research Generation 3: **Active / G3-10 `GCLD-STUDY1` CLOSED `FORMAL-COMPLETE` / C1+C2+C3+C5 `CONFIRMED` / C4 `NOT-CONFIRMED` / protected depth-10 SEALED / post-G3-10 next-study review is separate and NOT AUTO-AUTHORIZED / main integration NOT AUTHORIZED (2026-09-04)**"
new_header = "Research Generation 3: **Active / G3-10 `GCLD-STUDY1` CLOSED `FORMAL-COMPLETE` / main integration COMPLETE FAST-FORWARD / post-G3-10 review = `G3-11-AUTHORIZED` / G3-11 `FDEGHV-STUDY1` PRE-HOLDOUT-FREEZE / Stage 0 `STAGE0-PASS` / protected depth-10 SEALED (2026-09-04)**"

marker = "<!-- GCLD-G3-10-CLOSURE:FUTURE -->"
new_paragraph = "G3-10 `GCLD-STUDY1`は`CLOSED / FORMAL-COMPLETE`。formal-eligible `CRCLGR-R1-EXACT-SQUASHED-L1`を用いたfresh Stage 2では48 candidate trajectoryのうち47がresource-eligible、frozen orderの最初の32 trajectoryを測定し、production / independentはexact一致した。5 primary endpointはすべてestimableで、C1 directionality/path efficiency、C2 persistence/lag-distance gradient、C3 return fraction（`ACTUAL-LESS`）、C5 first-order directional path dependenceが`CONFIRMED`、C4 chronology-conditioned circulationは`NOT-CONFIRMED`。これはcausal dynamics、physical hysteresis、strategic regime、human difficulty、game-theoretic valueを確立しない。protected standard-root complete exact depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま。same-evidence rerunは禁止。G3-10のmain integrationは2026-09-04の明示的ユーザー指示に基づく`COMPLETE / FAST-FORWARD / force=false`として完了した。その後のseparate post-G3-10 current-state reviewはoutcome-blindに実施され、`G3-11-AUTHORIZED`を固定した。G3-11 `FDEGHV-STUDY1`はresearch branch上でPRE-HOLDOUT-FREEZEにあり、Stage 0 technical-only validationは`STAGE0-PASS`。Stage 1はsource/resource/authorization bindingとdurable pre-computation leaseが完了するまでprotected depth-10 access禁止。historical `PROGRAM_PLAN.md`は変更しない。"

if old_header in text:
    text = text.replace(old_header, new_header, 1)
elif new_header not in text:
    raise SystemExit("RG3 header is neither expected stale nor expected synchronized form")

if text.count(marker) != 1:
    raise SystemExit("expected exactly one G3-10 closure marker")
pre, post = text.split(marker, 1)
if not post.startswith("\n"):
    raise SystemExit("unexpected G3-10 marker layout")
rest = post[1:]
paragraph, sep, tail = rest.partition("\n\n")
if not sep:
    raise SystemExit("unable to isolate G3-10 closure paragraph")
if not paragraph.startswith("G3-10 `GCLD-STUDY1`は`CLOSED / FORMAL-COMPLETE`。"):
    raise SystemExit("unexpected G3-10 closure paragraph identity")
text = pre + marker + "\n" + new_paragraph + "\n\n" + tail

path.write_text(text, encoding="utf-8")
print("FDEGHV_PREACCESS_DOC_SYNC=PASS")
