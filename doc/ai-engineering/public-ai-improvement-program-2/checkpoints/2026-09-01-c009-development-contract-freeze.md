# PBAI-P2 C009-v1 development contract freeze — 2026-09-01

`PBAI-C009-v1`はbaseline-only predevelopmentで`SUPPORT-PASS`となった後、candidate source変更前にexact development contractをfreezeした。

```text
support disposition = SUPPORT-PASS
exact contract = candidates/PBAI-C009-v1.json
contract freeze commit = c53a43287fe274418986e994e1fd881f696f5d9d
feature-off spec = PBAI-C009-v1-FEATURE-OFF-EQUIVALENCE-2026-09-01-v1
feature-off technical seeds = 43500001..43500064
development spec = PBAI-C009-v1-DEVELOPMENT-MEASUREMENT-2026-09-01-v1
development source = 42400001..42400512
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
```

Exact candidate mechanism:

```text
feature = pbaiC009SingleReplyExtension
default = false
public source surface = public/ai.js only
trigger = enhancedSearch nominal depth-zero cutoff, nonterminal, opponent-to-root-player, exact legal move variant count == 1
extension = apply exactly the sole ordinary move, then return directly through the same child quiescence with the existing alpha/beta, evaluator, qdepth and deadline
maximum extension per root-to-leaf path = 1 by structural direct-return design
no added time budget
no TT key/store policy change
no evaluator/quiescence parameter/move-ordering/rule-engine/Worker change
```

Frozen candidate-specific development conjunction:

```text
D4 TopSet agreement delta >= +0.03
mean normalized rank-loss delta <= -0.01
severe-loss-rate excess <= 0
catastrophic new loss = 0
median node ratio <= 1.25
p95 node ratio <= 1.75
eligible development roots >= 64
negative-control trigger = 0 and exact pre-existing search-stat equality
```

C008 development row-level outputはC009 selection/threshold/mechanismの入力にしない。Research Generation 3 influenceは0のまま維持する。

次に許可されるのはisolated C009 implementationとfeature-off exact equivalenceだけである。Development benefit executionはequivalence PASS後のみ許可する。
