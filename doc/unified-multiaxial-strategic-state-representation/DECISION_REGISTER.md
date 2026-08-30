# UMSSR-STUDY1 — 判断台帳

更新日: 2026-08-30

この台帳はscientific evidence生成前に固定した判断と、その後変更してはならない境界を記録する。

## D-001 — Study identity

```text
Program = G2-10
Study ID = UMSSR-STUDY1
Formal title = Unified Multiaxial Strategic State Representation Study 1
```

日本語題目は、Baoにおける多軸戦略状態表現の統合的構築とprospective検証を扱うものとして固定する。

## D-002 — baseline / branch

```text
baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

開始時remote `main`はユーザー提示SHAと一致した。

## D-003 — Stage IDs

```text
UMSSR-S0-TECHNICAL-2026-08-30-v1
UMSSR-S1-DEVELOPMENT-2026-08-30-v1
UMSSR-S2-FORMAL-2026-08-30-v1
```

scientific outcome生成後にStage identityを差し替えない。

## D-004 — upstream eligibility vocabulary

```text
FORMALLY-ELIGIBLE
BOUNDED-EXACT-ELIGIBLE
TECHNICAL-REFERENCE-ONLY
DEVELOPMENT-CANDIDATE-ONLY
INELIGIBLE
```

categoryの意味は`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`を正本とし、G2-10 outcomeを見た後に変更しない。

## D-005 — G2-06〜G2-09 direct-use firewall

次をvalidated strategic axisとして直接使用しない。

- G2-06 rich representation / classifier / production-only performance
- G2-07 `F05_ALL` / `lambda=100` / production-only model performance
- G2-08 promoted taxonomy leaves / development promotion result
- G2-09 generalization / counterexample boundary

同じ概念をG2-10で使う場合は、G2-10のfresh `DEVELOPMENT-CANDIDATE-ONLY` constructとして新規定義する。

## D-006 — G2-05 bounded exact boundary

`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`は`BOUNDED-EXACT-ELIGIBLE`とする。ただしstandard initial RAW rootのdepth 0..9 domainだけに限定し、fresh G2-10 stateへexact値を外挿しない。

## D-007 — Research Generation 1 tactical boundary

`TM-S2-C03 = CONFIRMED`は変更しない。G2-10で元scopeを越えるgeneralization labelとして使わない。direct executable useにはStage 0 exact reconstructionを要求する。

## D-008 — Research Generation 1 morphology boundary

`MTAJI-M1 / MTAJI-M2`のhistorical formal claimは変更しない。ただしG2-08でhistorical classifierのexact reconstructionに失敗したため、G2-10でのdirect executable useはStage 0 reconstruction成功まで保留する。

## D-009 — RAW identity

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## D-010 — seed reservation

```text
Stage 0 technical-only = 29300001..29300064 / NON-SCIENTIFIC
Stage 1 scientific = 29310001..29314096 / RESERVED-UNCONSUMED
Stage 2 scientific = 29410001..29418192 / RESERVED-UNCONSUMED
```

G2-09未消費blockを再利用しない。

## D-011 — scientific authorization

初期freeze時点:

```text
Stage 0 scientific inference = NOT APPLICABLE / technical-only
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
```

Stage 1 authorizationにはStage 0 PASSとStage 1 machine-readable source/spec/feature/promotion contract freezeを必須とする。

## D-012 — primary representation

初期representationは単一scalarではなくmultiaxial vector / regime representationとする。composite scalarへの早期圧縮を既定としない。

## D-013 — development / validation firewall

Stage 2 formal populationはStage 1と次のidentity overlapを0とする。

```text
seed overlap = 0
historical trajectory overlap = 0
opening-prefix overlap = 0
selected RAW-state overlap = 0
```

## D-014 — independent verification

formal Stageではsource population、RAW identity、feature computation、representation assignment、aggregate statistics、final decisionをproduction implementationとは可能な限り別実装で再構築する。

同じhelperの再呼び出しだけをmandatory independent verificationの代用としない。

## D-015 — floating-point policy

G2-06の`MOVE_SET_ENTROPY.indexEntropy` accumulation-order mismatchを再発させないため、Stage 0でdeterministic accumulation order、quantization、serializationを固定する。

pre-quantized raw floatのbit-level equalityだけを科学的同一性の唯一条件にしない。比較対象となるcanonical numeric representationをStage 1前に固定する。

## D-016 — no-rescue rule

結果を見た後に、upstream eligibility、axis、feature、search condition、threshold、cluster数、dimension数、primary endpoint、population、seed、subgroup、verification requirementを変更して同じStudyを救済しない。

## D-017 — negative / null / non-estimable acceptance

representation不成立、support不足、assignment instability、independent verifier failure、technical gate failure、resource ceiling failureを正式なterminal resultとして受け入れる。

## D-018 — G2-11 firewall

G2-10はstate representationの構築・検証に限定する。long-horizon transition / persistence / recurrence等をprimary endpointにしない。

## D-019 — documentation language

人間向けMarkdownは日本語主体とし、`DOCUMENTATION_LANGUAGE_POLICY.md`と`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`を適用する。canonical identifier、decision token、field名、hash、pathは変更しない。
