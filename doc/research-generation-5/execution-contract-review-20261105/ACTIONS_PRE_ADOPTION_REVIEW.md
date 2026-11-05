# Actions一候補の採用前レビュー

> 現在の選択: ユーザーの指示により[設計方針を確定](USER_SELECTION.md)した。P/M/R分割、raw読戻しと通信予算予約、U_api＋S/Kの来歴を選択済みとする。以下は選択前の検討記録であり、推奨/未採用表示は本書の対象時点を示す。B1数値一式・実行契約全体、技術条件の成立、実装・試験・科学登録/実行は引き続き未承認である。

> 採否の最新判断案: [採否判断と修正案](ADOPTION_DECISION_PROPOSAL.md)に、既知入力のbyte台帳、600/16/408 MiBの通信配分、raw読戻し、最終U_apiと信頼範囲の選択肢を示した。P/M/R分割は採用推奨だが、現状のB1/Actions候補の一括採用は推奨しない。正式採用・実装・新規試験・科学登録/実行は行わない。以下は各検討時点の未採用資料として保持する。

## 結論と今回の範囲

**標準Actionsを使う方向性は残すが、今回の候補を実行契約として正式採用できる状態にはない。** 既存の部品証拠と、設計上の説明、新候補でまだ成立しない条件を分離した。特に、保存clientの24 MiB応答制限、48 MiB片の読戻し、論理取引と実API要求数、最終制御記録Tと終端receipt Uの実API対応が残る。CIの不整合だけを直しても採用可能にはならない。

本書は[改訂契約の具体案](CONCRETE_CONTRACT_PROPOSAL.md)に対する静的レビューで、契約採用・実装・新規技術実験・remote結合試験・科学登録/実行の認可ではない。比較対象を一つに固定するための候補識別子を付けたが、科学Studyやworkflowを登録したものではない。[機械可読表と参照資料のhash](ACTIONS_REVIEW.json)を併読する。

照合したmainは`1205afe0a2c79c957f5d21bee6b7de47a6665ae4`、treeは`f6065400f243631e958f04c46214d4849b520a65`。PR #236はdraft・未統合、レビュー開始時headは`ec67f24db24b1e10e1091e90a5392fde4d17f96d`だった。追跡済み差分はなく、既存一時ファイル2件を保持する。サブエージェントは使わず、ユーザーWSLを操作していない。

## 比較する候補を固定する

| 項目 | 今回の候補案 |
| --- | --- |
| 候補ID | `G5-ACTIONS-B1-GIT-REST-REVIEW-001`。比較資料専用で未採用 |
| 実行環境 | 標準GitHub-hosted Linux x64 VM、`ubuntu-24.04`を候補labelとする。self-hosted・custom runner・WSLは使わない案 |
| 基盤K | GitHubのVM/標準runner、OS/kernel/manager、監督Sと認証注入を信頼基盤として列挙。科学workerへsudo・manager・直接外部通信・tokenを渡さない |
| 科学runtime | 既存技術CIと同じNode `24.19.0`を比較用候補版とする。Pで配布byteを照合し読取専用化、科学初回exec/importはM内。runner内Node20共用は要求しない |
| 起動 | 一つの専用job・attempt 1・固定head/契約hashを想定。Pの内側で科学code/inputを取得する。既存workflowを流用してcheckout済みだからP取得費0とはしない |
| task構成 | S/CがMとRを別の制限領域・資格へ束縛し、共通時計を監督。科学入口の二度目の起動を拒否するbrokerが必要。現時点では未実装 |
| 科学registryとmirror | 既存Git registryの期待旧ref付きCAS、durable consume、sequence/hash付きmirrorをGit HTTPSへ対応付ける案。remote科学registryとその認可は未作成 |
| DとTの保存 | 既存capsuleのGitHub REST Git database経路を参考に、新規の専用refへblob/tree/commitを保存する案。registry CASとは別protocolで、client監査を兼用しない |
| 保存終端 | M/R補助子孫停止→D/A→T→Uの案。S/K自身の終了を必須Eから外すJ4は未承認。Uに相当する実APIの受理・証拠は未固定 |
| 予算 | B1のP600秒・M1200秒・停止後R600秒、M1 GiB/256 MiB、段階別C/R/P上限、task親2176 MiB・local総量3088 MiB。すべて未採用値 |

