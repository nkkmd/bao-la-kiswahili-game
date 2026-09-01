# PBAI-P2 — リリース台帳

Program: `PBAI-P2`  
現在状態: **NO RELEASE / AI-GEN2 RETAINED**

## 1. 公開系統

開始時と現在のpublic lineageは:

```text
AI-GEN2
```

である。`AI-GEN3`は予約名のままであり、formal `ADOPT`とactual public-default deploymentが両方成立するまで付与しない。

## 2. release holdoutの状態

Program initialization時点:

```text
validation executions = 0
release holdout executions = 0
release candidates = 0
formal ADOPT decisions = 0
public deployments caused by PBAI-P2 = 0
generation promotion = NONE
```

Release holdoutは`PBAI-P2-C`では`NOT-AUTHORIZED`である。

実行には:

```text
fresh independent validation PASS
+ candidate source/config hash freeze
+ explicit PBAI-P2-F holdout authorization
```

が必要である。

## 3. release recordに必要な項目

将来release candidateが成立した場合、最低限次を記録する。

```text
releaseId
candidateId(s)
baselineId
generationLineageBefore
generationLineageAfter
candidate source/config hash
public deployment commit/ref
validation artifacts
release holdout artifacts
correctness/regression result
operational result
PWA cache version
rollback target
formal ADOPT / REJECT / HOLD decision
actual public-default deployment status
generationPromotionDecision
```

## 4. protected holdout rule

release holdoutを見た後にmechanism、threshold、trigger、budget、populationを変更し、同じholdoutで救済しない。

Holdout failure後に変更する場合は、新candidate/versionと未使用の新しいfuture holdoutが必要である。

## 5. 現在のrelease state

```text
PBAI-P2 public release = none
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
public AI source changed by PBAI-P2 = false
```
