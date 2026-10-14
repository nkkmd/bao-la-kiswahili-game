# 一度限り運用preflightの文書・意味監査

## 対象

新規研究ディレクトリの入口、報告、技術契約、科学契約案、現在状態、再現性、研究ログ、再開位置、results入口、本監査の10文書、tools入口1文書、第五世代の中央6文書、root README・研究索引・研究アジェンダ3文書の計20 Markdownを対象とする。機械JSON・canonical token・file path・hash・exact commandは例外で、周囲の日本語文が意味を説明する。

## 確認内容

新しい人間向け見出しと説明は日本語とする。目的、達成範囲、失敗修正、科学的限界、次工程を日本語だけで追えること、相対リンクが実ファイルまたはGit追跡pathへ解決することを検査する。科学契約は未登録案と明記し、ローカルfixture・実cgroup確認・科学用全workload保証を相互に昇格しない。

原記録と584保護入力をbyte hashで保持する。科学seed消費0・科学leaseなし・新規Bao RAW観測0・遮断103355・正式関係未登録/未実行を横断照合する。旧candidateやguard witnessを延長せず、main・公開AIを変更しない。

## 検証

15運用テストと31先行回帰テスト、保存bundleの独立履歴・各byte・journal prefix再生が合格した。JSON parse、source/protected/output hash、20文書の追加見出しと相対リンク、`git diff --check`を検査する。実cgroupと最終GitHub CIのreceiptは完了後の別記録へ保存する。
