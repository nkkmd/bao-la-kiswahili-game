# `PBAI-P12` — 開始認可レビュー

認可日: 2026-09-17  
Program: **`PBAI-P12`**  
Candidate: **`PBAI-C016-v1`**  
作業名: **十分良い手を基準にしたマージン制限型選択探索**  
英語作業名: **Good-Enough / Margin-Bounded Selective Search**

## 1. 判断

**`AUTHORIZED-FOR-BASELINE-MEASUREMENT`**

今回の認可は、現行`AI-GEN4`に残るPVSの比較・再探索費用を計測し、候補実装へ進むだけのsupportがあるかを判定するところまでに限定する。

`PBAI-C016-v1`の探索機構の実装、固定marginの値決定、棋力試験、公開Workerへの組込み、公開採用、release発行、`AI-GEN5`昇格は**まだ認可しない**。

## 2. 認可根拠

開始時点で次を確認した。

- `main`の基準commitは`56c4993372820096a83b8d853e99995d88f1121e`である。
- 現在の公開AI系統は`AI-GEN4`、正式releaseは`AI-GEN4-RELEASE-001`である。
- `PBAI-P1`〜`PBAI-P11`は完了済みである。
- repository-wideの既発行candidateは`PBAI-C015`までであり、`PBAI-P12`と`PBAI-C016`は未使用である。
- [`NEXT_IMPROVEMENT_CANDIDATE.md`](../NEXT_IMPROVEMENT_CANDIDATE.md)に候補概念が記録されている。
- [`NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md`](../NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md)では、小規模な事前計測・検証へ進める価値がある一方、棋力改善は未確認と評価されている。
- 2026-09-17にユーザーから改善作業開始の明示的な指示を受けた。

## 3. baselineの固定

今回のbaselineは次とする。

```text
baseline ID = AI-GEN4-BASELINE-2026-09-17-v1
source commit = 56c4993372820096a83b8d853e99995d88f1121e
public lineage = AI-GEN4
release ID = AI-GEN4-RELEASE-001
hard/expert evaluator = PBAI-C015-v1 logic-gate evaluator
search = current production phase2/PVS path
rules = unchanged
```

比較は`BaoReleaseConfig.searchOptions`と`BaoReleaseAI`を通る現在の公開経路を基準とする。`tools/benchmark.js`だけを公開AIの代理にしない。

## 4. 証拠範囲と情報遮断

baseline support計測に使うデータは**development-only**とし、後続の最終validation / release holdoutへ再利用しない。

- baseline support seed block: `121200001..121200024`
- candidate development seed block（未使用）: `121210001..121210032`
- independent validation seed block（未使用）: `121220001..121220064`
- protected release holdout seed block（未使用）: `121230001..121230064`

後続段階へ進まなかった場合、未使用seed blockを消費済み扱いにしない。

## 5. 今回認可する計測

現行PVSについて、診断フラグを有効にした場合だけ次を取得する。

- PVSの最初の手の探索回数とnode数
- null-window scout探索の回数とnode数
- scout後のfull-window再探索回数とnode数
- root候補ごとのscout / full再探索node数
- iterative deepeningの深度ごとのnode増分
- root best move、root score、completed depth
- phase、合法手数、capture有無

診断を無効にした通常経路では探索判断を変えない。

## 6. baseline support判定条件

候補実装へ進むには、固定深度のdevelopment-only計測で次をすべて満たす必要がある。

1. 計測対象が24局面以上あり、Namua / Mtajiの双方を各8局面以上含む。
2. 診断ON/OFFで、同一局面・同一固定深度の`move`、`rootScore`、`completedDepth`が完全一致する。
3. root以外も含むPVS scoutが合計200回以上観測される。
4. full-window再探索が合計20回以上観測される。
5. full-window再探索に使われたnodeが全探索nodeの5%以上、または計測局面の20%以上でrootのfull-window再探索が発生する。

第3〜5条件のいずれかを後から緩和して候補を救済しない。support gateを満たさない場合は`NO-SUPPORT / KEEP-AI-GEN4`として大規模実装へ進まない。

## 7. 認可境界

今回の認可で実行してよいもの:

- 隔離branch上の診断instrumentation
- 診断が探索結果を変えないことの回帰test
- development-only seed blockによるbaseline support計測
- 計測結果の保存、独立検算、support判定

今回の認可で実行してはいけないもの:

- marginを使った探索省略の実装
- candidate development seed blockの消費
- independent validation / release holdoutの消費
- 公開AIの既定値変更
- `main`統合
- public deployment
- AI世代昇格

## 8. 次の判断

baseline support gateがPASSした場合だけ、baseline結果を使って候補mechanismと固定margin候補を設計し、**candidate implementation前に別のprospective specとして固定する**。

FAILの場合は、AI-GEN4を維持してProgramを早期終了する。