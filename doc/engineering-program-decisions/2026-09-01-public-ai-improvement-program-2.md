# Public Bao AI Improvement Program 2 — Program開始判断

日付: 2026-09-01  
Program ID: `PBAI-P2`  
正式題目: `Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`  
判断: **PROGRAM ESTABLISHED / PRE-OUTCOME GOVERNANCE FROZEN**

## 1. 判断

完了済みResearch Generation 2だけをscientific/evidence inputとする新しいPublic Bao AI Engineering Programとして`PBAI-P2`を設立する。

目的は、Research Generation 2で正式に成立したbounded resultと明示された不確実性・失敗境界を出発点に、新規engineering mechanismがpublic Bao AIの品質向上へつながるかを独立にprospective評価することである。

PBAI-P1を再開・救済・延長しない。

## 2. 固定するscientific evidence cutoff

```text
cd200b85c1eb24aa4419bd5a9573552f3682f00d
```

このcommitはResearch Generation 2 main integration checkpointであり、直後のcommitからResearch Generation 3 program planが始まることをhistory上確認した。

結果を見た後にcutoffを変更しない。

## 3. Research Generation 3完全遮断

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

G3のscientific evidence、development observation、formal/diagnostic result、hypothesis、measurement、candidate mechanism、documentation-derived ideaをPBAI-P2へ流入させない。

## 4. ResearchとEngineeringの分離

PBAI-P2 outcomeによってResearch Generation 2のformal decisionを変更しない。

またG2のexploratory/development/technical-invalid observationを直接public AIへ採用せず、必ずPBAI-P2自身のsupport、development、validation、protected holdout gateを通す。

## 5. AI generation boundary

開始時public lineage:

```text
AI-GEN2
```

`AI-GEN3`は予約名である。

```text
formal ADOPT
+
actual public-default deployment
```

が両方成立した場合に限りpromotionする。

## 6. Stage identity

```text
PBAI-P2-A = G2 evidence audit / G3 firewall
PBAI-P2-B = public AI audit / baseline re-freeze
PBAI-P2-C = global gates / split / inventory freeze
PBAI-P2-D = candidate predevelopment / exact contract / authorization
PBAI-P2-E = development
PBAI-P2-F = independent validation / holdout authorization
PBAI-P2-G = protected holdout / final gate / ADOPT decision
PBAI-P2-H = actual public deployment / release / generation promotion
```

## 7. 初期candidate identity

Repository-wide `PBAI-Cxxx` namespaceを継続し、PBAI-P1で使用済みのC001〜C005を再利用しない。

```text
PBAI-C006-v1
PBAI-C007-v1
PBAI-C008-v1
PBAI-C009-v1
```

をinitial inventoryとして結果を見る前にfreezeする。

## 8. current authorization

Program設立時点で:

```text
candidate implementation = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
```

PBAI-C006のbaseline-only predevelopment support measurementだけが、initialization完了後の次工程として許可される。

## 9. 正常なclosure outcome

PBAI-P2はAI-GEN3への昇格を成功条件としない。

全candidateが採用gateを通過しない場合:

```text
KEEP-AI-GEN2
```

を正規の最終判断として認める。
