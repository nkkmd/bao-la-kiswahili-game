# Current Status — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **STAGE 0 OPEN / SCIENTIFIC GENERATION NOT AUTHORIZED**

## Repository identity

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
previous reported main HEAD = 1a5a591d526b2383ca3540827eff6f8f39c14861
delta = one merge; FUTURE_RESEARCH_AGENDA priority update only
study branch = research/position-evaluation-winrate-calibration
```

## Completed initiation audit

- central research index and future agenda reviewed;
- Position Complexity Study 1 boundary restored;
- Tactical Motifs Study 1 decisions restored;
- TMHV Study 1 N=0 boundary restored;
- phase-transition / position-typology boundaries reviewed;
- first-player/continuation-policy dependence reviewed;
- `engine.js`, `ai.js`, `ai-weights.js`, benchmark/test/search diagnostic semantics audited;
- initial historical seed inventory started.

## Current technical decisions

```text
primary measurement candidate = static bao evaluation
perspective = selected actor / state.player
key secondary = exact D2 root search bestScore
phase = authoritative global state.phase
continuation principle = deterministic fixed hard/phase2/fixed-depth policy
within-state artificial replication = not assumed
```

## Open Stage 0 gates

1. close repository-wide seed audit;
2. freeze exact Stage 1 seed block and corpus size;
3. freeze opening generation and state-selection identity rules;
4. freeze continuation max-ply and administrative-truncation gate;
5. freeze exact deterministic continuation configuration;
6. freeze Stage 1 model-development candidates and selection rule;
7. implement/validate generator + independent verifier;
8. create source SHA-256 manifest;
9. create generation authorization artifact.

Until all required gates pass:

```text
scientificGenerationAuthorized = false
formalInferenceAuthorized = false
```
