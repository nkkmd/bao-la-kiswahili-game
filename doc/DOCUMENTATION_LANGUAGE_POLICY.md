# 文書言語・用語表記方針

Status: **ACTIVE POLICY**  
適用範囲: Bao研究文書、AI Engineering文書、中央索引、今後新規作成する人間向けMarkdown文書  
制定日: 2026-08-29

## 1. 目的

本リポジトリの研究・AI Engineering文書は、**人間向け説明の主言語を日本語とする**。

Research Generation 1で確立した文書スタイルを基準とし、研究上・工学上の厳密性を損なわない範囲で、問い、設計、結果、解釈、限界、運用状態を自然な日本語で説明する。

この方針は翻訳のために既存の科学的判断、工学的判断、事前登録、閾値、分類器、endpoint、population、representation boundary、authorization、provenanceを変更するものではない。

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
- 今後の研究可能性
- engineering判断の説明
- 読者向けナビゲーション

英語専門語を使う場合も、英語だけで論理を進めず、必要に応じて初出時に日本語の意味を併記する。

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

人間向けOverviewは、内部Stage IDを知らない読者でも研究の意味を理解できることを優先する。

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

これらのidentifierは保持し、説明文は原則日本語とする。

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

これらに英語が残っていても、再現性・監査可能性を優先する。

必要なら、原文を変えずに別の人間向け日本語Overviewまたは注釈文書を追加する。

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

## 10. 進行中研究の扱い

進行中の研究では、科学的・工学的実行を妨げる可能性がある場合、言語整備を実行中branchへ割り込ませない。

特に、次の期間は文書日本語化を独立maintenance作業として分離する。

- seed block消費中
- formal run実行中
- independent verification実行中
- authorizationとresult materializationの間
- closure前のcanonical artifact確定中

研究完了後または安全なcheckpointで、人間向け文書へ本方針を適用する。

## 11. 今後の新規文書

今後新しく作る人間向けMarkdown文書は、特別な理由がない限りこの方針を初稿から適用する。

英語で作成する必要がある場合も、repository-facingな初見向けOverview・README・中央索引については日本語版を正面の入口とする。

本方針の目的は英語用語を排除することではなく、**機械的厳密性を保ちながら、人間が研究内容を日本語で正確に理解できる状態を維持すること**である。
