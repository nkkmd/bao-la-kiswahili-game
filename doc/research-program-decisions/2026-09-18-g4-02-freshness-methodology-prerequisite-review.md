# 2026-09-18 — G4-02 freshness methodology prerequisite review

## 判定

**`PREREQUISITE-SATISFIED-BY-SCOPED-METHODOLOGY-AMENDMENT`**

このdecisionはG4-02だけに適用する。Research Generation 4の元の`PROGRAM_PLAN.md`は変更せず、歴史的にfrozenなProgram contractとして保持する。本decisionは、G4-01 compatibility evidenceにopening-prefix identityが保存されていないという事後に判明したprovenance制約に対し、scientific outcomeを見る前にG4-02用のfreshness firewallを限定的に補足するものである。

## 1. 前提

G4-02の最初のauthorization reviewは`PREREQUISITE-REQUIRED`だった。

blocking pointは、RG4共通contractが`FRESH-FORMAL-HELDOUT`をdevelopment / compatibility evidenceから

```text
seed
source trajectory
opening prefix
RAW root
```

で分離するよう要求する一方、G4-01 Stage 1Rのfrozen source artifactにはopening-prefix identityが保存されていないことだった。

G4-01では次がfrozenである。

```text
completedSourceRereadAuthorized = false
fullFreshWorkflowRerunAuthorized = false
scientificEffectGenerated = false
formalGeneralizationDecisionGenerated = false
formalCounterexampleDecisionGenerated = false
```

したがって旧G4-01 seedを再読して不足identityを後付け生成する方法は採用しない。

## 2. G3-04に対するfreshness contract

G3-04はformal scientific evidenceであるため、従来の4-way firewallを**変更しない**。

G4-02 candidate sourceはG3-04の既存identity-only firewallに対し、少なくとも次の全てで非重複でなければならない。

- source seed namespace
- source trajectory identity
- opening-prefix identity
- RAW root identity

利用する既存正本:

`doc/branch-expansion-compression-transition/prereg/UPSTREAM_IDENTITY_FIREWALL.json`

このfileはG3-04 Stage 1 / Stage 2を含むidentity-only setを保持し、scientific outcome fieldを保持しない。

```text
rootRawSha256 = 124
sourceTrajectorySha256 = 124
openingPrefixSha256 = 67
identityCoreSha256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
```

## 3. G4-01 compatibility evidenceに対する限定補足

G4-01 Stage 1Rはformal effect studyではなく、compatibility/readiness studyだった。SFCDFではsource population、preflight eligibility、production / independent exact agreementを確認したが、C1/C6のphase差、effect direction、effect magnitude、p-value、generalization、counterexample decisionを生成していない。

したがってG4-02に限り、G4-01 compatibility evidenceからの分離条件を次へ限定補足する。

### 必須の非重複

1. **seed**
   - G4-01 SFCDF primary namespace `40211001..40211384`を全て除外する。
2. **full source trajectory**
   - G4-01 SFCDF 384 trajectory identityをBloom exclusion filterで照合する。
   - Bloom positiveはfalse positiveの可能性があっても必ず除外する。
   - Bloom negativeだけを「G4-01 trajectory setに含まれない」と扱う。
3. **RAW root**
   - G4-01 SFCDFで保存された1340 unique RAW-root identityをBloom exclusion filterで照合する。
   - Bloom positiveは必ず除外する。
4. **scientific outcome reuse禁止**
   - G4-01 measurement digest、root geometry value、effect-like aggregateをG4-02 selection、threshold、claim判定へ使用しない。

### opening-prefixの扱い

G4-01 compatibility sourceについてのみ、opening-prefix identityの非重複をG4-02 authorizationのmandatory gateから外す。

理由:

- G4-01 artifactにopening-prefix identityが存在しない。
- 旧seed再読による再構成はfrozen no-rerun boundaryに反する。
- G4-01はC1/C6 effect direction/magnitudeを生成しておらず、opening-prefix overlapを使ってformal effectを選別した記録もない。
- G4-02ではseed、full trajectory、RAW rootの全てをG4-01 compatibility evidenceから分離し、G4-01 scientific-value reuseを禁止する。

この補足は「opening-prefix overlapが絶対に存在しない」と主張するものではない。G4-01 compatibility evidenceとのprefix-level strict independenceは検証不能であり、その限界をG4-02 final interpretationにも残す。

## 4. exclusion firewallのdurable materialization

G4-01 SFCDF source bundle artifact `10517090411`から、scientific valueを保持せずidentityだけをmaterializeした。

正本:

- `doc/research-generation-4/g4-02-prerequisites/FRESHNESS_FIREWALL_MANIFEST.json`
- `doc/research-generation-4/g4-02-prerequisites/G4_01_SFCDF_TRAJECTORY_BLOOM.b64`
- `doc/research-generation-4/g4-02-prerequisites/G4_01_SFCDF_ROOT_BLOOM.b64`
- `tools/experiments/verify-g4-02-freshness-firewall.js`

binding:

```text
source artifact ID = 10517090411
artifact digest = sha256:3e1312fbd2fed104dc25ea53448b5f76feee2f37bc2b34ef09274e4df690a65b
source manifest deterministic core = 8111413773dfd9899b4562ee5089223a0aef75b6885041f4eacb1006111d7cdd
SFCDF source entry core = 2c0181b5825e5f9cb07a57788373ad9957f19dc32858871ff9e7eec34214b3fc
trajectory Bloom inserted unique = 384
RAW-root Bloom inserted unique = 1340
trajectory bitset SHA-256 = e3f2eb64d9e9ba544997a2644d917ab83548434b96d969564f08d2a4b95875f1
root bitset SHA-256 = ac2304c92e3aa7ce27b087d65c1589f664cf2f2231aac0b034d46fb04c32eddf
Bloom false-negative verification = PASS
fresh seed reread = 0
scientific outcome generated = 0
```

Bloom filterはfalse positiveを許容するがfalse negativeを許容しない設計である。false positiveはfresh candidateを余分に除外するだけなので、科学的にfavorabilityを作らない。filter positiveを救済・再判定してはならない。

## 5. G4-02 executionへのmandatory rule

G4-02のformal source selectionでは、endpoint測定前に次を適用する。

1. G3-04 exact identity firewallでroot / trajectory / opening-prefix overlapを除外する。
2. G4-01 seed namespace overlapを除外する。
3. G4-01 trajectory Bloom positiveを除外する。
4. G4-01 RAW-root Bloom positiveを除外する。
5. exclusionsによりfrozen support gateを満たせなければ`NON-ESTIMABLE`とする。
6. support不足後のseed extension、replacement、threshold relaxation、favorable subgroup rescueを禁止する。

## 6. このamendmentが変更しないもの

- G3-04 C1/C6 formal decision
- G4-01 `COMPATIBILITY-ELIGIBLE-ALL`
- G3-11 depth 10 no-rerun
- G3-12 closed / no-repair boundary
- G4-10 depth 11 protection
- RAW identity
- validated transform set `[]`
- C1/C6 endpoint definition
- public AI

## 7. 結論

G4-01 opening-prefix identity欠損を理由に旧seedを再読するより、G4-02だけに限定した上記3-identity + no-outcome-reuse firewallの方が、no-rerun boundary、監査可能性、fail-closed原則を同時に維持する。

よってG4-02 authorization reviewを再実施するためのprerequisiteは満たされた。

**`PREREQUISITE-SATISFIED-BY-SCOPED-METHODOLOGY-AMENDMENT`**
