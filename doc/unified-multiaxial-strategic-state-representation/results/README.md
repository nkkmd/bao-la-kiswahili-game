# UMSSR-STUDY1 — results管理

## 現在の状態

2026-08-30のinitial prospective freeze時点で、G2-10のscientific resultは存在しない。

```text
Stage 0 technical result = NOT YET PRODUCED
Stage 1 development result = NOT YET PRODUCED
Stage 2 formal result = NOT YET PRODUCED
Study final result = NOT YET PRODUCED
scientific evidence generated = false
```

成果物が存在しないことをnegative / null resultと解釈してはならない。Stage 1 / Stage 2はいずれも未承認・未実行である。

## 将来のcanonical result

Stage progressionが承認された場合、各Stageのmachine-readable resultをこのdirectoryへmaterializeする。少なくとも次の役割を分離する。

- Stage 0 technical result
- Stage 1 development result
- Stage 1 independent verification / exact comparison
- Stage 1 readiness / representation freeze result
- Stage 2 production formal result
- Stage 2 independent formal verification
- Stage 2 canonical formal result
- Study final result

実際のfile名、schema、hash bindingは各Stageのsource/spec freeze時に固定する。

## 解釈上の禁止

- production-only outputをaccepted scientific resultへ昇格しない。
- artifact欠損やtechnical failureをscientific negativeへ読み替えない。
- Stage 1 development observationをStage 2 formal evidenceとして再利用しない。
- absent resultを`0`、`NOT-CONFIRMED`、`NON-ESTIMABLE`等へ自動変換しない。
