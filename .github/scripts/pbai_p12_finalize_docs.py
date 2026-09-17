from pathlib import Path
import re


def replace_once(path, old, new):
    p = Path(path)
    s = p.read_text(encoding="utf-8")
    if old not in s:
        raise SystemExit(f"expected block not found: {path}")
    if s.count(old) != 1:
        raise SystemExit(f"expected block not unique: {path}: {s.count(old)}")
    p.write_text(s.replace(old, new, 1), encoding="utf-8")


root = "README.md"
replace_once(
    root,
    "**PBAI-P1〜P11は完了済み**です。下表の公開判断は各プログラム終了時点の履歴です。P8・P9の`KEEP-AI-GEN3`の後にhardの正式採用、P11の後にexpertの正式採用・本番組込み・配信確認を行い、現在のAI-GEN4へ至りました。",
    "**PBAI-P1〜P12は完了済み**です。下表の公開判断は各プログラム終了時点の履歴です。P8・P9の`KEEP-AI-GEN3`の後にhardの正式採用、P11の後にexpertの正式採用・本番組込み・配信確認を行い、現在のAI-GEN4へ至りました。P12では新しい探索候補を検証しましたがdevelopment gateを通過せず、不採用としてAI-GEN4を維持しました。",
)
replace_once(
    root,
    "| [PBAI-P11](doc/ai-engineering/public-ai-improvement-program-11/PROGRAM_FINAL_REPORT.md) | 新規seedとGitHub実行基盤でexpertを独立再試験。3設定すべての棋力・運用条件と独立検算を通過 | 後続の実機確認・正式採用・配信確認を経て、hardとともに`AI-GEN4`へ昇格 |",
    "| [PBAI-P11](doc/ai-engineering/public-ai-improvement-program-11/PROGRAM_FINAL_REPORT.md) | 新規seedとGitHub実行基盤でexpertを独立再試験。3設定すべての棋力・運用条件と独立検算を通過 | 後続の実機確認・正式採用・配信確認を経て、hardとともに`AI-GEN4`へ昇格 |\n| [PBAI-P12](doc/ai-engineering/public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md) | `PBAI-C016-v1`としてroot margin probe方式を検証。baseline supportはPASSしたが、`Δ = 16 / 32 / 64`の全候補でeligible局面のnode削減gateを満たさず`DEVELOPMENT-GATE-FAIL` | 不採用・公開変更なし、`KEEP-AI-GEN4` |",
)
replace_once(
    root,
    """### 次期改善候補

[十分良い手を基準にしたマージン制限型選択探索](doc/ai-engineering/NEXT_IMPROVEMENT_CANDIDATE.md)を次期候補として記録しています。2026年9月14日の[事前調査と開始時の引継ぎ](doc/ai-engineering/NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md)では、小規模な計測・検証へ進める価値があると評価しました。現行PVSで残る比較・再探索の費用を先に測る方針で、棋力改善は未確認です。

候補は`CONCEPT-RECORDED / NOT-AUTHORIZED / NOT-IMPLEMENTED`で、正式Program ID・Candidate IDは未発行です。今回の記録は文書整備のみであり、開始認可レビュー、新規計測、実装、対局試験はまだ開始していません。公開AIはAI-GEN4を維持します。""",
    """### 直近の改善候補と結果

[十分良い手を基準にしたマージン制限型選択探索](doc/ai-engineering/NEXT_IMPROVEMENT_CANDIDATE.md)は、2026年9月17日に`PBAI-P12 / PBAI-C016-v1`として実装・development検証まで行いました。事前のbaseline support計測では現行PVSにfull-window再探索コストが十分残っていることを確認しましたが、結果を見る前に固定した`Δ = 16 / 32 / 64`の全候補でeligible局面のnode削減gateを満たしませんでした。

正式な最終判断は`COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4`です。`PBAI-C016-v1`は不採用・閉鎖とし、independent validationとrelease holdoutは未実行のまま保持しました。公開AI、正式release、AI世代に変更はありません。詳細は[P12最終報告](doc/ai-engineering/public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md)を参照してください。""",
)
replace_once(
    root,
    "- [AI開発の中央索引](doc/AI_ENGINEERING_INDEX.md) — P1〜P11の結果と各プログラムへの入口",
    "- [AI開発の中央索引](doc/AI_ENGINEERING_INDEX.md) — P1〜P12の結果と各プログラムへの入口\n- [P12最終報告](doc/ai-engineering/public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md) — `PBAI-C016-v1`のdevelopment gate不通過とAI-GEN4維持の正式記録",
)

