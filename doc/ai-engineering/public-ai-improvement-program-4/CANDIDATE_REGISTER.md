# PBAI-P4 — 候補台帳

## 唯一の候補

| 項目 | 固定内容 |
| --- | --- |
| Candidate ID | PBAI-C011-v1 |
| 日本語名 | 探索専用の軽量な局面遷移 |
| feature flag | pbaiC011LightweightTransitions |
| 既定値 | false |
| 対象 | hard/expert、bao評価、phase2探索 |
| 機構 | 共通ルール処理のイベントから表示用stateのみを省く |
| 保持する情報 | 全eventの順序・kind・position・count、最終状態の全field |
| 現在状態 | VALIDATION-PASS / HOLDOUT-IN-PROGRESS |

記録方式は探索インスタンスへ束縛し、一時的なグローバル切替を使わない。評価内のcapture/relay集計とmoveVariantsのhouseChoice比較も、同じ軽量窓口を使う。通常APIの詳細出力は維持する。

PBAI-C001〜C010とは異なる計算上の介入であり、過去候補の救済ではない。同じ候補を改名して追加すること、失敗後にseedやgateを追加することは認めない。

## 今回は扱わない後続案

小型の学習型評価関数、学習による着手順予測、手番をまたぐ計算結果の再利用は後続の構想として残す。本Programの候補IDは付与せず、実装・学習・評価をしていない。播種経路の事前計算とJSONコピー置換も対象外であり、本件の結果に便乗した組合せを作らない。
