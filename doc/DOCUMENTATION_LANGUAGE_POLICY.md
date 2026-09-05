# 文書言語・用語表記方針

Status: **ACTIVE POLICY**  
適用範囲: Bao研究文書、AI Engineering文書、中央索引、今後新規作成する人間向けMarkdown文書  
制定日: 2026-08-29  
強化日: 2026-08-30  
基準品質固定日: 2026-09-05

## 1. 目的

本リポジトリの研究・AI Engineering文書は、**人間向け説明の主言語を日本語とする**。

Research Generation 1および日本語整備後のResearch Generation 2文書で確立したスタイルを基準とし、研究上・工学上の厳密性を損なわない範囲で、問い、設計、結果、解釈、限界、運用状態を自然な日本語で説明する。

この方針は翻訳のために既存の科学的判断、工学的判断、事前登録、閾値、分類器、endpoint、population、representation boundary、authorization、provenanceを変更するものではない。

**「日本語を主言語とする」は、英語の通常説明文や英語だけの見出しを大量に残してよいという意味ではない。** 人間向け文書の論理、状態説明、読者案内は日本語で完結できなければならない。

### 1.1 2026年9月5日の基準品質

第1〜第3段階の文書整備を`main`へ統合した状態を、今後の人間向け文書の最低品質として固定する。

- 基準コミット: `68159b1dcdf1c9e0042b5933e4f88aca5dcec995`
- 監査記録: [`JAPANESE_DOCUMENTATION_PHASE3_PROGRESS.md`](JAPANESE_DOCUMENTATION_PHASE3_PROGRESS.md)
- 対象範囲: ファイル名や配置場所を問わず、リポジトリ利用者、研究者、開発者が説明として読む文書
- 基準の性質: 参考例ではなく、将来の新規作成・更新時に後退を認めない必須品質

同等品質とは、単に日本語文字を含むことではない。少なくとも次の状態をいう。

1. 文書の目的、現在状態、結論、判断理由、意味、限界、読む順序を日本語で追える。
2. 人間向け見出しと通常説明文の論理が日本語で完結している。
3. technical / canonical termを正確に保持し、日本語の文脈へ自然に組み込んでいる。
4. 正式判断について、直接理由、意味すること、意味しないこと、authorizationや再利用への帰結を日本語で説明している。
5. 同一Study / Programの入口から詳細・再現・再開文書、中央索引まで、文書横断で同じ品質を保っている。
6. 相対リンク、fenced code block、ID、数値、hash、authorization状態を検証し、読みやすさの改善によって再現性を損なっていない。

この基準はMarkdownを主対象とするが、将来追加される人間向けのテキスト文書、テンプレート、生成文書にも、形式上適用できる範囲で同じ原則を適用する。machine-readable artifact、source code、exact outputは対象外とする。


## 2. 基本原則

### 2.1 人間向け本文は日本語を主とする

以下は原則として日本語で記述する。

- 文書タイトルの説明部分
- 見出し
- 研究の問い
- 研究設計の説明
- 結果の説明
- 解釈
- 限界・境界条件
- 現在状態・終了状態の説明
- 今後の研究可能性
- engineering判断の説明
- 読者向けナビゲーション
- 箇条書きで記述する事実関係の説明
- 表やcode blockの前後に置く説明文

英語専門語を使う場合も、英語だけで論理を進めない。必要に応じて初出時に日本語の意味を併記し、**文の骨格・述語・因果関係・判断理由は日本語で表現する**。

### 2.2 canonical identifierは変更しない

次のものは翻訳・改名しない。

- Study ID、Program ID、Stage ID
- experiment / run / artifact ID
- branch名、file path
- canonical uppercase decision token
- JSON field名、schema field名
- function / class / variable名
- hash、commit SHA
- source-code上のprofile名・configuration名
- 既に固定されたclassifier labelやmachine-readable category

例:

```text
PEOCR-STUDY1
RCPR-S1-DEVELOPMENT-2026-08-28-v1
INCONCLUSIVE
NOT-AUTHORIZED-NOT-EXECUTED
AI-GEN2
PBAI-C001-v1
capture-branch-expansion
MOVE_SET_ENTROPY.indexEntropy
```

