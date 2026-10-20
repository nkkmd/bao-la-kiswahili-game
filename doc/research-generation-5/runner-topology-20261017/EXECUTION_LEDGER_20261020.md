# 全工程の入力・容量・権限・通信台帳

## 現在の判断と次の読取

[WSL観察](WSL_PARENT_PLAN_20261020.md)の後、main `19b242b6a518d8d793d4fd2b2b411f38771287ec`で保存資料を読み、入力と経路を列挙した。判断は「候補経路の台帳化済み・容量と権限の実測待ち」である。専用環境や全工程成立を認定せず、科学実行を認可しない。未測定のbyteを0へ置換しない。

次に必要なのはユーザーのWSLにある選択実行fileの観察である。[専用観察器](../../../tools/research/g5-runner-topology/inventory-host.py)はPATHで選ばれるpython3、node、git、systemd-run、timeout、gzipだけを読み、解決先・論理byte・割当byte・SHA-256を表示する。実行fileを起動せず、依存物やホームを再帰走査しない。runner探索、通信、設定変更、科学API読込、seed生成は行わない。失敗は未測定、欠落は未発見として出し、0 byteの実体とは扱わない。合計は役割ごとの保守的な和で、同じ実体でも重ねて数える。

更新済みリポジトリのルートで次を実行する。出力をファイル保存せず、そのまま共有できる。PATHと解決先が出るため、必要ならユーザー名部分だけ伏せてもよい。その場合は伏せた転記と明記する。

```bash
python3 tools/research/g5-runner-topology/inventory-host.py
```

これは観察器自身を動かすPythonを含む容量の部分観察で、実際の制限・依存物・runnerの検証ではない。観察器の実行時間や現在のhost値を本番全工程の予算実証へ転用しない。ChatGPT側の実行結果をWSLの証拠として保存しない。

## 入力・書込先の台帳

| 識別 | 対象と採用候補 | 現在の容量根拠 | 計数と未解決条件 |
| --- | --- | --- | --- |
| I01 | 親監督・停止用codeとunit定義 | 未実装 | 初回ロード・配置・生成物・起動費用も含む。外側に予算外の自作監督を置かない |
| I02 | runner配布物・展開物・同梱runtime | 版・hash・byte未固定 | archiveと展開物の同時存在、更新物も計数。事前配置による除外不可 |
| I03 | Python・Node・Git等 | WSLの版だけ共有済み | 観察器で単体fileを採寸。標準library・共有library・設定・証明書は別に必要 |
| I04 | 候補code | 旧CODE_MANIFESTの1266 file、11746870 byte | 固定コミット484e3f659480a21fec2009fd4a355f9323191c17の過去の集合。最終科学inputではない |
| I05 | 科学用固定input・遮断集合・検算code | 最終集合未確定 | 保護集合を保持。提案seedを読んで容量を測らない |
| W01 | workspace・取得code・Git object | 将来値未測定 | 有限領域内。Git object、展開物、checkoutの複製を数える |
| W02 | Actions取得先・tool cache・runner更新先 | 未採寸 | job開始より前も対象。暗黙downloadと自動更新経路を固定する |
| W03 | HOME・tmp・log・crash dump・journal | 未採寸 | 専用pathへ閉じる。外部journaldや既存HOMEへの書込も無言で除外しない |
| W04 | 有限image・予約域 | 旧原image201326592 byte | 旧技術方式の値。将来の採用値ではない。内部fileをimage物理量と二重加算するかは台帳で明示 |
| W05 | 圧縮物・送信一時物・artifact複製 | 旧通常archive6305109 byte | 将来の圧縮率は未知。image外にあるコピーをすべて計数 |
| R01 | remote blob・manifest・Git制御object | 将来値未測定 | remote側の保存byteを合算。制御objectの定義と測定可能性を固定する |
| R02 | 最終制御記録・receipt・証拠保全 | 対象終端未固定 | 封印後書込を含み、全子停止との順序を決める。未ACKを完成へ昇格しない |

論理byteと割当byteを別々に記録する。共有libraryを読取専用にしても容量費用が消えるとはしない。OS全体を新たに計数対象へ加えるとも仮定せず、信頼基盤と対象inputの境界を既存契約に照合する。

## 保存資料からの容量検算と限界

旧[CODE_MANIFEST.json](../befcs-capsule-20261016/CODE_MANIFEST.json)のtotalBytesと1266項目の和は11746870 byteで一致した。旧通常[RESULT.json](../befcs-capsule-20261016/results/complete/RESULT.json)のrawBytesは201326592、archiveBytesは6305109である。旧結果を書き換えず、既存の検算済み値を台帳の根拠とする。

旧image、同じ圧縮物のローカル1個とremote1個だけを仮に同時保持すると、合計213936810 byte、256 MiBとの差は54498646 byte（約51.97 MiB）になる。これは**その3物だけの算術例**で、全工程の空き容量ではない。runner・外部input・log・Git制御object・artifact一時物・最終receiptがまだ加わる。image内の取得codeをこの例へ再度加算していない。終了予約16 MiBの所在と保護は別途必要で、例の残額を通常work予算へ割り当てない。

全工程では各時点tの保守的合算をS(t)とし、常時S(t)≤268435456 byteを満たす。通常workは終了予約16777216 byteを侵食しない。先にremote分の予算を確保してから送信し、応答不明でもremote保存がなかったと仮定して予約を戻さない。最終量だけではpeakの証明にならない。容量不足が確定したら現経路を成立不足とし、上限増加・対象除外・救済的圧縮率変更を行わない。

