# 公開Bao AI改善Program 3（`PBAI-P3`）

正式題目: `Generation-3 Evidence-Informed Public Bao AI Improvement Program 3`

開始日: 2026-09-05

状態: **`COMPLETE / KEEP-AI-GEN2`**

`PBAI-P3`は、完了済みResearch Generation 3の正式成果を設計入力として、現在公開中の`AI-GEN2`を改善できるかを工学的に評価する独立Programです。Research Generation 4とは別であり、`PBAI-P1`または`PBAI-P2`の再開・延長・救済ではありません。

Program開始認可、科学証拠cutoff、現在の公開用source、baselineに加え、initial candidate inventory、fresh split、prospective global gate、support / reachability protocolを結果確認前に固定しました。`PBAI-P3-D` baseline-only support auditではtop-3 probe completionが未達となり、`PBAI-C010-v1`を実装せず閉じました。

## 最初に読む

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の正式状態と次に許可される作業
2. [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md) — Programの最終判断
3. [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — supportとProgramの工学判断
4. [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md) — 公開系統とリリース判断
5. [`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md) — P3-Dの件数、gate、artifact hash
6. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — Programの工程と判断境界
7. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md) — 1件に閉じたinitial candidate inventory
8. [`SUPPORT_REACHABILITY_PROTOCOL.md`](SUPPORT_REACHABILITY_PROTOCOL.md) — 実装前baseline-only監査契約
9. [`SUPPORT_REACHABILITY_RUNBOOK.md`](SUPPORT_REACHABILITY_RUNBOOK.md) — exact実行手順と成果物
10. [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md) — fresh splitとprospective global gate
11. [`GENERATION_3_EVIDENCE_AUDIT.md`](GENERATION_3_EVIDENCE_AUDIT.md) — 使用可能なResearch Generation 3証拠
12. [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md) — 科学研究とAI Engineeringの分離規則
13. [`BASELINE_SPEC.md`](BASELINE_SPEC.md) — `AI-GEN2`のexact source identity
14. [`RESUME_HERE.md`](RESUME_HERE.md) — 終了後の境界
15. [`checkpoints/2026-09-05-pre-main-documentation-and-workflow-readiness.md`](checkpoints/2026-09-05-pre-main-documentation-and-workflow-readiness.md) — main統合前の文書・workflow最終監査

## 固定したProgram identity

```text
Program ID = PBAI-P3
formal title = Generation-3 Evidence-Informed Public Bao AI Improvement Program 3
initial authorization decision = AUTHORIZED-FOR-PROGRAM-INITIALIZATION-ONLY
latest completed stage = PBAI-P3-D / SUPPORT-FAIL / CLOSED
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baseline = AI-GEN2-BASELINE-2026-09-05-v1
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

`scientific evidence cutoff`はResearch Generation 3最終統合後のbookkeeping commitです。`initialization main`はProgram開始時のリポジトリ運用状態と公開用sourceを固定する別のanchorです。後続のResearch Generation 4文書が`main`に存在しても、PBAI-P3の科学証拠を拡張しません。

## 現時点の判断

```text
PBAI-P3-A = COMPLETE
PBAI-P3-B = COMPLETE
PBAI-P3-C = COMPLETE / CONTRACT FROZEN
PBAI-P3-D = COMPLETE / SUPPORT-FAIL
PBAI-P3-E and later = NOT-AUTHORIZED / NOT-EXECUTED
candidate identifiers issued = 1 / PBAI-C010-v1
candidate implementations = 0
support executions = 1
benchmark executions = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```

Programが初期化されたことは、候補の有効性、公開AIの改善、`ADOPT`、または`AI-GEN3`への昇格を意味しません。正式採用と実際の公開default配備が完了するまでは、実験候補を`AI-GEN3`と呼びません。

## 設計入力と利用境界

- `G3-07 / SILGM-STUDY1`のroot legal widthとranking-preorder changeの限定的な関連は、選択的root再検証という仮説を組み立てる入力にできます。
- `G3-04 / SFCDF-STUDY1`はphase別のbenchmark層別化と慎重なbudget仮説に利用できます。
- `G3-10 / GCLD-STUDY1`はtrajectory別の回帰試験とstress corpus設計に利用できます。
- `G3-11 / FDEGHV-STUDY1`はmove generation、RAW identity、transposition、search-loadのstress testに利用できます。
- `G3-12 / LGTGGC-STUDY1`は`TECHNICAL-INVALID`であり、一般化や全面的な公開変更の根拠にできません。

ranking変化は誤りの証明ではなく、高resource探索もground truthではありません。engine scoreを検証済みBao勝率として扱わず、search complexityを人間の難易度へ読み替えません。

## 過去Programとの境界

`PBAI-P1`と`PBAI-P2`は`COMPLETE / KEEP-AI-GEN2`です。特に次を変更しません。

- `PBAI-C004-v1`を再開、改名、軽微修正で救済しない。
- `PBAI-C008-v1`のcost gate失敗を閾値変更で救済しない。
- `PBAI-C009-v1`のbenefit / negative-control失敗をcontrol再定義で救済しない。
- 過去のthreshold、endpoint、classifier、seed、標本、判断を書き換えない。

新候補は、Research Generation 3の新しい正式証拠から独立して定義し、過去候補と異なるmechanism、trigger、介入、期待される因果経路を結果を見る前に明示しなければなりません。

## 最終判断と実行境界

`PBAI-C010-v1`はtop-3 probe completionが合計23件、Namua 6件、Mtaji 17件となり、必要な合計96件、phase別32件を満たしませんでした。独立verifierはproduction結果を完全再構成し、technical failureとsemantic mismatchはいずれも0件でした。formal dispositionは`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`です。

次の作業は未承認です。

- candidate-specific development contractとsource surfaceの固定
- 公開用sourceとbenefit benchmark harnessの変更
- candidate実装、benchmark、validation、release holdout
- 公開default変更、deployment、`main`統合、`AI-GEN3`昇格

PBAI-P3内の候補追加、候補実装、再測定は行いません。別の改善を検討するには、新しいProgramのoutcome非依存な開始認可レビューが必要です。
