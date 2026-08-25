# PBAI-P1 Release Register

Status: EMPTY / NO PBAI-P1 PUBLIC RELEASE YET

AI generation namingは`doc/ai-engineering/AI_GENERATION_NAMING.md`に従う。PBAI-P1開始時点のpublic lineageは`AI-GEN2`であり、`AI-GEN3`はformal public adoptionまで予約名とする。

## Release policy

public releaseごとに最低限次を記録する。

```text
releaseId
candidateId(s)
baselineId
generationLineageBefore
generationLineageAfter
source commit
public deployment commit/ref
benchmark artifact(s)
release holdout result
correctness/regression result
operational result
staged deployment date
rollback target
final decision = KEEP | ROLLBACK | HOLD
generationPromotionDecision
```

`generationLineageAfter = AI-GEN3`は、frozen release/non-regression gatesを満たし、explicit `ADOPT` decisionを得てpublic defaultとして正式採用されたreleaseにのみ記録する。

同一generation内のminor releaseではgeneration numberを進めず、`AI-GENn-RELEASE-xxx`形式等のrelease suffixで識別する。

## Current releases

なし。

Program設立時点および命名規則固定時点ではpublic AI implementationを変更していない。
