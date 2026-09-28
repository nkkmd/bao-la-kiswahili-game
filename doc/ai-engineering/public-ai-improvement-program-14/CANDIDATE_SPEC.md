# `PBAI-C017-v1` — A1候補開発契約

状態: **FROZEN BEFORE FIXED-DEPTH MEASUREMENT; SCOPE AMENDMENT RECORDED BEFORE MEASUREMENT**  
固定日: 2026-09-28  
分類: **DEVELOPMENT-ONLY / SINGLE-MECHANISM CANDIDATE**  
比較元: `AI-GEN4-BASELINE-2026-09-28-v1`  
baseline commit: `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
support record: [PBAI-P14 baseline support result](BASELINE_SUPPORT_RESULT.md)

## 1. 問いと候補

A1「探索ノードですでに作った遷移結果を再利用する」を、現行AI-GEN4 releaseのexpert/hard探索で一か所だけ試す。探索候補列挙時にNamua captureの`nyumba stop/use` after-stateを比べるため遷移を作り、順位付け時にも同じ候補を適用する。stop/use比較で作った遷移とevent情報を、後続の順位付けに渡せば同じ探索を保って重複適用を減らせる、という仮説を検証する。

Candidate IDは `PBAI-C017-v1`。これはPBAI-P14の隔離開発用IDであり、公開採用・release IDではない。PBAI-C015-v1の評価器・重みは固定したままにする。

## 2. 凍結する実装範囲

変更を許可する本体ファイルは `public/ai-candidate.js` のみ。`public/engine.js` は継承済みAI-GEN3 manifestに固定された公開資産として変更しない。追加可能なものはPBAI-P14専用tests、measurement tools、workflow、文書、artifactである。初期実装でengine.jsを変更したが、既存のimmutable-asset回帰testで検出したため、測定seedを処理する前に変更を完全に戻し、候補helperを `ai-candidate.js` 内部へ移した。以後のmeasurementは許可された公開ファイルが候補側の同ファイル1件のみであることをhash gateで検証する。

1. `BaoCandidateAI` 内部に探索専用のvariant-with-transition helperを置く。`E.legalMoves`の順序と既存 `moveVariants` の展開規則を保ち、Namua captureについてstop/useの遷移を一度ずつ評価する。AI-GEN3の固定済みengine assetは変更しない。
2. after-stateが一致した場合は既存と同じbare moveを返し、そのbare moveの意味（houseChoice既定stop）に対応するstop遷移をキャッシュとして添える。状態が異なる場合は従来どおりstop、useの順に返し、それぞれの遷移・eventsを添える。
3. 対象以外のvariantには遷移を先行計算せず、従来どおり後段で適用する。stop/useいずれかの計算が例外になった場合もbare moveを返し、候補探索側で従来どおり遷移を再計算する。
4. `BaoCandidateAI` のenhanced alpha-beta move orderingだけに明示的な内部option `pbaiC017ReuseSearchTransitions: true` を通す。キャッシュがある候補では順位付け用のstateとeventsに再利用し、なければ従来経路を使う。
5. quiescence、legacy search、MCTS、UI表示、rule logic、evaluation、PBAI-C015既定、worker/message protocolは対象外。新optionが無い場合の実行は変更前と同一にする。

`events` は既存transitionが生成したものを渡し、capture countとimmediate-win判定を変えない。helperのmove順・move identityは既存 `E.moveVariants` と一致させる。候補中にsource stateや候補moveを変更しない。cache entryは探索nodeを越えて保持しない。候補実装はdefault-offであり、`public/ai-release.js`、configの既定、公開ページの呼出し元を変更しない。

## 3. 開発用データと実行条件

- development seed block: **`2026092901..2026092964`**（64 seeds）
- 2026-09-28のrepo code searchではrange両端 `2026092901` と `2026092964` の既存一致は0件。support rangeのseedは流用しない。
- sample生成はbaseline support specと同じdeterministic self-play prefix/phase selectionを使う。欠測seed・局面を差し替えない。
- 開発比較はbaseline sourceを正確なcommitから読み、candidate sourceは開発branchから読む。全7公開AI source fileのhashを結果に保存し、意図した公開実装差分が `ai-candidate.js` だけであることを確認する。
- search options: release expert/hard profile, maxDepth 4, timeLimit Infinity, aspirationWindow 0, stableBestDepths 0, PBAI-C015 evaluation gate/profileを固定。random stateとsample setをbaseline/candidateで対にする。

## 4. 事前固定の開発gate

Candidateは次のすべてを満たさなければ development PASS としない。

1. 通常AI-GEN4 release regression suiteとPBAI-P14専用unit/property testsが成功。
2. 全Namua capture variant fixtureおよび開発seedから得た全Namua sampleで、候補variantsの順序、move key、after-state、event内容（既存表示snapshotを除く意味情報）が従来APIと一致する。collapseではbare moveがstop相当のafter-state/eventsを返す。
3. baseline/candidateの各sampleでbest move、rootScore、completedDepth、elapsed以外のsearch statsが一致し、全件depth 4完了・timeout 0。
4. development instrumentationで対象Namua stop/use再適用数がbaselineより減り、減少数が再利用entry数に対応する。対象外moveのtransition apply数は意図せず増えない。時間短縮率はこのinstrumented runから主張しない。
5. source hashes、seed coverage、per-shard artifactsの完全性をaggregate jobが検証する。欠落・不一致・部分実行はPASSにせず、再利用seedで補完もしない。

これは実装・意味同値性・mechanical work reductionの開発gateであり、独立一般化、棋力、ユーザー体験、採用効果は評価しない。Gate未達なら候補の範囲を後から広げず停止して記録する。

## 5. Actions実行方針

PBAI-C017開発shard、意味同値性試験、後続の必要な固定深度比較はGitHub Actionsを第一候補とする。seed blockを8 shard各8 seedsに固定し、`fail-fast: false`、各shardのtime limit、`always()` artifact upload、全shard成功時だけのaggregate artifactを用いる。単一job停止で既完了shardが失われないようにする。時間計測が必要な後続試験では診断計装を外し、baseline/candidateの順番をcounterbalanceする。Actionsの上限が実測上の障害になる場合は、その根拠・代替環境の固定・チェックポイント/再開方法を実行前記録してから代替する。

## 6. Scope boundary

この契約はcandidate developmentまでを許可する。independent validation、strength comparison、release holdout、PBAI-P14からの昇格、PR merge、main統合、production releaseは判断・証拠を分け、ここから自動的に許可されない。
