# PBAI-P5 — 準備と実行の再現手順

## 開始前に実施した準備確認（履歴）

本Programは完了済みである。以下は準備時に実行した履歴であり、現在の測定再開手順ではない。--self-testは一時ディレクトリ内の人工プロセスだけを使い、期限停止・再開始拒否・失敗時の後続停止を確認する。--preflightはbyte同一性、Node/Linux環境、開始marker不存在を確認する。

```sh
python3 tools/engineering/supervise-pbai-p5.py --self-test
python3 tools/engineering/supervise-pbai-p5.py --preflight
```

測定器・独立検算器はP4の検証済みsourceを複製してP5の窓口へ限定適応した。変更は保存先、seed、既知データ除外、監視器経由の起動に限定し、HARNESS_PROVENANCE.jsonに元sourceのhashを保存した。ルール処理はpublic/engine.jsの共通実装をそのまま使う。数量再生器も既存の独立処理を参照する。

## 1回だけ使用した正式開始の窓口（再実行禁止）

次のコマンドは外部workflowの内部窓口であり、準備やローカル環境からは実行しない。開始指示後はPR #108にpbai-p5-start-once labelを付ける。実行前にCPU競合、node version、永続保存先へのアクセスと空き容量を確認し、固定したGitHub-hosted ubuntu-24.04環境を使用する。

```sh
python3 tools/engineering/supervise-pbai-p5.py --start
```

監視器が正確性→development→独立検算→validation→独立検算→holdout→独立検算を順に実行する。計算中の手順確認待ちは挟まない。各検索の既存deadline・各局5分上限に加え、外側から4時間で全子process groupを止める。Node heapは2048MiBに制限する。

終了時のRUN_FINAL.jsonは運用上の完了/停止を示す。科学的判断は最終independent-metrics.jsonと固定gateを照合する。コマンド失敗のHOLDは候補不正確・速度不成立等の原因を覆い隠すものではなく、logと未成立gateを別途記録する。実装の不一致が確定すればPROTOCOLのREJECT分類を優先する。停止後の記録整理で、時間内に未成立だった工程を完了扱いにしない。

## 完了後の保存

各stageの全JSON、seed監査、開始marker、log、独立結果、監視器の開始・終了記録をarchiveに保存しSHA-256を付ける。チャット中断でもプロセスが生存していれば同じrunを監視する。強制的な環境消失後に再試行する仕組みではない。実行中は成果物をcheckpointとして保存し、完了済みseedを再測定しない。

実機ブラウザーと公開配信は未確認である。VM/worker_threadsの既知互換性はP4の証拠であり、新しい速度や棋力の証拠へ混ぜない。

## 自動保存と短い状態照会

[追補契約](EXECUTION_CONTRACT.md)と[再開文書](RESUME_HERE.md)を参照する。正式jobは開始labelのlabeledイベントに限る。workflowはmain未統合のまま準備する。claimと保存先への初回書込みが失敗した場合、新規seedを開かず停止する。準備CIの人工試験は実通信・実際の保存権限を検証したという意味ではない。

## 完了した証拠の検算

次は保存済みデータだけを再構成し、時間測定や対局をやり直さない。最初の監査がarchiveのhashを確認し、runを展開する。

```sh
python3 tools/engineering/audit-pbai-p5-results.py
node tools/engineering/verify-pbai-p5-stage-independent.js development --check
python3 tools/engineering/verify-pbai-p5-metrics-independent.py development --check
node tools/engineering/verify-pbai-p5-stage-independent.js validation --check
python3 tools/engineering/verify-pbai-p5-metrics-independent.py validation --check
node tools/engineering/verify-pbai-p5-stage-independent.js holdout --check
python3 tools/engineering/verify-pbai-p5-metrics-independent.py holdout --check
```

実行時のsource・PROTOCOL・追補契約・PREPARATION_LOCKを維持した。archive本体と全構成ファイルのhash、期限、10コマンド完了、独立結果を検算する。公開変更はこの検算に含めない。
