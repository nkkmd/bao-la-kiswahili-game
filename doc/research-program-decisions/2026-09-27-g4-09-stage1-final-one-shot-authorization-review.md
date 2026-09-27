# G4-09 / GCSREA-STUDY1 — Stage 1 final one-shot authorization review

Date: 2026-09-27  
Study: `GCSREA-STUDY1`  
Stage: `GCSREA-S1-DEVELOPMENT-2026-09-27-v1`  
Decision: **`GCSREA-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

## 1. Review purpose

G4-09 Stage 1 の fresh scientific execution を開始してよいか、Stage 0、Stage 1 pre-fresh audit、source freeze、freshness firewall、exact-oracle integrity、one-shot execution boundaryをまとめて最終審査する。

この認可は Stage 1 development population の一回限りの実行だけを対象とする。Stage 2、G4-05 fixed-8 に対する実際の search-vs-exact agreement 測定、G4-10 depth-11、公開AI変更は認可しない。

## 2. Upstream status

Stage 0 は canonical run `36322244107 / attempt 1 / success` で `STAGE0-PASS`。

Stage 1 pre-fresh audit は canonical run `36323915432 / attempt 1 / success` で PASS。artifact:

```text
artifact ID = 10933925678
artifact ZIP SHA-256 = 22caedb85cd7bc7da2aa09e52488c3ec53eea3698cb8b03d7b56cc1514e3428d
fresh scientific seed reads = 0
actual G4-05 search-vs-exact measurements = 0
G4-10 depth-11 access = 0
public AI change = false
```

最初の pre-fresh audit run `36323702322` は legacy digest grammar の verifier mismatch により fresh access 前に fail closed した。scientific seed read は0であり、修正後 run が全gateを通過している。

## 3. Freshness firewall

canonical pre-fresh auditで次を再物質化済み。

```text
excluded seed set = 16640
trajectory set = 5489
opening-prefix set = 4706
RAW-root set = 185680
combined firewall digest = 45980c3d1207e3f939f7dbf3c83bde41c76d472b15f7aab504ae91dd274d71df
```

完全identityを監査できない historical class は非重複を推測せず、seed namespace 全体を quarantine する。fresh populationで audited trajectory / opening-prefix / RAW-root collision があれば reject し、replacementやseed extensionは行わない。

## 4. G4-05 exact-oracle integrity

固定8 microdomainは production / independent の両経路で再物質化・exact再計算し、root identity、state/edge set、solution digest、root value、DTF、optimal move setが canonical upstream record と一致した。

```text
disposition = EXACT-ORACLE-INTEGRITY-PREFLIGHT-PASS
fixed domain count = 8
all production / independent upstream agreement = true
core SHA-256 = 924922e5072cfe19facb954ce24cf8207d15a38f3fb861e08a4e4d5f1daf8a7c
```

ただしこれは oracle integrity preflight のみであり、G4-09 の actual search-vs-exact scientific measurement は0のまま。Stage 1では引き続き実測を禁止する。

## 5. Source freeze

Stage 1 scientific code freeze:

```text
codeFreezeHead = ec40f1894ac44c77e2bad437575c7e6a71d9c3dc
source tree = e5ac607f5461a3d632cd82e55153f621d0256fcd
```

認可以降、scientific semanticsを持つsourceは変更しない。authorization文書と単独trigger以外の変更を加えない。

主要bindingは `STAGE_1_AUTHORIZATION.json` に Git blob SHA として固定する。対象には以下を含む。

- one-shot workflow
- Stage 1 development spec
- upstream identity firewall
- Stage 1 runner / binding verifier / exact-oracle preflight
- GCSREA production / independent modules
- source-policy production / independent modules
- SILGM production / independent modules
- RAW geometry production / independent modules
- continuous geometry production / independent modules
- search reliability implementation
- public engine / AI evaluator
- restricted-endgame transition / tablebase / retrograde production and independent paths
- benchmark RNG source

## 6. Authorized fresh population

認可seed blockは次の一つだけ。

```text
40913001..40913768
count = 768
```

Stage 1 source selectionは frozen preregistration に従い、source policy × root family × phase の assignment と outcome-blind deterministic rankのみで行う。search result、geometry outcome、exact outcomeを root selection に使用しない。

Stage 1 の目的は formal conclusion を出すことではなく、held-out formal stageへ進められる geometry/search slots を support gate で固定するdevelopment stageである。p-value、risk difference、effect direction、generalization/counterexample decisionは計算しない。

## 7. One-shot execution boundary

実行環境は **GitHub Actions only**。

workflowは final trigger commit が trigger JSON 一ファイルだけを変更したことを確認し、source bindingを再検証する。その後、fresh access前に以下を再実行する。

1. durable lease absence check
2. immutable upstream artifact SHA-256 check
3. full freshness-firewall rematerialization
4. fixed-8 exact-oracle integrity preflight
5. durable one-shot lease acquisition
6. fresh Stage 1 execution

leaseは最初の fresh seed read より前に研究ブランチへ永続化する。

fresh access開始後は同versionでのrerunを認可しない。以下をすべて禁止する。

```text
rerun = false
seed extension = false
root replacement / rescue = false
threshold relaxation = false
geometry/search family change = false
resource-ceiling relaxation = false
```

post-fresh technical failureは `STAGE1-TECHNICAL-INVALID` として保存し、同じStage 1をやり直さない。

## 8. Protected boundaries

この認可で許可しないもの:

```text
Stage 2 seed access = false
actual G4-05 fixed-8 search-vs-exact measurement = false
G4-05 candidate rescan = false
G4-05 domain replacement = false
G4-10 depth-11 access = false
public AI change = false
main merge = false
```

## 9. Final decision

Stage 0 PASS、Stage 1 pre-fresh audit PASS、full identity firewall PASS、fixed-8 exact-oracle integrity PASS、durable lease absence、source freeze成立を確認した。

したがって、G4-09 Stage 1について次を認可する。

**`GCSREA-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

許可されるscientific executionは `40913001..40913768` を使用する **1回だけ**である。Stage 1結果取得後は結果をcanonicalizeして停止し、Stage 2は別レビューなしに開始しない。