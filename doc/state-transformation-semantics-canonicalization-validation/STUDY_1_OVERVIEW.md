# State Transformation Semantics / Canonicalization Validation Study 1 — Overview

## Study identity

```text
Agenda label = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Status = COMPLETE / FORMAL DECISION INCONCLUSIVE
```

## What this Study asked

Baoの盤面を見た目だけで「左右対称」「座席交換で同じ」と扱うのではなく、状態変換が現在のrule engine上で本当に同じ意味を持つかを、representation bindingを最初から明示したfresh evidenceでprospectively検証した。

検証対象には以下を含めた。

- authoritative RAW state reconstruction;
- exact legal-move-set bijection;
- exact move identity including Namua variants;
- successor commutation;
- terminal/winner/pending semantics;
- inverse/bijection;
- bounded graph node/edge isomorphism;
- mandatory independent reconstruction;
- separate downstream canonicalization authorization.

## Why a new Study was required

Research Generation 1のSymmetry / Isomorphic Positions Study 1は5 outcomeすべて`NON-ESTIMABLE`で閉じ、ORISC-STUDY1はrepository-facing oracle representation integrityを`NOT-CONFIRMED`とし、conditional symmetry stageを実行しなかった。

したがってG2-03開始時のvalidated transform setは空で、canonicalizationやsymmetry-reduced state countingは未承認だった。G2-03はそれらのclosed Studyを救済せず、fresh historically reachable RAW statesと新しいrepresentation bindingを用いる独立Studyとして実施した。

## Authoritative identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`はidentityから除外した。formal authorization前にcandidate transformをpopulation deduplicationへ使用していない。

## Stages

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1
```

Stage 0はtechnical only。Stage 1はfresh development evidence。Stage 2のみがheld-out formal candidate-decision stageだった。

Stage 1は72 roots（Namua/Mtaji/Mtaji-houseless各24）を使用し、それらのtrajectory seed / opening prefix / RAW state identityをStage 2からfirewallした。

## Stage 2 prospective formal design

Stage 2はoutcome生成前に以下を固定した。

```text
seed block = 26032001..26032768
target roots = 32 per stratum
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
candidate mismatch tolerance = 0
replacement outside seed block = false
seed extension after outcome = false
```

Candidate set:

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

The hardened prefreeze workflow passed before any Stage 2 scientific outcome existed. Explicit authorization was committed at `c7619ded9f682b499a02d023b40ac54ba4dc95ca`.

## Frozen global-failure rule

Stage 2では、population/firewall、runtime integrity、IDENTITY、negative control、production/independent agreement、frozen hash agreementの6 global gatesを全てPASSすることをcandidate decisionの前提にした。

1つでもPASSしない場合は事前規則により:

```text
Study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation = not authorized
```

とした。

## What happened in Stage 2

Authorized workflow run `33145860098`ではengine regression、frozen source reconstruction、fresh held-out production measurementまで成功した。

Productionは凍結quotaどおり96 rootsを選択した。

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

Production-only diagnosticsではT01/T02/T03すべてcandidate mismatch 0だった。

しかしmandatory independent verifierがformal-result assembly時に次のtechnical errorで停止した。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

そのためcomplete independent verification、canonical formal result、canonical hashes、workflow artifact ZIPはmaterializeされなかった。

## Final formal result

Frozen ruleをそのまま適用し、S2-G5を`NOT-ESTABLISHED`としてfail closedした。

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

Productionのzero-mismatch diagnosticsを`VALIDATED-BOUNDED-ISOMORPHISM`へ昇格していない。またtechnical failureをcandidate mismatchとみなして`NOT-VALIDATED`にもしていない。

## Canonicalization boundary

Rule-semantic transformとdownstream canonicalizationは別claimとして保持した。

Production-only diagnosticsではbounded graph 6,317 states / 6,341 edgesについてsemantic-domain canonicalization checksがzero mismatchだったが、mandatory independent verificationがcanonicalに完了していないためformal authorizationにはならない。

さらにT01/T02/T03はいずれもstandard initial RAW stateを保存せず、independent standard-start reachability-closure proofも実装されていない。

したがって:

```text
canonicalization for scientific population identity = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
```

である。

## No-rescue closure

Verifier defectはfresh Stage 2 outcome生成後に判明した。Study 1ではsourceを修正して同じStage 2 evidenceを再実行し、candidate decisionを救済しない。

再検証する場合はnew prospective Studyまたは明示的なnew versioned protocol、fresh authorization、fresh formal evidenceを必要とする。

## What this result means

`NON-ESTIMABLE`は3 transformsがfalseであることを意味しない。同時に、production-only mismatch 0を理由にvalid transformとも主張しない。

G2-03はSIP-STUDY1、ORISC-STUDY1、SSGTC-STUDY1、G2-01、G2-02のformal decisionを変更しない。public AI engineeringも本Studyのendpointではない。

## Read next

- `STUDY_1_FINAL_REPORT.md` — scientific/technical final integration
- `results/STAGE_2_FORMAL_RESULT.json` — canonical fail-closed result
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json` — failed workflow provenance
- `CURRENT_STATUS.md` — terminal status
- `DECISION_REGISTER.md` — frozen decisions and no-rescue boundary
- `REPRODUCIBILITY_INDEX.md` — source/workflow/hash provenance
