# MDFT-STUDY1 — Failure Mode Dictionary

更新日: 2026-08-29  
状態: **INITIAL CANDIDATE SEARCH SPACE FROZEN / SCIENTIFIC SEEDS UNCONSUMED**

本書はStage 1で探索を許可するcandidate leaf familyを固定します。名称はhuman cognitionを意味せず、machine-operational signatureです。

## 共通入口

原則としてleaf assignment対象は`REFERENCE-DISAGREEMENT-EVENT`です。D3+Q1とB1024+Q1/MAXD3のreference consensusが成立せず`REFERENCE-AMBIGUOUS`となるrootには、formal failure labelを強制しません。

Taxonomyはmulti-labelです。

## SEARCH_DYNAMICS

### MDFT-F01 — DEPTH_HORIZON_SENSITIVITY

D1→D2→D3のexact ranking/top-set traceで、baseline decisionの不一致が追加depthによって解消し、より深いlineで初めて決定差を説明するsignature。

必要観測: B, D。  
Boundary: deeper searchがtruthであるとは主張しない。

### MDFT-F03 — BUDGET_UNDERRESOLUTION

fixed max-depthを共有しながらnode budgetの増加でbaseline decision disagreementが解消し、complete-depth / root-candidate coverage contractに従うsignature。

必要観測: B, D。  
Boundary: timeoutやpartial iterationを科学的move scoreとして混入しない。

### MDFT-F06 — RANKING_INSTABILITY

best move identityだけでなく、TopSet overlap、rank correlation、normalized rank displacement等がfrozen instability criterionを満たすsignature。

必要観測: B, D。  
Boundary: ranking instability単独をcausal mechanismとは呼ばない。

## REPLY_TACTICS

### MDFT-F02 — QUIESCENCE_TACTICAL_SENSITIVITY

D2_Q0 / D2_Q1 / D2_Q2等のquiescence差でdecision/rankingが変わり、capture/forcing continuationの追加評価と整合するsignature。

必要観測: B, C, D。

### MDFT-F04 — REPLY_TAIL_UNDERRESOLUTION

exact legal reply setそのものを欠落させたという意味ではなく、baseline searchがreferenceで高危険度となるreply tailの価値/rankを十分に解像できないsignature。

必要観測: C, D。  
Boundary: actual legal-reply omissionがtraceで証明されない限り`reply omission`とは呼ばない。

### MDFT-F05 — CAPTURE_FORCING_SEQUENCE_MISVALUATION

prospectively validated search-consistent canonical line tracer上で、capture/relay/forcing sequenceのbranch valueまたはorderingがbaseline/reference disagreementと対応するsignature。

必要観測: C, D。  
Technical gate: canonical line tracerがStage 0で検証できなければF05はStage 1開始前に`TECHNICALLY-INELIGIBLE`として固定し、別leafへ置換しない。

## EVALUATOR_STRUCTURE

### MDFT-F07 — RESERVE_VALUATION_SENSITIVITY

reference-disagreement eventについて、frozen evaluator decomposition / prospectively specified reserve-component ablationがdecision marginにmaterialな変化を与えるsignature。

必要観測: A, B, D。  
Boundary: reserve weightが客観的に誤っている、またはcausal root causeであるとは主張しない。

### MDFT-F08 — HOUSE_NYUMBA_VALUATION_SENSITIVITY

house/nyumba関連componentのfrozen evaluator decomposition / ablationがdecision marginにmaterialな変化を与えるsignature。

必要観測: A, B, D。  
Boundary: traditional strategic valueやhuman judgementを意味しない。

### MDFT-F09 — MORPHOLOGY_CONTEXT_MISMATCH

historically frozen morphology classifierを再fitせずexact reconstructionできた場合に限り、morphology contextとbaseline/reference decision disagreementのfrozen interaction ruleを満たすsignature。

必要観測: A, B, D。  
Technical gate: classifier/representationをexactに復元できない場合はStage 1開始前に`TECHNICALLY-INELIGIBLE`として固定し、結果後に新classifierを作らない。

## POST_ROOT_STRUCTURE

### MDFT-F10 — LONG_HORIZON_STRUCTURAL_MISVALUATION

bounded future continuationで観測するstructural trajectory divergenceがbaseline/reference disagreementとfrozen ruleで対応するpost-root diagnostic signature。

必要観測: D, E。  
Boundary: Eを使うためpre-root predictionではない。terminal/game outcome Fはtaxonomy assignmentに使用しない。resource preflightが不十分ならStage 1開始前に`TECHNICALLY-INELIGIBLE`とする。

## 禁止される結果後のtaxonomy変更

Stage 1 scientific outcome後に次を行わない。

- F01..F10以外のleaf追加
- support不足leafのnear-miss promotion
- class名変更による意味拡張
- threshold relaxation
- favorable phase/subgroupだけへの限定
- morphology classifierのrefit
- unvalidated PV/tracerへの置換
- F05/F09/F10 technical-ineligible時の代替leaf追加
