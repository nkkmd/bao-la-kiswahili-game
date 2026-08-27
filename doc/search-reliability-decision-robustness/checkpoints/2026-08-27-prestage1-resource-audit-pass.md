# G2-02 pre-Stage 1 technical resource audit — PASS

Date: 2026-08-27

## Scope

This checkpoint records a technical-only resource-planning audit performed after `SRDR-S0-TECHNICAL-2026-08-27-v1` and before any Stage 1 scientific generation.

No Stage 1 scientific seed was consumed. No scientific reliability outcome was generated or interpreted. The audit used only reserved technical seeds `99002001..99002004` and selected six technically generated RAW states per phase.

## Execution

```text
workflow = G2-02 pre-Stage1 technical resource audit
run = 33064268544
commit = e524342ebcd82bcb3166b6fdf75d543e6ca195ac
conclusion = success
artifact ID = 9643049991
artifact ZIP SHA-256 = e164f4a73b3e6ab7b6a545ded1f20dd1d5b960bab2afe15c827905481d1bad2b
resultHash = 403336db7f7e6173d04747f31b2dd80f3d7a8da0b79acb342e42129bf380908f
scientificSeedConsumed = false
scientificInferenceAuthorized = false
scientificOutcomeGenerationAuthorized = false
```

## Resource envelope

For the twelve technical RAW states (Namua 6 / Mtaji 6), using canonical legal-move ordering, Bao evaluation, quiescence depth 1 unless otherwise stated:

```text
standalone D1 nodes: median 21 / p75 49 / p90 52 / max 80
standalone D2 nodes: median 51 / p75 181 / p90 222 / max 315
standalone D3 nodes: median 134 / p75 602 / p90 793 / max 1442

cumulative through D1: median 21 / p75 49 / p90 52 / max 80
cumulative through D2: median 73 / p75 230 / p90 274 / max 395
cumulative through D3: median 207 / p75 828 / p90 1067 / max 1837

D2 with quiescence depth 2 nodes:
median 62 / p75 556 / p90 689 / max 1295
```

These observations are resource-planning evidence only. They are not estimates of G2-02 search reliability.

## Prospective consequence

The Stage 1 development search grid is frozen before scientific generation to the bounded conditions in `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`:

- exact depth axis: D1/Q1, D2/Q1, D3/Q1;
- quiescence axis: D2/Q0 and D2/Q2 relative to the D2/Q1 anchor;
- node-budget axis: 64, 256 and 1024 nodes with `maxDepth=3`, Q1 and canonical move ordering;
- the node-budget decision is the last fully completed all-root-candidate iterative-deepening depth; a partial depth is discarded.

Move ordering is not a Stage 1 scientific perturbation because Stage 0 established that it can alter node consumption even where completed exact values remain invariant.

`D3_Q1` may be used as a frozen higher-resource search reference. It is not game-theoretic truth, a true best move oracle or a validated optimal-move oracle.
