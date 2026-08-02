# E-019 infrastructure state revalidation checkpoint

更新日: 2026-08-02  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Infrastructure validated / formal authorization not granted

## 1. Purpose

`doc/phase-transition/checkpoints/2026-08-02-e019-formal-infrastructure.md`でinfrastructure validationを確認した後、execution policy stateを

```text
infrastructure-validated-awaiting-authorization
```

へ進めた。

このstate transitionがformal guardまたはfixture infrastructureを壊していないことを、更新後のbranch stateで再検証した。

## 2. Revalidation

Workflow:

```text
Phase Transition Search Profile Generalization
```

Actions run:

```text
30747598663
```

validated head:

```text
3038a143dad339a1dd0e305bc7bf100e4c1b197e
```

Result:

```text
success
```

Successful stages:

- preregistration/evaluator/IUT-Holm tests
- formal guard tests
- six-condition non-formal fixture generation
- three-stratum paired fixture integrity
- candidate/control analysis for all six conditions
- paired endpoint construction
- fixture IUT/Holm output-contract evaluation
- preregistered structural secondary
- artifact upload

Artifact:

- ID: `8833457382`
- name: `phase-transition-search-profile-generalization-fixture`
- digest: `sha256:d2eac111d9b9e275db5d2764da90a00dcecf7e1c1ce37a6a39d085d704920f48`
- size: `221228` bytes

## 3. Execution state remains locked

Revalidation時点でも:

```text
formalExecutionAllowed: false
formalCorpusGenerated: false
```

である。

E-019 formal execution lockは生成していない。E-019 formal seed blockも使用していない。

したがって、このcheckpointはformal experiment開始承認ではなく、**承認前stateのinfrastructure再検証**のみを意味する。

## 4. Scientific conditions unchanged

次は一切変更していない。

- D1/D3/V2 conditions
- paired sample sizes 6500 / 4500 / 2000
- formal seed ranges
- candidate/regime thresholds
- primary population `pliesRemaining >= 9`
- paired game-level binary endpoint
- exact two-sided McNemar
- alpha 0.05
- minimum discordant pairs 20
- direction phase2-only > legacy-only
- global IUT rule
- Holm standalone inference
- structural secondary boundary

E-010 `not-confirmed`、E-011 `inconclusive`、E-017 `not-confirmed`、E-018 `confirmed`も変更しない。

## 5. Next step

次は固定ローカル環境で**pre-authorization preflightのみ**を実行する。

このpreflightではruntime、branch、HEAD、clean worktree、git-ignore stateを確認する。execution lockおよびformal corpusはまだ生成しない。

preflight successful後にE-019固有formal開始承認を別途要求する。
