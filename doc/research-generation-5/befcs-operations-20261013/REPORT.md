# 一度限り運用preflightの報告

## 達成したこと

新しい15技術テストと先行source/BFSの31回帰テストがローカルで合格した。Gitの原子的全区画取得、重複・競合拒否、各読取前marker、run/binding一致、異常終了時の消費保持、独立履歴検算を確認した。論理ID128件のcallbackは番号照合だけであり、科学sourceの生成ではない。

保存した[機械結果](results/RESULT.json)では、1区画・128 marker・8 mirrorの計137 commitを独立再生した。稼働中mirrorとSIGKILL後の終了mirror、全blob/file hash、journal完全prefixと末尾断片の保持、coverageと解nullの一致を保存済みGit bundleから復元した。mirror objectは64 KiB片を再利用し、累積容量・metadata容量の超過時には更新を拒否する。

## メモリと強制終了

複数processの合算RSSと時間停止、SIGTERM無視後のSIGKILL、mirror失敗時の停止が合格した。最初の検証ではnamespace内PIDと`/proc`側PIDの不一致によってprocessを検出できなかった。`NSpgid`とPID namespaceを照合する方式へ修正し、2 processの合算上限で停止するテストが合格した。失敗を含む検証経緯を研究ログへ保持する。

Dockerがないローカルで実cgroupの合格を主張しない。新Actions workflowで128 MiBと提案1 GiBのOOM負荷を試し、swap追加分なし・networkなし・`OOMKilled=true`・exit 137・fsync済prefixを検査する。この確認は現在待機中で、完了後のCI receiptを別記録へ保存する。

## 科学契約への帰結

[契約案](CONTRACT_DRAFT.md)と[SPEC_DRAFT](SPEC_DRAFT.json)は、source選定・全閉包・未知・資源・一度限り運用を整理した未登録案である。既存の第一root・全2-ply screen・既読遮断・不足時終了を維持した。技術moduleには科学entryや科学triggerを用意せず、提案科学seedを拒否する。

この合格はGitHub token・通信条件を含む科学運用全体、科学用全workloadの容量・時間、新規完全領域供給の証拠ではない。次は科学source/独立replay・全閉包保存を運用moduleへ結合し、全workloadのseedなし統合検証を通してから最終科学freezeを行う。実行認可を得直す必要があると判断したものではなく、現時点の技術条件が未完である。

## 保持した境界

科学source・科学seed・科学候補・科学leaseは0件、BEFCS-STUDY1は未登録・未実行。新規Bao RAWは0件で、保守的遮断は103355件のまま。584保護入力、旧区画・旧root・guard witness、原manifestと全証拠、公開資産はbyte hashを保持した。正式関係未登録・未実行、main・公開AI未変更である。
