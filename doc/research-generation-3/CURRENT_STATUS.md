# Research Generation 3 — Current Status

Updated: 2026-08-31

```text
Program = Bao Third-Generation Research Program
Program status = ACTIVE / DEPENDENCY REASSESSMENT REQUIRED AFTER G3-01
Core agenda = G3-01..G3-12
Human track = G3-H01 / independent / non-blocking
Program plan main integration = COMPLETE
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible measurement families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-01 Stage 1 seed consumption = 31010001..31010096
G3-01 Stage 2 seed consumption = NONE
G3-02..G3-08 automatic start = BLOCKED
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
Current research branch = research/g3-01-local-game-tree-geometry-measurement-foundation
Current branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Program direction

Research Generation 3は、Research Generation 2で最も強く成立したRAW-only bounded exact analysisを基盤とし、Baoの局所ゲーム木・局所到達グラフの構造幾何を中心研究対象とする。

ただし、measurement foundationであるG3-01がformal eligible familyを生成せず`TECHNICAL-INVALID`で閉じたため、program planに定めたdependency ruleに従い、G3-02〜G3-08を同じinstrumentのまま自動開始しない。

## Immutable upstream boundaries

```text
Research Generation 2 = CLOSED
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 = TECHNICAL-INVALID / selectedEstimator null
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
```

Research Generation 3は、これらを修正・救済・再判定するprogramではない。

## G3-01 closure

G3-01の正式Study IDは`LGTGMF-STUDY1`としてscientific outcome前に固定した。

Stage 0 v1は凍結済みconstructのmaterialization欠落により`STAGE0-TECHNICAL-INVALID`となったが、fresh evidence生成前だったため事前固定technical-refreeze ruleに従ってscientific contractを変更せずv2を作成し、v2はtechnical passした。

Stage 1ではfresh seed `31010001..31010096`を使用し、Namua 6 / Mtaji 6の全12 rootsをproduction / structurally independent implementationでdepth 5までcomplete reconstructionした。root identity、root-level measurement core、F1〜F5 family digestはすべてexact一致した。

しかし、凍結済みcanonical artifact designが要求したdeterministic stage-level manifest hashについて、implementationがelapsed time / RSS等のnon-deterministic resource observationsをhash inputへ含めたためproduction / independentで一致しなかった。

fresh development evidence生成後のsame-evidence repairは禁止されていたため、Stage 1を`STAGE1-TECHNICAL-INVALID`としてfail-closedし、Stage 2はauthorizeしなかった。

```text
LGTGMF-STUDY1 = TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1で得られたroot-level / family-level exact agreementは、将来の新しいprospective prerequisite Studyを設計するためのfeasibility / failure-mode evidenceとして利用できるが、G3-01のformal eligibilityへ昇格させない。

## Protected evidence

standard initial RAW rootのdepth 10 exact layerは、G3-11の`FRESH-DEEPER-EXACT-HOLDOUT`として引き続き保護する。

```text
G3-01 complete depth-10 enumeration generated = false
G3-01 depth-10 scientific counts / geometry outcome read = false
G2-12 estimator input to depth-10 holdout = false
```

## Dependency state / next authorization boundary

Program planではG3-02〜G3-08は原則としてG3-01でformal eligibilityを得たmetric familyだけを使用する。G3-01のeligible family setは空なので、次のAgenda itemへ通常順序で進む条件は満たされていない。

次の研究を開始するには、少なくとも次のいずれかをprospectively決定する必要がある。

1. G3-01を救済・再判定せず、今回のfailure modeを設計情報として用いる新しいmeasurement-instrument prerequisite Studyを設ける。
2. Research Generation 3のdependency graphそのものをprogram-level decisionとして再設計する。
3. measurement foundation不成立を受けてprogram-level closureまたは別方向への移行を決定する。

G3-01のsame Stage 1 seed blockを修正rerunする選択肢は含まれない。

## Canonical records

Program:
- `README.md`
- `PROGRAM_PLAN.md`
- `CURRENT_STATUS.md`
- `../research-program-decisions/2026-08-31-third-generation-local-game-tree-geometry-agenda.md`

G3-01:
- `../local-game-tree-geometry-measurement-foundation/STUDY_1_PROTOCOL.md`
- `../local-game-tree-geometry-measurement-foundation/STUDY_1_FINAL_REPORT.md`
- `../local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md`
- `../local-game-tree-geometry-measurement-foundation/DECISION_REGISTER.md`
- `../local-game-tree-geometry-measurement-foundation/REPRODUCIBILITY_INDEX.md`

Research Generation 3のprogram plan自体は`main`へ統合済みだが、G3-01のscientific branchはまだ`main`へ統合していない。