`ubuntu-24.04`は固定image digestではない。将来実際に割り当たるimage/kernel/runtime/runner版・実行bit・全入力hashを事前確認する必要がある。公式の公開repository用標準Linux VMの表は4 CPU・16 GB RAM・14 GB SSDを示すが、これは一般の割当仕様で、今回のjobの実測ではない。Linuxのsudo提供も、科学workerによる権限迂回を閉じた証明ではない。

基盤側のrunner起動・workflow受信と今回追加するSの準備を分け、S初回ロードの費用をK/Cのどこへ帰属させるかも固定する。新しい起動codeを「基盤」と呼ぶだけで費用を除外しない。旧候補の初回ロード不足を、本候補の成立へ読み替えない。

## 三分類の意味

- **既存証拠で成立**: 指定した過去の技術fixture・保存証拠の範囲で確認済み。新候補全体へ転用できるという意味ではない。
- **設計で説明可能**: 担当・順序・帰属を矛盾なく記述できる。採用・実装・実効性の合格ではない。
- **未成立**: 必要な具体対応や証拠がない、または直接流用に不一致がある。文書追加だけでは通過しない。

以下は部品事実も含む分類表で、通過率や研究進捗率ではない。既存部品が成立していても、新候補への結合条件が未成立なら科学入口を開けない。過去の成立は保存報告・receipt・固定codeから確認し、今回、全archiveの完全再監査や元取引の再実行はしていない。

## 既存証拠で成立する範囲

| ID | 確認対象 | 根拠と、今回へ持ち込める限界 |
| --- | --- | --- |
| E01 | 研究の問い・終了済み区画・不変条件の記録 | [現在状態](../CURRENT_STATUS.md)、[旧科学契約案](../befcs-operations-20261013/CONTRACT_DRAFT.md)。320 source消費、16完全領域、BEFCS未実行を保持。新契約の採用証拠ではない |
| E02 | 既知データでの全合法手・独立検算・未知保持 | [BFS統合報告](../bfs-integration-20261013/REPORT.md)、[技術preflight](../branch-envelope-preflight-20261013/README.md)。科学入口への結合と新規供給は未成立 |
| E03 | 技術Git registryのCAS・読取前marker・独立履歴検算 | [運用報告](../befcs-operations-20261013/REPORT.md)の1区画・128 marker・8 mirror・137 commit。ローカル技術remoteと論理IDであり、GitHub上の科学区画ではない |
| E04 | 保存済み全workloadの1 GiB・swap条件・容量境界 | [第2版CI確定](../befcs-workload-20261013/CI_CONFIRMATION_V2.md)、run 38354225350/38354228277の8固定シナリオ。新候補のP/R/C同時制限・資格分離は証明しない |
| E05 | 実OSの小さな専用unit、OOM/ACK欠落、容量不足後の保存 | [OS検算](../befcs-lifecycle-20261015/README.md)と[容量fixture](../befcs-capacity-20261015/README.md)、run 38739433923/38745436271。初回準備・全egress・外部終端は範囲外 |
| E06 | 固定技術データの外部保存・ACK抑止の区別 | [外部保存](../befcs-external-20261015/README.md)、run 38743877526。保存成功と未ACKを区別できた部品証拠。新契約の全通信上限は証明しない |
| E07 | 固定code取得と原image全体のD保存・独立復元 | [capsule報告](../befcs-capsule-20261016/README.md)とCI_RECEIPT、run 38850453567。1266 file・11,746,870 byte、gzip約6.3 MBの技術例。最終科学input、48 MiB片、T/E/Uの成立には使わない |

## 設計で説明可能な対応

