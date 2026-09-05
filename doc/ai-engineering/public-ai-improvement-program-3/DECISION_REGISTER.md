# `PBAI-P3` — 工学判断台帳

Program: `PBAI-P3`

状態: **`COMPLETE / KEEP-AI-GEN2`**

この台帳は、`PBAI-P3`で行ったAI Engineering上の判断を時系列で記録します。Research Generation 3のformal conclusionは研究文書の管轄にあり、本台帳では変更しません。公開系統と配備に関する判断は[`RELEASE_REGISTER.md`](RELEASE_REGISTER.md)へ分離します。

## D-001 — Program初期化と証拠上限

日付: 2026-09-05

```text
Program ID = PBAI-P3
formal title = Generation-3 Evidence-Informed Public Bao AI Improvement Program 3
initial authorization = AUTHORIZED-FOR-PROGRAM-INITIALIZATION-ONLY
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baseline = AI-GEN2-BASELINE-2026-09-05-v1
```

Research Generation 3までの正式成果を限定的な設計入力として利用し、Research Generation 4を除外しました。`PBAI-P1`、`PBAI-P2`、`PBAI-C001..C009`は完了状態を維持し、再開・改名救済・事後変更を禁止しました。この時点ではcandidateを選定、実装、評価していません。

根拠: [`checkpoints/2026-09-05-program-initialization-freeze.md`](checkpoints/2026-09-05-program-initialization-freeze.md)

## D-002 — Prospective contractの凍結

日付: 2026-09-05

```text
PBAI-P3-C = COMPLETE / CONTRACT-FROZEN / PRE-SUPPORT
candidate inventory = PBAI-P3-INITIAL-CANDIDATE-INVENTORY-2026-09-05-v1
candidate = PBAI-C010-v1 only
support spec = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1
global gate = PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1
candidate implementations observed = 0
candidate outcomes observed = 0
```

root legal widthと完了iteration間のranking-preorder churnを結合triggerとし、上位3手だけを固定node reserve内で追加検証する仮説を、結果を見る前に1候補として固定しました。development、validation、release holdoutのsplit、quality・safety・cost・compatibility gate、negative control、独立再構成、no-rescue ruleも同時に固定しました。

根拠: [`checkpoints/2026-09-05-p3-c-contract-freeze.md`](checkpoints/2026-09-05-p3-c-contract-freeze.md)

## D-003 — `PBAI-P3-D`だけの実行認可

日付: 2026-09-05

```text
authorization scope = PBAI-P3-D only
candidate implementation = NOT AUTHORIZED
development benchmark = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
```

認可対象を、`AI-GEN2`だけを使う実装前support / reachability監査、隔離harness、独立verifier、固定成果物の生成に限定しました。candidate feature-on code、benefit endpoint、game outcome、保護seedへのアクセスは認可しませんでした。

根拠: [`authorizations/2026-09-05-p3-d-execution-authorization.md`](authorizations/2026-09-05-p3-d-execution-authorization.md)

## D-004 — Support gateの工学判断

日付: 2026-09-05

```text
execution commit = 3015ca39346901de8172677383331e4965871b68
eligible trigger roots = 1164 / PASS
probe-complete roots = 23 total / Namua 6 / Mtaji 17 / FAIL
technical failures = 0
instrumentation semantic mismatches = 0
independent verification = PASS / exact aggregate match
candidate disposition = HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
```

top-3 probe completionは凍結条件の合計96件以上かつphase別32件以上を満たしませんでした。これはcandidateの品質劣位やResearch Generation 3の反証ではなく、凍結した介入形を評価するためのsupport不足という工学判断です。

根拠: [`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md)

## D-005 — Candidate closureとno-rescue

日付: 2026-09-05

`PBAI-C010-v1`を実装せず閉じました。seed・sampleの追加、reserve拡張、threshold緩和、phase統合、endpoint変更、別名での救済を行いません。初期inventoryはこの1件だけであるため、結果確認後に別candidateを追加せず、`PBAI-P3-E`以降を`NOT-AUTHORIZED / NOT-EXECUTED`としました。

根拠: [`checkpoints/2026-09-05-p3-d-support-closure.md`](checkpoints/2026-09-05-p3-d-support-closure.md)

## D-006 — Program最終判断

日付: 2026-09-05

```text
PBAI-P3 = COMPLETE
formal ADOPT = none
candidate implementations = 0
development benchmark executions = 0
validation executions = 0
release holdout executions = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```

後続Stageへ進む候補がないため、凍結済みclosure mappingに従い`KEEP-AI-GEN2`を確定しました。この判断はscientific benchmarkの判断ではなく、公開製品へ変更を採用しないというAI Engineering上のProgram判断です。

根拠: [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)、[`RELEASE_REGISTER.md`](RELEASE_REGISTER.md)
