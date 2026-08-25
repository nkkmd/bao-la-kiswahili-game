# SSGTC-STUDY1 — Decision Register

All decisions below are frozen before any Stage 0 count is interpreted and before any Stage 1 scientific outcome is observed.

## D001 — Prospective independence

SSGTC-STUDY1 is a new independent prospective study. Completed Bao studies are immutable upstream context, not data to be rescued or re-decided.

## D002 — Baseline

Study-start remote `main` is `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`. Work occurs only on `research/state-space-game-tree-complexity` until an explicitly authorized merge.

## D003 — Authoritative raw identity

Identity fields are exactly `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`. `turn` and `reason` are excluded from identity.

Missing `pending` is invalid. No study code may repair it to `[0,0]` before identity validation.

## D004 — Representation invariant

Every accepted state must satisfy `sum(pits)+sum(reserve)+sum(pending)=64`. Validation occurs before and after every studied transition.

## D005 — Symmetry prohibition

Study 1 forbids all symmetry-reduced canonicalization and quotient counting, including seat swap, left/right reflection, compound transforms, SIP T01/T02/T03, ORISC T01/T02/T03, and any assumed geometric symmetry. The validated transformation set available to this study is `[]`.

## D006 — Claim vocabulary separation

The study will not conflate:

- raw rule-state space;
- reachable raw state space;
- bounded reachable raw state space;
- game-tree nodes / generated successor occurrences;
- unique raw states;
- transpositions;
- trajectories;
- historical encountered-state counts;
- observed sample counts;
- estimates.

A global statement of the form `Bao state space = X` is unauthorized absent a complete proof/exhaustive enumeration of that target.

## D007 — Exactness rule

An exact count requires an explicitly frozen target domain, exhausted frontier, no censoring, successful representation gates, deterministic replay, complete artifact verification, and independent agreement. A bounded exact result is exact only inside its frozen domain.

A resource-censored exact attempt cannot be relabeled as an estimate.

## D008 — Stage 0 scope

Stage 0 is technical only. Its shallow graph counts are diagnostics for serializer, replay, duplicate detection, graph cross-check, and materialization integrity; they are not scientific evidence about Bao growth.

## D009 — Independent verification

Production and independent raw serializers must be separately implemented. The independent representation verifier must not import or call the production serializer. Production expansion may be verified by independent reconstruction from emitted raw records, but this must not be described as an independently implemented Bao rule engine unless such an engine is actually implemented.

## D010 — Artifact provenance

Required chain:

```text
scientific raw artifact
  -> verified materializer
  -> repository-facing artifact
  -> post-materialization re-hash and semantic verification
```

Reporting projections never become identity authority.

## D011 — Resource / stopping discipline

Stage 1 and any Stage 2 resource caps must be frozen before the corresponding outcome is inspected. The first applicable cap stops expansion. Partial layers are censored; only fully completed verified layers can support bounded-exact layer claims. Caps may not be lifted after observing a scientifically desirable pattern.

## D012 — Stage separation

Stage 0 fixtures, Stage 1 exploratory corpus, and any Stage 2 formal population use distinct namespaces. Stage 1 rows are never formal Stage 2 evidence.

## D013 — Estimator firewall

No estimator is currently authorized. Any future estimate requires a separately frozen protocol specifying target population, estimator, sampling mechanism, truncation/censoring, coverage assumptions, duplicate handling, uncertainty, and failure conditions before the relevant formal data are observed.

## D014 — Study-level outcome labels

The following labels are reserved and may be used only after their applicable protocol defines and satisfies them:

- `SSGTC-EXACT-WITHIN-FROZEN-DOMAIN`
- `SSGTC-RESOURCE-CENSORED`
- `SSGTC-ESTIMABLE`
- `SSGTC-NON-ESTIMABLE`
- `SSGTC-TECHNICALLY-INVALID`

Stage 0 itself uses only technical PASS/BLOCK language and produces no scientific decision.

## D015 — No-rescue firewall

Prohibited after outcome inspection: changing depth/caps for favorable growth, filtering favorable seeds, changing duplicate identity, dropping raw fields, omitting `pending`, introducing symmetry, relabeling failed exact enumeration as estimate, switching estimator/interval opportunistically, reusing Stage 1 as Stage 2 evidence, or promoting upstream negative/non-estimable diagnostics into positive evidence.

## D016 — Integration

No merge to `main` and no auto-merge are authorized before study completion, documentation audit, CI/reproducibility checks, and explicit user instruction.