# Bao la Kiswahili

Bao la Kiswahili は、ローカル 2 人対戦とコンピューター対戦に対応した、Bao の静的ブラウザー実装です。通常の静的ファイルだけで動作し、ビルド手順は不要です。ゲームロジックはすべてブラウザー内で実行されます。

コンピューターには 4 つのレベルがあります。

| レベル | 方式 |
| --- | --- |
| やさしい | 合法手からランダムに選択 |
| ふつう | 1 手読みで評価上位の手からランダムに選択 |
| むずかしい | ミニマックス法とアルファベータ枝刈りによる反復深化探索 |
| ムタアラム | デバイス性能に応じて調整した、より長い探索時間 |

コンピューターの手はすべて、人間の対局と同じルールエンジンで生成・検証されます。

## 機能

- `public/` 以下に配置された静的ブラウザーゲーム
- ローカル 2 人対戦モード
- コンピューター対戦時の South/North 選択
- namua、mtaji、連続種まき、nyumba、捕獲、勝敗判定に対応した Bao ルールエンジン
- 長めの思考中でも UI の応答性を保つ、Web Worker ベースの AI 探索
- オフライン対応デプロイのための PWA ファイル
- ルール、AI、探索、Worker、チューニング、ベンチマークツール向けの Node.js テストスイート
- シード、ペア開局、戦術回帰テスト、保存済み成果物による再現可能な AI ベンチマーク
- 外部送信なしで局面JSONをファイル保存し、直前のAI着手を端末内に記録する診断機能
- 「むずかしい」「ムタアラム」の直前探索統計と、Phase 10A向け保存推奨判定

## ルールの基準

