# 第五世代研究の中間保存 — 2026-10-14

更新日: 2026-10-14（日本時間）
状態: **中間保存・main統合対象／第五世代全体は継続中**

## この記録の意味

ユーザーから現在状態の記録とmain統合の指示を受け、研究ブランチの終了済み結果と技術検証を一つの再開点へ整理した。統合元はPR #204のhead `a5014f79b300d3e5731aa272e4c6cb0d16baa350`、統合前mainは `6decdd2bb3979d96420e4da6ff4592be70c8d6c4` である。統合の実際の完了はPRのmerge記録を正本とする。

G5-01〜G5-05の供給研究は終了済みで、G5-03とG5-04の計16完全領域・214状態・199辺を保持する。主要課題に必要な手間勝敗価値差は観測されず、G5-05の8候補は全閉包未完・価値差未確定である。`PRIMARY-READINESS-NOT-MET` は開発上の準備条件未成立を意味し、正式な仮説否定ではない。BEFCS-STUDY1と正式な順位変動・勝敗価値損失の関係検証は未登録・未実行である。

今回の保存・検算では科学sourceを生成せず、BEFCSの科学seed消費0・科学leaseなしを維持する。公開ゲーム、公開AI、収集Workerのbytesは統合前mainと同じである。第五世代研究全体の終了、BEFCSの科学実行開始条件の成立、公開AIへの採用を認定する記録ではない。

## 第3版の実Git・停止検証の確定

[原CI実行](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38497935805)は上記head・push・attempt 1で成功した。PR側12件とpush側1件の全13ワークフローがsuccessである。5原ZIP・43,364,710 byte・3,361 fileのarchive digestと全member hashを照合した。生Git bundleを別repositoryへ復元し、registry履歴・読取前ACKの祖先関係・最後のmirror・source journal・停止prefixを独立に照合した。第3版専用検算器による判定とも一致した。

| 技術case | ACK | remote完全source | ローカル完全source | 保持する判断 |
| --- | ---: | ---: | ---: | --- |
| 通常 | 128 | 128 | 128 | 抽象例1閉包・最終mirror・処理完了 |
| host OOM | 1 | 0 | 1 | 停止確認・再開拒否、供給は未完 |
| 応答抑止 | 0 | 0 | 0 | consume marker 1・未ACK 1、書込み拒否・未完 |
| 期限 | 6 | 6 | 6 | 30秒短縮期限前にwork/control停止、期限後回収・未完 |
| 最終mirror拒否 | 128 | 126 | 128 | ローカル抽象例1閉包、remote最終保存なし・未完 |

5 caseのfixture判定成功は、5 caseすべての処理完成や期限内完了を意味しない。期限caseはCOMPLETED記録なしで、回収が期限後である。最終mirror拒否caseはremote完全sourceが126件に留まり、128件の保存完了へ昇格しない。各caseの終了・停止・未ACK・nullを原記録のまま保存した。旧第1・第2版の10原ZIP・失敗3件は変更せず、成功を旧版へ付け替えない。

## 再開前に残る工程

1. 外側checkout・起動・終了・artifact保全までの全資源と単一時計を検証する。親1 GiB内の技術合格だけで全実行予算の成立を認定しない。
2. 科学reference API・初期状態・独立source再生と全合法手閉包を接続し、途中closure・microstate停止証拠を検算する。
3. 最終SPEC・CONTRACT・AUTHORIZATION・全入力hash・CI receipt・実行前レビュー・科学専用triggerを相互照合して固定する。
4. 条件成立後に、新規128 sourceの全区画取得・読取前consume・attempt 1の一度限り供給を実施し、最大8候補の完全閉包・厳密解・独立検算を記録する。
5. 勝敗価値差と情報量による準備成立を判定する。不足なら不足として終了し、結果を見て候補・seed・上限を追加しない。
6. 正式検証へ進める場合は開発用と分離した新規対象、探索条件、推定可能性と判定を事前固定し、主要関係と成立範囲を調べる。
7. 結果が確認・非確認・推定不能のいずれでも、終了条件に従って報告・再現性・関連文書を監査する。

103355件の保守的既読遮断、全合法手完全閉包、未知の保持、不足時終了、旧root/witness延長・候補差替え・追加・予算増加・再試行の禁止を保持する。主課題をDTFへ差し替えず、有限開発結果へIIDや一般Bao局面の推論を適用しない。

## 凍結入力と現在の文書

[統合範囲](INTEGRATION_SCOPE.json)に元head、変更可能な現在案内、14本の旧技術CIの入力コミットを示す。元の中央文書9件と旧workflow14件のbytesは[原案内snapshot](HISTORICAL_NAVIGATION.json.gz)に保持する。過去文書の「main未統合」は各記録作成時点の状態であり、現在の統合状態は本記録とPRを参照する。

旧技術CIは当時のコミットをcheckoutして凍結fixtureの入力hashを照合する。旧manifest・原結果へ現在のhashを付け直さない。現在treeの全元ファイルについて、現在案内と説明済みworkflow更新を除き元headとのbytes一致を統合CIで検証し、現在コードの全技術fixtureも検査する。この中間保存から実remote取引・科学workflowを起動しない。

## 保存証拠と読み方

- [原実行metadata](CI_RUN.json)、[job・step結果](CI_JOBS.json)、[全13実行](CI_HEAD_RUNS.json)、[artifact metadata](CI_ARTIFACTS.json)
- [5 archiveの一覧](ARCHIVES.json)。各results配下に原ZIP、全file hash、二経路の検算JSONを保存した。大きい2件のZIPは転送上限に対応する順序付き分割片で保存し、ZIP_PARTS.jsonの順に結合すると元のbyte列・hashへ完全一致する。
- logs配下の6圧縮job logは取得したdecoded原logである。英語・空白はexact-output例外として保持する。
- [品質・統合監査](QUALITY_AUDIT.md)
- [研究の現在状態](../CURRENT_STATUS.md)、[次の再開位置](../RESUME_HERE.md)、[研究入口](../README.md)

ID・field・hash・path・command・原Git/logはcanonicalまたはexact-outputの例外である。説明と判断の意味は日本語で記述する。

## 分岐したPR履歴の扱い

[履歴照合](PR_HISTORY_RECONCILIATION.json)でPR #181〜#204のheadを確認した。23件は元head a5014f79の祖先である。PR #202だけは、元の第2版67984fa9から分岐した追補head `4bf0e33e6785367495b143950027b9f989050f57`へ進んでいた。GitHubの保存済みheadには第3版修正が存在するため、PR本文の「67984fa9に第3版はない」を最新headへ一般化しない。

この追補は旧第2版pathを直接変更する別系統であり、現在採用するのは旧入力を保持して別pathへ第3版を置いたPR #204と本中間保存である。追補28 fileのblobを履歴照合へ固定し、4bf0e33eを統合コミットの親としてGit履歴に保持する。現在treeには追補の直接変更を適用せず、元headの凍結入力・原結果・旧失敗を維持する。追補のCI合格を今回採用した第3版の実Git結果へ付け替えない。科学実行・実remote取引は追加しない。
