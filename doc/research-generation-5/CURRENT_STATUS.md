# 第五世代研究 — 現在の状態

> 採否判断の最新追補: [判断案](execution-contract-review-20261105/ADOPTION_DECISION_PROPOSAL.md)と[既知入力台帳](execution-contract-review-20261105/ADOPTION_INPUT_ENVELOPE.json)を作成した。P/M/R分割は採用推奨、既存保存clientの直接流用は不適合、raw読戻しと終端予算の予約・U_apiの保証範囲は修正案として提示する。最終入力と新契約の技術条件が未成立のため一括採用は推奨せず、正式採用・実装・新規試験・科学登録/実行へ進まない。BEFCS科学seed0・leaseなし・未認可、旧全工程未成立と実装移行停止を維持する。文書PRの統合も既存保存監査の不整合により保留する。

> 2026-11-05の契約再評価・工程改訂案: [再評価結果](execution-contract-review-20261105/README.md)と[完結までの工程案](execution-contract-review-20261105/REVISED_ROADMAP_DRAFT.md)を作成した。準備P・科学処理M・保全Rを別計数し総費用を併記する案を推奨するが、計数範囲の実質変更であり未採用である。今回の作業は再評価・工程組み直しまでで終了し、契約採用・実装・新規試験・科学実行へ進まない。既存実装移行停止・BEFCS科学seed0・未認可・旧全工程未成立を保持する。

> 2026-11-05の実装移行査定: [起動・保存候補の査定結果](runner-topology-20261017/readiness-decision-20261105/README.md)を記録した。今回の候補はIMPLEMENTATION-READINESS-NOT-METで、実装・配備への移行を停止する。WSL不採用・全方式の不可能性・研究終了を意味しない。再検討には初回ロードを含む具体的計数経路と、D/A/T/Eの有限な保全経路が必要であり、同じ観察・文書追加・成功取引の反復では代用しない。科学seed0・未認可を維持する。

> 2026-11-05のWSL観察受領: [現在値と起動・保存条件の再評価](runner-topology-20261017/host-observed-20261105/README.md)にユーザー貼付出力を保存した。x86_64・systemd稼働・委任を再確認したが、観察したローカルmaxやkill属性は制限・停止権限の証明ではない。初回ロード計数・最終証拠の保全は未解決、6gate未成立、科学seed0・未認可を維持する。追加の同じWSL観察は今は不要である。

> 2026-11-05の起動・保存順序検討: [停止専用FDと最終保存の候補](runner-topology-20261017/launcher-terminal-20261105/README.md)で、停止権限を事前openしたFDへ限定する案と、全子停止後にSが直接最終送信する案を比較した。kernelのnamespace拒否条件を確認したが、Lの初回ロード計数・最終ACK記録と親終了証拠の保全が未成立である。方式未採用・実行不可、科学seed0・未認可・全工程未成立を維持する。

> 2026-11-05の権限・停止設計: [役割分離と強制停止の条件](runner-topology-20261017/authority-stop-20261105/README.md)を追加した。system側制御・異なるUIDを優先候補とし、継承FD、子孫停止、監督喪失、最終保存の終端を整理した。launcher権限・全egress拒否・有限な保存終端・全peakは未成立で、方式採用・配備・新規remote結合試験へ進まない。科学seed0・未認可・全工程未成立を維持する。

> 2026-11-05のAPI境界確認: [Node20の限定API照合](runner-topology-20261017/work-api-20261105/README.md)を追加した。選択27記号を固定資料へ対応付け、同期Gitのtimeoutだけでは返却期限、現在processのRSSだけでは子孫込み制限を保証できないことを確認した。親監督・通信主体の権限と強制停止設計へ進むが、互換性・Node24除外・全工程は未認定、科学seed0・未認可を維持する。

> 2026-11-05の再開・binary照合: [配布Nodeの静的同一性](runner-topology-20261017/node-binary-20261105/README.md)でmainと保存資料の整合を再確認し、固定runner内Node20と公式v20.20.2 Linux x64の実体98932688 byte・SHA-256一致を確認した。work互換性・Node24除外・全工程成立は未認定。次は指定版APIとwork使用箇所の対応確認で、runner改変・build・実行、remote結合試験、科学実行は開始しない。

> 2026-10-31のNode20資料確認: [取得指定と限定API](runner-topology-20261017/node20-version-20261031/README.md)で固定runnerの取得指定20.20.2と、同版資料のstructuredClone/toReversedを確認した。配布binaryの版同定・work互換性は未成立で、Node24除外は未認定。原archiveの前回pathは欠落しており、再取得せず静的資料のみ保存。runner改変・build・実行、remote結合試験、科学実行は開始しない。

> 2026-10-31のwork依存・CAS確認: [4入口の静的索引](runner-topology-20261017/work-deps-20261031/README.md)に26ファイル・48 literal参照を保存した。完全依存解析やNode20互換性の証明ではない。Git仲介でも期待旧ref付きpushとreceipt後読取を維持し、次は同梱Node20の静的版特定。runner改変・build・実行、remote結合試験、科学実行は開始しない。

> 2026-10-31の候補経路台帳: [単一runtime仮説の候補](runner-topology-20261017/candidate-route-20261031/README.md)に取得・registry・保存・全子停止をまとめた。内部Node20とworkの共用は未証明の容量比較仮説で、Node24除外や方式採用は未認定。workflow/head/job等は未固定で、次は静的互換性とGit仲介の適合確認。runner改変・build・実行、remote結合試験、科学実行は開始しない。

