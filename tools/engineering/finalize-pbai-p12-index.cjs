'use strict';
const fs = require('node:fs');
const path = 'doc/AI_ENGINEERING_INDEX.md';
let text = fs.readFileSync(path, 'utf8');
function replaceOnce(before, after) {
  const count = text.split(before).length - 1;
  if (count !== 1) throw new Error(`Expected one index anchor, found ${count}: ${before.slice(0, 80)}`);
  text = text.replace(before, after);
}
replaceOnce('更新日: 2026-09-14', '更新日: 2026-09-17');
replaceOnce(
  '完了済みProgram: **`PBAI-P1`、`PBAI-P2`、`PBAI-P3`、`PBAI-P4`、`PBAI-P5`、`PBAI-P6`、`PBAI-P7`、`PBAI-P8`、`PBAI-P9`、`PBAI-P10`、`PBAI-P11`**',
  '完了済みProgram: **`PBAI-P1`、`PBAI-P2`、`PBAI-P3`、`PBAI-P4`、`PBAI-P5`、`PBAI-P6`、`PBAI-P7`、`PBAI-P8`、`PBAI-P9`、`PBAI-P10`、`PBAI-P11`、`PBAI-P12`**',
);
replaceOnce(
  '次期候補は[十分良い手を基準にしたマージン制限型選択探索](ai-engineering/NEXT_IMPROVEMENT_CANDIDATE.md)です。2026年9月14日の[事前調査と開始時の引継ぎ](ai-engineering/NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md)を記録しました。小規模な計測・検証へ進める価値はありますが、棋力改善は未確認です。候補は`CONCEPT-RECORDED / NOT-AUTHORIZED / NOT-IMPLEMENTED`、正式Program ID・Candidate IDは未発行、開始認可レビュー・新規計測・実装・対局試験は未開始です。今回のmain反映は文書整備のみであり、実作業の開始を認可しません。',
  '[十分良い手を基準にしたマージン制限型選択探索](ai-engineering/NEXT_IMPROVEMENT_CANDIDATE.md)は、2026年9月17日に`PBAI-P12 / PBAI-C016-v1`として実装・development検証まで実施しました。baseline supportはPASSしましたが、prospectiveに固定した`Δ = 16 / 32 / 64`の全候補でeligible局面のnode削減gateを満たさず、最終判断は`COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4`です。[PBAI-P12最終報告](ai-engineering/public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md)を参照してください。independent validationとrelease holdoutは未実行で、公開AI・release・AI世代に変更はありません。',
);
replaceOnce(
  '- `PBAI-P1`から`PBAI-P11`までは、候補を評価するengineering programのIDです。',
  '- `PBAI-P1`から`PBAI-P12`までは、候補を評価するengineering programのIDです。',
);
replaceOnce(
  'P1〜P11は完了済みです。下表は各プログラムで確定した結果であり、公開判断の欄はその時点の履歴です。採用・配信・世代昇格の後続判断は[AI-GEN4の正式記録](ai-engineering/ai-gen4-release/README.md)で確認します。',
  'P1〜P12は完了済みです。下表は各プログラムで確定した結果であり、公開判断の欄はその時点の履歴です。採用・配信・世代昇格の後続判断は[AI-GEN4の正式記録](ai-engineering/ai-gen4-release/README.md)で確認します。',
);
const p11 = '| [PBAI-P11](ai-engineering/public-ai-improvement-program-11/README.md) | 新規seedとGitHub実行基盤によるexpert再試験 | `PBAI-C015-v1` | 実験終了時は`EXPERT-STRENGTH-PASS / ADOPTION-PENDING`、後続判断で`ADOPT` | 実機確認・本番組込み・配信確認を経てAI-GEN4へ昇格 |';
replaceOnce(
  p11,
  `${p11}\n| [PBAI-P12](ai-engineering/public-ai-improvement-program-12/README.md) | AI-GEN4のPVS再探索コストに対する独立工学検証 | \`PBAI-C016-v1\` | \`DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4\` | なし。candidate不採用・公開AI変更なし |`,
);
replaceOnce(
  '以下のP1〜P11の詳細は、各検証・判断時点の履歴です。コードブロックの`current public lineage`や未承認・未配信という記録は当時の状態を表し、現在の公開状態は冒頭を正本とします。',
  '以下のP1〜P12の詳細は、各検証・判断時点の履歴です。コードブロックの`current public lineage`や未承認・未配信という記録は当時の状態を表し、現在の公開状態は冒頭を正本とします。',
);
fs.writeFileSync(path, text);
console.log('PBAI-P12 index closure synced.');
