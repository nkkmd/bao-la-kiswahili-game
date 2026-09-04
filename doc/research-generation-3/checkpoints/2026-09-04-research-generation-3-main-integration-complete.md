# 2026-09-04 — Research Generation 3 main integration complete

## Decision

**`COMPLETE / FAST-FORWARD / force=false`**

Research Generation 3 core program closureを、明示的ユーザー指示に基づいて`main`へ統合した。

```text
Repository = nkkmd/bao-la-kiswahili-game
Program = Bao Third-Generation Research Program
Program lifecycle = CLOSED
Closure branch = research/g3-final-program-closure
Previous main = fd6c8e2a4510d5937b47a87735854e8459b2646f
Integrated closure branch tip = 0feaab24efdd92c3e094aae0fcc60256e90bd1a6
Integration method = FAST-FORWARD
Force = false
Bookkeeping workflow run = 33864533103
Scientific execution = NONE
Scientific seed access = NONE
```

## Integration semantics

このintegrationはgeneration-level synthesis / closure documentationのrepository統合であり、新しいscientific authorizationではない。

- G3-01..G3-12のformal dispositionは変更しない。
- G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`のまま。
- G3-11 depth-10 same-evidence rerunはauthorizeしない。
- depth 11はauthorize / accessしない。
- G3-12 Stage 1 repair/replayはauthorizeしない。
- G3-12 Stage 2はauthorize / execute / accessしない。
- G2-12 estimator scientific reuseはauthorizeしない。
- symmetry/canonicalization rescueはauthorizeしない。

## Historical records

Pre-main closure review / closure decision / pre-main consistency checkpointsは、その時点のprospective repository stateを記録するhistorical provenanceとして改変しない。current-facing statusと`PROGRAM_FINAL_RESULT.json`だけをpost-integration stateへ進めた。

`doc/research-generation-3/PROGRAM_PLAN.md`はprospective historical planとしてbyte-identicalに保存する。

## Final repository expectation

Bookkeeping完了後のfinal treeにはone-time integration bookkeeping workflow/helper/triggerを残さない。変更対象はcurrent-facing central documents、generation final-state records、および本integration checkpointだけとする。
