# ETHICS_AND_DATA_GOVERNANCE — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-18  
Status: **CLOSED BEFORE HUMAN-FACING RESEARCH**

## 1. Original recruitment gate

The study design required that scientific participant recruitment or response collection not begin until:

1. participant information/consent materials were finalized;
2. the responsible researcher determined and documented the applicable ethics-review requirement;
3. any required approval/exemption/not-required determination was obtained before recruitment;
4. private data storage and withdrawal workflow were operational.

The repository itself was never treated as ethics approval.

## 2. Study closure before recruitment

The study was conducted as independent research without institutional affiliation.

Before scientific recruitment began, the investigator determined that there was no feasible current route to contact qualified Bao experts, researchers, or competitive players for the frozen primary cohort.

The human-facing phase was therefore not launched.

Observed closure state:

```text
scientific recruitment authorized = false
scientific recruitment started = false
persons contacted for scientific recruitment = 0
consented participants = 0
formal human responses = 0
identifiable participant data collected = false
```

## 3. Ethics claims at closure

This study makes **no claim** of:

- institutional ethics approval;
- ethics exemption;
- a general determination that ethics review is unnecessary for this topic;
- permission to recruit future participants under this closed protocol.

Because no human-facing scientific procedure was initiated, no consent procedure was executed and no participant-data retention/withdrawal lifecycle became active.

A future human validation effort must make its own applicable ethics determination before recruitment.

## 4. Data actually collected

Human participant data collected in Study 1:

```text
contact data = 0
linkage records = 0
eligibility records = 0
consent records = 0
task responses = 0
free-text responses = 0
```

The only retained private artifact relevant to a possible future human study is the exact machine-generated formal stimulus freeze, which contains no human participant data.

Private freeze SHA-256 commitment:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

## 5. Public repository boundary

Public GitHub may retain:

- protocol/spec/schema;
- aggregate machine results;
- stimulus cryptographic commitments;
- software/tooling;
- audit manifests and reproducibility metadata;
- the N=0 recruitment-feasibility closure.

No participant-identifying material exists from this study.

## 6. Counterfactual policy if a future human study is opened

If a later prospective study recruits humans, the prior design principles remain appropriate starting constraints:

- collect only necessary eligibility/provenance/endpoint fields;
- keep contact information separate from scientific responses;
- use pseudonymous participant IDs;
- treat free text as potentially identifying;
- define withdrawal and retention before consent;
- keep identifiable raw data outside public Git;
- provide formal materials in languages participants can adequately understand.

These are future-study requirements, not evidence that they were executed in the present N=0 closure.

## 7. Final governance boundary

The present study closes with:

```text
humanParticipants = 0
humanDataCollected = false
scientificRecruitmentStarted = false
institutionalEthicsApprovalClaimed = false
ethicsExemptionClaimed = false
```

The lack of human data cannot be reinterpreted as human support or opposition to `TM-S2-C03`.
