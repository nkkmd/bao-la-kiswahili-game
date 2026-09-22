# Jev併用Bao AI 棋力判定試験・実行用追加版 v1.0.0

計画ID：`JEV-BAO-STRENGTH-20260921-v1`  
状態：実装・無課金検証完了。ユーザーPCでの有料動作確認・本比較は未実施。

## 比較条件

AI-GEN4単独と、同じAI-GEN4にJevのルート探索順序提案を加えた方式を比較する。Jevの応答・検証・応答保存を終えた後、両者とも2,000msの探索時計を開始する。最大深度12、API待ち上限60秒。評価器・合法手・プロンプト・厳格な応答検証は既存版を維持する。公開AIの変更、正式採用、世代更新は行わない。

設計時の原本は `strength-v1-design/` にそのまま同梱した。原本の「未実装」という表記は設計時点の状態であり、本追加版の現在の状態はこの文書による。開始局面・対局順・統計仕様は変更していない。

| 段階 | 対局数 | 費用区分 | 合格条件 |
| --- | --- | --- | --- |
| preflight | 0局、短い単独探索のみ | API呼出しなし | ソース、履歴、台帳、開始局面、時計の検証 |
| pilot | 2組4局 | 既存pilot枠の累計$0.40以内 | 全4局が有効に終局し、時間・記録の逸脱なし。勝敗は合否に使わない |
| formal | 32組64局 | matches枠の累計$3.50以内 | 全64局が有効に終局してから1回の正式判定 |

512手未決着やrelay-limitは引き分け・敗北に変換しない。探索時間の超過が50msを超える場合も、その着手を保存して停止する。未解決の条件逸脱があれば正式判定を出さない。

## 1. 配置と無課金確認

`bao-jev-strength-v1.zip` を既存の `~/github/bao-la-kiswahili-game` に置く。実験ブランチ、過去の追加版、結果317 JSON、既存予算台帳をそのまま使う。新しいクローンに台帳を作り直さない。

```bash
cd "$HOME/github/bao-la-kiswahili-game" &&
python3 -m zipfile -e bao-jev-strength-v1.zip . &&
node tools/jev-comparison/strength-v1.cjs preflight
```

`status: PASS`、`realApiRequests: 0`、`timeLimitMs: 2000`、`apiTimeoutMs: 60000` を確認する。新試験の開始前は、累計106要求、計上額$0.024455760、未確定予約$0.016515072となる。preflightは既存台帳に課金・予約・実行範囲の登録を追記しない。

`public`、既存試験コード、過去の結果を上書きしない追加版である。すでに設計ZIPを展開していた場合は、同じ設計原本が再配置される。npm installや追加依存ライブラリは不要。実行はNode.js 24以上、結果ZIP作成はPython 3を使う。

## 2. 動作確認4局

既に同じ端末で `TYPESAFE_API_KEY` を設定しているなら、そのまま使う。未設定なら画面に表示させず入力する。

```bash
read -rsp 'TypeSafe API Key: ' TYPESAFE_API_KEY
export TYPESAFE_API_KEY
printf '\n'
```

APIキーをチャット、結果ファイル、Gitに記録しない。次のコマンドから実際のAPI料金が発生する。

```bash
node tools/jev-comparison/strength-v1.cjs run pilot --live
```

初回のlive実行で、既存台帳に本計画の実行範囲を追記する。旧停止・旧再開記録と106要求分の費用を保持し、計画・実行コード・開始局面のハッシュを新しい記録に結び付ける。旧v3の1.5秒API条件を流用しない。

通常の完了表示は `status: PILOT-COMPLETE` と `pilot.decision: PILOT-PASS`。この時点では棋力の優位は判定しない。結果ZIPを作り、確認のため共有する。

```bash
node tools/jev-comparison/strength-v1.cjs export
```

リポジトリ直下に `bao-jev-strength-v1-results.zip` ができる。過去と新試験の結果JSON、予算台帳、追加版の構成ハッシュを含む。APIキーや環境変数、他のGit管理情報は収録しない。同じexportコマンドは同名ZIPを更新する。

## 3. 中断と再開

Ctrl+Cを1回押すと、現在のAPI処理・探索・着手保存が終わってから停止する。API処理中は最大60秒程度かかる。連打せず待つ。2回目は強制終了になる。

| 表示 | 対応 |
| --- | --- |
| PAUSED | 通常の手動中断。同じ段階をresumeで再開 |
| API-PAUSED | 初回通信または応答検証に失敗。保存済みの同じ入力に限って1回追加試行できる |
| RETRY-WAIT | 表示されたretryNotBeforeまで待つ。最低60秒、Retry-Afterが長ければそれを優先 |
| ATTEMPTS-EXHAUSTED | 2回とも失敗。この版では3回目を送らない。結果を共有 |
| CLOCK-DEVIATION | 超過した着手を保持して停止。時間設定や棋譜を変更せず結果を共有 |
| INPUT-LIMIT、ENGINE-LIMIT、UNRESOLVED | 通常AIの代替着手・別開始局面への置換は行わない。結果を共有 |
| BUDGET_STOP | 次の最大予約額を確保できないため送信前に停止。予算を増やしたり台帳を消したりしない |
| STUDY_HALTED、ハッシュ・台帳・履歴の不一致 | 通常のresumeでは解除しない。表示を共有して原因確認 |

