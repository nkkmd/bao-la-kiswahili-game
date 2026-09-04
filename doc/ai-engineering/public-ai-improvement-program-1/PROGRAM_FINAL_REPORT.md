# PBAI-P1 最終報告

更新日: 2026-08-26
Program: `PBAI-P1` — `Generation-1 Evidence-Informed Public Bao AI Improvement Program 1`（正式Program名）
研究証拠cutoff: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`
固定済みbaseline: `AI-GEN2-BASELINE-2026-08-26-v1`
固定済みglobal gate: `PBAI-C-GLOBAL-GATES-2026-08-26-v1`
最終状態: **PROGRAM COMPLETE / KEEP-AI-GEN2**

## 1. 工学上の最終判断

PBAI-P1では、完了済みResearch Generation 1の科学的判断を変更せず、Research Generation 2の結果も取り込まずに、開始時点で固定したcandidate inventoryを評価しました。

最終的に、公開採用まで到達したcandidateはありませんでした。

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
PBAI-P1 public releases = 0
public AI code changed by PBAI-P1 = false
```

`KEEP-AI-GEN2`は、必要なevidence sequenceとrelease sequenceを満たすcandidateが存在しなかった場合に、事前に許可されていた正規のengineering resultです。

したがって本Programの結論は「改善に失敗したので未決定」ではなく、**固定した評価手順の下では現行`AI-GEN2`を維持することが正しい工学判断だった**というものです。

## 2. 各candidateの最終状態

### `PBAI-C001-v1` — 最終判断

```text
family = phase/search-aware root search routing
result = DEVELOPMENT-BENEFIT-FAIL / HOLD
PR #61 = CLOSED WITHOUT MERGE
```

事前supportとpremetric safetyはPASSしましたが、固定したdecision-quality benefitの複合条件を満たしませんでした。

探索workloadが大きく減少していても、品質条件のFAILを理由に後から救済することはしていません。

### `PBAI-C002-v1` — 最終判断

```text
family = TM-S2-C03-aware move ordering
result = NON-ESTIMABLE / HOLD
eligible targets = 5
minimum estimable = 48
PR #55 = CLOSED WITHOUT MERGE
```

評価対象となるeligible targetが必要数に達しなかったため、candidate benefit metricは実行していません。

`TM-S2-C03 = CONFIRMED`という既存の科学的判断は変更しません。

### `PBAI-C003-v1` — 最終判断

```text
family = restricted exact-oracle lookup plumbing
result = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD
failure stage = STRICT-RAW-IDENTITY-BINDING
reachability measurement = NOT EXECUTED
PR #63 = CLOSED WITHOUT MERGE
```

Practical reachabilityを測定する前提として要求したstrict RAW identity bindingが、既知のORISC `pending` binding mismatchで成立しませんでした。

そのためC003は0-hit resultを生成しておらず、restricted-endgame研究やORISCの科学的判断も変更していません。

### `PBAI-C004-v1` — 最終判断

```text
family = search-instability-aware root ordering
result = DEVELOPMENT-BENEFIT-FAIL / HOLD
median nodes(candidate/baseline) = 1.000
required <= 0.950
PR #58 = CLOSED WITHOUT MERGE
```

事前supportとsafetyはPASSしましたが、固定したintended-benefit endpointを満たしませんでした。

Position Complexity / Difficulty Study 1の正式判断は引き続き`INCONCLUSIVE`です。

### `PBAI-C005` — 最終判断

```text
family = evaluation semantics sanitation
result = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD
implementation = NOT CREATED
```

現在の公開UI、code、diagnostic surfaceをread-onlyで監査した結果、engine evaluationを検証済みのwin probability、win rate、winning chance、confidence probabilityとして扱う箇所は確認されませんでした。

そのため、修正用implementationを作成する根拠はありませんでした。

Canonical audit:

- `C005_PRODUCTION_SURFACE_AUDIT.md`
- `candidates/PBAI-C005-production-surface-audit-result.json`

## 3. Candidate一覧の最終状態

```text
original candidate inventory = 5
candidate dispositions complete = 5
original candidate inventory remaining = 0
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation executions = 0
release holdout executions = 0
public adoption decisions = 0
PBAI-P1 releases = 0
```

C001、C002、C004のisolated development attemptと、C003のpredevelopment support workを含め、public defaultへmergeされたcandidate implementationは1件もありません。

## 4. 科学的境界は変更していない

PBAI-P1は、完了済み研究の正式判断を一切変更しません。

特に次の状態を維持します。

```text
Position Evaluation / Win-Rate Calibration Study 1 = INCONCLUSIVE
engine score -> validated Bao win probability = NOT AUTHORIZED

Position Complexity / Difficulty Study 1 = INCONCLUSIVE
machine search complexity -> human difficulty = NOT AUTHORIZED

Tactical Motif Human / Expert Validation Study 1
= INCONCLUSIVE-NOT-ESTIMABLE / N=0
machine motif evidence -> human recognition/difficulty = NOT AUTHORIZED

REWR-STUDY1
= EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
exactness beyond frozen 8-state domain = NOT AUTHORIZED

ORISC-STUDY1
= ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
unvalidated symmetry/canonicalization = NOT AUTHORIZED
```

Research Generation 2は別個のpure-research trackであり、本Programへ途中から追加していません。

## 5. 維持したbaseline

公開AIの比較基準として維持されるのは次です。

```text
AI-GEN2-BASELINE-2026-08-26-v1
```

固定した公開source identityは次のとおりです。

```text
public/engine.js
SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c

public/ai.js
SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

PBAI-P1で作られたcandidate codeは、公開defaultへ採用されていません。

## 6. 公開とAI世代の判断

validation-ready / release-candidate statusまで到達したcandidateが存在しなかったため、release sequenceには入りませんでした。

その結果、

```text
release holdout execution = NOT REQUIRED / NOT EXECUTED
public deployment caused by PBAI-P1 = NONE
formal ADOPT = NONE
actual public-default deployment = NONE
AI-GEN3 = NOT PROMOTED
```

となりました。

予約名`AI-GEN3`は、将来のengineering program / candidateが適切なprospective release contractの下で正式な`ADOPT`と実際のpublic-default deploymentの両方を成立させた場合にのみ使用できます。

## 7. 今後のAI Engineeringに関する境界

PBAI-P1は終了済みです。将来のAI Engineeringで、PBAI-P1のcandidate versionを暗黙に再開・救済してはいけません。

実質的に異なる新しいengineering mechanismを評価する場合は、最低限次を必要とします。

1. 新しいcandidateまたはProgram identityを付与する。
2. evidence cutoffを結果を見る前に明示する。
3. 完了済み研究の科学的判断を維持する。
4. outcomeを見る前にexact mechanismとacceptance contractを固定する。
5. validation / release holdoutを保護する。
6. `AI-GEN3`の命名規則を維持する。

Research Generation 2を将来のAI Engineeringへ利用することは可能ですが、その場合は**新しいProgramが新しいevidence cutoffを明示的に設定する必要があります**。Research Generation 2の結果をPBAI-P1へ遡及的に追加することはありません。

## 8. 正式な最終状態

```text
PBAI-P1 = COMPLETE
PBAI-P1 final outcome = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT PROMOTED
original candidate inventory remaining = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
```

このcode blockに示したcanonical tokenと状態が、PBAI-P1の正式な最終工学状態です。
