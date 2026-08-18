# 2026-08-18 — Stage 0 design freeze / local technical validation pending

Study: Position Evaluation / Win-Rate Calibration Study 1  
Status: **DESIGN FROZEN / SCIENTIFIC GENERATION NOT AUTHORIZED**

## Frozen decisions

- baseline main `8672ba4fafb896124df0c4728d41f7c3a6ed5056`;
- Stage 1 1024 games, seeds `22200001..22201024`;
- Stage 2 namespace reserved at 2048 games, seeds `22300001..22302048`;
- opening first 8 plies seeded-uniform exact `E.moveVariants`;
- deterministic continuation `hard / bao / phase2 / D2 / Infinity`;
- max ply 160;
- one selected root maximum per unique historical trajectory;
- prospective SHA phase assignment and within-phase state ranking;
- no replacement for unavailable phase or duplicate selected rule state;
- primary score `AI.evaluate(state,state.player)`;
- key secondary exact D2 root bestScore;
- administrative truncation is not a draw;
- Stage 1 candidate mappings limited to phase-aware logistic and phase-stratified isotonic;
- five-fold trajectory-level CV and Brier selection rule frozen.

## Tooling state

Stage 1 spec, validator, technical smoke, production runner, verifier and contract test have been materialized on the research branch.

The production runner requires a source-bound authorization artifact that is intentionally absent. Therefore no Stage 1 scientific generation can begin from this checkpoint alone.

## Next gate

Run the exact Stage 0 local commands in `STAGE_1_RUNBOOK.md` and audit the returned `smoke.json`. Only a PASS artifact with clean source provenance may be used to create the separate Stage 1 authorization record.

No existing study decision is changed by this checkpoint.
