# 2026-09-24 — post-G4-02 current-state G4-03 認可レビュー

Review ID: `G4-03-AUTHORIZATION-REVIEW-2026-09-24-V1`  
Agenda: `Research Generation 4 / G4-03`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `dfc80a8fbf4487f7d6eb24e28908849d51a141ee`  
判定: **`G4-03-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
fresh scientific seed access: **0 / NOT AUTHORIZED YET**  
formal scientific outcome: **NOT GENERATED**

## 1. 審査対象

G4-03のAgenda上の問いは、G3-07 `SILGM-STUDY1`でformal confirmationを得た次の3 claimについて、fresh source policy、fresh reachable-root family、phase strataの下でも同じ関連方向が再現する範囲と反対方向の境界をprospectiveに検証できるか、である。

```text
SC1 DEPTH × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH = HIGHER-IN-HIGH
SC2 NODE-BUDGET × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH = HIGHER-IN-HIGH
SC3 QUIESCENCE × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH = HIGHER-IN-HIGH
```

G3-07の正式結果はfrozen population内の非因果的associationであり、best-move correctness、game-theoretic value、人間の難しさ、AI棋力を意味しない。この境界をG4-03でも維持する。

## 2. current-state prerequisite

```text
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED before this review
```

G4-02の終了状態はG4-03のscientific prerequisiteではなく、G4-02のtechnical-invalid resultをG4-03のpositive/negative evidenceとして使用しない。

G4-01 canonical Stage 1R resultはSILGM familyを`compatible = true`とし、scientific effect、formal generalization decision、formal counterexample decisionを生成していない。よってG4-01はG4-03のreadiness prerequisiteを満たすが、G4-03のscientific conclusionを先取りしない。

## 3. upstream claim identity

G3-07 formal Stage 2で確認された3 claimだけをpositive transfer targetとする。

固定 predictor:

```text
metric = SILGM-G1-ROOT-LEGAL-WIDTH
Namua threshold = 4
Mtaji threshold = 3
HIGH = rootLegalWidth > phase threshold
LOW = 2 <= rootLegalWidth < phase threshold
EQUAL = rootLegalWidth = phase threshold / association sampleから除外しsupport diagnosticのみ
```

固定 endpoint:

```text
SILGM-E3-RANKING-PREORDER-CHANGE
```

固定 peer search contrasts:

```text
SC1 DEPTH       = D2_Q1 vs D3_Q1
SC2 NODE-BUDGET = B256_Q1_MAXD3 vs B1024_Q1_MAXD3
SC3 QUIESCENCE  = D2_Q0 vs D2_Q2
```

いずれのsearch conditionもtruth/reference/correct conditionとは扱わない。

## 4. fresh transfer axes

G4-01でSILGM compatibilityを確認した軸だけをG4-03の候補domainとして使用できる。

Source policy:

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

Root family:

```text
RF1 = LGTTCI-RF1-MID-ANCHOR
  Namua: exact ply 20 / nonterminal / phase=namua
  Mtaji: first nonterminal phase=mtaji state at ply >= 40
RF2 = LGTTCI-RF2-OFFSET-ANCHOR
  Namua: exact ply 28 / nonterminal / phase=namua
  Mtaji: exact ply 52 / nonterminal / phase=mtaji
