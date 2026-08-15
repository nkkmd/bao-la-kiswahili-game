# Tactical Motifs / Tesuji Study 1 — Final Report

Date: 2026-08-15

## Study title

**Baoにおける手筋の発見と体系化 — 局面横断的 tactical motifs と transferable move principles の抽出・検証**

## Final status

**CLOSED / COMPLETE**

This prospective independent study completed Stage 0 technical validation, Stage 1 exploratory discovery, and Stage 2 fresh prospective formal confirmation without reopening or rescuing any prior Bao study.

Final Stage 2 candidate decisions:

- `TM-S2-C01` — **NOT-CONFIRMED**
- `TM-S2-C02` — **NOT-CONFIRMED**
- `TM-S2-C03` — **CONFIRMED**
- `TM-S2-C04` — **NOT-CONFIRMED**

Therefore Study 1 closes with **one machine-reproducible transferable tactical motif confirmed under the frozen operationalization**.

## Research question

The study asked whether Bao contains recurring position-transferrable move patterns that can be expressed independently of a particular opening sequence as:

```text
position structure → move abstraction → reply/downstream structural consequence → tactical value
```

The target was not an opening joseki and not simply an AI best-move list. The study separated structural recurrence, move abstraction, response structure, and search value.

## Independence from earlier studies

The study treated the following completed studies as immutable historical work:

1. Phase Transition Study 1
2. Position Typology / Playing Style Study 1
3. Namua→Mtaji Strategic Temporal Transition Study 1
4. Position Complexity / Difficulty Study 1
5. First Joseki Study

No formal decision, threshold, endpoint, population, classifier, or interpretation boundary from those studies was altered.

## Stage 0 — technical audit

Stage 0 validated the representations needed for prospective motif research:

- `historicalStateHash`, `ruleStateKey`, and `seatCanonicalKey` remain distinct identities;
- exact legal move identity uses `E.moveVariants` and `AI.moveKey`;
- only validated South/North seat exchange is used as symmetry;
- move consequences are derived from authoritative engine events;
- structural features include reserve, nyumba/house state, occupancy, reusable pits, front connections, legal/capture counts, and move morphology;
- exact D1/D2/D3 root candidate tables and tie-aware top sets reuse the already validated Position Complexity search diagnostic as instrumentation only;
- no search-consistent principal variation is claimed.

## Stage 1 — prospective exploratory discovery

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Frozen population:

- 768 games
- seeds `21900001–21900768`
- six trajectory-generation strata ×128
- first 8 plies seeded-uniform exact `E.moveVariants`
- max ply 100
- no extension / no replacement

After independent full replay/search verification:

```text
unique historical trajectories = 741
distinct opening prefixes = 681
```

Outcome-independent root selection retained 715 unique rule states. All legal exact moveVariants were measured, yielding 3,148 exact move records.

The frozen grammar enumerated:

```text
raw pattern instances = 3,116,520
unique pattern keys = 323,676
detailed candidates = 105,501
candidates passing all promotion gates = 948
```

Frozen ranking and caps promoted eight exploratory definitions. These formed four exact `supportIdentityHash` pairs. The eight Stage 1 definitions remained immutable; no post-hoc merge was performed.

Stage 1 discovery artifact SHA-256:

`aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`

Candidate-freeze SHA-256:

`f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`

## Stage 2 — prospective formal confirmation

Stage ID:

`TM-S2-FORMAL-2026-08-14-v1`

Before any fresh Stage 2 data existed, one canonical formal definition per support-equivalence pair was frozen by the deterministic rule “lowest Stage 1 promoted rank within the pair.” Canonical ranks were `1,3,5,7`; paired ranks `2,4,6,8` were diagnostic-only.

Formal candidate-definition SHA-256:

`667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`

Formal spec SHA-256:

`83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`

### Fresh population

- 3,072 games
- seeds `22000001–22003072`
- six generation strata ×512
- no Stage 1 formal-observation reuse
- no extension or replacement

