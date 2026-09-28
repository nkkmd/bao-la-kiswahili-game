# 2026-09-28 — G4-10 pre-main consistency audit

Agenda: `Research Generation 4 / G4-10`  
Study: `FDERT-STUDY1`  
Research branch: `research/g4-10-fresh-depth11-exact-reachability-topology`  
Audit decision: **`PASS / READY FOR SEPARATE MAIN-INTEGRATION GATE`**

## 1. Branch relation

Audit時点の比較:

```text
base = main
main HEAD = 7eb59518753d9b8846d5ccf32246aba1b4b301cc
research head before this audit record = c7c7465f571424be53d671aaec039958fad7c03f
status = ahead
ahead = 59
behind = 0
merge base = 7eb59518753d9b8846d5ccf32246aba1b4b301cc
```

research branchはG4-09統合後の`main`から直線的に進んでおり、main側の未取り込みcommitはない。

## 2. Scientific canonical consistency

G4-10 canonical stateを次で照合した。

```text
Study = FDERT-STUDY1
formal decision = NON-ESTIMABLE
stop reason = UNIQUE_STATE_CAP
target depth = 11
target complete = false
last complete depth = 10
first incomplete depth = 11
T1 = NON-ESTIMABLE
T2 = NON-ESTIMABLE
T3 = NON-ESTIMABLE
T4 = NON-ESTIMABLE
scientific executions authorized = 1
scientific executions actual = 1
same-evidence rerun authorized = false
depth 12 authorized = false
public AI change authorized = false
```

Canonical repository record:

- `doc/fresh-depth11-exact-reachability-topology/results/stage-1/STAGE_1_CANONICAL_RECORD.json`

Closure / human-readable records:

- `doc/fresh-depth11-exact-reachability-topology/CURRENT_STATUS.md`
- `doc/fresh-depth11-exact-reachability-topology/FINAL_REPORT.md`
- `doc/fresh-depth11-exact-reachability-topology/REPRODUCIBILITY_INDEX.md`
- `doc/research-program-decisions/2026-09-28-g4-10-fresh-depth11-exact-reachability-topology-study1-closure.md`

これらのformal decision、stop reason、complete-prefix値、artifact provenance、no-rescue boundaryに矛盾は確認されなかった。

## 3. Complete-prefix integrity

G4-10でcompleteと主張する範囲はdepth 0..10だけである。

```text
cumulative distinct RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
unique RAW graph edges through parent depth 9 = 466768
tree-node occurrences through depth 10 = 631101
tree-edge occurrences through parent depth 9 = 631100
current prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
historical G3-11 prefix SHA-256 = 6d3e6fac2ce0dc996d314e1e5aa5342482727231f46e76d7738c663cd7ef55a7
```

production materialized-file verificationとindependent complete-prefix verificationはいずれもPASS。partial depth-11 evidenceをformal値として記録したcurrent-facing文書は確認されなかった。

## 4. Program-level document synchronization

次のcurrent-facing文書をG4-10 closureへ同期済みであることを確認した。

- `doc/research-generation-4/README.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/FINAL_SYNTHESIS.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`

Current-facing stateは一貫して次を示す。

```text
G4-01..G4-10 core scientific agenda = COMPLETE
G4-10 = CLOSED / NON-ESTIMABLE / UNIQUE_STATE_CAP
G4-10 main integration = PENDING
public AI change = false
```

`doc/FUTURE_RESEARCH_AGENDA.md`はVersion `5.12.0`へ更新し、G4-10を未認可・未アクセスとする旧current-state表記を除去した。

`doc/RESEARCH_INDEX.md`もG4-10 formal result、RG4 final synthesisへの入口を追加し、旧current-state表記を除去した。

## 5. Historical-document boundary

G4-06、G4-07、G4-08、G4-09等のclosed historical recordには、各Study実行時点で`G4-10 depth-11 access = 0`等の記録が残る。

これらは当時のprotected-boundary audit trailとして正しく、current stateを表す文書ではないため書き換えない。

prospective frozen `doc/research-generation-4/PROGRAM_PLAN.md`もoutcomeに合わせて変更していない。

## 6. Repository-scope audit

`main...research/g4-10-fresh-depth11-exact-reachability-topology` compareを確認した。

- `public/`変更: **0**
- 公開AIproduction変更: **0**
- root `README.md`変更: **0**
- frozen RG4 `PROGRAM_PLAN.md`変更: **0**
- G4-10専用research source / workflow / prereg / authorization / result / documentation: expected
- central research index / agenda / RG4 current-facing docs: expected synchronization changes only

一回限りの長文document-sync workflowは同期commit内で削除され、final treeには残っていない。同期Actions run `36370285465 / attempt 1`は`success`であり、scientific computationは実行していない。

## 7. No-rescue verification

監査中に次を行っていない。

- Stage 1 scientific rerun
- resource ceiling increase
- wall-clock extension
- alternate/larger runner rescue
- partial depth-11 result promotion
- depth 12 access
- endpoint / target変更
- G2-12 estimator使用
- G3-11 formal decision再判定
- public AI変更

## 8. Audit conclusion

G4-10 research branchは、scientific result、canonical provenance、closure、Research Generation 4 final synthesis、current-facing index / agendaの間で整合している。

判定:

**`PRE-MAIN CONSISTENCY AUDIT = PASS`**

次に許可されるrepository operationは、別gateとしての`main` integration準備・実行である。本監査自体は`main`を変更しない。