## 権限と停止の候補経路

| 主体 | 必要な役割 | 禁止・未確定条件 |
| --- | --- | --- |
| OS管理機構 | 初回起動前の親制限と最後の強制停止 | 信頼基盤の範囲をレビュー。sudo実行可否・専用unit作成権は未検証 |
| 親監督 | 共通時計、全子の監督、予約停止、証拠保存 | 自身も1 GiB・swap無効・全体20分内。自分自身の停止証明を自己申告だけで完結させない |
| runner・work | 単一job受理、取得、既知データ処理 | 専用の非管理ユーザー候補。cgroup書込、manager socket、sudo、外部daemonへの脱出を遮断 |
| 保存処理 | 圧縮、転送、receipt検算 | 同じ親予算内、保存先への最小権限。認証値はlog・manifestへ出さない |

優先候補はsystem側の一時unitで親を先に制限し、workを非管理の主体へ分ける方式である。ユーザー用unitだけの方式は採用せず保留する。現在ユーザーが委任先を書込可能なため、同権限のタスクからの制限解除を防いだ証拠がないからである。専用アカウント・mount namespace・書込制限・socket隔離の具体的設定と後片付けは未設計で、まだ作成しない。

全子停止の対象をrunner/work/uploaderへ明示し、親の記録・保存処理との終了順序を固定する。最後の親停止はOS側の終了状態と結合する。全子停止後に外側で計数外のuploaderを起動して穴を埋めない。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・予約16 MiBは変更しない。

## 通信取引の台帳

| 識別 | 取引 | 一度限りと停止条件 |
| --- | --- | --- |
| N01 | runner登録・認証・job受信・接続維持 | endpoint・認証方式・再接続の意味が未確定。基盤通信を無言でretry禁止の外へ置かない |
| N02 | runner内部のActions archive取得 | 保存ソースに最大3試行の経路あり。初回失敗後の次の要求を止める実装が必要 |
| N03 | checkout・Node準備・候補input取得 | head/hash・取得対象を固定。失敗後の別URLや別手段での救済を拒否 |
| N04 | 科学lease・読取前consume | 未登録・未実行。既存の原子的取得と一度限り消費を維持。今回は一切接続しない |
| N05 | 圧縮証拠・manifest・Git objectの保存と照合 | 各対象の送信とACK読取を区別。ACK用GETは失敗した保存の再送とは異なるが、経路・回数を事前固定 |
| N06 | artifact保全・最終receipt | 対象・終端・hashと全子停止の対応を固定。応答欠落は未ACKのまま止める |

runner初回起動から各要求を観測・制御する方法は未実装。監視logを後から読むだけでは内部retryを防止した証拠にならない。カスタムrunnerの改変・公式runnerの置換・Actionsを使わない経路も今回採用していない。いずれも契約・来歴・一度限り性の再レビューが必要である。

## 結合試験へ進む前の判定条件

WSLの観察器出力を受け取り、単体fileの容量下限をまず記入する。その後、runnerと依存物の固定目録、全書込先・remote容量のpeak上限、権限分離、retry拒否、最終receiptの未確定欄を閉じる。未解決欄が残る間は新規remote試験を開始しない。必要な実機変更は具体的な手順と影響・後片付けを整えてから案内する。

技術fixtureの結合試験はその後であり、既存の成功取引を反復しない。科学reference API・固定初期状態・独立source再生・全合法手完全閉包・途中closure/microstate停止証拠と、最終SPEC/CONTRACT/AUTHORIZATION/hash/保護集合/CI receipt/レビュー/科学専用triggerの接続はさらに後段である。

主要課題は探索順位変動と厳密勝敗価値損失の関係で、DTFや実戦勝率へ差し替えない。103355件遮断、未知、固定有限開発コーパスの解釈を保持。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・科学実行未認可、wholeLifecycleOsProvenはfalseのままである。提案seed 50613001..50613128の読取・生成、旧区画・root/witness延長、source追加、候補差替え、上限増加、救済的retryを行わない。公開ゲーム・AI-GEN4・Workerを変更しない。

## 検証方法

観察器のテストは人工fileだけを使い、リンク先照合、特殊file・過大fileの拒否、観察失敗の未知保持、欠落時の認可拒否を確認する。既存observerや固定manifestは変更しない。

```bash
python3 tools/research/g5-runner-topology/test-inventory-host.py
```

新規文書と現在案内の追補は日本語とし、コマンド・path・field・hash・原値は機械定義の例外として保持する。通常説明文・見出し・未成立理由は日本語で記述する。文書整合、相対リンク、既存の科学境界、CIとレビューを確認してから統合する。

今回のローカル確認では、新規観察器4テスト、既存runner照合3テスト、現在用監査8テストが合格した。旧manifestのfile数・byte和と容量算術を検算し、現在checkoutのhash監査も合格した。このhash監査は独立再検算の一部を省くため完全監査とは区別し、完全監査はPRの既存CIでも確認する。変更した人間向け8文書の新規部分について、相対リンク切れ、英語だけの説明見出し・通常説明文、意図しない既存code block・canonical情報の変更は0件。git diff --checkも合格した。CI・レビュー・main統合の実際の結果はPR記録で確認する。
