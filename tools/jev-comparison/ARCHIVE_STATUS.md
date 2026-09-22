# Jev比較ツールの保存状態

- 更新日: 2026年9月22日
- 対象Study: `JEV-BAO-STRENGTH-20260921-v1`
- 状態: **`COMPLETED / CLOSED`**

## このディレクトリの役割

このディレクトリは、Jev組込版とAI-GEN4の比較試験に使ったコード、固定計画、manifest、無課金検証コードを履歴保存する。既存の`README.md`や段階別文書は配布時点の操作記録であり、そこに記載された有料実行手順は現在の承認を意味しない。

現在の正式結果と終了境界は[`doc/ai-engineering/jev-ai-gen4-comparison/`](../../doc/ai-engineering/jev-ai-gen4-comparison/)を正本とする。

## 追加課金の禁止

本Studyは終了した。次の操作はすべて禁止する。

- `run ... --live`
- `resume ... --live`
- 診断コマンドの`--live`
- 同じStudy IDに対する追加局面・追加対局・追加再試行

APIキーはリポジトリに保存しない。

## 無課金で許容する検証

模擬HTTP応答と一時台帳だけを使う次の検証は、実API呼出し0回で実行できる。

```bash
node tools/jev-comparison/strength-qa.cjs
```

保存済み生データを監査する場合もread-onlyで扱い、費用台帳、棋譜、要求、応答、判断ファイルを書き換えない。
