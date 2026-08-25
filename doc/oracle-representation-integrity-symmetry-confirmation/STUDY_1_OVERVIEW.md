# Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 — Overview

**Study ID:** `ORISC-STUDY1`  
**Status:** **COMPLETED**  
**Axis A formal decision:** `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`  
**Axis B:** `NOT-AUTHORIZED-NOT-EXECUTED`

## 何を調べたか

この研究は、限定終盤exact oracleについて次の2軸を意図的に分離した。

1. **Axis A — Oracle Representation Integrity**  
   Bao engine-semantic raw state、terminal `pending` accounting、raw serialization、`stateKey`、凍結8-state graph、repository-facing oracle rowが、同一の厳密なreconstruction contractとして成立するか。
2. **Axis B — Independent Symmetry Confirmation**  
   Axis Aが事前gateを通過した場合にのみ、prospectively frozenな非自明symmetry candidatesをmove-equivariance / transition commutation / graph isomorphismで確認する。

## Upstreamは変更していない

以下はそのまま維持される。

```text
REWR-STUDY1
  formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
  frozen graph = 8 states / 7 edges

SIP-STUDY1
  formalDecision = NON-ESTIMABLE
  validated = 0
  rejected = 0
  nonEstimable = 5
```

今回の結果は、REWRのexact value / DTF / optimal moveやSIPのclosureをretroactively変更しない。

## Stage 0で確認したこと

元のREWR scientific workflow artifactをread-onlyで回収すると、productionとindependent verificationの8 raw rowsは完全一致し、全stateが64 seedsを表現していた。

一方、後からrepositoryへ保存された`STAGE_1_EXACT_RESULT.json`では、3 terminal rowsだけが元workflow rowと異なり、差分は`pending`のみだった。

```text
original workflow rows: pending = [1,0], represented seeds = 64
repository-facing rows: pending = [0,0], represented seeds = 63
```

この差がどのmaterialization mechanismで導入されたかは確定できないため、原因は`UNRESOLVED-PROVENANCE-GAP`として残した。

## Formal Stage 1 result

production / independentの別実装は、凍結rootから同じraw graphを再構成した。

```text
states = 8
edges = 7
state-set hash = exact match
transition-set hash = exact match
all reconstructed seed totals = 64
terminal accounting mismatches = 0
repository transition mismatches = 0
```

しかしrepository-facing rowについて:

```text
A-G8 stored-row re-hash       = FAIL (3 rows)
A-G9 raw-state binding        = FAIL (3 rows)
A-G11 IDENTITY control        = FAIL
A-G12 production/independent  = PASS
```

影響rowは:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

すべてterminal rowで、reconstructed raw stateとの差分fieldは`pending`のみだった。

したがってformal decisionは:

> **`ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`**

である。

これはimplementation disagreementによる`NON-ESTIMABLE`ではない。production / independentが同じ失敗箇所と判定を再現したため、事前規則上のinterpretable representation-integrity failureである。

## Symmetry confirmationは実行していない

Stage 2 candidate contractはStage 1 outcomeを見る前にfreeze済みだったが、Stage 2 authorizationには:

```text
Stage 1 = CONFIRMED
IDENTITY = PASS
production/independent equality = PASS
```

を要求していた。

Stage 1とIDENTITYが未達だったため:

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
```

とした。

したがって今回のStudyでは、T01/T02/T03をformalにvalidateもrejectもしていない。

## Downstream contract

Study 1完了時点の契約は:

```text
validated symmetry transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative downstream representation
State Space / Game Tree Complexity = raw-onlyで進行可能
```

## 最初に読む詳細文書

- `STUDY_1_FINAL_REPORT.md` — scientific/technical final integration
- `results/STAGE_1_FORMAL_RESULT.json` — Axis A canonical formal result
- `results/STUDY_1_FINAL_RESULT.json` — Study-level closure
- `REPRODUCIBILITY_INDEX.md` — hashes / workflows / source identities
- `CURRENT_STATUS.md` — final status and immutable boundaries
