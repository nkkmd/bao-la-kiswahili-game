# Stage 0 Design Readiness Checkpoint

Date: 2026-08-16  
Study: Tactical Motif Human / Expert Validation Study 1  
Stage ID: `TMHV-S0-DESIGN-2026-08-16-v1`

## Decision

**PASS FOR STAGE 1 MACHINE / INSTRUMENT DEVELOPMENT.**

**HUMAN SCIENTIFIC DATA COLLECTION REMAINS NOT AUTHORIZED.**

## Repository baseline

Stage 0 began from current `main`:

`3cc40d83917660dd815c785ff0e0c754666d9a0e`

This exactly matched the study-initiation reference SHA.

## What Stage 0 established

Repository/code inspection established that:

- the historical `TM-S2-C03` identity and machine-only interpretation boundary are recoverable without ambiguity;
- Tactical Motifs Study 1 decisions remain immutable historical evidence;
- existing observations contain sufficient rule-state fields for deterministic state reconstruction in the established research tooling;
- the existing candidate matcher can operationalize the frozen C03 precondition and move abstraction without future human outcomes;
- existing corpus tooling demonstrates a reusable pattern for fresh seeded generation, opening-prefix identity, trajectory identity, independent verification, and outcome-blind root selection;
- existing UI/diagnostic code provides the board-orientation and state-serialization basis needed for a dedicated position-only study renderer;
- `artifacts/local/` is excluded from ordinary Git tracking, while identifiable human data still require a stronger private storage boundary.

## Execution-validation boundary

Stage 0 did **not** generate the reserved fresh 1,536-game stimulus corpus, did not select formal human stimuli, and did not collect any human endpoint response.

The new study-specific corpus runner, verifier, control matcher, renderer, questionnaire, randomization/export layer, and Stage 2 preregistration validator do not yet exist and therefore have not been execution-validated.

A local runtime smoke attempt from the current assistant execution environment could not clone the repository because outbound GitHub DNS/network access was unavailable in that container. This is an execution-environment limitation, not evidence that repository tooling passes or fails.

Accordingly, Stage 1 must obtain its own reproducible execution/CI validation before any scientific stimulus generation is accepted. Static feasibility inspection is not a substitute for that validation.

## Stage 1 entry gates

Before the reserved fresh machine pool is treated as scientifically usable for stimulus construction, Stage 1 must at minimum:

1. freeze a new machine-readable Stage 1 contract and source-hash boundary;
2. validate the fresh generator and independent verifier on non-scientific smoke inputs;
3. validate exact C03 target and prespecified near-miss control classification;
4. validate deterministic board rendering/orientation and state roundtrip;
5. validate stimulus identity/no-reuse/randomization audits;
6. preserve complete separation from Tactical Motifs Study 1 Stage 2 roots;
7. record that no human outcome was used in matching/caliper/stimulus decisions.

## Human-study gate

Even after Stage 1 technical success, Stage 2 remains blocked until:

- expert recruitment feasibility is established under the frozen outcome-blind eligibility criteria;
- applicable ethics-review determination and informed-consent materials are complete;
- private raw-data storage and withdrawal handling are operational;
- formal stimuli and all analysis/exclusion/stopping/no-rescue rules are frozen in a validated machine-readable Stage 2 preregistration.

If those gates cannot be satisfied, the correct stopping state is:

`DESIGN COMPLETE / HUMAN DATA COLLECTION NOT STARTED`
