# 2026-09-28 — G4-10 / Research Generation 4 main integration

Agenda: `Research Generation 4 / G4-10`  
Study: `FDERT-STUDY1`  
Integration decision: **`COMPLETE / NON-FORCE FAST-FORWARD`**

## Integration identity

```text
pre-integration main HEAD = 7eb59518753d9b8846d5ccf32246aba1b4b301cc
integrated research HEAD = 0a2fb472686f90f0cdb70f89b6d9daaf91068764
source branch = research/g4-10-fresh-depth11-exact-reachability-topology
method = non-force fast-forward
initial main fast-forward = COMPLETE
```

Immediately before integration, the research branch was `ahead 65 / behind 0` and its merge base was the pre-integration `main` HEAD.

## Preconditions

- pre-main consistency audit: `PASS / READY FOR SEPARATE MAIN-INTEGRATION GATE`
- final documentation audit: `PASS`
- final documentation audit run: `36370815727 / attempt 1 / success`
- `public/` delta before integration: 0
- root `README.md` delta before integration: 0
- frozen `doc/research-generation-4/PROGRAM_PLAN.md` delta before integration: 0

## Scientific state preserved

```text
G4-10 = CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP
T1 = NON-ESTIMABLE
T2 = NON-ESTIMABLE
T3 = NON-ESTIMABLE
T4 = NON-ESTIMABLE
same-evidence rerun = NOT AUTHORIZED
depth 12 = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

Integration did not rerun scientific computation, change any resource ceiling, promote partial depth-11 evidence, alter the formal classification, or change public AI production.

## Post-integration documentation sync

After the initial fast-forward, current-facing documents were synchronized from `RESEARCH BRANCH / MAIN INTEGRATION PENDING` to `MAIN INTEGRATED`. This synchronization changes repository-status wording only and does not change scientific evidence or interpretation.
