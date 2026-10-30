# Linux x64の通信・権限境界の設計案

## 今回確認したことと停止点

2026-10-30（日本時間）、main `2f07b50365f6b546b4c3702f1cf8809a82c2e335`、tree `8d5cdc1b75739f718bd11bc7dbde311a8fc3b8e6`と保存資料を照合した。未統合PRと作業開始時のローカル差分はなかった。対象をLinux x64へ絞れるが、実装へ進める経路はまだ確定していない。

本書は未配備の設計案である。runnerのsource改変・build・登録・実行、新規remote結合試験、科学実行を開始しない。WSLへの変更も行わない。既存の[部分台帳](client-map-20261020/README.md)と[要求guard設計](fail-first-20261020/README.md)を保持し、以下を実装前レビューの対象とする。

## ユーザーWSLの再観察

値はユーザーが会話へ貼り付けた出力の転記で、直接操作、署名付き原出力、独立観察ではない。観察時刻の詳細は未共有であり、過去の容量観察やChatGPT側hostと混ぜない。

| 読取項目 | 共有出力 |
| --- | --- |
| uname -m | x86_64 |
| uname -r | 6.18.54.1-microsoft-standard-WSL2 |
| systemctl is-system-running | running |
| user@1000.serviceのActiveState / Delegate | active / yes |
| ControlGroup | /user.slice/user-1000.slice/user@1000.service |
| 委任先cgroup.controllers | cpu memory pids |
| 委任先cgroup.subtree_control | cpu memory pids |
| 委任先memory.max / memory.swap.max | max / max |

この階層自体には有限上限がない。祖先階層の制限や、将来の親scopeで1 GiB・swap無効が強制されることは未確認である。今回、書込可能性の再試験、swap構成、実行fileの再採寸はしていない。初期観察はここで止め、方式確定後に必要な項目だけを確認する。

## guard差込みの設計単位

固定runnerソースは`397b032cbf865e9c3ddfab89d533ec19325e1273`である。817 C#ファイルの32ファイル・72構文一致は部分索引であり、全clientや通信回数ではない。

| 系統 | 設計する変更の境界 | 実装前に必要な確認 |
| --- | --- | --- |
| T01 共通factory | transport生成とguard付き送信経路を区別する。具体型HttpClientHandlerを設定するcallerを列挙する | interface変更、proxy・証明書・credential設定の適用先、直接生成の残存 |
| T02 Vss / T03 Raw | 認証loopの各送信より内側で許可を消費する。既定constructorと明示transportの両方を管理する | 内側handlerを辿る設定処理を維持できるか、全overload・派生生成の到達性 |
| T04 OAuth | token取得も同じ取引台帳に含める | 独自transportとretryの置換範囲、秘密を記録しない照合方法 |
| T05 直接pipeline | 再生成を含め、T01〜T04と同じ送信境界へ集約する | plugin・終了報告・保存を含む全callerと未分類経路 |
| T06 非HTTP | DAP・WebSocket・VSockの有効化条件を分類する | 不使用機能を起動時とOS境界で拒否できるか。HTTP guardで網羅した扱いにしない |
| T07 子process | Git・Node・shell等の直接通信を拒否し、必要な取引だけを明示したIPCへ渡す案を比較する | Git転送等の既存protocolをHTTP取引へ単純置換できると仮定しない。保存・認証・来歴の適合 |

外側handlerの追加だけでは内側の再送を止めたことにならない。許可消費、送信、body検算、完了通知、最初の失敗による停止を一つの順序へ結び付ける。失敗後は通常許可を閉じ、事前固定した保存専用許可だけを別管理する。保存失敗・応答不明では再送せず、remote分の容量予約も戻さない。

## 同じプロセス内のguardだけでは残る権限問題

runnerと子processへ同じ直接通信権限を与え、source上の約束だけでguardを強制する案は採用しない。親cgroupの継承は通信経路の制限ではない。runner自身の別clientや子のsocket送信をOS境界で拒否する必要がある。

比較対象は、送信権限を専用主体へ分離し、runner/work側には限定IPCのみを許す方式である。これは新たな通信仲介実装の候補であり、TLS終端proxyの採用ではない。source guardが同じprocessで直接送信する案との接続方法が未確定なので、方式成立と認定しない。

