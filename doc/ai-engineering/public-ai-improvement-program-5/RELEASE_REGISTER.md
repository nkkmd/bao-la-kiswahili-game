# PBAI-P5 — 公開リリース台帳

状態: `STAGED-ACTIVATION-READY / NOT-YET-DEPLOYED`。

## リリース対象

| 項目 | 値 |
| --- | --- |
| Program | `PBAI-P5` |
| Candidate | `PBAI-C011-v1` |
| 科学的判断 | `STRENGTH-IMPROVED-IN-FROZEN-DOMAIN` |
| 計算上の判断 | `EQUIVALENT-COMPUTATION-SPEEDUP` |
| 公開対象 | hard / expertの既定`bao`・`phase2`探索 |
| 公開対象外 | easy、normal、明示的`legacy`・`mcts`・`bao-v2` |
| ルール・評価・探索方式 | 変更なし |
| AI世代 | `AI-GEN2`を維持。`AI-GEN3`昇格は別判断 |

`public/ai-config.js`はhardとexpertの既定optionsへ`pbaiC011LightweightTransitions: true`を追加する。`public/ai.js`側の既存gateにより、既定のBao評価・phase2探索以外では軽量経路を使わない。`public/service-worker.js`はcacheを`bao-la-kiswahili-v25`へ更新し、旧assetの混在を避ける。

## 公開前と公開後のgate

公開前に、全Node test、候補の正確性・固定深度・VM/global script・実`worker_threads`回帰、hard/expertだけのconfig有効化、通常の詳細event維持を確認する。実サイト反映後に、配信assetのhash、ページ読み込み、Worker対応、console error、難易度optionsを実ブラウザーで確認する。

完了済みの研究testには、当時の公開source hashとの一致自体を確認するものがあるため、現在sourceへ変更が入れば意図どおり停止する。これらを現行公開回帰として再実行せず、固定commit上の履歴証拠として扱う。公開前gateは上記の現行engine・AI・config・Worker・候補境界testを対象とする。P5の証拠監査も、測定時sourceは実行HEADから復元して照合し、公開configだけを測定時と同じに戻さない。

P5準備workflowは科学run開始前の専用branchだけで動くよう制限する。完了後の公開config変更やmanual dispatchで、使用済みseed向けpreflightを再実行しない。保存済み証拠の検算はP5完了証拠workflowを使う。

この段階的反映は正式な`ADOPT`または`AI-GEN3`昇格を先取りしない。配信確認に失敗した場合は、feature flagをfalseへ戻し、PWA cacheを再更新する。科学的結果はrollbackの成否によって変更しない。

## 状態更新規則

main統合前は`NOT-YET-DEPLOYED`、main統合後で配信確認前は`DEPLOYMENT-PENDING`、配信assetとブラウザーgate通過後は`STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`と記録する。正式な`ADOPT`、release ID発行、`AI-GEN3`昇格には別の明示的判断を必要とする。
