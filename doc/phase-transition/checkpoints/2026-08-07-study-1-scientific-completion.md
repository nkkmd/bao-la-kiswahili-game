# Study 1 scientific completion checkpoint

Date: 2026-08-07
Status: **scientifically complete**
Branch: `research/forced-capture-regime-analysis`

## Study

> **第1研究: Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**

## Completion state

- Stage A — D3 independent reversal replication: complete
- Stage B — depth/search-profile mechanism analysis: complete
- Stage C — recognition-scope assessment: complete
- Stage D — machine definition / Bao research vocabulary: complete
- Stage E — final integration: complete

Scientific completion is separate from repository merge state. PR #26 remains open / draft / unmerged until explicit instruction.

## Final canonical documents

- current status: `doc/phase-transition/CURRENT_STATUS.md`
- original master plan: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`
- completion plan: `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`
- final report: `doc/phase-transition/STUDY_1_FINAL_REPORT.md`
- machine definitions / vocabulary: `doc/phase-transition/STUDY_1_VOCABULARY.md`
- experiment index: `doc/phase-transition/EXPERIMENT_INDEX.md`
- hypothesis ledger: `doc/phase-transition/HYPOTHESES.md`
- decision register: `doc/phase-transition/DECISION_REGISTER.md`
- formal archive index: `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

## Stage B completion chain

- design: `doc/phase-transition/checkpoints/2026-08-07-stage-b-mechanism-analysis-design.md`
- B1-B4 first pass: `doc/phase-transition/checkpoints/2026-08-07-stage-b-b1-b4-first-pass.md`
- fixed-classifier circularity guard: recorded before gate interpretation
- final Stage B completion: `doc/phase-transition/checkpoints/2026-08-07-stage-b-completion.md`

Final trajectory-ply synthesis reviewed:

- analysisVersion: `stage-b-trajectory-dedup-1`
- reviewer-side SHA-256: `7cf27991014fd0b6415774bfa74e2a743359e8c3319b287ab3d909abbf5ba4e9`
- direction after trajectory-ply dedup:
  - E-018 D2: P2 > LG
  - E-019 D3: LG > P2
  - E-020 D3: LG > P2

## Stage C recognition assessment

Original six criteria:

| criterion | assessment |
|---|---|
| recurrence across games | `satisfied` |
| >=2 independent feature groups | `partially satisfied` |
| prespecified persistence | `satisfied` |
| reproduction on new seeds | `satisfied` |
| game-position structural explanation | `satisfied` |
| counterexamples / applicability boundaries | `satisfied` |

Checkpoint:

- `doc/phase-transition/checkpoints/2026-08-07-stage-c-recognition-scope.md`

Therefore Study 1 closes with a bounded recognition claim, not an unqualified universal phase-transition claim.

## Stage D terminology

Canonical vocabulary:

- `doc/phase-transition/STUDY_1_VOCABULARY.md`

Preferred final term:

> `capture-branch-expansion strategic-transition phenotype`

Also acceptable with explicit scope:

> `strong phase-transition candidate with bounded recognition scope`

The empirical observation that expansions occur in forced-capture regimes was not inserted post hoc into the machine classifier.

## Fixed formal decisions

Unchanged and final for Study 1:

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only at fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only at fixed `hard / bao / depth3`

No Stage B/C/D/E secondary or integrative result rescues, replaces, reverses, merges, or generalizes these decisions.

## Final Study 1 scientific conclusion

> `capture-branch-expansion` is a reproducible, persistent, structurally interpretable strategic-transition phenotype within the observed Bao forced-capture lifecycle. Its manifestation is search-profile dependent. Under fixed `hard / bao / depth2`, phase2 > legacy is formally confirmed; under fixed `hard / bao / depth3`, legacy > phase2 is independently and prospectively confirmed. Existing-corpus mechanism analysis indicates that the ordering reversal tracks which profile more often reaches an expansion-compatible sustained-forcing morphology, and the direction remains after trajectory-ply deduplication. The original recognition criteria are almost but not completely satisfied because the second independent feature group remains only partially established.

## Formal archives

- E-011 SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- E-018 SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- E-019 SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- E-020 SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`

Archive locations and audits remain governed by `doc/phase-transition/FORMAL_EXPORT_INDEX.md`.

## Future work boundary

Any further confirmatory work is a **new study / experiment**, not continuation of the completed Study 1 formal decision chain.

Priority candidates:

1. internal search-tree / PV / cutoff / horizon mechanism for the depth-dependent profile reversal;
2. independent preregistered confirmation of maximum-capturable-seed asymmetry or another second feature group;
3. original RQ Future Work: reserve, nyumba, front-row, mobility, non-terminal forcing release, formal-phase timing, multi-transition taxonomy, broader evaluator/search external validity.

New confirmatory claims require new hypothesis, experiment ID, preregistration, independent seed block, execution policy, explicit authorization, and execution lock.

## Repository state rule

Do not merge or mark PR #26 ready solely because the scientific Study 1 is complete. Repository workflow remains a separate explicit user decision.