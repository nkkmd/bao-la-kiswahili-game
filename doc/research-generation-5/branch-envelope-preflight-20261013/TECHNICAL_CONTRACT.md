# 分岐包絡供給案の技術検証契約

## 目的・対象・認可境界

技術IDは`BEFCS-TECH-PREFLIGHT-2026-10-13-v1`である。ユーザーの継続指示に基づき、[BEFCS-STUDY1提案](../branch-envelope-20261013/PROPOSAL.md)からsource選定、独立再生、全閉包、停止、保存を実装し、固定fixtureだけで検証する。科学Studyの登録・認可契約ではない。提案seed範囲`50613001..50613128`はfixture入口が拒否し、科学sourceを起動するCLI・lease・triggerを設けない。

abstract fixtureには、BFS統合の保存済み1024状態・diamond等のRAWを再使用する。Baoは既知forced-winの3状態完全閉包と既知relay-cap例だけを使う。旧8候補、未解析27代表、実guard witnessは延長しない。新規RAWを見つけた場合は技術結果を保存して遮断集合へ追加するレビューが必要であり、未読の科学候補へ転用しない。

## 選定・検算の固定範囲

1. canonical moveKeyの文字列順、xorshift32、整数棄却でfixture軌跡を作り、各drawを保存する。fixture seedはCONFIGのallowlistだけを使う。
2. ply 48以後、非終局mtaji・両reserve 0・root幅2〜4、各子の応手幅1〜8・合計16以下、捕獲のみ/takataのみの両子群を検査する。勝者名・厳密値・DTF・探索順位を構造判定器へ渡さない。
3. 最初の構造適格rootを固定し、root・子・全2-ply応手結果・microstate RAW射影の既読を検査する。既読なら前後へ差し替えない。source経路の共有だけでは除外しない。
4. 第一代表の後も軌跡とscreenを検算する。rootまたはscreen応手の手内反復・管理停止はsource失敗とし、旧代表を候補に残さない。これは未知を候補として扱わず、後のrootへ置換しない停止規則である。
5. source順の候補固定・重複root除外・最大8・不足時終了を別実装で検算する。fixtureの件数を科学source数やIID標本数へ読み替えない。

主sourceと独立replayは別ファイルとし、独立replayは主PRNG・構造判定器・source生成器をimportしない。科学用object/ring二遷移で全合法手・全microstateを比較する。中断sourceの再生は保存prefixだけに限定し、未保存の後続sourceを生成せず、完全検算へ昇格させない。

## 全閉包・保存・管理停止

全合法手BFS、可逆RAW codec、snapshot、hash連鎖journalは先行統合コードを変更せず、新しいwrapperで接続する。全保存辺・metadata・microstate要約・stop witnessをring遷移で検算する。完全graphだけを独立二解法へ渡す。graph完成後の検算・解法・保存中に資源停止した場合も、解をnullへ戻し、区画の解釈完了をfalseとする。

journalとsnapshotの書込前にbytesを検査し、通常書込は終了reserveを残す。上限停止では最後の永続prefixからpartial graph・frontierを復元し、停止時に既に観測した遷移・RAWをcritical witnessへ保存する。snapshotのatomic renameでは旧snapshotとtemporaryの共存量を検査する。切断/改変journal、fsync後の強制終了、rename前障害をfixtureで検査し、同じ区画の再実行は認可しない。

gzip archiveはstreamで出力し、各片bytes/hash、順序、全解凍bytes、元ファイルhashを独立検査する。総圧縮量・片数・展開量停止はpartial indexと保存済み片を残し、完全bundleとして検算することを拒否する。終了indexもreserveに収まる条件を検査する。

通常fixtureは小さい容量で圧力を注入する。別プロセスで提案の実上限256 MiB、通常240 MiB、終了reserve16 MiBの境界を検査し、固定AES streamの容量fixtureをgzip化して48 MiB以下・最大6片の全復元を検査する。AES streamは保存試験用バイト生成だけであり、Bao sourceのPRNGではない。

## 合格・保存・限界

全fixture、独立source/edge再生、全bundle復元、入力/出力hash、日本語品質が通れば`BRANCH-ENVELOPE-FIXTURE-PREFLIGHT-PASS-NOT-SCIENTIFIC-AUTHORIZATION`とする。失敗を未知の科学結果や供給成功へ変換しない。固定fixtureの再生は認めるが、科学区画のretryはこの工程には存在しない。

保存先は本ディレクトリのresultsと研究ブランチである。SOURCE_MANIFESTは新しい実装・契約・設定・workflowを、PROTECTED_INPUTSは先行科学/技術記録と公開資産をbyte hashで固定する。OUTPUT_BINDINGは結果・証拠・実行計測を固定する。

合格しても、durable GitHub lease、科学用の全区画consume marker、別trigger、強制終了後の常時repository mirror、最終科学SPEC/AUTHORIZATION/SOURCE_MANIFESTは未実装である。科学sourceの読み取りは、それらの別契約と実行前レビューを固定した後の工程とする。正式関係は未登録・未実行、主課題は勝敗価値損失のままであり、mainと公開AIを変更しない。
