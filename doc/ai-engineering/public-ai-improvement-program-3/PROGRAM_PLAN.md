# `PBAI-P3` — Program計画

状態: **`COMPLETE / KEEP-AI-GEN2`**

固定日: 2026-09-05

Program: `PBAI-P3`

## 1. 目的

Research Generation 3の正式成果を、意味を拡張せず工学的な設計入力として使用し、現在の公開AI `AI-GEN2`より品質、安全性、計算量、互換性の総合条件を満たす候補が存在するかを評価します。

科学研究の結論と公開製品の判断は別に記録します。候補が成功または失敗しても、Research Generation 3のformal conclusionは変更しません。

## 2. Stage構成

| Stage | 役割 | 現在状態 |
| --- | --- | --- |
| `PBAI-P3-A` | 開始認可、RG3 evidence audit、cutoff固定 | `COMPLETE` |
| `PBAI-P3-B` | 現在の公開AI監査とexact baseline固定 | `COMPLETE` |
| `PBAI-P3-C` | candidate inventory、fresh split、global gate、support protocol固定 | `COMPLETE / CONTRACT FROZEN` |
| `PBAI-P3-D` | baseline-only support / reachability audit | `COMPLETE / SUPPORT-FAIL` |
| `PBAI-P3-E` | candidate別development認可とexact contract固定 | `NOT-AUTHORIZED / NOT-EXECUTED` |
| `PBAI-P3-F` | isolated feature-gated developmentとfresh benchmark | `NOT-AUTHORIZED / NOT-EXECUTED` |
| `PBAI-P3-G` | 独立再構成とfresh validation | `NOT-AUTHORIZED / NOT-EXECUTED` |
| `PBAI-P3-H` | protected release holdoutと正式判断 | `NOT-AUTHORIZED / NOT-EXECUTED` |
| `PBAI-P3-I` | rollback確認、公開default配備、lineage昇格 | `NOT-AUTHORIZED / NOT-EXECUTED` |

各Stageは明示的な認可を必要とします。`PBAI-P3-D`のsupport不足で唯一の候補を閉じたため、後続Stageは認可せず未実行のままProgramを終了しました。

## 3. 評価単位とsplit

raw plyを独立標本として扱いません。candidate contract固定時に、endpointごとに少なくとも次の独立単位を明示します。

- root単位のdecision-quality評価: authoritative RAW identityで一意化したroot
- strength評価: paired openingを共有するgame pairまたはgame cluster
- longitudinal stress評価: trajectory

development、validation、protected release holdoutはseedだけでなく、trajectory、opening prefix、root、authoritative RAW identityの重複を監査します。release holdoutはtuningへ使用しません。

## 4. prospective gateの必須領域

`PBAI-P3-C`で、candidate outcomeを見る前に次を固定しました。

- 品質: unchanged `AI-GEN2`との差、reference searchとのTopSet / rank-loss等
- 安全性: illegal move、state corruption、crash、terminal mismatch、新規重大劣化
- 計算量: wall-clock、node、timeout、completed depth、triggered / aggregate双方の上限
- 互換性: Worker / fallback、保存状態、診断schema、PWA、既存browser surface
- feature-off equivalence: deterministic outputと制御経路のexact一致
- negative control: trigger非対象、境界値、timeout、不完全ranking等での失敗0
- 独立再構成: production trigger・集計処理を流用しない別実装
- rollback: feature flag、旧asset、service-worker cache、保存データの復帰手順

閾値、endpoint、subgroup、seed、cost上限は結果確認後に変更しません。support不足またはgate失敗を、標本追加、negative control除外、候補改名で救済しません。

## 5. reference searchの役割

固定depth、fixed-node、higher-resource等の探索はengineering comparison referenceです。game-theoretic truth、真のbest move、局面価値、Bao勝率のoracleとして扱いません。candidateがreferenceとの一致を改善しても、それだけで公開採用を決めません。

## 6. candidateの識別

initial candidate inventoryは`PBAI-C010-v1`の1件に固定しました。feature flag proposalは`pbaiC010SelectiveRootReverification`で、candidate implementationとdevelopment authorizationは未発行です。正式採用と公開default配備が完了するまで`AI-GEN3`と呼びません。

## 7. 実行環境

重いformal generationをGitHub Actionsへ強制しません。必要な場合はlocalで再現可能なrunbook、固定環境、exact command、artifact hash、独立検証手順を用意します。GitHub Actionsを使う場合も、時間上限とartifact transportを結果を見る前に固定します。

## 8. 判断語彙

Programは凍結済みfailure semanticsに従い、candidate dispositionを`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`、最終Program outcomeを`KEEP-AI-GEN2`と記録しました。
