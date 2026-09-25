# 2026-09-25 — G4-05 / RLEMOF-STUDY1 Stage 2 final one-shot authorization review

Review ID: `G4-05-STAGE2-FINAL-AUTHORIZATION-2026-09-25-V1`  
Preparation commit: `ee5564844a1519f0625dbf64813b5616da877253`  
判定: **`RLEMOF-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

## 1. pre-access freeze確認

Stage 2 formal spec、production runner、independent verifier、Actions workflow、exact tablebase / retrograde dependenciesをfresh formal holdout access前のcommit `ee5564844a1519f0625dbf64813b5616da877253`で固定した。

```text
STAGE_2_FORMAL_SPEC.json = 9d3c0c150b3111ff5297c1dc455483a6e66db218
run-rlemof-stage2-formal.js = a00baff1e185a23aeb357e0761b1e65b2e06c9ef
verify-rlemof-stage2-formal-independent.js = 4e57b3a16ecbc62cd859378e686d9997cec0638f
rlemof-g4-05-stage2-formal.yml = 44971350a2049ff9b5fbd5aee9b51b3f17c1b7dc
restricted-endgame-stage0.js = c0391da999314c4709e5002e73eae42ef3048436
restricted-endgame-transition.js = 7ca35ef03ecad102b9a9e1fa6c4767f72d409961
restricted-endgame-tablebase.js = f41ef2538b41e8ca9ed50f79cdab4bfa910989ef
restricted-endgame-retrograde.js = e07b78b388996213c859145cd5a546b62d6f6d68
restricted-endgame-independent-verifier.js = 94a79d140803802acf607bbaf02d570aa3b6f362
restricted-endgame-tablebase-independent.js = e5caa7b42f2cd4c04b98183886136471b1ae9807
restricted-endgame-retrograde-independent.js = 8d8d087b610b65806cd552f3b8038c6fecc8cec7
public/engine.js = 1527bb3665228b7a5bd9f03153567aedbaaa22d7
```

## 2. formal holdout authorization

```text
seed block = 40523001..40524024
seed count = 1024
max ply = 320
Stage 1 identity firewall = mandatory
formal root envelope = T3 / non-empty pits <=16 / exact legal moves 1..2
maximum inspected candidates = 16
target complete domains = 8
minimum complete domains = 6
```

Stage 1 consumed RAW identity setはidentity-onlyに再構築し、frozen digest `83a563ae908ea8778c689ce68f4b63b3e8873eba7dcc8d0547edc5eabb199503`との一致後にfresh holdout candidateから除外する。Stage 1 rootへclosure / retrogradeを再実行しない。

## 3. exact decision boundary

complete formal domainsだけにexact solverを適用する。production / independentがgraph identity、solution digest、root exact result、recurrent SCCを完全一致させ、6 domains以上を得た場合にだけ

`EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`

を許可する。

6 domains未満は`NON-ESTIMABLE-INSUFFICIENT-COMPLETE-DOMAINS`、solver / identity mismatchは`TECHNICAL-INVALID`とする。`RECURRENT`から`DRAW`を推論せず、whole-Bao generalizationを行わない。

## 4. one-shot GitHub Actions

認可するfresh formal executionは、authorization file追加によるpush runのattempt 1だけである。

- event = `push`
- run attempt = `1`
- source blob mismatch = fresh access前hard fail
- rerun attempt 2+ = unauthorized / hard fail
- workflow_dispatchでformal runを開始しない
- artifact = success/failureにかかわらず保存を試みる
- same-evidence rescue rerun = false

## 5. 最終判定

**`RLEMOF-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

この認可はG4-05 Stage 2だけに限定し、`main`統合、G4-06、public AI変更を認可しない。
