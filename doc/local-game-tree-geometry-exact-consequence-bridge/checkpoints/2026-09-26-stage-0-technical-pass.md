# 2026-09-26 — G4-06 Stage 0 技術検証完了

Study: `LGTGECB-STUDY1`  
Stage: `LGTGECB-S0-TECHNICAL-2026-09-26-v1`  
状態: **`STAGE0-TECHNICAL-PASS`**

## 1. 目的

G4-06のscientific bridge mappingへ入る前に、bounded RAW geometry、exact solver output、value-preserving move分類、DTF整合、有限標本のpair ordering / concordance集計、production / independent実装分離がtechnical fixtureだけで再現可能かを確認した。

G4-05の8 formal domainsに対する新しいgeometry / exact bridge計算は本Stageでは認可しておらず、実行していない。

## 2. technical run履歴

Stage 0は科学証拠を生成しないため、technical implementation defectをfail-closedで修正した。履歴は次のとおり。

### Run 1

```text
run = 36211639488 / attempt 1
head = adb9f07d4c599041c83e5c5a6b07828ddcba8da2
conclusion = failure
failure point = production technical check
artifact ID = 10895319068
artifact SHA-256 = 4ad413a16062025706adfafe7fe793f1e2d047432d39b506ede1ba91e763b9b8
```

WIN局面のvalue-preserving classifierが、勝ちを確定させるchild `TERMINAL`を`LOSS` childではないという理由で除外していた。exact solver自体、geometry fixture、G4-05証拠には問題はなかった。

修正では、決定的WIN / LOSS domainについてchild `absoluteWinner`がroot `absoluteWinner`と一致することをvalue preservationのtechnical判定へ用いた。これにより`TERMINAL` childも正しく扱える。

### Run 2

```text
run = 36211729217 / attempt 1
head = 71a4c87e4d39172679d9d1b533ed708fa0299f89
conclusion = failure
production = success
independent = failure / S0-G5 + S0-G6
artifact ID = 10896136409
artifact SHA-256 = 333bc496b4fc64e6add32bd4da77e0b3d411eacf991afdbd1600490f505dc704
```

production helper修正commitによるpush workflowが、independent helper修正commitより先に起動したため、production / independentの分類定義が一時的に不一致となった。scientific resultではなく、逐次commit中のtechnical intermediate runである。

### Canonical Run 3

```text
run = 36211754989 / attempt 1
head = 355162ae40cabcc443944133aa1168a1588fcba3
conclusion = success
artifact ID = 10896360387
artifact SHA-256 = 7cfc9c10d23886e78b8c7f0bb2a8e226c35a31035c36433c2770f32510270009
Node = v20.20.2
```

production / independentの双方を同じ修正版定義へ揃えた状態で実行し、全stepがsuccessした。

## 3. canonical artifact

主要ファイルhash:

```text
bridge-production.json = ec64ced01a13e901d827da7bcbc21afed85019ecb87619a63a52b7e75da36f04
bridge-independent-verification.json = a6386f248edaa40ac1c3d9028b921a99c11609423fe0c917dca5254852782d0b
exact-technical-production.json = d0b91bfe676dd935995dcea5e82225e4edb4a83e9faed469f80c06394f40741d
exact-technical-independent.json = 2f04cff16a48b40b4f28b254a86f4aff3757886ac9f8a6c7fae4f7b6729417a7
execution-identity.txt = 2492bfc1b15297af8d22332782e098f5ada3479c7b94bf5957c314ec6185926d
production core = 0661aa2c823a097d9a0e541ad9a951ad2a296351e79518d76a25d4736f6f26b8
independent verification core = 547b410ac56d7239c43d41491c1b7ae80dd54055874dede8847fff52ed2be818
```

`SHA256SUMS.txt`は生成shellの都合で自分自身にempty-file SHA-256行を含むが、上記payload file hashesとGitHub artifact digestは別途確認済みであり、Stage 0判定には自己参照行を使用していない。

## 4. gate結果

```text
S0-G1  = PASS
S0-G2  = PASS
S0-G3  = PASS
S0-G4  = PASS
S0-G5  = PASS
S0-G6  = PASS
S0-G7  = PASS
S0-G8  = PASS
S0-G9  = PASS
S0-G10 = PASS
S0-G11 = PASS
S0-G12 = PASS
```

12 / 12 mandatory gateがPASSした。

## 5. technical fixture確認値

以下は**technical synthetic / historical fixtureの期待値再現**であり、G4-06 scientific resultではない。

```text
corridor technical fraction = 9/23
tree/RAW technical fraction = 19/10
transposition technical fraction = 7/25
reply-width technical mean = 3/2

binary pair ordering = WIN_GREATER 3 / WIN_LESS 0 / TIE 1
ordered concordance = CONCORDANT 4 / DISCORDANT 1 / GEOMETRY_TIE 1
no-variation fixture = NON-ESTIMABLE behavior confirmed
```

REWR technical exact fixtureでは8 states / 7 edges / solution SHA-256 `4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15`をproduction / independent双方で再現した。4 nonterminal exact WIN / LOSS statesについて、DTF-consistent move setはsolver `optimalMoveKeys`とすべて一致した。

## 6. 保護境界

Canonical Run 3で次を確認した。

```text
G4-05 formal-domain bridge reads = 0
G4-10 depth-11 accesses = 0
scientific bridge inference authorized = false
formal bridge decision authorized = false
public AI change authorized = false
```

したがってStage 0 PASSはG4-06のscientific resultではなく、Stage 1 formal bridge mappingの**別authorization reviewへ進めるtechnical prerequisite**だけを満たす。

## 7. 次工程

次に許可される作業はpost-Stage0 / pre-Stage1 authorization reviewである。

そのレビューでは、G4-05固定8-domain manifest、root再物質化手順、geometry scalar、exact consequence、estimability gate、finite relation summary、resource ceiling、production / independent path、Actions execution / rerun semanticsをscientific bridge output生成前に固定する。
