# G4-08 / BRSGT-STUDY1 — Closure Decision

日付: 2026-09-27  
Agenda: `G4-08`  
Study: `BRSGT-STUDY1`

## Decision

**CLOSED / STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE / NO DIRECTIONAL SCIENTIFIC CONCLUSION**

## Basis

Stage 0 v2はtechnical validationをPASSし、Stage 1 v3はsupport-only developmentとして24/24 event×metric slotsをformal holdout eligibleへ送った。

Stage 2はpre-fresh static auditをPASS後、source-bound one-shot authorizationでRun `36314208922`を実行し、fixed block `40823001..40824024`の1024 slotsをexactly once readした。

```text
run = 36314208922 / attempt 1 / success
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
artifact ID = 10929684128
artifact ZIP SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
fresh reads = 1024
accepted source trajectories = 0
measured event units = 0
formal family = 24
NON-ESTIMABLE = 24
```

Frozen freshness firewallのsource rejectionは:

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
```

であり、全1024 source trajectoriesがformal event selection前に除外された。

## Interpretation

このclosureはrule-semantic geometry effectの不存在を意味しない。

- `NON-ESTIMABLE`をno-effect / negative result / counterexampleとして扱わない。
- capture、nyumba、reserve decrement、Namua→Mtajiのdirectional geometry effectは未確立。
- causal effect、whole-Bao law、game-theoretic consequence、AI strength、人間のdifficultyを主張しない。

Post-execution identity diagnosticでは、Stage 2全1024 trajectoriesとStage 1 v3全512 rowsが同じply-0 initial RAW rootを持ち、このrootがfrozen firewallに含まれることを確認した。この診断は結果説明専用であり、同Study/Stageのrescueには使用しない。

## No-rescue closure

Stage 2 fresh access後の以下は禁止する。

- same-version / same-evidence rerun
- seed extension
- replacement population
- ply-0を除外するためのfirewall grammar変更
- root freshness定義の事後変更
- event grammar / metric / depth / alpha / multiplicity / concordance ruleの変更
- favorable subgroup rescue

独立した将来Studyでfreshness design自体を再研究する場合も、本Studyの結果を救済する扱いにはしない。

## Protected boundaries

```text
G4-10 depth-11 access = 0
public AI change = false
main integration = not performed
```

G4-08 closureはG4-09 / G4-10を自動認可しない。main統合も別の明示的作業とする。

## Canonical records

- `doc/rule-semantic-geometry-transition/CURRENT_STATUS.md`
- `doc/rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`
- `doc/rule-semantic-geometry-transition/checkpoints/2026-09-27-stage-2-formal-complete.md`
- `doc/rule-semantic-geometry-transition/DECISION_REGISTER.md`
