# Symmetry / Isomorphic Positions Study 1 — Overview

Updated: 2026-08-24  
Study ID: `SIP-STUDY1`  
Status: **COMPLETED — FORMAL OUTCOMES NON-ESTIMABLE**

## 研究課題

Bao の盤面・player・move transformation が、visual similarity ではなく、state validity、exact legal-move set、transition、terminal/winner semantics を保存する rule-semantic graph isomorphism であるかを、prospectively frozen bounded domains で検証した。

## Formal candidate set

- `SIP-T01-SEAT-SWAP-LOCAL`
- `SIP-T02-LR-MTAJI-HOUSELESS`
- `SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

candidate semantics はformal outcome生成前にfreezeされ、outcome後の修正、phase除外、root/depth縮小、direction mapping変更等は行っていない。

## Fresh historically reachable bounded graphs

Stage 0のoutcome-blind technical sizingにより、fresh formal seed block `22910001..22910064`、各stratum 8 roots、local depth 3をfreezeした。

Formal fresh validationではproductionとindependent verifierの双方が以下を再現した。

| Outcome | Roots | States | Edges | Tested states | Exact mismatches |
| --- | ---: | ---: | ---: | ---: | ---: |
| T01 / Namua | 8 | 697 | 707 | 167 | 0 |
| T01 / Mtaji | 8 | 530 | 527 | 162 | 0 |
| T01 / Namua+Mtaji | 16 | 1227 | 1234 | 329 | 0 |
| T02 / Mtaji-houseless | 8 | 532 | 529 | 160 | 0 |
| T03 / Mtaji-houseless | 8 | 532 | 529 | 160 | 0 |

したがってfresh bounded-local source graphsだけを見れば、全candidateはG1–G8のprospective scopeでzero mismatchだった。

## Mandatory exact-oracle anchor

しかしpreregistered Stage 1は、Restricted Endgame Study 1のimmutable 8-state raw oracleをG9–G11 anchorとして必須化し、さらにproduction / independent equalityをG12として要求した。

IDENTITY positive control自身がoracle anchorでFAILしたため、nontrivial candidate failureとして解釈していない。post-outcome read-only diagnosticでは、8 stateRowsのうち3 terminal rowsについて、保存された`stateKey`と保存`ruleState`の再hashが一致しないことをproduction/independent双方のserializationで確認した。該当rowsのseed totalは63で、他rowsは64だった。一方、guard-free transitionを7 edges再計算したtarget keyはすべてoracle stored key setに収まった。

この診断はRestricted Endgame Study 1のartifactやformal decisionを変更しない。本Studyがそのartifactをstate-transform anchorとして利用する際のintegrity limitationとしてのみ記録する。

## Formal result

5 preregistered outcomesすべてについて、independent verifierはG12をFAILとし、最終decisionを

> **`NON-ESTIMABLE`**

とした。

```text
VALIDATED = 0
NOT-VALIDATED = 0
NON-ESTIMABLE = 5
```

fresh zero-mismatch evidenceをformal validationへ昇格させるrescueは行わない。

## Downstream boundary

本Study 1からformalにvalidatedされたtransformは0件である。したがって、

- canonicalization: **not authorized**
- symmetry group claim: **not authorized**
- symmetry-reduced state counting: **not authorized**
- State Space / Game Tree Complexity Studyでのcandidate-based reduction: **not authorized**

である。

次のState Space Studyを直ちに行う場合はraw state identityで進める必要がある。symmetry reductionを使いたい場合は、immutable upstream oracleを変更せず、anchor-integrity問題を独立に扱う新しいprospective Studyを先に設計する必要がある。

## Canonical artifacts

- `preregistration/CANDIDATE_TRANSFORMS.json`
- `preregistration/STAGE_1_FORMAL_SPEC.json`
- `preregistration/STAGE_1_AUTHORIZATION.json`
- `preregistration/STAGE_1_DOMAIN.json`
- `results/STAGE_1_PRODUCTION_RESULT.json`
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json`
- `results/STAGE_1_WORKFLOW_PROVENANCE.json`
- `results/STAGE_1_FORMAL_RESULT.json`
- `STUDY_1_FINAL_REPORT.md`
