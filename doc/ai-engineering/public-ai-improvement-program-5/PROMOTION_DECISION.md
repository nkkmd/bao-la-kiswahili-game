# PBAI-P5 — AI-GEN3正式昇格判断

正式判断: `ADOPT`  
release ID: `AI-GEN3-RELEASE-001`  
昇格前の公開AI系統: `AI-GEN2`  
昇格後の公開AI系統: `AI-GEN3`  
判断日: 2026年9月7日

## 判断

`PBAI-C011-v1`をhard/expertの既定`bao`・`phase2`探索へ正式採用し、公開AI系統を`AI-GEN3`へ昇格する。これは2026年9月7日のユーザーによる明示的な認可に基づくengineering release decisionである。最初の正式release IDとして`AI-GEN3-RELEASE-001`を発行する。

この判断は、すでに公開defaultへ段階的に配備され、公開assetとブラウザー相当経路の確認を通過した同一候補を正式採用するものである。新しい候補、評価重み、着手順、探索方式、時間配分、置換表、終局判定、ルール処理は追加していない。

## 昇格条件の確認

| 命名規則上の条件 | 根拠 | 判定 |
| --- | --- | --- |
| evidence auditと情報分離 | P5の開始レビュー、固定条件、SOURCE_LOCK、PREPARATION_LOCK | PASS |
| 現行baselineの完全固定 | `AI-GEN2-BASELINE-2026-09-06-v1` | PASS |
| 結果確認前のgate固定 | [固定条件](PROTOCOL.md) | PASS |
| isolated ablation | 候補有効・無効経路と固定baselineの比較 | PASS |
| 新規独立validation | P5-E validationと独立再計算 | PASS |
| 最終holdout | 512局、256 cluster、328勝184敗 | PASS |
| 正確性・戦術・運用品質 | 3,669局面、14,869遷移、756,988 eventで不一致0。固定深度・Worker・UI回帰もPASS | PASS |
| 明示的な`ADOPT`判断 | 2026年9月7日のユーザー指示と本記録 | PASS |
| 公開defaultへの実配備 | main `650b4312ed9cd318d9981523533dd692bdce6125`由来のhard/expert設定を公開し、6 asset一致とChrome相当経路を確認 | PASS |

すべての条件が成立したため、`AI-GEN3`は予約名ではなく現在の公開AI系統となる。

## 採用範囲

| 項目 | 内容 |
| --- | --- |
| 正式採用候補 | `PBAI-C011-v1` |
| 有効範囲 | hard / expertの既定`bao`・`phase2`探索 |
| 対象外 | easy、normal、明示的`legacy`・`mcts`・`bao-v2` |
| 保持する意味 | ルール、評価関数、探索方式、合法手、終局判定 |
| 工学上の判断 | `EQUIVALENT-COMPUTATION-SPEEDUP` |
| 棋力判断 | `STRENGTH-IMPROVED-IN-FROZEN-DOMAIN` |

最終holdoutの勝点率は0.640625、cluster bootstrap 95％区間は[0.611328125, 0.669921875]である。これは固定したNode/Linux上の100ms/D8範囲における改善を示す。スマートフォン実機、端末横断の速度、標準500ms対局棋力まで一般化しない。

## 過去結果との境界

P4の`STRENGTH-NON-ESTIMABLE / HOLD`は変更しない。P1〜P3およびPBAI-C001〜C010の正式結果、未実行・保留・技術的不成立も変更しない。P5はP4の結果を救済して書き換えたものではなく、新規seedと独立した実行契約による別Programである。Research Generation 4とは独立しており、研究世代とAI世代を対応付けない。

## 画面表示と配信境界

ゲーム画面にはコンピュータ対戦時だけ「AI · AI-GEN3」を表示し、title属性で`AI-GEN3-RELEASE-001`を確認できるようにする。この表示更新は正式判断を利用者へ明示するためのもので、AIの計算内容を変更しない。

正式昇格の判断時点で候補の公開default配備は完了しているため、AI系統の状態は`ADOPTED / PROMOTED`である。一方、画面表示とPWA cache v26は手動Cloudflare配信を必要とする。配信前は`UI-DISCLOSURE-DEPLOYMENT-PENDING`として区別し、AI本体の採用を未実行へ戻して解釈しない。

## Releaseの正本

機械可読のrelease正本は[AI-GEN3-RELEASE-001.json](releases/AI-GEN3-RELEASE-001.json)とする。問題が確認された場合はhard/expertのfeature flagを無効化し、service workerのcache名を更新したmainの`public/`を再配信する。rollbackを実行した場合は、公開AI系統とrelease状態を新しい明示的判断として記録し、P5の科学的結果を変更しない。
