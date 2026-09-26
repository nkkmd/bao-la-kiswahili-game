# G4-07 / MLGMR-STUDY1 — Stage 2 final one-shot authorization review

Date: 2026-09-27

## Decision

**`MLGMR-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

Stage 2 formal holdoutを、frozen source binding・identity firewall・dedicated triggerの全gateがPASSする場合に限り、GitHub Actions上で1回だけ実行してよい。

## Reviewed state

- Stage 0: `STAGE0-PASS`
- Stage 1: `STAGE1-DEVELOPMENT-COMPLETE`
- Stage 1 canonical run: `36247459779 / attempt 1 / success`
- Stage 1 fresh seed reads: `96`
- Stage 2 design/source review: `STAGE2-DESIGN-AND-SOURCE-FREEZE-AUTHORIZED`
- Stage 2 fresh seed reads before this review: `0`
- latest seed-free static validation: run `36258215775 / attempt 1 / success`
- static validation head: `2b44f96902e8e3f7d48b330b00fa256cfda38d8a`
- static formal family size: `16`
- static G4-10 depth-11 access: `0`

## Frozen Stage 2 contract

```text
stage = MLGMR-S2-FORMAL-2026-09-26-v1
seed block = 40723001..40724024
candidate target = 48 per policy
minimum fully eligible = 40 per policy
measured = 32 per policy / 64 total
formal family = fixed 16 axis×lag slots
supporting trajectory = comparableNonzero >= 3
minimum support = 48 total / 20 per policy
minimum nonzero balances = 40
formal test = exact two-sided binomial sign test
multiplicity = fixed 16-family Holm-Bonferroni
family alpha = exact 1/20
NON-ESTIMABLE Holm input = exact 1
```

Formal familyはStage 1のfrozen support gateだけから導出する。Stage 1 effect direction、p-value、game outcome、favorable subgroupをselectionへ使用しない。

## Identity firewall

first Stage 2 fresh readより前に、G3-10、G4-01、G4-04、G4-07 Stage 1のidentity-only evidenceを検証する。G4-07 Stage 1については96 identity rowsと、以下のdigestを固定する。

```text
STAGE_1_RESULT.json SHA-256 = 2a712105917da91c954689f42665fc248fdf16e22721e13726e7e0cfd356d196
STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json SHA-256 = bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b
```

identity source、digest、row countの不一致はfresh seed read前にfail-closedする。

## Inference boundary

experimental unitはsource trajectory。zero balanceはsign-test nから除外する。support/nonzero gateを満たさないslotは`NON-ESTIMABLE`とし、fixed 16-familyから除外しない。

production / independent inferenceが一致しない場合はscientific labelを生成しない。

`confirmedContiguousPersistenceLagMax`はformal labels確定後だけ導出し、lag `[1,2,4,8]` をlag 1から連続走査する。lag 8超の外挿やphysical half-life解釈は禁止する。return moduleはdescriptive-onlyとする。

## Exactly-once / no-rescue boundary

1. このreviewをsource stateへcommitする。
2. そのsource stateでseed-free static validationをPASSさせる。
3. execution依存blob SHAをmachine authorizationへ固定する。
4. `STAGE_2_AUTHORIZATION.json` を単独commitする。
5. `STAGE_2_TRIGGER.json` を次の単独commitにする。
6. workflow内でbindingとfirewallをfresh read前に再検証する。
7. そのrun内でのみfresh Stage 2 executionを行う。

first fresh Stage 2 seed read後は、same-evidence rerun、seed extension、replacement population、post-access design changeを認可しない。

## Protected boundaries

```text
Stage 1 rerun = NOT AUTHORIZED
G3-11 depth-10 rerun = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED
public AI change = false
main integration = NOT AUTHORIZED
```

## Final conclusion

**`MLGMR-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

frozen bindingとdedicated triggerの全gateがPASSする場合に限り、Stage 2 formal holdoutをGitHub Actionsで1回だけ実行してよい。