```

Formal transfer domainsは`P1×RF1`、`P1×RF2`、`P2×RF1`、`P2×RF2`の4 cellとし、各cell内でNamua/Mtajiを事前固定したstrataとして扱う。

## 5. freshness / evidence firewall

G4-03はG3-07、G3-12、G4-01のrepair/reopenではない。fresh access前にidentity-only firewallを固定する。

少なくとも次を再利用しない。

### G3-07

```text
Stage 1 seeds = 31710001..31710256
Stage 2 seeds = 31720001..31720384
prior full trajectories
prior opening prefixes
prior selected RAW roots
```

G3-07のscientific measurement value、p-value、candidate outcomeをfresh source selectionへ入力しない。

### G3-12

```text
G3-12 scientific seeds/evidence = reuse prohibited
LGTGGC-STUDY1 = historical methodology reference only
```

G3-12のtechnical-invalid resultをpositive/negative scientific evidenceとして使用しない。

### G4-01 SILGM compatibility

```text
interrupted Stage 1 SILGM seeds = 40112001..40112768 / permanent quarantine
Stage 1R SILGM primary seeds = 40212001..40212768 / exclusion
Stage 1R paired reserve namespace = 41212001..41212768 / exclusion
```

G4-01 Stage 1Rではreserve useは0であったが、namespace全体をG4-03から除外する。保存済みsource artifactsから監査可能なtrajectory / RAW-root identityをfresh access前にdurable firewallへmaterializeする。監査不能なidentityについて非重複を主張しない。

G4-03 Stage 2はG4-03 Stage 1のseed、full trajectory、opening-prefix、selected RAW-root identityを排除する。

## 6. seed namespace readiness

repository default branchの事前検索で次の候補開始seedに予約衝突を認めなかった。

```text
Stage 1 candidate block start = 40312001
Stage 2 candidate block start = 40322001
```

正式なend、count、assignment、reserve ruleはpreregistrationでscientific access前に固定する。seed extensionは認可しない。

## 7. inferential design readiness

G3-07のclaim identityを変更せずtransferを検証するため、以下をpreregistrationでfreeze可能である。

- fixed predictor thresholds `Namua=4`, `Mtaji=3`
- three fixed E3 contrasts
- four policy×root-family transfer domains
- Namua/Mtaji stratification
- exact conditional hypergeometric arithmetic
- two-sided exact tail for same-direction generalizationとopposite-direction counterexampleの対称判定
- `3 contrasts × 4 domains = 12` fixed formal tests
- Holm-Bonferroni family-wise alpha `1/20`
- `GENERALIZATION-CONFIRMED` / `COUNTEREXAMPLE-CONFIRMED` / `NOT-GENERALIZED` / `NON-ESTIMABLE` / `TECHNICAL-INVALID`の分離

Stage 1はeffect discoveryやthreshold relearningに使用せず、population support、endpoint definedness、production/independent exactness、resource readiness、firewall exactnessだけを確認する設計とする。

## 8. 認可gate

| Gate | 判定 | 根拠 |
|---|---|---|
| G4-01 prerequisite | PASS | SILGM=`compatible=true` / `COMPATIBILITY-ELIGIBLE-ALL` |
| G3-07 upstream claims | PASS | SC1/SC2/SC3 × E3 × G1がformal `CONFIRMED / HIGHER-IN-HIGH` |
| claim identity freeze | PASS-AS-DESIGN | threshold、endpoint、3 contrastsを変更せず固定可能 |
| fresh transfer axes | PASS | G4-01 compatibility済みP1/P2 × RF1/RF2 |
| G3-07 scientific firewall | PASS-AS-PREREQUISITE | prior seed namespace既知、identity firewallをfresh access前に固定可能 |
| G4-01 compatibility firewall | PASS-AS-PREREQUISITE | SILGM seed namespace既知、Stage 1R artifactsからidentity-only materialization可能 |
| G3-12 separation | PASS | evidence/seed reuseを禁止しmethodology referenceだけに限定可能 |
| new seed namespace | PASS-AS-DESIGN | candidate start `40312001` / `40322001`に予約衝突なし |
| inferential exactness | PASS-AS-DESIGN | G3-07 exact hypergeometric + G3-12 historical two-sided transfer designをfresh implementationで独立検証可能 |
| multiplicity | PASS-AS-DESIGN | 12 fixed testsを単一Holm familyへ固定可能 |
| estimability / negative / technical split | PASS-AS-DESIGN | support不足、nonsignificance、opposite direction、technical failureを分離可能 |
| protected boundaries | PASS | G3-11 depth10 rerun、G4-10 depth11 access、public AI変更なしで実施可能 |

## 9. 認可される次工程

本レビューにより次を認可する。

- formal Study ID / titlesの固定
- research branchの使用
- preregistrationの作成・freeze
- Stage 0 technical fixtures / verification
- Stage 1 / Stage 2 fresh seed namespaceの予約のみ
- G3-07 / G4-01 / G4-03内部identity firewall契約の固定
- source policy、root family、population、threshold、endpoint、formal test、multiplicity、resource ceiling、stopping/no-rescue、decision mappingの固定

本レビューだけでは次を認可しない。

- fresh Stage 1 scientific seed generation/read
- fresh Stage 2 formal seed generation/read
- formal effect / p-value / generalization / counterexample decision生成
- G3-07 scientific evidence replay
- G3-12 seed/evidence reuse
- G3-11 depth10 rerun
- G4-10 depth11 access
- `main`統合
- public AI変更

## 10. 最終判定

**`G4-03-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

次工程ではG4-03を独立したfresh prospective Studyとして完全freezeし、Stage 0 technical verificationを通過した後にのみ、fresh Stage 1 accessについて別authorization reviewを行う。
