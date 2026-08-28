# Deep RAW State-Space Enumeration Study 1

Research Generation 2 `G2-05` / `DRSSE-STUDY1`.

Formal decision: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**.

The Study completely enumerated the prospectively frozen standard initial Bao RAW state through depth 9, without symmetry reduction or canonicalization, and independently reproduced the complete bounded domain.

Canonical bounded endpoints:

```text
RAW states through depth 9 = 102857
depth-labelled legal edges from depths 0..8 = 106773
tree node occurrences through depth 9 = 136645
tree / cumulative RAW-state ratio = 1.328494900687362
```

Start here:

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md)
- [`results/STUDY_1_FINAL_RESULT.json`](results/STUDY_1_FINAL_RESULT.json)

Post-closure review disposition:

- [`checkpoints/2026-08-28-pr71-review-disposition.md`](checkpoints/2026-08-28-pr71-review-disposition.md) — records two latent implementation concerns identified during PR review, demonstrates why neither affects the accepted canonical run, and preserves the frozen formal source/no-rerun boundary.

The exact result is bounded to the frozen standard-root depth-9 RAW domain. It is not a full Bao state-space count or full-game complexity estimate.
