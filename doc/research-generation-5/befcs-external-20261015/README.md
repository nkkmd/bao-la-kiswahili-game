# 同一scope内の外部保存 — 科学未実行の技術検証

## 目的と範囲

専用cgroup内で既知Git fixtureのcheckout、固定データ作成、GitHub技術refへの保存と読戻しACKを単一時計で監督する。科学source・seed・lease・候補・閉包を生成しない。固定データは`fixtureVersion: 1`と`scientificSeedsRead: 0`だけであり、別contentは通信前に拒否する。

実行は指定repository・専用branchのpush・attempt 1だけに限定する。保存先は`refs/heads/research/g5-lifecycle-preservation-<runId>-a1-<mode>`という新規技術refで、main・旧ref・科学registryを更新しない。GitHub APIのblob・tree・独立commit・新規ref作成を各1回だけ行い、force更新・削除・通信retryはしない。認証情報をresultやjournalへ書かない。

## 検証する2ケース

通常caseは保存したref・commit・blobをGETで読戻し、固定内容が一致した後にだけACKを与える。ACK消失caseはref作成後に応答を抑止する技術注入であり、refが存在していても未ACKとして処理を完了させない。実通信で応答消失を観測した結果とは区別する。

journalにはAPI操作前のfsync記録と認証情報を含まないAPI応答を保存する。同じscopeのkernel memory peak、全phaseの時刻、ローカル使用量、API要求/応答byte累積を記録する。API byte数はGitHub側の物理保存量の測定ではなく、全保存費用の証明へ昇格しない。

## 維持する未完条件

外側bootstrap・初回Actions checkout・Node準備・systemd起動・Actions artifact uploadはまだscope外である。全物理作業領域のhard cap、外側全工程を含む単一時計・全資源条件は未成立であり、`wholeLifecycleOsProven: false`と科学実行未認可を維持する。

実OS3 caseの[先行検証](../befcs-lifecycle-20261015/README.md)と原証拠を変更しない。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・科学leaseなしのままとする。

## 検証方法と品質

```bash
node --test test/g5-befcs-external.test.cjs
```

通信前拒否、固定内容以外の拒否、通信retryの不在、未ACK、読戻し後だけのACKを既知fixtureで確認する。実GitHub/cgroupの結果はActions終了後に保存し、成功を先取りしない。

本文・見出しは日本語で、ID・field・path・commandは機械定義の例外である。旧凍結入力・原結果・認可状態を変更しない。

## 実行と取得後検算の確定

[Actions 38743877526](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38743877526)はhead `e99c05de09a67b8505dc768b3ce485dd7e54b943`・push・attempt 1で通常とACK抑止の2 case、原artifact保存とも成功した。[来歴と固定入力](CI_RECEIPT.json)、resultsの原ZIPと原RESULT、[別経路のremote読取](REMOTE_INDEPENDENT_READ.json)、[独立検算](VERIFICATION.json)を保存した。ZIPのbytesとSHA-256はGitHubの原artifact metadataに一致する。

通常caseは約2.326秒・parent peak 45,658,112 byteで、4 POST後の3 GETにより保存内容を確認した。ACK抑止caseは約2.062秒・44,781,568 byteで、refが存在していても未ACK・未完のまま終了し、再POSTは0件だった。2技術refは削除せず来歴として保持する。いずれも固定技術データだけで科学seedを含まない。

```bash
python3 tools/research/g5-befcs-external/verify.py
```

検算器は原ZIP・API操作順・保存blob・別経路の読取・ACK/未ACKを照合するだけで、元の取引を再実行しない。固定fixtureの外部保存が確認できたことと、全起動/物理容量/Actions uploadの未成立を区別する。
