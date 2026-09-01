# PBAI-P2 C008-v1 — feature-off exact equivalence checkpoint

Date: 2026-09-01  
Candidate: `PBAI-C008-v1`  
Stage: `PBAI-P2-E-TECHNICAL-PREFLIGHT`

## 判断

```text
PBAI-C008-v1 feature-off equivalence = PASS
development benefit execution = AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
```

## 事前固定

Candidate mechanismはsource変更前のcommit `fe962416a5d76fe8ab5d47def384dd386acc222d`でfreezeした。

Feature-off equivalence contractもcandidate source変更前にfreezeし、technical-only seed block `43400001..43400064`を使用した。Development `424xxxxx`、validation `425xxxxx`、release holdout `426xxxxx`は本technical preflightでは使用していない。

## 実装

```text
candidate implementation commit = 0d69a3c1
candidate public source = public/ai.js only
candidate AI SHA-256 = cb4e8524964cc775782f66feab39f360be1f0b75d8505919c7bcc5ef85419c3a
added bytes = 3669
feature = pbaiC008RootFlipConfirmation
public default = false
```

`public/engine.js`はfrozen SHA-256 `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c`のままである。

## Canonical execution

```text
PR = #90
workflow run = 33496357823
job = 99819366496
artifact = 9795901835
artifact ZIP SHA-256 = 2554af154353f8cfda48dd214df5a6bd8296dbffea9ad73c3d0536121c9d5b45
full result JSON SHA-256 = f7b72fcf3e6ea0b4cc62894b04b9caa9b92882bbd857b2c8034f2850d84e3705
deterministic core SHA-256 = 8e73873cb5ae2c98f89f2bbe437799e3ddbdca74c39cea176d8b490aa927c4b2
```

## Result

```text
source seeds = 64
selected roots = 32
  Namua = 16
  Mtaji = 16
search conditions per root = 8
total baseline/candidate comparisons = 256
comparison mismatches = 0
candidate diagnostics present while feature off = 0
```

D1/D2/D3/D4 fixed-depth条件に加え、hard / expertの`timeLimitMs=0` timeout条件も含め、frozen baselineとcandidate feature-offのselected move object・move key・全pre-existing stats fields/valueをcontrolled runtime下でexact比較した。

## 解釈境界

このPASSが示すのは、C008 implementationがfeature-off時にfrozen baseline semanticsを再現できるというtechnical preconditionだけである。

以下はまだ成立していない。

```text
C008 decision-quality benefit = NOT YET ESTABLISHED
C008 search-cost acceptability = NOT YET ESTABLISHED
C008 strength non-inferiority = NOT YET ESTABLISHED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
public adoption = NOT AUTHORIZED
```

次に許可されるのは、source変更前にfreeze済みの`42400001..42400512` development blockだけを使うdevelopment-only intended-benefit evaluationである。結果を見る前にmeasurement implementation / independent verification contractを固定する。
