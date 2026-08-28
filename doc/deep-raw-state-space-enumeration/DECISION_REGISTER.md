# DRSSE-STUDY1 — Decision Register

All decisions preserve prospective order and the no-rescue boundary.

## D001 — Independent prospective Study

`DRSSE-STUDY1` is Research Generation 2 `G2-05`, independent of G1 SSGTC and G2-01 through G2-04. Upstream formal decisions are immutable context.

## D002 — Baseline and branch

Study-start remote `main` was `c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6`. Research work is on `research/g2-05-deep-raw-state-space-enumeration` until integration.

## D003 — RAW identity

Identity fields are exactly `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`. `turn` and `reason` are excluded. Missing `pending` is invalid.

## D004 — No transformation reduction

The validated transformation set is `[]`. Symmetry reduction, canonicalization, player-swap equivalence, left/right equivalence and quotient counting are prohibited.

## D005 — Bounded exact question

G2-05 measures complete forward enumeration through a fixed depth. It does not require closure to terminal and does not estimate unenumerated/full-game state space or game-tree complexity.

## D006 — Complete-layer principle

A depth is exact only when every legal expansion needed to construct that layer is complete and verified. Incomplete layers cannot be reported as exact.

## D007 — Formal target frozen prospectively

Before formal outcome generation, the standard initial RAW root and target depth 9 were fixed. Required reachable layers are 0..9 and required parent expansion layers are 0..8.

## D008 — Resource contract

Formal ceilings were frozen before outcome: 500,000 cumulative RAW states; 3,000,000 depth-labelled edges; 500,000 parent expansions; 3,000,000 move evaluations; 1,000,000,000 tree occurrences; 6 GiB RSS; 1200 seconds wall clock; 1 GiB uncompressed artifact.

Caps may not be raised after outcome inspection.

## D009 — Formal decision taxonomy

Prospectively reserved labels:

- `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`
- `NOT-EXACTLY-ENUMERATED`
- `NON-ESTIMABLE`

Technical/resource stop classifications are not estimates.

## D010 — Stage 0 technical scope

Stage 0 may use G1 SSGTC bounded data only as a technical positive fixture; it creates no G2-05 scientific evidence.

## D011 — Stage 0 technical history

The first Stage 0 workflow stopped before enumeration because of a nonexistent smoke-test path. A second attempt exposed a transition-hash fixture convention mismatch. Neither was accepted. Both are preserved as technical history.

## D012 — Stage 0 acceptance

Canonical run `33155526103` passed production, separate-process independent verification and all frozen corruption controls. Decision: `STAGE0-TECHNICAL-PASS`.

## D013 — Stage 1 firewall

Stage 1 is fresh development/resource characterization only. Stage 1 rows, roots, counts, transposition observations and artifacts may not become formal Stage 2 evidence.

## D014 — Stage 1 acceptance

Fresh seed block `28050001..28050064` produced three Namua and three Mtaji roots under the frozen selection rule. All six completed depth 5 and independent selection/re-enumeration. Decision: `STAGE1-DEVELOPMENT-PASS`.

## D015 — Stage 2 design unchanged after Stage 1

Stage 1 outcome did not change the already frozen standard root, depth 9 target, resource ceilings, RAW identity, endpoints or formal decision rule.

## D016 — Formal source freeze

Stage 2 spec, engine, production enumerator, independent enumerator, formal runner/verifier and workflow blobs were frozen before formal authorization.

## D017 — One-time Stage 2 authorization

Commit `9199a3d25ea38978673f94bfcd4250aa3b5411fa` authorized exactly one formal execution against the frozen source set. Stage 1 and G2-04 artifacts remained barred from formal input.

## D018 — Formal exact result

Canonical Stage 2 run `33156581843` completed depth 9 without resource/admin stop. Materialized verification and full independent depth-9 re-enumeration passed.

Formal decision:

```text
EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

Canonical cumulative endpoints:

```text
RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

## D019 — Exact identities

```text
cumulativeRawStateSetSha256 = 993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816
cumulativeGlobalRawGraphEdgeSetSha256 = da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654
cumulativeDepthLabelledEdgeSetSha256 = 3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed
productionResultCoreSha256 = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independentCoreSha256 = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
decisionCoreSha256 = c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f
```

## D020 — No-rescue closure

No G2-04 root/partial closure, G1 depth-9 partial row, Stage 1 row/root, symmetry transform or canonicalization result was used in formal Stage 2 evidence. No post-outcome root/depth/cap/identity/endpoint change is authorized.

## D021 — Interpretation boundary

The exact decision is limited to the frozen standard-root depth-9 RAW domain. Full Bao state-space size, full game-tree complexity, asymptotic growth, unbounded estimates, symmetry-reduced counts and engineering performance remain unauthorized conclusions.

## D022 — Future-estimation boundary

Any inference about unenumerated depths or full-game size requires a new prospective protocol, including the planned Research Generation 2 G2-12 work.
