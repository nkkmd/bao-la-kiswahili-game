# PBAI-P5 — main統合前の追加監査

状態: `PASS / PUBLIC-INTEGRATION-AUTHORIZED / GENERATION-PROMOTION-NOT-AUTHORIZED`。2026年9月6日の結果確認後、ユーザーはPRレビュー、main統合、公開AIへの反映を進めるよう明示しました。この追加認可は、事前固定した科学的判定を変更せず、公開前の回帰確認と段階的な配信を許可します。`AI-GEN3`への正式昇格は別判断として保留します。

## 未解決レビュー指摘の確認

PR #107と#108の指摘をmain統合前に再確認しました。

### 実行環境

旧`PROTOCOL.md`はAMD EPYC 9V74を指定しましたが、科学的開始前に凍結した[実行追補契約](EXECUTION_CONTRACT.md)が、実行環境に限ってGitHub-hosted `ubuntu-24.04`、Linux x64、Node v24.19.0へ置き換えています。CPUモデルは固定できないため記録対象としました。正式runはLinux x64、Node v24.19.0、AMD EPYC 7763で実行され、追補契約に一致しました。9V74以外を拒否しなかったことは契約逸脱ではありません。

### 測定依存の固定範囲

`PREPARATION_LOCK.json`が次の推移的依存を列挙していなかった点は、事前固定の完全性に関する不足です。これを事後に「固定済み」と読み替えません。

| file | SHA-256 |
| --- | --- |
| `tools/engineering/lib/pbai-p4-common.js` | `2e78220b7f4cd8e2b93ec53f456a07efc131c93f9a542e06721acdb1a156b44d` |
| `tools/engineering/lib/pbai-p4-event-verifier.js` | `e35272063b5e50675982ea71a3b92a045ff029b0b8d9760678f74016f4159839` |
| `test/tactical.test.js` | `14af832389a31f441c8ba0dc6f70cceb57fcd65d9c11ed27af5e93de7ef980bf` |

ただし、P4の候補HEAD `2d77792220af80ca2700bd0b3c0ab8e45197c24e`、P5の実行HEAD `b7ec229a7b34eb9266d4bc19506f3e0cd550004b`、P5の最終報告HEAD `cf9d20c0a7f64d6b73b35bf4251f2d8b4fec1ddf`の3点で、これら3ファイルと`public/engine.js`、`public/ai.js`はbyte単位で一致しました。実際のrunにsource driftはありません。完了証拠監査には、この履歴上の同一性を明示的に検査する処理を追加しました。

### VM・Worker回帰

P5の監視器command listに`test/pbai-p4-transitions.test.js`を含めなかった点も明示します。P5のbaseであるP4 HEADに対し、正式開始前のActions run `34025809753`で同じhashのテストを実行し、VM/global script、実`worker_threads`、キャンセル、feature境界がPASSしていました。P5の候補sourceとテストはその後変化していません。

公開前の追加gateとして、2026年9月6日に同テストを改めて実行し、PASSを確認しました。これは科学的測定の再実行ではなく、P5 Stage Dより前に実行したと事後に主張するものでもありません。結果の適用範囲は、実行時に同じsourceと依存が使われたこと、既存回帰が正式開始前に同一sourceでPASSしていたこと、公開前の現行HEADでもPASSしたことです。

## 統合判断

中央索引の更新日、Program ID列挙、PBAI-P5行の不足を修正しました。科学的seed、対局、時間測定は再実行していません。P4の`HOLD`、P1〜P3とC001〜C010の正式結果、P5の固定数値と証拠hashは変更していません。

公開前の残りは、候補をhard/expertの既定Bao探索だけで有効にする設定、PWA cache更新、通常経路とflag-offの回帰、Worker経路、実ブラウザーでの読み込み、main統合、配信asset同一性の確認です。問題があれば候補flagをfalseへ戻すcommitをrollback targetとします。
