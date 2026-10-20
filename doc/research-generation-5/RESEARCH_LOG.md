# 第五世代研究 — 研究ログ

> 2026-10-20のshell経路監査: [job開始前の通信retry](runner-topology-20261017/shell-route-20261020/README.md)を通常・Broker両listenerで確認した。shell中心化・単一job・attempt 1だけでは初回通信失敗時のretry拒否は成立しない。次は追加の失敗即停止制御の設計レビューで、配備や新規remote試験を行わない。全工程未成立・科学seed0・leaseなし・未認可を維持する。

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

## 2026-10-12 — 最初の技術工程へ着手

ユーザーから第五世代研究へ着手して工程を進める指示を受けた。main `6decdd2bb3979d96420e4da6ff4592be70c8d6c4`、Program計画、再開位置、第四世代の終了判断、現行ルール、文書品質規則を照合した。既存の第五世代研究PRはないことを確認した。

`research/g5-01-measurement-readiness` に隔離し、G5-01 / `RRSVL-STUDY1` のStage 0を具体化した。現行takasiaルールのRAW識別、nyumbaの全選択肢、順位変動と勝敗価値損失、同価値内DTF、未解決再帰の分離を定めた。

既知fixture・人工グラフだけを使うソースと技術契約を固定し、実行前にGitHubへ記録する。新規の科学的seed読取、正式局面生成、G4の保護証拠へのアクセス、公開資産の変更は行わない。

## 2026-10-12 — Stage 0技術検証の完了

ソース・契約をコミット `885e3c4152b6979a70a20755c8bf064b8d4dd29c` で固定してから実行した。既知takasia25件、4局面×2深さ、10頂点人工グラフ・9意味確認、技術テスト7件が合格した。ローカルのtakasiaエンジン・AI回帰36件も合格した。

Actions run `38229687584` / attempt 1はsuccessであり、測定とPython検算のcore hashがローカルと一致した。結果と来歴を保存し、[技術検証報告](g5-01/STAGE_0_REPORT.md)と[次工程の設計事項](g5-01/NEXT_STAGE_DESIGN.md)を整備した。新規の科学的証拠はまだ使用していない。

## 2026-10-12 — 独立遷移の技術検証と開発診断設計

工程2への継続指示を受け、現行ルールを呼び出さない独立エンジンを作成した。ソースと技術契約をコミット `ec2607dfc4a09b62d2aaa56f75740f9f551992e4` で固定してから、既知・構成40局面と相対深さ2を照合した。416状態・411辺で全合法手・子状態が一致し、6技術テストと15分類のcoverageが合格した。Actions run `38231679692` / attempt 1もsuccessで、ローカルとのcore一致を確認した。

[独立遷移報告](g5-01/transition/REPORT.md)と[開発診断設計](g5-01/DEVELOPMENT_PLAN.md)を記録した。新規sourceは最大32対局、候補は最大8、1閉包の上限は5,000状態・50,000辺・60秒という案を具体化した。科学的seed・leaseは未発行で、新規証拠の実行は開始していない。

## 2026-10-12 — Stage 1の開発診断完了・候補供給なし

継続指示に基づき、実行契約とソースをコミット `cb5d9168bf9b0f5ee5722ec82194c64328b39a87` で固定した。技術前確認5件とActionsの前確認が合格した後、trigger `518453bba351c2494287ca722f9f987663884993` を登録した。

Actions run `38234120711` / attempt 1はdurable leaseをseed読取前に保存し、`50112001..50112032` の32 sourceを一度だけ生成した。sourceの独立再生は32/32合格、候補は0件、完全閉包の試行は0件だった。実行・独立検算・artifact保存・研究ブランチへの保存はsuccessであり、証拠mirror commitは `f9d66df5998dd0be8570c2d855dcb89cd45c1bae`。

保存済み記録の事後診断では、合法手幅までの条件を通過した23 sourceの311状態がすべて占有穴数12以下を満たさず、最小値は16だった。[報告](g5-01/development/REPORT.md)に意味と限界を保存した。新しいsource・候補・閉包は生成せず、元の選定・結果も変更していない。

本Stage 1 v1の区画を消費済みで閉じる。正式な順位変動・損失の関係は未実施であり、新しい独立Studyによる解析領域の供給設計を次の検討事項とする。同一区画の再実行、seed追加、条件緩和による再選定は認可しない。

## 2026-10-12 — G5-02の供給診断を事前固定

G5-01区画終了後の継続指示を受け、独立した `RECSF-STUDY1` の契約・認可・新規区画50212001..50212032を準備した。占有穴数の代理指標を廃し、幅2〜4の最初の適格rootから最大8候補を結果前固定する。旧2094読取との重複は解を付けず終了し、上限到達時の未収容子状態も保存する。fixture限定の新8テストと旧11テストが合格した。新規科学区画は未読で、Actions前確認合格後に1回の供給診断へ進む。

## 2026-10-12 — G5-02供給診断の完了と区画終了

