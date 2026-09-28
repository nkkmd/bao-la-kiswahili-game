# `PBAI-P14` — 判断記録

| 日付 | 段階 | 判断 | 根拠・境界 |
| --- | --- | --- | --- |
| 2026-09-28 | A | `AUTHORIZED-FOR-P14-INITIALIZATION-AND-STAGED-IMPROVEMENT-WORK` | ユーザーが公開AI改善への着手と、長時間試験はGitHub Actionsを第一候補に設計するよう指示。段階ごとの事前固定gateに従って進める。 |
| 2026-09-28 | A | baselineを`AI-GEN4-BASELINE-2026-09-28-v1` / commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`に固定 | 最新main、release ID、候補連番、Jev比較の非Program境界を確認。 |
| 2026-09-28 | B | baseline support specを固定 | seed `2026092801..2026092864`、深度4、選択規則、同値性、support gate、Actions shardを計測前に固定。 |
| 2026-09-28 | C | `BASELINE-SUPPORT-PASS` | run `36408095064`。8/8 shard、111局面、Namua 64、Mtaji 47、全局面depth4、timeoutなし、計装前後の探索判断・安定stats一致、capture variant input 103,788。詳細は`BASELINE_SUPPORT_RESULT.md`。 |
| 2026-09-28 | D | `PBAI-C017-v1` を発行し開発契約を固定 | `CANDIDATE_SPEC.md`を固定してから開発を開始。fresh development seed `2026092901..2026092964`を割当。 |
| 2026-09-28 | D | 実装範囲を候補ファイル内へ限定 | 初期試作が`public/engine.js`を変更したが、既存AI-GEN3 manifest回帰testで不変資産だと確認した。seed処理前に変更を戻し、helperを`public/ai-candidate.js`へ移した。測定前に仕様へ追記し、最終source hash gateは許可差分が同ファイルのみと確認。初期準備runはseed未実行。 |
| 2026-09-28 | E | `CANDIDATE-DEVELOPMENT-PASS` | run `36409930392`、8/8 shard、64 seedを処理、104 paired samples（Namua 62 / Mtaji 42）。すべてdepth4完了・timeoutなし、出力一致。18,686遷移を再利用し、`applyMove`呼出しを同数削減。公開defaultは変更なし。詳細とhashは`C017_DEVELOPMENT_RESULT.md`と`c017-development.json`。 |
| 2026-09-28 | F | `PERFORMANCE-001-TECHNICAL-INVALID` | run `36410898125`。runnerの結果row生成時に変数名誤りがあり、完了row/artifactを保存できなかった。全seed blockを消費済み扱いにして再利用しない。記録は`C017_PERFORMANCE_001_TECHNICAL_FAILURE.md`。 |
| 2026-09-28 | F | `NO-MATERIAL-WALL-CLOCK-IMPROVEMENT` | PERFORMANCE-002 run `36411624798`、保全run `36412188487`。独立64 seed・106 paired samples・7反復、全出力一致、timeoutなし。削減推定2.9795%、seed-cluster bootstrap 95%区間1.7091%〜4.1921%。事前固定の点推定3.0% gateだけ不成立。詳細は`C017_PERFORMANCE_002_RESULT.md`とcanonical JSON。 |
| 2026-09-28 | G | `NOT-AUTHORIZED / NOT-EXECUTED` | 性能gate未達のため強度比較・release holdoutへ進まない。main統合、公開default、release、AI世代は変更しない。 |
| 2026-09-28 | H | `COMPLETE / NO-MATERIAL-WALL-CLOCK-IMPROVEMENT / KEEP-AI-GEN4` | 最終報告に全工程と限定範囲を記録。PBAI-P14を終了し、結果後のseed/threshold変更による救済試験を行わない。 |

確定結果から効果が厳密に0とは結論しない。P14の固定条件で事前採用gateを満たさなかったという結論に限定する。次候補はP14とは別Program・baseline・candidate IDおよびfresh evidenceで評価する。