これらはそのまま保持し、必要に応じて周囲の日本語本文で意味を説明する。

### 2.3 日本語品質の必須基準

人間向けMarkdown文書は、次をすべて満たして初めて「日本語化済み」とみなす。

1. **通常の説明文は日本語文である。**
   - 英語専門語やcanonical termを文中に残してよい。
   - ただし、主語・述語・接続・因果説明まで英語の完全な文を通常本文として残さない。
2. **人間向け見出しは日本語である。**
   - `Current Status`、`Research Log`、`Resume Here`、`Final decision`、`Immutable boundaries`、`Closure reason`、`Read order`などを完成形として残さない。
   - 正式な英語Study titleやcanonical identifierを見出しに含めることはできるが、説明部分は日本語にする。
3. **code blockやkey/value記録の意味を日本語で説明できる。**
   - exact outputやmachine-readable fieldを翻訳する必要はない。
   - ただし、読者が英語key/valueだけを読まないと状態を理解できない構成にしない。
4. **科学的判断の意味を日本語で説明する。**
   - canonical decision tokenは保持する。
   - `NON-ESTIMABLE`、`INCONCLUSIVE`、`STAGE1-TECHNICAL-INVALID`等が何を意味し、何を意味しないかを日本語で記述する。
5. **境界・禁止事項を日本語で説明する。**
   - no-rescue、human-claim firewall、production-only、not-authorized等の重要な境界を、英語tokenだけで済ませない。
6. **読者向け導線を日本語で記述する。**
   - 「最初に読む」「読む順序」「詳細」「再現性」「禁止事項」「次に許可される工程」等を日本語で示す。

次のような通常説明文は**不合格例**である。

```text
Stage 1 was technically valid.
Production and independent implementations agreed exactly on:
These are preregistered global readiness failures.
A future study must use fresh seeds.
```

同じtechnical termを保持しつつ、次のように日本語文へする。

```text
Stage 1は技術的にvalidだった。
Productionとindependent implementationは、次の項目でexact一致した。
これらは事前登録済みのglobal readiness failureである。
将来のStudyではfresh seedsを使用しなければならない。
```

### 2.4 英語を残してよい例外

次は英語のまま保持してよい。

- canonical identifier / decision token / machine-readable label
- 正式に固定された英語Study title / Program title
- file path、branch、command、code identifier
- exact command / exact stdout / exact error message
- JSON、schema、machine-readable table field
- hash、SHA、run / artifact ID
- CI / validatorがliteral stringとして要求するphrase
- immutable recordの原文引用
- 既に凍結済みで翻訳変更が禁止されるartifact本文

ただし、**例外を周囲の通常説明文まで英語にする理由として使ってはならない**。

