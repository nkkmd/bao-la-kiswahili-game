# G2-03 第1研究概要 — 状態変換意味論とcanonicalizationの検証

## 研究識別子

```text
Agenda label = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Status = COMPLETE / FORMAL DECISION INCONCLUSIVE
```

正式英語名: **State Transformation Semantics / Canonicalization Validation Study 1**

## 1. この研究は何を調べたのか

Baoの盤面を見た目だけで「左右対称」「座席を交換すれば同じ」と扱うのではなく、**状態変換が現在のrule engine上で本当に同一の意味構造を保つか**を検証しました。

そのため、研究開始時点からrepresentation binding（どの状態情報を同一性へ含めるか）を明示し、新たに生成した独立証拠を用いて、結果を見る前に固定した手順で検証しました。

検証対象には次を含めています。

- authoritative RAW stateの再構築
- 合法手集合の完全な一対一対応
- Namua variantを含むmove identityの完全一致
- 状態変換と着手適用後のsuccessorが可換であること
- terminal / winner / pendingの意味保存
- 逆変換とbijection
- bounded graphにおけるnode / edge isomorphism
- 必須の独立再構築
- downstream canonicalizationを別途承認するための判定

## 2. なぜ新しい独立研究が必要だったのか

Research Generation 1のSymmetry / Isomorphic Positions Study 1は、5 outcomeすべて`NON-ESTIMABLE`で終了しました。また、ORISC-STUDY1はrepository-facing oracle representation integrityを`NOT-CONFIRMED`とし、条件付きsymmetry stageを実行していません。

したがってG2-03開始時点では、

```text
validated transform set = []
```

であり、canonicalizationやsymmetry-reduced state countingは承認されていませんでした。

G2-03はこれらの終了済み研究を救済するものではなく、fresh historically reachable RAW statesと新しいrepresentation bindingを用いる独立研究として実施しました。

## 3. authoritative state identity

本研究で状態同一性へ含めた項目は次のとおりです。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`はidentityから除外しました。

また、正式な承認が成立する前にcandidate transformをpopulation deduplicationへ使用することは禁止しました。

## 4. Stage構成

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1
```

- Stage 0: 技術的成立性のみを確認
- Stage 1: 新しいdevelopment evidenceを使用
- Stage 2: 未使用の独立formal evidenceによるcandidate decision

Stage 1では72 rootsを使用し、Namua / Mtaji / Mtaji-houselessを各24 rootsとしました。そのtrajectory seed、opening prefix、RAW state identityはStage 2から分離しました。

## 5. Stage 2で事前に固定した設計

Stage 2のoutcomeを生成する前に、次を固定しました。

```text
seed block = 26032001..26032768
target roots = 32 per stratum
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
candidate mismatch tolerance = 0
replacement outside seed block = false
seed extension after outcome = false
```

Candidate set:

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

Stage 2の科学的outcomeが存在する前に、強化済みのprefreeze workflowはすべての条件を通過しました。明示的なauthorizationはcommit `c7619ded9f682b499a02d023b40ac54ba4dc95ca`で固定されています。

## 6. 事前固定した全体失敗規則

Stage 2では、candidateごとの判断に入る前提として、次の6つのglobal gateをすべてPASSすることを要求しました。

1. population / firewall
2. runtime integrity
3. IDENTITY control
4. negative control
5. production / independent agreement
6. frozen hash agreement

1つでも成立しない場合は、結果確認後の救済を行わず、事前規則に従って次とします。

```text
Study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation = not authorized
```

## 7. Stage 2で実際に起きたこと

Authorized workflow run `33145860098`では、engine regression、frozen source reconstruction、新しいheld-out production measurementまでは成功しました。

Production側は凍結したquotaどおり96 rootsを選択しました。

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

Production-only diagnosticsでは、T01 / T02 / T03のすべてでcandidate mismatchは0でした。

しかし、必須のindependent verifierがformal-result assembly時に次のtechnical errorで停止しました。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

このため、workflowから生成されるはずだったcomplete independent-verification artifact、独立検証済みformal-result artifact、canonical hashes、workflow artifact ZIPは生成・確定されませんでした。

これとは別に、事前固定した全体失敗規則をそのまま適用したrepository-facing fail-closed closureを`results/STAGE_2_FORMAL_RESULT.json`として保存しています。

## 8. 最終的な正式判断

S2-G5を`NOT-ESTABLISHED`として扱い、事前規則どおり条件未成立時には承認しない方式で終了しました。

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

Production側でmismatch 0だったことを理由に`VALIDATED-BOUNDED-ISOMORPHISM`へ昇格していません。

また、technical failureをcandidate mismatchとみなして`NOT-VALIDATED`へ読み替えることもしていません。

## 9. canonicalizationに関する境界

rule-semantic transformの検証と、そのtransformをdownstream canonicalizationへ使用してよいかという判断は、別のclaimとして扱いました。

Production-only diagnosticsではbounded graph 6,317 states / 6,341 edgesについてsemantic-domain canonicalization checksがmismatch 0でした。しかし、必須の独立検証がcanonicalに完了していないため、formal authorizationにはなりません。

さらにT01 / T02 / T03はいずれもstandard initial RAW stateを保存せず、independent standard-start reachability-closure proofも実装されていません。

したがって、現在も次の状態です。

```text
canonicalization for scientific population identity = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
```

## 10. 結果確認後の救済を行わないこと

Verifier defectはfresh Stage 2 outcome生成後に判明しました。

Study 1ではsourceを修正して同じStage 2 evidenceを再実行し、candidate decisionを救済することはしません。

再検証する場合は、新しいprospective Study、または明示的にversion管理した新protocol、新しいauthorization、新しいformal evidenceが必要です。

## 11. この結果が意味すること

`NON-ESTIMABLE`は、3つのtransformがfalseであることを意味しません。同時に、production-only mismatch 0を理由にvalid transformであるとも主張しません。

G2-03はSIP-STUDY1、ORISC-STUDY1、SSGTC-STUDY1、G2-01、G2-02の正式判断を変更しません。公開AI Engineeringも本研究のendpointではありません。

## 12. 詳細・再現用文書

- `STUDY_1_FINAL_REPORT.md` — scientific / technical final integration
- `results/STAGE_2_FORMAL_RESULT.json` — repository-facing fail-closed result
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json` — failed workflow provenance
- `CURRENT_STATUS.md` — terminal status
- `DECISION_REGISTER.md` — frozen decisions and no-rescue boundary
- `REPRODUCIBILITY_INDEX.md` — source / workflow / hash provenance