| ID | 条件 | 今回の具体対応と、残る実証 |
| --- | --- | --- |
| D01 | P/M/R/Cの対象・開始終了 | Pは固定byte照合まで、t0を最初の科学exec前、Mは独立検算と停止まで、Rは既存byteの保全のみ。起動と時計の実効性はU03/U05へ |
| D02 | 準備で科学計算を先取りしない | Pはhash/size照合だけ、遮断集合の構築・科学import・lease/consumeはM。P内で科学cacheを作らず、生成bufferをRへ逃がさない |
| D03 | 同時資源・共有物・最後の送信費用 | P残存物も計上し、M/R/C同時memory、共有fileとコピー、T封印前実測と終端予算を分離。最終peak不明を0にしない |
| D04 | runner改変とruntime共用を必須にしない | Kの標準runnerと科学Nodeを分ける。科学側だけを制限し、Kのretryは科学再実行を許可しない。固定版/依存同定はU02へ |
| D05 | 一度限り性と停止後の解釈 | 科学入口1回、全区画lease後の中断は再開なし。失敗時は許可を閉じ、保存済prefixを保全するだけ。解null・未ACKを保持 |
| D06 | 科学操作と基盤通信を分ける | Git HTTPSのregistry/mirror、RESTのD/T、Kのjob/logを別台帳へ。科学workerにtoken・直接egressを与えない。下位要求/迂回拒否はU09/U10へ |
| D07 | 不足時にも研究を正しく区切る | [工程案](REVISED_ROADMAP_DRAFT.md)の未実行・技術準備不足・供給不足・推定不能・非確認・確認に接続。正の結果を完結条件にしない |

## 新候補で未成立の条件

| ID | 条件 | 不足または不一致 | 閉じるための最小成果物 |
| --- | --- | --- | --- |
| U01 | 最終科学入力をP/M容量へ収容 | 1266 fileの旧取得集合は最終入力一式ではない。保護集合・独立検算子・必要履歴・停止記録も要る | 最終path/size/hash/実行bit/依存先、段階帰属、複製・allocated byteまでの静的台帳 |
| U02 | image/runtime/Kの固定と割当 | OS labelだけでは版固定にならず、Node24.19.0の完全依存も未確定。一般仕様表は当該jobの割当証拠でない | 利用imageと科学runtimeの許容条件・拒否条件、必要権限と基盤割当、入力manifest |
| U03 | P600秒・取得3試行/256要求/1 GiB | 現行workflowはcheckout/setup-nodeをSより前に実行する。外側の取得をP成功へ数えられない | K/S初回ロード→P制限確立→取得の順序と、全helper要求を含む制限経路 |
| U04 | Mの1 GiB・swap 0・合算RSS | 過去cgroupは部品。Pで課金された共有頁、独立検算子、科学側の権限迂回を含む新構成は未確認 | UID/cgroup/namespace/FDと共有頁計数の対応、上限変更/脱出拒否の合格条件 |
| U05 | M初回ロードから1200秒・領域180秒・終了予約 | 既存台帳の模擬時計や部分serviceを、新候補の初回exec・全停止の共通時計へ結合していない | t0・領域時計・1020秒以降の停止専用動作・hard deadline・停止失敗分類の一経路 |
| U06 | M256 MiB・予約16 MiB・全書込対象 | Mのtmp/cache/journal/固定入力/原imageを最終一覧で網羅していない | 全書込先と容量予約の同一台帳、解放順序、停止prefixの対象一覧 |
| U07 | R512 MiB・C128 MiB・停止後600秒 | RESTのbase64/JSON全buffer、Git子孫、T送信を同時に収めた証拠がない | buffer寿命とprocess表、R/Cの分離、最終送信後費用の上限・計測不能欄 |
| U08 | task親2176 MiB・local3088 MiB・remote768 MiB | 固定データの一部peakから全体peakへ外挿できない。Git loose/pack/metadataや孤立objectも費用を持つ | 同時peakと累積object/remote残存の保守的上限、超過前停止経路 |
| U09 | token/egress/停止権限の分離・監督喪失 | sudo可能なrunnerと科学UIDの隔離、manager/daemon経由の迂回、S喪失時の子孫停止が未結合 | 全権限・socket・FD・通信主体と、OS側停止/回収の担当表 |
| U10 | remote lease/consumeとattempt 1 | 現registryはTECHNICAL-REGISTRY-FIXTUREだけを受理し提案科学区画を拒否。run/head/契約hashと下位Git要求の一度限り性が未結合 | 既存拒否を維持した科学入口の別設計、CAS/receipt/応答不明停止、二度目入口拒否の条件 |
| U11 | mirrorと通信1 GiB/12700実要求 | 既存Gitはls-remote/fetch/pushを複数回使う。論理marker/片の数だけでは実要求数・pack転送量・timeoutを導けない | 操作→Git subprocess→HTTP要求の静的台帳、metadata/pack上限、総body費用の算術 |
| U12 | D最大48 MiB片の保存/読戻し | 現capsule clientは応答24 MiB上限。48 MiBのbase64本文だけで64 MiBとなり、直接流用不可 | raw読戻し/別client等の案を予算内で比較。既存clientの上限だけを黙って増やさない |
| U13 | A/T/E/Uの実APIと有限終端 | 旧成功はD/Aまで。Git ref作成responseを、永続な実行内U記録や親終了証拠と同一視できない | Tの全API要求、Uの必要field/保持先/照合、E対象、最後の費用・欠落分類。J4の保証変更の採否 |
| U14 | K費用・保持と全資源報告 | 標準VMの公開仕様と当該accountの利用条件・remote保存期間/料金を区別する必要がある。host全体の実測はない | 基盤割当とtask実測の二層台帳、保持期間と費用上限、不明値の理由 |
| U15 | 待ち1800秒・総実行2400秒と遅着拒否 | jobのtimeoutだけではqueue期限・外部取消・遅着した科学入口拒否を保証しない | 受付側期限/取消権限/一回認可失効の具体経路。未成立なら現在の70分受付案は採用不可 |
| U16 | 保存監査CI・現在資料の統合 | PR #235後のillustrated-rules.yml旧byte照合で現在用監査が停止する | 科学実装と分離した現在用監査の正当な更新方針。旧証拠・凍結verify.py・旧bindingは維持 |