candidate = "doc/ai-engineering/NEXT_IMPROVEMENT_CANDIDATE.md"
replace_once(
    candidate,
    """# Bao公開AIの次期改善候補

更新日: 2026-09-14\\
現在の公開AI系統: **`AI-GEN4`**  
状態: **`CONCEPT-RECORDED / NOT-AUTHORIZED / NOT-IMPLEMENTED`**  
正式Program ID: **未発行**  
正式Candidate ID: **未発行**

この文書は、現在の`AI-GEN4`を変更せず、次に検証する価値があるBao AI改善案を工学候補として記録するためのメモである。正式なProgram開始、candidate ID発行、実装、benchmark、公開採用、AI世代昇格を認可する文書ではない。

2026年9月14日に[事前調査と開始時の引継ぎ](NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md)を記録した。結論は「小規模な計測・検証へ進める価値があるが、AI-GEN4を上回る見込みが高いとまでは判断できない」である。現行AIはすでにPVSを使うため、既存方式でも残る比較・再探索の費用を先に測る。実作業を始める際は本書と調査記録を読み、その時点のmainと公開AIを確認してから独立した開始認可レビューを行う。

事前調査の記録とmainへの反映は文書整備のみであり、開始認可レビュー、新規計測、実装、対局試験は未開始のままである。

## 1. 次期改善候補""",
    """# Bao公開AI改善候補 `PBAI-C016-v1` の記録

更新日: 2026-09-17  
現在の公開AI系統: **`AI-GEN4`**  
状態: **`DEVELOPMENT-GATE-FAIL / NOT-ADOPTED / CLOSED`**  
正式Program ID: **`PBAI-P12`**  
正式Candidate ID: **`PBAI-C016-v1`**

この文書は、2026年9月13〜14日に次期改善案として記録した「十分良い手を基準にしたマージン制限型選択探索」の候補設計を、後続の正式検証結果とともに保存する履歴文書である。

2026年9月17日に`PBAI-P12`として開始認可、baseline support計測、候補mechanismの事前固定、development検証まで実施した。baseline supportはPASSしたが、`PBAI-C016-v1`の`Δ = 16 / 32 / 64`はいずれも事前に固定したdevelopment gateを通過しなかった。主因は、rootのwide probe費用が省略できたfull-window再探索の節約量を上回り、eligible局面のnode数を削減できなかったことである。

正式な最終判断は`COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4`である。候補は不採用・閉鎖とし、independent validationとrelease holdoutは実行していない。これは「十分良い手」という一般概念全体を否定する結果ではなく、今回結果を見る前に固定した`PBAI-C016-v1`のroot margin probe方式が採用条件を満たさなかったことを意味する。詳細は[`public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md`](public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md)を参照する。

以下の第2〜8節は、候補開始前に記録した仮説・期待・検証方針を履歴として保持する。結果確認後に当初の仮説やgateを救済的に書き換えない。

## 1. 検証した改善候補""",
)
replace_once(
    candidate,
    """## 9. 現在の境界

2026-09-14時点では、ここまでを**次期改善候補と事前調査の記録**とする。事前調査の実施は、次の開始認可レビューや実験の未開始状態を変更しない。

```text
current public lineage = AI-GEN4
next improvement concept = Good-Enough / Margin-Bounded Selective Search
formal Program ID = NOT-ISSUED
formal Candidate ID = NOT-ISSUED
authorization review = NOT-STARTED
implementation = NOT-STARTED
benchmark = NOT-STARTED
public AI change = NONE
AI generation promotion = NONE
```

この記録だけを根拠に`AI-GEN5`、新しいrelease ID、正式candidate IDを発行しない。次に実作業へ進む場合は、現在のrepository状態と`AI-GEN4` baselineを確認したうえで、独立した認可レビューから開始する。""",
    """## 9. 終了後の境界

2026年9月17日の正式終了後は、次を正本とする。

```text
current public lineage = AI-GEN4
program = PBAI-P12 / COMPLETE
candidate = PBAI-C016-v1 / DEVELOPMENT-GATE-FAIL / NOT-ADOPTED / CLOSED
independent validation = NOT-RUN / NOT-AUTHORIZED
release holdout = NOT-RUN / NOT-AUTHORIZED
public AI change = NONE
AI generation promotion = NONE
```

結果確認後にmargin、gate、population、seed、candidate mechanismを変更して`PBAI-C016-v1`を救済しない。独立validation用seed `121220001..121220064`とrelease holdout `121230001..121230064`はP12では未消費のまま保持した。将来、一般概念を別機構で再検討する場合は、`PBAI-C016-v1`の続行ではなく、新しいcandidateとして独立した認可・事前固定・新規証拠の扱いを定める。""",
)