Actions38237119716 / attempt 1で新規32 sourceを生成し、16適格rootの最初の8候補を事前固定して解析した。全8候補が状態5000上限に達し完全閉包供給0件。32 sourceと40282辺の独立照合は合格し、原証拠をc6d6a40cd1a1539b28219d57bffe54c5ce776fb2で保存した。保存グラフ記述ではroot占有21〜24、保存部分辺の距離7〜9だった。これは完全展開深さではない。区画を消費済みで閉じ、正式関係検証は未承認・未実施とする。次は別Studyの供給戦略・資源設計であり、同候補の延長解析や未試行候補の補充はしない。

## 2026-10-12 — G5-03の構造供給完了

[G5-03](g5-03/README.md) / `BTCS-STUDY1` の[固定契約](g5-03/CONTRACT.md)に基づき、新規64 sourceを一度だけ実行した。全合法分岐が2手以内に自然終局する10適格rootの最初の8候補で、完全閉包・厳密解を取得した。各3〜12状態・合計45状態37辺で、全解が独立一致した。Actions run `38239145152` / attempt 1とローカル再検算が合格し、原証拠を `8e4090020bd474e7d8ae7a2d40c19a2d14c8c02c` で保存した。

ただし全8 root内の全23合法手は同じ勝敗価値・DTFだった。特殊層での供給成功と、価値損失の変動事例が得られなかったことを分けて保持する。[最終報告](g5-03/REPORT.md)、[再現性](g5-03/REPRODUCIBILITY.md)、[研究ログ](g5-03/RESEARCH_LOG.md)、[再開位置](g5-03/RESUME_HERE.md)を参照する。

3 Studyの区画はすべて消費済みで、既読和集合は47483 RAW識別。次は別の新規Studyで小さな完全閉包の構造と推定可能性を設計し、今回のrootを深さ拡大・価値差選定で救済しない。正式関係検証は未承認・未実施で、mainと公開AIは未変更。PR #183はPR #182の研究ブランチを基底とするdraftである。

## 2026-10-12 — G5-04の供給完了とDTF差

[G5-04](g5-04/README.md) / `MTCS-STUDY1` の[契約](g5-04/CONTRACT.md)を固定し、新規128 sourceを一度だけ実行した。全分岐4手以内自然終局・2手以内未閉包の9適格rootの最初の8候補で完全閉包を得た。合計169状態162辺と全解が独立一致し、Actions run `38263687093` / attempt 1とローカル再検算が合格した。原証拠は `6a103cf4f55ec9e7ec84cf31f6d878fae3fb3ef4` で保存した。

全8 rootの勝敗価値はroot内で同じだが、3 rootにDTF差がある。同価値内の手数差を勝敗価値損失の変動例にしない。[最終報告](g5-04/REPORT.md)、[再現性](g5-04/REPRODUCIBILITY.md)、[研究ログ](g5-04/RESEARCH_LOG.md)、[再開位置](g5-04/RESUME_HERE.md)を参照する。探索条件間の順位比較・正式関係検証は未承認・未実施である。

4 Studyの区画はすべて消費済みで、既読和集合は58532 RAW識別。次は達成済みの解析基盤・供給・DTF差記述と未確保の勝敗価値差事例を分離し、追加実行前に正式検証の対象・最低条件と供給戦略を再評価する。今回のrootの延長・価値差による入替え・9番目の追加解析は行わない。draft PR #184はPR #183を基底とし、main・公開AIは未変更である。

## 2026-10-12開始 — 主要関係の準備再評価

[準備再評価](readiness-review-20261012/README.md)で終了済み4 Studyの256 source・消費・ソース・原検算記録を再監査し、全検算が同じバイトで一致した。16完全領域の214状態、84非終局・67複数手局面に手間勝敗価値差は0件だった。内部のDTF差は6件で元のroot3件を含むが、新しい候補として採用していない。

判断は `PRIMARY-READINESS-NOT-MET`。開発上の準備判断で、正式な仮説否定やNON-ESTIMABLEではない。新規seed・再選定・探索比較・正式検定は0件。主要指標をDTFへ差し替えない。[設計案](readiness-review-20261012/DESIGN_PROPOSAL.md)で対象・指標・情報量・samplingと条件付き精度を分離し、[再開位置](readiness-review-20261012/RESUME_HERE.md)で新しい供給方策と確率モデルを具体化する。93単位ずつという精度案は条件付き提案で、正式登録や実行認可ではない。main・公開AIは未変更である。

## 2026-10-13 — 応手種別による新しい供給設計

[供給設計](source-design-20261013/README.md)で、root手によって相手の捕獲手とtakataの応手集合に分かれる非終局構造層を具体化した。全軌跡の最後の構造適格rootを閉包前に固定する案で、着手の擬似乱数方策を保持する。旧部分グラフ内に284構造適格nodeがあったが、全て未完領域にあり、勝敗価値差・完全閉包供給・費用は未確認である。

