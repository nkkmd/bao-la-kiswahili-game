# BEFCS-STUDY1の科学実行契約案

## 状態と研究の問い

本書と[SPEC_DRAFT.json](SPEC_DRAFT.json)は、先行提案を実行条件へ具体化した**未登録・未認可の案**である。ユーザーへの追加確認を要求する文書ではなく、実装・検証・事前固定が未完の技術境界を示す。

問うのは、最初の分岐包絡適格rootを選ぶ新規有限source区画から、全合法手の完全解析領域と手間勝敗価値差を供給できるかである。正式な順位変動と勝敗価値損失の関係検定は対象外で、DTFへ主要課題を差し替えない。

## 提案する固定範囲

Studyは`BEFCS-STUDY1`、Stageは`BEFCS-S1-SUPPLY-2026-10-13-v1`、ruleRevisionは`BAO-RULES-V0.2.0-TAKASIA-001`とする。seed範囲`50613001..50613128`は128 sourceの提案値のままで、未予約・未消費である。

canonical moveKey順、xorshift32と整数棄却を維持する。最大512 ply、ply 48以後の最初の非終局mtaji・両reserve 0・root幅2〜4をscreenし、全子非終局・応手幅各1〜8・応手合計16以下・捕獲のみ/takataのみの子群が両方あるrootを選ぶ。全2-ply遷移と手内RAW射影を保存し、勝敗値・DTF・探索順位で選ばない。

最初の適格rootを固定した後に、103355件の保守的既読集合との重複を照合する。root・子・全応手結果・microstateが既読なら候補を除外し、前後のrootへ差し替えない。経路の共有だけではsourceを除外しない。screenや後続経路の未知はsource失敗とする。source順の最初の最大8非重複候補を全軌跡生成後・閉包前に固定し、不足や失敗による追加は行わない。

## 全閉包と資源

科学用object/ring二遷移・可逆RAW保存を使い、全合法手を保持する。領域上限は10000状態・128000辺・180秒・手内8192 microstate、全体は1200秒・1 GiB・256 MiB・終了予約16 MiBとする。gzip全体256 MiB・各片48 MiB以下・最大6片を維持する。各領域の検算・解法・保存も180秒の対象で、停止時に完全graphの解を既に計算していても解釈未完・solution nullに戻す。

科学worker・その検算子processをswap追加分なしの1 GiB containerへ入れ、合算RSS監視も行う。host mirrorの資源と科学workerの資源は別記録として示し、全実行資源を過小報告しない。科学保存wrapperへ接続した負荷fixtureで、一体容量・終了予約・累積mirror容量と停止を検査してから固定する。

未知・反復・管理停止をDRAW/0/敗北へ置換せず、完全領域だけを独立二解法へ渡す。全保存辺・microstate・metadataと未展開境界を再検算する。閉包が0件、勝敗価値差0件、source不足でも、旧区画の延長・補充・救済・再試行をしない。

## 起動条件と保存

最終SPEC・契約・認可範囲・source manifest・CI receipt・保護入力・実行前レビューを相互照合してから、別triggerでattempt 1だけを起動する。全区画leaseを原子的に取得し、各seedのPRNG初期化前にremote consume markerを保存する。失敗や応答不明では新しい読取りを始めない。

全区画取得後の中断は同一区画を再実行せず終了する。常時mirror、終了mirror、常時artifact保存を行い、保存不成立時は解釈未完とする。復元・独立検算は既存byte/prefixだけに限り、生成器を再起動しない。Git registryのprotocol fixture合格をGitHub運用全体の保証としない。

## 登録前に残る条件

科学用source入口・独立source replayへの結合、科学用閉包wrapperと停止prefixの照合、container/mirrorを含む全workload統合、最終source freezeとCI receipt、別triggerは未完である。これらの合格後に正式な開発供給SPECと認可記録を作る。現時点で科学sourceを読める入口はない。正式関係の検定は別途準備成立と登録が必要であり、有限開発結果からIIDや一般Bao局面へ推論しない。