preflight = "doc/ai-engineering/NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md"
replace_once(
    preflight,
    "- 候補状態: **`CONCEPT-RECORDED / NOT-AUTHORIZED / NOT-IMPLEMENTED`**",
    "- 調査時点の候補状態: **`CONCEPT-RECORDED / NOT-AUTHORIZED / NOT-IMPLEMENTED`**\n- 後続結果: **`PBAI-P12 / PBAI-C016-v1 = DEVELOPMENT-GATE-FAIL / NOT-ADOPTED / CLOSED`**。2026年9月17日にdevelopment検証で終了し、公開AIは`AI-GEN4`を維持。詳細は[`public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md`](public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md)を参照する。",
)

files = [
    Path("README.md"),
    Path("doc/AI_ENGINEERING_INDEX.md"),
    Path("doc/ai-engineering/README.md"),
    Path("doc/ai-engineering/NEXT_IMPROVEMENT_CANDIDATE.md"),
    Path("doc/ai-engineering/NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md"),
] + sorted(Path("doc/ai-engineering/public-ai-improvement-program-12").glob("*.md"))

ja = re.compile(r"[ぁ-んァ-ヶ一-龠々ー]")
link = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
broken = []
bad_headings = []
for p in files:
    text = p.read_text(encoding="utf-8")
    for n, line in enumerate(text.splitlines(), 1):
        if line.startswith("#"):
            h = line.lstrip("#").strip()
            if h and not ja.search(h) and h not in {"Bao la Kiswahili"}:
                bad_headings.append(f"{p}:{n}:{h}")
    for target in link.findall(text):
        if target.startswith(("http://", "https://", "#", "mailto:")):
            continue
        target = target.split("#", 1)[0]
        if target and not (p.parent / target).resolve().exists():
            broken.append(f"{p} -> {target}")

root_text = Path("README.md").read_text(encoding="utf-8")
if "### 次期改善候補" in root_text:
    raise SystemExit("root README still contains stale candidate heading")
index_text = Path("doc/AI_ENGINEERING_INDEX.md").read_text(encoding="utf-8")
for required in ("PBAI-P12", "DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4"):
    if required not in index_text:
        raise SystemExit(f"index missing {required}")
if broken:
    raise SystemExit("broken local links:\n" + "\n".join(broken))
if bad_headings:
    raise SystemExit("English-only human headings:\n" + "\n".join(bad_headings))

print(f"audited_markdown_files={len(files)}")
print("broken_local_links=0")
print("english_only_human_headings=0")
print("PBAI-P12-state=consistent")