状態はSOURCE-DESIGN-SPECIFIED-NOT-EXECUTED。構造判定の7fixtureと保存監査の再生が合格した。新規source・遷移・候補再選定・正式推論は0件。[設計](source-design-20261013/DESIGN.md)で64 source・8候補・資源・有限開発コーパスの記述対象を具体化し、[再開位置](source-design-20261013/RESUME_HERE.md)に実装・新規契約・未使用区画・一度限り実行の条件を残した。主要関係はPRIMARY-READINESS-NOT-MET、正式比較は未登録・未実行のままで、main・公開AIは未変更である。

## 2026-10-13 — G5-05の応手種別供給を事前固定

[G5-05](g5-05/README.md) / MRCS-STUDY1は、全軌跡最後の応手種別分岐rootを新規64 sourceから最大8候補へ固定する開発供給である。[契約](g5-05/CONTRACT.md)で旧58532状態遮断、全合法手閉包・独立再生、資源・読取journal・一度限り消費と不足時の終了を固定した。12技術fixtureがローカルで合格し、ソース固定・Actions技術CIの後、別triggerと永続leaseにより実行する。

正式関係は未登録・未実行、対象は固定有限開発コーパスである。IIDや93ずつの精度案を適用せず、DTFを主課題へ差し替えない。原記録・main・公開AIを保持する。[再開位置](g5-05/RESUME_HERE.md)を参照する。

## 2026-10-13 — G5-05の終了・構造差供給と全閉包未供給

[G5-05報告](g5-05/REPORT.md)で、新規64 sourceを一度だけ実行した結果を確定した。35構造適格代表の最初の8候補を固定して解析し、6領域は5000状態上限、2領域は別の合法枝のruntime guardで停止した。完全閉包0件で、8候補の勝敗価値差は未確定である。全64 source・513 screen・39354保存辺の独立検算と保存は合格した。原証拠は5cfe0f00629f65995a2d6be5889cebbe68bb8940、Actionsは38313556402 / attempt 1で保持する。

5区画は全て消費済み、既読和集合は101691 RAW識別となった。構造差の供給と全解析未達を区別し、guardを自然敗北・無限反復へ変換しない。追加source・未解析27代表の補充・旧root延長・状態上限引上げ・retryをしない。次は[科学用遷移と解析方式の再評価](g5-05/NEXT_RESEARCH.md)を先に行い、新しい区画を自動追加しない。正式関係は未登録・未実行、main・公開AIは未変更である。

## 2026-10-13 — 科学用遷移・可逆保存の技術再評価

[方法再評価](method-review-20261013/README.md)で、runtime上限による勝者付与を外した研究用遷移の二実装を確認した。既知40fixtureの416状態・411遷移と全microstate列が一致し、上限1の技術例では自然停止する5手のruntime勝者と科学的未知を分離した。G5-05の実際のguard witnessを延長した結果ではない。

422技術境界RAWの独立二codecは復号/旧RAW hashが一致し、符号化payloadは104660から13926 byteとなった。科学BFSの実資源改善は未測定である。[方法選択](method-review-20261013/METHOD_DECISION.md)はguard-free遷移と可逆保存を全閉包BFSへ統合する技術検証を優先し、抽象戦略証明の採用は現行Programの全閉包要件との適合レビューへ留保する。新規科学sourceは0件、全閉包要件は保持する。

旧101691状態と新技術RAW射影を合わせた保守的遮断集合は102329識別となる。中間状態を新候補・到達性証拠へ昇格させず、旧5区画・原記録を保持する。正式関係は未登録・未実行、main・公開AIは未変更。[再開位置](method-review-20261013/RESUME_HERE.md)を参照する。


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

## 2026-10-14 — 第3版の確定と中間保存

ユーザーの指示に基づき、科学実行前の現在状態を記録してmain統合対象へ整理した。head a5014f79の第3版5原ZIP・3,361 file・Git/ACK/source/停止記録を二経路で独立照合し、原CI metadataと6 decoded job logを保存した。旧10原artifact・失敗3件・期限後回収・最終mirror未完を保持する。現在コードの技術テスト218件は全合格。旧manifestのhashを付け直さず、旧技術CIは凍結入力コミット、現在treeは専用checkpoint CIで検査する。BEFCS科学seed消費0・科学leaseなし・未登録/未実行、正式関係未登録/未実行を維持し、公開ゲーム・AI・Workerは統合前mainと同じである。統合の実際の完了はPRのmerge記録で確認する。

## 2026-10-15 — 中間保存のmain統合と現在案内の照合

[PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205)を00:11:54（日本時間）にmainへ統合した。統合コミット44d7dafと固定tree、統合前32成功・対象外1スキップ、統合後の保存監査と旧研究整合性CIの成功を[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)へ整理する。G5-01〜G5-05の結果、科学seed消費と未実行境界、原証拠・旧失敗を保持する。

ユーザーの文書監査指示に基づき、中央索引のG5-01時点の要約、アジェンダの進捗一覧、再現性索引の未追加だった供給研究と「現在は閉包なし」の説明を更新する。旧checkpointの案内hashと原監査器を保持し、統合時の文書は固定コミット、現在案内は更新可能な入口で照合する。新規科学実行や正式判断の変更は伴わない。
