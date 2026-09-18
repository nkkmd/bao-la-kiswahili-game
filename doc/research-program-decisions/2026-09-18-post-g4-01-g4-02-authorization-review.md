# 2026-09-18 — post-G4-01 current-state G4-02 authorization review

## 判定

**`PREREQUISITE-REQUIRED`**

G4-02のscientific executionは**未承認**である。G4-01によってSFCDF familyのcompatibility/readiness gateは満たされたが、Research Generation 4共通contractが要求するfresh formal heldout populationと既存compatibility evidenceの完全なidentity分離を、現在保存されているG4-01記録だけではopening-prefix identityについて検証できない。

このreviewはscientific seedを生成・readせず、formal scientific outcomeを生成せず、G3-04/G4-01 evidenceをG4-02のscientific evidenceとして再利用せずに実施した。

## Review identity

```text
Review ID = G4-02-AUTHORIZATION-REVIEW-2026-09-18-V1
Agenda = G4-02
Repository = nkkmd/bao-la-kiswahili-game
Reviewed main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
Review branch = research/g4-02-authorization-review-20260918
Formal state = PREREQUISITE-REQUIRED
G4-02 Study ID = NOT ASSIGNED
G4-02 scientific seed access = 0
G4-02 scientific outcome generated = false
G4-02 heavy scientific execution = false
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 1. current state

Research Generation 4のcurrent-facing正本文書では、G4-01 `LGTTCI-STUDY1`は次で完了している。

```text
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
SILGM = compatible
GCLD = compatible
G4-02 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
```

G4-01 canonical Stage 1R resultはSFCDFを`compatible = true`とし、scientific effect、formal generalization decision、formal counterexample decisionを生成していない。したがってG4-01はG4-02のreadiness prerequisiteを満たすが、G4-02のscientific conclusionを先取りしない。

## 2. G3-04から移送するformal claims

G3-04 `SFCDF-STUDY1`のformal recordから、G4-02で移送候補となるclaimは次の2件だけである。

1. `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
   - historical decision: `CONFIRMED / MTAJI-GREATER`
   - bounded RAW local geometry / relative depth 5
