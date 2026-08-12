# Stage 1 Exact-Ply Risk-Set Support Audit — Result

Date: 2026-08-11  
Status: **PASS for comparator feasibility / Stage 2 still blocked by exposure scarcity**  
Study: Namua→Mtaji Strategic Temporal Transition

## 1. Scope

This result records the prespecified, outcome-blind exact-ply risk-set feasibility audit described in `STAGE_1_PROTOCOL_AMENDMENT_2.md`.

It does **not** freeze a formal comparator and does not inspect MTAJI-M1/M2 contrast by risk-set family.

The audit uses only the already-consumed Stage 1 pilot corpus. No new games are generated.

## 2. Input identity

```text
Stage 1 configHash
= 88a90e90ded76151d200d75e419097bb7b581cd662da08a1a015e39ce990360c
```

Exposure identity after trajectory-ply deduplication:

```text
raw CBE rows                    = 2
unique CBE trajectory-ply units = 1
candidate ply                   = 33
landmark ply                    = 41
forcedCapture at candidate      = true
condition rows                  = P2-D2, V2-D2
```

Both condition rows are the same historical trajectory and therefore remain one exposure unit.

## 3. Risk-set families

The audit evaluated nested control families:

```text
R0 = same condition + exact candidate ply
R1 = R0 + not Category-A at the index ply
R2 = R1 + forcedCapture status matched
R3 = R2 + no Namua CBE anywhere in the control trajectory
```

Comparator selection did not use later Mtaji eligibility or morphology labels.

## 4. Main feasibility result

For the single unique exposure at ply 33:

### P2-D2

```text
R0 = 31 unique historical trajectories
R1 = 31
R2 = 31
R3 = 31
```

Of the 31 R3 controls:

```text
reached Mtaji                  = 30
first-Mtaji morphology eligible = 30
terminal before Mtaji         = 1
administrative truncation     = 0
```

### V2-D2

```text
R0 = 31 unique historical trajectories
R1 = 31
R2 = 31
R3 = 31
```

Of the 31 R3 controls:

```text
reached Mtaji                  = 31
first-Mtaji morphology eligible = 31
terminal before Mtaji         = 0
administrative truncation     = 0
```

Therefore the strictest prespecified risk-set family does not collapse comparator support in either condition.

## 5. Progression support

Exact-ply anchoring performs the intended deterministic progression control.

At candidate ply 33 all R3 controls have:

```text
actor reserve    = 6
opponent reserve = 5
total reserve    = 11
```

At landmark ply 41 all surviving/observed R3 states have:

```text
total reserve = 3
```

No deterministic-clock progression violations were found.

This addresses the Stage 1 primary-pilot problem in which the inherited Stage 6 comparator family had no reserve/progression overlap with CBE.

## 6. Structural positivity diagnostic

The observed CBE exposure was compared with the R3 control ranges only as a feasibility/positivity diagnostic, not as effect testing.

Across 28 candidate/landmark numeric structural quantities retained by the audit, the exposure lies within the R3 control range for 27/28 quantities in both P2-D2 and V2-D2.

The exception is:

```text
candidateOpponentFrontSeeds
CBE exposure = 6
R3 controls  = 8..28
```

This does not justify adding front-row quantities to comparator matching. Such quantities are close to the strategic phenotype itself and matching on them could remove the structure the study is intended to evaluate.

Current design implication:

> use deterministic progression and pre-exposure/risk-set eligibility for comparator construction; do not automatically match away capture/front-row phenotype quantities.

## 7. Cross-condition duplicate structure

The 62 R3 condition rows represent only 48 unique historical trajectories across P2-D2 and V2-D2.

There are 14 trajectories shared by both conditions in this risk set.

Across the full Stage 1 pilot:

```text
duplicate historical trajectory groups = 22
largest group size                     = 3
```

The most common duplicate condition relation is P2-D2 / V2-D2.

Therefore formal analysis must not count identical historical trajectories observed under multiple condition labels as independent evidence.

The primary unit remains unfrozen, but trajectory-level deduplication or clustered treatment is mandatory in any later design.

## 8. What this audit resolves

Resolved:

1. exact-ply progression matching is technically feasible;
2. same-condition control supply is abundant for the observed exposure;
3. forced-capture matching does not reduce support at ply 33;
4. excluding controls with Namua CBE elsewhere does not reduce support in this pilot;
5. first-Mtaji follow-up is available for essentially all candidate controls;
6. the previous comparator-overlap failure is not an inherent limitation of the study.

## 9. What remains unresolved

The dominant unresolved problem is exposure scarcity.

```text
unique CBE trajectory-ply units = 1
```

One exposure cannot support:

- localization-distribution design;
- repeated-event policy selection;
- stable comparator-ratio planning;
- formal sample-size planning;
- morphology association design;
- structural carry-through model selection.

Therefore Stage 2 design freeze remains unauthorized.

## 10. Next action

Run a fresh, consumed **Stage 1 exposure-support extension** using conditions selected strictly from exposure-availability evidence, not morphology outcomes.

The extension must:

- use a disjoint exploratory seed block;
- keep all inherited Category-A/CBE definitions unchanged;
- preserve paired openings where multiple conditions are used;
- deduplicate exposure support by `historicalTrajectoryHash + candidatePly`;
- inspect exposure availability/localization/multiplicity only before Stage 2;
- not inspect CBE-vs-control M1/M2 effect contrast;
- not reuse extension games in the formal corpus.

## 11. Decision

> **The exact-ply risk-set comparator concept passes feasibility. Comparator scarcity is no longer the blocking issue. Stage 2 remains blocked because the Stage 1 pilot contains only one unique CBE exposure trajectory-ply unit. The next prospective step is a fresh exposure-support extension, not formal preregistration.**
