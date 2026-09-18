# Research Generation 4 — G4-02 legacy compatibility freshness amendment

作成日: 2026-09-18  
Amendment ID: `RG4-MA-001-G4-02-LEGACY-COMPATIBILITY-FRESHNESS`  
状態: **`ACCEPTED / PROSPECTIVE-BEFORE-G4-02-SCIENTIFIC-SEED-ACCESS`**  
対象: G4-02 SFCDF transfer moduleのみ  
基準main: `c5689d70cd017171e7738140ba9186a117f732f1`  
作業branch: `research/g4-02-authorization-review-20260918`

## 1. 目的

Research Generation 4のProgram plan §4.3は、`FRESH-FORMAL-HELDOUT`をdevelopment / compatibility evidenceから

`seed / source trajectory / opening prefix / RAW root`

の4 identityで分離するよう要求している。

G4-01 `LGTTCI-STUDY1`のStage 1R SFCDF source artifactにはseed、full source trajectory SHA-256、RAW root SHA-256は保存されたが、opening-prefix SHA-256は保存されなかった。旧Stage 1はfresh seed access開始後に実行環境が失われ、監査可能な最終result artifactを残さず`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じられている。

この欠落をG4-01の旧seed再読やworkflow rerunで補うことは、G4-01のfrozen no-rerun boundaryに反する。本amendmentは、G4-02 scientific seed access前に、このlegacy compatibility recordだけに適用する限定的なfreshness監査規則をprospectiveに定める。

## 2. 変更しない原則

本amendmentは次を変更しない。

- G3-04 `SFCDF-STUDY1`のformal decisions、population、seed、endpoint、direction、threshold
- G4-01 `LGTTCI-STUDY1`のclosure、compatibility decision、no-rerun boundary
- Program plan §4.3の通常規則
- G4-02内部のdevelopment / formal heldout separation
- RAW authoritative identity
- validated transform set `[]`
- G3-11 depth 10、G3-12、G4-10 depth 11の保護境界
- public AI

Program plan原文は事後編集しない。本amendmentはG4-02 SFCDF moduleに対する明示的な追加記録としてのみ効力を持つ。

## 3. G4-01 legacy evidenceの区分

### 3.1 旧Stage 1

`LGTTCI-S1-COMPATIBILITY-2026-09-17-v1`は、監査可能な最終scientific/compatibility resultを残していない。

正式扱い:

```text
state = EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
40111001..40111384 = QUARANTINED / PERMANENTLY FORBIDDEN FOR G4-02
scientific effect retained = false
formal direction retained = false
formal p-value retained = false
trajectory/root/prefix complete identity record = unavailable
trajectory/root/prefix non-overlap with G4-02 = NOT AUDITABLE / NOT ASSERTED
```

G4-02は401 SFCDF namespaceを一切使用しない。この旧Stage 1をG4-02のscientific evidence、negative evidence、selection evidenceとして使用しない。

### 3.2 Stage 1R

`LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`のimmutable recovery source bundle:

```text
artifact ID = 10517090411
artifact digest = sha256:3e1312fbd2fed104dc25ea53448b5f76feee2f37bc2b34ef09274e4df690a65b
SFCDF primary source slots = 384
SFCDF slot/effective seed range = 40211001..40211384
SFCDF sourceTrajectorySha256 count = 384
SFCDF complete-anchor rootRawSha256 unique count = 1198
openingPrefixSha256 = NOT RECORDED
scientific effect generated = false
formal generalization decision generated = false
formal counterexample decision generated = false
```

Stage 1Rについては、保存済みの3 identityをG4-02 source selectionで完全排除する。

## 4. G4-02に適用する限定freshness rule

G4-02 formal heldoutのfreshnessは、次の3層で監査する。

### A. G3-04およびその他の保存済みscientific identity firewall

従来どおり4-way separationを要求する。

```text
seed
full source trajectory
first-16 opening prefix
RAW root
```

重複候補はselection前にrejectする。G3-04 scientific outcome値をselectionへloadしない。

### B. G4-01 Stage 1R legacy compatibility evidence

次をすべて満たすことを要求する。

```text
G4-02 seed ∩ {40211001..40211384} = empty
G4-02 full source trajectory SHA-256 ∩ Stage1R SFCDF trajectory set = empty
G4-02 selected RAW root SHA-256 ∩ Stage1R SFCDF complete-anchor root set = empty
opening-prefix disjointness = NOT AUDITABLE / NOT ASSERTED
```

opening-prefix overlapが未知であることを、完全独立と読み替えない。

### C. G4-02内部

G4-02で新規生成するdevelopment / compatibility / formal heldout相互間は、Program plan原則どおり4-way separationを完全に要求する。

```text
seed
full source trajectory
first-16 opening prefix
RAW root
```

本amendmentをG4-02内部のfreshness緩和には使用できない。

## 5. この限定例外を許容する理由

G4-01 compatibility evidenceはroot contract、helper precondition、測定可能性、production / independent一致、resource readinessだけを検証する目的で生成された。canonical aggregateは明示的に次を記録している。

```text
scientificEffectGenerated = false
formalGeneralizationDecisionGenerated = false
formalCounterexampleDecisionGenerated = false
```

SFCDF measurement taskはendpointのraw geometry valueをformal resultとして保存せず、production / independent exact agreementをdigestで検証した。

したがって、G4-01 Stage 1Rとのopening-prefix非重複を監査できないことは、G4-02 formal scientific effectを既知のG4-01 scientific effectへ適応させる経路を作らない。ただしshared early trajectory contextによる依存可能性を完全には排除できないため、その非重複または完全独立を主張してはならない。

この既知の制約を隠すより、監査可能な3 identityを完全排除し、未知の1 identityを明示した上でG4-02内部のfresh holdoutを厳密に保持する方が、旧seed再読やG4-01 rerunより保守的である。

## 6. 必須のdurable firewall

G4-02 scientific source access前に、Stage 1R recovery source bundleからSFCDFについて次をidentity-onlyとして固定する。

- seed range
- sourceTrajectorySha256 set
- complete-anchor rootRawSha256 set
- artifact ID / digest
- set count
- deterministic identity-core SHA-256
- `openingPrefixSha256 = NOT-RECORDED`

このmaterializationではG4-01を再実行しない。既存artifactのidentity fieldだけを読む。geometry outcome、effect direction、p-valueは取り込まない。

旧Stage 1についてはidentity recordを再構成しない。401 SFCDF namespace全体のpermanent quarantineだけを固定する。

## 7. G4-02の解釈上の制約

G4-02がpositive formal resultとなっても、次を主張してはならない。

- G4-01 Stage 1/1Rとopening-prefix levelで完全に独立である
- whole-Bao universal lawである
- game-theoretic forcingを示した
- human difficultyを示した
- public AI改善を直接支持した

許されるfreshness表現は、G3-04およびG4-02内部については4-way heldout、G4-01 Stage 1Rについてはaudited 3-way disjoint、旧Stage 1についてはseed namespace quarantineと明示したbounded claimだけである。

## 8. no-rescue / no-rerun

禁止:

- G4-01 old seedの再読
- G4-01 Stage 1/1R workflow rerun
- opening prefixを後付けするためのreplay
- G3-12 Stage 2 seed利用
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- G4-02 outcome確認後のfreshness rule変更
- 本amendmentの他moduleへの自動拡張

## 9. 方法論判定

**`AMENDMENT-ACCEPTED / G4-02-SFCDF-ONLY`**

条件は、G4-02 scientific seed access前に§6のidentity-only firewallをdurableに固定し、そのhash/countをG4-02 preregistrationとauthorizationへbindすることである。

この判定自体はG4-02をscientifically authorizeしない。firewall materialization後にG4-02 authorization reviewを再実施する。