動作確認の再開は次のとおり。

```bash
node tools/jev-comparison/strength-v1.cjs resume pilot --live
```

resumeでも、新たに失敗した要求を自動で再試行しない。いったん終了し、ユーザーによる次のresumeを待つ。保存済みの有効回答があればrun/resumeのどちらでもその回答を使い、同一attemptを再送しない。回答保存後・費用確定前の中断も同じ回答から費用記録を完成させる。予約だけ残り回答がない場合は、そのattemptを消費済み・最大額予約のまま扱う。

予期せずプロセスが終了してロックが残った場合は、次のコマンドが同じPCの記録プロセスの終了を確認した場合だけ解除する。

```bash
node tools/jev-comparison/strength-v1.cjs unlock-stale
```

旧ツールは新しい台帳形式を読めないため、本追加版の初回live以後は旧runや旧unlockコマンドを使わない。台帳・記録ファイルを手作業で削除・編集しない。

## 4. 本比較64局

動作確認4局の技術合格後に実行する。途中の勝率を理由に局数・開始局面・手数上限を変更しない。

```bash
node tools/jev-comparison/strength-v1.cjs run formal --live
```

中断後は次のコマンドで同じ対局順から再開する。

```bash
node tools/jev-comparison/strength-v1.cjs resume formal --live
```

全64局完了時の `formal.decision` は `JEV-SUPERIOR`、`BASELINE-SUPERIOR`、`INCONCLUSIVE` のいずれか。未完局または未解決の異常があれば `INCOMPLETE` とする。未完了中は主検定のp値を出さない。1勝1敗の組は成績に残すが、主検定の方向を持たない組として扱う。信頼区間は非同点組でJevが2勝する確率についての区間であり、1局単位の勝率の区間ではない。

所要時間は対局の長さとAPI待ちによる。PCを同じ条件で使い、スリープと重い並行処理を避ける。各局で両AIを新しく作り、同じ初期局面・深度2の準備探索を時計の外で行う。再開時にも同じ準備を行う。開始後のNode版・OS情報・CPU構成の変更は記録の不一致として停止する。

## 5. 費用管理

全試験累計の通常停止額は$4.50、全体上限は$5。未確定費用も含める。pilot累計$0.40、formalのmatches累計$3.50を維持し、他区分の余りは自動移動しない。

料金は2026年9月21日に[TypeSafe公式モデル資料](https://docs.typesafe.ai/models)で再確認した。`jev-1.13.0` は入力100万tokenあたり$0.042、出力無料。最大65,536入力token分の$0.002752512を各送信前に予約する。usageが正常なら確定額へ減額し、欠落・通信失敗なら予約額を保持する。想定を超えるusageは記録して停止する。

この追加版は料金を自動取得しない。日を空けて初めてlive実行する場合は、公式料金が上記と同じことを確認する。違っていれば送信せず、料金設定を再設計する。プロバイダー側で既存の使用上限を設定している場合も維持する。

## 6. 検証内容と限界

同梱の `strength-verification.json` は実装の無課金検証結果。模擬HTTP応答、独立した一時台帳、固定した本物のBaoルールエンジンを使用した。模擬4局の探索深度は検証時間を抑えるため1とし、棋力成績としては利用していない。利用者PCの新条件での対局成功や実API応答の品質を保証する結果ではない。

- 過去106要求の引継ぎ、実行範囲外の予約拒否。
- 応答待ち後も探索に2,000ms、復元した回答でも待ち時間の差引きなし。
- 自動再試行なし、最低待機・Retry-After、同一入力、最大2attempt。
- 不正応答、JSON、通信、HTTP、モデル不一致、usage異常と欠落。
- 予約後・回答保存後・着手保存後の中断と再開、重複送信防止。
- 保存回答の不整合・欠落、予算不足時の送信拒否。
- 模擬4局の完走・再実行、本比較の開始条件。
- 時計逸脱時の着手保持と判定保留、未決着の扱い。
- 無課金preflight、mainブランチや台帳欠落の拒否、過去317 JSONの保持。
- n=1..32の全560通りでp値・95%正確信頼区間をSciPyと照合。

必要なら追加版と過去の結果を配置した後、次の無課金テストも実行できる。通常は上記preflightで進めてよい。

```bash
node tools/jev-comparison/strength-qa.cjs
```
