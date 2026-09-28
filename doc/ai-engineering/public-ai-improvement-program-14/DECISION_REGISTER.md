# `PBAI-P14` — 判断記録

| 日付 | 段階 | 判断 | 根拠・境界 |
| --- | --- | --- | --- |
| 2026-09-28 | A | `AUTHORIZED-FOR-PROGRAM-INITIALIZATION-AND-BASELINE-SUPPORT-MEASUREMENT` | ユーザーが公開AI改善への着手を指示し、長時間試験はGitHub Actionsを第一候補にするよう指定した。隔離Program、baseline support計測、結果記録までを対象とする。 |
| 2026-09-28 | A | baselineを`AI-GEN4-BASELINE-2026-09-28-v1` / commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`に固定 | 最新main、release ID、候補連番、Jev比較の非Program境界を確認。 |
| 2026-09-28 | B | baseline support specを固定 | seed `2026092801..2026092864`、深度4、選択規則、同値性、support gate、Actions shardを計測前に固定。 |
| pending | C | support結果判定 | 全shard・artifact・hash・gate監査後に記録する。 |
| pending | D | Candidate ID・候補仕様 | support PASS時のみ新規採番し、候補実装や結果を見る前にspecを固定する。 |
| pending | E+ | validation / strength / release | 各段階の結果と決定を独立して記録する。 |

結果確認後のseed、sample gate、探索深度、探索対象、判定条件の変更は禁止。現行AI-GEN4の公開defaultをこのProgram中に変更しない。
