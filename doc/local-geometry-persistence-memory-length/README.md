# 局所ゲーム木幾何の持続時間とmemory length — `LGPML-STUDY1`

Research Generation 3 `G3-08` / `LGPML-STUDY1` の研究ディレクトリ。

現在のlifecycle状態:

**`CLOSED / TECHNICAL-INVALID`**

program authorization:

**`G3-08-AUTHORIZED`**

正式題目:

**Local Geometry Persistence / Memory-Length Study 1 — Prospective exact analysis of lagged change-sign dependence, bounded persistence, reversal, first-exit, and return in RAW local game-tree geometry along Bao trajectories**

日本語正式題目:

**Bao局面における局所ゲーム木幾何の持続時間とmemory lengthのprospective exact解析 — trajectory上のRAW局所幾何変化におけるlagged change-sign dependence、持続・反転、first-exit・returnの再現可能な検証**

Scientific foundationは`LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`のみを必須measurement dependencyとし、RAW-only / relative depth 5 / validated transforms `[]`を維持した。

Primary formal constructは6個のprospectively fixed geometry levelについて、one-ply change signのlag `{1,2,4,8}` におけるsame-sign / opposite-sign dependenceをsource trajectory単位で検証する設計だった。first-exit / returnはsecondary descriptiveでformal promotion family外。

Stage 0 technical v1は`STAGE0-PASS`。fresh Stage 1はexactly one authorized executionで開始したが、10 trajectoryのcomplete frozen development populationを完遂する前にrequired bounded RAW reconstruction中で`relay-limit enumeration` technical errorへ到達した。

したがって:

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = CLOSED / TECHNICAL-INVALID
same-evidence rescue = PROHIBITED
```

このclosureはgeometry persistenceのnegative/null scientific findingではない。partial Stage 1 trajectory measurementsはtechnical provenanceとしてのみ保持し、candidate promotion、memory-length claim、phase-specific persistence claimへ使用しない。

G3-07の3 CONFIRMED candidatesやG3-05 technical-invalid scientific outputをG3-08 selection inputにしていない。

Protected standard-initial RAW-root complete exact depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま。

mainへの統合は2026-09-03の明示的ユーザー指示を受け、research branch tip `72bd208267359f461e9dbbde938bb952eb01b91c` からfast-forward / `force=false`で完了した。

## 主要文書

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — 固定済みprotocol
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 最終報告
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の状態
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 判断記録
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — 再現性索引
- [`prereg/`](prereg/)
- [`authorizations/`](authorizations/)
- `results/stage-0-v1/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-1/scientific-result.json`
