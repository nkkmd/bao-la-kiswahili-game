# PBAI-P1 Decision Register

## Program decisions frozen at establishment

### D01 — Separate engineering track

PBAI-P1はResearch Trackとは独立する。engineering resultは既存研究のformal decisionを変更しない。

### D02 — Evidence cutoff

PBAI-P1はprogram-start scientific evidence anchor `2db7c4d65771066e914f32cbc4116fcc3e9e386a`までのcompleted **Research Generation 1** researchを科学的inputとする。Research Generation 2 outcomeを途中追加しない。

### D03 — No implementation at program establishment

Program文書の追加だけではpublic AIコードを変更しない。PBAI-A/B/C完了前のcandidate implementationを承認しない。

### D04 — Research labels remain intact

`CONFIRMED`、`NOT-CONFIRMED`、`INCONCLUSIVE`、`NON-ESTIMABLE`、bounded exact、exploratory/descriptive等をengineering都合で再ラベルしない。

### D05 — No unvalidated win-probability semantics

Position Evaluation / Win-Rate Calibration Study 1はformal `INCONCLUSIVE`であり、既存mappingをvalidated Bao win probabilityとしてpublic UIまたはAI primary logicへ導入しない。

### D06 — RAW identity remains authoritative

validated transform setが存在しないため、unvalidated symmetry/reflection/seat swap/canonicalizationをproduction state identity、TT key、tablebase keyへ導入しない。

### D07 — Human claims remain separate

machine search complexity、reply concentration、error dependenceをhuman difficulty/error/deceptionとして表示しない。

### D08 — Ablation before combination

複数mechanismを同時導入せず、原則single-candidate comparisonから開始する。

### D09 — Holdout protection

release holdoutはcandidate tuningへ使用しない。holdout消耗時はnew blockをprospectively freezeする。

### D10 — Release safety dominates strength

rule correctness、invalid-state、crash、major operational regressionをstrength improvementで相殺しない。

## PBAI-A decisions — 2026-08-26

### D11 — Canonical Research Generation 1 evidence core

PBAI-Aのscientific evidence coreを次の14 completed Study areasとしてfreezeする。

```text
Phase Transition Study 1
Position Typology / Playing Style Study 1
Namua→Mtaji Strategic Temporal Transition Study 1
Position Complexity / Difficulty Study 1
Tactical Motifs / Tesuji Study 1
Tactical Motif Human / Expert Validation Study 1
Position Evaluation / Win-Rate Calibration Study 1
Blunder / Misvaluation Patterns Study 1
Critical Positions / Outcome Branching Study 1
Restricted Endgame / Winning Regions Study 1
Symmetry / Isomorphic Positions Study 1
ORISC-STUDY1
State Space / Game Tree Complexity Study 1
PCEM-STUDY1
```

First Joseki Study、first-player advantage research、paired-opening work、historical AI developmentは重要な先行context / engineering infrastructureとして扱うが、PBAI-AによってResearch Generation 1 scientific evidenceへ黙って再分類しない。特定のscientific findingをcandidate evidenceとして使う場合は、後続decisionでeligibilityを明示する。

### D12 — PBAI-A complete

`GENERATION_1_EVIDENCE_AUDIT.md`のStudy-by-Study audit、E1/E2/E3/E4分類、prohibited inference、candidate trace、Research Generation 2 exclusion、RAW identity boundaryを確認し、PBAI-Aを`COMPLETE`とする。

PBAI-A完了はcandidate implementation authorizationではない。

```text
PBAI-C001..PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
```

### D13 — Current `AI.stateKey` is not the Research Generation 1 RAW identity contract

Research-derived authoritative RAW identityは次を含む。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn`、`reason`は除外する。

PBAI-A開始時点の`public/ai.js` `AI.stateKey`は`pending`を含まないため、Research Generation 1のauthoritative RAW identityと同一ではない。この観測だけからcurrent public search failureを宣言しないが、`PBAI-C003`等のtablebase/research-derived RAW keyへ`AI.stateKey`を暗黙流用することを禁止する。

current search/TTに対する実際の影響範囲は、必要ならPBAI-B/PBAI-Cでruntime semanticsとreachable-state条件を分離して監査する。PBAI-Aではpublic AI codeを変更しない。

### D14 — PBAI-B is the next authorized phase

PBAI-A完了後の次工程は`AI-GEN2` exact public baseline freezeである。PBAI-C benchmark frameworkは既にfrozenだがnumeric non-regression/release gatesは未freezeのため、candidate developmentは引き続き未承認とする。

### D15 — Candidate evidence readiness does not reserve AI-GEN3

`EVIDENCE-AUDIT-READY`、`AUTHORIZED-FOR-DEVELOPMENT`、development build、validation pass、release candidateのいずれも`AI-GEN3`を意味しない。`AI-GEN3`は明示的`ADOPT` decisionとpublic-default deployment後のみ付与する。

## Future decisions

PBAI-B以降のbaseline ID、benchmark numeric thresholds、candidate authorization、adoption/rejection、release/rollback decisionは本registerへ追記する。
