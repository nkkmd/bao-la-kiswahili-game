# host全資源包絡の実cgroup確認

実装head `a2295907bcf1c0e1cdbd02527a7d85846e1adf5d`、tree `079893ae9769bf6774a36e6b14a6a52ffd1779ec`の[run 38382747651](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38382747651)は全stepが合格した。同headのPR側12ワークフローもすべてsuccessだった。取得APIはPR側一覧であり、全push側を含む一覧という主張ではない。

| 固定文字列の技術case | kernel memory.peak（byte） | 停止と保存 |
| --- | ---: | --- |
| 通常 | 28618752 | 完了・10行prefixと終了mirror保存 |
| 離脱子 | 29839360 | 子process停止、技術未完・再開不可、10行保存 |
| worker OOM | 1073741824 | OOM kill 1・SIGKILL、技術未完・再開不可、10行保存 |

host、worker、Git、mirror、検算と離脱子は同一cgroupにあり、networkなし・pids32・追加swap 0を確認した。15単体検査、48入力・706保護入力のhashと実GitHubの保存snapshot整合性が合格した。科学の全workloadを実行した結果ではない。

artifact `11803598238`、ZIP SHA-256 `35fc6df6e73f47191c1a61edd0758c55487209a0771d7df021fddabfb078c78b`を取得照合し、全80 fileを[圧縮証拠](results/CI_TECHNICAL_EVIDENCE.json.gz)へ保持した。3 caseすべてでprefixの順序・hash chain・固定recordと、Git objectのSHA-1・型/長さ・復元byte、mirrorの一致を独立確認した。[CI結果](results/CI_RESULT.json)と[receipt](results/CI_RECEIPT.json)、[出力binding](results/CI_OUTPUT_BINDING.json)を別固定し、元入力manifestを付け替えない。

[初回Git欠落の失敗](results/CI_INITIAL_FAILURE.json)と実UNKNOWNエラー、CAS拒否理由未確認を保持する。cgroup内prefixのGit blob復元と、実GitHubのregistryをraw Git objectから復元する未完課題を区別する。科学hostの全範囲配備、全write容量強制、host自身のOOMと外部保存、起動から外部検算までのhard deadline、実remote通信・最終科学freezeとtriggerは未完である。科学seed 0・科学leaseなし・科学Study未登録/未実行、正式関係・main/公開AI未変更を保持する。
