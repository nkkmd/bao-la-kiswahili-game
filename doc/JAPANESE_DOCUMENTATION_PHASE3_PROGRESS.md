# 第3段階：詳細な人間向け研究文書の整備状況

状態: **整備・検証・`main`統合完了**  
作業開始時の`main`: `426518850d5a794f6a43603b600a3a3756b41cd9`  
作業ブランチ: `docs/japanese-human-docs-phase3`  
PR: [#101](https://github.com/nkkmd/bao-la-kiswahili-game/pull/101)  
`main`統合コミット: `68159b1dcdf1c9e0042b5933e4f88aca5dcec995`

## 目的

第2段階で整備した各研究の入口`README.md`に続き、その先にある詳細な人間向け文書を、研究上の固定情報を変えずに日本語で読みやすくする。

## 対象

中央研究索引に掲載された42研究について、主に次の文書を監査する。

- 初見向け概要（`STUDY_*_OVERVIEW.md`）
- 最終報告（`STUDY_*_FINAL_REPORT.md`）
- 現在状態（`CURRENT_STATUS.md`）
- 再現性索引（`REPRODUCIBILITY_INDEX.md`）
- 研究ログ（`RESEARCH_LOG.md`）
- 再開文書（`RESUME_HERE.md`）
- 同じ役割を持つ人間向け結果・結論文書

棚卸し時点では42研究、187文書が候補となった。すでに日本語品質を満たす文書は変更せず、英語だけの見出し・通常説明文が残る文書を優先して整備する。

## 対象外

次は翻訳だけを目的として変更しない。

- preregistration、authorization artifact、result JSON、schema
- hash対象の固定成果物、source manifest、workflow provenance
- historical checkpoint、immutable decision record
- exact command、exact stdout / stderr
- Study ID、Stage ID、decision token、seed、threshold、gate、endpoint、population、hash、SHA

## 作業単位

| 作業単位 | 状態 | 備考 |
| --- | --- | --- |
| 棚卸しと対象境界の固定 | 完了 | 42研究・187候補文書 |
| Research Generation 3の詳細文書 | 完了 | 15 Studyの主要詳細文書を横断監査済み |
| Research Generation 2の詳細文書 | 完了 | 12 Study・67文書を横断監査済み |
| Research Generation 1の詳細文書 | 完了 | 現行文書を整備し、固定英語原文の例外を明示 |
| 全体検証 | 完了 | 164変更文書、相対リンク、exact block、関連testを確認 |
| PR作成・`main`統合 | 完了 | PR #101を`main`へ統合済み。統合コミットは`68159b1dcdf1c9e0042b5933e4f88aca5dcec995` |

## 完了した小単位

| 研究 | 整備した文書 | 状態 |
| --- | --- | --- |
| `G3-12` / `LGTGGC-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-11` / `FDEGHV-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-10` / `GCLD-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| G3-09後の前提Study / `CRCLGR-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| G3-09後の前提Study / `RRCLGR-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-09` / `CLGR-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-08` / `LGPML-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-07` / `SILGM-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-06` / `BRMGI-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-05` / `BECT-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-04` / `SFCDF-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-03` / `TCTGD-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-02` / `EBRWS-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| G3-01後の前提Study / `LGTGMIV-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G3-01` / `LGTGMF-STUDY1` | `CURRENT_STATUS.md`、`STUDY_1_OVERVIEW.md`、`STUDY_1_FINAL_REPORT.md`、`REPRODUCIBILITY_INDEX.md` | 完了 |
| `G2-01..G2-05` | 各Studyの概要・最終報告・現在状態・再現性索引・研究ログ、計25文書 | 完了 |
| `G2-06..G2-10` | 各Studyの主要詳細文書、計30文書 | 完了 |
| G2-10後の前提Study / `PSRRE-STUDY1` | 主要詳細文書6件 | 完了 |
| `G2-12` / `SSGTGE-STUDY1` | 主要詳細文書6件。英語本文が残っていた状態・再現・研究ログ・再開文書を重点整備 | 完了 |
| Research Generation 1の14 Study | Overview、Final Report、Current Status、Reproducibility Index等56文書 | 完了 |
| 定石研究 | 第一次研究の結論と関連詳細文書30件 | 完了 |
| 先攻・後攻差 | `FIRST_PLAYER_ADVANTAGE_RESEARCH.md` | 監査のみ・変更不要 |

## Research Generation 1の固定英語原文

第一世代のStudy closure文書には、現在の言語品質方針より前に統合され、科学的・実行上のprovenanceとして固定された英語原文がある。これらは`DOCUMENTATION_LANGUAGE_POLICY.md`と`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`のimmutable record例外に従い、通常本文を一括置換しない。

- append-onlyの`RESEARCH_LOG.md`は変更対象から除外した。
- Final Reportには日本語の結論と解釈境界を先頭に追加した。
- Current Status、Reproducibility Index、Resume文書では、日本語の要点と原文保持理由を明示した。
- 人間向け見出しは日本語の説明を補い、canonical ID、token、数値、seed、hash、pathは変更していない。
- 初見向けの現行説明は、各Studyの`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

## 将来文書へ継承する基準

この整備で到達した品質を、今後新規作成・更新する人間向け文書の最低基準とする。適用規則は次の文書に恒久化する。

- [`../AGENTS.md`](../AGENTS.md)
- [`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md)
- [`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)

今後の文書は、初稿から日本語で目的・状態・結論・判断理由・意味・限界・読む順序を追えるようにする。英語だけの人間向け見出し、説明のない英語完全文、壊れた相対リンク、意図しないfenced code blockまたはcanonical情報の変更を残したままclosureや`main`統合へ進めない。

immutable record等の正当な英語残存は原文を保持するが、その役割、意味、例外理由を周囲の人間向け文書で日本語説明する。将来の文書品質をこの整備以前の状態へ戻してはならない。

## 再開手順

1. この文書を読む。
2. `git status --short --branch`で現在のブランチと既存JSON変更2件を確認する。
3. 表の最初の「作業中」または「未着手」の単位から再開する。
4. 変更対象をMarkdownに限定し、既存JSON変更をstageしない。
5. 各作業単位の完了後に、この表を更新して文書だけをコミットする。

## 不変条件

- 日本語化によって科学的判断を変更しない。
- `NON-ESTIMABLE`、`INCONCLUSIVE`、`NOT-CONFIRMED`、`TECHNICAL-INVALID`を相互に読み替えない。
- production-onlyをverifiedへ、descriptiveをformalへ昇格しない。
- `NOT-AUTHORIZED-NOT-EXECUTED`を失敗した実行として説明しない。
- 公開AIの変更や新しい研究実行を承認しない。

## 最終検証

| 検証項目 | 結果 |
| --- | --- |
| 変更対象 | Markdown 164文書のみ |
| 英語だけの人間向け見出し | 0件 |
| 例外説明のない英語完全文 | 0件 |
| Research Generation 1の固定英語原文 | 692文。immutable record例外を各文書と本台帳に明示 |
| 壊れた相対Markdown link | 0件 |
| fenced code blockの変更 | 0件 |
| `git diff --check` | PASS |
| 関連closure / policy test | 4件PASS |

実行した関連test:

- `node test/drsse-study1-closure.test.js`
- `node test/practical-comeback-closure-consistency.test.js`
- `node test/public-ai-improvement-program1-contract.test.js`
- `node test/raw-enumeration-hardening-policy.test.js`
