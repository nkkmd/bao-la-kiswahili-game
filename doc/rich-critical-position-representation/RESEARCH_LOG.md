# RCPR-STUDY1 — Research Log

## 2026-08-28 — Startup audit and prospective freeze

- Re-fetched remote `main` directly from GitHub.
- Verified full SHA `37480777246aa306c6ca3d0679d936b5e0107071`.
- Verified equality with the expected post-G2-05-hardening SHA supplied at study start.
- Verified zero open pull requests.
- Audited historical G2-01..G2-05 and G2-05 hardening branches against `main`; audited branches were ahead by zero commits and contained no residual unmerged scientific work.
- Read central program state and G2-05 hardening decision.
- Confirmed G2-06 start conditions were satisfied.
- Created `research/g2-06-rich-critical-position-representation` directly from the verified baseline SHA.
- Froze `RCPR-STUDY1` and Stage IDs before any G2-06 scientific outcome generation.
- Froze RAW scientific identity and `validated transform set = []`.
- Froze A/B/C/D leakage classes and the eight prospectively declared representation families.
- Froze no-rescue, Stage transition, independent-verification and interpretation boundaries.

Scientific outcome generated: **none**.

## 2026-08-28 — Stage 0 source audit

Historical Critical Positions reproducibility material was inspected strictly as method/technical reference.

Relevant historical primitives identified:

```text
public/engine.js
public/ai.js
public/ai-weights.js
tools/experiments/lib/position-complexity-search-diagnostic.js
tools/experiments/lib/critical-positions-outcome-branching.js
tools/experiments/lib/tactical-motif-features.js
tools/experiments/lib/position-typology-features.js
```

Important identity finding:

`position-typology-features.js::identityKeys()` computes both a direct `ruleStateKey` and a seat-swapped canonical key using `mirrorState()`.

Disposition:

- do not use that helper as RCPR scientific identity;
- implement a dedicated RAW-only serializer/keyer;
- retain `public/engine.js` as the shared authoritative rule primitive;
- permit search code only under an explicitly frozen search profile;
- do not read historical CPOB Stage 1 corpus, selected-root payloads, measurements or discovery audit in the RCPR development/formal pipeline.

Scientific outcome generated: **none**.
