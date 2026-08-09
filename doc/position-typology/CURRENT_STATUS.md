# 局面類型と棋風研究 — 現在地

更新日: 2026-08-09  
Status: **Stage 0 complete / Stage 1 exploratory design next / no formal experiment authorized**

Branch: `research/position-typology-and-playing-style`

- Stage 0監査: [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md)
- Stage 0実行手順: [`STAGE_0_RUNBOOK.md`](STAGE_0_RUNBOOK.md)
- Stage 0 smoke結果: [`STAGE_0_SMOKE_RESULT.md`](STAGE_0_SMOKE_RESULT.md)

## 現在地

次の優先研究課題として **「Baoにおける局面類型と棋風の発見・検証」** を開始した。

2026-08-09にrepository auditを完了し、position-typology専用instrumentationを実装した。その後、ローカル環境で16-game Stage 0 instrumentation smoke、full replay verification、seat-canonical identity auditを実行し、hard integrity gateはすべてpassした。

Stage 0は完了した。

現時点ではまだlarge exploratory corpus、clustering、position-type命名、playing-style分析、formal confirmationは開始していない。

次工程は **Stage 1 — Exploratory position typology discovery の設計と小規模pilot** である。

以下は引き続き固定していない。

- formal hypothesis
- cluster数
- position-type名称
- playing-style名称
- feature setの最終版
- preprocessing
- formal seed block
- confirmation threshold
- statistical test
- formal execution policy

したがって、`RESEARCH_PLAN.md`、Stage 0文書、および次のStage 1 exploratory protocolはいずれもpreregistrationではない。

## Study 1との固定境界

局面相転移点Study 1はclosedであり、以下を変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only fixed `hard / bao / depth3`
- `capture-branch-expansion` classifier / vocabulary
- forced-capture regime definition
- `sustained-forcing window` のStage B retrospective interpretation boundary
- trajectory-ply sensitivityの位置づけ

Study 1 formal corpusはinitial typology discovery corpusへ入れない。独立に得られたposition typeとの関係を、研究後半のcross-study analysisで検討するためにのみ使用する。

## Stage 0実装済み

- full 32-pit stateを保存するposition observation schema
- board / legal-state primitive feature extractor
- historical state hash / `ruleStateKey` / `seatCanonicalKey`
- maximum capturable seeds
- relay / capture-chain primitive
- seed-distribution summary
- exploratory smoke generator
- replay / schema / provenance verifier
- reachable-state seat-canonical identity audit
- unit test

Primary observationにはAI evaluation、root score、search depth、nodes、cutoff等を含めない。search diagnosticsはmove-level secondary metadataとしてのみ扱う。

## Stage 0 smoke結果

実行provenance:

- source commit: `d72c2c20e4f4e6376208e687d65157b1ee4756c8`
- source tree: clean
- Node.js: v24.6.0
- games: 16
- observations: 970
- 4 generation conditions × 4 games

Hard integrity checks:

- schema validation: passed
- full replay: passed
- stored observation recomputation: passed
- move legality: passed
- state identity: passed
- trajectory hash: passed
- summary recomputation: passed
- source provenance: passed
- partial-file policy: per-game atomic files only

Position / trajectory summary:

- raw positions: 970
- unique rule states: 935
- duplicate rule-state slots: 35
- unique rule-state rate: approximately 96.4%
- unique seat-canonical states: 935
- seat-canonical collapse: 0
- within-trajectory repeated rule positions: 0
- unique trajectories: 16 / 16
- unique 8-ply opening states: 16 / 16

Phase distribution:

- raw namua: 704 / 970 ≈ 72.6%
- raw mtaji: 266 / 970 ≈ 27.4%
- unique-state audit namua: 669
- unique-state audit mtaji: 266

35 duplicate rule-state slotsは今回のsmokeではnamua側にのみ現れた。

## Seat-canonical identity

新しいreachable-state sampleで再監査した。

- unique rule states checked: 935
- legal moves checked: 3,714
- transitions checked: 3,714
- namua / mtaji双方を含む
- failures: 0
- result: passed

使用するsymmetry候補は既存研究で検証済みのSouth/North seat exchangeのみであり、column / direction reversalは使用しない。

この結果によりseat exchange transformのvalidityは再確認できた。

ただしsmokeでは`uniqueRuleState == uniqueSeatCanonical`でcollapseが0だったため、larger corpusにおけるcanonical dedupの実効的影響は未評価である。

Stage 1では `ruleStateKey` dedupと`seatCanonicalKey` dedupをsensitivityとして比較する。transform validityとprimary dedup policyを混同しない。

## Stage 1へ継承する設計判断

### Phase

namua / mtajiはmechanicsが異なり、smokeでも約73:27のphase imbalanceが観測された。

そのためStage 1では次を優先候補とする。

1. natural trajectoryをそのまま生成する
2. raw corpusのnatural phase occupancyを保存する
3. generation時に人工的な50:50 phase balanceを作らない
4. **phase-separated exploratory discoveryをprimary exploratory viewとする**
5. joint feature-space analysisをsecondary diagnostic / sensitivityとして残す

これはexploratory designでありformal freezeではない。

### Duplication / sampling

- raw plyを独立標本数とみなさない
- exact duplicate rule statesをcluster geometryへ無批判に重複投入しない
- trajectory / gameをstability resamplingの基本単位とする
- raw frequency情報は後のplaying-style occupancy分析用に保持する
- trajectory-balanced weightingまたはbalanced subsamplingをStage 1で比較する

### Terminal positions

terminal observationはprovenance / transition endpointとして保存するが、active decision positionのtypology discoveryへ含めるかはStage 1 protocolで明示する。

### AI condition

`phase2` / `legacy` / evaluator / depthはcorpus diversificationとlater sensitivity用metadataであり、position typeのfeature定義やplaying-style名称には使用しない。

## 重要原則

- position typeとplaying styleを分離する。
- playing styleを一局面だけから判定しない。
- AI実装条件をそのまま棋風名にしない。
- 勝率・AI評価値を局面類型そのものと同一視しない。
- 類型名を先に決めない。
- raw ply数を独立標本数とみなさない。
- deterministic trajectory repetitionを独立例として数えない。
- exploratory discoveryとfuture confirmatory validationを分離する。
- Study 1 formal decisionsを変更しない。
- formal corpusをGitHub Actionsで生成しない。

## 次に行う作業

Stage 1 exploratory protocolを作成し、次を明示する。

1. exploratory corpus generation strata
2. exploratory-only seed namespace
3. corpus sizeとincremental expansion policy
4. terminal-state inclusion policy
5. phase-separated / joint analysis views
6. rule-state / seat-canonical dedup sensitivity
7. trajectory-balanced sampling / weighting
8. candidate feature matrices
9. scaling / transformation candidates
10. clustering methods / dimensionality-reduction diagnostics
11. cluster stability diagnostics
12. representative positions / counterexamplesの抽出方法

その後、**large runではなくStage 1 pilot**を生成し、feature distribution / redundancy / sampling sensitivityを監査してから本格的exploratory clusteringへ進む。

## 次のformal decision point

Stage 1 exploratory evidenceからprovisional position typesが安定して初めて、Stage 2 replicationに向けて以下をfreezeする。

- target position population
- final feature set
- preprocessing
- clustering / assignment definition
- deduplication rule
- held-out seed block
- stability criterion
- minimum sample / cluster availability
- success / failure / inconclusive rule
- stopping condition

これらを固定するまではconfirmatory claimを行わない。
