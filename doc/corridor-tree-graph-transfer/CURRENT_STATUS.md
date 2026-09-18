# CTGTS-STUDY1 — 現在の状態

更新日: 2026-09-18  
状態: **`AUTHORIZED / PROSPECTIVE CONTRACT FROZEN / STAGE 0 READY / SCIENTIFIC SEED ACCESS 0`**

## Formal identity

```text
Agenda = G4-02
Study = CTGTS-STUDY1
baseline main = c5689d70cd017171e7738140ba9186a117f732f1
branch = research/g4-02-corridor-tree-graph-transfer
authorization = G4-02-AUTHORIZED
```

## 現在のStage

```text
Stage 0 = AUTHORIZED-NOT-EXECUTED
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh seed block = 42021001..42021768 / RESERVED-NOT-ACCESSED
fresh scientific seed reads = 0
scientific endpoint outcomes generated = 0
```

## prerequisite

最初のG4-02 authorization reviewはopening-prefix provenance不足により`PREREQUISITE-REQUIRED`だった。

その後、G4-01 SFCDF source artifactからseed・trajectory・RAW-root identityをdurableなexclusion firewallへmaterializeし、G4-02限定methodology amendmentをprospectiveに固定した。

結果:

`PREREQUISITE-SATISFIED-BY-SCOPED-METHODOLOGY-AMENDMENT`

再認可reviewで`G4-02-AUTHORIZED`となった。

## frozen population

4 cell × 24 pair = 96 pair / 192 roots。

768 seedをmod 4で4 cellへ192ずつ割り当てる。各trajectoryは1 cellのみ。

## 次の安全な作業

Stage 0 technical fixture / freshness-firewall verification / selection-contract fixtureをfresh seedなしで実行する。

Stage 0 PASS後にのみStage 1 authorization reviewへ進む。

## 保護境界

```text
G3-04 repair/rerun = false
G3-11 depth 10 rerun = false
G3-12 repair/replay = false
G3-12 Stage 2 seed use = false
G4-01 source reread/full rerun = false
G4-10 depth 11 access = false
validated transform set = []
public AI change = false
main integration = false
```
