# LGTGMIV-STUDY1 — Study 1概要

## 研究の問い

bounded local Bao game-tree / RAW-graph geometryの測定instrumentについて、scientific canonical objectがdeterministic、exact、traversal / order invariant、independently reproducibleとなり、同時にruntime / resource telemetryをscientific digestから完全に除外するよう、結果を見る前に定義できるかを検証した。

## 結論

**本Studyで固定したbounded domain内では、可能である。**

`LGTGMIV-STUDY1`は次のformal decisionで閉じた。

**`FORMAL-ELIGIBLE-ALL`**

結果を見る前に固定した5 measurement familyすべてが、独立したStage 2 fresh formal holdout上でexact production / independent verificationをPASSした。

## 新しいStudyが必要だった理由

G3-01（`LGTGMF-STUDY1`）は恒久的にtechnical-invalidである。production / independent implementationはselected rootとroot-level local geometry measurementで一致したが、固定済みStage-level canonical artifactにdeterministic scientific contentとimplementation-dependent telemetryが混在した。fresh evidenceのgeneration / read後にmismatchを発見したため、no-rescue ruleによりsame-evidence repairは禁止された。

本Studyは新規に開始した。G3-01をreviseせず、scientific populationをreuseせず、candidate familyからeligibilityを継承していない。

## 実施内容

### Stage 0 — instrumentのvalidation

synthetic / non-scientific controlにより、canonical RAW / move serialization、traversal / ordering invariance、repeat-run determinism、production / structurally independent implementation agreement、telemetry mutation invariance、protected-evidence firewallを検証した。

Stage 0のdispositionは`STAGE0-PASS`である。

### Stage 1 — fresh development （開発段階）

- seeds: `31110001..31110128`
- 8 Namua + 8 Mtajiで16 unique RAW root
- relative depth: 5
- exact reconstruction: 16/16
- five families promoted: 5/5

Stage 1のdispositionは`STAGE1-PASS`である。

### Stage 2 — fresh formal holdout （Stageの記録）

- seeds: `31120001..31120192`
- 12 Namua + 12 Mtajiで24 unique RAW root
- relative depth: 5
- G3-01 + Stage 1 identity exclusion firewallを適用
- exact production / independent root reconstructionは24/24
- resource gate: PASS
- 各tested familyのexact rootは24/24

formal decisionは`FORMAL-ELIGIBLE-ALL`である。

read-only post-result auditはBao engineをimportせず、scientific evidenceを再実行せずにPASSした。

## formal eligibleとなったmeasurement family

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

これらはbounded tree occurrence geometry、RAW reachable graph structure、transposition / reconvergence structure、tree / graph divergence relation、reply-width / narrow-path geometryを対象とする。

## 主要なverification原則

scientific objectはexecution environmentから独立させる。elapsed time、wall clock、RSS、CPU timing、runner identity、filesystem path、PID、job / workflow identity、upload timingはtelemetryに限る。resource estimabilityの判定には使えるが、scientific canonical hashへ入れてはならない。

Stage 2のcanonical scientific digest:

`97ad7dc21e1758d31fa09e487389bf5d3935b1d98daf3eaa2f1b524d7169f9a4`

## claim boundary（主張できる範囲）

positive resultがauthorizeするのは、relative depth 5かつ固定済みpopulation / resource ceiling内で、本Studyのformal gateをPASSしたbounded RAW local-game-tree / graph measurement familyだけである。次をauthorizeしない。

- Bao全体のstate-spaceまたはgame-tree size estimate
- 新しいevidenceなしでtested bounded local horizonを越えるvalidity
- symmetryまたはcanonical state reduction
- strategic-regime representations
- geometryからwin / valueへのcausal claim
- game-theoretic-value claims
- human difficulty claims
- G3-01 rescue
- automatic G3-02 execution
- protected standard-root depth-10 exact holdoutの開封

authoritative state identityはRAW-only、validated transform setは`[]`のままである。

protected standard initial RAW-root complete exact depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ`のままである。

この文書のclosure時点では、G3-02〜G3-08は別個のResearch Generation 3 post-closure authorization reviewを待つblocked状態だった。後続のcurrent stateは中央の`research-generation-3/CURRENT_STATUS.md`を正本とする。
