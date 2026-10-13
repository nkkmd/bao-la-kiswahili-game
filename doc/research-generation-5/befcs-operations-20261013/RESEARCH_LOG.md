# 一度限り運用preflightの研究ログ

## 2026-10-13 — 再開と前工程の確定

PR #191の最終head `5c9d80801d7476ec008a3c95d55440d5939fcfd2`と最終CI成功を照合した。先行技術記録と旧科学記録を保持し、単一のメインエージェントで運用preflightへ進めた。

## 2026-10-13 — 実装と失敗の修正

全区画lease・各consume・mirrorをGit refのcompare-and-swapへ接続し、別実装の履歴検査を加えた。初回合算RSS試験ではnamespace内PIDをhost `/proc` PIDと直接比較して0 processとなり、時間上限で止まった。namespace照合の初稿では無関係processのnamespaceへのアクセスが拒否された。process group候補を先に絞り、`NSpgid`と同じnamespaceを照合してからRSSを加算する方式へ修正した。

## 2026-10-13 — ローカル検証と保存

最終15運用テストが全合格し、先行31回帰テストも全合格した。独立保存証拠は1 lease・128 marker・8 mirror・137 commitを含む。SIGKILL後のjournalと終了mirrorを復元でき、解はnullである。全記録は固定fixtureで、科学seedのPRNG初期化は0件である。

ローカルにはDockerがなく、実128 MiB/1 GiB cgroup負荷はActionsへ移した。科学契約案を日本語で具体化し、科学用全workload結合・最終freeze・別triggerを次の再開条件として残した。
