# 2026-08-31 — G3-01 clean closure checkpoint

G3-01 `LGTGMF-STUDY1`のscientific execution、fail-closed disposition、central documentation synchronization、temporary workflow cleanupを完了した時点のcheckpoint。

## Repository boundary

```text
baseline / current remote main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
research branch = research/g3-01-local-game-tree-geometry-measurement-foundation
pre-checkpoint branch HEAD = 9a9ff103e01d31051eb5f0d5b4914f1f13ac66b4
main integration = NOT AUTHORIZED / NOT PERFORMED
```

remote `main`はStudy開始時から変更されていない。

## Scientific closure

```text
Study ID = LGTGMF-STUDY1
Formal decision = TECHNICAL-INVALID
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal eligible measurement families = []
Stage 1 seed consumption = 31010001..31010096
Stage 2 seed consumption = NONE
```

Stage 1では全12 selected rootsについてproduction / independent root-level measurement coreとF1〜F5 family digestがexact一致したが、凍結済みdeterministic canonical stage manifestのimplementation defectにより`stageCoreSha256`が一致しなかった。fresh evidence消費後のsame-evidence repairはno-rescue ruleにより実施していない。

## Protected holdout

```text
standard initial RAW root complete depth-10 generated = false
standard initial RAW root depth-10 scientific outcome read = false
G2-12 estimator used as depth-10 truth/input = false
```

G3-11 holdoutはsealedのまま。

## Central documentation synchronization

次をclosure stateへ同期した。

- `doc/local-game-tree-geometry-measurement-foundation/README.md`
- `doc/local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`
- `doc/local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`
- `doc/local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md`
- `doc/local-game-tree-geometry-measurement-foundation/DECISION_REGISTER.md`
- `doc/local-game-tree-geometry-measurement-foundation/REPRODUCIBILITY_INDEX.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-program-decisions/2026-08-31-g3-01-measurement-foundation-technical-invalid-closure.md`

root `README.md`はG3-01の個別statusをcanonical current stateとして保持する構造ではなく、研究中央索引`doc/RESEARCH_INDEX.md`への入口を提供するため、G3-01 closure専用の追記は不要と判定した。

## Temporary execution surface cleanup

scientific source / verifier / preregistration / authorization / result provenanceは保持した。一方、accidental same-evidence rerunを防ぐため、完了した次のwrite/execution workflowはbranchから削除した。

- `.github/workflows/lgtgmf-stage0-technical.yml`
- `.github/workflows/lgtgmf-stage0-technical-v2.yml`
- `.github/workflows/lgtgmf-stage1-development.yml`
- `.github/workflows/lgtgmf-closure-central-sync.yml`

central sync authorization JSONはprovenanceとして保持するが、それをtriggerするworkflowは存在しない。

## Research Generation 3 dependency

```text
G3-02..G3-08 automatic start = BLOCKED
```

G3-01のeligible family setが空のため、同instrumentを使用して後続Studyを自動開始しない。次のscientific executionには、新規prospective measurement prerequisiteまたはprogram-level dependency redesignが必要。

## Integration readiness

本checkpointは科学的・文書的closureがbranch内で整った状態を記録する。`main`への統合そのものはuserの明示的指示が必要であり、本checkpointでは実施しない。
