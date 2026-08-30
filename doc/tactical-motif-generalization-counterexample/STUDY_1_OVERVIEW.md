# STUDY 1 OVERVIEW

## 1. 研究目的

`TMGC-STUDY1`は、Research Generation 1でmachine-confirmedされた`TM-S2-C03`について、fresh positions上でgeneralization domain、counterexample domain、non-estimable domainをprospectively分離する研究である。

中心的な問いは次である。

> `TM-S2-C03`は、phase、morphology、search condition、state familyが変化したfresh positionsにおいて、どの範囲まで再現可能に成立し、どの領域で反例または推定不能境界が現れるか。

本研究の目的は`universal motif`の宣言ではない。

## 2. Upstreamの固定事項

元Studyのformal decision、candidate definition、population、threshold、seed、paired-family handling、search/evaluator condition、decision ruleをG2-09から変更しない。C01/C02/C04の救済も行わない。

### TM-S2-C03 primary definition

- candidate ID: `TM-S2-C03`
- phase: `mtaji`
- move abstraction mode: `coarse-no-index`
- move abstraction: `takata`, row `1`, direction `right`, phase `mtaji`, `side=null`, `houseChoice=null`, `houseTwo=false`; index omitted
- precondition: `reusablePits=0-2`
- consequence: `actorNyumbaSeedsDeltaSign=0`
- paired diagnostic: same precondition + `worstReplyActorCaptureMoveDeltaSign=0`; diagnostic-only and never a canonical replacement

### Research Generation 1 formal measurement / decision contract

- fresh Stage 2 population: 3,072 games, seeds `22000001..22003072`, six trajectory-generation strata ×512, first 8 plies seeded-uniform exact `E.moveVariants`, max ply 100
- candidate-specific root selection was consequence-blind, value-blind, outcome-blind, deterministic and no-replacement
- canonical move representative: lexicographically smallest `AI.moveKey` among all legal exact moveVariants matching the frozen abstraction; no search value or consequence used for representative selection
- root-search instrument: exact full-window root candidates, D1/D2/D3, `evaluationProfile=bao`, `quiescenceDepth=1`, `orderQuiescenceCaptures=false`
- co-primary endpoints: structural consequence success and exact D3 top-set membership
- each co-primary endpoint: exact one-sided binomial test against `p=0.50`, observed rate `>=0.60`
- multiplicity: eight planned tests, Holm-Bonferroni FWER 0.05
- consistency gates: D3 at-or-above-state-median rate `>=0.60`; D3 unique-worst rate `<=0.15`
- estimability/transferability gates per candidate: at least 96 unique historical trajectories, 96 unique rule states, 48 opening prefixes, maximum single-prefix share 0.10, at least 4 generation strata, maximum single-stratum share 0.50

Research Generation 1のformal C03 resultは、1,272 selected roots、structural success `1245/1272 = 0.9787735849`、D3 top-set success `937/1272 = 0.7366352201`、D3 at-or-above-median `1106/1272 = 0.8694968553`、D3 unique-worst `90/1272 = 0.0707547170`、final `CONFIRMED`であった。

これらはG2-09のimmutable upstream referenceであり、G2-09の新しいscientific resultではない。

## 3. 新しく検証するconstruct

G2-09は以下を独立に扱う。

- `generalization-supporting case`
- `counterexample case`
- `ambiguous / non-estimable case`
- frozen generalization group / boundary
- frozen counterexample group / boundary

構造的成立とsearch-based tactical-value成立は別endpointとし、search disagreementをmotifの構造的不成立と同一視しない。Research Generation 1の0.60等の閾値は上流Studyのformal ruleとして保持するが、G2-09のformal generalization/counterexample acceptance ruleを自動的に意味しない。G2-09固有ruleは科学的evidence生成前に別途凍結する。

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
