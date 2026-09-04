from pathlib import Path

root = Path('.')

def replace_once(path, old, new):
    p = root / path
    text = p.read_text(encoding='utf-8')
    if new in text:
        return
    if text.count(old) != 1:
        raise RuntimeError(f'{path}: expected exactly one occurrence of {old!r}, got {text.count(old)}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')

replace_once(
    'doc/RESEARCH_INDEX.md',
    '### Research Generation 3 current highlight — G3-11 / FDEGHV-STUDY1',
    '### Research Generation 3 formal core Study — G3-11 / FDEGHV-STUDY1'
)
replace_once(
    'doc/RESEARCH_INDEX.md',
    '### Research Generation 3 current highlight — G3-10 / GCLD-STUDY1',
    '### Research Generation 3 formal core Study — G3-10 / GCLD-STUDY1'
)
replace_once(
    'doc/research-generation-3/CURRENT_STATUS.md',
    'Next scientific action = none within LGTGGC-STUDY1; do not rerun Stage 1 evidence or authorize Stage 2; any renewed generalization/counterexample attempt requires a new prospective independent Study/version and separate authorization',
    'Next scientific action = none within Research Generation 3; any new scientific work requires a separate prospective Study/Research Generation and separate authorization; closed G3 evidence must not be rerun or rescued'
)

print('RG3 closure current-label audit fix complete')
