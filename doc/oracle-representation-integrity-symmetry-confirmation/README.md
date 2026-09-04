# 限定終盤oracleの表現整合性・対称性確認 — Study 1

**Study ID:** `ORISC-STUDY1`  
**Status:** **COMPLETED**  
**Axis A:** `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`  
**Axis B:** `NOT-AUTHORIZED-NOT-EXECUTED`  
**Branch:** `research/oracle-representation-integrity-symmetry-confirmation`  
**Baseline main HEAD:** `e8f0a3c360d9e7c9f7f6882fb212a32921040912`

## 何を調べたか

本Studyは、変更不可となったRestricted Endgame Study 1のrepository-facing exact-oracle representationが、raw-state reconstruction anchorとして使用可能かを監査した、事前規定・独立のBao研究です。別のsymmetry / isomorphism確認Stageへ進めるのは、結果を見る前に固定したrepresentation-integrity gateを通過した場合だけとしました。

本Studyは`SIP-STUDY1`の継続、corrected v2、救済、retrospective reanalysisではなく、`REWR-STUDY1`も変更していません。

## 最終結果

Axis Aでは、固定済みraw graphを独立にexact reconstructionしました。

```text
states = 8
edges = 7
production / independent graph equality = PASS
production / independent serializer equality = PASS
all reconstructed represented seed totals = 64
terminal accounting mismatches = 0
transition successor mismatches = 0
```

一方、変更不可のrepository-facing terminal row 3件が、事前固定したstored-row re-hash gateとreconstructed raw-state binding gateを満たしませんでした。3件ともidentity fieldの差は`pending`だけであり、repository rowは64 seedsではなく63 seedsを表していました。

このため、正式判断は次のとおりです。

```text
Axis A formal decision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
A-G8 = FAIL
A-G9 = FAIL
A-G11 IDENTITY = FAIL
A-G12 production/independent equality = PASS
```

Axis AとIDENTITYがconditional Stage 2 authorization gateを満たさなかったため、次のcandidateは実行していません。

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
nontrivial symmetry candidate decisions = 0
```

## 上流研究から変更しない境界

`REWR-STUDY1` remains:

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
```

`SIP-STUDY1` remains:

```text
formalDecision = NON-ESTIMABLE
validated = 0
rejected = 0
nonEstimable = 5
```

上流研究のoracle rowは書き換えていません。

## 後続研究へ引き継ぐ境界

```text
raw state identity = authoritative
validated symmetry transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
State Space / Game Tree Complexity = may proceed RAW-ONLY
```

ORISCの結果は、未実行のT01 / T02 / T03 candidateがfalse symmetryであることを示しません。

## 正本となる文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — human-readable result overview
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — scientific and technical final integration
- `results/STAGE_1_FORMAL_RESULT.json` — canonical Axis A formal result
- `results/STUDY_1_FINAL_RESULT.json` — Study-level closure
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — final status and downstream boundary
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — prospective decisions, no-rescue rules and closure decisions
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — source/hash/workflow identities
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronology
- `preregistration/STAGE_1_FORMAL_SPEC.json` — frozen Axis A spec
- `preregistration/STAGE_1_AUTHORIZATION.json` — Axis A authorization
- `preregistration/STAGE_2_CANDIDATE_CONTRACT.json` — pre-outcome conditional Stage 2 contract; **never authorized/executed**

## 過去の設計文書

- [`PROTOCOL_DRAFT.md`](PROTOCOL_DRAFT.md) — prefreeze design draft, superseded by the frozen formal spec
- [`STAGE_0A_TECHNICAL_AUDIT_PLAN.md`](STAGE_0A_TECHNICAL_AUDIT_PLAN.md) — Stage 0A technical-only plan
- [`STAGE_0A_TECHNICAL_AUDIT.md`](STAGE_0A_TECHNICAL_AUDIT.md) — completed technical/provenance audit
- [`STAGE_0A_CANDIDATE_POPULATION_PROPOSAL.md`](STAGE_0A_CANDIDATE_POPULATION_PROPOSAL.md) — pre-outcome proposal later frozen in the Stage 2 candidate contract

完了済みのStudy 1内で、これ以上のscientific outcomeを生成することは承認されていません。
