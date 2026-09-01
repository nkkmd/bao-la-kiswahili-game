# PBAI-P2 — 判断台帳

Program: `PBAI-P2`  
開始日: 2026-09-01  
現在状態: **INITIALIZED / PRE-OUTCOME FREEZE COMPLETE**

この台帳は`PBAI-P2`のengineering判断だけを記録する。Research Generation 2の正式な科学判断は各研究の正本に従い、この台帳で変更しない。

## D001 — 独立AI Engineering Programとして設立する

`PBAI-P2`を`Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`として新規設立する。

PBAI-P1の再開・救済・延長ではなく、Research Generation 2 evidenceだけをscientific premiseとする独立Programである。

## D002 — Scientific evidence cutoffを固定する

```text
scientificEvidenceCutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d
```

同commitは`Record Research Generation 2 main integration checkpoint`であり、immediate childは:

```text
c5e33524c32b9ce9994760bababa08a85b6570d8
= Add Research Generation 3 program plan
```

である。したがって`cd200b85...`をG2-only boundaryとして結果を見る前にimmutable freezeする。

## D003 — Research Generation 3 influenceを0に固定する

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

G3の科学結果、development observation、diagnostic、measurement、hypothesis、candidate idea、文書由来のengineering ideaをPBAI-P2のcandidate設計、threshold、validation、interpretation、releaseへ使用しない。

## D004 — current mainとscientific cutoffを分離する

Program開始時のremote `main`は:

```text
2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

である。これはintegration / current public source監査にのみ用いる。scientific evidence universeは`cd200b85...`から拡張しない。

## D005 — Research Generation 2 formal boundaryを変更しない

G2 program closureで固定された`INCONCLUSIVE`、`STAGE1-TECHNICAL-INVALID`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`、`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`、`NOT-AUTHORIZED-NOT-EXECUTED`等をengineering outcomeで再分類しない。

特に:

```text
validated transform set = []
validated strategic-regime representation = none
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
engine score -> validated Bao win probability = NOT AUTHORIZED
```

を維持する。

## D006 — PBAI-P1はgovernanceだけを継承する

PBAI-P1のprospective gate、baseline freeze、candidate lifecycle、holdout protection、AI generation naming、no-rescue disciplineを継承する。

PBAI-P1で利用したResearch Generation 1 scientific evidenceはPBAI-P2 candidate premiseへ再利用しない。

## D007 — PBAI-P1 candidateを救済しない

```text
PBAI-C001-v1
PBAI-C002-v1
PBAI-C003-v1
PBAI-C004-v1
PBAI-C005
```

はclosedのままとし、threshold変更、seed追加、population追加、same-mechanism微修正で再評価しない。

## D008 — Program-qualified Stage IDを固定する

PBAI-P1のA..H semanticsを継承し、historical collisionを避けるため:

```text
PBAI-P2-A
PBAI-P2-B
PBAI-P2-C
PBAI-P2-D
PBAI-P2-E
PBAI-P2-F
PBAI-P2-G
PBAI-P2-H
```

を使用する。

## D009 — current public AI lineageはAI-GEN2である

開始時lineage:

```text
AI-GEN2
```

`AI-GEN3`は予約名であり、candidate successだけでは付与しない。formal `ADOPT` + actual public-default deploymentが両方成立した場合のみpromotionできる。

## D010 — PBAI-P2 baselineを再freezeする

```text
baselineId = AI-GEN2-BASELINE-2026-09-01-v1
```

minimum AI filesとpublic execution binding filesの8件すべてがPBAI-P1 exact baseline source commit `f4ae3b11901180cbe417b3e643e2b357d8045d2d`とGit blob identityで一致した。

したがってpost-G2 / G3期にpublic AI本体のsource changeはなく、ambiguous provenanceを理由とするalternate baselineは不要と判断する。

## D011 — `AI.stateKey`差はconstraintであり、まだbug claimではない

