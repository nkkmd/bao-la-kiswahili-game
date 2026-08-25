# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Status

```text
PROGRAM = ESTABLISHED
PBAI-A Generation-1 evidence audit = READY / NOT-YET-COMPLETE
PBAI-B public AI baseline = NOT-FROZEN
PBAI-C benchmark / release gates = NOT-FROZEN
candidate implementations = 0
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by program establishment = false
Generation-2 evidence included = false
```

## Program start anchor

`2db7c4d65771066e914f32cbc4116fcc3e9e386a`

このanchorはPBAI-P1開始直前のrepository stateであり、Program documentationの追加そのものはpublic AI implementationを変更しない。

## Next required work

1. `GENERATION_1_EVIDENCE_AUDIT.md`を全対象Studyについて完了する。
2. 現在public配信に用いられるAI implementation/configurationを読み取り、`BASELINE_SPEC.md`をfreezeする。
3. 既存`AI_BENCHMARK.md`を再利用しつつ、development / validation / release holdout、strength / decision-quality / robustness / operational axes、candidate acceptance rulesを`BENCHMARK_PROTOCOL.md`でfreezeする。
4. その後に初めて`CANDIDATE_REGISTER.md`の候補を個別にdevelopment authorizationへ進める。

## Explicitly not done yet

- 評価重み変更
- phase/morphology bonus追加
- tactical C03 hard-code
- adaptive deepening導入
- exact-oracle lookupをpublic AIへ接続
- score→win-probability変換
- symmetry/canonicalization導入
- public deployment

これらをProgram設立と同時に実施しない。
