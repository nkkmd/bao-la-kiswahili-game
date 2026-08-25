# SSGTC-STUDY1 — Reproducibility Index

## Study identity

```text
studyId = SSGTC-STUDY1
baselineMain = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
branch = research/state-space-game-tree-complexity
representation = RAW-ONLY
scientificInference = NOT-AUTHORIZED
```

## Authoritative implementation baseline

- `public/engine.js` at study-start main SHA
- current raw identity contract revalidated against engine semantics and ORISC representation tooling

## Representation implementations

Planned SSGTC responsibilities:

- production raw validator / serializer;
- independent raw validator / serializer that does not import production identity code;
- production bounded expansion;
- independent artifact reconstruction / verifier;
- post-materialization verifier.

The independent verifier may share standard runtime/cryptographic primitives but not production state-key logic.

## Stage 0 frozen domain

```text
root = current engine standard initialState()
maxDepth = 2
symmetryReduction = false
scientificUse = prohibited
```

The exact root key and diagnostic graph/hash identities will be recorded only after Stage 0 tooling executes and passes representation validation.

## Planned scientific raw artifact contract

State record:

- `stateKey`
- authoritative seven-field raw state object
- non-identity technical metadata such as minimum BFS depth kept outside the raw identity
- canonical row hash

Transition record:

- `parentKey`
- canonical normalized move descriptor
- `childKey`
- technical depth metadata
- canonical row hash

Dataset identities:

- sorted raw-state-key set SHA-256;
- sorted canonical transition tuple SHA-256;
- explicit counts of generated successor occurrences, unique states, transitions, duplicates, and completed depth.

## Materialization chain

```text
scientific raw artifact
  -> verified materializer
  -> repository-facing artifact
  -> reopen / re-hash / semantic verification
```

A repository-facing projection is never used as raw-state authority merely because it is committed.

## Current artifacts

No SSGTC scientific raw artifact exists yet. Stage 0 has not yet produced diagnostic output. Historical Restricted Endgame, Symmetry, and ORISC artifacts are upstream references only and are not reused as SSGTC scientific evidence.