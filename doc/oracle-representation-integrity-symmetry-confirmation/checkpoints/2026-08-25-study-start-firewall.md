# Checkpoint — ORISC-STUDY1 study-start firewall

Date: 2026-08-25  
Status: **INITIALIZATION COMPLETE / FORMAL OUTCOME GENERATION BLOCKED**

## Baseline

```text
studyId = ORISC-STUDY1
baseline main HEAD = e8f0a3c360d9e7c9f7f6882fb212a32921040912
study branch = research/oracle-representation-integrity-symmetry-confirmation
open PRs at study start = 0
```

## Immutable upstream boundaries

### REWR-STUDY1

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

No ORISC operation may rewrite or retroactively reinterpret these upstream claims.

### SIP-STUDY1

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
notValidated = 0
nonEstimable = 5
v1 status = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No ORISC operation may convert the prior fresh zero-mismatch diagnostics into a SIP validation or change the closure counts.

## Prior information declared before formal ORISC generation

Known at this checkpoint:

1. SIP's read-only diagnostic had already identified three repository-facing terminal rows with stored-key mismatch and represented seed total 63.
2. ORISC Stage 0A provenance recovery retrieved the original REWR production and independent workflow artifacts.
3. In both original workflow artifacts, those three terminal raw states contain `pending=[1,0]`, and every one of the eight raw states represents 64 seeds under `pits + reserve + pending`.
4. The later repository-facing result contains `pending=[0,0]` for those three rows.
5. The repository-facing result first appears in commit `eb6052679e94de62bacec0eebe13758c7e85638d`, whose parent is the scientific workflow head `85c6a85fada301fcba526142549945e25a659855`.
6. The exact mechanism of the repository-row alteration is not yet established.

These facts are prior technical/provenance information and are forbidden from being relabeled as a new Stage 1 result.

## Allowed work before Stage 1 authorization

- read-only source/artifact/history inspection;
- synthetic fixture design and execution that does not evaluate the frozen oracle endpoint;
- serializer and terminal-semantics unit testing on synthetic states;
- independent implementation design;
- source/seed collision audit;
- prospective candidate derivation from current rule semantics;
- machine-readable contract drafting and validation that emits no scientific outcome;
- source/hash freeze preparation.

## Forbidden work before Stage 1 authorization

- formal evaluation of Stage 1 integrity endpoints;
- formal nontrivial symmetry candidate execution;
- creation of a scientific result artifact labeled as an ORISC result;
- rewriting the REWR repository oracle;
- replacing stored rows with reconstructed rows to make a gate pass;
- altering upstream formal decisions;
- interpreting the known three-row issue as the new Study's final answer.

## Post-outcome adaptation firewall

Before any Stage 1 outcome is generated, Stage 0B must freeze:

```text
raw identity fields
serialization grammar
seed-conservation representation
Stage 1 gates and decision labels
IDENTITY positive control
production/independent interfaces
Stage 2 scientific candidates
Stage 2 applicability predicates
Stage 2 state maps and move maps
Stage 2 negative control
Stage 2 populations / roots / graph depth / seed blocks
Stage 2 failure and non-estimability rules
```

After Stage 1 outcome generation begins, none of these may be changed to rescue Stage 1 or improve the prospects of Stage 2.

## Stage 2 authorization firewall

Stage 2 must remain `NOT-AUTHORIZED-NOT-EXECUTED` unless:

1. Stage 1 is validly completed under a frozen/authorized contract;
2. the Stage 1 representation-integrity authorization gate passes exactly;
3. IDENTITY passes every required state/move/transition/oracle/terminal check;
4. production and independent decisions agree exactly;
5. the Stage 2 candidate contract was frozen before Stage 1 outcome generation;
6. a separate Stage 2 authorization is subsequently issued against frozen hashes.

## Downstream state at this checkpoint

```text
raw state identity = authoritative
validated symmetry transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
formal ORISC scientific result = NONE
```
