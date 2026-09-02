# BRMGI-STUDY1 — Post-Stage-0 Stage 1 authorization review

Date: 2026-09-03

## Formal decision

**`BRMGI-STAGE1-PREPARATION-AUTHORIZED / FRESH-SCIENTIFIC-EXECUTION-NOT-AUTHORIZED`**

Stage 0は`BRMGI-S0-TECHNICAL-2026-09-03-v2 = STAGE0-PASS`としてtechnical readinessを確立した。v1 technical-invalidはrerunせず、v2は別versionとしてexactly one authorized executionでPASSした。

このreviewはStage 1 fresh seed `31610001..31610256`の生成・readをauthorizeしない。Stage 1 scientific execution前に、fresh-freeなimplementation / firewall / source-binding / static audit / execution-control validationを完了し、別のmachine-readable exactly-one execution authorizationを記録する必要がある。

## Review findings

1. **Measurement foundation remains eligible.** LGTGMIV F1-F5 / RAW-only / relative depth 5だけでM1-M6を再現可能に構成でき、Stage 0 production/independent technical reconstructionはexact一致した。
2. **Event semantics are technically implementable.** E1 capture、E2 nyumba stop/use、E3 linked reserve-exhaustion/Namua→Mtaji、およびE0 control semanticsはtechnical fixture上でproduction/independent一致した。
3. **Causal boundary remains unchanged.** Generic causal mechanismはauthorizeしない。E1/E3はobservational event-conditioned contrast、E2もsame-root move-conditioned contrastに限定する。
4. **Source-move ambiguity is resolved pre-fresh.** Actual source trajectoryはfrozen `engine.legalMoves`、E2 arm enumerationだけ`engine.moveVariants`を使う。`prereg/STUDY_1_SPEC_CLARIFICATION_1.json`を正とする。
5. **Protected depth-10 is unnecessary.** Stage 1はrelative depth 5とfresh trajectoryだけで実行可能。depth-10 generation/read/resource peekは引き続き禁止。
6. **G3-05 relay-limit is technical risk only.** Stage 1 required reconstructionでrelay-limitが出ればStage全体を`TECHNICAL-INVALID`としてfail closedし、root replacement / seed extension / rerunを行わない。
7. **Freshness can be enforced without upstream outcome reuse.** New seed namespaceは既存scientific seedと非重複。加えてupstream identity-only manifests / explicit seed-range exclusion / Stage 1 identity materializationを使用し、scientific outcome fieldsをselectionへ保持しない。
8. **Execution is not ready yet.** Stage 1 production/independent source selector、event unit constructor、measurement aggregator、identity-only firewall、resource accounting、one-shot runner、static separation audit、durable lease/artifact control planeはこのreview時点では未完成である。

## Required preparation gates before Stage 1 execution authorization

- production implementation binds only to `brmgi-production.js` / LGTGMIV production;
- independent implementation binds only to `brmgi-independent.js` / LGTGMIV independent;
- actual source replay uses `engine.legalMoves`, not outcome-dependent move variants;
- E2 variant enumeration does not alter source trajectory evolution;
- E1/E2/E3 selection is deterministic, seed-ascending, geometry/value/outcome blind;
- target/cap logic is exactly 8 comparable units per event family, max 1 per event family per trajectory;
- no seed extension/replacement path exists;
- upstream firewall retains identity only and excludes scientific outcome fields;
- per-root and stage resource ceilings are executable fail-closed gates;
- canonical scientific equality uses deterministic serialized content, not prototype-sensitive runtime equality;
- unarmed runner fails before Stage 1 seed access;
- one trigger path, concurrency guard, durable pre-computation lease, source blob binding, artifact-before-mirror, exact-byte recovery;
- Actions history confirms zero Stage 1 scientific executions before final authorization.

## Current evidence state

```text
Stage 1 seed = 31610001..31610256 / RESERVED / NOT CONSUMED
Stage 2 seed = 31620001..31620384 / RESERVED / NOT CONSUMED
fresh G3-06 scientific evidence = NOT GENERATED / NOT READ
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## Next permitted action

Stage 1 preparation may proceed on the research branch. Fresh Stage 1 scientific execution remains **NOT AUTHORIZED** until all preparation gates pass and a separate exactly-one execution authorization is committed.
