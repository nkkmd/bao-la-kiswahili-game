# 2026-09-18 — post-G4-01 current-state G4-02 認可レビュー V2

Review ID: `G4-02-AUTHORIZATION-REVIEW-2026-09-18-V2`  
基準main: `c5689d70cd017171e7738140ba9186a117f732f1`  
判定: **`G4-02-AUTHORIZED-FOR-PREREG-AND-STAGE0`**  
fresh scientific seed access: **0 / NOT AUTHORIZED YET**  
formal scientific outcome: **NOT GENERATED**

## 1. V1からの更新

V1は、Research Generation 4の通常freshness contractが要求する

`seed / source trajectory / opening prefix / RAW root`

のうち、G4-01 Stage 1R SFCDF archiveにopening-prefix identityが保存されていないため、`PREREQUISITE-REQUIRED`とした。

その後、scientific seedへ触れずに次を完了した。

1. G4-01 Stage 1R recovery source artifactをidentity-onlyで監査。
2. G4-01 SFCDF compatibilityがformal effect、direction、p-value、generalization/counterexample decisionを生成していないことをコードとaggregate contractから再確認。
3. legacy compatibility recordだけに限定するProgram-level amendment `RG4-MA-001-G4-02-LEGACY-COMPATIBILITY-FRESHNESS`をprospectiveに固定。
4. Stage 1R SFCDFの384 full-trajectory identitiesと1,198 RAW-root identitiesをdurable firewallへ固定。
5. 旧Stage 1 SFCDF seed namespace `40111001..40111384`をpermanent quarantineとして固定。
6. Stage 1R SFCDF seed namespace `40211001..40211384`、384 trajectory hashes、1,198 root hashesをG4-02から完全排除する規則を固定。
7. G4-02内部のdevelopment / formal heldout間では通常の4-way separationを維持することを固定。

legacy firewall manifest:

`doc/research-generation-4/identity-firewalls/g4-02-g4-01-legacy-sfcdf/MANIFEST.json`

- manifest core SHA-256: `efab4139f92349b8f1f83460f475acdb5371752ee6d464fc8c6466887bb09a74`
- Stage 1R identity core SHA-256: `38cdd972217a70fa11d5d6632312ef7fe1bec7191a1f7d0d8d6460c72f1a90fd`
- trajectory count: 384 / unique 384
- RAW-root count: 1,198 / unique 1,198
- opening prefix: `NOT-RECORDED / NOT-AUDITABLE / NOT-ASSERTED`

G4-01 old seeds were not reread and no G4-01 workflow/replay was rerun.

## 2. 認可gate

| Gate | 判定 | 根拠 |
|---|---|---|
| G4-01 prerequisite | PASS | `LGTTCI-STUDY1 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`; SFCDF compatible |
| upstream claims | PASS | G3-04 C1/C6はStage 2 formalで別個にconfirmed |
| claim independence | PASS | C1/C6を別endpoint・別decisionとして固定可能 |
| legacy freshness | PASS-WITH-DECLARED-LIMITATION | amendment + durable 3-way Stage1R firewall + old Stage1 seed quarantine |
| G3-04 scientific firewall | PASS | seed / trajectory / first-16 prefix / RAW rootのidentity-only exclusionが可能 |
| new seed namespace | PASS | `40421xxx` / `40422xxx`候補にrepository上の衝突を認めず、preregで予約可能 |
| source policy/root family | PASS | G4-01 compatibility済みP1/P2 × RF1/RF2をfresh transfer domainとして固定可能 |
| production/independent separation | PASS-AS-DESIGN | RAW depth-5 measurementを別実装でexact agreement要求可能 |
| estimability / negative / technical split | PASS-AS-DESIGN | support不足、科学的非確認、技術破綻を別decisionへ写像可能 |
| multiplicity | PASS-AS-DESIGN | C1/C6 × 4 frozen cellsの8 formal testsを単一Holm familyへ固定可能 |
| resource/stopping | PASS-AS-DESIGN | per-root ceiling、fixed source slots、no extension/no rescueを固定可能 |
| protected boundaries | PASS | G3-11 depth10、G3-12、G4-10 depth11、public AIを触れずに実施可能 |

## 3. legacy freshnessの限定

G4-02は、G3-04 scientific evidenceおよびG4-02内部について4-way heldout separationを要求する。

G4-01 Stage 1Rについては、保存されている

- seed
- full source trajectory SHA-256
- RAW root SHA-256

を完全排除する。opening-prefix overlapは監査不能であるため、**非重複も完全独立も主張しない**。

旧G4-01 Stage 1は監査可能な最終result artifactがなく、全SFCDF seed namespaceをquarantineする。未知のtrajectory/root/prefix分離は主張しない。

この限定はG4-02 SFCDF moduleだけに適用し、他moduleや将来研究へ自動継承しない。

## 4. 認可される次工程

本レビューにより次を認可する。

- formal Study ID / titlesの固定
- research branchの作成
- preregistrationの固定
- Stage 0 technical fixtures / verification
- fresh Stage 1/Stage 2 seed namespaceの**予約**
- identity firewall、source policy、root family、population、endpoint、threshold、multiplicity、resource ceiling、stopping/no-rescue、decision mappingの固定

本レビューだけでは次を認可しない。

- fresh Stage 1 scientific/compatibility seed access
- fresh Stage 2 formal seed access
- formal effect / p-value / scientific decision生成
- G3-11 depth10 rerun
- G3-12 seed/evidence reuse
- G4-10 depth11 access
- main統合
- public AI変更

## 5. Study開始時の必須契約

G4-02ではC1/C6を独立claimとして同時にfreezeし、一方の結果で他方のpopulation、seed、selection、threshold、multiplicity、stopping ruleを変更してはならない。

formal decision候補は最低限次を事前固定する。

- `GENERALIZES-WITHIN-FROZEN-DOMAIN`
- `COUNTEREXAMPLE-BOUNDARY-DETECTED`
- `NOT-CONFIRMED`
- `NON-ESTIMABLE`
- `TECHNICAL-INVALID`

technical failureはscientific negativeとして数えない。

## 6. 最終判定

**`G4-02-AUTHORIZED-FOR-PREREG-AND-STAGE0`**

V1のprerequisiteは解消した。次工程ではpreregistrationを完全freezeし、Stage 0を通過した後にのみfresh Stage 1 accessの別authorizationを行う。

mainへの統合は禁止を維持する。
