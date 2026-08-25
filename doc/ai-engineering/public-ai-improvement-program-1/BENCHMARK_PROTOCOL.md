# PBAI-P1 Engineering Benchmark Protocol

Status: FRAMEWORK-FROZEN / NUMERIC RELEASE THRESHOLDS NOT-YET-FROZEN  
Program: `PBAI-P1`

既存の[`../../AI_BENCHMARK.md`](../../AI_BENCHMARK.md)を下位測定基盤として再利用する。この文書はPBAI-P1のcandidate採否ガバナンスを定義する。

## 1. Benchmark axes

### A. Playing strength

- baselineとのseat-balanced comparison
- paired/shared openingを用いる条件
- phase/opening strataを明示
- fresh seed block
- win/loss/drawだけでなくseat imbalanceを確認

### B. Decision quality

可能な範囲でfrozen deeper-search/reference configurationに対し、次を測定する。

- best-move agreement
- Top-k agreement
- reference decision loss
- severe-loss frequency
- tactical miss / regression frequency

これらはgame-theoretic optimalityまたはvalidated win probabilityとは呼ばない。

### C. Robustness

少なくとも候補のmechanismに応じて次をstratifyする。

- Namua / Mtaji
- opening families / opening plies
- branching / capture-rich positions
- tactical regression positions
- endgame-like / restricted exact-oracle positions where applicable
- South / North

### D. Operational quality

- latency / move time distribution
- timeout rate
- completed depth
- node count
- memory where measurable
- crash / exception
- worker fallback / responsiveness

### E. Correctness / regression

- rule engine tests
- AI tests
- evaluation/search tests
- worker integration
- tactical regression
- exact-oracle fixtures where candidate touches lookup/state identity

## 2. Data split

```text
development seeds / fixtures
validation seeds / fixtures
release holdout seeds / fixtures
```

- release holdoutはcandidate tuningに使用しない。
- candidate間で同一release holdoutを繰り返し覗いて実質的にtuneしない。
- repeated program iterationでholdoutが消耗した場合はnew release blockをfreezeする。

## 3. Ablation rule

原則として最初は一つのmechanismだけをbaselineへ加える。

```text
Baseline
Baseline + Candidate A
Baseline + Candidate B
...
```

複合candidateは、各componentの単独結果が記録された後に別IDで登録する。

## 4. Non-negotiable rejection gates

以下はstrength改善があっても原則reject/holdとする。

- rule correctness regression
- reproducible crash / invalid state generation
- unapproved RAW identity/canonicalization change
- severe tactical regression not explained and accepted prospectively
- unacceptable timeout/latency/resource regression against frozen operational budget
- reliance on invalid scientific inference listed in evidence audit

## 5. Candidate-specific acceptance rule

各candidateを`AUTHORIZED-FOR-DEVELOPMENT`へ移す前に、`CANDIDATE_REGISTER.md`へ次をfreezeする。

```text
primary engineering endpoint(s)
minimum practical improvement or non-inferiority rule
secondary endpoints
operational budget
required strata
sample size / games / seeds
validation block
release holdout block
failure handling
keep / reject / hold rule
```

数値thresholdはcandidate結果を見てから選ばない。

## 6. Deployment gate

release candidateは少なくとも次を満たす。

```text
correctness = PASS
candidate-specific strength/decision gate = PASS
required robustness strata = PASS or prospectively accepted bounded exception
operational budget = PASS
release holdout = PASS
rollback path = READY
```

public deployment後のtelemetry/observationはengineering evidenceであり、Research Trackのformal resultへ逆流させない。
