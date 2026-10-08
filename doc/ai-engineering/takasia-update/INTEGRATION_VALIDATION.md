# 工程7の総合検証と配信前の確認

更新日: 2026-10-09（日本時間）

## 現在の状態と結論

工程7の既存CI整合を実装した。ローカルでは仕様照合25件、回帰167件、別計算、新旧棋譜と図解12点がPASSである。旧版の5系統の検証も通過した。GitHub Actionsでの全体検証と実ブラウザー検査は確認中であり、工程7全体の完了とは扱わない。main統合、実機確認、Cloudflare配備、本番配信は未実施である。

## 旧固定版と現行版の検証

作業開始時mainの固定コミット `8c87ed44c9b08f75456766f0a9bd9f76d06209d4` を隔離した一時worktreeへ展開し、旧版の検査をassert・期待値・hashを変更せず実行する。履歴検査の前には、現在の保存済み採用記録、モデル、固定局面、アーカイブ、規定、検証ツールが指定の旧版から変わっていないことも確認する。現行版の検査は現在の作業ブランチで別に実行する。

| 系統 | 保持する旧版検査 | 現行版の確認 |
| --- | --- | --- |
| AI-GEN3 | 旧releaseテスト全体と5資産の固定hash | 世代・採用IDを維持し、takasia改訂と工程6の16資産を別照合 |
| PBAI-C015 | 旧P9候補のbyte・9局面の全結果・実機確認済みコピー | takasiaを含む12局面でWorker・直接実行・通常遷移を照合 |
| PBAI-P4 | アーカイブ、独立再生、独立指標の全assert | 現行エンジン・探索・軽量遷移の既存回帰 |
| PBAI-P5 | 凍結された完了済み証拠の監査 | 現行公開経路の回帰。過去の棋力判断を書き換えない |
| LGTTCI | 旧ルール・固定技術局面でStage 0検査 | takasiaの現在の検証とは分離。研究結果の新版への移送を主張しない |

P4では作業開始時mainの設定にも、当時の基準との違いがあった。保存済み `execution-commits.bundle` のhashと前提を検証し、内部の固定コミット `99fa21704fc599afd180ecb819a6d780c309cf99` から実行当時の8資産を取り出した。検証ツールと証拠は作業開始時mainに固定し、実行資産だけをバンドル内の版へ戻す。アーカイブの再生と指標照合は検証であり、当時の時間計測・対局試験は繰り返さない。

現行配信候補は工程6の固定記録をコミット `50988a4d3a3850ab5f790ee70aff95fad0380b4c` から照合し、その記録にある16資産をhash検査する。記録の付け替え、エンジンbyteの変更、旧採用manifestの変更を拒否する負例も追加した。モデル、重み、探索予算、ゲーム本体、旧release manifest、過去の試験結果を今回変更していない。

従来の日英図解ブラウザー検査は図版12点・節11件・キャッシュv57へ同期した。旧v39からの更新確認を維持し、専用CIでのv55からv57の更新検査も保持する。PBAI-C015の実ブラウザー検査は現行公開画面のWorker・代替実行・通信遮断・切戻しをそのまま検査する。

## 実行方法と結果の保存

Node.js、Python 3と履歴を含むgit checkoutが必要である。ブラウザー検査はGitHub Actionsを第一候補とする。ローカル環境ではブラウザー実行ファイルを取得できなかったため、実ブラウザーPASSとは扱わない。

```bash
node tools/takasia/check-current-assets.cjs
node --test test/takasia-ci-boundary.test.cjs test/ai-generation-release.test.js test/pbai-c015-integration.test.cjs test/pbai-c015-expert-production.test.cjs
node tools/takasia/run-historical-ci.cjs gen3
node tools/takasia/run-historical-ci.cjs c015
node tools/takasia/run-historical-ci.cjs p4
node tools/takasia/run-historical-ci.cjs p5
node tools/takasia/run-historical-ci.cjs lgttci
```

各履歴検査はprofile別にコマンド・終了コード・版・ログを逐次保存する。専用CIではAI予算72条件と3ブラウザーの検査も引き続き実行する。固定済み工程1〜6の記録は上書きせず、工程7の結果・CI参照・ソースhashを新しい記録へ追加する。

## 配信前に残す確認

1. PR全体のCIと、従来の公開AI・日英図解・棋譜のブラウザー検査が通過すること。
2. Android実機で通常対局・公開AI・takasia表示・新旧棋譜・通信遮断中の動作を確認すること。
3. Cloudflare受信側のv1／v2対応を先に配備し、管理した棋譜送信で受理・R2保存・結果・CPU・終了処理を確認すること。
4. 新クライアントを配信し、実サイトのv55からv57への更新と旧キャッシュ削除を確認すること。
5. 実施した範囲と未確認項目を区別して記録し、main統合と公開版の判断を行うこと。

新クライアントを既存のv1専用受信環境へ先行配信しない。ブラウザーの検査は実機・実サイト・Cloudflare本番環境の検査へ読み替えない。学習済みモデルにはtakasia自体の入力がなく、今回の回帰・限定予算検査は一般的棋力や完全解を保証しない。