| 主体 | 許す役割の案 | 閉じる経路と未確定点 |
| --- | --- | --- |
| OS管理機構 | 初回起動前の制限設定と期限時の強制停止 | 専用system unit等の具体設定、信頼基盤の範囲、終了証拠を未確定のまま除外しない |
| 親監督 | 同一予算内の時計・取引許可・停止状態・容量予約 | runner/workからの制限変更、停止状態の解除、許可の偽造を拒否する権限配置 |
| 通信主体 | 消費済み許可に対応する送信と応答処理 | 専用主体でも下位transportの自動再送は別途監査。通常通信と保存用通信の権限を分ける |
| runner/work | 単一jobの受理と固定処理、限定IPC | 外向きsocket、継承socket、別namespace、sudo、manager socket、外部daemon、cgroup書込を拒否する具体策 |
| 保存処理 | 固定prefixの圧縮・保存・receipt照合 | 全子停止後の計数外uploaderを作らず、最終記録を誰が閉じるかを固定する |

network namespaceやsocket制限は比較候補で、WSL kernelでの利用可能性・強制・迂回拒否は未検証である。環境変数のproxy指定、NoNewPrivileges、別UIDのどれか一つだけを保証にしない。IPCはpeer認証、許可IDの原子的消費、対象・phase・byte上限、キャンセル、guard故障時の閉鎖を必要とする。認証値・token・body中の秘密は監査記録へ出さない。

## runtimeと容量の固定順序

architectureの確認はruntime版や依存集合の確定ではない。.NET、System.Net.Http、native TLS・名前解決・共有libraryを含む実入力を固定し、そのソースとbinaryの対応、redirect・認証challenge・接続切断時の再送を調べる。runner版表示だけでbinary一致としない。

1. shell中心のworkflowから暗黙処理・内部Node・plugin・終了報告まで到達経路を確定する。
2. runner、科学処理、通信主体それぞれのruntimeと依存fileを列挙し、hash・論理量・割当量を区別する。build来歴の設計と実際のbuildを区別する。
3. 下位transportの無再送を保証できなければ、既定設定変更だけで先へ進まず、経路を成立不足とする。
4. 全input・cache・log・tmp・圧縮物・remote object・最終receiptの同時存在を時系列で計数する。通信主体や隔離用codeの費用も含める。

標準Linux x64 runner全体の通常file論理量679562451 byteは256 MiBを超える。通常展開案の除外を維持し、WSL自体の不採用とはしない。単一runtimeの仮定による既存の部品和250844197 byteも、残額を利用可能量としない。新しい通信主体・依存物の容量は未測定で、削減成功や実行可能性を主張しない。

## 必要になり得る変更と実施前の停止条件

専用の非管理主体、system側の親制限、通信境界、書込先の限定が必要になり得る。それぞれの設定内容、影響、入力費用、復旧・後片付けを設計してから実機操作を案内する。今はアカウント・unit作成、mount、cgroup/network/証明書変更、導入、WSL更新・再起動を行わない。

次の静的調査は、T01〜T05のcallerと設定適用先、および対象runtimeの固定資料の確認である。全client列挙、迂回禁止、下位transport、全容量、単一job受理、最終保存receiptの未確定欄が閉じるまで、runner改変・build・登録・実行や新規remote結合試験へ進まない。既知データ試験の契約化も経路確定後とする。

## 維持する境界と検証

20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiBを維持する。全工程成立後にも、科学reference API・固定初期状態・独立source再生・全合法手完全閉包・途中closure/microstate停止証拠、最終SPEC・CONTRACT・AUTHORIZATION・入力hash・保護集合・CI receipt・実行前レビュー・科学専用triggerの固定が残る。

第五世代研究は継続中、主要準備未成立は仮説否定ではない。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・科学実行未認可、wholeLifecycleOsProvenはfalseを保持する。103355件遮断、未知、固定有限開発コーパス、G5-05の先行候補rootだけを追加する規則と採用35代表・8候補の選定差0件を保持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128を読取・生成せず、旧区画再実行、旧root/witness延長、source追加、候補差替え、上限増加、救済的retry、成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更しない。

保存監査は[現在用手順](../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)と[client台帳の照合](client-map-20261020/README.md)を使う。hash監査は完全な独立再検算と区別する。今回の文書追補で旧manifest・固定結果・原資料のhashを更新しない。ID・field・path・hash・command・転記出力は機械定義または原出力の例外で、説明と見出しは日本語である。CI・レビュー・統合の結果はPR記録を参照する。
