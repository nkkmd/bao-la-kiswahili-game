# SILGM-STUDY1 — Stage 2 formal complete / Study closure checkpoint

Date: 2026-09-03

## Closure state

```text
Study = SILGM-STUDY1
Program position = Research Generation 3 / G3-07
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS / 1 authorized / 1 actual scientific execution
Stage 2 = STAGE2-PASS / 1 authorized / 1 actual scientific execution
Study lifecycle = CLOSED / FORMAL-COMPLETE
main integration = NOT PERFORMED
```

## Stage 2 exact provenance

```text
formal input core = 6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0
preauthorization run = 33716437350
preauthorization artifact = 9878673914
preauthorization ZIP SHA-256 = 2fbcbf0cf2b3241e918a4f3fb31314b5f397cc246075b845a2942dddaed6782b
preauthorization JSON SHA-256 = 318e709fa1e05579c422a9111da3ca925d32824819bcad72a30ee321123ec0bd
authorization review commit = 49a5bf7aa33e69c20ed79cf64a0d18eca628426a
scientific tooling commit = ba35c4ad817795158424f577c51c1e689b1d29d8
machine authorization commit = db439ed6ba74184b5f522c32116259ecbf76a005
execution trigger commit = 872da6b0507b91845516ca54da0da8058844d893
workflow run = 33716884975
job = 100527827048
lease artifact = 9878826404
lease ZIP SHA-256 = 28a365ea1736d4924131f51b507547ffeea25c1396c35031cffaae145fea578c
result artifact = 9879091983
result ZIP SHA-256 = 5ada1dcb0ceab7d89ea0bfc78410a14c3875ba03a01e31a243950706349de70a
canonical scientific-result SHA-256 = 05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9
selection SHA-256 = c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89
measurement core = 525efb5fff335bf22b0cf1a6f52e2944958055449bc80457af03c0e385c7ead5
formal core = 91d02434fbe6ba19784e4ef0d0c4099d54821a969b8ada8ac23d883d6712deda
scientific core = 2355969853b4e4d7faea063cee828f9713f94c38d8e0fed68386638717184849
```

## Population and execution integrity

```text
Stage 2 seeds = 31720001..31720384 / CONSUMED
selected = Namua 36 + Mtaji 36 = 72
production/independent selection exact = true
seed extension = 0
same-evidence rerun = 0
elapsedMs = 757726.688248
peakRssBytes = 359571456
resource gates = PASS
```

## Formal inference

```text
promoted candidates = 8
estimable = 7
CONFIRMED = 3
NOT-CONFIRMED = 4
NON-ESTIMABLE = 1
```

Confirmed:

1. depth × ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
2. node-budget × ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
3. quiescence × ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`

The three confirmations are candidate-level bounded associations. They do not establish causality, objective move correctness, game-theoretic difficulty or human difficulty.

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

No partial generation, read or resource probe occurred.

## No-rescue closure

Stage 1 and Stage 2 fresh evidence are closed. No seed extension, rerun, threshold change, direction change, endpoint redefinition or candidate rescue is allowed within SILGM-STUDY1.

Any additional validation must be separately prospectively authorized.

## Main integration firewall

Study closure does not authorize integration. The research branch must remain unmerged until the user explicitly instructs integration to `main`.
