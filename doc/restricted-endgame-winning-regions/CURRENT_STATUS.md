# CURRENT_STATUS — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24  
Status: **STUDY 1 COMPLETE / EXACT-SOLVED-WITHIN-FROZEN-DOMAIN / REPOSITORY CLOSURE COMPLETE**

## Repository identity

```text
studyId = REWR-STUDY1
baseline main HEAD = 626480507710e0095ef8aec6a53c3e4e0318fa4f
study branch = research/restricted-endgame-winning-regions
PR = #38 (merged)
merge commit = c31756ad4d236704c8cc237be5190eac432d67dc
directory = doc/restricted-endgame-winning-regions/
```

## Scientific state

```text
Rule/engine semantic audit = COMPLETE
Stage 0 technical feasibility = COMPLETE
Stage 0 outcome firewall = PASSED
Stage 0 selected domain = 8 states / 7 edges
Stage 0 independent graph reconstruction = PASS
Stage 0 one-shot v3 expansion = INFEASIBLE / V2 FALLBACK
Stage 1 domain/spec freeze = COMPLETE
Stage 1 pre-generation correction = COMPLETE BEFORE OUTCOME
Stage 1 authorization v2 = VALID
Stage 1 production exact solution = COMPLETE
Stage 1 independent full verification = PASS
Formal decision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
Repository integration = COMPLETE
```

## Frozen exact domain

```text
domainId = REWR-S1-DOMAIN-2026-08-24-v1
root count = 1
root state key = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
root witness seed = 22800188
root witness ply = 48
states = 8
edges = 7
symmetry reduction = none
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
```

## Formal exact result

```text
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Frozen root:

```text
player to move = Player 0
value = WIN
absolute forced winner = Player 0
DTF = 3
optimal move set = { capture:mtaji:1:4:left:::false }
```

Canonical state-level result:

```text
results/STAGE_1_EXACT_RESULT.json
```

## Independent verification

Scientific workflow:

```text
runId = 32702596730
artifactId = 9511074442
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
```

Identities:

```text
domainSha256 = acfc25413f9c237569884f166ed971ad9ee9395665ce96ec6d094d8ed4a6c56a
specSha256 = ec20df4621b7d8e50fd979bee4681c7eadb5bf2138c14911cb6ab97acd0738cc
authorizationSha256 = d3fe788e95606c6641ad4c33a396a2c02b21138b9b80bef2522f85cd124f282c
productionResultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
verificationResultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
```

Full verification checks all passed:

```text
root keys
state count
edge count
state-set hash
transition-set hash
value counts
full state-level rows
RECURRENT SCCs
solution hash
```

## Pre-generation correction record

Authorization v1 was revoked before any scientific outcome was generated because a runner/verifier resource-limit field name did not match the frozen spec. Only the field reference was corrected; domain, classification, DTF, selection rule and scientific endpoint were unchanged. Source hashes were re-frozen and authorization v2 was issued before the first scientific run.

This is a pre-generation technical correction, not post-outcome rescue.

## Permanent semantic boundaries

```text
relay-limit != normative Bao terminal
administrative cutoff != game-theoretic draw/loss
RECURRENT != formal DRAW
engine evaluation != exact game-theoretic value
empirical continuation outcome != exact game-theoretic value
bounded exact solution != full-Bao solution
```

The observed `RECURRENT = 0` applies only to the frozen 8-state domain.

## Final claim boundary

Allowed:

> Frozen `REWR-S1-DOMAIN-2026-08-24-v1` is exactly solved and independently verified. The frozen root is a Player-0 forced WIN with DTF=3 and unique optimal move `capture:mtaji:1:4:left:::false`.

Not allowed:

- full Bao solved;
- all Mtaji solved;
- all Bao endgames solved;
- Bao has no cycles or draws;
- engine evaluation is validated;
- symmetry transformations preserve value.

No further domain retuning, Stage 0 cap expansion or outcome-dependent root replacement is authorized within Study 1.

## Repository closure

PR #38 was merged to `main` after the complete final CI set passed on study HEAD `81828598430d3bb31f9284d23b7afb4ccabba6b1`. The merge commit is `c31756ad4d236704c8cc237be5190eac432d67dc`.

Central repository integration is complete in:

```text
README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
```

The next machine-only research item recorded by the agenda is **Symmetry / Isomorphic Positions**. This transition does not modify any result or claim boundary of `REWR-STUDY1`.
