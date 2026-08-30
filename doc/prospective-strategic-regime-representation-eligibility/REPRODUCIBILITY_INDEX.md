# PSRRE-STUDY1 — 再現性索引

## 1. Study baseline

```text
Repository = nkkmd/bao-la-kiswahili-game
Baseline remote main = 3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
Research branch = research/pre-g2-11-strategic-regime-representation-eligibility
Study ID = PSRRE-STUDY1
```

Study開始時のremote `main`はreference SHAと一致した。

## 2. program decision binding

- `doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/DOCUMENTATION_LANGUAGE_POLICY.md`

## 3. G2-10 immutable source binding

- `doc/unified-multiaxial-strategic-state-representation/STUDY_1_PROTOCOL.md`
- `doc/unified-multiaxial-strategic-state-representation/STUDY_1_FINAL_REPORT.md`
- `doc/unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json`
- `doc/unified-multiaxial-strategic-state-representation/UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `doc/unified-multiaxial-strategic-state-representation/prereg/STUDY_1_INITIAL_CONTRACT.json`
- `doc/unified-multiaxial-strategic-state-representation/prereg/STAGE_0_TECHNICAL_SPEC.json`

G2-10 Stage 1 execution provenance、workflow run、artifact hash等はG2-10 final result / reproducibility indexの記録をimmutable historical provenanceとして参照し、本Studyのscientific evidenceへ混入させない。

## 4. 本Studyのprospective contract

- `STUDY_1_PROTOCOL.md`
- `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `prereg/STUDY_1_INITIAL_CONTRACT.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `DECISION_REGISTER.md`
- `CURRENT_STATUS.md`
- `RESEARCH_LOG.md`

## 5. RAW identity

```text
included fields = pits,reserve,houseOwned,player,phase,winner,pending
excluded fields = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## 6. seed registry

```text
29500001..29500064 = PSRRE Stage 0 technical-only
29510001..29514096 = PSRRE Stage 1 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
29610001..29618192 = PSRRE Stage 2 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
```

禁止されたG2-10 blocks:

```text
29310001..29314096 = G2-10 Stage 1 CONSUMED
29410001..29418192 = G2-10 Stage 2 RESERVED_UNCONSUMED / DO NOT REUSE
```

## 7. Stage 0予定artifact

Stage 0 technical executionをauthorizeする場合、少なくとも次を生成・hash固定する。

- source-binding manifest
- technical fixture / technical seed manifest
- production technical result
- independent technical result
- exact comparison result
- representation-family technical qualification table
- resource-usage summary
- canonical hash manifest
- invalid-attempt register（該当する場合）

## 8. production / independent分離

Stage 0以降のindependent pathは、Study-specific production helperをimportして同じ処理を再呼び出すだけの構造にしない。authoritative engine / rule semanticsは共有してよいが、RAW key、observable、scaling、PCA、Ward/PAM、assignment、serializationを別経路で再構築する。

## 9. 現在のprovenance空欄

Study-start時点では次は存在しない。

```text
Stage 0 workflow run = null
Stage 0 artifact id = null
Stage 0 result hash = null
Stage 1 authorization commit = null
Stage 1 workflow run = null
Stage 1 scientific result hash = null
Stage 2 authorization commit = null
Stage 2 workflow run = null
Stage 2 scientific result hash = null
frozen representation artifact hash = null
G2-11 input authorization = false
```

これらは実際にmaterializeした時点で追記し、結果後にprospective contractを書き換えない。
