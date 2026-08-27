# Position Evaluation / Empirical Outcome Calibration Replication Study 1

Program label: `G2-01`
Study ID: `PEOCR-STUDY1`
Status: **COMPLETE / formal decision `INCONCLUSIVE`**
Research generation: **Research Generation 2**

## Result

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`を変更・救済せず、新しいfresh populationでactor-relative static Bao evaluationとempirical continuation outcomeのheld-out calibration replicationを実施した。

Stage 1は2,048 fresh gamesで全readiness gateをPASSし、phase-stratified isotonic PAVA mappingを`MODEL-FROZEN-DEVELOPMENT`として固定した。Stage 2は8,192/8,192 fresh gamesを生成し、全8 shardの独立replay、統合selection/measurementの独立verification、Stage 1 cross-stage overlap 0/0/0を達成した。

しかしstrict firewall後に3つのestimability gateが未達となった。

```text
unique trajectories after firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
```

Formal decision: `PEOCR-STUDY1 = INCONCLUSIVE`。Primary Brier/log-loss formal branchには入っておらず、`NOT-CONFIRMED`ではない。

## Start here

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
5. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
6. [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)
7. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)

## Immutable boundaries

- Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable.
- RAW identity remains `pits,reserve,houseOwned,player,phase,winner,pending`.
- No symmetry/canonicalization was used for formal deduplication.
- No Stage 2 seed extension, replacement, gate relaxation, mapping refit, or subgroup rescue is authorized.
- Game-theoretic, human-perception, causal, public-AI-quality, and AI-generation claims are outside this Study.
