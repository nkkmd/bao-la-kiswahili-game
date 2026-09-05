# CLGR-STUDY1 — 現在の状態

更新日: 2026-09-03

```text
Program position = Research Generation 3 / G3-09
Program review = G3-09-AUTHORIZED
Study = CLGR-STUDY1
Study status = CLOSED / TECHNICAL-INVALID
review baseline remote main = 6c218b9cc3f492fb96d051768702682fef9bb66a
research branch = research/g3-09-continuous-local-geometry-representation
representation = CLGR-R1-EXACT-SQUASHED-L1
axis universe = CLGR-A1..A6 / FROZEN
measurement foundation = LGTGMIV F1-F5 / RAW-only / relative depth 5
validated transform set = []
Stage 0 v1 = TECHNICAL-INVALID / PRE-FRESH / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 0 v2 workflow run = 33748876201
Stage 1 = STAGE1-PASS / EXACTLY ONE AUTHORIZED FRESH EXECUTION
Stage 1 workflow run = 33750400172
Stage 1 population = 24 Namua + 24 Mtaji = 48
Stage 1 canonical result SHA-256 = 1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529
Stage 1 seeds = 31910001..31910256 / CONSUMED
Stage 2 = TECHNICAL-INVALID / EXACTLY ONE AUTHORIZED FRESH EXECUTION
Stage 2 workflow run = 33751818456
Stage 2 selected population = 36 Namua + 36 Mtaji = 72
Stage 2 partial measurements = 61
Stage 2 failing root index = 61
Stage 2 failing phase = mtaji
Stage 2 failing source seed = 31920066
Stage 2 formal-result SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
Stage 2 seeds = 31920001..31920384 / CONSUMED
formal representation eligibility = NOT ESTABLISHED
Stage 2 scientific summary = NOT AUTHORIZED
same-evidence rerun = PROHIBITED
technical seeds = 31909001..31909008 / scientific use prohibited
G3-08 partial Stage 1 scientific measurements = PROHIBITED INPUT
G3-08 relay-limit knowledge = TECHNICAL-DESIGN-ONLY
G3-04/G3-07 formal outcomes = CONTEXT ONLY / NOT REPRESENTATION-SELECTION INPUT
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
final repository/document consistency audit v1 = DOCUMENTATION-AUDIT-ALLOWLIST-TOO-NARROW / NO SCIENTIFIC CONSEQUENCE / NO RERUN
final repository/document consistency audit v2 = PASS / workflow run 33754250314
final consistency checkpoint = checkpoints/2026-09-03-final-repository-document-consistency-pass.md
research branch lifecycle = CLOSED / RETAINED FOR PROVENANCE
G3-10 = NOT AUTHORIZED / separate post-G3-09 current-state review required
main integration = COMPLETE / FAST-FORWARD / initial source tip 64ada67b058811c18d81e7286fd3b12df6964459 / force=false
```

Stage 1 developmentは、結果を見る前に固定したexactness gateとnondegeneracy gateをすべてPASSした。ただし、これはdevelopment evidenceに限られ、それ自体ではformal representation eligibilityを確立しない。

exactly-onceのStage 2 formal executionでは、72 rootからなる完全なholdoutを選択し、61 rootのmeasurement完了後にfail closedした。formal root index 61 / Mtaji / source seed `31920066`に必要なdepth-5 RAW reconstructionで、次のerrorが発生した。

`relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b`

すでにfresh Stage 2 evidenceへアクセスしていたため、`CLGR-STUDY1`を修復または再実行することはできない。61件のpartial formal measurementはtechnical provenanceに限られ、formal eligibilityもformal non-eligibilityも確立できない。

final repository / document consistency audit v2は、exact Stage 1 / Stage 2 result identity、no-rescue state、protected depth-10 status、historical `PROGRAM_PLAN.md`のimmutability、current-facing documentの一貫性、changed-path confinement、remote `main`の非統合状態を確認してPASSした。audit v1のfailureはdocumentation path allowlistから有効なCLGR authorization-review file 2件が漏れていたことだけが原因で、どちらのauditでもscientific computationまたはevidence accessは行っていない。

scientific Studyとrepository / document closure作業は完了している。2026-09-03の明示的なユーザー指示後、`main`をreview済みsource tip `64ada67b058811c18d81e7286fd3b12df6964459`へ`force=false`でfast-forwardした。閉じたresearch branchはprovenanceのため保持しており、scientific closureとno-rescue boundaryは変更していない。
