# G5-01 — 独立ルール遷移の技術検証報告

実施日: 2026-10-12（日本時間）  
判断: **`STAGE0-TRANSITION-TECHNICAL-PASS`**

## 結果

現行ルールを呼び出さない独立実装が、固定fixture上の合法手集合・nyumba全選択肢・盤面遷移についてproductionと一致した。前のStage 0で共有していた遷移計算を今回分離できた。これは固定範囲での技術合格であり、全状態空間の正しさを証明した結果ではない。

| 項目 | 検証結果 |
| --- | --- |
| 固定root | 既知・構成40局面 |
| 相対深さ | 2 |
| distinct RAW状態 | 416 |
| 全手を展開したRAW親 | 153 |
| 合法遷移の照合 | 411辺すべて一致 |
| takasia検出の既知条件 | 17件すべて一致 |
| ルール分類のcoverage | 事前固定15分類すべて成立 |
| 通常照合中のruntime安全上限到達 | 0件 |
| 独立遷移テスト | 6件すべて合格 |
| 前のStage 0の回帰 | 7件と保存済みPython検算が合格 |

coverageにはnamua・mtaji、capture・takata・pass、後列、nyumba停止・使用、houseTwo、段階移行、takasia入力・成立、pending捕獲、front-empty、no-moveを含む。入力非変更とKETE総量保存も全411辺で確認した。

## 安全上限の境界

E30のruntime上限を検証用VM内だけで3と4へ変え、対象穴への最終着地が安全上限より優先されることを別実装で照合した。独立実装の着手内部資源上限1では `ADMIN-CUTOFF` となり、子状態・勝者を作らないことも確認した。

通常完了の411辺では、runtimeモードと上限なしモードも同じ子状態になった。ただし、今回の範囲に着手内再帰の実例はなく、任意の長い蒔きが完了することを保証しない。新規の完全解析では全合法辺を再照合し、再帰・未完・安全停止を適格な厳密解に混ぜない。

## 来歴と再現性

実行前固定コミットは `ec2607dfc4a09b62d2aaa56f75740f9f551992e4`。productionのコピーは基準main `6decdd2bb3979d96420e4da6ff4592be70c8d6c4` の公開エンジンと同じbyteである。旧Stage 0の契約・ソース固定・結果は変更していない。

ローカル結果は[測定JSON](results/result.json)、Actionsの確認は[CI来歴](results/CI_RECEIPT.json)に保存した。[run 38231679692](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38231679692) / attempt 1はsuccessであり、Actionsのcore hashがローカルと一致した。

```text
6aebb6aa2d2a06f195800c218a53f7fb7f8ea518b153e17e3329ee6861dc91f9
```

ローカルでは137 ms、最大RSS 58,658,816 bytesで完了した。新規局面の完全解析費用への外挿はしない。Gitに保存した測定JSONはローカル実行の記録であり、Actions artifactのbyteコピーではない。

## 次の作業

[開発診断設計](../DEVELOPMENT_PLAN.md)で、最大32対局、最初の最大8候補、1領域5,000状態・50,000辺・60秒、全体15分という具体案を整理した。正式なseed区画・lease・実行用ソース固定はまだ発行していない。

次はこの設計を実行契約へ固定し、独立再生と全閉包照合、Actionsの消費記録・中断保存を実装してから、新規局面の供給・資源診断を開始する。今回の技術合格だけで順位変動と勝敗損失の科学的関係を主張しない。
