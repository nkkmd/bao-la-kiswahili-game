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
| pending | F | fresh uninstrumented performance validation | 独立seed、paired/counterbalanced timing、Actions shard、事前固定判定条件を契約へ記録してから実行する。 |
| pending | G+ | strength comparison / release | performance結果後にfresh matchup contractと必要なgateを固定。公開採用、main統合、production releaseは別判断。 |

結果確認後にseed、sample gate、探索深度、探索対象、判定条件を変更しない。現行AI-GEN4の公開default、main、releaseはこのProgramでは変更しない。