U01〜U15が実行契約の不足、U16が文書統合の障害である。未成立に実装がないことと、その方式が不可能であることを混同しない。今回これらのadapterや新しい試験は作成・実行していない。

## 静的照合で具体的に判明した不一致

### 保存量と通信量を同じ数字にしない

現在の`transport.cjs`はblobをbase64 JSONとして送受信し、response bodyを全量蓄積して24 MiBで拒否する。48 MiBは50,331,648 byteで、base64文字列は67,108,864 byteとなり、JSONや改行の前に24 MiBを超える。過去のgzip約6.3 MBの成功は、この境界の通過証拠にはならない。

Dの圧縮合計256 MiBを同方式で一度送信し、一度全量読戻しすると、base64文字列だけで合計約682.67 MiBとなる。M/R/C通信上限1 GiBから残る約341.33 MiBは、registry/mirror・その読戻し・manifest・HTTP bodyの追加分にも必要である。mirrorにも無条件で256 MiBを転送できるとは認定できない。上限は成功保証ではなく打切り境界だが、正常な保存対象の最悪量を運べる設計かは採用前に区別して説明する必要がある。

[公式blob API](https://docs.github.com/en/rest/git/blobs)はJSON/base64とrawの読戻しを説明する。rawを使う案ならbase64費用は減るが、既存clientはJSON parse前提なので、そのまま切替済みとは扱わない。raw読戻し・stream化・別のGit経路への変更は未採用の選択肢であり、今回は実装しない。

### 論理取引と実要求を分ける

現在のcapsule通常保存は、image blob、manifest blob、tree、commit、refの5 POSTと、ref、commit、image blob、manifest blobの4 GETで、計9要求である。複数片へ同じ形を拡張する仮定では、n片を一つのmanifestへ束ねると書込n+4、読取n+3、合計2n+7となり、6片なら19要求になる。これは静的な構成算術で、当該API組合せの実証ではない。

Git registryも一論理操作を1 HTTP要求で表せない。[registry.cjs](../../../tools/research/g5-befcs-operations/registry.cjs)は読取時のls-remote/fetch、commit前のhead照合、期待旧ref付きpush、receipt用head照合を使う。APIの単なるfast-forward更新を期待旧ref付きCASの代用にしない。提案の12700は全実要求に対する未採用上限として保持し、「この算術で現在のGit/RESTが収まる」とした保証は付けない。

また現在のGit timeoutは30000 ms、capsule requestのtimeoutも最大30000 msであり、具体案の各要求10秒へ適合した実装ではない。外側timeoutだけでは子孫停止・下位再要求拒否・返却期限の証明にもならない。これらはU03/U07/U10/U11の対応が必要である。

### Git上にTがあることと、Uを実行内に受領した証拠は別

[公式ref API](https://docs.github.com/en/rest/git/refs)のref/commit識別は保存内容の結合に使える。一方、そのresponseが改訂案のUとして必要なdurability・受理時刻・保存結果・実行内受領の保全を全て提供するとは、この資料だけで証明できない。Git保存が成立してもACKが欠ける既存caseを成功へ昇格しない。

T自身のblob/tree/commitを事前に作るなら、その費用と失敗をR/Cへ含める必要がある。Sだけで終端を送るなら、その全API要求をCの128 MiB・残り時間へ収め、最後のresponseをどこまで証明するかを固定する。S自身の終了をEから外すJ4に同意しても、このAPI/証拠対応の不足は自動的には閉じない。

## 採用判断への帰結と次の最小範囲

| 判断 | 今回の評価 | 次に必要な判断・成果物 |
| --- | --- | --- |
| J1: P/M/R/Cへの分割 | 方向性は説明可能。旧全工程条件の成立にはしない | 保証範囲変更への採否。初回S費用を含むU03の帰属 |
| J2: B1予算 | 採用保留。値は政策的な打切り境界で、入力と全転送量の適合が未成立 | U01/U07/U08/U11/U12の静的上限表。科学上限や外側上限を自動増枠しない |
| J3: 操作別通信 | 方針は説明可能。Git/REST二経路への適合は未成立 | 科学一回・下位要求数・失敗後停止保存のslotと全body量を固定 |
| J4: 終了証拠 | 採用保留。S自己終了を外す保証変更とU13の実API対応は別問題 | Uの必要保証を維持する実API案、または保証を変更する具体案と影響を提示 |
| J5: Actions | 第一比較候補を継続する理由はある。正式な環境選定は不可 | この一候補で不足を閉じられるか査定。自動的なWSL/custom runner移行はしない |

次のレビューを行う場合は、まず**最終入力・全保存対象・実要求/転送量の静的台帳**と、**T/E/Uの実API・保持先・欠落時分類**の二つに限る。この二つを現予算内の一経路として説明できなければ、実装へ進めない。OS権限や時計の実証は、採用と別の技術作業認可の後にだけ行う。候補が閉じなければ、技術準備不足として未実行のまま終了報告案へ進む選択肢を残す。

## 再現性・保存・今回の停止点

根拠は保存済み報告・receipt・固定code/workflowと、公式API/runner説明の読取である。主要参照資料のSHA-256をACTIONS_REVIEW.jsonへ保存した。これは静的読取の同一性確認であり、全保存archiveの完全監査や新しいOS/remote適合試験ではない。

現在用の`verify-current.py --hashes-only`は既知のillustrated-rules.yml不整合で停止した。hashes-only成功とも完全監査成功とも報告しない。`inventory-clients.py --verify-saved`は選択32 file/72一致の照合に成功し、全ソース再走査ではない。PR #236の必要CIが通るまで統合保留を維持し、監査器・workflow・旧証拠を書き換えて回避しない。

G5-01〜05の320 source、G5-05の採用35代表/8候補・選定差0件、103355件遮断、全合法手完全閉包・独立検算・未知・固定有限開発コーパスを保持する。旧区画/root/witness延長・source追加・候補差替え・科学上限増加・救済的retryを行わない。BEFCS未登録・未実行・科学seed消費0・leaseなし・未認可、旧wholeLifecycleOsProven=falseと実装移行停止を維持する。公開ゲーム・AI-GEN4・Worker・旧認可・実装・実行workflow・ユーザーWSLは変更しない。

今回の完了点はこの採用前レビューであり、契約採用・実装・新規fixture/remote結合試験・科学登録/実行へ進まない。分類表の件数を科学的進捗やgate通過数に変換しない。

## 文書監査と自己レビュー

今回の対象は本書、既存の具体案/再評価README/工程案、研究案内6文書の更新部分、計10 Markdownと台帳JSON 2件である。三分類の意味、既存部品の成立範囲、未成立の理由と出口、未採用・未実行の境界を日本語で説明した。英語だけの説明見出し・通常説明文、相対リンク切れ、意図しない旧fenced code block・canonical値・認可状態の変更は0件と確認した。ID・path・field・hash・command・runtime版・API名は日本語説明付きの識別子例外である。

30行の分類と件数、主要資料13件のbyte/hash、48 MiBのbase64長、6片の仮定構成19要求を静的に照合し、git diff --checkも成功した。自己レビューで、Eの7件を新候補のgate通過に数えないこと、GitとRESTの別経路、Uの未対応、CI障害と契約不足の分離を確認した。独立レビュー・新規実験は行っていない。既存文書CIの実結果はPRへ記録する。
