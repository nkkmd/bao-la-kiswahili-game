# G2-04 — 限定終盤exact oracleの拡張

Research Generation 2 `G2-04` / formal Study ID `REEOE-STUDY1`。

状態: **完了 / formal decision `INCONCLUSIVE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**。

## 正本となる文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- `preregistration/STUDY_START_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json` — invalidated v1 lineage
- `preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json` — invalidated v1 lineage
- `preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`

## 表現に関する規則

Authoritative RAW identityは次を維持しました。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`は除外します。symmetry reduction、canonicalization、quotient graph、symmetry-reduced state countingは使用も承認もしていません。

## 終了結果の要約

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
Stage 1 v2 = STAGE1-DEVELOPMENT-BLOCKED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal decision = INCONCLUSIVE
fresh exact oracle produced = false
```

Stage 1 v2では8 selected fresh rootsを独立再構築しましたが、結果を見る前に固定したceilingの下でcomplete forward closureへ到達したrootは0でした。

```text
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
COMPLETE = 0
```

frozen feasibility ruleは最低3 complete closuresを要求していたため、Stage 2は承認されませんでした。

cap increase、domain shrinkage、root replacement、seed extension、partial-closure promotion、symmetry reduction、その他のsame-study rescueは行っていません。
