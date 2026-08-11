# Checkpoint — Stage 0 closed / Stage 1 exploratory protocol frozen

Date: 2026-08-11  
Branch: `research/namua-mtaji-temporal-transition`

## Stage 0 decision

Local technical artifacts generated from:

```text
023a8bd16ec16838e1a5f072bdc941f702f850b6
```

were reviewed.

Stage 0 is closed as **PASS**.

Verified evidence includes:

```text
configHash  = 49cbccf1b060afccc9148b70308484eb6c30abb8e800c8b50ec931f1e7a27492
summaryHash = c64ab305cd4691a44738d3068187c453ad2b609aaabf28083aa8652d1b18f916
frozen Mtaji candidateDefinitionHash
            = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Technical smoke:

```text
8 games
452 observations
1878 legal moves checked
452 legacy compatibility checks
8 phase transition events
all verifier checks passed
source hashes matched
```

The frozen Mtaji artifact was found and independently rehashed successfully. No refit, restandardization, or relabeling occurred.

The observed smoke M1/M2 counts are technical-only and are not treated as scientific evidence.

## Scientific boundary unchanged

No closed-study decision changed.

No formal new-study endpoint, comparator, time origin, statistical unit, model, condition set, sample size, or formal seed block has been frozen.

## Stage 1 protocol decision

Stage 1 is authorized as a consumed exploratory feasibility corpus only.

Pre-generation identity:

```text
32 paired opening replicates
6 conditions
192 games
opening seeds 20271001..20271032
opening plies = 8
max ply = 100
```

Conditions:

```text
P2-D1
P2-D2
P2-D3
LG-D2
LG-D3
V2-D2
```

The seed range is exploratory and permanently excluded from later formal held-out use.

## Category-A semantic preservation

A key governance decision was made before pilot generation:

> `capture-branch-expansion` will not be applied directly to every ply.

The inherited phenotype is evaluated only in the inherited Category-A candidate context.

Stage 1 therefore imports/reuses the historical candidate pipeline with:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
non-forcing groups = reserve, mobility, capture, front
cluster max gap = 1
Category A = survives forcing-excluded candidacy and is not forcing-coincident
```

This avoids silently changing the phenotype's domain.

## Stage 1 analysis boundary

Allowed:

- event incidence/support;
- reserve/progression support;
- temporal support;
- multiplicity/overlap;
- censoring/competing-event feasibility;
- frozen first-Mtaji morphology feasibility.

Not allowed:

- confirmatory inference;
- p-value driven comparator choice;
- p-value driven time-origin choice;
- classifier threshold changes;
- formal corpus reuse;
- closed-study rescue.

## Next pause point

Stage 1 runner, deterministic verifier, inherited Category-A extractor, and temporal event-support audit are being fixed on the research branch. After those files and the runbook are complete, local Stage 1 generation is the next required execution step.
