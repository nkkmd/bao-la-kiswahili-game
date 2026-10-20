# 第五世代研究 — 再現性の索引

> 2026-10-20の軽量経路レビュー: [固定ソースと候補比較](runner-topology-20261017/lightweight-20261020/README.md)で、bin全体とNode20/24両実行fileを保持する案も容量超過と確認した。次の静的監査はshell中心の実Actions job経路を優先するが、内部runtime・通信retry・全入力容量は未成立で、方式を採用していない。独立executorを実job/attemptの代用にせず、全工程未成立・科学seed0・leaseなし・未認可を維持する。

> 2026-10-20の容量検算: [WSL共有値と標準x64 runnerの静的検算](runner-topology-20261017/capacity-20261020/README.md)で、標準配布物の通常file論理量679562451 byteを確認した。標準配布物全体の通常展開案は現行256 MiBに収まらない。WSL自体の不採用とは区別し、次は最小実行経路の契約適合レビューとする。追加の導入・実機試験を行わず、全工程未成立・科学seed消費0・leaseなし・未認可を維持する。

> 2026-10-20の実行台帳: [入力・容量・権限・通信の台帳](runner-topology-20261017/EXECUTION_LEDGER_20261020.md)に候補経路と未確定欄を整理した。次はユーザーWSLの選択実行fileを読取専用観察器で採寸する。下限だけで全工程成立を認定せず、新規remote試験・科学実行を開始しない。科学seed消費0・leaseなし・未認可を維持する。

> 2026-10-20のWSL候補確認: [ユーザー共有の読取専用観察と実装前設計](runner-topology-20261017/WSL_PARENT_PLAN_20261020.md)を記録した。systemdとmemory委任は確認できたが、親制限・権限分離・容量・retry拒否・最終保存は未実証である。次は入力・容量・権限・通信の台帳と実行経路の確定であり、新規remote試験を起動しない。全工程未成立、科学seed消費0・科学leaseなし・科学実行未認可を維持する。

> 2026-10-17の親監督調査: [固定runnerソースと既存jobの照合](runner-topology-20261017/README.md)で、開始hook・job containerより前のActions取得と内部retry経路を確認した。hookの追加だけの方式を除外し、runner起動前からの親監督を設計候補とする。専用環境は未確認で、全工程未成立・科学seed消費0・科学leaseなし・科学実行未認可を維持する。

> 2026-10-17の再開監査: PR #208までの保存証拠を再検算し、[全工程の計測範囲と次の実装条件](lifecycle-review-20261017/README.md)を整理した。外側準備とartifact保全の親監督が未成立で、全工程の測定値は未確定である。次は初回準備より前から動く監督環境の実装可能性確認とし、成功済み取引を反復しない。科学seed消費0・科学leaseなし・BEFCSと正式関係の未登録/未実行を維持する。

> 2026-10-16の最新状態: [固定code取得と封印原image全体の外部保存](befcs-capsule-20261016/README.md)を検証し、1,266ファイルと通常/ACK抑止の両原imageを独立復元した。ACK抑止は未ACKのまま保持する。外側起動・封印後制御記録・最終科学input等は未完で、科学seed消費0・未登録/未実行を維持する。[現在の完了判定表](befcs-capsule-20261016/COMPLETION_GATES.md)を参照する。以下の追補は各段階時点の履歴である。

> 2026-10-16の[統合fixture](befcs-integrated-20261016/README.md)で有限image内の初回技術input取得・work・停止診断の外部保存を接続し、3 caseの原imageを独立検算した。科学code全体の取得・完全原証拠の外部保存は未成立。残りは[完了判定表](befcs-integrated-20261016/COMPLETION_GATES.md)に固定する。

> [有限imageの物理容量検証](befcs-capacity-20261015/README.md)で通常・ENOSPCの2 caseと予約解放後の停止保存がActions合格し、原imageを独立検算した。外部保存経路との結合と外側起動処理は未完で、全工程の成立は未認定である。

> [同一scopeの外部保存](befcs-external-20261015/README.md)は、固定技術データで通常・ACK抑止の2 caseをActions実行し、原ZIP・remote内容・未ACKを独立検算した。外側bootstrap・物理領域hard cap・Actions uploadを含む全工程の成立は未認定で、科学seed消費0を維持する。

