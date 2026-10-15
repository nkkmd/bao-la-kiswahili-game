# 第五世代研究 — 現在の状態

> 2026-10-15の再開監査: [保存済みG5-05の重複除外監査](resume-audit-20261015/README.md)で採用35代表・8候補の選定差0件を確認した。旧実行器の不足は保持・記録し、原実行を繰り返さない。現在checkoutの保存監査には[現在用の手順](../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使う。BEFCSと正式関係は未登録・未実行である。

更新日: 2026-10-15（日本時間）
状態: **終了済み供給研究と技術検証を中間保存・main統合済み／第五世代全体は継続中**

## 確定した結果

G5-01〜G5-05は終了済みで、5区画320 sourceの消費と原結果を保持する。G5-03とG5-04の計16完全領域・214状態199辺は独立一致したが、手による勝敗価値差は0件である。G5-05の8候補は完全閉包未完で、価値差は未確定。主要関係の準備判断はPRIMARY-READINESS-NOT-METで、正式仮説の否定ではない。

最新の確定証拠は[中間保存](checkpoint-20261014/README.md)。PR #204のhead a5014f79を元に、第3版の5原ZIP・43,364,710 byte・3,361 fileとGit履歴・ACK・source・停止を二経路で検算した。元headの全13 CIがsuccessである。通常技術caseは128 sourceと抽象例1閉包を保存し、故障caseは未完を保持した。旧第1・第2版の10原artifactと失敗3件は変更していない。

## 未実行と未完の区別

| 対象 | 現在状態 |
| --- | --- |
| BEFCS-STUDY1 | 未登録・未実行。科学seed消費0・科学leaseなし |
| 正式な順位変動と勝敗価値損失の関係検証 | 未登録・未実行 |
| 全起動〜artifact保全の資源・単一時計 | 未完 |
| 科学API・初期状態・途中closure/microstateの統合 | 未完 |
| 最終SPEC/CONTRACT/AUTH/hash/review/科学trigger | 未完 |
| 公開ゲーム・公開AI・収集Worker | 統合前mainとbytes同一 |
| 第五世代全体 | 継続中。中間保存は全体終了ではない |

科学実行前の技術条件が未成立であり、この保存からsourceの生成や旧区画の再実行を行わない。次の安全な工程は[再開位置](RESUME_HERE.md)を参照する。

## 保存と統合

ユーザーの記録・main統合指示に基づき、元headと統合前main、原証拠、凍結入力、現在文書の変更範囲、旧技術CIの入力コミットを[統合範囲](checkpoint-20261014/INTEGRATION_SCOPE.json)に固定した。2026-10-15 00:11:54（日本時間）に[PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205)をmainへ統合した。統合コミットは[44d7daf](https://github.com/nkkmd/bao-la-kiswahili-game/commit/44d7dafefce100e636b86c66136a754e4fbef727)で、統合前CIは32成功・対象外1スキップ、統合後の保存監査と旧研究整合性CIも成功した。[統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)に固定treeと確認方法を示す。旧文書の未統合表示は各記録作成時点の履歴である。

全閉包・未知・103355件遮断・不足時終了・救済禁止・主課題の勝敗価値損失を維持する。DTF差や技術fixtureを正式関係の証拠へ昇格しない。
