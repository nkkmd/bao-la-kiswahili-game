# 第五世代研究の途中経過 — main統合記録

記録日: 2026-10-15（日本時間）  
状態: **中間保存main統合済み／第五世代研究全体は継続中**

## 統合の確定記録

| 項目 | 確定した内容 |
| --- | --- |
| 統合PR | [PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205) |
| 統合日時 | 2026-10-15 00:11:54（日本時間）／2026-10-14 15:11:54 UTC |
| 統合コミット | [44d7dafefce100e636b86c66136a754e4fbef727](https://github.com/nkkmd/bao-la-kiswahili-game/commit/44d7dafefce100e636b86c66136a754e4fbef727) |
| 統合時tree | `076114f0386129bc4bee6a885765a5ad46d96235` |
| 統合元head | `5edd3a4c72ed0c61af9c0a49b2fec4ff68c6c4f4` |
| 統合前CI | 33実行中32成功・対象外1スキップ |
| 統合後の保存監査 | [run 38587216863](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38587216863)／attempt 1・success |
| 統合後の旧研究整合性CI | [run 38587216870](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38587216870)／attempt 1・success |

統合時のtreeは検算済みtreeと一致した。PR #181〜#204の全headはGit履歴に保持され、#202の分岐追補は現在treeへ直接適用せず履歴とblob識別を保存した。旧PRの整理と統合後確認はPR #205本文に記録されている。

統合後の文書更新では現在treeが変わる。再開時は上記コミットが現在mainの祖先であることと、保存証拠の固定hashを確認する。

## 反映済みの結果と残る工程

G5-01〜G5-05の供給研究は終了し、5区画320 sourceは消費済みである。G5-03・G5-04の計16完全領域・214状態199辺を保持するが、主要課題に必要な手による勝敗価値差は0件だった。G5-05の8候補は全閉包未完で、価値差は未確定である。

主要関係の準備判断は`PRIMARY-READINESS-NOT-MET`であり、正式仮説の否定ではない。BEFCS-STUDY1と正式な順位変動・勝敗価値損失の関係検証はともに未登録・未実行である。BEFCSの科学seed消費0・科学leaseなしを維持する。

第3版の5原ZIP・3,361 fileとGit/ACK/source/停止の二経路検算を保存した。期限後回収と最終mirror拒否は未完として保持する。全起動から保存までの資源・単一時計、科学処理との統合、最終事前固定が残る。詳細は[中間保存](README.md)、[現在状態](../CURRENT_STATUS.md)、[再開位置](../RESUME_HERE.md)を参照する。

## 統合後の文書監査で修正した案内

| 対象 | 修正内容 |
| --- | --- |
| ルートREADME・研究入口・現在状態・再開位置 | PR #205の統合完了、日時と確認方法を明示 |
| 研究索引・研究アジェンダ | G5-01時点の要約をG5-01〜G5-05とBEFCS技術検証の現状へ更新 |
| 再現性索引 | G5-02〜G5-05の原結果・独立検算・固定入力への導線を追加。「閉包なし」はG5-01終了時点の記録と明示 |
| 研究計画・研究ログ | 原計画と日時付き履歴を保持し、最新状態への入口と統合記録を更新 |

## 固定記録と現在案内の監査

この文書は統合後の追加記録である。中間保存の[旧binding](CHECKPOINT_BINDING.json)、[統合範囲](INTEGRATION_SCOPE.json)、旧監査器、原結果・原ZIP・原manifest・旧失敗は、PR #205時点の固定記録として保持する。中間保存README・品質監査の「統合対象」「統合前CIで確認」は作成時点の履歴である。

旧bindingは現在案内9文書と監査workflowにもhashを設定しているため、現在案内の更新後は[現在checkout用の監査器](../../../tools/research/g5-checkpoint/verify-current.py)を使う。この監査器は、固定コミットにある旧案内9件と旧workflowを元のhashで照合し、それ以外の固定ファイルは現在checkoutでも元のhashと一致することを確認する。workflow更新は監査入口の切替だけを認め、保存証拠・Git履歴・二経路検算・現在の日本語文書監査は旧監査器の処理をそのまま使う。

完全なGit履歴を取得したcheckoutで、次を実行する。新しい科学sourceや実remote取引は起動しない。

```bash
python3 tools/research/g5-checkpoint/test-verify-current.py
python3 tools/research/g5-checkpoint/verify-current.py
```

現在案内以外の固定ファイル、旧binding、統合範囲、workflowの無関係な変更を拒否する検証を追加した。文書の日本語品質、相対リンク、元の科学的判断・数値・認可状態の保持は、修正PRの監査記録とCIでも確認する。
