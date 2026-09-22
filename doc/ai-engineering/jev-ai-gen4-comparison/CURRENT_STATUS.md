# `JEV-BAO-STRENGTH-20260921-v1` — 現在状態

更新日: 2026年9月22日

## 正式状態

```text
study = JEV-BAO-STRENGTH-20260921-v1
execution = COMPLETED / CLOSED
technical audit = AUDIT-PASS
formal games = 64 / 64
Jev wins = 32
AI-GEN4 wins = 32
tied pairs = 32 / 32
formal decision = INCONCLUSIVE
public adoption = NOT-ADOPTED / PROHIBITED-BY-STUDY-SCOPE
additional paid API calls = PROHIBITED
public lineage = AI-GEN4
public release = AI-GEN4-RELEASE-001
public code change = NONE
```

## 判定の意味

`INCONCLUSIVE`の直接理由は、事前指定した方向性のある2勝0敗ペアが0件で、優劣を推定する情報が得られなかったことである。この判定は、Jev組込版とAI-GEN4の同等性を証明せず、Jevの他の組込方式の性能も判定しない。

## 終了境界

- 同じStudy IDで局面を追加したり、別の統計条件で救済したりしない。
- `run ... --live`、`resume ... --live`、診断用の`--live`を含む有料API呼出しを実行しない。
- 費用台帳をリセット・編集・短縮しない。未確定予約`$0.016515072`も保持する。
- 棋譜、要求、保存応答、判断データを上書き・削除しない。
- Jev組込版を`public/`へ組み込まず、AI世代やrelease識別子を変更しない。

将来Jevに関する別の試験を検討する場合は、新しいStudy ID、新しい計画、独立した費用認可を結果確認前に固定する。本Studyの自動的な再開とは扱わない。
