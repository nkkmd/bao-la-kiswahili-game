# AI Generation Naming Convention — Engineering Program Decision

Date: 2026-08-26  
Status: ACTIVE ENGINEERING DECISION  
Scope: public Bao AI engineering lineage naming

## Decision

今後のpublic Bao AIについて、engineering lineageのcanonical generation labelとして次を使用する。

```text
AI-GEN1 = historical legacy AI lineage
AI-GEN2 = current public Bao AI lineage at PBAI-P1 establishment
AI-GEN3 = reserved next formally adopted public lineage
```

Canonical detailed ruleは`doc/ai-engineering/AI_GENERATION_NAMING.md`とする。

## Namespace separation

1. `AI-GENn`はpublic AI engineering lineageだけを表す。
2. `legacy` / `bao` / `bao-v2`等はevaluation/search profile identifierであり、generation numberではない。
3. `PBAI-P1`はengineering program ID、`PBAI-Cxxx`はcandidate IDである。
4. Research Generation 1 / 2はscientific research programの世代であり、`AI-GEN1` / `AI-GEN2`とは独立である。
5. canonical docsではambiguousな裸の`G1` / `G2` / `G3`を避ける。

## Promotion rule

PBAI-P1のcandidateを単に作成・検証しただけでは`AI-GEN3`と呼ばない。

`AI-GEN3` promotionは、frozen `AI-GEN2` baseline、prospectively frozen benchmark/non-regression/release gates、isolated candidate evaluation、fresh release benchmark、regression/operational PASS、explicit `ADOPT` decisionを経て、public defaultとして正式採用された場合にのみ許可する。

## Version rule

同一AI generation内のminor patch、bug fix、parameter adjustment、UI-only変更ではgeneration numberを進めず、release/version suffixを使う。

例:

```text
AI-GEN3-RELEASE-001
AI-GEN3-RELEASE-002
```

次世代番号へのpromotionはprogram-level decisionを必要とする。

## Current binding

```text
PBAI-P1 current public lineage = AI-GEN2
PBAI-P1 next reserved public lineage = AI-GEN3
AI-GEN3 promotion authorized now = false
```

このdecisionはAI implementationを変更しない。命名とpromotion boundaryのみを固定する。
