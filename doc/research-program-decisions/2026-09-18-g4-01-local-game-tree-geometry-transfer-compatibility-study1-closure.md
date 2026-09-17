# G4-01 / LGTTCI-STUDY1 closure decision

日付: 2026-09-18  
Program: Research Generation 4  
Study: `LGTTCI-STUDY1`

## 決定

G4-01 `LGTTCI-STUDY1`を研究完了として閉じる。

正式closure state:

`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`

## 根拠

Stage 0 `LGTTCI-S0-TECHNICAL-2026-09-17-v1`は`STAGE0-PASS`で完了した。

旧Stage 1は実行環境消失により`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じ、旧`401...` fresh namespaceはquarantineした。そのpartial evidenceは科学的結果に使用していない。

再試験Stage 1R `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`は、新しい`402...` primary namespaceを使ってGitHub Actionsでfresh acquisitionを一度だけ実施した。1536/1536 source evidenceを取得し、reserveは使用しなかった。

元workflowのdownstream technical failure後はfresh workflowを再実行せず、保存済みimmutable source artifactだけを入力とするdownstream-only recoveryを実施した。recovery run `35265290422`はsuccessし、22/22 seed-free measurement taskとaggregateがすべてsuccessした。

最終compatibility result:

- SFCDF: compatible
- SILGM: compatible
- GCLD: compatible
- decision: `COMPATIBILITY-ELIGIBLE-ALL`
- source count: `1536`
- reserve count: `0`
- result deterministic core SHA256: `0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61`

canonical resultは`doc/local-game-tree-geometry-transfer-compatibility-instrument/results/stage-1r/`に保存した。

## 解釈

このdecisionはcompatibility/readinessに限定される。Research Generation 3由来claimのfresh-domain一般化、effect direction、counterexampleの成立を示すものではない。

したがって、G4-02、G4-03、G4-04などの後続transfer研究は、各研究ごとのauthorization reviewを経て初めて開始できる。本closureによって自動的にfresh evidence accessが許可されることはない。

## 保護境界

次は引き続き変更しない。

- 旧Stage 1 `401...` namespace: quarantine / no reuse
- G3-11 depth 10: no rerun
- G3-12 Stage 1: no replay
- G3-12 Stage 2: no access/reuse
- G4-10 depth 11: not authorized
- public AI変更: not authorized by this Study
- `main` integration: not authorized by this closure decision

## 次のProgram状態

G4-01は完了した。Wave Aの後続候補はG4-02/G4-03/G4-04であるが、どれを次に開始するかは別途authorization reviewで決定する。
