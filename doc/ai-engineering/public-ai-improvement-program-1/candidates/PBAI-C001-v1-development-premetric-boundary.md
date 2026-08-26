# PBAI-C001-v1 development premetric boundary

Status: **ISOLATED DEVELOPMENT / PREMETRIC ONLY**

This file records the execution boundary for the isolated `PBAI-C001-v1` implementation before any frozen D4 intended-benefit metric is evaluated.

```text
candidate branch base main = 65a335b455bfb288931487747d633315f71d1d17
candidate feature = pbaiC001NamuaForcedCaptureLegacy
public default = off
allowed public source surface = public/ai.js only
premetric target set = frozen 64 development targets
premetric controls = frozen 32 Mtaji + 20 Namua non-forced controls
D4 reference evaluation = prohibited in premetric stage
candidate benefit metrics = prohibited in premetric stage
validation seeds = prohibited
release holdout seeds = prohibited
public adoption = not authorized
AI-GEN3 promotion = not authorized
```

Premetric PASS requires all 64 targets to trigger, feature-off behavior to match the frozen baseline, feature-on target behavior to match the already-existing legacy search path, all frozen controls to remain non-triggering and equivalent, and easy/normal/MCTS/explicit-legacy semantics to remain unchanged.

A later D4 development measurement may run only after this premetric stage passes. The candidate mechanism, trigger, selected development population and prospectively frozen benefit thresholds may not be changed in response to premetric or later outcome values.
