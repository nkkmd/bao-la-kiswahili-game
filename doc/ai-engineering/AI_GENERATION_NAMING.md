# Bao AI Generation Naming Convention

Status: ACTIVE  
Date: 2026-08-26  
Scope: public Bao AI engineering lineage naming

## 1. Purpose

Bao AIの「世代」、evaluation/search profile、engineering program、candidate、research generationを混同しないためのcanonical naming ruleを定める。

この文書におけるAI世代名は**public AI engineering lineage**を表す。研究世代のGeneration 1 / Generation 2とは別namespaceである。

## 2. Canonical namespaces

| Namespace | Canonical form | Meaning |
| --- | --- | --- |
| AI generation | `AI-GEN1`, `AI-GEN2`, `AI-GEN3`, ... | public Bao AIのengineering lineage |
| evaluation/search profile | `legacy`, `bao`, `bao-v2`, etc. | code/config profile identifier |
| engineering program | `PBAI-P1`, ... | AI改善program |
| engineering candidate | `PBAI-C001`, `PBAI-C002`, ... | isolated candidate identifier |
| research generation | `Research Generation 1`, `Research Generation 2` | Bao research programの世代 |
| exact baseline | `AI-GEN2-BASELINE-...`等 | frozen public-AI configuration |
| release | `AI-GEN3-RELEASE-...`等 | formally adopted public release |

`G1` / `G2` / `G3`の裸表記は、AI世代と研究世代を混同し得るためcanonical documentationでは使用しない。AIについては必ず`AI-GENn`、研究については`Research Generation n`と書く。

## 3. Generation definitions

### `AI-GEN1` — Legacy AI lineage

初期のlegacy AI lineageを指すhistorical engineering labelとする。

- `legacy` evaluation/search profileと強く対応する歴史的系統を含む。
- 現時点では厳密な最初/最後のcommit boundaryをこの命名規則だけで主張しない。
- 将来history auditが必要な場合は、別のversioned archival recordでexact boundaryを固定する。

### `AI-GEN2` — Current public Bao AI lineage

PBAI-P1開始時点でpublicに用いられている現行Bao AI lineageを指す。

特徴として、legacy-only構成から発展し、Bao固有評価と強化Alpha-Beta系探索、transposition table、PVS、killer move、quiescence search、Web Worker、既存benchmark/regression infrastructure等を持つ現行系統を含む。

重要:

- `AI-GEN2`は**lineage label**であり、exact binary/configurationそのものではない。
- exact public configurationはPBAI-Bで`AI-GEN2-BASELINE-...`としてfreezeする。
- `bao-v2`という既存experimental evaluation profile名は`AI-GEN2`を意味しない。
- profile名に`v2`が含まれていてもAI世代番号とは無関係である。

### `AI-GEN3` — Reserved next adopted public lineage

`AI-GEN3`はPBAI-P1等による次の正式採用public lineageのために予約する。

**candidate作成、development benchmark通過、validation通過だけでは`AI-GEN3`を付与しない。**

`AI-GEN3`へのpromotionには最低限次をすべて要求する。

1. PBAI-P1 evidence auditが完了している。
2. `AI-GEN2` public baselineがexactにfreezeされている。
3. benchmark / non-regression / release gateがcandidate outcomeを見る前にfreezeされている。
4. candidate mechanismがisolated ablationで評価されている。
5. fresh validation / release benchmarkを通過している。
6. rule correctness、tactical regression、operational qualityに重大なregressionがない。
7. explicit engineering release decisionが`ADOPT`である。
8. candidateまたはapproved candidate setがpublic default AIとして正式に採用・deploymentされている。

この条件を満たした最初のresearch-informed public lineageを`AI-GEN3`とする。

## 4. Candidate naming rule

PBAI-P1のcandidateは世代名ではなく、常に既存のcandidate IDをcanonical identifierとして使う。

```text
PBAI-C001
PBAI-C002
...
```

`Generation 3 candidate`という説明語を使うことはできるが、status / file / artifact / release IDとして`AI-GEN3`を先取りしない。

release前のassemblyやrelease candidateが必要な場合は、`PBAI-P1-RC01`等のprogram-scoped identifierを用いる。public adoption前に`AI-GEN3-RELEASE-*`を発行しない。

## 5. Release and patch rule

`AI-GEN3`採用後の小規模bug fix、performance tuning、UI-only変更、同一architecture内のminor parameter adjustmentだけで自動的に`AI-GEN4`へ進めない。

同一lineage内の変更はrelease/version suffixで管理する。

例:

```text
AI-GEN3-RELEASE-001
AI-GEN3-RELEASE-002
```

新しい世代番号は、public default AIの主要engineering lineageが実質的に更新され、program-level decisionで明示的にpromotionされた場合だけ進める。

## 6. Research-generation separation

Research Generation 1 / 2 と `AI-GEN1` / `AI-GEN2` は番号が一致していても意味上の対応関係を持たない。

```text
Research Generation 1 = scientific research generation
AI-GEN1             = historical AI engineering lineage

Research Generation 2 = second pure research generation
AI-GEN2             = current public AI engineering lineage
```

したがって、Research Generation 2の開始・完了によってAIが自動的に`AI-GEN3`へ昇格することはない。

## 7. PBAI-P1 binding

PBAI-P1では次を固定する。

```text
current public lineage at program establishment = AI-GEN2
next generation label reserved = AI-GEN3
candidate identifiers = PBAI-Cxxx
AI-GEN3 promotion before public adoption = prohibited
Generation-2 research outcomes in PBAI-P1 = excluded by existing evidence cutoff
```

PBAI-B baseline freeze時には`generationLineage = AI-GEN2`を明記し、PBAI-Hでpublic adoptionが成立した場合のみrelease registerへ`AI-GEN3` promotionを記録する。
