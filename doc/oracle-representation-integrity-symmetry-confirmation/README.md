# Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1

**Study ID:** `ORISC-STUDY1`  
**Status:** `INITIALIZED / STAGE 0 TECHNICAL-PROVENANCE AUDIT / SCIENTIFIC OUTCOME GENERATION BLOCKED`  
**Branch:** `research/oracle-representation-integrity-symmetry-confirmation`  
**Baseline main HEAD:** `e8f0a3c360d9e7c9f7f6882fb212a32921040912`

## Purpose

This is a new prospective independent Bao study. It audits whether the immutable Restricted Endgame Study 1 exact-oracle representation is suitable as a raw-state reconstruction anchor and, only if prospectively defined representation-integrity gates pass, conditionally performs a new independent symmetry/isomorphism confirmation.

It is **not**:

- a continuation, Stage 2, corrected v2, rescue, or retrospective reanalysis of `SIP-STUDY1`;
- a correction or invalidation of `REWR-STUDY1`;
- authorization to rewrite any upstream oracle artifact;
- authorization to use symmetry reduction or canonicalization.

## Immutable upstream boundaries

`REWR-STUDY1` remains:

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

`SIP-STUDY1` remains:

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
notValidated = 0
nonEstimable = 5
validated symmetry transformation set = empty
canonicalization = not authorized
symmetry-reduced state counting = not authorized
```

## Stage structure

```text
Stage 0A  Technical / semantic / provenance reconstruction audit
          No scientific symmetry decision

Stage 0B  Pre-outcome contract freeze
          Freeze representation endpoints, identity controls,
          Stage 2 candidate-selection contract, populations,
          source identities, failure rules, and independent interfaces

Stage 1   Formal Oracle Representation Integrity
          Full exact 8-state / 7-edge reconstruction and artifact-binding audit

Stage 2   Conditional Independent Symmetry Confirmation
          Executable only if all predefined Stage 1 authorization gates pass

Stage 3   Canonicalization / downstream authorization decision
          Executable only from valid Stage 2 evidence
```

## Current downstream contract

Until a valid new formal result says otherwise:

```text
raw state identity = authoritative
validated symmetry transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
```

## Documents

- `STUDY_1_OVERVIEW.md` — initial human-readable scope; no result yet
- `PROTOCOL_DRAFT.md` — prospective design and gates; not yet frozen/authorized
- `CURRENT_STATUS.md` — current repository/scientific state
- `DECISION_REGISTER.md` — immutable decisions and firewall rules
- `REPRODUCIBILITY_INDEX.md` — source/artifact identities and provenance anchors
- `RESEARCH_LOG.md` — chronology
- `checkpoints/2026-08-25-study-start-firewall.md` — start checkpoint

No formal scientific outcome generation is authorized by the existence of these documents.