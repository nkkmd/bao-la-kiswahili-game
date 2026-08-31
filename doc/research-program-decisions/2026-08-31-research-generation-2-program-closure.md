# 2026-08-31 — Research Generation 2 program closure

## Decision

Bao Second-Generation Research Programのcore agenda `G2-01..G2-12`を、2026-08-31付でformal closureする。

```text
Program = Bao Second-Generation Research Program
Research generation = Research Generation 2
Core agenda = G2-01..G2-12
Program disposition = CLOSED
Human track G2-H01 = DEFERRED / NON-BLOCKING
Public AI engineering = OUTSIDE SCIENTIFIC SUCCESS CRITERIA
```

このdecisionは各Studyのformal resultを変更しない。Program closureはpositive resultの数ではなく、各agenda questionがprospective stop rule / dependency gate / no-rescue ruleに従って明示的にclosureされ、final synthesisが作成されたことに基づく。

## G2-11 final treatment

G2-11はscientific Studyとして開始されておらず、formal Study IDを付与しない。

G2-10 `UMSSR-STUDY1`はeligible frozen strategic representationを生成せず、その後の独立prerequisite `PSRRE-STUDY1`も`NON-ESTIMABLE`で閉じ、`selectedRepresentation = null`だった。

Research Generation 2を完了させるためだけに追加representation prerequisite Studyを繰り返さないことを決定したため、G2-11はagenda-levelに次で閉じる。

```text
G2-11 scientific disposition = NON-ESTIMABLE
G2-11 execution = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 formal Study ID = NOT ASSIGNED
G2-11 scientific outcome generated = false
```

これはlong-horizon transition structureのnegative resultではない。必要inputがformalに成立しなかったため、Research Generation 2 contract内ではscientifically estimableでなかったというclosureである。

詳細は`2026-08-31-g2-11-dependency-blocked-closure.md`をcanonical program decisionとする。

## Core agenda ledger

```text
G2-01 / PEOCR-STUDY1 = INCONCLUSIVE
G2-02 / SRDR-STUDY1 = INCONCLUSIVE
G2-03 / STSCV-STUDY1 = INCONCLUSIVE / validated transform set []
G2-04 / REEOE-STUDY1 = INCONCLUSIVE
G2-05 / DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
G2-06 / RCPR-STUDY1 = STAGE1-TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G2-07 / PCRPR-STUDY1 = STAGE1-TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G2-08 / MDFT-STUDY1 = NON-ESTIMABLE / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G2-09 / TMGC-STUDY1 = TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
G2-10 / UMSSR-STUDY1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
Pre-G2-11 / PSRRE-STUDY1 = NON-ESTIMABLE / selectedRepresentation null
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED / Study ID not assigned
G2-12 / SSGTGE-STUDY1 = TECHNICAL-INVALID / selectedEstimator null / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED
```

## Completion-condition audit

`doc/FUTURE_RESEARCH_AGENDA.md` Section 9.9のcompletion conditionsと同じ番号・意味で次のように閉じる。

1. G2-01〜G2-12のformal closure: **PASS**。
   - dependency gateによる未実行も事前program rule上closureとして許容されており、G2-11をagenda-level `NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED`で明示的に閉じた。
2. negative / null / inconclusive / non-estimable resultをpositiveへ救済せず保存: **PASS**。
3. Research Generation 1のformal decisionsとinterpretation boundariesを変更していない: **PASS**。
4. research engine / data identity / seed / artifact provenanceを各Studyで再現可能に保存: **PASS**。
5. evaluation、empirical outcome、exact value、search reliability、machine failure、human constructの分離: **PASS**。
6. multiaxial strategic-state representationのformal decision: **PASS**。
   - G2-10 no eligible representation、PSRRE `NON-ESTIMABLE`。
7. long-horizon transition structureのformal disposition: **PASS**。
   - G2-11 `NON-ESTIMABLE`; no scientific execution。
8. expanded restricted exact-domain / deeper RAW enumeration closure: **PASS**。
9. state-space / game-tree growth estimation formal closure: **PASS**。
   - G2-12 `TECHNICAL-INVALID`。
10. final synthesis document: **PASS**。
   - `doc/research-generation-2/FINAL_SYNTHESIS.md`。
11. public AI outcomeをscientific successへ読み替えない: **PASS**。

独立verification、fail-closed handling、prospective population / seed / identity / endpoint separationもprogram governanceとして維持したが、これらは上記Section 9.9の11項目を置き換えるものではなく、各Study contractを支える追加的なgovernance controlである。

## Program-level scientific boundary

Program closure時点で次を保持する。

```text
RAW state identity remains authoritative = true
validated transform set = []
validated strategic-regime representation available = false
formal G2-11 transition result available = false
G2-11 estimability within Generation 2 = false
G2-05 bounded depth-9 exact result remains valid within frozen domain = true
formal whole-Bao state-space estimate authorized = false
formal whole-Bao game-tree estimate authorized = false
G2-12 selectedEstimator = null
```

Program closureは、未成立のclaimを成立したことにしない。

## Human Track

`G2-H01 — Human / Expert Strategic Judgment Study 1`はprogram開始時からcore machine programに対してindependent / non-blockingと定義されている。

qualified participant accessがないためdeferredのままとする。machine-only evidenceでhuman claimを代替しない。G2-H01の未実施はcore Research Generation 2 closureを妨げない。

## Future work boundary

第二世代でformalに成立しなかったtopicを再検討する場合、closed G2 Studyをreopen / rescueしない。

特にstrategic representation、long-horizon transition、canonicalization、growth estimation、deeper exact enumeration、human judgmentは、新しい研究世代または独立prospective programとして新規contract・fresh evidenceで開始する。

## Canonical synthesis

Program全体のscientific synthesisは次を正本とする。

- `doc/research-generation-2/FINAL_SYNTHESIS.md`
- `doc/research-generation-2/PROGRAM_FINAL_RESULT.json`
- `doc/research-generation-2/CURRENT_STATUS.md`
- 本program closure decision
- G2-11 dependency closure decision

このclosure branchの中央文書同期と最終監査後、明示的な指示がある場合にのみ`main`へ統合する。
