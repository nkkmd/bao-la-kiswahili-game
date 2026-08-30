#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AGENDA = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
INDEX = ROOT / "doc/RESEARCH_INDEX.md"
PROGRAM = ROOT / "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"

SECTION_TITLE = "#### Pre-G2-11 prerequisite — new prospective strategic representation Study"
SELECTION_DOC = "research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


# FUTURE_RESEARCH_AGENDA: place the prerequisite immediately before G2-11.
agenda = read(AGENDA)
if SECTION_TITLE not in agenda:
    anchor = "#### G2-11 — Long-Horizon Strategic Transition Structure Study 1\n"
    if agenda.count(anchor) != 1:
        raise SystemExit(f"agenda G2-11 anchor count = {agenda.count(anchor)}")
    section = f'''{SECTION_TITLE}\n\n**状態:** **selected next research direction / formal Study ID・最終題目・Stage IDは未固定 / scientific outcome generation未承認**\n\nG2-10 `UMSSR-STUDY1`は`selectedRepresentation = null`で閉じ、G2-11へ渡せるvalidated / frozen representationを生成しなかった。この結果を受け、G2-11を直接開始するのではなく、G2-10とは別のfresh prospective independent Studyとしてstrategic-state / regime representationを新規構築し、そのdownstream eligibilityを検証する。\n\nこのprerequisite Studyは`G2-10`の40-feature dictionary、deterministic K-means `K=2..6`、support / silhouette / five-fold assignment stability threshold、candidate-K result、Stage 1 seed blockを変更・再解析・救済するものではない。G2-10のnegative development resultとStudy closureはimmutableに保持する。\n\nまた、このprerequisiteは新しい`G2-xx` agenda labelを追加するものではない。Research Generation 2のcore label `G2-01..G2-12`は維持し、正式Study ID、最終題目、directory、Stage構成、Stage ID、population、representation family、eligibility gate、seed block、authorization ruleは、新しいチャットでその時点のremote `main`と命名規則を再監査した後にprospectively固定する。\n\nPrerequisite Studyのprimary scientific questionは**representation eligibility**であり、transition matrix、long-horizon persistence / recurrence、bottleneck / transient structure、trajectory family、transition asymmetry等のG2-11 outcomeをrepresentation選択に使用しない。G2-11は、新Studyがprospectively frozen gateを通過してeligible frozen representationを生成した場合にのみ、そのrepresentationをcandidate inputとして別途開始できる。\n\n**Program selection decision:** [`{SELECTION_DOC}`]({SELECTION_DOC})\n\n**Priority:** P0 prerequisite before G2-11\n\n'''
    agenda = agenda.replace(anchor, section + anchor, 1)
    write(AGENDA, agenda)

# RESEARCH_INDEX: expose the selected next direction at the future-research entry point.
index = read(INDEX)
marker = "**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite"
if marker not in index:
    anchor = "## 将来研究\n\n"
    if index.count(anchor) != 1:
        raise SystemExit(f"index future-research anchor count = {index.count(anchor)}")
    note = f'''## 将来研究\n\n{marker}\n\n`G2-10 / UMSSR-STUDY1`はeligible frozen representationを生成せず閉じたため、`G2-11`を直接開始しない。次はG2-10を救済・再定義しない**新しいprospective independent strategic-representation prerequisite Study**を実施し、G2-11へ入力可能なrepresentation eligibilityをfresh evidenceで検証する。正式Study ID・最終題目・Stage構成は研究開始時にcurrent remote `main`を再監査して固定する。詳細は[`{SELECTION_DOC}`]({SELECTION_DOC})を参照。\n\n'''
    index = index.replace(anchor, note, 1)
    write(INDEX, index)

# Program decision: append the sequencing decision without altering fixed G2 labels.
program = read(PROGRAM)
heading = "## 2026-08-30 — Pre-G2-11 strategic representation prerequisite selection"
if heading not in program:
    addition = f'''\n\n{heading}\n\n`G2-10 / UMSSR-STUDY1`はprospectively fixed Stage 1 development contractを正常に完遂したが、`K=2..6`の全candidateがfrozen promotion criteriaを満たさず、`selectedRepresentation = null`で閉じた。Study formal decisionとStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`であり、G2-11 candidate inputは未承認である。\n\nProgram sequencingとして、G2-11を直接開始せず、その前に**new prospective independent strategic-representation prerequisite Study**を置くことを選択した。これはG2-10のthreshold relaxation、K range変更、feature/axis replacement、favorable subgroup、same-block rerun等による救済ではない。\n\nこのprerequisite Studyは新しい`G2-xx` sequence labelを追加しない。`G2-01..G2-12`のprogram shapeは維持する。正式Study ID、最終題目、Stage IDs、population、representation family、eligibility thresholds、decision taxonomy、seed blocks、authorization protocolは次Study開始時にcurrent remote `main`とrepository naming rulesを監査したうえでprospectively固定する。\n\nG2-11のlong-horizon transition outcomeはprerequisite Studyのrepresentation選択に利用してはならない。Prerequisite Studyが自身のfrozen eligibility gateをPASSした場合にのみ、得られたfrozen representationをG2-11 candidate inputとして別途評価できる。\n\nSelection record: `doc/{SELECTION_DOC}`.\n'''
    program += addition
    write(PROGRAM, program)

print("pre-G2-11 prerequisite central documentation materialized")
