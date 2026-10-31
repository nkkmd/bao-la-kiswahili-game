# Node20の取得指定と限定API確認

## 結論

2026-10-31、main `d9f312fefd5c6191d1a24c74e02525cd8298ba21`と保存記録を照合した。未統合PR・追跡済み差分はなかった。

固定runnerソースのexternals.shはNode20の取得版を**20.20.2**、Node24を24.19.0と指定する。対応するNode公式資料でstructuredClone、同梱V8ソースでtoReversedの存在を確認した。ただし、**取得指定の特定であり、配布Node binaryの同定やwork互換性の成立ではない。** Node24除外、方式採用、実行条件成立を認定しない。

## 原archiveの状態と調査方法

前回の調査用原archiveを置いた/tmp/g5-runtime-static-20261030/runner.tar.gzは、今回そのpathに存在しなかった。以前の取得・hash一致記録は保持し、このpathの欠落を全保存証拠の消失とは扱わない。別pathの全探索や再取得は行っていない。

runnerソースとNode公式tagの小さなテキスト資料をGitHubから読み、保存原文をGit blob・byte・SHA-256へ照合した。shellを実行せず、Node binaryの起動、archive再取得・展開、科学codeのimport・実行はしない。

## 固定資料から確認できること

| 資料 | 確認事項 | 限界 |
| --- | --- | --- |
| [externals.sh](upstream/externals.sh) | NODE20_VERSION=20.20.2、NODE24_VERSION=24.19.0。linux-x64分岐は公式Nodeの同版archiveとAlpine用を別に取得 | packaging入力の指定。公開runner内の実体hashや取得時の改変有無を証明しない |
| Node公式[globals.md](https://github.com/nodejs/node/blob/3626fea570e44896ad99aaf3bf6e59def5adede5/doc/api/globals.md) | structuredCloneの追加版はv17.0.0と記載 | v20.20.2固定文書でのAPI存在確認。対象データのclone結果・例外・資源特性の同値性は未検証 |
| [array-to-reversed.tq](upstream/array-to-reversed.tq) | ArrayPrototypeToReversedとgeneric/fast経路がある | 固定Node tree内のV8ソース。実binaryで有効な実装とbuild条件の対応は未検証 |

Node tag v20.20.2はannotated tag object `35e07843146797923006aa01c6daabf4f53a4fb9`を経てcommit `3626fea570e44896ad99aaf3bf6e59def5adede5`へ解決した。[取得元一覧](SOURCE_ORIGIN.json)に固定path・原文hash・未成立状態を記録する。globals.mdの本文は複製せず、固定コミットへのリンクと上の限定事実を根拠とする。

runner取得スクリプトにはdownload retryの処理もあるが、今回は読取だけで実行していない。このpackaging scriptを科学用の一度限り取得手順として採用せず、取得費用・cacheを予算外にしない。

## 互換性について閉じた確認と残る確認

[26ファイルの静的索引](../work-deps-20261031/README.md)で見つかったstructuredCloneとtoReversedについて、指定版の公式資料・ソースが存在する確認はできた。API不存在を理由にNode20共用を直ちに除外する根拠は、この2項目からは得られていない。

一方、全method/option、配列の疎密・prototype、clone対象、JSON/hash・独立検算、fs/child_process、停止・資源特性、Node transportは未確認である。2 APIの存在を26ファイル・全workflowの互換性へ一般化しない。node20WorkCompatibilityProven=falseを維持する。

binary同定では固定runner archive内の対象nodeのbyte/hash、版を示す静的情報、公式Node配布物またはbuild来歴との対応が必要である。ソースの取得URLだけでbinary同一性を認定しない。静的情報で特定できない場合は未確定で止め、node --versionの実行で先へ進まない。

## 次の工程と停止点

次は原archiveの利用可能性を確認し、必要なら既存URL・byte/hash・一回限り・保存範囲を先に固定した読取計画を作る。資料取得と科学用全工程を分け、成功済み保存取引や科学sourceを再実行しない。その後、対象nodeと版の対応を静的に照合してから、指定版APIと使用箇所の対応表を広げる。

[候補経路](../candidate-route-20261031/README.md)のNode20共用・容量残額は未証明仮説で、Git仲介のCASとreceipt後読取、下位無再送、OS隔離、全容量、最終保存も未成立である。runner改変・build・登録・実行、新規remote結合試験へ進まない。

## 研究境界と再現性

第五世代研究は継続中。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを保持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を維持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128の読取・生成、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更せず、WSLへの導入・設定変更も行わない。

保存3原文はSOURCE_ORIGIN.jsonのGit blob・byte・SHA-256へ照合する。MITの[runnerライセンス](upstream/RUNNER_LICENSE)とBSDの[V8ライセンス](upstream/V8_LICENSE)、原文の著作権表示を保持する。上流原文・LICENSEは原資料例外、JSON/ID/path/hash/field/commandは機械定義例外で、日本語で意味と限界を説明した。現在checkoutの保存監査は[現在用手順](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使い、CI・レビュー・統合の結果はPR記録を参照する。
