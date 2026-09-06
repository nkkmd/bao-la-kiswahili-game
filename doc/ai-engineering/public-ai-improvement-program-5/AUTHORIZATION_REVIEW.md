# PBAI-P5 — 再検証の開始準備レビュー

## 現状と認可範囲

ユーザーの「では、再検証を行います。準備してください」に基づき、再検証の準備を認可する。新規seedの測定開始は今回の作業範囲に含めない。GitHubからmainを再取得し、548ccead3965fa98602d99c8b3e2a49fbeeed093を確認した。未統合PRはP4の#107であり、そのHEADは2d77792220af80ca2700bd0b3c0ab8e45197c24e。旧作業treeはcleanだった。

正式Program名は `Search-Only Lightweight State Transition Independent Reverification Program 5`、Program IDはPBAI-P5。対象候補は既存PBAI-C011-v1の同一sourceである。候補IDを新規発行・改名せず、P4の失敗を別名の成功へ置換しない。P4のHOLDは確定済みのまま維持する。Research Generation 4およびAI世代昇格とは独立している。

P4を含むブランチから別worktree・別ブランチengineering/pbai-p5-reverification-preparationを作成した。mainとPR #107は変更しない。P5の準備PRは#107をbaseとし、準備差分を分けてレビューできるようにする。

## 根拠と制約

P4では正確性と前段の時間短縮を観測したが、4時間の全体wall-clock監視漏れで最終評価が成立しなかった。再検証の根拠はあるが、改善の保証はない。前回の数値を知った再計画であることを明示し、新規集団による確認として扱う。

公開候補source、比較baseline、関連設定をSOURCE_LOCK.jsonに固定する。前回の公開用sourceのhashと、実サイトへ配信されているかは別であり、配信状態は未確認。学習・経路事前計算・コピー置換は追加しない。

新しい82x seed blockについて既存doc/tools/test/成果物索引で使用記録がないことを調べ、予約した。新規seedからの局面生成は行っていない。旧archiveから既知identityだけを抽出し、除外表を固定した。過去の保護seedは再測定しない。
