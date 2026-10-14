# 運用preflightの保存結果

RESULT.jsonはローカル固定fixtureの判断、TECHNICAL_EVIDENCE.json.gzはGit bundleと履歴・mirror照合、EXECUTION.jsonは時計・合算RSS・強制終了の実測を記録する。OUTPUT_BINDINGで元byteを固定し、`run.cjs --check`で独立復元する。

Dockerの実cgroup receiptはActions artifactから別記録へ保存する。現在のRESULTの確認待ちtokenは当時のローカル状態として保持し、後続receiptによって補足する。科学seedやBao局面の証拠は含まない。科学登録・実行は未実施である。
