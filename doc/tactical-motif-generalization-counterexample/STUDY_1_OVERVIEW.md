# STUDY 1 OVERVIEW

## 1. 研究目的

`TMGC-STUDY1`は、Research Generation 1でmachine-confirmedされた`TM-S2-C03`について、fresh positions上でgeneralization domain、counterexample domain、non-estimable domainをprospectively分離する研究である。

中心的な問いは次である。

> `TM-S2-C03`は、phase、morphology、search condition、state familyが変化したfresh positionsにおいて、どの範囲まで再現可能に成立し、どの領域で反例または推定不能境界が現れるか。

本研究の目的は`universal motif`の宣言ではない。

## 2. Upstreamの固定事項

元Studyのformal decision、candidate definition、population、threshold、seed、paired-family handling、search/evaluator condition、decision ruleをG2-09から変更しない。C01/C02/C04の救済も行わない。

`TM-S2-C03`の凍結済みformal definitionの主要事項は以下である。

- phase: `mtaji`
- observational family: `mt-0`
- source policy: `coarse-no-index`
- move class: `takata-row1`
- direction: `right`
- `reusablePitsMin = 0`
- `reusablePitsMax = 2`
- consequence: `actorNyumbaSeedsDeltaSign = 0`, `actorReserveDelta = 0`, `phaseAfter = mtaji`
- minimum candidate roots: `20`
- minimum paired roots: `5`
- minimum structural success rate: `0.95`
- minimum tactical-value success rate: `0.70`

Research Generation 1のformal resultは、1272 matched/comparable roots、structural success `1245/1272 = 0.9787735849`、D3 top-set success `937/1272 = 0.7366352201`、paired roots `474`、final `CONFIRMED`であった。

これらはG2-09の基準点であり、G2-09の新しいscientific resultではない。

## 3. 新しく検証するconstruct

G2-09は以下を独立に扱う。

- `generalization-supporting case`
- `counterexample case`
- `ambiguous / non-estimable case`
- frozen generalization group / boundary
- frozen counterexample group / boundary

構造的成立とsearch-based tactical-value成立は別endpointとし、search disagreementをmotifの構造的不成立と同一視しない。

## 4. Candidate axes

Stage 0でprovenanceと計算可能性を確認したうえで、Stage 1開始前に正式axisを固定する。

- phase: Mtaji `C03-EXACT`、および意味論的に適格な場合のみ別名のphase-transport construct
- morphology / structural context: pre-root RAW stateまたは明示された局所legal contextからoutcome-independentに計算できるdescriptorのみ
- search condition: upstream reference semanticsを保持し、追加instrumentはtruthではなくsensitivity instrumentとして固定
- state family: capture availability、forced-capture context、reply-set size、reserve/material regime、house context、local pit geometry、root branching等

G2-06/G2-08の未validated representation/classifierは正式axisに使用しない。

## 5. Human evidence boundary

本研究はmachine evidenceのみを扱う。human recognition、expert recognition、human difficulty、教育的salience、traditional Bao terminologyとの一致、human error probabilityはformal inferenceの対象外である。

## 6. State identity boundary

state deduplicationはRAW identityのみを用いる。未validated symmetry、reflection、player swap、canonicalizationをdeduplication、group assignment、generalization unitに使用しない。
