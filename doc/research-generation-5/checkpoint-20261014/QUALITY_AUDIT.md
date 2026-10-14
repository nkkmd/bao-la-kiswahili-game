# 中間保存の品質・統合監査

対象はmainから元headまでの第五世代研究差分と、今回の中間保存・現在案内・旧技術CIの入力固定である。科学source生成と実remote取引は行わない。

過去の原SPEC・認可・manifest・結果・解・proof・原ZIPは変更せず、元headとのbyte一致と原案内snapshotを確認する。現在案内9件と旧技術workflow14件だけを元headから更新する。公開ゲーム・公開AI・収集Workerのbytesは統合前mainと一致する。

現在コードの技術fixture218件は全合格。第3版5原ZIP・43,364,710 byte・3,361 fileは二経路で検算し、大きい2件は結合後のbyte列・hashが原ZIPと一致する順序付き分割片で保存する。旧10原ZIP・失敗3件を保持する。期限後回収と最終mirror未完を成功した供給へ昇格しない。

英語を残すのはStudy/decision、field、path、hash、commandとdecoded原job log・原Gitのcanonical/exact-output例外である。説明・判断・再開案内は日本語で提供する。元の中央案内は原snapshotと固定コミットで保持し、過去の「main未統合」を現在の表示へ読み替えない。

統合前の専用CIで現在treeと保存証拠を検算する。旧技術CIは各凍結入力コミットをcheckoutして原hashを照合し、現在treeの合格へ付け替えない。科学workflowは起動しない。

## 検証の範囲と結果

- 人間向けMarkdown 251件、相対リンク1040件を検査し、リンク切れ0件。
- 説明済みの作品名・G4-ID見出しを除き、英語だけの説明見出し・検出された通常英文0件。今回の現在案内9件と中間保存・ツール案内の問い・結果・判断・限界・再開条件を日本語で確認した。
- 元headの8760 fileは現在案内9件・旧技術CI14件を除きbytes一致。旧案内とworkflow全23件も原snapshotと元コミットが一致した。
- 公開ゲーム・公開AI・収集Workerの48 fileは統合前mainと一致。元の科学SPEC・認可・manifest・原結果を変更していない。
- 第3版5 ZIP・全3361 memberのhash、Git/ACK/source/停止の二経路検算、旧16完全領域の準備再評価、G5-05の保存済み記述が合格。
- 現在コードの技術テスト218件は全合格。fenced code内の原command・ID・数値・科学認可状態へ意図しない変更0件。原案内のbytesはgzip snapshotで保持した。
- 変更差分のwhitespaceを確認。原ZIP内のlogと圧縮decoded原logはexact-output例外として不変に保持する。

判定: JAPANESE_DOCUMENTATION_QUALITY_GATE = PASS。

統合前CIは新しい中間保存PRで確認する。そのrun・head・merge SHAはGitHubのPR/check記録を正本とし、保存済み原CIや原manifestへ付け直さない。

PR #202の分岐追補はGit履歴と28 fileのblob識別を保存し、現在treeへ直接適用しない。PR #181〜#204のheadの履歴到達性を照合した。現在の第3版と旧版の入力・結果の区別を保持する。
