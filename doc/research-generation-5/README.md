# 第五世代研究 — 探索順位の変動と厳密価値の損失

> 2026-10-30の静的確認: [runtime指定とtransport置換](runner-topology-20261017/runtime-20261030/README.md)でnet8.0・self-containedとSDK 8.0.424の指定を確認した。配布runtime patch版は未確定。Vss/Rawの別型transportへの置換には設定移管が必要で、guard・迂回禁止・容量・最終receiptは未成立。runner改変・build・実行、remote結合試験、科学実行を開始しない。

> 2026-10-30の再開確認: [Linux x64の通信・権限境界設計](runner-topology-20261017/BOUNDARY_DESIGN_20261030.md)にユーザーWSLの再観察と差込・迂回禁止・runtime/容量の未解決条件を整理した。architectureはx86_64、委任先のmemory/swap上限はmaxで、親制限の実効性は未検証。設計案の段階を維持し、runner改変・build・登録・実行、remote結合試験、科学実行を開始しない。

> 2026-10-20の通信経路台帳: [client生成箇所とguard差込位置の部分調査](runner-topology-20261017/client-map-20261020/README.md)で、固定C#817ファイルから32ファイル・72構文一致を保存した。共通factory以外のVss・Raw・OAuth等にも生成経路があり、単一箇所の変更では不足する。全client列挙・迂回禁止・下位transport・実装は未成立。次は対象architectureの読取確認と差込・OS境界設計で、結合試験や科学実行を開始しない。全工程未成立・科学seed0・leaseなし・未認可を維持する。

> 2026-10-20の追加制御設計: [最初の失敗で停止する要求guardの設計レビュー](runner-topology-20261017/fail-first-20261020/README.md)で、HTTP retry設定の下限補正・内側retry/認証経路を確認した。候補をsource管理下の最内側要求guardとし、許可消費・body検算・共有停止・保存専用許可を具体化したが、未実装・全client未監査である。配備・結合試験・科学実行を開始せず、全工程未成立・科学seed0・leaseなし・未認可を維持する。

> 2026-10-20のshell経路監査: [job開始前の通信retry](runner-topology-20261017/shell-route-20261020/README.md)を通常・Broker両listenerで確認した。shell中心化・単一job・attempt 1だけでは初回通信失敗時のretry拒否は成立しない。次は追加の失敗即停止制御の設計レビューで、配備や新規remote試験を行わない。全工程未成立・科学seed0・leaseなし・未認可を維持する。

> 2026-10-20の軽量経路レビュー: [固定ソースと候補比較](runner-topology-20261017/lightweight-20261020/README.md)で、bin全体とNode20/24両実行fileを保持する案も容量超過と確認した。次の静的監査はshell中心の実Actions job経路を優先するが、内部runtime・通信retry・全入力容量は未成立で、方式を採用していない。独立executorを実job/attemptの代用にせず、全工程未成立・科学seed0・leaseなし・未認可を維持する。

> 2026-10-20の容量検算: [WSL共有値と標準x64 runnerの静的検算](runner-topology-20261017/capacity-20261020/README.md)で、標準配布物の通常file論理量679562451 byteを確認した。標準配布物全体の通常展開案は現行256 MiBに収まらない。WSL自体の不採用とは区別し、次は最小実行経路の契約適合レビューとする。追加の導入・実機試験を行わず、全工程未成立・科学seed消費0・leaseなし・未認可を維持する。

> 2026-10-20の実行台帳: [入力・容量・権限・通信の台帳](runner-topology-20261017/EXECUTION_LEDGER_20261020.md)に候補経路と未確定欄を整理した。次はユーザーWSLの選択実行fileを読取専用観察器で採寸する。下限だけで全工程成立を認定せず、新規remote試験・科学実行を開始しない。科学seed消費0・leaseなし・未認可を維持する。

> 2026-10-20のWSL候補確認: [ユーザー共有の読取専用観察と実装前設計](runner-topology-20261017/WSL_PARENT_PLAN_20261020.md)を記録した。systemdとmemory委任は確認できたが、親制限・権限分離・容量・retry拒否・最終保存は未実証である。次は入力・容量・権限・通信の台帳と実行経路の確定であり、新規remote試験を起動しない。全工程未成立、科学seed消費0・科学leaseなし・科学実行未認可を維持する。

> 2026-10-17の親監督調査: [固定runnerソースと既存jobの照合](runner-topology-20261017/README.md)で、開始hook・job containerより前のActions取得と内部retry経路を確認した。hookの追加だけの方式を除外し、runner起動前からの親監督を設計候補とする。専用環境は未確認で、全工程未成立・科学seed消費0・科学leaseなし・科学実行未認可を維持する。

> 2026-10-17の再開監査: PR #208までの保存証拠を再検算し、[全工程の計測範囲と次の実装条件](lifecycle-review-20261017/README.md)を整理した。外側準備とartifact保全の親監督が未成立で、全工程の測定値は未確定である。次は初回準備より前から動く監督環境の実装可能性確認とし、成功済み取引を反復しない。科学seed消費0・科学leaseなし・BEFCSと正式関係の未登録/未実行を維持する。

> 2026-10-16の最新状態: [固定code取得と封印原image全体の外部保存](befcs-capsule-20261016/README.md)を検証し、1,266ファイルと通常/ACK抑止の両原imageを独立復元した。ACK抑止は未ACKのまま保持する。外側起動・封印後制御記録・最終科学input等は未完で、科学seed消費0・未登録/未実行を維持する。[現在の完了判定表](befcs-capsule-20261016/COMPLETION_GATES.md)を参照する。以下の追補は各段階時点の履歴である。

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
