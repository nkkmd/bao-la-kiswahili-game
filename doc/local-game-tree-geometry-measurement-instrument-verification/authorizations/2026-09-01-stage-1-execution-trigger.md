# LGTGMIV-STUDY1 — Stage 1 one-shot execution trigger

Date: 2026-09-01

## Trigger

Execute `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1` exactly once under the already-frozen Study protocol, preregistration and Stage 1 authorization.

This artifact is operational only. It changes no scientific contract term.

## Preconditions satisfied before this commit

- Stage 0 formal disposition: `STAGE0-PASS`
- separate Stage 1 authorization: `authorizations/2026-08-31-stage-1-development-authorization.md`
- Stage 1 tooling-smoke PASS checkpoint: `checkpoints/2026-09-01-stage-1-tooling-smoke-pass.md`
- tooling head used for the smoke: `6b56945f360324b216f1346c967887f27c5733b3`
- tooling-smoke workflow run: `33450117643 / success`
- Stage 1 fresh seed consumption before this trigger: none
- Stage 2 fresh seed consumption before this trigger: none
- protected standard-root exact depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`

## Frozen execution boundary

- seed block: `31110001..31110128`
- target population: 8 Namua + 8 Mtaji
- relative depth: 5
- authoritative identity: RAW-only `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transforms: `[]`
- candidate family set: the five prospectively frozen `LGTGMIV-F1..F5` families only
- production / structurally independent exact verification: required
- G3-01 identities: exclusion/firewall only; no G3-01 metric/outcome selection
- Stage 2: not authorized by this trigger

The no-rescue boundary becomes active as soon as the formal workflow first generates or reads Stage 1 fresh scientific seed/evidence. Any defect discovered after that point must be handled fail-closed under the frozen protocol; this trigger must not be recreated, modified or used to justify a same-evidence rerun.