たとえばcode block内の

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
```

はそのままでよいが、その前後の説明は日本語にする。

## 3. 推奨する日本語表現

固定トークンではない一般説明語は、文脈に応じて次の日本語を優先する。

| 英語表現 | 推奨する日本語 |
| --- | --- |
| prospective / prospectively frozen | 事前規定の / 結果を見る前に固定した |
| formal decision | 正式判断（canonical tokenは併記） |
| formal population | 正式評価対象集団 |
| fresh population / fresh evidence | 新たに生成した独立集団 / 新規証拠 |
| held-out | 未使用の独立検証用 |
| estimability gate | 推定可能性の判定条件 |
| readiness gate | 実行準備の判定条件 |
| firewall | データ分離規則 / 情報遮断規則 |
| no-rescue rule | 結果確認後の救済的変更を禁止する規則 |
| fail-closed | 条件未成立時には承認しない方式 |
| representation | 表現 / 状態表現 / 特徴表現 |
| representation boundary | 表現上の境界 |
| canonicalization | canonicalization（正準化） |
| verification | 検証 / 独立検証 |
| materialize | 正式成果物として生成・保存する |
| deployment | 公開環境への反映 / 配備 |
| engineering outcome | 工学上の最終判断 |
| candidate disposition | 候補の処置・最終状態 |
| lineage | 系統 |
| baseline | 基準構成 / baseline |
| current status | 現在の状態 / 現在の正式状態 |
| research log | 研究ログ |
| resume here | 再開位置 |
| closure reason | 終了理由 / closure理由 |
| immutable boundary | 不変の境界 |
| read order | 読む順序 |

ただし、既存文書内で専門概念として明示的に定義されている語は、そのcanonical termを保持してよい。

## 4. 研究文書の推奨構造

初見向けOverviewでは、原則として次の順序を推奨する。

1. この研究は何を調べたのか
2. なぜ独立研究が必要だったのか
3. 研究設計
4. 結果
5. 正式判断
6. 何が分かり、何が分からなかったか
7. 解釈上の境界
8. 詳細・再現用文書へのリンク

人間向けOverviewは、内部Stage IDを知らない読者でも研究の意味を日本語で理解できることを優先する。

Overview以外の人間向け文書も、英語の内部運用用ラベルをそのまま見出しへ転記するのではなく、読者が役割を理解できる日本語見出しを使う。

## 5. 機械定義と人間向け説明を分離する

Research Generation 1のVocabulary文書で採用した考え方を継承し、必要に応じて以下を分ける。

- **機械定義**: code、field、threshold、classifier、exact rule
- **経験的知見**: 固定データで観測された事実
- **人間向け意味**: 日本語での概念説明
- **境界**: その概念から主張してはいけないこと

機械定義より強い意味を日本語説明へ暗黙に追加してはならない。

## 6. formal decisionの表記

正式判断はcanonical uppercase tokenを保持する。

例:

```text
正式判断: `INCONCLUSIVE`
正式判断: `NOT-CONFIRMED`
正式判断: `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`
```

本文では日本語で意味を説明してよいが、canonical tokenそのものを日本語へ置換しない。

例:

> 正式判断は `INCONCLUSIVE` である。これは仮説が否定されたという意味ではなく、事前に固定した推定可能性の条件を満たさなかったため、主要評価へ進まなかったことを意味する。

## 7. AI Engineeringの表記

AI Engineeringでは研究世代とAI世代を混同しない。

- `Research Generation 1`, `Research Generation 2` = 研究世代
- `AI-GEN1`, `AI-GEN2`, `AI-GEN3` = 公開Bao AIの工学的系統
- `PBAI-P1` = engineering program ID
- `PBAI-Cxxx` = engineering candidate ID
- `legacy`, `bao`, `bao-v2`等 = profile identifier

これらのidentifierは保持し、説明文は日本語とする。

## 8. 変更してはいけない文書・箇所

日本語化だけを目的として、次を機械的に変更してはならない。

- preregistrationの凍結済み内容
- authorization artifact
- machine-readable JSON / schema
- result JSON
- hash対象となった固定成果物
- workflow provenance
- historical checkpoint
- source hash manifest
- 実験時点のexact command / exact output
- immutable decision recordとして明示された原文
- scientific representation contractとして機能するfeature dictionary / technical dictionary

これらに英語が残っていても、再現性・監査可能性を優先する。

必要なら、原文を変えずに別の人間向け日本語Overviewまたは注釈文書を追加する。

### 8.1 凍結前に日本語品質を確保する

`DECISION_REGISTER.md`、checkpoint、closure record、authorization README等は、後にimmutable / historical recordとなる場合がある。

そのため、**新規作成時点では、凍結・hash固定・formal closureより前に、人間向け説明文と見出しを本方針に従って日本語で作成する。**

「後で日本語化する」ことを前提に英語本文で作成し、そのままimmutableにしてはならない。

machine-readable JSONやexact outputはこの限りではない。

### 8.2 CI・validator互換性の固定phrase

人間向けMarkdown内の英語phraseであっても、既存test / validator / workflowがliteral stringとして参照している場合は、そのphraseを**互換用canonical token**として保持する。

本文の説明は日本語化してよいが、翻訳だけを理由としてliteral assertion対象を削除・改名してはならない。

例:

```text
No additional PEC Stage 2 games
STUDY COMPLETE / MAIN INTEGRATION COMPLETE
```

既存文書を日本語化する場合は、関連test / CIを確認し、literal assertionが存在する場合は意味を変えずに当該phraseを残す。

## 9. 既存文書を日本語化するときの安全規則

既存研究の文書を修正するときは、次を守る。

1. 数値を変更しない。
2. canonical decision tokenを変更しない。
3. Study / Stage / artifact identityを変更しない。
4. threshold・gate・endpointを変更しない。
5. authorized / not-authorized状態を変更しない。
6. `null`を0やnegative resultへ読み替えない。
7. `NON-ESTIMABLE`を`NOT-CONFIRMED`へ読み替えない。
8. production-only resultをverified resultへ昇格しない。
9. descriptive resultをformal claimへ昇格しない。
10. 翻訳に伴う意味変更が疑われる場合は、原文のcanonical termを残す。
11. relevant CI / testがMarkdown内のliteral phraseを参照していないか確認する。
12. immutable decision recordやhistorical checkpointの原文は、翻訳だけを理由に変更しない。

## 10. 進行中研究の扱い

進行中の研究では、科学的・工学的実行を妨げる可能性がある場合、言語整備を実行中branchへ割り込ませない。

特に、次の期間は文書日本語化を独立maintenance作業として分離する。

- seed block消費中
- formal run実行中
- independent verification実行中
- authorizationとresult materializationの間
- closure前のcanonical artifact確定中

ただし、**新規に作成する人間向け文書の初稿は、可能な限り最初から日本語品質を満たす**。研究完了後に大量翻訳が必要な状態を標準運用にしない。

## 11. 今後の新規文書

今後新しく作る人間向けMarkdown文書は、特別な理由がない限りこの方針を初稿から適用する。

**これは推奨ではなく必須要件である。** 小規模な追記でも既存部分の品質を下げてはならず、新規Study / Programでは入口文書だけでなく詳細文書・状態文書・再開文書も初稿から同じ品質にする。「研究完了後にまとめて翻訳する」運用を標準化しない。

対象には少なくとも次を含む。

- Study / Program `README.md`
- `STUDY_*_OVERVIEW.md`
- `STUDY_*_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- 新規作成時点の`DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`または同等の再開文書
- `results/README.md`
- `authorizations/README.md`
- program closure / engineering closureの人間向けMarkdown
- 新規checkpointの説明Markdown
- root README、研究索引、将来研究agenda等の中央文書

