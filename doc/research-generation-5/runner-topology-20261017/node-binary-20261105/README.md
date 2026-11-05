# 再開監査と配布Node binaryの静的照合

## 結論

2026-11-05、GitHubのmain `02b2f17ba2c188bf6f0411957f56011b1c134c74`、tree `264718f4240ddd0d7f57db29f20e65f4371ef891`を確認した。前回PR #226の統合後から変更はなく、未統合PRはなかった。前回headのCIは13成功・対象外5スキップである。作業領域の自動メンテナンス後にGitHubから完全履歴を復旧し、現在用hash監査、client保存台帳の照合と3テストが合格した。静的調査を安全に継続できると判断した。

固定runner archive内のNode20実体と、Node公式v20.20.2 Linux x64 archive内の実体は**98932688 byte・SHA-256が一致した**。これにより、前段で未確定だった取得指定20.20.2と配布binaryの対応を、公式配布物との内容同一性として確認した。binaryの実行、署名検証、ソースからの再buildは行っていない。

Node20のwork互換性、Node24除外、下位transportの無再送、容量・権限分離・最終保存を含む全工程の成立は未認定である。旧候補JSONや過去資料のfalseは当時の状態として保持し、今回の同定範囲を本書とRESULT.jsonへ追加する。

## 保存資料と取得範囲

| 保存物 | 内容と限界 |
| --- | --- |
| [取得計画](ACQUISITION_PLAN.md) | URL・最大byte・時間・一回限り・失敗停止・静的読取範囲を取得前に固定した調査計画。科学実行の事前登録ではない |
| [取得receipt](ACQUISITION.json) | curl終了値0、各1回の呼出し、取得byte/hashと計画hash。ローカルで構成した記録で、HTTP原応答・redirect全hopの記録ではない |
| [公式checksum](SHASUMS256.txt) | nodejs.orgのv20.20.2のHTTPS取得本文。署名を検証した資料とは扱わない |
| [照合結果](RESULT.json) | 両archiveと対象memberのbyte/hash、ELF属性、同定範囲と未成立field |
| [読取器](compare.py) | 固定hash/byteとchecksumを先に確認し、通常file各1件をstreamで読む。取得・archive通常展開・binary実行は行わない |
| [人工archive検査](test_compare.py) | 通常fileの非展開読取、link・重複・hash/size不一致・欠落の拒否と保存記録の境界確認 |

公式checksum3777 byte、runner archive226430031 byte、Node archive47175721 byteを順に取得し、hashを照合した。失敗後retry・代替URL・別版への変更はない。通常redirectの追跡は有効で、一回のcurl呼出しをHTTP要求総数1と呼ばない。

調査用archiveとbinaryをリポジトリへ格納しない。取得・静的読取はChatGPT側の調査で、ユーザーWSLの観察・設定変更ではない。資料回復に伴う再取得を科学用取得、成功済み外部保存取引、科学sourceの再実行へ結び付けない。この調査の容量・時間を科学用256 MiB・20分内の成立証拠へ転用しない。

## 実体の照合結果

| 項目 | runner側 | Node公式側 |
| --- | --- | --- |
| 対象member | ./externals/node20/bin/node | node-v20.20.2-linux-x64/bin/node |
| 通常fileのbyte数 | 98932688 | 98932688 |
| SHA-256 | 6295488653f0d93b0a157841746fef7e72cc4328cfb60c4bbe0ca2668a836ffd | 6295488653f0d93b0a157841746fef7e72cc4328cfb60c4bbe0ca2668a836ffd |
| 静的header | ELF64・little endian・x86-64 | ELF64・little endian・x86-64 |

Node archiveのSHA-256は公式checksumの一意な対象行`19e56f0825510207dd904f087fe52faa0a4eb6b2aab5f0ea7a33830d04888b8b`と一致した。runner側は既存固定hash`70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613`と一致する。tarの対象以外をfilesystemへ展開せず、同名重複・link・欠落・上限超過を拒否した。

これは公式release配布物とのhash同一性で、実行時version出力や挙動の確認ではない。署名検証、native依存の完全性、Node/V8ソースとの厳密build対応も未証明である。[取得指定とAPI資料](../node20-version-20261031/README.md)の意味をこの範囲より強めない。

## 再現とCIの範囲

同じhashの既存archiveがある場合だけ次を実行できる。読取器にdownload機能はなく、この再現のための再取得を自動起動しない。

```bash
python3 doc/research-generation-5/runner-topology-20261017/node-binary-20261105/compare.py /path/to/runner.tar.gz /path/to/node-v20.20.2-linux-x64.tar.gz doc/research-generation-5/runner-topology-20261017/node-binary-20261105/SHASUMS256.txt > /tmp/g5-node-binary.json
diff -u doc/research-generation-5/runner-topology-20261017/node-binary-20261105/RESULT.json /tmp/g5-node-binary.json
python3 -m unittest discover -s doc/research-generation-5/runner-topology-20261017/node-binary-20261105 -p test_compare.py
```

CIは人工archiveと保存資料だけを検査し、実archiveを取得せず、Node・runner・科学codeを実行しない。したがってCI成功を実binaryの再照合と呼ばない。実binary照合は今回のローカル調査結果と固定archive/memberのhashが根拠である。既存の科学gateと最終triggerを開かない。

## 次の工程

版同定が進んだため、次はNode20.20.2のAPI・optionと[4入口の26ファイル索引](../work-deps-20261031/README.md)を対応付ける。literal requireの索引を全依存や最終科学inputへ昇格せず、独立検算、fs/child_process、停止/資源特性とNative依存も確認する。Node24共用の既存実績をNode20へ移送しない。

Git仲介のCAS・receipt後読取、全client、下位無再送、OS隔離、全入力peak、最終receiptは引き続き未成立である。[候補経路](../candidate-route-20261031/README.md)の容量は未証明仮説のまま維持し、今回のmember値一致だけでNode24を除外しない。runner改変・build・登録・実行、新規remote結合試験は開始しない。

## 維持する境界と品質

第五世代研究は継続中。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを維持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を保持する。

主課題をDTF・近似探索・実戦勝率へ差し替えない。提案seed 50613001..50613128の読取・生成、旧区画再実行・root/witness延長・source追加・候補差替え・上限増加・救済的retry・成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更せず、WSLへの導入・設定変更も行わない。科学APIの既知fixture接続・最終事前固定は残る。

現在用保存監査は[現在用手順](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)に従う。原manifest・凍結済み記録は変更しない。説明・見出しは日本語、公式checksumは原資料例外、JSON/Python/path/ID/field/hash/commandは機械定義例外で、意味・限界を本書で説明する。CI・レビュー・統合の結果はPR記録を参照する。
