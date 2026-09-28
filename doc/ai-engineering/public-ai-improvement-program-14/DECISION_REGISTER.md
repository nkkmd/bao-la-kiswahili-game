# `PBAI-P14` — 判断記録

| 日付 | 段階 | 判断 | 根拠・境界 |
| --- | --- | --- | --- |
| 2026-09-28 | A | `AUTHORIZED-FOR-P14-INITIALIZATION-AND-STAGED-IMPROVEMENT-WORK` | ユーザーが公開AI改善への着手と、長時間試験はGitHub Actionsを第一候補に設計するよう指示。段階ごとの事前固定gateに従って進める。 |
| 2026-09-28 | A | baselineを`AI-GEN4-BASELINE-2026-09-28-v1` / commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`に固定 | 最新main、release ID、候補連番、Jev比較の非Program境界を確認。 |
| 2026-09-28 | B | baseline support specを固定 | seed `2026092801..2026092864`、深度4、選択規則、同値性、support gate、Actions shardを計測前に固定。 |
| 2026-09-28 | C | `BASELINE-SUPPORT-PASS` | run `36408095064`。8/8 shard、111局面、Namua 64、Mtaji 47、全局面depth4、timeoutなし、計装前後の探索判断・安定stats一致、capture variant input 103,788。詳細は`BASELINE_SUPPORT_RESULT.md`。 |
| 2026-09-28 | D | `PBAI-C017-v1` を発行し開発契約をfreeze | `CANDIDATE_SPEC.md`を実装前に固定。開発seed `2026092901..2026092964`はsupport rangeと分離。実装範囲は遷移再利用のA1一機構、default-off。 |
| pending | E | candidate development gate | 全seed coverage、fixed-depth同値性、対象transition再適用の削減、Actions artifact/source hash監査後に記録する。 |
| pending | F+ | independent validation / strength / release | freshデータの事前契約と各gateを独立して記録。 |

結果を見た後にseed、sample gate、探索深度、探索対象、判定条件を変更しない。現行AI-GEN4の公開default、main、releaseはこのProgramでは変更しない。
