# WSL容量の共有観察と標準runner配布物の静的検算

> 次の[軽量経路レビュー](../lightweight-20261020/README.md)を追加した。標準配布物全体の容量不足という本書の判断を保持し、選別案の容量・runtime分離と実Actions jobの来歴を別途比較する。全工程成立や科学実行は未認可である。

## 結論

ユーザーのWSLで選択した6実行fileの割当量は141426688 byte（約134.88 MiB）だった。旧192 MiB imageを別に保持する配置は、その2項目だけで342753280 byteとなり、256 MiBを74317824 byte超える。

重複配置を避けた案を調べるため、固定runner 2.337.0のLinux x64配布物を静的に確認した。通常fileの論理量は679562451 byte（約648.08 MiB）で、標準配布物全体だけでも256 MiBを超える。**この標準x64配布物全体を現行の全input・保存予算に含める通常展開案は成立しない。** 単なる配置変更でこの量は消えない。

これはWSL自体の不採用、他のarchitectureや軽量実行方式の不可能性、科学的仮説の否定ではない。WSLのarchitectureはまだ直接観察しておらず、今回の判定は明示したx64配布物に限定する。展開後の実割当量や圧縮filesystemは未測定で、論理量を実割当の測定値と呼ばない。選別したrunnerの動作保証や容量成立も確認していない。

## WSLの観察証拠

[ユーザー共有値](WSL_REPORTED.json)は、2026-10-20に会話へ貼られたJSONから必要項目を転記した記録である。原出力の全byte保存・署名済みreceipt・独立host観察とは扱わない。観察器はコミット`7c6062d7900b8e4ccdb7a717d287e2b2fa11ade1`の`inventory-host.py`。単体実行file以外の依存物・runnerは未検査である。

| 対象 | 論理byte | 割当byte |
| --- | ---: | ---: |
| Python | 8020928 | 8024064 |
| Node | 129129032 | 129130496 |
| Git | 4066232 | 4067328 |
| systemd-run | 68392 | 69632 |
| timeout | 39880 | 40960 |
| gzip | 93424 | 94208 |
| 役割ごとの和 | 141417888 | 141426688 |

image内へこれらを一度だけ配置する仮定でも、6 fileの論理量、旧code11746870 byte、終了予約16777216 byteだけで169941974 byteとなる。192 MiBとの差31384618 byte（約29.93 MiB）はrunner・依存物・科学input・work・filesystem metadata等をまだ含まない算術残額で、利用可能量の実証ではない。役割を外したり、旧codeを最終科学inputへ昇格したりしない。

## 公式配布物の取得と検算