> 2026-10-31の通信・容量照合: [既存通信経路と容量下限](runner-topology-20261017/protocol-scope-20261031/README.md)で、最終科学workflowの未固定、Git/Node/Actionsの別経路とpromisor追加取得の監査条件を確認した。複数runtime保持案の容量超過を保持し、次は実行不可の候補経路台帳を具体化する。runner改変・build・実行、remote結合試験、科学実行は開始しない。

> 2026-10-30の方式比較: [送信境界と設定移管](runner-topology-20261017/TRANSPORT_DECISION_20261030.md)で、別主体への移動だけでは内側retryが残ることを整理し、限定IPC・一度限りtransportの最小契約と設定移管を設計した。優先する静的調査候補で、方式採用・実装・全工程成立は未認定。全必要protocolと容量下限の確認へ進み、runner改変・build・実行、remote結合試験、科学実行は開始しない。

> 2026-10-30の配布runtime確認: [静的同定と内側retry](runner-topology-20261017/runtime-components-20261030/README.md)で固定x64配布物のJSONがruntimepack 8.0.30を示すことと、対応.NETソースの内部retryを確認した。binary/sourceの厳密対応と全経路は未証明。外側guardだけでは無再送を認定せず、runner改変・build・実行、remote結合試験、科学実行を開始しない。

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

> 2026-10-16の[統合fixture](befcs-integrated-20261016/README.md)で有限image内の初回技術input取得・work・停止診断の外部保存を接続し、3 caseの原imageを独立検算した。科学code全体の取得・完全原証拠の外部保存は未成立。残りは[完了判定表](befcs-integrated-20261016/COMPLETION_GATES.md)に固定する。

> [有限imageの物理容量検証](befcs-capacity-20261015/README.md)で通常・ENOSPCの2 caseと予約解放後の停止保存がActions合格し、原imageを独立検算した。外部保存経路との結合と外側起動処理は未完で、全工程の成立は未認定である。

> [同一scopeの外部保存](befcs-external-20261015/README.md)は、固定技術データで通常・ACK抑止の2 caseをActions実行し、原ZIP・remote内容・未ACKを独立検算した。外側bootstrap・物理領域hard cap・Actions uploadを含む全工程の成立は未認定で、科学seed消費0を維持する。

> 全起動・保存の[監督台帳](befcs-lifecycle-20261015/README.md)を既知fixtureで検証した。単一時計・全役割計数・保存ACKの10検査は合格したが、専用unitの実OS 3 caseはActionsで合格し原ZIPを独立検算した。外側bootstrap・外部保存を含む全工程の成立は未認定である。

> 2026-10-15の再開監査: [保存済みG5-05の重複除外監査](resume-audit-20261015/README.md)で採用35代表・8候補の選定差0件を確認した。凍結契約は先行候補rootだけを追加する規則であり、元実装の不足という当初の解釈を撤回した。原実行を繰り返さない。現在checkoutの保存監査には[現在用の手順](../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使う。BEFCSと正式関係は未登録・未実行である。

更新日: 2026-10-15（日本時間）
状態: **終了済み供給研究と技術検証を中間保存・main統合済み／第五世代全体は継続中**

## 確定した結果

G5-01〜G5-05は終了済みで、5区画320 sourceの消費と原結果を保持する。G5-03とG5-04の計16完全領域・214状態199辺は独立一致したが、手による勝敗価値差は0件である。G5-05の8候補は完全閉包未完で、価値差は未確定。主要関係の準備判断はPRIMARY-READINESS-NOT-METで、正式仮説の否定ではない。

最新の確定証拠は[中間保存](checkpoint-20261014/README.md)。PR #204のhead a5014f79を元に、第3版の5原ZIP・43,364,710 byte・3,361 fileとGit履歴・ACK・source・停止を二経路で検算した。元headの全13 CIがsuccessである。通常技術caseは128 sourceと抽象例1閉包を保存し、故障caseは未完を保持した。旧第1・第2版の10原artifactと失敗3件は変更していない。

## 未実行と未完の区別

| 対象 | 現在状態 |
| --- | --- |
| BEFCS-STUDY1 | 未登録・未実行。科学seed消費0・科学leaseなし |
| 正式な順位変動と勝敗価値損失の関係検証 | 未登録・未実行 |
| 全起動〜artifact保全の資源・単一時計 | 未完 |
| 科学API・初期状態・途中closure/microstateの統合 | 未完 |
| 最終SPEC/CONTRACT/AUTH/hash/review/科学trigger | 未完 |
| 公開ゲーム・公開AI・収集Worker | 統合前mainとbytes同一 |
| 第五世代全体 | 継続中。中間保存は全体終了ではない |

科学実行前の技術条件が未成立であり、この保存からsourceの生成や旧区画の再実行を行わない。次の安全な工程は[再開位置](RESUME_HERE.md)を参照する。

## 保存と統合

ユーザーの記録・main統合指示に基づき、元headと統合前main、原証拠、凍結入力、現在文書の変更範囲、旧技術CIの入力コミットを[統合範囲](checkpoint-20261014/INTEGRATION_SCOPE.json)に固定した。2026-10-15 00:11:54（日本時間）に[PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205)をmainへ統合した。統合コミットは[44d7daf](https://github.com/nkkmd/bao-la-kiswahili-game/commit/44d7dafefce100e636b86c66136a754e4fbef727)で、統合前CIは32成功・対象外1スキップ、統合後の保存監査と旧研究整合性CIも成功した。[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)に固定treeと確認方法を示す。旧文書の未統合表示は各記録作成時点の履歴である。

全閉包・未知・103355件遮断・不足時終了・救済禁止・主課題の勝敗価値損失を維持する。DTF差や技術fixtureを正式関係の証拠へ昇格しない。
