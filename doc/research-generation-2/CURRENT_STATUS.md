# Research Generation 2 — 現在の状態

更新日: 2026-08-31
Program: `Bao Second-Generation Research Program`（正式Program名）
状態: **`CLOSED / INTEGRATED TO MAIN`**

Research Generation 2のcore `G2-01..G2-12`は、すべてformal closureを持ち、中央文書とともに`main`へ統合済みです。新たに実行できるStageや、同じ証拠を用いた再判定はありません。

## Core agendaの最終状態

| Agenda / Study | 最終状態 | 読み方 |
| --- | --- | --- |
| `G2-01` / `PEOCR-STUDY1` | `INCONCLUSIVE` | validated Bao win-probability mappingは得られていません。 |
| `G2-02` / `SRDR-STUDY1` | `INCONCLUSIVE` | primary criterionはformalに評価されていません。 |
| `G2-03` / `STSCV-STUDY1` | `INCONCLUSIVE` | validated transform setは`[]`です。 |
| `G2-04` / `REEOE-STUDY1` | `INCONCLUSIVE` | Stage 2は承認されていません。 |
| `G2-05` / `DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | standard initial RAW rootのdepth 0〜9だけをexactに扱います。 |
| `G2-06` / `RCPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | Stage 2は未承認です。 |
| `G2-07` / `PCRPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | Stage 2は未承認です。 |
| `G2-08` / `MDFT-STUDY1` | `NON-ESTIMABLE` | taxonomyはformal promotionされていません。 |
| `G2-09` / `TMGC-STUDY1` | `TECHNICAL-INVALID` | formal generalization evidenceはありません。 |
| `G2-10` / `UMSSR-STUDY1` | `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION` | `selectedRepresentation = null`、StudyとStage 2は未承認・未実行です。 |
| 前提Study / `PSRRE-STUDY1` | `NON-ESTIMABLE` | `selectedRepresentation = null`です。 |
| `G2-11` | `NON-ESTIMABLE` | dependency gateで閉じ、正式Study IDは付与していません。 |
| `G2-12` / `SSGTGE-STUDY1` | `TECHNICAL-INVALID` | `selectedEstimator = null`です。 |

## G2-11を実行しなかった理由

G2-11には、事前に適格化されたstrategic-regime representationが必要でした。しかしG2-10と独立前提Study `PSRRE-STUDY1`の双方でeligible frozen representationを得られませんでした。

入力表現を結果後に選び直すと、上流Studyのclosureを事後的に救済することになります。そのため追加の前提Studyを同世代内で繰り返さず、次の状態で閉じました。

```text
Formal Study ID = NOT ASSIGNED
Scientific disposition = NON-ESTIMABLE
Execution disposition = NOT-AUTHORIZED-NOT-EXECUTED
Scientific outcome generated = false
```

これはlong-horizon transition structureが存在しないというnegative resultではありません。

## 人間を対象とする研究

`G2-H01 — Human / Expert Strategic Judgment Study 1`は`DEFERRED / INDEPENDENT / NON-BLOCKING`です。qualified participantへのアクセスがない状態で、machine-only evidenceを人間の判断の代用にはしません。未実施であることはcore programの完了を妨げません。

## 不変の境界

```text
RAW state identity = authoritative
validated transform set = []
G2-11 execution = NOT-AUTHORIZED-NOT-EXECUTED
whole-Bao state-space estimate = NOT AUTHORIZED
whole-Bao game-tree estimate = NOT AUTHORIZED
G2-12 fresh depth 10/11 = not generated / not read
```

`INCONCLUSIVE`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`をnegative resultへ読み替えず、closed Studyを同じevidenceで再実行・再判定しません。

## 読む順序

1. [`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md) — 世代全体の結論と解釈境界
2. [`PROGRAM_FINAL_RESULT.json`](PROGRAM_FINAL_RESULT.json) — machine-readableな最終状態
3. [`../research-program-decisions/2026-08-31-research-generation-2-program-closure.md`](../research-program-decisions/2026-08-31-research-generation-2-program-closure.md) — program closureの正式記録
4. [`../research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md`](../research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md) — G2-11を実行しなかった判断
5. [`checkpoints/2026-08-31-main-integration-complete.md`](checkpoints/2026-08-31-main-integration-complete.md) — `main`統合記録

## 統合状態

`main`へのforceなしfast-forward integrationは2026-08-31に完了しました。closure用の一時的なwrite-capable workflowとmaintenance helperは削除済みで、authorization JSONとcheckpointはprovenanceとして保持しています。