GitHubプラグインで公式[asset metadata](https://api.github.com/repos/actions/runner/releases/assets/530928164)を読取り、返された復号済みJSONを[保存](RUNNER_ASSET_METADATA.json)した。HTTP上の原応答byteとは扱わない。対象は[公式release v2.337.0](https://github.com/actions/runner/releases/tag/v2.337.0)の`actions-runner-linux-x64-2.337.0.tar.gz`、asset ID `530928164`である。版を最新として採用したのではなく、既存の固定runner調査と同じ版を選んだ。

取得前に対象URL・metadataの226430031 byte・SHA-256を固定し、ローカル調査用の単一archiveに限定した。curlの`--retry 0 --max-time 120 --max-filesize 226430031`で一度だけ取得した。通常のredirect追跡は有効とし、失敗後のretryや代替取得はしていない。curlは終了値0、取得byte数とSHA-256がmetadataに一致した。

取得したSHA-256は`70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613`。今回初めてこのarchive自身のhashを検算したが、既存jobが使ったrunnerバイナリとの一致は証明しない。版表示・source tagだけで実行バイナリ同一性を認定しない旧境界を保持する。

静的調査はChatGPT側のscratch上で行い、WSLを操作していない。archiveを展開・実行・登録せず、固定hashを照合してからtarの項目一覧とサイズを読んだ。取得自体は科学用全工程試験の外で行った公開配布物調査であり、その費用・所要時間を科学用256 MiB・20分内の成立証拠へ転用しない。科学seed・source・leaseや成功済み外部保存取引には接続していない。

| 保存項目 | 値・意味 |
| --- | --- |
| 圧縮archive | 226430031 byte（約215.94 MiB） |
| 通常file | 9304件、679562451 byte |
| directory | 2136件 |
| symlink | 6件。追跡・展開せず記録 |
| hardlink | 0件 |
| 取得物の実行・展開 | なし |
| WSL architecture・runner実機動作 | 未確認 |

[要約](RUNNER_PACKAGE_SUMMARY.json)と[全項目の圧縮一覧](RUNNER_PACKAGE_INVENTORY.json.gz)を保存する。圧縮一覧はJSONをkey順・空白なしで直列化し、mtime=0でgzip化した派生成果物で、配布archiveそのものではない。原archiveは巨大な実行物なのでリポジトリに格納せず、固定公式URL・byte数・hashで識別する。CIは保存一覧の整合と人工archiveでの検算器を確認し、実archiveの再取得・実行・展開は行わない。したがってCIの合格を実archiveの再検算と呼ばない。

既存のローカル原archiveがある場合だけ、次で一覧を再計算できる。再計算のために通信を起動する機能はない。

```bash
python3 tools/research/g5-runner-topology/inventory-package.py /path/to/actions-runner-linux-x64-2.337.0.tar.gz
```

## 配置案の判定

| 配置案 | 今回の判断 |
| --- | --- |
| 旧192 MiB imageと6実行fileを別保持 | 2項目だけで256 MiB超過。採用しない |
| 標準x64配布archive全体と6実行fileを同時保持 | 論理量だけで367847919 byte。256 MiB超過。採用しない |
| 標準x64配布物全体を通常展開してimage内へ配置 | 通常file論理量679562451 byte。現行全input計数に収まらず、採用しない |
| 事前配置・読取専用mountとして計数外へ移す | 現契約成立の方法として採用しない |
| 圧縮領域からの実行・必要部分だけの選別 | 入力範囲・解凍work・動作・retry・依存物・全保存が未検証。採用しない |
| Actionsを受け取らない軽量executor | job/attempt/認可/来歴の契約適合が未確認。変更案としての比較レビューに留める |

## 次に進めるレビューと停止点

追加のWSL採寸やrunner導入は今は必要ない。標準x64配布物全体の配置を続けず、**現行境界を維持できる最小実行経路の適合レビュー**を次とする。軽量executorとrunner選別案について、固定code・依存物・全書込・通信retry拒否・単一実行・全子停止・最終receipt・CI来歴・科学専用triggerを同じ表で比較する。新方式を実装・採用したことにはしない。

Actions jobとattempt 1を代替経路でどう満たすか、基盤境界を変えずに何を減らせるかが未解決である。現行契約の条件を満たせなければ成立不足として停止し、制約変更を黙認したり、比較レビューを実行許可へ読み替えたりしない。上限増加、既存inputの計数除外、旧科学区画・root/witnessの延長、source追加、候補差替え、救済的retryを行わない。

第五世代研究は継続中で、主要課題は探索順位変動と厳密勝敗価値損失の関係である。103355件遮断、全合法手完全閉包、未知、固定有限開発コーパスの解釈を保持する。G5-05の先行候補rootだけを追加する凍結規則と採用35代表・8候補の差0件も変えない。BEFCSと正式関係は未登録・未実行、科学seed消費0・leaseなし・科学実行未認可、wholeLifecycleOsProvenはfalseである。提案seed 50613001..50613128を読まない。公開ゲーム・AI-GEN4・Workerは変更しない。

## 再現性と品質

新規の人工archive検査はhash/size不一致・危険pathの拒否、symlinkの非追跡、未展開、保存一覧と今回の限定判断の整合を確認する。[既存の実行台帳](../EXECUTION_LEDGER_20261020.md)と[WSL観察](../WSL_PARENT_PLAN_20261020.md)を履歴として保持し、本書の結果を最新追補とする。

```bash
python3 tools/research/g5-runner-topology/test-inventory-package.py
python3 tools/research/g5-runner-topology/test-inventory-host.py
```

JSON・配布file名・path・hash・field・exact commandは機械定義の例外である。通常説明文と見出しは日本語とし、観察・測定・仮定・未確認を分ける。CI・レビュー・main統合の実際の状態はPR記録で確認する。

ローカルでは新規archive検査3件、既存host観察4件、runner保存照合3件、現在用監査8件が合格した。公開配布archiveのbyte数とhashを取得後と一覧生成後に照合し、保存一覧の通常file数・byte和・link分類とmetadataの結合を検査した。対象の人間向け9文書の新規部分に、英語だけの説明見出し・通常説明文、壊れた相対リンク、意図しない既存code block・canonical情報変更は0件。git diff --checkも合格した。これらをWSLでの実OS試験・全工程成立の証拠にはしない。
