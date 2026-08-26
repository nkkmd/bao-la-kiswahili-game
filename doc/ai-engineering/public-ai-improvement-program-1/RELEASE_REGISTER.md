# PBAI-P1 Release Register

Status: **PROGRAM COMPLETE / NO PBAI-P1 PUBLIC RELEASE / AI-GEN2 RETAINED**

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

## PBAI-P1 final release outcome

PBAI-P1ではrelease-candidate statusへ到達したcandidateが存在しなかった。

```text
validation executions = 0
release holdout executions = 0
release candidates = 0
formal ADOPT decisions = 0
public deployments caused by PBAI-P1 = 0
PBAI-P1 public releases = 0
generation promotion = NONE
```

したがってrelease holdoutは消費されていない。No-candidate状態でholdoutを実行して`KEEP-AI-GEN2`を「検証」する必要はない。

## Current releases

PBAI-P1によるreleaseは**なし**。

Final program outcome:

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
```

Program設立からclosureまで、PBAI-P1によるpublic AI implementation変更は発生していない。
