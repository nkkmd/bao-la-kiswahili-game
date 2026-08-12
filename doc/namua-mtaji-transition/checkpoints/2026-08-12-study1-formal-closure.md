# Checkpoint — Namua→Mtaji Study 1 formal closure

Date: 2026-08-12  
Status: **RESEARCH COMPLETE / CLOSED WITH PRIMARY NOT-CONFIRMED RESULT**

## Closure decision

The Namua→Mtaji temporal-transition Study 1 is formally closed.

The prospectively frozen Stage 2 primary association was estimable, integrity gates passed, the outcome firewall was respected, the frozen Mtaji classifier passed audit, and the single preregistered primary test completed.

Formal decision:

```text
NOT-CONFIRMED
```

No rescue analysis changes this decision.

## Final formal identity

```text
condition = P2-D2 only
hard / bao / phase2 / depth2
formal games = 4096
seeds = 20280001..20284096
formal source commit = b0e04a1c53d9c4d982a37c9489f3b56d9e6282ca
input config hash = 9485ef557e3ee00e3719e754c4ed202ca408a2bd0866a9f596896046406a17c3
```

## Integrity

```text
full verification = PASS
deterministic clock violations = 0
first Mtaji at ply 44 = 3886 / 3886 reached-Mtaji games
frozen Mtaji classifier audit = PASS
post-evaluation artifact audit = PASS
```

## Estimability

```text
unique earliest-CBE trajectories = 31
morphology-eligible exposed trajectories = 30
G1 required >= 20 -> PASS
G2 exactly 20 controls/exposure -> PASS
matched sets = 30
unique controls = 600
control reuse = 0
progression violations = 0
```

## Outcome firewall

Preoutcome matching was frozen before M1/M2 inspection.

```text
matchingAssignmentHash
= b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1

preoutcomeAssignmentCsvSha256
= bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374
```

Independent review passed before exact outcome unlock commit:

```text
afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
```

## Primary result

```text
Exposed M1 = 26 / 30
Controls M1 = 509 / 600
matched risk difference = +0.0183333333
MH common OR = 1.1617647059
observed T = 26
p_two_sided = 1.0
alpha = 0.05
formal decision = not-confirmed
```

No direction label is assigned.

## Permanent interpretation boundaries

The closure does not authorize:

- causal interpretation;
- a claim that CBE has no downstream structure of any kind;
- a timing/hazard interpretation;
- CBE acceleration/delay of Mtaji;
- generalization beyond P2-D2;
- candidate-ply subgroup rescue;
- alternative comparator rescue;
- threshold/classifier refitting;
- additional Stage 2 formal games or favorable reseeding.

The deterministic Namua clock remains permanent for the frozen engine:

```text
first Mtaji = ply 44 for surviving standard trajectories
candidate-to-Mtaji distance = deterministic progression, not survival time
```

## Canonical closure documents

```text
doc/namua-mtaji-transition/STUDY_1_OVERVIEW.md
doc/namua-mtaji-transition/STUDY_1_FINAL_REPORT.md
doc/namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md
doc/namua-mtaji-transition/REPRODUCIBILITY_INDEX.md
doc/namua-mtaji-transition/CURRENT_STATUS.md
```

## Future-work rule

Any further confirmatory analysis is a new independent study and requires a new prospective design and fresh corpus. Stage 2 cannot be extended or redefined to rescue the `not-confirmed` result.