英語で作成する必要がある内部機械artifactが存在しても、repository-facingな人間向け入口と状態説明は日本語にする。

## 12. 日本語品質ゲート

人間向け文書を新規作成・大幅更新したStudy / Programは、closureまたはmain統合の前に必ず[`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)で監査する。

次のいずれかが存在する場合、明示的な例外理由がない限り品質ゲートは**FAIL**とする。

- 英語だけの通常説明文
- 英語だけの人間向け見出し
- 英語key/valueを読まなければ意味が分からない状態説明
- formal decision tokenだけを示し、日本語で意味を説明していない主要結果
- no-rescue / authorization / interpretation boundaryを英語tokenだけで済ませた説明
- README / Overviewだけ日本語で、Final Report / Current Status / Reproducibility / Research Log / Resume等が英語中心の状態

### 12.1 最低限記録する検証結果

新規作成・大幅更新のclosure、PR完成、または`main`統合前には、対象範囲とともに少なくとも次を確認し、PR本文または監査記録へ残す。

- 英語だけの人間向け見出し: 0件
- canonical / immutable / exact-output等の説明済み例外を除く英語の完全な通常説明文: 0件
- 壊れた相対リンク: 0件
- 意図しないfenced code block変更: 0件
- canonical identifier、decision token、数値、hash、authorization状態の意図しない変更: 0件
- 関連する文書整合性test / validator: すべてPASS

自動検出だけでは意味の正確さを保証できないため、formal decision、interpretation boundary、no-rescue、authorizationの説明は人間向けの意味監査も行う。許容例外がある場合は、該当箇所、理由、代替の日本語説明を記録する。

品質ゲートは英単語の数を減らす作業ではない。technical/canonical termを正確に保持しながら、**文書の論理と説明責任を日本語へ置くこと**を確認する。

本方針の目的は英語用語を排除することではなく、**機械的厳密性を保ちながら、人間が研究内容を自然な日本語で正確に理解できる状態を一貫して維持すること**である。
