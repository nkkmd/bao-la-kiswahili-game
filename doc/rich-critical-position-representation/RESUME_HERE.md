# RCPR-STUDY1 — 再開位置

更新日: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## 1. authoritative restart point （日本語の要点）

`RCPR-STUDY1`はStage 1で終了し、`main`へ統合済みです。

```text
baseline main before Study = 37480777246aa306c6ca3d0679d936b5e0107071
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082 / completed / failure
Stage 1 decision = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
final research head = 374d25d2f09ba661aaa8ae8e2e0a06eb03536786
integration PR = #73 / merged
main integration commit = 28f888f9819605d2b19707067afc48f2a6d3ed27
```

consumed Stage 1 executionをdispatch、rerun、replace、extend、reinterpretしてはいけません。integrated `main`上のRCPR workflowはすべてclosed-study archival stubです。

## 2. 読む順序

次の順で確認します。

1. `README.md`
2. `STUDY_1_OVERVIEW.md`
3. `STUDY_1_FINAL_REPORT.md`
4. `CURRENT_STATUS.md`
5. `checkpoints/2026-08-29-main-integration.md`
6. `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`
7. `results/STAGE_1_DEVELOPMENT_RESULT.json`
8. `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
9. `../../research-program-decisions/2026-08-29-g2-06-rich-critical-position-representation-closure.md`
10. `DECISION_REGISTER.md`
11. `REPRODUCIBILITY_INDEX.md`
12. `RESEARCH_LOG.md`
13. `STUDY_1_PROTOCOL.md`
14. `preregistration/STUDY_START_FREEZE.md`

## 3. terminal Stage 1 evidence （証拠と成果物）

Production job `98936414477`は成功し、600 roots、599 primary-estimable roots、134 high-divergence roots、`RICH_ALL`、overall OOF AUROC `0.7093403948001926`を含むproduction-only readiness passを出力しました。

Independent job `99007180273`はexact technical verificationでFAILしました。verifier record:

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
```

production valueはprovenance onlyであり、independently verified scientific resultとしてacceptしていません。

## 4. root cause （技術検証）

600 rows中exactに4 rowsでfeature-vector hash equalityがFAILしました。mismatchは`MOVE_SET_ENTROPY.indexEntropy`とfloating-point addition orderへisolatedされました。

```text
production: Map insertion-order accumulation
independent: object integer-key enumeration order
maximum observed absolute difference: 4.440892098500626e-16
```

RAW state、continuation measurement、`D_range`、high-divergence label、model development、readiness recomputationはそれ以外では一致しました。

これはtechnical representation-determinism failureですが、frozen exact-equality gateによりStage 1 decisionは`STAGE1-TECHNICAL-INVALID`のままです。

## 5. immutable no-rescue boundary （解釈上の境界）

次を行ってはいけません。

- seeds `28610001..28613072`をrerunする
- retrospectiveにStage 1をPASSさせるためtolerance / rounding ruleを追加する
- verifierをreplaceして同じconsumed blockをreplayする
- production-only resultをpromoteする
- `RCPR-S2-FORMAL-2026-08-28-v1`をauthorizeする
- Stage 1 development rowをformal evidenceとしてreuseする
- prior G2-01..G2-05またはResearch Generation 1 decisionを変更する

## 6. main integration （リポジトリ状態）

PR #73はfinal branch audit、`mergeable=true`、unresolved review thread 0、head `374d25d2f09ba661aaa8ae8e2e0a06eb03536786`上の5 PR workflowすべてのPASSを確認してからmergeしました。

```text
Second-generation research agenda audit = 33235980651 / success
DRSSE Study 1 Closure CI = 33235980612 / success
PCEM closure consistency audit = 33235980641 / success
SSGTC closure consistency audit = 33235980551 / success
Phase Transition Research CI = 33235980568 / success
```

Merge semantics:

```text
PR = #73
merge method = merge
merge commit = 28f888f9819605d2b19707067afc48f2a6d3ed27
```

## 7. immediate program continuation （次の研究）

`RCPR-STUDY1`内にこれ以上のscientific executionはありません。

直後のagenda itemは次です。

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
priority = P1
status = planned / new prospective independent study
```

G2-07 outcome生成前にcurrent remote `main` HEADを再取得し、formal Study ID、title、Stage ID、endpoint、representation、source semantics、seed block、technical control、authorization barrierをprospectiveに固定する必要があります。

`RCPR-STUDY1` rowをG2-07 formal evidenceとして使用してはいけません。

## 8. future rich-representation replication boundary （表現）

将来の独立Studyでdeterministic rich critical-position representationを再検討する場合は、technical hardening後にのみ実施できます。

1. deterministic entropy category orderingとnumeric / hash semanticsを固定する
2. そのsemantic contractの下でproduction / independent計算を別々に実装する
3. nonnumeric encounter orderのinteger-like category keyを含むadversarial technical fixtureを追加する
4. 310 featuresすべてでexact equalityを要求する
5. fresh scientific evidenceとauthorizationを割り当てる

このworkにはdistinct independent title / identityが必要であり、`RCPR-STUDY1`のreopening / rescueとして命名・扱ってはいけません。

正しいrestart instructionは次です。

**G2-06 / RCPR-STUDY1はclosed `STAGE1-TECHNICAL-INVALID`かつmain統合済みとして扱い、rerunしない。G2-07はその時点のcurrent mainからfresh prospective contractの下でのみ開始する。**