この実装は、[`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja) の公開ドラフト `v0.1.0-draft` におけるルール基準 `R-002` を実装上の基準としています。捕獲義務、namua、mtaji、連続種まき、nyumba、勝敗判定を実装しています。

検証に使える完全な出典局面がまだ確認できていないため、`takasia` は適用していません。終わらない対局を防ぐため、連続種まきには安全上の上限を設けています。

固定参照コミット、実装範囲、既知の差異、ルール更新時の同期手順は [`doc/RULES_BASELINE.md`](doc/RULES_BASELINE.md) に記録しています。

## ローカルでの実行

任意の静的 HTTP サーバーで `public/` ディレクトリを配信し、`index.html` を開きます。

例:

```sh
cd public
python3 -m http.server 8000
```

続いて、以下を開きます。

```text
http://localhost:8000/
```

`file://` 経由で `public/index.html` を開いても大半のゲームプレイは動作しますが、Service Worker 機能には HTTP(S) が必要です。

## デプロイ

Cloudflare Pages などの静的ホスティングでは、公開ディレクトリを以下に設定します。

```text
public/
```

Privacy Policy へのリンクとPWAのオフラインキャッシュは、Cloudflare Pages の clean URL に合わせて `./privacy` を使用します。リダイレクト済みの `privacy.html` レスポンスはキャッシュしません。

## テスト

個別のテストを実行します。

```sh
node test/engine.test.js
```

テストスイート全体を実行します。

```sh
for f in test/*.test.js; do node "$f" || exit 1; done
```

## AI ベンチマーク

再現可能な固定深さベンチマークを実行します。

```sh
node tools/benchmark.js --games 100 --seed 20260706 \
  --first hard --second normal --time-limit 0 --max-depth 2
```

戦術回帰テストを実行します。

```sh
node test/tactical.test.js
```

戦術テストの診断出力:

```sh
BAO_TACTICAL_DIAG=1 node test/tactical.test.js
```

ゲーム画面の「AI改善用診断」では、次のJSONファイルを端末へ保存できます。

- `現在局面を保存`: `bao-position-YYYYMMDD-HHMMSS.json`
- `記録を保存`: `bao-ai-review-YYYYMMDD-HHMMSS.json`

日時は利用者の端末のローカル日時をファイル名にだけ使用します。診断JSON本文には保存時刻を追加しません。「記録を保存」を実行しても、localStorage内の記録は削除されません。

### Phase 10A 保存推奨

「むずかしい」と「ムタアラム」では、AI着手後に直前の完了深度、探索時間、探索局面数、timeoutの有無を表示します。次のような客観的条件を検出した場合は、悪手と断定せず「調査候補」として保存を推奨します。

- 探索のtimeout
- 難易度別の目安を下回る完了深度
- 同じ難易度の直近10手の中央値から2以上低い完了深度
- AI着手後に相手の捕獲可能手が2手以上増加
- AI着手後に自分の前列占有穴が2個以上減少
- AI着手直後の敗北確定

判定はブラウザー内だけで行われ、自動保存や外部送信はしません。保存を推奨された場合も、利用者が「AIの手を記録」を押したときだけlocalStorageへ追加されます。診断JSONには`review.status: "unreviewed"`、推奨スコア、検出シグナルが含まれます。

保存したJSONから、局面監査・レビュー用の戦術ケース雛形を生成できます。

```sh
node tools/diagnostic-to-fixture.js \
  --input /path/to/diagnostic.json \
  --output /tmp/bao-tactical-fixtures.js
```

生成される雛形は意図的に失敗するTODOを含みます。Baoの習熟度が十分でない場合は、期待手を無理に決めず、深度比較、評価値、node数、timeout、自己対局結果などの客観情報だけを記録して`unreviewed`のまま保持できます。期待手または避ける手とBao上の理由を確認した局面だけを`test/tactical.test.js`へ正式追加します。

詳しい手順は [`doc/AI_HUMAN_REVIEW_GUIDE.md`](doc/AI_HUMAN_REVIEW_GUIDE.md)、ベンチマーク条件とベースライン結果は [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md) に記録しています。

## プロジェクト構成

| パス | 役割 |
| --- | --- |
| `public/` | デプロイ用の静的ゲームファイル |
| `public/engine.js` | 盤面状態、合法手生成、着手適用 |
| `public/ai.js` | コンピューターの手の選択、評価、探索 |
| `public/ai-weights.js` | デフォルトの評価重み |
| `public/ai-worker.js` | バックグラウンド AI 探索 Worker |
| `public/ai-config.js` | デバイス性能別の探索設定 |
| `public/diagnostics.js` | AI診断局面の許可リスト形式、復元、端末内記録 |
| `public/review-suggestion.js` | Phase 10Aの探索表示、保存推奨判定、診断根拠付与 |
| `public/diagnostic-download.js` | 診断JSONの日時付きファイル保存 |
| `tools/` | ベンチマーク、チューニングスクリプト、実験ランナー |
| `test/` | 回帰テスト |
| `artifacts/` | 保存済みのベンチマーク・チューニング・研究出力 |
| `doc/` | ルール学習、研究成果、ロードマップ、ベンチマーク、開発ログ、技術レポート |

## AI Engineering

本リポジトリでは、研究成果の科学的判断とは分離して、public Bao AI の品質向上作業を独立した engineering track として管理しています。研究結果そのものの formal decision を engineering outcome によって変更することはありません。

- [`doc/AI_ENGINEERING_INDEX.md`](doc/AI_ENGINEERING_INDEX.md): public Bao AI の品質向上に関する engineering track の中央索引。AI generation naming、baseline、candidate disposition、release state への入口
- [`doc/ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md`](doc/ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md): `PBAI-P2` — Generation-2 Evidence-Informed Public Bao AI Improvement Program 2 の最終報告。Research Generation 2だけをscientific/evidence inputとし、Research Generation 3 influenceを`ZERO`に維持してC006〜C009をprospectively評価した結果、validationへ進むcandidateはなく、最終engineering outcomeは`KEEP-AI-GEN2`。PBAI-P2によるpublic AI code変更・release・`AI-GEN3`昇格はなし
- [`doc/ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md`](doc/ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md): `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1 の最終報告。Research Generation 1 を evidence base として候補を検証した結果、public 採用候補はなく、最終 engineering outcome は `KEEP-AI-GEN2`。`AI-GEN3` は未昇格

科学的研究成果の正本と将来研究課題は、以下の「研究成果」および [`doc/RESEARCH_INDEX.md`](doc/RESEARCH_INDEX.md) を参照してください。

## 研究成果

本リポジトリでは、AI自己対局・固定seed・paired openingなどを用いたBaoの実験研究も行っています。研究成果が増えても辿りやすいよう、**研究全体の中央索引**を用意しています。

- [`doc/RESEARCH_INDEX.md`](doc/RESEARCH_INDEX.md): 研究成果の中央索引。初見向け概要、科学的正本、研究運用文書への入口
<!-- FDEGHV-G3-11-ROOT-README -->
- [`doc/fresh-depth10-exact-geometry-holdout/README.md`](doc/fresh-depth10-exact-geometry-holdout/README.md): Research Generation 3 `G3-11` / `FDEGHV-STUDY1`。standard initial RAW rootをfresh complete exact depth 10までRAW-onlyで列挙し、materially separate independent full re-enumerationもPASS。formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`、H1–H4は全て`DEEPER-CONFIRMED`。depth 10は348,270 unique RAW states / 494,456 tree-node occurrences、累積は451,127 distinct RAW states / 631,101 tree-node occurrences。protected depth-10は1回のauthorized executionでconsume済みでrerun禁止。depth 11は未承認。main integrationは`COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false`
<!-- GCLD-G3-10-ROOT-README -->
- [`doc/geometry-conditioned-longitudinal-dynamics/README.md`](doc/geometry-conditioned-longitudinal-dynamics/README.md): Research Generation 3 `G3-10` / `GCLD-STUDY1`。formal-eligible continuous bounded RAW local geometryのfresh trajectory-level検証を`CLOSED / FORMAL-COMPLETE`で完了。C1 directionality、C2 persistence、C3 return fraction（ACTUAL-LESS）、C5 first-order path dependenceが`CONFIRMED`、C4 chronology-conditioned circulationは`NOT-CONFIRMED`。causal dynamics / physical hysteresis / strategic regimeを主張しない。protected depth-10はG3-10 closure時点では未開封で、その後の独立G3-11でprospectively開封・検証済み
<!-- G3-10-PREREQUISITE-CHAIN-ROOT -->
- [`doc/canonical-resource-robust-continuous-local-geometry-representation/README.md`](doc/canonical-resource-robust-continuous-local-geometry-representation/README.md): G3-10直前の独立prerequisite `CRCLGR-STUDY1`。`CRCLGR-R1-EXACT-SQUASHED-L1`を`FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION`として確立し、後続のseparate reviewでG3-10 dependencyを満たした。
- [`doc/resource-robust-continuous-local-geometry-representation/README.md`](doc/resource-robust-continuous-local-geometry-representation/README.md): 先行prerequisite `RRCLGR-STUDY1`。fresh Stage 1でstructured digest type errorにより`CLOSED / TECHNICAL-INVALID`。同Studyを救済せず、後続CRCLGRを独立Studyとして実施した。
- [`doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md`](doc/position-evaluation-empirical-outcome-calibration-replication/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-01` / `PEOCR-STUDY1`。8,192-game held-out replicationは独立verificationを完了したが、strict firewall後の3 estimability gate未達によりformal decision `INCONCLUSIVE`
- [`doc/search-reliability-decision-robustness/STUDY_1_OVERVIEW.md`](doc/search-reliability-decision-robustness/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-02` / `SRDR-STUDY1`。Stage 2は1536/1536 gamesと独立verificationを完了したが、unique trajectories after firewallが`1040 < 1050`でpreregistered estimability gateを1件未達とし、formal decisionは`INCONCLUSIVE`。primary formal criterionは未評価 (`null`)
- [`doc/state-transformation-semantics-canonicalization-validation/STUDY_1_OVERVIEW.md`](doc/state-transformation-semantics-canonicalization-validation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-03` / `STSCV-STUDY1`。Fresh Stage 2 production measurementはNamua/Mtaji/Mtaji-houseless各32 rootsでT01/T02/T03すべてproduction mismatch 0だったが、mandatory independent verifierがformal-result assemblyでtechnical failureしcanonical verification artifactをmaterializeできなかった。frozen global-failure ruleによりStudyは`INCONCLUSIVE`、3 candidatesすべて`NON-ESTIMABLE`。canonicalization / symmetry-reduced countingは未承認
- [`doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md`](doc/restricted-endgame-exact-oracle-expansion/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-04` / `REEOE-STUDY1`。Stage 0 technical controlはPASS。Fresh Stage 1 v2は8 rootsを独立再構築したがcomplete closureは0/8（STATE-LIMIT 4 / ADMIN-CUTOFF 3 / MOVE-NONTERMINATION 1）でfrozen feasibility gateを満たさず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。formal decisionは`INCONCLUSIVE`、fresh exact oracleは未生成
- [`doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`](doc/deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-05` / `DRSSE-STUDY1`。Standard initial RAW rootをprospectively固定し、depth 0..9をcomplete enumeration。formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`、累積102,857 RAW states / 136,645 tree-node occurrences。full Bao state-space / game-tree estimateではなく、symmetry reduction / canonicalizationは未使用
- [`doc/rich-critical-position-representation/STUDY_1_OVERVIEW.md`](doc/rich-critical-position-representation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-06` / `RCPR-STUDY1`。Stage 0 technical representation validationはPASSし、fresh Stage 1 productionでは599 primary-estimable roots / 134 high-divergence rootsを得たが、mandatory independent feature recomputationが4/600 rowsでexact vector hash不一致となった。frozen fail-closed ruleによりformal Stage 1 dispositionは`STAGE1-TECHNICAL-INVALID`、seed blockは消費済み、same-block rerun禁止、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`
- [`doc/practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md`](doc/practical-comeback-reply-pressure-representation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-07` / `PCRPR-STUDY1`。Stage 0は`STAGE0-TECHNICAL-PASS`。Fresh Stage 1は3,072 games / 400 roots / 1,429 root-move rowsまでproductionとindependent replayが完走し、development core hashも一致したが、independent full artifactのGitHub Actions uploadがtimeoutして必須full final exact verificationをmaterializeできなかった。frozen fail-closed ruleによりStage 1は`STAGE1-TECHNICAL-INVALID`、seed blockは消費済み、same-block rerun禁止、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`
- [`doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md`](doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-08` / `MDFT-STUDY1`。Stage 0 technical PASS後、fresh Stage 1 4,096 gamesをproduction/independent exact一致で完遂したが、opening-prefix diversityとmaximum source-policy shareの2 preregistered readiness gate未達によりStudy formal decision `NON-ESTIMABLE`。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。
- [`doc/tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md`](doc/tactical-motif-generalization-counterexample/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-09` / `TMGC-STUDY1`。Stage 0は`STAGE0-TECHNICAL-PASS`。Stage 1 scientific authorization前のtechnical-only tooling smokeでindependent boundary aggregatorが`ReferenceError`を発生させ、frozen no-rescue ruleに従いStage 1は`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`、Studyは`TECHNICAL-INVALID`でclosed。Stage 1/2 scientific seedsは未消費で、C03 generalization/counterexample scientific resultは未生成。
- [`doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md`](doc/unified-multiaxial-strategic-state-representation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-10` / `UMSSR-STUDY1`。Fresh Stage 1は4,096 games / 512 roots / 40 active featuresをproduction / independent exact一致で完了し、scientific readinessとresource gateもPASSしたが、prospectively fixed `K=2..6`の全候補がminimum supportまたはfive-fold assignment stabilityを満たさず、Stage 1は`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`でclosed。Study formal decisionは`NOT-AUTHORIZED-NOT-EXECUTED`。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、reserved Stage 2 seedsは未消費で、G2-11へ渡せるvalidated / frozen representationは生成されなかった。
- [`doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md`](doc/prospective-strategic-regime-representation-eligibility/STUDY_1_OVERVIEW.md): Pre-G2-11 prerequisite / `PSRRE-STUDY1`。Stage 0 technical PASS後、fresh Stage 1 4,096 games / 512 rootsをproduction / independent full-exactで完遂したが、prospectively fixed nonzero-MAD feature readinessが`15 < 20`で未達となりformal decision `NON-ESTIMABLE`。representationはfreezeされず、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。G2-11はその後、追加prerequisiteを行わないprogram decisionによりagenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`でformal closure。
- [`doc/state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md`](doc/state-space-game-tree-growth-estimation/STUDY_1_OVERVIEW.md): Research Generation 2 `G2-12` / `SSGTGE-STUDY1`。G2-05 depth 0..9をdevelopment evidenceとするprospective growth-estimator Study。Stage 0 v2は`STAGE0-TECHNICAL-PASS`だったが、Stage 1 production-onlyでE2を提案した後、mandatory independent verifierが凍結済み`1e-12` cross-implementation toleranceを超えるprediction mismatchを検出したため`STAGE1-TECHNICAL-INVALID`、Study formal decision `TECHNICAL-INVALID`。canonical estimatorは`null`、fresh depth 10/11は未生成・未読、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。
- [`doc/research-generation-2/FINAL_SYNTHESIS.md`](doc/research-generation-2/FINAL_SYNTHESIS.md): Research Generation 2 final synthesis。Core `G2-01..G2-12`はformal closure。G2-11はrequired frozen representation不成立によりagenda-level `NON-ESTIMABLE` / execution `NOT-AUTHORIZED-NOT-EXECUTED`（Study ID未付与）で閉じ、G2-H01はindependent / non-blocking human trackとしてdeferred。
- [`doc/research-generation-3/PROGRAM_PLAN.md`](doc/research-generation-3/PROGRAM_PLAN.md): Research Generation 3開始前に固定したprospective program plan正本。`G3-01..G3-12`の当初agenda・dependency・protected depth-10 holdout設計を保持する履歴的計画文書であり、現在状態は`CURRENT_STATUS.md`を参照する。
- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-11 / `FDEGHV-STUDY1`は`CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`。H1–H4はすべて`DEEPER-CONFIRMED`。protected depth-10は1回のauthorized executionでconsume済み、same-evidence rerunとdepth 11は未承認。G3-11のmain integrationは`COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false`。
<!-- CLGR-G3-09-CANONICAL-LINKS:ROOT -->
- [`doc/continuous-local-geometry-representation/README.md`](doc/continuous-local-geometry-representation/README.md): Research Generation 3 `G3-09` / `CLGR-STUDY1` のtechnical-invalid closure入口。
- [`doc/continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md`](doc/continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md): G3-09のprospective representation contract、Stage 1 PASS、Stage 2 relay-limit fail-closed、no-rescue / interpretation boundaryの科学的最終正本。
- [`doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md`](doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md): G3-09のsource binding、seed、exact hashes、Actions provenance、protected-evidence / final-audit provenance。
- [`doc/research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`](doc/research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md): G3-09 `CLOSED / TECHNICAL-INVALID` program decision。G3-10は自動authorizeされない。
<!-- LGPML-G3-08-CLOSURE:ROOT-README -->
- [`doc/local-geometry-persistence-memory-length/README.md`](doc/local-geometry-persistence-memory-length/README.md): Research Generation 3 `G3-08` / `LGPML-STUDY1` のtechnical-invalid closure入口。
- [`doc/local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md`](doc/local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md): G3-08のprospective contract、Stage 0/1 execution、relay-limit technical failure、no-rescue / interpretation boundaryの正本。
- [`doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md`](doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md): G3-08のsource binding、seed、Actions provenance、exact result hashes、protected-evidence boundary。
- [`doc/research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md`](doc/research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md): G3-08 `CLOSED / TECHNICAL-INVALID` program decision。G3-09は自動authorizeされない。
<!-- SILGM-G3-07-CLOSURE:ROOT-README -->
- [`doc/search-instability-local-geometry-mechanism/README.md`](doc/search-instability-local-geometry-mechanism/README.md): Research Generation 3 `G3-07` / `SILGM-STUDY1` のformal-complete研究入口。
- [`doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md`](doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md): G3-07のStage 0–2 execution、8 candidateのformal判定、3 confirmations、interpretation boundaryの正本。
- [`doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md`](doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md): G3-07のsource binding、seed、Actions provenance、exact hashes、no-rescue / protected-evidence boundary。
- [`doc/research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`](doc/research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md): G3-07 `CLOSED / FORMAL-COMPLETE` program decision。G3-08は自動authorizeされない。
- [`doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md): RG3側のG3-07 closure checkpoint。closure時点ではmain integration未実施。
- [`doc/research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-main-integration-complete.md): 明示的ユーザー指示後のG3-07 main fast-forward統合完了checkpoint。
- [`doc/branch-expansion-compression-transition/STUDY_1_OVERVIEW.md`](doc/branch-expansion-compression-transition/STUDY_1_OVERVIEW.md): G3-05 / `BECT-STUDY1` のprospective scopeとmeasurement boundary
- [`doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`](doc/branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md): G3-05の`CLOSED / TECHNICAL-INVALID` closure、relay-limit technical failure、no-rescue / Stage 2 non-authorization boundary
- [`doc/bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md`](doc/bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-06` / `BRMGI-STUDY1`。capture、nyumba stop/use、reserve exhaustion / Namua→Mtaji linked eventに伴うbounded RAW geometry changeをprospectively検証したが、fresh Stage 1でproduction / independent event-unit selectionが一致せず`CLOSED / TECHNICAL-INVALID`。rule-event/geometryのpositive・negative・null scientific resultではない。
- [`doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md`](doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md): G3-06のStage 0 v1/v2、Stage 1 exactly-one execution、selection-verification technical failure、no-rescue、Stage 2 non-authorizationの最終正本。
- [`doc/research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md`](doc/research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md): `LGTGMIV-STUDY1`のformal closureを受理し、G3-02を自動開始せず別authorization reviewを要求したLGTGMIV closure時点のhistorical program decision。
- [`doc/research-generation-3/checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md`](doc/research-generation-3/checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md): LGTGMIV closed research branchの`main` fast-forward統合完了checkpoint。
- [`doc/research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md`](doc/research-program-decisions/2026-08-31-post-g3-01-measurement-instrument-prerequisite-selected.md): G3-01をreopen / rescueせず、新しいprospective measurement-instrument prerequisiteを次の研究方向として選択したprogram-level decision。
- [`doc/local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md`](doc/local-game-tree-geometry-measurement-foundation/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-01` / `LGTGMF-STUDY1`。Fresh Stage 1では全12 rootsでproduction / independentのroot-level coreとF1〜F5 family digestがexact一致したが、runtime-dependent resource observationsを含むstage-level hash実装欠陥によりformal decisionは`TECHNICAL-INVALID`。eligible familiesは`[]`、Stage 2未実行。
- [`doc/local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md`](doc/local-game-tree-geometry-measurement-instrument-verification/STUDY_1_OVERVIEW.md): Research Generation 3 post-G3-01 / pre-G3-02 prerequisite `LGTGMIV-STUDY1`。Stage 1 fresh 16 rootsとStage 2 fresh holdout 24 rootsをRAW-only depth 5までproduction / independent別実装でexact reconstructionし、5 frozen measurement familiesすべてがformal gateをPASS。formal decisionは`FORMAL-ELIGIBLE-ALL`。G3-01は救済せず、G3-02自動開始も未承認。
- [`doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-02` / `EBRWS-STUDY1`。RAW-only depth 5でfresh Stage 1を実行したが、canonical result push失敗・回収不能に加え、workflow armingにより意図せず2回目のStage 1が実行されexactly-one-execution contractも違反。formal decisionは`CLOSED / TECHNICAL-INVALID`、2回目はscientific inferenceから除外、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。G3-02 closure作業は完了し、#92 を通常mergeして `main` へ統合済み（merge commit `b41c7eda74dd1002e98e4d82714fadb987d1f1e1`）。
- [`doc/transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md`](doc/transposition-concentration-tree-graph-divergence/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-03` / `TCTGD-STUDY1`。RAW-only depth 5のtransposition/tree-graph geometryをfresh Stage 1で測定。canonical production/independent stage SHAは一致したが、independentの`Object.create(null)` endpoint mapとprototype-sensitive deep equalityのverification defectによりmandatory exact gateがfailし、formal decisionは`CLOSED / TECHNICAL-INVALID`。formal promoted candidate set `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`。
<!-- SFCDF-G3-04-CLOSURE:ROOT -->
- [`doc/structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md`](doc/structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-04` / `SFCDF-STUDY1`。RAW-only relative depth 5でcorridor / funnel descriptorsをprospectively検証し、Stage 1からC1/C6だけをpromotion。fresh Stage 2 holdout 18 paired trajectoriesではC1 unit-width occupancyが18/18でMtaji > Namua、C6 cumulative tree/RAW ratioが18/18でNamua > Mtajiとなり、両候補ともexact sign test `p=1/131072`とHolm gateをPASSして`CONFIRMED`。Studyは`CLOSED / FORMAL-COMPLETE`。game-theoretic forcing、search ease、value等への拡張はしない。depth-10 holdoutはsealed。
- [`doc/practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md`](doc/practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md): Practical Comeback / Error-Inducing Move Study 1（`PCEM-STUDY1`）。Study 1完了、Stage 0 `TECHNICAL-PASS`、Stage 1 `EXPLORATORY-ONLY`、55 candidate audits / promoted candidates 0、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`
- [`doc/phase-transition/STUDY_1_OVERVIEW.md`](doc/phase-transition/STUDY_1_OVERVIEW.md): 局面相転移点研究Study 1「Baoにおける局面相転移点の発見と、capture-branch-expansionの確認」の初見向け成果概要
- [`doc/position-typology/STUDY_1_OVERVIEW.md`](doc/position-typology/STUDY_1_OVERVIEW.md): 局面類型と棋風Study 1「Baoにおける局面類型と棋風の発見・検証」の初見向け成果概要
- [`doc/namua-mtaji-transition/STUDY_1_OVERVIEW.md`](doc/namua-mtaji-transition/STUDY_1_OVERVIEW.md): Namua→Mtaji Strategic Temporal Transition Study 1「capture-branch-expansionからMtaji morphologyへの時間的接続」の初見向け成果概要（formal decision `NOT-CONFIRMED`）
- [`doc/position-complexity/STUDY_1_OVERVIEW.md`](doc/position-complexity/STUDY_1_OVERVIEW.md): Position Complexity / Difficulty Study 1「Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離」の初見向け成果概要（formal decision `INCONCLUSIVE`）
- [`doc/tactical-motifs/STUDY_1_OVERVIEW.md`](doc/tactical-motifs/STUDY_1_OVERVIEW.md): Tactical Motifs / Tesuji Study 1「局面横断的 tactical motifs と transferable move principles」の初見向け成果概要（Study 1完了、`TM-S2-C03` `CONFIRMED` / C01,C02,C04 `NOT-CONFIRMED`）
- [`doc/tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](doc/tactical-motif-human-validation/STUDY_1_OVERVIEW.md): TM-S2-C03 Human / Expert Validation Study 1の初見向け成果概要（machine/instrument stage complete、human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`）
- [`doc/position-evaluation-calibration/STUDY_1_OVERVIEW.md`](doc/position-evaluation-calibration/STUDY_1_OVERVIEW.md): Position Evaluation / Win-Rate Calibration Study 1「形勢評価値と実現勝率の校正」の初見向け成果概要（formal decision `INCONCLUSIVE`）
- [`doc/blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](doc/blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md): Blunder / Misvaluation Patterns Study 1「悪手・誤評価パターンの発見と体系化」の初見向け成果概要（Study 1完了、4候補すべて `NOT-CONFIRMED`、`CONFIRMED` 0）
- [`doc/critical-positions-outcome-branching/STUDY_1_OVERVIEW.md`](doc/critical-positions-outcome-branching/STUDY_1_OVERVIEW.md): Critical Positions / Outcome Branching Study 1「重要局面と勝敗分岐点」の初見向け成果概要（Study 1完了、139/600 rootsがhigh-divergence、promoted structural candidates 0、Stage 2未実施）
- [`doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md): Restricted Endgame / Winning Regions Study 1「限定終盤と必勝圏の完全解析」の初見向け成果概要（formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`、8 states / 7 edges、frozen rootはPlayer 0 `WIN`, DTF=3）
- [`doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md): Symmetry / Isomorphic Positions Study 1「対称性と同型局面の厳密検証」の初見向け成果概要（Study 1 closed、0 validated / 0 rejected / 5 `NON-ESTIMABLE`; invalidated v1 fresh diagnostics mismatch 0、corrected v2 not authorized/executed）
- [`doc/oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`](doc/oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md): Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1の初見向け成果概要（Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`、Axis B `NOT-AUTHORIZED-NOT-EXECUTED`; canonicalization / symmetry-reduced counting未承認、raw state identityがdownstream authoritative）
- [`doc/state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`](doc/state-space-game-tree-complexity/STUDY_1_OVERVIEW.md): State Space / Game Tree Complexity Study 1「authoritative raw-state identityに基づくreachable-state / game-tree complexity」の初見向け成果概要（formal decision `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`、depth 8で24,848 raw states / 30,941 tree-node occurrences。Bao全体のexact countではない）
- [`doc/joseki/README.md`](doc/joseki/README.md): 完了済み第一次定石研究の結論、個別成果、照合資料、将来研究への索引
- [`doc/FIRST_PLAYER_ADVANTAGE_RESEARCH.md`](doc/FIRST_PLAYER_ADVANTAGE_RESEARCH.md): 先攻・後攻差研究の統合記録
- [`doc/FUTURE_RESEARCH_AGENDA.md`](doc/FUTURE_RESEARCH_AGENDA.md): 局面分類、手筋、形勢判断、終盤解析など、既存研究から切り出した将来研究課題

新しい独立研究が完了した場合は、初見向けOverview / Conclusionと科学的・技術的な正本を分け、`doc/RESEARCH_INDEX.md`から参照する方針です。

## ドキュメント

- [`doc/RULES_BASELINE.md`](doc/RULES_BASELINE.md): 採用ルールの参照元、固定コミット、実装差分、更新方針
- [`doc/BEGINNER_STRATEGY_GUIDE.md`](doc/BEGINNER_STRATEGY_GUIDE.md): 初心者向けの基本戦略、思考手順、段階別練習方法
- [`doc/JOSEKI_RESEARCH.md`](doc/JOSEKI_RESEARCH.md): 定石研究の方法、全フェーズの実験結果、最終判断をまとめた統合記録
- [`doc/JOSEKI_RESEARCH_PLAN.md`](doc/JOSEKI_RESEARCH_PLAN.md): 定石研究の研究課題、判定基準、完了条件、実施記録
- [`doc/PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md`](doc/PAIRED_OPENING_FIRST_PLAYER_RESEARCH_PLAN.md): 全継続AI条件で固定開局系列を共有するペア追試計画
- [`doc/NAMUA_SYMMETRY_RESEARCH_PLAN.md`](doc/NAMUA_SYMMETRY_RESEARCH_PLAN.md): namua鏡像変換、合法手、bao評価の不一致原因を調査するローカル研究計画
- [`doc/BAO_AI_TECHNICAL_REPORT.md`](doc/BAO_AI_TECHNICAL_REPORT.md): 公開向け Bao AI 技術レポート
- [`doc/AI_BENCHMARK.md`](doc/AI_BENCHMARK.md): ベンチマークコマンドとベースライン結果
- [`doc/AI_DEVELOPMENT_LOG.md`](doc/AI_DEVELOPMENT_LOG.md): 設計判断、失敗した試行、制限事項
- [`doc/AI_ROADMAP.md`](doc/AI_ROADMAP.md): 完了済みの Phase 0-5 AI ロードマップ
- [`doc/AI_ADVANCED_ROADMAP.md`](doc/AI_ADVANCED_ROADMAP.md): Phase 6 以降のロードマップと今後の改善メモ
- [`doc/AI_HUMAN_REVIEW_GUIDE.md`](doc/AI_HUMAN_REVIEW_GUIDE.md): 初心者でも進められる機械的局面監査と、根拠確認後の棋力レビュー手順
- [`doc/SYSTEM_DESIGN.md`](doc/SYSTEM_DESIGN.md): システム構成と責務

## ライセンス

このプロジェクトは MIT License のもとでライセンスされています。詳しくは [`LICENSE`](LICENSE) を参照してください。

<!-- CLGR-G3-09-CLOSURE:ROOT-README -->
## Research Generation 3 — G3-09 closure

G3-09 [`CLGR-STUDY1`](doc/continuous-local-geometry-representation/README.md) は **`CLOSED / TECHNICAL-INVALID`**。prospectively固定した6-axis exact continuous representationはStage 1 development 48/48 rootsをPASSしたが、Stage 2 fresh formal holdoutは72 roots選定後61 roots完了時点のMtaji seed `31920066`でrequired depth-5 RAW enumerationが`relay-limit`となりfail-closedした。formal representation eligibilityは**確立していない**。same-evidence rerun / root replacement / seed extension / resource ceiling relaxation / representation rescueは禁止し、protected standard-initial RAW depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま保持する。G3-10は別のpost-G3-09 current-state authorization reviewまで`NOT AUTHORIZED`。G3-09は2026-09-03の明示的ユーザー指示後、review-ready tip `64ada67b058811c18d81e7286fd3b12df6964459` を`main`へfast-forward統合した（`force=false`）。scientific closure / no-rescue / protected depth-10境界は不変。
