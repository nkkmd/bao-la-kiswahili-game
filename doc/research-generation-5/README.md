# 第五世代研究 — 探索順位の変動と厳密価値の損失

更新日: 2026-10-15（日本時間）
状態: **G5-01〜G5-05終了・BEFCS第3版技術検算済み・中間保存main統合済み／正式関係は未登録・未実行**

## 何を調べるか

探索条件による合法手の順位変動が、完全解析した局面で選択手の勝敗価値を失うこととどう関係するかを調べる。順位変動、着手変更、同価値内の手数差を区別し、公開AIへの採用は独立の開発工程で判断する。

## 現在分かったこと

| 工程 | source | 結果 |
| --- | ---: | --- |
| [G5-01](g5-01/development/REPORT.md) | 32 | 候補0件。測定と独立ルール遷移の基盤を検証 |
| [G5-02](g5-02/REPORT.md) | 32 | 固定8候補すべて状態上限で未完 |
| [G5-03](g5-03/REPORT.md) | 64 | 8完全領域・45状態37辺。手間勝敗価値差0件 |
| [G5-04](g5-04/REPORT.md) | 128 | 8完全領域・169状態162辺。3 rootに同価値内DTF差、手間勝敗価値差0件 |
| [G5-05](g5-05/REPORT.md) | 64 | 固定8候補は6状態上限・2 runtime guardで未完。価値差未確定 |

旧5区画の計320 sourceは消費済みである。[準備再評価](readiness-review-20261012/REPORT.md)は16完全領域の内部も含め主要課題に必要な勝敗価値差を確保できず、PRIMARY-READINESS-NOT-METと判断した。正式な関係の否定ではない。DTF差で主課題を代替しない。

## 次の供給研究と技術検証

[BEFCS-STUDY1提案](branch-envelope-20261013/README.md)は新規128 sourceから最初の分岐包絡適格rootを選び、最大8候補を全合法手完全閉包で調べる有限開発案である。現在は未登録・未実行で、当該Studyの科学seed消費0・科学leaseなしである。

科学用遷移・可逆保存・source独立再生・途中prefix・共有容量・監督区画・実Gitの技術検証を進めた。[2026-10-14の中間保存](checkpoint-20261014/README.md)で第3版の5原ZIP・3,361 file・Git/ACK/source/停止を独立照合し、旧失敗も保持した。通常caseは128技術sourceと抽象例1閉包を保存したが、最終mirror拒否・期限caseは未完である。科学的な完全領域供給の結果ではない。

外側起動からartifact保全までの全資源・単一時計、科学APIと途中closure/microstateの統合、最終仕様・認可記録・hash・レビュー・専用triggerが残る。条件成立まで科学sourceを起動しない。

## 読む順序

1. [現在の状態](CURRENT_STATUS.md) — 結果、未完、保存範囲。
2. [再開位置](RESUME_HERE.md) — 安全に次の工程へ進む順序。
3. [main統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)と[中間保存](checkpoint-20261014/README.md) — 統合の完了、原証拠・検算・未完条件。
4. [研究計画](PROGRAM_PLAN.md) — 問いと正式検証の設計境界。
5. [再現性索引](REPRODUCIBILITY_INDEX.md)と[研究ログ](RESEARCH_LOG.md) — 原記録への導線。
6. [第四世代の最終統合](../research-generation-4/FINAL_SYNTHESIS.md)と[研究アジェンダ](../FUTURE_RESEARCH_AGENDA.md) — 引き継ぐ知見と境界。

## 不変の境界

103355件の保守的既読遮断、全合法手完全閉包、未知の保持、不足時終了を維持する。旧root/witness延長・候補差替え・seed追加・予算増加・retryをしない。開発用と正式評価用を分離し、有限開発コーパスからBao一般の確率推論を行わない。

この中間保存のmain統合は研究全体の終了や科学実行条件の成立を意味しない。公開AIはAI-GEN4のままで、公開ゲーム・収集Workerに変更はない。途中経過と再開条件は2026-10-15（日本時間）に[PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205)でmainへ統合済みである。[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)に統合コミットとCI結果を示す。各旧報告・中間保存の「main未統合」「統合対象」は作成時点の履歴として保持する。
