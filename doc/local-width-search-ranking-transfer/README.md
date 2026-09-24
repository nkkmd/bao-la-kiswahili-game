# G4-03 — Local Width / Search-Ranking Transfer Study 1

Program: `Research Generation 4 / G4-03`  
Study ID: `LWSRT-STUDY1`  
Branch: `research/g4-03-width-ranking-transfer`

正式日本語題目:

**Baoのroot legal widthとsearch ranking変化の移送可能性研究1 — fresh source policy・reachable-root family・phase strataにおけるG3-07 confirmed associationのprospective再検証**

現在はpreregistrationをfreezeし、Stage 0 technical-only verificationを行う段階である。fresh Stage 1 / Stage 2 scientific seed accessは未認可。

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`authorizations/STAGE_0_AUTHORIZATION.json`](authorizations/STAGE_0_AUTHORIZATION.json)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)

## Interpretation boundary

本Studyの対象はroot legal widthとdeterministic search-condition間のranking-preorder changeの**非因果的associationのtransferability**である。best move correctness、game-theoretic value、AI棋力、人間の難しさはendpointではない。

## Main integration

Research branchは`main`から隔離する。`main`統合はStudy closure・整合性監査後、ユーザーの明示指示があるまで行わない。