Generation produced 2,736 unique historical trajectories and 2,220 opening prefixes. Independent verification recomputed all 3,072 fixed-seed trajectories and all generation search diagnostics:

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 3072
```

Verification identity hash:

`bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`

### Candidate-specific selection

Selection was consequence-blind, value-blind, outcome-blind, deterministic, and no-replacement.

```text
C01 = 1597 unique states
C02 = 2705 unique states
C03 = 1272 unique states
C04 = 1031 unique states
```

Every candidate passed all six preregistered estimability / transferability gates.

Selection hash:

`81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`

### Formal measurement

Measurements exactly matched the selected sets: 6,605 total candidate-root measurements.

Measurement integrity passed and the authorization-bound scientific source mapping remained intact.

Measurement hash:

`c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`

### Formal endpoints and multiplicity

Each of the four candidates had two co-primary endpoints:

1. structural consequence success;
2. exact D3 top-set membership.

Each endpoint used an exact one-sided binomial test against `p=0.50` and required observed rate `>=0.60`. All eight planned p-values were Holm-Bonferroni adjusted at FWER 0.05.

Additional consistency gates were:

- D3 at-or-above-state-median rate `>=0.60`;
- D3 unique-worst rate `<=0.15`.

## Final results

| candidate | structural | D3 top set | D3 >= median | D3 unique-worst | decision |
| --- | ---: | ---: | ---: | ---: | --- |
| C01 | 0.6944 | 0.4934 | 0.7508 | 0.0802 | NOT-CONFIRMED |
| C02 | 0.0928 | 0.3072 | 0.5970 | 0.2303 | NOT-CONFIRMED |
| C03 | 0.9788 | 0.7366 | 0.8695 | 0.0708 | CONFIRMED |
| C04 | 0.4142 | 0.3152 | 0.5587 | 0.1959 | NOT-CONFIRMED |

### Confirmed motif: TM-S2-C03

Frozen machine definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

On 1,272 fresh selected roots:

- structural consequence success: `1245/1272 = 0.978774`
- D3 top-set membership: `937/1272 = 0.736635`
- D3 at-or-above-median: `1106/1272 = 0.869497`
- D3 unique-worst: `90/1272 = 0.070755`
- distinct opening prefixes: `1121`
- generation strata: `6`

Both co-primary endpoints satisfy the observed-rate threshold and Holm-adjusted significance criterion, and both D3 consistency gates pass.

### Negative formal results are retained

C01 reproduced its structural consequence but failed tactical-value confirmation. C02 and C04 failed both co-primary patterns and additional D3 consistency gates. They remain formal `NOT-CONFIRMED` results and are not renamed, merged, substituted, or extended.

## Scientific interpretation

The study supports a narrow but positive conclusion:

> A transferable tactical motif corresponding to C03 is reproducible across many fresh Bao states, opening prefixes, and trajectory-generation strata under the frozen engine/search operationalization.

This is stronger than Stage 1 recurrence because the candidate definition, fresh seed block, root sampling, move representative, endpoints, thresholds, multiplicity, and no-rescue rules were all frozen before fresh outcome inspection.

However, the study does not establish that C03 is a traditional, expert-recognized, pedagogically important, or universally valid Bao tesuji. Those are separate external/human-validation questions.

## Numerical integrity note

Pre-generation audit identified possible underflow in a naive exact-binomial implementation. Authorization was suspended before any Stage 2 scientific generation, the computation was hardened in log space, and validation/authorization were repeated without changing any scientific design quantity.

For C03 structural success, the final probability is so small that conversion to IEEE-754 double yields `0`; high-precision recomputation gives approximately `5.79 × 10^-328`. This does not affect the formal rejection decision.

## Reproducibility anchors

- Stage 1 spec: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- Stage 1 discovery artifact: `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`
- Stage 1 candidate freeze: `f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73`
- Stage 2 candidates: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- Stage 2 spec: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- Stage 2 authorization: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- Stage 2 selection: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- Stage 2 measurement: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- Stage 2 result core: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`

See `REPRODUCIBILITY_INDEX.md` for the complete document/artifact map.

## Closure

Tactical Motifs / Tesuji Study 1 is complete. Any replication, external-validity extension, human/expert validation, or pedagogical study must be a new prospective independent study and must not change the formal decisions recorded here.
