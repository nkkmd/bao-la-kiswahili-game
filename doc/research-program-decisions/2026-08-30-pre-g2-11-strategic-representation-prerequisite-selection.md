# Pre-G2-11 Strategic Representation Prerequisite — Program Selection Decision

Date: 2026-08-30
Status: **HISTORICAL SELECTION DECISION / REALIZED AS `PSRRE-STUDY1` / CLOSED `NON-ESTIMABLE`**
Scope: Research Generation 2 program sequencing after `G2-10 / UMSSR-STUDY1`
Repository baseline at selection: `87d9ccf9825b9b9160dcab23202a17d66ef0d541`

## この選択の実施結果

このhistorical selectionは、その後次のStudyとしてprospectively具体化された。

```text
Study ID = PSRRE-STUDY1
Formal title = Prospective Strategic-Regime Representation Eligibility Study 1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 candidate input authorized = false
```

Studyはfrozen representationを生成しなかった。Stage 1はtechnical / resource / full-exact verificationを完了したが、prospectively frozen minimum-nonzero-MAD-feature readiness gateを`15 < 20`で満たさなかった。本selection recordはhistorical sequencing provenanceとして保持し、現在のclosure stateは[`2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md`](2026-08-30-pre-g2-11-strategic-representation-prerequisite-closure.md)を正本とする。

## Decision

`G2-10 / UMSSR-STUDY1` closed without an eligible frozen strategic-state representation:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 candidate input authorized = false
```

Therefore `G2-11 — Long-Horizon Strategic Transition Structure Study 1` must **not** begin by reusing or post-hoc modifying the `UMSSR-STUDY1` representation.

The next research direction is a **new prospective independent strategic-representation prerequisite Study** whose purpose is to construct and validate an eligible representation that may later serve as an input candidate for G2-11.

This prerequisite Study is inserted between G2-10 and G2-11 as a dependency-resolution Study. It is **not a new `G2-xx` agenda sequence label**. `G2-01..G2-12` remain the fixed core agenda labels defined by the Research Generation 2 program decision.

## Working research description

Japanese working description:

> BaoにおけるG2-11入力用strategic-state / regime representationの新規構築とprospective eligibility検証 — G2-10の40-feature / deterministic K-means contractを救済・再定義せず、fresh evidence上でalternative representation familyを独立に構築し、long-horizon transition研究へ入力可能なrepresentation boundaryを再現可能に確立する

English working description:

> Prospective construction and eligibility validation of a new strategic-state / regime representation for downstream long-horizon transition research, without rescuing or redefining the closed G2-10 representation contract.

These are **working descriptions only**. The formal Study ID, final title, directory name, Stage structure, Stage IDs, population, representation family, endpoints, eligibility thresholds, decision taxonomy, seed blocks, and authorization protocol must be prospectively fixed at the start of the new Study after auditing the then-current remote `main` and repository naming rules.

## Scientific firewall

The new Study must preserve all completed decisions and boundaries, including at minimum:

1. `UMSSR-STUDY1` remains closed. Its 40-feature dictionary, deterministic K-means `K=2..6`, support/silhouette/stability thresholds, candidate-K results, `selectedRepresentation = null`, consumed Stage 1 seeds, and unconsumed Stage 2 seeds are immutable historical evidence.
2. The new Study is not allowed to lower G2-10 thresholds, widen G2-10 K, add PCA/latent axes to the old contract, cherry-pick G2-10 favorable roots, rerun the consumed G2-10 Stage 1 block, or reinterpret a G2-10 near miss as promotion.
3. G2-01..G2-09 formal decisions and eligibility boundaries remain unchanged. Technical-invalid/non-estimable/inconclusive upstream outputs must not be silently promoted to validated inputs.
4. RAW state identity remains authoritative unless a separate formally validated transformation authorization exists at the new Study start.
5. Machine-only evidence must not be interpreted as human difficulty, human misconception, human strategic salience, or game-theoretic truth.
6. Public Bao AI strength or engineering success is not a scientific endpoint.
7. Long-horizon transition outcomes reserved for G2-11 must not be used to choose the prerequisite Study's representation after seeing those outcomes.

## Separation from G2-11

The prerequisite Study should answer a representation-eligibility question, not the long-horizon transition question itself.

The following remain downstream G2-11 topics and should not become primary outcomes of the prerequisite Study:

- transition matrices between strategic regimes,
- long-horizon persistence / recurrence,
- bottleneck / transient-state structure,
- trajectory-family prevalence,
- transition asymmetry,
- long-horizon strategic survival/hazard-style endpoints,
- time-to-first-Mtaji / acceleration / delay constructs rejected or restricted by earlier studies.

A representation may be proposed as G2-11 input only if the new Study's own prospectively frozen eligibility gates are passed. Failure, non-estimability, or technical invalidity must be accepted as valid closure outcomes; no same-Study rescue is implied by the program need for a G2-11 input.

## Required startup audit for the new chat

Before fixing the new Study contract, the new chat must read and reconcile at least:

- current remote `main` HEAD,
- `doc/FUTURE_RESEARCH_AGENDA.md`,
- `doc/RESEARCH_INDEX.md`,
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`,
- this selection decision,
- `doc/unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md`,
- `doc/unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json`,
- `doc/unified-multiaxial-strategic-state-representation/STUDY_1_PROTOCOL.md`,
- `doc/unified-multiaxial-strategic-state-representation/UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`,
- current repository language/documentation rules and the most recent Research Generation 2 Study naming/stage conventions.

The new Study must use a fresh research branch created from the verified current remote `main`. No scientific seed generation or outcome-sensitive exploration is authorized by this selection decision itself.

## Program sequence after this decision

```text
G2-10 / UMSSR-STUDY1 = CLOSED
        ↓
new prospective independent strategic-representation prerequisite Study
        ↓  only if its frozen eligibility gates pass
eligible frozen representation candidate
        ↓
G2-11 Long-Horizon Strategic Transition Structure Study 1

G2-12 remains an independent RAW state-space / game-tree growth-estimation branch and is not blocked by this prerequisite.
```

## Historical authorization state at selection

```text
next research direction selected = true
formal Study ID fixed = false
formal Stage IDs fixed = false
scientific population fixed = false
scientific seeds authorized = false
outcome generation authorized = false
G2-11 authorized = false
```


## 現在のclosure state

```text
formal Study ID fixed = PSRRE-STUDY1
formal Stage IDs fixed = true
Stage 1 scientific seeds = CONSUMED
Stage 2 scientific seeds = RESERVED / UNCONSUMED
Stage 2 authorized = false
G2-11 candidate input authorized = false
G2-11 authorized = false
Study closed = NON-ESTIMABLE
```
