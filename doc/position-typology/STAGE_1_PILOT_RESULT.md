# Stage 1 Exploratory Pilot Result （結果）

更新日: 2026-08-09  
Status: **pilot complete / integrity passed / exploratory only / no formal confirmation authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 位置づけ

本書は `STAGE_1_EXPLORATORY_PROTOCOL.md` に基づく96-game exploratory pilotの結果記録である。

このpilotは:

- formal experimentではない
- confirmatory corpusではない
- future Stage 2 held-out confirmationへ再利用しない
- cluster数・position type・playing styleを確定しない
- Study 1 formal decisionを変更しない

Pilotの目的は、Python exploratory analysisへ進む前にcorpus integrity、eligible population、phase balance、duplicate structure、generation-condition coverageを確認することである。

## 2. Provenance （日本語の要点）

- source commit: `cb5376145a8aeddf5ca42bc9c74e6a0efdb0e114`
- source tree: clean
- Node.js: `v24.6.0`
- platform: linux / x64
- games: 96
- base seed: `20270001`
- max ply: 100
- random opening: 8 ply
- conditions: 6 strata × 16 games
- config hash: `6d61f44cfaacf8dbb55fde544a31224faf45c729142fec83b68535bb941ccf10`
- raw summary hash: `f6704d4bb1d662b576f31a62dc0e96ce78bb226a508af7aacdc39f692b0fa52c`
- pilot audit hash: `7b159ba847e153e65deaffed9402325e52ddf5968d24fd4c2c4f09cc0537248d`

## 3. Integrity result （結果）

Full verificationはpassした。

- exploratory boundary: passed
- schema validation: passed
- full replay: passed
- stored observation recomputation: passed
- move legality: passed
- state identity: passed
- trajectory hash: passed
- summary recomputation: passed
- source provenance: passed
- clean source tree: passed
- partial files: not used; per-game atomic files only
- legal moves checked: 22,299

したがって、Stage 1 pilotはexploratory feature analysisに使用可能と判断する。

## 4. Raw corpus （日本語の要点）

- games: 96
- observations: 5,694
- terminal observations: 95
- namua observations: 4,111 / 5,694 ≈ 72.2%
- mtaji observations: 1,583 / 5,694 ≈ 27.8%
- unique rule states: 5,301
- duplicate rule-state slots: 393
- raw unique-state rate: 約93.1%
- within-trajectory repeated rule positions: 0
- unique historical trajectories: 96 / 96
- unique rule-state trajectories: 96 / 96
- unique seat-canonical trajectories: 96 / 96
- unique opening states: 96 / 96
- seat-canonical collapse: 0

Raw corpusの393 duplicate slotsは、primary discovery populationへ制限すると消失した。したがって、このpilotではduplicate slotsはすべてprimary対象外のopening / terminal領域に存在する。

## 5. Game completion / truncation （日本語の要点）

- terminal games: 95 / 96
- max-ply truncated games: 1 / 96
- plies min: 5
- plies max: 100
- plies mean: 58.3125

Max-ply truncationは1局のみである。Position typologyのstatic discoveryでは、その局のnonterminal positionsを直ちに除外する理由とはしない。

一方、将来のplaying-style、dwell-time、terminal-outcome analysisではcensoringとして別途扱う。

## 6. Primary eligible population （日本語の要点）

Primary definition:

- `terminal == false`
- `ply >= 8`

結果:

- raw eligible positions: 4,834
- unique `ruleStateKey`: 4,834
- duplicate rule-state slots: 0
- repeated rule-state keys: 0
- rule states shared across trajectories: 0
- largest rule-state occurrence: 1
- unique `seatCanonicalKey`: 4,834
- seat-canonical collapse: 0

したがって、このpilotではprimary rule-state dedupとseat-canonical dedupは同じsample countになる。

これはseat canonicalizationが不要であることを意味しない。単に、この96-game eligible populationにはSouth/North mirror pairが同時出現しなかったことを意味する。

## 7. Phase distribution （日本語の要点）

Primary eligible population:

- namua: 3,339 / 4,834 ≈ 69.1%
- mtaji: 1,495 / 4,834 ≈ 30.9%

Stage 0と同様にphase imbalanceは存在するが、mtajiも1,495 positionsあり、pilot-level exploratory clusteringを行うには十分な規模がある。

Primary analysisはprotocolどおりphase-separatedを維持する。

Joint phase analysisはsecondary diagnosticとする。

## 8. Generation-condition coverage （日本語の要点）

Eligible positions by condition:

| condition | eligible positions |
|---|---:|
| B-D1 | 980 |
| B-D2 | 865 |
| B-D3 | 847 |
| LS-D2 | 703 |
| V2-D2 | 702 |
| LE-D2 | 737 |

各conditionは16 gamesで均等だが、position countはtrajectory lengthによって異なる。

Phase × condition:

| condition | namua | mtaji |
|---|---:|---:|
| B-D1 | 576 | 404 |
| B-D2 | 576 | 289 |
| B-D3 | 568 | 279 |
| LS-D2 | 546 | 157 |
| V2-D2 | 505 | 197 |
| LE-D2 | 568 | 169 |

特にmtajiではcondition別position countが404から157まで開く。

これはplaying-style / occupancyのsignalである可能性もあるが、position-type discoveryのdistance geometryをcondition-specific dwell lengthで重み付けしないため、Stage 1では以下を比較する。

1. unique-position unweighted
2. game × phase balanced weight
3. deterministic trajectory-balanced subsample

Condition labelそのものはfeature vectorへ入れない。

## 9. Pilotから確定した次工程

Large corpusへ直ちに拡張しない。

まずPythonで以下を行う。

1. primary eligible feature tableを再構築する
2. actor-oriented raw 32-pit vectorを作る
3. package / Python versionを記録する
4. phase別missing / constant featureを監査する
5. deterministic relationを監査する
6. exact duplicate feature columnsを監査する
7. high-correlation feature pairを監査する
8. feature skew / zero inflationを監査する
9. Matrix S / C / Pの候補列を明示する
10. game × phase balance weightを付与する

この監査結果を見る前にclusteringを実行しない。

## 10. 現時点で維持するboundary

- position typeはstate-level
- playing styleはtrajectory / policy-level
- AI implementation conditionをposition type / playing style名にしない
- Study 1 classifierやformal corpusをinitial discoveryへ入れない
- raw plyを独立標本とみなさない
- condition別position frequencyをそのままcluster geometryのimportanceとみなさない
- phase-separated viewをprimaryとする
- cluster数はまだ固定しない
- feature set / preprocessingはまだfinalizeしない
- same pilot上のexploratory selectionをformal confirmationと呼ばない
