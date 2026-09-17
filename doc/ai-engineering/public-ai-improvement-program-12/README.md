# 公開Bao AI改善Program 12（`PBAI-P12`）

正式作業名: **十分良い手を基準にしたマージン制限型選択探索**  
英語作業名: **Good-Enough / Margin-Bounded Selective Search**  
Candidate: **`PBAI-C016-v1`**  
Baseline: **`AI-GEN4-BASELINE-2026-09-17-v1`**  
開始日: 2026-09-17  
終了日: 2026-09-17

## 1. 最終状態

```text
PBAI-P12-A = COMPLETE / AUTHORIZED
PBAI-P12-B = COMPLETE / SUPPORT-PASS
PBAI-P12-C = COMPLETE / CANDIDATE-SPEC-FROZEN
PBAI-P12-D = COMPLETE / DEVELOPMENT-GATE-FAIL
PBAI-P12-E = NOT-EXECUTED / NOT-AUTHORIZED
PBAI-P12-F = NOT-EXECUTED / NOT-AUTHORIZED
PBAI-P12 = COMPLETE / KEEP-AI-GEN4
PBAI-C016-v1 = NOT-ADOPTED / CLOSED
public lineage = AI-GEN4
public change = NONE
```

## 2. 結論

baseline support計測では、現行PVSに再探索コストが十分残っていることを確認した。そのためcandidate mechanismをprospectiveに固定し、予約済みdevelopment seedだけを使って`Δ = 16 / 32 / 64`を比較した。

しかし3値すべてで、事前に要求したeligible局面のnode比`candidate / baseline <= 0.97`を満たさなかった。再探索省略は発生したものの、margin幅probeの費用が節約分を上回った。

したがって`PBAI-C016-v1`は不採用とし、公開AIは`AI-GEN4`を維持する。結果確認後のthreshold変更・追加margin探索による救済は行わない。

## 3. 未実行工程とmain保存の区別

候補AIについて、以下は実行していない。

- independent validation
- protected release holdout
- 正式な棋力試験
- browser / smartphone実機試験
- 公開Worker組込み
- candidateの`public/`への統合・公開配信
- release発行・AI世代昇格

一方、閉鎖記録、再現用engineering tools/workflows、保存済み計測成果物は、2026年9月17日にPR #147で`main`へ履歴保存済みである。この履歴保存はcandidateの採用・公開統合を意味しない。現在状態の詳細は[`CURRENT_STATUS.md`](CURRENT_STATUS.md)を参照する。

未消費seedは`121220001..121220064`と`121230001..121230064`である。

## 4. 文書

1. [`AUTHORIZATION_REVIEW.md`](AUTHORIZATION_REVIEW.md) — 開始認可とbaseline support gate
2. [`CANDIDATE_SPEC.md`](CANDIDATE_SPEC.md) — candidate結果を見る前に固定した仕様とdevelopment gate
3. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 終了後の正式状態
4. [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 各段階の判断記録
5. [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md) — 最終報告
6. [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md) — release・世代昇格を行わない判断
7. [`../../../artifacts/pbai-p12/baseline-support.json`](../../../artifacts/pbai-p12/baseline-support.json) — baseline support結果
8. [`../../../artifacts/pbai-p12/candidate-development.json`](../../../artifacts/pbai-p12/candidate-development.json) — development結果

## 5. 再開境界

`PBAI-P12`と`PBAI-C016-v1`は閉鎖済みとして再開しない。

将来、今回の知見から別の再探索削減方式を検討する場合は、materially newなmechanismとして新しいProgram / Candidate ID、baseline、seed、prospective gateを設定して開始する。