2. `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
   - historical decision: `CONFIRMED / NAMUA-GREATER`
   - bounded RAW local geometry / relative depth 5

C1はunit-width occupancy、C6はtree/RAW inflation descriptorであり、別々のconstruct・endpointとして保持する。combined latent classは作らない。G3-04のpopulation、seed、threshold、endpoint、direction、formal decisionは変更しない。

## 3. authorization gate review

| Gate | 判定 | 根拠 |
| --- | --- | --- |
| 1. G4-01 prerequisite | **PASS** | G4-01は`COMPATIBILITY-ELIGIBLE-ALL`、SFCDFはcompatible。 |
| 2. 移送対象formal claim | **PASS** | G3-04 C1/C6のcanonical endpointとhistorical directionを一意に特定できる。 |
| 3. C1/C6独立endpoint | **PASS** | G3-04 protocol/decision registerがconstruct分離を明示している。 |
| 4. fresh populationのG3/G4 evidenceからの独立性 | **BLOCKED / PREREQUISITE REQUIRED** | G3-04についてはroot・trajectory・opening-prefix identity firewallが残る。一方G4-01 Stage 1Rの保存source recordにはseed・full trajectory hash・RAW root identityはあるが、opening-prefix identityが保存されていない。RG4共通contractの4-way separationを完全に検証できない。 |
| 5. fresh seed namespace | **FEASIBLE / NOT FROZEN / NOT READ** | 既存namespaceと衝突しない新規namespaceを設計可能だが、Study未承認のため本reviewではformal seed blockを割り当てない。 |
| 6. phase/root family/source policyの事前固定 | **FEASIBLE / NOT FROZEN** | G4-01でSFCDFについて2 source policy × 2 root familyのcompatibilityが確認済み。ただしG4-02 Study contractは未承認のためfreezeしない。 |
| 7. production / independent verification分離 | **PASS-AS-DESIGNABILITY** | RAW depth-5 measurementについて独立implementationとexact canonical comparisonの実績があり、G4-02でも別実装を要求できる。 |
| 8. estimability / technical failure / scientific negativeの分離 | **PASS-AS-DESIGNABILITY** | RG4共通contractおよびG4-01で`NON-ESTIMABLE`と`TECHNICAL-INVALID`を分離済み。G4-02では`NOT-CONFIRMED`をscientific negative/nonconfirmationとして別扱いできる。 |
| 9. resource ceiling / stopping rule | **PASS-AS-DESIGNABILITY** | depth-5 RAW geometryについて既存のbounded resource instrumentationがあり、結果前freezeが可能。ただし未承認のため数値は本reviewでformal freezeしない。 |
| 10. no-rescue / no-rerun | **PASS IF PREREQUISITE RESOLVED WITHOUT RERUN** | G3-04、G3-11、G3-12、G4-01のno-rerun境界は維持可能。ただしG4-01 opening-prefix identityを旧seed再読で再構成する方法は禁止する。 |

## 4. blocking prerequisite

Research Generation 4 `PROGRAM_PLAN.md`は、`FRESH-FORMAL-HELDOUT`をdevelopment / compatibility evidenceから少なくとも次のidentityで分離するよう要求する。

```text
seed
source trajectory
opening prefix
RAW root
```

G4-01 Stage 1Rのdurable source recordは、少なくとも次を保持している。

```text
slot/effective seed
source policy
sourceTrajectorySha256
root family anchor
root rawStateSha256
root state
```

しかし、Stage 1R source unitの保存payloadにはmove sequenceまたはopening-prefix hashが含まれていない。したがってG4-02 candidate sourceがG4-01 compatibility sourceとopening-prefix identityで重複しないことを、保存済みidentityだけから証明できない。

さらにG4-01のfrozen execution amendmentは次を固定している。

```text
completedSourceRereadAuthorized = false
fullFreshWorkflowRerunAuthorized = false
artifactRetentionDays = 90
```

よって、G4-01の旧seedを再読してprefix identityを後付け生成する方法は採用しない。

## 5. prerequisiteを満たす安全な経路

G4-02を再度authorization reviewへ進める前に、次のいずれかを**G4-02 scientific seed access前**に解決する必要がある。

1. **既存artifact-only recovery**  
   G4-01を再実行せず、既に生成済みのimmutable artifact/provenanceの中にopening-prefix identityまたはそれを直接検証できる既存recordが存在することを確認し、identity-only exclusion manifestとしてdurableに固定する。

2. **別個のProgram-level methodology review**  
   既存artifactに必要なidentityが存在しない場合、G4-02とは分離したmethodology reviewを行い、RG4のfreshness contractを変更してよいかを結果・seedを見る前に判断する。G4-02 authorization reviewの内部で黙示的にfreshness条件を弱めてはならない。

どちらの経路でも、G4-01 seedの再読、fresh workflow rerun、G3-12 seed流用、G3-11 depth-10 rerun、G4-10 depth-11 accessは禁止する。

## 6. 保護境界

```text
authoritative scientific state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-01 old 401... namespace = QUARANTINED / NO REUSE
G4-01 Stage 1R fresh workflow = EXECUTED ONCE / NO RERUN
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
public AI change = NOT AUTHORIZED
```

tree occurrenceとRAW graph stateは別constructとして保持する。symmetry、canonicalization、isomorphismは新しいformal validationなしにscientific deduplicationへ使用しない。

## 7. formal decision

**`PREREQUISITE-REQUIRED`**

理由はG4-01 compatibility readinessの不足ではなく、G4-02 formal heldoutのfreshness firewallをRG4 frozen program contractどおりに監査可能な形で構成するためのopening-prefix identity provenanceが不足しているためである。

この状態は`NOT-CONFIRMED`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`のいずれでもない。G4-02のscientific Studyはまだ開始しておらず、formal outcomeは存在しない。

prerequisite解消後に、改めてpost-G4-01 current-state G4-02 authorization reviewを実施する。そのreviewが`AUTHORIZED`となった場合に限り、Study ID、正式題目、research branch、Stage構成、fresh seed block、population、selection rule、endpoint、threshold、multiple-testing rule、estimability gate、resource ceiling、stopping rule、no-rescue rule、independent verification route、formal decision mappingをprospectiveにfreezeする。