G2 authoritative RAW identityは`pending`を含むが、current public `AI.stateKey`は含まない。

この差はC006のpredevelopment questionを正当化する。ただし差だけでcurrent public search incorrectness、practical cache collision、decision defectを断定しない。

## D012 — Global gate specをoutcome前にfreezeする

```text
gateSpecId = PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1
```

candidate implementation / outcome = 0の状態で、correctness、decision-quality、strength、operational、overlap firewall、independent verification、release holdout、failure semanticsを固定した。

## D013 — PBAI-P2 fresh splitを専用seedへ分離する

Strengthは`421xxxxx`〜`423xxxxx`、decision rootsは`424xxxxx`〜`426xxxxx`、operational rootsは`427xxxxx`〜`429xxxxx`をdevelopment / validation / release holdoutへ分離した。

candidate-specific baseline-only supportには`430xxxxx`以降を割り当てる。

結果確認後にvalidation / holdout setを変更しない。

## D014 — PBAI-P2 initial candidate inventoryを固定する

```text
PBAI-C006-v1 = strict RAW-safe search/cache identity
PBAI-C007-v1 = depth-preserving same-key TT replacement
PBAI-C008-v1 = root-best-flip-triggered two-move confirmation re-search
PBAI-C009-v1 = exact single-reply forcing extension
```

すべて新しいcandidate identityであり、開始時点でimplementationは未承認。

## D015 — C006を最初のpredevelopment対象とする

C006 static auditでは、`pending`欠落がevaluation cache、TT base key、Worker/main stale-result identityへ伝播するcode factを確認した。

一方:

```text
practical correctness defect = NOT ESTABLISHED
```

である。

したがって次に許可するのはcandidate implementationではなく、`43000001..43002048`を使うbaseline-only dynamic support measurementだけである。

## D016 — C006 support failure semanticsを固定する

```text
engine-valid semantic collision witness = 0
-> WITHDRAWN / NO-ACTIONABLE-IDENTITY-DEFECT

semantic witness >=1 AND practical witness =0
-> NON-ESTIMABLE-PRACTICAL-SUPPORT / HOLD

semantic witness >=1 AND practical witness >=1
-> SUPPORT-PASS
-> exact implementation contract freezeへ進行可能
```

Support PASS前にcandidate code、decision benefit benchmark、validationを実行しない。

## D017 — C007はC006 dependencyを持つ

C006がactionable practical invalid identity reuseを成立させた場合、unsafe baseline keyのままC007-v1を実装しない。strict identityとTT replacementを組み合わせる場合は新しいcombined candidate identityが必要である。

## D018 — C008はP1 routing/root-orderingの救済ではない

C008は直近2 completed depthのroot best flipをtriggerとし、exactly two movesだけを次depthでfull-window確認する新しいmechanismとする。

P1 C001 legacy routing、P1 C004 TT-root-first ordering、historical `stableBestDepths` toggleを再評価しない。

## D019 — C009はG2-07 invalid modelを使わない

C009はexact legal reply count `==1`だけをtriggerとする。

G2-07の`F05_ALL`、`lambda=100`、production-only performance、reply-pressure model、opponent-policy thresholdを使用しない。

## D020 — Mandatory verifier evidenceを冗長化する

Validation / releaseではfull artifactに加え、compact canonical summary + hashesを別経路でmaterializeする設計をcandidate contractに要求する。

ただしartifact transport failureを結果後に免除しない。frozen redundant verifier contractを満たさなければ`TECHNICAL-INVALID`である。

## D021 — no-candidate outcomeを正常終了として認める

PBAI-P2でADOPT候補が0でも:

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```

を正常なformal engineering outcomeとして認める。

## D022 — 現時点のauthorization

```text
PBAI-P2-A = COMPLETE
PBAI-P2-B = COMPLETE
PBAI-P2-C = COMPLETE
PBAI-C006 static audit = COMPLETE
C006 dynamic baseline-only support measurement = AUTHORIZED
candidate implementation = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
```
