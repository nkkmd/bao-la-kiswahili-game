# Bao AI 世代命名規則

状態: **ACTIVE**  
制定日: 2026-08-26  
適用範囲: 公開Bao AIのengineering lineage命名

人間向けの説明文は[`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)に従い、日本語を主言語とする。以下で定義するcanonical identifier自体は翻訳・改名しない。

## 1. 目的

Bao AIの「世代」、evaluation / search profile、engineering program、candidate、research generationを混同しないためのcanonical naming ruleを定めます。

この文書におけるAI世代名は、**公開AIのengineering lineage**を表します。Research Generation 1 / Research Generation 2とは別namespaceです。

## 2. canonical namespace

| Namespace | Canonical form | 意味 |
| --- | --- | --- |
| AI generation | `AI-GEN1`, `AI-GEN2`, `AI-GEN3`, ... | 公開Bao AIの工学的系統 |
| evaluation/search profile | `legacy`, `bao`, `bao-v2`, etc. | code / config上のprofile identifier |
| engineering program | `PBAI-P1`, ... | AI改善Program |
| engineering candidate | `PBAI-C001`, `PBAI-C002`, ... | 独立candidate identifier |
| research generation | `Research Generation 1`, `Research Generation 2` | Bao研究Programの世代 |
| exact baseline | `AI-GEN2-BASELINE-...`等 | 完全固定した公開AI構成 |
| release | `AI-GEN3-RELEASE-...`等 | 正式採用された公開release |

`G1` / `G2` / `G3`という裸の表記は、AI世代と研究世代を混同する可能性があるためcanonical documentationでは使用しません。

AIについては必ず`AI-GENn`、研究については必ず`Research Generation n`と書きます。

## 3. 各AI世代の定義

### `AI-GEN1` — 旧世代AI系統

初期のlegacy AI lineageを指すhistorical engineering labelです。

- `legacy` evaluation / search profileと強く対応する歴史的系統を含みます。
- 現時点では、この命名規則だけを根拠として厳密な最初・最後のcommit boundaryを主張しません。
- 将来history auditが必要になった場合は、別のversioned archival recordでexact boundaryを固定します。

### `AI-GEN2` — 現在公開中のBao AI系統

PBAI-P1開始時点でpublicに使用されている現行Bao AI lineageを指します。

legacy-only構成から発展し、Bao固有評価、強化Alpha-Beta系探索、transposition table、PVS、killer move、quiescence search、Web Worker、既存benchmark / regression infrastructureなどを持つ現行系統を含みます。

重要な境界:

- `AI-GEN2`は**lineage label**であり、exact binary / configurationそのものではありません。
- exact public configurationはPBAI-Bで`AI-GEN2-BASELINE-...`として固定します。
- `bao-v2`という既存experimental evaluation profile名は`AI-GEN2`を意味しません。
- profile名に`v2`が含まれていてもAI世代番号とは無関係です。

### `AI-GEN3` — 次に正式採用される公開系統の予約名

`AI-GEN3`は、PBAI-P1または将来Programによって次に正式採用されるpublic lineageのために予約します。

**candidateを作成したこと、development benchmarkを通過したこと、validationを通過したことだけでは`AI-GEN3`を付与しません。**

`AI-GEN3`へのpromotionには最低限、次をすべて要求します。

1. 対応するevidence auditが完了している。
2. 現行public baselineがexactに固定されている。
3. benchmark / non-regression / release gateがcandidate outcomeを見る前に固定されている。
4. candidate mechanismがisolated ablationで評価されている。
5. fresh validation / release benchmarkを通過している。
6. rule correctness、tactical regression、operational qualityに重大なregressionがない。
7. 明示的なengineering release decisionが`ADOPT`である。
8. candidateまたはapproved candidate setがpublic default AIとして正式に採用・deploymentされている。

この条件を最初に満たしたresearch-informed public lineageを`AI-GEN3`とします。

## 4. Candidate命名規則

PBAI-P1のcandidateは世代名ではなく、常に既存のcandidate IDをcanonical identifierとして使用します。

```text
PBAI-C001
PBAI-C002
...
```

説明文として「Generation 3 candidate」と書くことはできますが、status / file / artifact / release IDとして`AI-GEN3`を先取りしてはいけません。

release前のassemblyやrelease candidateが必要な場合は、`PBAI-P1-RC01`等のProgram内identifierを使用します。public adoption前に`AI-GEN3-RELEASE-*`を発行しません。

## 5. Releaseとpatchの規則

`AI-GEN3`採用後に、小規模bug fix、performance tuning、UI-only変更、同一architecture内のminor parameter adjustmentを行っただけで、自動的に`AI-GEN4`へ進めることはしません。

同一lineage内の変更はrelease / version suffixで管理します。

例:

```text
AI-GEN3-RELEASE-001
AI-GEN3-RELEASE-002
```

新しい世代番号は、public default AIの主要engineering lineageが実質的に更新され、Program-level decisionで明示的にpromotionされた場合だけ進めます。

## 6. Research Generationとの分離

Research Generation 1 / 2 と `AI-GEN1` / `AI-GEN2` は、番号が一致していても意味上の対応関係を持ちません。

```text
Research Generation 1 = scientific research generation
AI-GEN1               = historical AI engineering lineage

Research Generation 2 = second pure research generation
AI-GEN2               = current public AI engineering lineage
```

したがって、Research Generation 2の開始・完了によってAIが自動的に`AI-GEN3`へ昇格することはありません。

## 7. PBAI-P1で固定した対応関係

PBAI-P1では次を固定しました。

```text
current public lineage at program establishment = AI-GEN2
next generation label reserved = AI-GEN3
candidate identifiers = PBAI-Cxxx
AI-GEN3 promotion before public adoption = prohibited
Generation-2 research outcomes in PBAI-P1 = excluded by existing evidence cutoff
```

PBAI-Bでbaselineを固定するときは`generationLineage = AI-GEN2`を明記し、PBAI-Hでpublic adoptionが成立した場合のみrelease registerへ`AI-GEN3` promotionを記録する、という規則です。
