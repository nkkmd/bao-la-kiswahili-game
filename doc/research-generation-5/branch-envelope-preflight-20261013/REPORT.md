# 分岐包絡供給案の技術検証報告

## 結果と意味

技術判断は`BRANCH-ENVELOPE-FIXTURE-PREFLIGHT-PASS-NOT-SCIENTIFIC-AUTHORIZATION`である。固定fixtureのsource選定、独立再生、全閉包、途中停止、保存・分割・復元が合格した。これは実Baoの新規sourceから完全領域を供給した結果ではなく、科学Studyの登録・実行認可ではない。

| 検証対象 | 結果 |
| --- | --- |
| 新しいsource/保存テスト | 22件合格 |
| 先行BFSの回帰テスト | 9件合格 |
| 固定source fixture | 10件を独立再生。第一代表、全screen、全draw、順序が一致 |
| 完全閉包/停止fixture | 7件を全保存辺・witness・snapshot/journalで検算 |
| 保存bundle | 17件で全片hash・順序・元ファイルhash・解凍bytesが一致 |
| 観測RAW | 532識別、既読への新規追加0、保守的和集合103355 |
| 保護入力 | 555ファイルのbyte hashが一致 |

## source選定の検算

第一適格rootはply 48、後の適格rootはply 50だった。第一rootの子が既読なら候補をnullにし、後へ差し替えなかった。source経路の共有だけでは候補を除外しなかった。個別の応手幅が8以下でも合計17は除外し、合計16は通過した。ply 48の最後のscreen、512 ply上限、整数棄却で最初のdrawを不採用にするケースも独立再生した。

2-ply応手の手内反復と第一代表の後の未知は、source失敗と候補nullになった。保存trace、選定root、後続screen、metadataを改変した例は検算が拒否した。候補の重複、件数不足、未選択rootは補充理由にしなかった。これらは抽象fixtureの処理結果であり、Baoの到達可能性や種別差の価値差を示さない。

## 全閉包・未知・証拠保持

既知Bao forced-winの3状態・2辺は、主/独立BFS、独立二解法、保存復元が一致した。抽象循環の解はrecurrent 2、absoluteWinner/DTFはnullであり、DRAWや0へ変換しなかった。既読RAW・microstate遮断、状態・辺・保存予約域・時間・RSS停止は、解null・不完全区画を保った。

予約域停止の固定例では5状態・5辺と未展開frontierを保存し、独立辺検算とsnapshot/journal復元が一致した。graphが完成した後に全体停止したfixtureでも解をnullへ戻し、区画の解釈完了をfalseにした。完成graphと実行区画の完了を区別する。

## 実容量と中断試験

通常240 MiBを書いた後は通常書込を拒否し、終了用16 MiBを保存して合計256 MiBを確認した。さらに1 byteのcritical書込は拒否した。固定容量streamのarchiveは251658375 byte、gzipは251735198 byteで、48 MiBの5片と76958 byteの第6片へ分割し、stream復元が一致した。各片は48 MiB以下、全体は256 MiB以下だった。

gzip総量・片数上限はpartial indexを残し、完全bundle扱いを拒否した。hashの改変、片の逆順、切断journalを拒否した。fsync直後のSIGKILLでも最後の3 journal行を復元でき、snapshot fsync後rename前の障害では旧checkpointを保持した。固定fixtureの保存回復試験であり、科学runの全区画leaseや常時GitHub mirrorを確認したものではない。

実容量試験は別プロセスで時間・RSSを監視し、20分・1 GiBのprocess上限内で完了した。process間の合算RSSやcgroup上限はこの試験の測定対象ではなく、科学用workflowの運用条件として別途固定する。

## 保持する境界と次工程

原提案、旧5科学区画、先行method/BFS、公開資産を変更しなかった。観測RAWは既読の範囲で、遮断数を増やす新規科学証拠はない。新規科学source/seed/候補、旧8候補・27代表・2 guard witnessの延長、正式推論は0件である。

次は最終科学SPECと認可記録、source manifest、全区画lease、seed読取前consume、attempt 1固定の別trigger、終了後mirrorと常時保存のworkflowを具体化する。今回の技術合格から科学sourceを起動しない。全合法手の完全閉包、未知の保持、候補不足時の終了、追加・置換・retry禁止を引き継ぐ。
