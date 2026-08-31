#!/usr/bin/env python3
from pathlib import Path


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


# README current-facing PSRRE summary.
p = Path('README.md')
text = p.read_text(encoding='utf-8')
marker = '- [`doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md`]'
lines = text.splitlines()
idx = [i for i, line in enumerate(lines) if line.startswith(marker)]
require(len(idx) == 1, f'README PSRRE marker count={len(idx)}')
old = '、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、G2-11は`NOT-AUTHORIZED`。'
new = '、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。G2-11はその後、追加prerequisiteを行わないprogram decisionによりagenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`でformal closure。'
require(old in lines[idx[0]], 'README PSRRE stale state anchor not found')
lines[idx[0]] = lines[idx[0]].replace(old, new, 1)
p.write_text('\n'.join(lines) + ('\n' if text.endswith('\n') else ''), encoding='utf-8')


# RESEARCH_INDEX G2-12 paragraph had an as-of-study G2-11 state phrased as current.
p = Path('doc/RESEARCH_INDEX.md')
text = p.read_text(encoding='utf-8')
old = 'G2-05の`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`とG2-11の`NOT-AUTHORIZED`は不変である。'
new = 'G2-05の`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`は不変である。G2-11はG2-12 closure後のprogram decisionにより、agenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`としてformal closureした。'
require(text.count(old) == 1, f'RESEARCH_INDEX stale G2-11 sentence count={text.count(old)}')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')

print('G2 final current-facing documentation correction prepared successfully')
