# 2026-09-18 — G4-02 prerequisite解消後の認可レビュー V2

## 判定

**`G4-02-AUTHORIZED`**

ただし、このauthorizationが許可するのは次に限定する。

- 正式Study ID・題目・research branchの確定
- preregistration / protocol / machine-readable specのprospective freeze
- non-scientific technical fixture / Stage 0 validation
- Stage 1/Stage 2 execution authorization文書の準備

**fresh scientific seed accessはまだ許可しない。** Stage 1 compatibility populationとStage 2 formal heldout populationは、それぞれ別のpre-access authorizationを必要とする。

## 審査識別情報

```text
Review ID = G4-02-AUTHORIZATION-REVIEW-2026-09-18-V2
Agenda = Research Generation 4 / G4-02
Repository = nkkmd/bao-la-kiswahili-game
Reviewed main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
Review branch = research/g4-02-authorization-review-20260918
Initial review = PREREQUISITE-REQUIRED
Methodology amendment = RG4-MA-001-G4-02-LEGACY-COMPATIBILITY-FRESHNESS
Amendment state = AMENDMENT-ACCEPTED / G4-02-SFCDF-ONLY / PREREQUISITE-MATERIALIZED
V2 formal state = G4-02-AUTHORIZED
G4-02 scientific seed access at authorization = 0
G4-02 scientific outcome generated at authorization = false
G4-02 heavy scientific execution at authorization = false
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 1. initial blockerの解消

V1 reviewでは、Research Generation 4共通contractがformal heldoutとcompatibility evidenceの間に要求するopening-prefix分離を、G4-01 Stage 1Rの保存済みrecordだけでは監査できないため`PREREQUISITE-REQUIRED`とした。

その後、G4-02 scientific seed access前に独立したProgram-level methodology reviewを実施し、G4-01がeffect/direction/p-value/generalization/counterexampleを生成しないcompatibility-only evidenceであったことを確認した。G4-01 old seedの再読・rerunを行わず、G4-02 SFCDF moduleだけに限定したlegacy freshness amendmentを固定した。

さらに、既存immutable recovery artifactだけからidentity-only firewallをmaterializeした。

```text
firewall = doc/research-generation-4/prereg/g4-02-legacy-compatibility-firewall/MANIFEST.json
G4-01 Stage 1 old SFCDF namespace = 40111001..40111384 / permanently quarantined
G4-01 Stage 1R primary SFCDF namespace = 40211001..40211384 / forbidden
G4-01 Stage 1R paired reserve SFCDF namespace = 41211001..41211384 / actual use 0 / forbidden
Stage 1R trajectory identities = 384
Stage 1R complete-anchor RAW-root identities = 1198
opening-prefix identity against G4-01 Stage 1R = NOT-RECORDED / NOT-AUDITABLE / NOT-ASSERTED
identity core SHA-256 = 5672098cd04476f6e416de424908c9430562ff64433d16b31a66c233c53c81dd
fresh G4-01 seed reread = 0
G4-01 workflow rerun = 0
```

これにより、V1 blockerは「完全独立を偽って主張する」のではなく、監査可能な範囲とlegacy limitationを明示する形で解消した。

## 2. authorization gate再審査

| Gate | V2判定 | 根拠 |
| --- | --- | --- |
| G4-01 prerequisite | **PASS** | `LGTTCI-STUDY1 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`、SFCDF compatible。 |
| historical claims | **PASS** | G3-04 C1=`MTAJI-GREATER`、C6=`NAMUA-GREATER`を別endpointとして固定可能。 |
| construct separation | **PASS** | C1 corridor descriptorとC6 tree/RAW inflation descriptorを統合しない。 |
| G3-04 freshness firewall | **PASS** | root/trajectory/first-16-prefix/seed identity-only exclusionを利用可能。 |
| G4-01 legacy compatibility firewall | **PASS-WITH-DECLARED-LIMITATION** | primary/reserve seed、full trajectory、RAW rootはdurable exact-hash exclusion可能。opening prefixは非重複を主張しない。 |
| G4-02 internal heldout separation | **PASS-AS-DESIGNABLE** | compatibilityとformal heldoutで4-way separationをprospectiveに固定可能。 |
| new seed namespace | **PASS-AS-DESIGNABLE** | `403...`/paired `413...`候補はcurrent repository検索で既存使用を検出しない。freezeはpreregistrationで行う。 |
| source policy / root family | **PASS-AS-DESIGNABLE** | G4-01でSFCDF compatibilityを通過した2 policy × 2 root familyをscientific-effect-free instrument basisとして使用可能。 |
| exact endpoint computation | **PASS-AS-DESIGNABLE** | RAW relative depth 5のC1/C6 exact rational/integer計算をproduction/independent別実装で検証可能。 |
| multiplicity / decision mapping | **PASS-AS-DESIGNABLE** | 2 claims × 4 frozen domainsをoutcome前に8-test familyとして固定可能。 |
| estimability / technical failure separation | **PASS-AS-DESIGNABLE** | support/definedness/resource不足=`NON-ESTIMABLE`、integrity mismatch=`TECHNICAL-INVALID`として分離可能。 |
| no-rescue / no-rerun | **PASS** | fresh access後のseed追加・置換、threshold緩和、root replacement、same-evidence repair rerunを禁止できる。 |
| protected evidence | **PASS** | G3-11 depth10 rerun、G3-12 Stage2 seed、G4-10 depth11、public AIを使用しない。 |
| durable heavy execution route | **PASS-AS-DESIGNABLE** | sharded immutable-artifact executionとdownstream seed-free verificationをprospectiveに固定可能。 |

## 3. G4-02で許可されるscientific question

G4-02が検証してよい中心問いは次に限定する。

> G3-04でformalに確認されたC1 unit-width occupancyの`MTAJI-GREATER`とC6 cumulative tree/RAW ratioの`NAMUA-GREATER`は、G4-01でcompatibilityを確認したfresh source policy × root family domainのどこで同方向に再現し、どこで反対方向のformal counterexampleまたはnonconfirmationを示すか。

これはwhole-Bao universal law、game-theoretic forcing、optimality、human difficulty、public AI strengthを検証するStudyではない。

## 4. 必須のprospective design条件

Study-definition freezeでは少なくとも次を結果前に固定する。

1. Study ID、英語/日本語正式題目、research branch、baseline main SHA
2. Stage 0 technical、Stage 1 fresh compatibility、Stage 2 fresh formal heldoutのStage ID
3. 2 source policy × 2 root familyの4 domain cell
4. source-trajectory単位のpaired Namua/Mtaji experimental unit
5. policy / root-family assignmentとgeometry-blind selection key
6. C1/C6 endpoint定義とupstream frozen direction
7. Stage 1ではeffect direction/p-valueを生成しないこと
8. Stage 2のexact two-sided sign test、zero handling、minimum nonzero、Holm family、decision mapping
9. G3-04・G4-01・G4-02 Stage 1/2間のfreshness firewall
10. seed blocks、paired infrastructure reserve、最大read数、reserve使用条件
11. production / independent exact agreementとcanonical scientific JSON hashing
12. resource ceilings、stopping rule、technical-invalid rule、no-rescue rule
13. artifact-first durable execution、one-shot authorization、rerun prohibition

C1の結果を見てC6のpopulation、threshold、seed、resource ceilingを変えてはならず、その逆も禁止する。

## 5. Stage authorization境界

このV2 decisionだけではfresh seedをreadできない。

```text
Study definition / preregistration = AUTHORIZED
Stage 0 non-scientific technical validation = AUTHORIZED AFTER FROZEN SPEC EXISTS
Stage 1 fresh compatibility seed access = NOT YET AUTHORIZED
Stage 2 fresh formal heldout seed access = NOT YET AUTHORIZED
main integration = NOT AUTHORIZED
```

Stage 1をauthorizeするには、preregistration/specと実行bindingをfreezeし、fresh seed access 0を確認したpre-access reviewを別途通過する必要がある。Stage 2はStage 1 closure後に別authorizationを必要とする。

## 6. 正式判定

**`G4-02-AUTHORIZED`**

V1のprerequisiteは、G4-01 evidenceを再実行・救済せず、legacy limitationを明示したidentity-only firewallとしてmaterializeされた。したがってG4-02のStudy-definitionとprospective preregistrationを開始してよい。

このauthorizationはpositive resultを期待・要求しない。`GENERALIZES-WITHIN-FROZEN-DOMAIN`、`COUNTEREXAMPLE-BOUNDARY-DETECTED`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`はいずれも結果前に対称的に受け入れる。
