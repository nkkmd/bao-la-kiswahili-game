# CLGR-STUDY1 — 再現性索引

更新日: 2026-09-03

## repository identity（リポジトリ識別情報）

```text
repository = nkkmd/bao-la-kiswahili-game
review baseline remote main = 6c218b9cc3f492fb96d051768702682fef9bb66a
research branch = research/g3-09-continuous-local-geometry-representation
Study ID = CLGR-STUDY1
current status = CLOSED / TECHNICAL-INVALID
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## program decision（program上の判断）

- `../research-program-decisions/2026-09-03-post-g3-08-g3-09-authorization-review.md`
- `../research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-03-post-g3-08-g3-09-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-03-g3-09-technical-invalid-closure.md`

final program decision:

**`G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

## 固定済みcontract

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `prereg/STAGE_2_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_INPUT.json`

## measurement dependency（測定上の依存関係）

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative depth = 5
validated transforms = []
```

正本となるupstream report:

`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`

## 固定済みrepresentation

```text
representation = CLGR-R1-EXACT-SQUASHED-L1
axes = CLGR-A1..A6
transform = q=n/d -> n/(n+d), exact reduced rational
weights = all 1
metric = exact L1
neighborhood = k=3 tie-inclusive
phase scaling = none
data-dependent fitting = none
PCA/clustering = none
```

## closure時点のStage namespace

```text
technical = 31909001..31909008 / scientific use prohibited
Stage 1 = 31910001..31910256 / CONSUMED
Stage 2 = 31920001..31920384 / CONSUMED
same-evidence rerun = PROHIBITED
```

## Stage 0のprovenance

Stage 0 v1はscientific access前にtechnical-invalidとなり、再実行していない。

Stage 0 v2:

```text
workflow run = 33748876201
result artifact = 9890713293
artifact ZIP SHA-256 = 4f5b63b30146aa97b30f5adfa2b615eb360cba77236d6288042b2c320c72041b
result JSON SHA-256 = 5723938b5afc3e6b9f2d2fcad6c4f618a97e4b3e47e50d0e0d4204edbe207dee
stage disposition = STAGE0-PASS
```

## Stage 1 preauthorizationのprovenance

preauthorization v1はaudit実行前かつfresh access前のsyntax checkで停止した。再実行していない。

Preauthorization v2:

```text
workflow run = 33750207236
audit artifact = 9891210816
artifact ZIP SHA-256 = b29ff0d5d8e17fd3bd3f8e12dc08867da84049c4ab6ee7df06a82ecac66ab87a
audit exact JSON SHA-256 = 14f4b8d68f727fd81d8f608817ef0c0838aa4d332a36039d2cc300a413c266ef
audit disposition = STAGE1-PREAUTH-STATIC-AUDIT-PASS
fresh Stage 1 seed access = false
```

正本となるmirror:

`results/stage-1-preauthorization-v1/PREAUTH_AUDIT_RESULT.json`

## Stage 1のscientific provenance

authorizeされたexactly-onceのfresh execution:

```text
workflow run = 33750400172
result artifact = 9891394814
lease artifact = 9891283252
artifact ZIP SHA-256 = 6a8ebc0d242027ad6a634555a290df1284626839e4397e87b06551e2fc726fc9
population = 24 Namua + 24 Mtaji = 48
stage disposition = STAGE1-PASS
canonical scientific result SHA-256 = 1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529
```

immutable artifactはworkflow run `33750898317`でexact-byte mirrorした。

正本となるStage 1 mirror:

- `results/stage-1/STAGE_1_SELECTION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-1/STAGE_1_COORDINATES.json`
- `results/stage-1/STAGE_1_DISTANCE_ROWS.json`
- `results/stage-1/STAGE_1_NEIGHBORHOODS.json`
- `results/stage-1/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json`
- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1はdevelopment evidenceである。このPASSはformal representation eligibilityを構成しない。

## Stage 2 preauthorizationのprovenance

```text
workflow run = 33751580785
audit artifact = 9891748675
artifact ZIP SHA-256 = 895735e484662aab11b62b67dc0b00700b40952a5aee04999e9684cadfb8008f
audit disposition = STAGE2-PREAUTH-STATIC-AUDIT-PASS
fresh Stage 2 seed access = false
protected depth-10 access = false
```

正本となるmirror:

`results/stage-2-preauthorization-v1/PREAUTH_AUDIT_RESULT.json`

## Stage 2のformal provenance

authorizeされたexactly-onceのfresh formal execution:

```text
workflow run = 33751818456
result artifact = 9892142995
lease artifact = 9891829617
artifact ZIP SHA-256 = 7fbb28407a1233911b581875c76bef44287cd5f21cc63ab7405f3ec621c94e26
selection core SHA-256 = e9c6f436bf2abd86d6c3a7b46d5b05e043c478f794db49c76c4d3c87b15a0617
selected population = 36 Namua + 36 Mtaji = 72
partial completed measurements = 61
formal decision = TECHNICAL-INVALID
formal-result JSON SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
scientific summary authorized = false
same-evidence rerun authorized = false
```

failure identity:

```text
root index = 61
phase = mtaji
source seed = 31920066
root RAW SHA-256 = e2260d76b2f40fa24ebe2183ca0cc865f48dc7c951737414ef8c498143b8087c
error = relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b
```

immutable Stage 2 artifactはexact-byteで検証し、workflow run `33752894852`でmirrorした。

正本となるStage 2 mirror:

- `results/stage-2/STAGE_2_SELECTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-2/STAGE_2_FORMAL_RESULT.json`

exact mirror後の`STAGE_2_FORMAL_RESULT.json`のrepository blob SHAは`d0d577ede4bfe3c726500c9c521228576fdf8186`である。

## source bindingとimplementationの分離

fresh-free Stage 1 / Stage 2 preauthorization auditでは、fresh execution前に、engine、LGTGMIV production / independent implementation、CLGR production / independent implementation、Stage selector / runner / verifier、固定済みpreregistration file、scientific workflowをGit blob SHAでbindした。

productionとindependent CLGR pathは相互にimportしていない。scientific equalityはruntime object prototypeまたはfloating toleranceではなく、canonical exact primitiveに対して定義した。

## G3-08とupstream firewall

G3-08 partial Stage 1 measurementはG3-09 scientific evidenceとして使用していない。`doc/local-geometry-persistence-memory-length/prereg/UPSTREAM_IDENTITY_FIREWALL.json`はidentity-only exclusionを提供し、G3-07 scientific outcome fieldを保持していない。

G3-08のrelay-limit情報は、fail-closed technical controlと結果を見る前に固定するresource ceilingの設計根拠に限って使用した。

## protected evidence（保護対象の証拠）

standard initial RAW-root complete exact depth-10 holdoutの状態:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

G3-09ではpartial generation、resource probe、state-count peek、scientific readのいずれも行っていない。

## no-rescueとdownstream boundary

Stage 2 fresh evidenceへアクセスし、formal seed blockも消費済みであるため、`CLGR-STUDY1`を同じevidenceで再実行または修復できない。61件のpartial Stage 2 measurementはtechnical provenanceに限られる。

この時点のG3-10はnot authorizedであり、別個のpost-G3-09 current-state reviewを必要とした。後続状態は`CURRENT_STATUS.md`を参照する。

## `main`への統合

2026-09-03の明示的なユーザー指示後、`main`をreview済みG3-09 closure tip `64ada67b058811c18d81e7286fd3b12df6964459`へ`force=false`でfast-forwardした。squash、rebase、history rewrite、scientific recomputation、seed reuse、protected holdout accessは行っていない。閉じたresearch branchはprovenanceのため保持している。
<!-- CLGR-G3-09-FINAL-AUDIT:REPRO -->

## repository / documentの最終consistency audit

final audit v1は、scientific computation前にdocumentation allowlistの漏れで停止した。v1は再実行していない。freshなdocumentation-only v2 auditでは、有効なCLGR program-decision pathのallowlistだけを拡張し、その他のcheckは同一に保った。

```text
v2 workflow run = 33754250314
disposition = FINAL-REPOSITORY-DOCUMENT-CONSISTENCY-PASS
Stage 2 formal-result SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
historical PROGRAM_PLAN blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac / UNCHANGED
remote main at audit = 6c218b9cc3f492fb96d051768702682fef9bb66a / UNCHANGED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
research branch = CLOSED / REVIEW-READY
```

canonical checkpointは`checkpoints/2026-09-03-final-repository-document-consistency-pass.md`である。
