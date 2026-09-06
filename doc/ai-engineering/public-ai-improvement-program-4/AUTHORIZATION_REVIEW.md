# PBAI-P4 — 開始認可レビュー

確認日: 2026-09-06。開始時のGitHub main HEADは `548ccead3965fa98602d99c8b3e2a49fbeeed093`。

## 現状と開始判断

GitHubの全131ブランチと未統合PRを確認した。未統合PRは0件。ローカルは新規cloneで変更なし、既存worktreeなしだった。専用ブランチは `engineering/pbai-p4-c011-lightweight-transitions` とし、他ブランチへ書き込まない。

公開系統は `AI-GEN2`、PBAI-P1〜P3は `COMPLETE / KEEP-AI-GEN2`、進行中AI Engineering Programはない。PBAI-C001〜C010の候補台帳・最終報告・リリース台帳を確認し、表示用スナップショットだけを探索経路から除く同種候補は確認しなかった。Phase 11の評価キャッシュとは異なり、計算結果の再利用は追加しない。

正式Program IDを `PBAI-P4`、正式題目を `Search-Only Lightweight State Transition Verification Program 4`、唯一の候補を `PBAI-C011-v1` と固定する。日本語題目は「探索専用の軽量な局面遷移の検証」である。設計証拠のcutoffは上記main。Research Generation 4の実行・結果は使用せず、過去の正式判断を変更しない。

開始判断は `AUTHORIZED`。根拠は、この依頼による段階的な実装・検証・PR作成までの明示的認可、新規の処理方式、未使用のID、および競合する進行中作業がないことである。以降は事前条件を満たした工程を自動的に継続する。main統合、公開変更、世代昇格は認可されていない。

## 確認した規則とコード

AGENTS.md、文書言語方針、日本語品質ゲート、README、AI中央索引、AI世代命名規則、PBAI-P1〜P3の台帳・最終報告・計画、AI_ADVANCED_ROADMAP、AI_DEVELOPMENT_LOG、AI_BENCHMARK、RULES_BASELINEを確認した。

現行engineのsnapshotEventはJSON経由で全状態を複製し、sowは1個ごとに呼び出す。AIは遷移と評価の両方でapplyMoveを使い、moveVariantsもnyumbaのstop/use比較にapplyMoveを使う。評価はcaptureのcountとcapture/relayの件数を利用する。nextPitは毎回ringを構築するが、本候補では変更しない。

公開sourceの同一性は固定するが、Cloudflareの配備IDと配信中assetの同一性は未確認である。リポジトリのsource確認を実サイト確認へ読み替えない。

## 実装前診断

PBAI-P4-Aは本認可とbaseline固定、PBAI-P4-Bはbaselineだけの診断と比較契約固定、PBAI-P4-Cは実装・正確性、PBAI-P4-Dはdevelopment性能、PBAI-P4-Eはvalidation、PBAI-P4-Fは最終holdout・判定、PBAI-P4-Gは文書・PRとする。

候補実装前に、診断専用seed `811000001..811000008` で通常ルールによる最大80手のランダム合法variant系列を生成し、ply 12と52の非終局局面でD2・時間切れなしのbaseline探索を1回ずつ実施する。診断の上限は10分、単一プロセス、2GiB。イベント数・盤面snapshot数・経過時間を記録する。候補比較は行わず、この診断を新規の強化証拠へ流用しない。診断seedと後続splitは分離する。
