# 日本語文書品質ゲート

Status: **ACTIVE REQUIRED QUALITY GATE**  
適用範囲: 今後新規作成・大幅更新するBao研究、AI Engineering、中央索引の人間向けMarkdown文書  
制定日: 2026-08-30

## 1. 目的

この品質ゲートは、[`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md)を実際の文書作成・closure・main統合時に確実に適用するための最終監査手順である。

単に「日本語が含まれている」「READMEやOverviewだけ日本語である」状態を合格としない。

**人間向け文書の論理、状態説明、結果、判断理由、境界、ナビゲーションが日本語で理解できること**を合格条件とする。

英語technical termやcanonical identifierは保持してよいが、英語だけの通常説明文・英語だけの人間向け見出しを残したまま「日本語化済み」と判定してはならない。

## 2. 参照する文書品質

文体・粒度の参照例として、少なくとも次の日本語整備済み文書を確認する。

- `doc/rich-critical-position-representation/STUDY_1_FINAL_REPORT.md`
- `doc/rich-critical-position-representation/CURRENT_STATUS.md`
- `doc/rich-critical-position-representation/DECISION_REGISTER.md`
- `doc/rich-critical-position-representation/REPRODUCIBILITY_INDEX.md`
- `doc/rich-critical-position-representation/RESEARCH_LOG.md`
- `doc/rich-critical-position-representation/RESUME_HERE.md`

これらの科学的内容をcopyするのではなく、**日本語の説明文の中にtechnical/canonical termを埋め込み、判断・因果・境界を日本語で説明するスタイル**を参照する。

本品質ゲートおよび`DOCUMENTATION_LANGUAGE_POLICY.md`が、参照文書より新しい要件を定めている場合は、本品質ゲートを優先する。

## 3. 監査対象のinventory

Study / Programのclosureまたはmain統合前に、人間向けMarkdownを列挙する。

最低限、存在する場合は次を確認する。

- Study / Program `README.md`
- `STUDY_*_OVERVIEW.md`
- `STUDY_*_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`または同等の再開・引継ぎ文書
- `results/README.md`
- `authorizations/README.md`
- program / research closure decision Markdown
- 新規checkpoint Markdown
- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- AI Engineeringのprogram/candidate status・final report等の人間向けMarkdown

machine-readable JSON、schema、source manifest、workflow、code、exact outputはこの言語品質監査の直接対象外だが、それらを説明する人間向けREADMEは対象である。

## 4. 必須ゲートA — 見出し

### PASS条件

人間向け見出しの説明部分が日本語である。

許容例:

```text
# PCRPR-STUDY1 — 現在の状態
## Stage 1の最終判断
## 不変の境界
## 読む順序
## closure理由
```

正式なStudy titleやcanonical termを併記してよい。

### FAIL例

明示的なcanonical title等の理由がないのに、次のような見出しを完成形として残す。

```text
# PCRPR-STUDY1 — Current Status
# MDFT-STUDY1 — Research Log
# MDFT-STUDY1 — Resume Here
## Final Stage 1 decision
## Immutable boundaries
## Closure reason
## Read order
## Current safe state
```

**英語だけの人間向け見出しが1件でも残る場合、例外理由を説明できなければFAIL。**

## 5. 必須ゲートB — 通常説明文

### PASS条件

通常本文の文の骨格が日本語である。

technical termを保持してよい。

```text
Stage 1は技術的にvalidだった。
Productionとindependent implementationはdevelopment coreでexact一致した。
結果を見る前に固定したglobal readiness gateのうち2件がFAILした。
このためStudyの正式判断は`NON-ESTIMABLE`である。
```

### FAIL例

code block、exact output、引用ではない通常本文に英語の完全な説明文を残す。

```text
Stage 1 was technically valid.
Production and independent implementations agreed exactly on source generation and root selection.
These values are development observations only.
A future study must use a new population contract and fresh seed block.
```

**通常本文の英語完全文が1件でも残る場合、canonical / immutable / exact-output例外でなければFAIL。**

## 6. 必須ゲートC — code block・key/valueと日本語説明

exact key/value、run status、hash、decision token等は翻訳しない。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
scientificInferenceAuthorized = false
artifact = 9714352893
```

ただし、これらだけで論理を進めない。

PASS例:

> 必須のfull independent verificationを完了できなかったため、結果を見る前に固定したdecision mappingに従い、Stage 1は`STAGE1-TECHNICAL-INVALID`で閉じた。

FAIL例:

> `Final Stage 1 decision:`という英語見出しの下にcode blockだけを置き、その意味を日本語で説明しない。

## 7. 必須ゲートD — 正式判断と解釈境界

主要なformal decisionについて、少なくとも次を日本語で説明する。

1. canonical decision token
2. その判断になった直接理由
3. 何を意味するか
4. 何を意味しないか
5. Stage 2等のauthorizationへの帰結
6. no-rescue / rerun / reuse boundary

例:

> 正式判断は`NON-ESTIMABLE`である。これはfailure taxonomyが否定されたことを意味しない。結果を見る前に固定したpopulation readiness条件を満たさなかったためformal validationへ進めなかったことを意味し、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`のままとする。

formal tokenだけを表示して説明を英語または省略する場合はFAIL。

## 8. 必須ゲートE — 文書横断の一貫性

README / Overviewだけを日本語化して合格としてはならない。

同一Study / Programについて、少なくとも次の役割が日本語品質を満たしているか横断確認する。

- 初見向け説明
- 最終報告
- 現在状態
- 再現性
- 研究ログ
- 再開・引継ぎ
- results / authorizations等の人間向けREADME
- 中央索引の要約

たとえばOverviewが日本語でも、Final Report後半、Current Status、Research Log、Resume文書に英語説明文が残っている場合は**Study全体としてFAIL**。

## 9. 必須ゲートF — 新規immutable文書の凍結前監査

次の文書は、後からimmutable / historical recordとなる可能性が高い。

- `DECISION_REGISTER.md`
- checkpoint Markdown
- program / research closure decision
- authorizationの人間向けREADME
- source-freeze等の人間向け監査記録

**新規作成時は、凍結・hash固定・closure前に日本語品質ゲートを通す。**

既にimmutableとなった英語原文を後から翻訳することは要求しない。したがって、将来の英語残存を防ぐ責任は作成時点にある。

machine-readable JSONやexact outputは除外する。

## 10. 必須ゲートG — canonical情報の不変性

日本語品質のために次を変更してはならない。

- Study / Program / Stage ID
- decision token
- seed範囲・seed消費状態
- threshold / gate / endpoint
- population数
- run / job / artifact ID
- hash / SHA
- branch / file path
- JSON field
- classifier / category label
- authorization状態
- production-only / verified / descriptive / formalの区別
- historical decision

特に:

```text
NON-ESTIMABLE ≠ NOT-CONFIRMED
INCONCLUSIVE ≠ negative result
production-only ≠ verified
null ≠ 0
NOT-AUTHORIZED-NOT-EXECUTED ≠ failed execution
```

日本語化によってこれらを読み替えた場合はFAIL。

## 11. 英語残存の許容例外

次は英語のままでよい。

- canonical identifier
- canonical uppercase decision token
- 正式な英語Study / Program title
- code identifier
- JSON / schema field
- branch / path
- exact command / stdout / stderr / error message
- hash / SHA / run / artifact ID
- machine-readable category / classifier label
- CI / validator互換性のliteral phrase
- immutable recordの原文引用

例外を使う場合でも、その**意味や文脈の説明は日本語**にする。

## 12. pre-merge実施手順

closureまたはmain統合前に次を順番に行う。

1. 対象Study / Programの人間向けMarkdownをinventory化する。
2. 見出しを確認し、英語だけの説明見出しを除去する。
3. 通常本文を確認し、英語の完全な説明文を除去する。
4. code block / key-valueの前後に日本語説明があるか確認する。
5. formal decisionと解釈境界が日本語で説明されているか確認する。
6. README / Overview以外のFinal Report、Current Status、Reproducibility、Research Log、Resume等も確認する。
7. 新規immutable文書が凍結前に日本語品質を満たしているか確認する。
8. canonical token・数値・hash・authorization状態が変更されていないことをdiffで確認する。
9. Markdownのliteral phraseを参照するCI / validatorがないか確認する。
10. 例外として英語を残す箇所がある場合、その理由をPRまたはaudit記録に明示する。

## 13. 最終判定

次をすべて満たした場合のみ:

```text
JAPANESE_DOCUMENTATION_QUALITY_GATE = PASS
```

と判定する。

- 人間向け見出しが日本語中心
- 通常説明文が日本語文
- technical/canonical termは正確に保持
- code blockの意味が日本語で説明されている
- formal decisionと境界が日本語で理解できる
- Study内の主要人間向け文書を横断して同品質
- 新規immutable文書は凍結前に監査済み
- canonical情報に変更なし
- 英語残存は明示的な許容例外だけ

一つでも満たさない場合は:

```text
JAPANESE_DOCUMENTATION_QUALITY_GATE = FAIL
```

とし、closure / main統合前に修正する。

## 14. 品質の考え方

本ゲートは、英単語を機械的に日本語へ置換する規則ではない。

Bao研究では、`RAW identity`、`Stage 1`、`production`、`independent verification`、`NON-ESTIMABLE`等を英語のまま残す方が正確な場合が多い。

求めるのは、**technical/canonical termを正確に保持したまま、それらをつなぐ論理、判断、因果、限界、読者案内を自然な日本語で記述すること**である。
