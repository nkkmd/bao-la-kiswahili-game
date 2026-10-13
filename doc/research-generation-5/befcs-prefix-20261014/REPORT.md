# 保存prefixの技術報告

## 目的と変更

先行の期限停止fixtureは保存prefixを保持したが、完全source検算器では`stop`が`null`のsnapshotを扱えず、検算を完了扱いにしていなかった。本工程では新しい検算器を別pathへ追加し、journalに保存されたstep・screenだけを検算する。既存source生成器・完全source検算器・旧記録は変更しない。

## 技術fixtureの結果

| 停止位置 | 保存step | snapshot step | 保存screen | snapshot screen | 保存の分類 |
| --- | ---: | ---: | ---: | ---: | --- |
| checkpoint前のSIGKILL | 2 | なし | 0 | なし | journalのみ |
| 古いcheckpoint後のSIGKILL | 10 | 8 | 0 | 0 | checkpoint以後2手だけ保存 |
| screen48直後のSIGKILL | 48 | 48 | 1 | 0 | screenをsnapshotへ補わない |
| 次のstep直後のSIGKILL | 49 | 48 | 1 | 0 | 未保存screen49を生成しない |
| 管理資源停止 | 10 | 10 | 0 | 0 | failure snapshotと未知を保持 |

新規試験は、PRNG/metadataの改変、hashを付け直した欠落screen、receipt差替え、snapshot改変・候補/完了への昇格、read ledgerのRAW改変・coverage欠落・未許可RAWを拒否する。未完の末尾はbyte数とhashを別記録し、保存済み完全行へつなぎ直さない。科学入口の拒否は入力getter・PRNG・遷移の前に成立する。

ローカル結果と全入力bindingは[結果入口](results/README.md)へ保存した。[CI確定](CI_CONFIRMATION.md)でPR12＋push1の全13実行、18検査・5 case再実行・artifact保存のsuccessと取得ZIP全2メンバーのbyte一致を確認した。実行入力・旧manifestを変更せず、取得証拠を別bindingへ保存する。

## 初回開発診断の保持

最初のテストはsparse checkoutで`public/engine.js`、次の試行は`tools/takasia/fixtures.json`が未展開のため失敗した。これらはfixture開始前の読込エラーであり、科学seedの消費・科学実行失敗ではない。依存pathを展開してから再検証した。先行binding照合も未展開の`.github/actions/`に対してENOENTとなったため、展開後に照合した。失敗を成功結果へ付け替えない。

## 解釈と残る境界

判断tokenは`SAVED-SOURCE-PREFIX-FIXTURE-PASS-SCIENCE-GATES-PENDING`である。保存された抽象source prefixの独立検算に合格し、科学用ゲートが残ることを意味する。新しいBao source・科学seed・候補・全閉包・勝敗価値差は得ていない。

合成receiptの照合は実remote ancestry/CASの証明ではない。保存余剰readのRAW復号は、未保存screenやmicrostate停止witness全体の完成を証明しない。途中closureの完全検算、科学hostとの配線、最終固定API/初期状態、全資源・起動からartifact保全までの期限、最終SPEC/CONTRACT/AUTH/hash/review/別triggerが残る。

既読遮断103355、全合法手完全閉包、未知、不足時終了、追加・差替え・旧root延長・予算増加・retry禁止を保持する。正式関係未登録/未実行、主課題の勝敗価値損失、main・公開AI未変更である。
