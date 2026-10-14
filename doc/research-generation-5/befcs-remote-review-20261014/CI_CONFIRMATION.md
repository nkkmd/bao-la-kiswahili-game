# 保存証拠のCI確定

入力head `6b432c1dadd64e054b296e756247ee7bff6f2762`、tree `0cedcfca9be497ae2c69de9cc031c013fd8b8e7e`のPR13実行・push1実行、全14 workflowがsuccessとなった。ローカルのstaged treeとGitHub treeも一致した。

保存証拠の専用CIはPR run `38484804731` / job `115595755902`、push run `38484775356` / job `115595659590`で、全stepがsuccessだった。両jobで改変拒否2検査、旧入力binding、原ZIP10件・4431 member・53692694 byte、各caseの独立registry/ACK/source/prefix検算と保存済みJSONの一致を確認した。

[CI receipt](CI_RECEIPT.json)にhead・event・attempt・run/job provenanceを固定した。2つのCI_JOBテキストはdecoded job logの原文であり、英語を残すexact-output例外である。CI_OUTPUT_BINDINGにそのbytes/hashを別固定し、元のBINDINGS・実験入力・原結果を付け直していない。

このCIは保存済みbyteの読取りだけであり、実remoteへのfixture取引や科学sourceを再実行していない。第1版期限と第2版2 caseのfailureをそのまま保持する。修正版全体の実Git技術合格、全起動保存予算の証明、科学実行の開始を意味しない。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全合法手完全閉包・未知・不足時終了・救済禁止・正式関係未登録/未実行・主課題・main/公開AI未変更を維持する。[次の再開位置](RESUME_HERE.md)を参照する。