> 全起動・保存の[監督台帳](befcs-lifecycle-20261015/README.md)を既知fixtureで検証した。単一時計・全役割計数・保存ACKの10検査は合格したが、専用unitの実OS 3 caseはActionsで合格し原ZIPを独立検算した。外側bootstrap・外部保存を含む全工程の成立は未認定である。

> 2026-10-15の再開監査: [保存済みG5-05の重複除外監査](resume-audit-20261015/README.md)で採用35代表・8候補の選定差0件を確認した。凍結契約は先行候補rootだけを追加する規則であり、元実装の不足という当初の解釈を撤回した。原実行を繰り返さない。現在checkoutの保存監査には[現在用の手順](../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使う。BEFCSと正式関係は未登録・未実行である。

> 2026-10-15の現在案内: 終了済み5 Studyと第3版の取得後検算は[PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205)でmainへ統合済みです。[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)、[中間保存](checkpoint-20261014/README.md)、[再開位置](RESUME_HERE.md)を参照してください。第五世代全体は継続中で、BEFCSと正式関係は未登録・未実行です。以下の日時付き記録と計画本文は各時点の履歴として保持します。

更新日: 2026-10-15（日本時間）

## 終了済み供給研究の保存記録

G5-01〜G5-05の5区画は消費済みである。下記は保存済みbyteの再照合先であり、source生成や同一区画の再実行手順ではない。原契約・manifest・結果のhashを現在の文書へ付け直さない。

| 工程 | 原結果・独立検算 | 再現性と固定入力 |
| --- | --- | --- |
| G5-01 | [原結果](g5-01/development/results/RESULT.json)・[独立検算](g5-01/development/results/VERIFICATION.json) | [固定入力](g5-01/development/SOURCE_MANIFEST.json)・以下のStage 1案内 |
| G5-02 | [原結果](g5-02/results/RESULT.json)・[独立検算](g5-02/results/VERIFICATION.json) | [再現性](g5-02/REPRODUCIBILITY.md)・[固定入力](g5-02/SOURCE_MANIFEST.json) |
| G5-03 | [原結果](g5-03/results/RESULT.json)・[独立検算](g5-03/results/VERIFICATION.json) | [再現性](g5-03/REPRODUCIBILITY.md)・[固定入力](g5-03/SOURCE_MANIFEST.json) |
| G5-04 | [原結果](g5-04/results/RESULT.json)・[独立検算](g5-04/results/VERIFICATION.json) | [再現性](g5-04/REPRODUCIBILITY.md)・[固定入力](g5-04/SOURCE_MANIFEST.json) |
| G5-05 | [原結果](g5-05/results/RESULT.json)・[独立検算](g5-05/results/VERIFICATION.json) | [再現性](g5-05/REPRODUCIBILITY.md)・[固定入力](g5-05/SOURCE_MANIFEST.json) |

第3版の5原ZIP・3,361 fileと二経路検算は[中間保存](checkpoint-20261014/README.md)を参照する。現在checkoutからの保存監査は[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)に記載した新しい入口を使う。旧監査器と旧bindingはPR #205時点の固定記録として保持する。

## G5-01 Stage 0の再現資料

- [技術契約](g5-01/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/STAGE_0_SPEC.json)。
- [実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)・[技術認可](g5-01/STAGE_0_AUTHORIZATION.json)。
- [使用ソースのbyte hash](g5-01/SOURCE_MANIFEST.json)。
- [測定結果](g5-01/results/stage-0/result.json)・[Python検算](g5-01/results/stage-0/verification.json)。
- [Actions来歴](g5-01/results/stage-0/CI_RECEIPT.json)・[技術検証報告](g5-01/STAGE_0_REPORT.md)。
- [実行コマンドとツールの範囲](../../tools/research/g5-01/README.md)。

実行前固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`。ソースmanifestを照合してから、別のローカル出力先で技術fixtureを再現する。core hashから所要時間・メモリ・環境来歴は分離してある。

保存済み結果の検算は次で実行する。これは新規科学的seedを使用しない。

```bash
python3 tools/research/g5-01/verify.py doc/research-generation-5/g5-01/results/stage-0/result.json
```

Stage 0完了時点では、新規局面、科学的seed、正式標本、正式検定の成果物は存在しなかった。

## 独立遷移の技術検証

実行前固定コミットは `ec2607dfc4a09b62d2aaa56f75740f9f551992e4`。

- [技術契約](g5-01/transition/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/transition/SPEC.json)・[ソース固定](g5-01/transition/SOURCE_MANIFEST.json)・[実行範囲](g5-01/transition/AUTHORIZATION.json)。
- [測定結果](g5-01/transition/results/result.json)・[Actions来歴](g5-01/transition/results/CI_RECEIPT.json)・[検証報告](g5-01/transition/REPORT.md)。
- [ツールと再現コマンド](../../tools/research/g5-01/transition/README.md)。

独立実装は依存モジュールをimportしない。固定fixture上の再測定は技術作業であり、割当済みの開発区画を使用しない。

## Stage 1開発診断

- [固定契約](g5-01/development/CONTRACT.md)・[機械用契約](g5-01/development/SPEC.json)・[ソース固定](g5-01/development/SOURCE_MANIFEST.json)・[認可](g5-01/development/AUTHORIZATION.json)。
- [run・lease・mirrorの来歴](g5-01/development/results/CI_RECEIPT.json)。
- [実行要約](g5-01/development/results/RESULT.json)・[圧縮生記録](g5-01/development/results/EVIDENCE.json.gz)・[独立検算](g5-01/development/results/VERIFICATION.json)。
- [消費journal](g5-01/development/results/SEED_READS.jsonl)・[候補固定](g5-01/development/results/CANDIDATES_FROZEN.json)。
- [供給診断](g5-01/development/results/SUPPLY_DIAGNOSTIC.json)・[診断報告](g5-01/development/REPORT.md)。

保存済み記録の検算と事後診断は、sourceを生成し直さず次で行う。実行時の32 seed区画は再使用しない。

```bash
node tools/research/g5-01/development/verify.cjs doc/research-generation-5/g5-01/development/results
node tools/research/g5-01/development/diagnose-supply.cjs doc/research-generation-5/g5-01/development/results
```

G5-01 Stage 1終了時点では開発source記録は存在したが、新規閉包・厳密解・正式関係検定の成果物は存在しなかった。その後に保存したG5-03・G5-04の完全閉包と現在状態は、上記の供給研究一覧と[現在状態](CURRENT_STATUS.md)を参照する。


## 2026-10-13の全閉包BFS統合検証

[全閉包統合](bfs-integration-20261013/README.md)で、科学用遷移と可逆RAW保存を固定fixtureのBFSへ統合した。既知Baoの3状態・2辺と固定抽象例で全合法手・全辺・独立解・snapshot/journal復元が一致した。未知・停止証拠・未展開境界・各辺metadataを保持した。[報告](bfs-integration-20261013/REPORT.md)に9テスト、全10 fixture、保存量と全測定を示す。

1024状態の抽象例でjournal込み保存は4363460から3988337 byteとなったが、科学BFSの資源改善や新規完全領域を確認した結果ではない。初回RSSの全同値も保持し、Linux補助計測を別契約で保存した。新規科学source/seed/候補・旧witness延長は0件である。

保守的遮断は103355 RAW識別となった。全閉包要件と正式関係未登録/未実行を保ち、次は[別Studyの登録条件](bfs-integration-20261013/RESUME_HERE.md)を具体化する。旧区画を救済・補充せず、技術合格から科学sourceを自動起動しない。main・公開AIは未変更である。


## 2026-10-13 — 分岐包絡による新しい供給Studyの設計案

[BEFCS-STUDY1提案](branch-envelope-20261013/README.md)は、G5-05のroot・27代表・seedを延長しない新しい有限開発案である。fresh trajectoryで最初の適格rootを選び、各root子の応手数合計を16以下に事前制限する。提案seed範囲`50613001..50613128`は空き照合のみで、未予約・未消費。10k状態/128k辺/180秒、全体20分・1 GiB・256 MiBと保存reserveを提示するが、新規Baoの完全閉包量や供給成功を保証しない。

状態はPROPOSAL-NOT-REGISTRATION-NOT-EXECUTEDで、seed消費0・leaseなし・source未固定・実行未認可。次は別source実装とfixture preflight、独立候補/閉包検算、保存上限testを行い、条件が揃うまで区画を開始しない。固定有限コーパスにIID/一般局面の推論を適用せず、主要関係は未登録・未実行、DTFへ差し替えない。旧記録、main、公開AIを保持する。


## 2026-10-13 — 分岐包絡供給のsource・保存fixture技術合格

[技術preflight](branch-envelope-preflight-20261013/README.md)で、第一適格root、全2-ply screen、独立source/edge再生、予約域付きjournal/snapshotとgzip分割を実装した。22新テストと先行BFS 9テスト、10 source/7 closure fixture、17 bundleが合格した。実容量256 MiB・16 MiB reserve、48 MiB以下・最大6片の復元を検査した。観測532 RAWは全て既読で、保守的遮断は103355識別のまま、555保護入力のbytesを保持した。

科学source/seed/候補・旧root/witness延長・正式推論は0件である。BEFCS-STUDY1は未登録・未実行、leaseなし、科学source未固定、実行未認可。次は科学用SPEC/契約/認可範囲と全区画lease・読取前consume・attempt 1固定の別trigger・常時保存/mirrorを具体化する。fixture技術合格から科学sourceを起動せず、全閉包と未知の保持、不足時終了、追加/差替え/retry禁止を維持する。main・公開AIは未変更である。

## 2026-10-13 — 一度限り運用のfixture検証

[運用preflight](befcs-operations-20261013/README.md)で、Gitの原子的全区画取得・読取前marker・稼働中/終了mirror・合算RSS監督を実装した。15運用テストと31先行回帰テストが合格し、1区画・128論理marker・8 mirror・137 commitを保存Git bundleから独立復元した。科学PRNGの初期化は0件で、新規Bao RAWは観測していない。実128 MiB/1 GiB cgroupはActions確認待ちである。

[科学契約案](befcs-operations-20261013/CONTRACT_DRAFT.md)は未登録案で、次は科学source/独立replay・全閉包保存とcontainer/mirrorの全workload結合、最終freeze・CI receipt・別triggerを整える。584保護入力と103355件遮断を保持し、科学seed消費0・科学leaseなし・科学Study未登録/未実行、正式関係未登録/未実行、main・公開AI未変更である。技術合格を科学供給へ昇格させない。

## 2026-10-13 — 運用cgroupの確認と保存済み全workloadの結合

[運用cgroup確認](befcs-operations-20261013/CI_CONFIRMATION.md)をPR #192へ保存し、実128 MiB/1 GiBのOOMとprefix保持が合格した。[全workload統合](befcs-workload-20261013/README.md)で保存済み技術source 128件・固定抽象閉包8件を共有保存予算、marker、mirror、停止監督へ結合した。58ローカルテスト・8シナリオと実256 MiB容量境界が合格した。科学生成の費用・供給結果へ昇格させず、実1 GiBの全pipeline CIと科学用hostの結合・最終freeze・別triggerは[再開条件](befcs-workload-20261013/RESUME_HERE.md)に残す。科学seed消費0・科学leaseなし・科学Study未登録/未実行、103355件遮断、正式関係未登録/未実行、main・公開AI未変更である。

## 第2版の全workload実cgroup確認完了

[CI確定](befcs-workload-20261013/CI_CONFIRMATION_V2.md)でpush/PRの全stepと同一headの15 runが成功した。旧failureを保持し、実1 GiBの8固定シナリオ、256 MiB共有容量、UID/GID対応後の後片付けとartifact保存を確認した。現行は第2版16入力・623保護入力を固定する。次は科学用host/registry/別triggerの接続と最終科学事前固定であり、科学seed消費0・科学leaseなし・未登録/未実行、103355件遮断、正式関係未登録/未実行、main・公開AI未変更を保つ。
