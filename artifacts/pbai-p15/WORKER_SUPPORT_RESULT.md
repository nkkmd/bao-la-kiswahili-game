# `PBAI-P15` — Worker再利用 baseline support結果

正式判定: **`BASELINE-SUPPORT-HOLD / KEEP-AI-GEN4`**  
測定run: [GitHub Actions #36420438844](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36420438844)  
preflight PASS: [GitHub Actions #36420017985](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36420017985)  
baseline: `AI-GEN4-BASELINE-2026-09-28-v1` / `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
Candidate ID: 未発行

## 固定条件と証拠

[事前のsupport契約](../../doc/ai-engineering/public-ai-improvement-program-15/WORKER_SUPPORT_SPEC.md)は、公開Workerを毎要求起動する現行経路と、同じWorkerを連続要求に再利用する測定用経路を比較する。探索状態は要求間で持ち越さず、公開sourceも変更しない。64 seed `2026100201..2026100264`を8 shardで処理し、hard/expertそれぞれで有効な後続要求のpaired positionsを192件以上、distinct seedを48件以上必要とした。少なくとも一方の難易度でseed単位の時間短縮中央値5.0%以上かつbootstrap 95%区間下限が正であり、全16 long-sessionのWorker heap gateと取消・再起動gateも通ることが必要だった。

preflightはChromium 151 / Playwright 1.62.1で、Worker targetのCDP isolate heap取得、合法応答、取消・再起動、atomic checkpointを確認した。最初のpreflightのページ側memory API不成立と契約改訂は[判断記録](../../doc/ai-engineering/public-ai-improvement-program-15/DECISION_REGISTER.md)に記録した。preflightでは正式64 seedを使用していない。

## 正式計測

| 指標 | 観測値 | 事前条件・判断 |
| --- | ---: | --- |
| shard / seed処理 | 8/8・64/64、重複0 | 全seedは処理したが、技術状態PASSは4/8 shard |
| 必須plyを欠いたseed | 7 | 欠測を補充しない |
| 後続要求のpaired positions | hard 171 / expert 171 | 各難易度192以上に未達 |
| 計測行のあるdistinct seed | hard 57 / expert 57 | 各難易度48以上は満たす |
| hardの時間短縮中央値 | 13.3375%（95%区間8.0093〜24.9337%） | 標本不足でscreening gate不合格 |
| expertの時間短縮中央値 | 1.2933%（95%区間1.2253〜1.3545%） | 5.0%基準に未達、標本も不足 |
| 64要求に到達したlong-session | 6/16 | 全16件のmemory checkpoint gateに未達 |
| 取消後の応答抑止・fresh再起動 | 8/8 shardで成功 | PASS |
| 公開source hash / public差分 | 固定hash一致、差分0 | PASS |

指定ply 0/8/16/32まで到達しなかったseedは`2026100209`、`2026100213`、`2026100230`、`2026100231`、`2026100246`、`2026100257`、`2026100263`。seedと選定規則を結果後に変更しないため、各難易度で171件にとどまった。long-sessionでは8 shard×hard/expertの16件のうち6件だけが64要求に達し、残りは合法な軌跡が先に終了した。完走した6件の増加値は各上限内だったが、全16件というgateを満たす証拠にはならない。

hardの参考値は、条件を満たした57 seed・171後続局面に限定した観測である。事前の192件と全session memory条件を満たしていないため、F1の成立、一般端末での待ち時間短縮、棋力改善や公開採用を示さない。expertの結果も同じ母集団・runner内に限る。

## 保全と監査

- 正式集計の[canonical JSON](worker-support.json)は、SHA-256 `aef4df69949caa02b2c00e2de97de4cf5955ceebd4d135d97a4e2139f723ef7d`、Git blob SHA `0995aa83d20b78108bb39109f2e8df2122c80c3d`。原本のgate値を書き換えない。
- aggregate artifact `pbai-p15-baseline-support-result-36420438844`（ID `10969451823`、ZIP SHA-256 `158178dd43f2cd462f291aae5094e1f72d547e90304b33bf4ef588f3c089ad3e`）と8つのraw shard artifactを[同run](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36420438844)に90日間保全した。
- raw shardの`rowSha256`を各shardの`samples`・`longSessions`・`cancellation`から再計算し、8/8で一致した。canonicalの64 seed coverage、source hashes、公開差分0、8件の取消結果を独立照合した。
- Actionsの失敗表示は、固定gateが不成立でaggregateがexit code 2を返したことを含む。欠測のあった4 shardは`technicalStatus: FAIL`であり、観測済み部分をPASSと扱わない。

## 工学判断

[Program最終報告](../../doc/ai-engineering/public-ai-improvement-program-15/PROGRAM_FINAL_REPORT.md)のとおり、P15は`HOLD / KEEP-AI-GEN4`で終了する。固定seedを補充・再利用せず、閾値、ply、長時間session条件を結果後に緩めない。Candidate IDの発行、candidate実装、独立validation、release holdout、公開default変更を行わない。別設計を検討するなら、新Program・新しい契約とseedで独立して判断する。
