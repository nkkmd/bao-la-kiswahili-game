# `PBAI-P12` — 現在状態

更新日: 2026-09-17
Program: **`PBAI-P12`**
Candidate: **`PBAI-C016-v1`**

## 正式状態

```text
PBAI-P12 = COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4
PBAI-C016-v1 = NOT-ADOPTED / CLOSED
public lineage = AI-GEN4
public release = AI-GEN4-RELEASE-001
public code change = NONE
candidate public integration = NOT-PERFORMED
closure records main integration = PERFORMED / PR #147 / 4e8af7dcf8a0cb995a6c231fd397e5c06b7af3c6
independent validation = NOT-EXECUTED
release holdout = NOT-EXECUTED
```

## 終了理由

baseline support計測では、現行PVSにfull-window再探索費用が十分残っていることを確認したためcandidate developmentへ進んだ。

しかし、prospectiveに固定した`PBAI-C016-v1`のroot margin probe方式は、`Δ = 16 / 32 / 64`のいずれもfixed-depth development gateを通過しなかった。再探索省略は一部発生したが、probe自体の費用が節約分を上回り、eligible局面のnode数を削減できなかった。

結果確認後にthreshold、margin候補、安全条件、seed、gateを緩和して候補を救済しない。したがって候補は不採用とし、公開AIは`AI-GEN4`を維持する。

## main保存と公開統合の区別

2026年9月17日、閉鎖記録、再現用engineering tools/workflows、保存済み計測成果物はPR #147で`main`へ統合した。これはProgramの履歴と再現性を保存するための統合であり、`PBAI-C016-v1`を公開AIへ採用・組み込んだことを意味しない。

`public/`のAIコード、公開release、AI世代には変更を加えていない。

## 未消費データ

次のseed blockは未使用のまま終了する。

- independent validation: `121220001..121220064`
- protected release holdout: `121230001..121230064`

これらを`PBAI-C016-v1`の後続評価に使用しない。将来、materially newな別candidateを開始する場合は、新しいProgram / Candidate IDと新しいprospective contractを作成する。

詳細は[`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)と[`DECISION_REGISTER.md`](DECISION_REGISTER.md)を参照する。
