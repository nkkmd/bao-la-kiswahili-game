# 全起動・保存工程の監督 — 技術台帳の検証

## 現在の判断

状態は`TECHNICAL-LIFECYCLE-LEDGER-PASS-OS-ADAPTER-PENDING`。単一時計と資源計数の台帳を、注入した既知fixtureで検証した。科学source、seed、lease、実remote取引は生成しない。BEFCS-STUDY1と正式関係は未登録・未実行である。

この台帳の合格は、全工程を実OSで監督できたことを意味しない。`wholeLifecycleOsProven: false`と`scientificExecutionAuthorized: false`を返し、科学実行条件を開放しない。

## 確認した未完条件

既存の第3版では、workflowのcheckout・Node準備・物理領域準備がrun.cjsより前にあり、Actionsへのartifact保存がその後にある。run.cjsのserviceで開始する時計と親cgroupだけでは、外側の工程を覆わない。旧結果の`wholeStartupArtifactDeadlineProven: false`を保持する。

[既存技術契約](../befcs-remote-stop-v3-20261014/TECHNICAL_CONTRACT.md)と[現在の再開位置](../RESUME_HERE.md)を出発点にし、旧fixture・原結果・manifest・上限は変更しない。

## 今回固定した技術条件

- checkout前から保存先のACK確認まで、同じ開始時刻と同じscope識別を使う。時計の逆行・scope切替を拒否する。
- checkout、準備、work、終了、保存の順序を守る。保存処理が20分の期限へ達した場合も未完とする。
- 既存の20分・終了予約180秒・1 GiB・256 MiB・終了容量予約16 MiBを拡大しない。通常処理は予約境界で停止する。
- supervisor・checkout・worker・transport・preserverの全役割とcontroller自身の計数を要求する。親memory hard limitとswap無効、kernel peakと計数範囲の完全性を検査する。
- workspaceとremote保存量を合算する保守的な台帳とし、remote累積量とmemory peakの巻戻しを拒否する。実scopeでの正確なstorage分類はadapterの契約で別途固定する。
- 完了にはwork停止、管理下の子プロセス停止、保存先ACKとdigestを要求する。模擬ACKを実保存の証明へ昇格しない。

[実装](../../../tools/research/g5-befcs-lifecycle/ledger.cjs)は既存上限だけを読み、科学API・PRNG・solverを読み込まない。[10検査](../../../test/g5-befcs-lifecycle.test.cjs)で通常順序、checkout遅延、保存期限、監督漏れ、memory peak、合算容量、時計/scope、停止/ACK、科学分類/増枠拒否、累積計数の巻戻しを検証した。

## 次に必要な実OS adapter

1. checkout前に作る単一scopeへ、bootstrap/controller自身と全子プロセスを収容する。scope作成前の処理・計測工具・runnerとの境界も明示し、対象漏れを0件とする。
2. 単調時計の開始点を外側bootstrapまで移し、hard stop、予約時間、最初の停止理由を全工程で共有する。watchdog自体の異常も検査する。
3. 実checkout・圧縮・Git・転送・終了回収を同じ資源管理へ接続する。checkoutと保存証拠の予算範囲を最終契約で明示し、現在repo全体がそのまま256 MiBに収まると仮定しない。
4. 通常・checkout遅延・保存応答欠落・memory超過・容量超過・停止失敗を既知技術fixtureで検証する。期限後の回収は未完として保存し、通信失敗をretryしない。
5. GitHub Actionsの別技術経路で実強制停止と保存証拠を取得し、独立検算する。科学seedに接触する前に、この条件を満たす。

今回の台帳とfixtureは上記adapterの代用品ではない。全OS工程の成立後も、科学API/初期状態/途中closure・microstate停止証拠の結合、最終仕様・認可・hash・CI・専用triggerの固定が残る。

## 再現と品質

```bash
node --test test/g5-befcs-lifecycle.test.cjs
```

新規説明2文書は日本語で、英語だけの見出し・通常説明文は0件。field・ID・path・commandは機械定義の例外である。旧科学入力・原結果・認可状態は変更しない。実行結果と相対リンク監査はPRで記録する。

## 実OS fixtureの接続

os-fixture.cjsと専用Actionsを追加した。既知の小さなGit fixtureを作成・cloneし、workの記録、fsyncしたローカル保存先と別プロセスによるdigest照合を同じ専用unit内で行う。通常、128 MiBの子cgroupでのOOM、保存ACK欠落の3 caseを使う。親1 GiBとswap無効、kernel memory peak、controllerのscope所属を実fileから確認する。OOMは技術故障の注入であり、科学workerの資源適合を証明しない。

専用unit名以外・別unit・root cgroupを拒否する検査を追加した。ローカルでは既存10件と合わせ11件が合格した。この環境のPID 1はsystemdではないので、実cgroupの合格はActionsの原logとOS_RESULTで確認した。取得後の確定記録は次節を参照する。

workflowの初回checkout・Node準備・systemd起動と、Actionsのartifactアップロードは監督scopeの外にある。ローカル保存先は外部Git/Actions保存先ではない。したがって実OS fixtureが合格しても、外側bootstrap・外部保存ACK・全起動の単一時計・全作業領域の物理容量上限は未完である。OS_RESULTにもこの未成立を記録する。実行器は科学API・認証・ネットワークを使わない。

## 実OSの取得後検算

[push実行38739433923](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38739433923)はhead `9a4591d459107eba18ae6063c900c5731fa9d002`・attempt 1で3 caseと保存stepが成功した。[来歴と入力hash](CI_RECEIPT.json)、os-resultsの原ZIP3件と展開したOS_RESULT、[独立検算結果](OS_VERIFICATION.json)を保存した。各原ZIPはGitHub metadataのdigestとbytesに一致する。

| case | 実測parent peak | 終了判断 |
| --- | ---: | --- |
| 通常 | 29,908,992 byte | ローカルfsync保存・別プロセスdigest照合まで完了 |
| 子OOM | 150,966,272 byte | 子SIGKILL・未完を保持 |
| ACK欠落 | 30,355,456 byte | 保存データが存在しても完成へ昇格しない |

3 caseのfixture合格は、3 caseの処理完成を意味しない。外側bootstrap・Actions uploadの範囲は未成立のままである。ZIPにはhiddenな.git objectを含めておらず、Git履歴の完全保存の証明として使わない。小さい既知cloneを実行した技術検証に限る。

```bash
python3 tools/research/g5-befcs-lifecycle/verify-os.py
```

この検算器は原ZIPのhash、固定入力、保存されたcase・停止・local sink・完了条件を照合する。元OS実行や科学sourceを再実行しない。
