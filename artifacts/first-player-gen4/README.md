# AI-GEN4先攻・後攻差追加研究の成果物

全17,768局と最終検証が完了し、集計・検証JSONと全証拠を研究ブランチへ保存しました。[最終報告](../../doc/first-player-gen4/FINAL_REPORT.md)で科学的結論と限界を確認してください。main統合済みです（PR #178）。

## 集計と検証

- [本試験の機械集計](results/formal-summary.json): 16,384局、8領域。
- [予備試験の機械集計](results/pilot-summary.json): 352局。正式結論へ混ぜません。
- [開局長感度分析](results/sensitivity-summary.json): 1,024局。
- [標準初期局面診断](results/diagnostic.json): 8局、推測統計の独立標本数0。
- 別言語検算: [本試験](results/formal-independent-verification.json)、[予備試験](results/pilot-independent-verification.json)、[感度分析](results/sensitivity-independent-verification.json)。全て合格ですが、ルールと区間計算の独立実装ではありません。
- [自動集計表](results/REPORT.md): workflowで生成した原文を保持します。最終的な日本語解釈は最終報告に記録します。

## 結果確認後の補足集計

[棋譜の記述的集計](trajectory-descriptive.json)は、元ZIP内の正式expert各2,048局について、Mtaji到達、NYUMBA所有、reserve、延べ捕獲数、初手別件数、探索深度・時間を集計したものです。`DESCRIPTIVE-POSTHOC`として主要判断から分離し、元の集計・ZIP・保存索引は書き換えていません。捕獲数は序盤8手を除いた継続部分の延べイベント数です。

## 全証拠の圧縮保存

[保存索引](ARCHIVE_INDEX.json)に元run・artifact・各ファイルのSHA256を記録しています。元ZIPは119,019,846 bytes、SHA256は`fa31ed8f35f445be46dcdaae53468fced91c44233b541e53845ef57a223e55d2`です。

GitHubの単一ファイル制限に収めるため、元ZIPを16MiB単位の8分割で[圧縮証拠ディレクトリ](archive/)へ保存しました。数値順に連結すると元ZIPの全byteを復元できます。棋譜・探索統計・座席・seed・出典・hashと、元artifactの階層を保持しています。

[保存専用run 37194651908](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37194651908)は元の科学runの成功と固定ソースcommit、ZIPのdigest、各分割hashを確認して保存しました。科学対局の再実行や集計値の変更は行っていません。元Actions artifactの90日保持期限に依存せず、Git履歴から再取得できます。

具体的な復元・検算手順は[再現手順](../../doc/first-player-gen4/REPRODUCIBILITY_INDEX.md)を参照してください。機械JSON・自動生成表・元ZIPは科学的な記録として保持し、解釈を理由に書き換えません。
