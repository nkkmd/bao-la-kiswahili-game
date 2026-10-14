# 分岐包絡preflightの再開位置

安全な再開点は固定fixture技術合格・科学Study未登録である。[報告](REPORT.md)、[解釈確認](DESIGN_REVIEW.md)、[技術契約](TECHNICAL_CONTRACT.md)を確認する。

1. 提案seed範囲・Study/Stage ID・namespaceを再照合し、最終科学SPEC・契約・認可範囲・source selector・独立verifierを結果前に固定する。技術manifestを科学用source freezeへ読み替えない。
2. 全128 sourceのleaseをGitHubへ原子的に確保し、各seed読取前のdurable consume markerとattempt 1固定を別実装で検査する。leaseはまだ作成しない。
3. 科学用source入口と別trigger、常時artifact/repository保存・終了後mirrorを実装し、強制終了・保存容量・container/合算RSS制限をseedなしfixtureで検査する。
4. 最終source freeze・CI receipt・契約hash・保護入力・実行前レビューの一致を確認した後、科学区画を一度だけ進める。source/候補不足、完全閉包0、値差0でも追加・差替え・retryをしない。
5. 完全graphだけを独立解法へ渡し、未知・管理停止・未検算をDRAW/0/敗北へ置換しない。正式関係は別途準備成立が必要で、DTFへ主課題を差し替えない。

現在、科学seed消費0・leaseなし・科学source未固定・実行未認可、main未統合である。
