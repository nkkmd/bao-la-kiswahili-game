# UMSSR-STUDY1 — 研究概要

## 0. 現在の結果

本Studyはclosure済みである。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1ではfresh 4,096 gamesから512 rootsを選択し、40/40 featuresを用いたmultiaxial representation developmentをproduction / independent implementationで完全再構築した。Scientific readinessとresource gateは全項目PASSし、mandatory exact comparisonも`fullExact = true`だった。

一方、scientific seed消費前に固定したdeterministic K-means `K=2..6`について、minimum cluster support `>= 0.10`、mean silhouette `>= 0.05`、five-fold assignment stability `>= 0.80`を全て満たす候補は0だった。このため`selectedRepresentation = null`とし、Stage 2へ渡す`FROZEN_REPRESENTATION.json`は生成しなかった。

これはtechnical-invalidでもnon-estimableでもない。**凍結したG2-10 Study 1 contractの範囲で、Stage 2へ昇格可能なrepresentationを得られなかった正式なnegative development result**である。Threshold relaxation、K range変更、別clustering法、favorable subgroup、Stage 1 seed rerun / extensionによる同一Study内の救済は行わない。

Stage 2 seeds `29410001..29418192`は`RESERVED / UNCONSUMED`のままである。`UMSSR-STUDY1`からG2-11へ渡せるvalidated / frozen representationはなく、G2-11で別representationが必要な場合はnew prospective Studyまたはexplicit versioned protocolを先に必要とする。

詳細な結果とprovenanceは`STUDY_1_FINAL_REPORT.md`、`results/STUDY_1_FINAL_RESULT.json`、`REPRODUCIBILITY_INDEX.md`を正本とする。

## 1. 研究の問い

本Studyは、Baoの局面を単一のevaluation scoreへ早期圧縮せず、複数の科学的に利用資格のある軸からなるstrategic-state vectorとして再現可能に記述できるか、さらにその表現からfresh evidence上で安定したstrategic regime / state familyを識別できるかを検証するResearch Generation 2 `G2-10`の新規・prospective・独立研究である。

正式な英語題目は **Unified Multiaxial Strategic State Representation Study 1**、Study IDは`UMSSR-STUDY1`とする。

## 2. なぜ独立Studyが必要か

G2-01〜G2-09では、search reliability、RAW state-space、rich representation、reply pressure、decision-failure taxonomy、tactical generalization等に関する複数の研究が行われた。しかし、その存在だけを理由に各outputをvalidated axisとして統合することはできない。

特に:

- `SRDR-STUDY1`は`INCONCLUSIVE`で、primary formal criterionは`null`である。
- `RCPR-STUDY1`はStage 1 `STAGE1-TECHNICAL-INVALID`である。
- `PCRPR-STUDY1`はStage 1 `STAGE1-TECHNICAL-INVALID`である。
- `MDFT-STUDY1`はStudy `NON-ESTIMABLE`で、Stage 2は未実行である。
- `TMGC-STUDY1`はStudy `TECHNICAL-INVALID`で、G2-09 scientific generalization / counterexample evidenceは生成されていない。
- `STSCV-STUDY1`のvalidated transform setは空であり、canonicalization / symmetry reductionは承認されていない。

一方、`DRSSE-STUDY1`はstandard initial RAW rootからdepth 9までの凍結domainについて`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`を持つ。ただし、そのbounded exact claimを任意のfresh G2-10 stateへ外挿しない。

したがってG2-10は、upstream evidenceの利用資格を先に固定し、必要な概念をG2-10自身のfresh candidate representationとして再定義・再測定する独立Studyでなければならない。

## 3. 基本設計

### Stage 0 — technical / eligibility / feasibility （技術検証）

`UMSSR-S0-TECHNICAL-2026-08-30-v1`

科学的結論を出さず、upstream evidence eligibility、source binding、RAW identity、engine / evaluator / search semantics、candidate observableの実装可能性、独立再構築、resource ceiling、leakage防止を確認する。

### Stage 1 — representation development （表現）

`UMSSR-S1-DEVELOPMENT-2026-08-30-v1`

fresh development populationだけを使用し、candidate axis generation、feature construction、scaling、必要な場合のdimensionality reduction、clustering / regime discovery、stability analysis、representation selectionを行う。Stage 1 evidenceをStage 2 formal evidenceへ再利用しない。

### Stage 2 — formal validation （Stageの記録）

`UMSSR-S2-FORMAL-2026-08-30-v1`

Stage 1とはseed、trajectory、opening prefix、RAW stateを分離したfresh populationを使用し、Stage 1で凍結したrepresentationだけを評価する。

## 4. representationの原則

初期形は単一scalarではなくmultiaxial vectorとする。composite score、latent representation、dimensionality reduction、clustering等を採用する場合は、method、hyperparameter、次元数、cluster数、stability criterion、promotion criterionをdevelopment中に固定し、Stage 2 outcomeを見て差し替えない。

## 5. formal validationの役割分離

Stage 2では、少なくとも次を区別する。

- **mandatory technical gates**: source identity、RAW identity、feature computation、assignment、aggregate statistics、decision inputの独立再構築
- **primary scientific endpoint**: Stage 1でfreezeされたrepresentation / regime assignmentがfresh populationで事前規定のheld-out supportとassignment robustnessを満たすか
- **key secondary**: within-regime coherence、prospectively指定したaxes上のseparation、cross-condition robustness
- **descriptive**: phase別、source family別、search condition別の補助集計

具体的なnumeric thresholdはStage 1科学用seed消費前のmachine-readable Stage 1 specで固定し、その後は変更しない。

## 6. RAW-state identity （識別情報）

validated transformationが存在しないため、G2-10はRAW-state distinctnessを維持する。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn`と`reason`はauthoritative RAW identityから除外する。validated transform setは`[]`であり、canonicalization / symmetry reductionを導入しない。

## 7. negative / null / non-estimable result （日本語の要点）

validated unified representationが得られないことも正式な成果である。technical gate failure、support不足、assignment instability、independent verifier不一致、Stage 1 readiness failure等が起きた場合は、同じStudy内でthreshold、axis、cluster数、search depth、populationを結果後に救済変更せず、事前固定したterminal vocabularyに従ってclosureする。

## 8. G2-11との境界

G2-10はstate representationの構築・検証だけを扱う。regime transition matrix、long-horizon persistence、recurrent strategic states、bottleneck states、trajectory families、transition asymmetry等はG2-11の対象であり、G2-10のprimary endpointへ混入させない。

G2-10がrepresentation gateを満たした場合だけ、その凍結representationをG2-11のcandidate inputとできる。満たさない場合はG2-11で事後差し替えして救済しない。
