# G4-05 — Reachable Late-Game Exact Microdomain Oracle Foundation Study 1

Agenda: `Research Generation 4 / G4-05`  
Study ID: `RLEMOF-STUDY1`  
状態: **`COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED`**

日本語正式作業名:

**Baoのreachable late-game exact microdomainと独立oracleのprospective構築 — terminal・recurrent closureを含む限定domainの完全解析可能性検証**

英語正式名:

**Reachable Late-Game Exact Microdomain Oracle Foundation Study 1**

## 目的

fresh reachable late-game rootをoutcome-blind / resource-feasibility-onlyに選択し、合法遷移graphを完全に閉じた限定domainについて、production / independent solverがexact valueとsolution structureを一致して再構築できるかを検証した。

本StudyはG2-04 `REEOE-STUDY1`のrepairではない。過去の8-state exact domainはStage 0 technical regression fixtureにだけ使用し、fresh G4-05 scientific evidenceへ混合していない。

## 最終結果

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-ACCEPTED
Stage 2 = FORMAL-COMPLETE
Stage 2 canonical run = 36120286922 / attempt 1 / success
fresh seed block = 40523001..40524024 / 1024 games
Stage 1 identity firewall roots = 8307
fresh RAW overlap excluded count = 0
eligible candidates = 21
inspected candidates = 10
complete formal domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
main integration = COMPLETE / PR #166 / merge commit 97ffe3758157d2497b5884f7b17abe59a24159b5
```

frozen minimum gateは6 complete domains、targetは8。candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのまま除外した。resource cap増加、root replacement、seed extension、same-evidence rerunは行っていない。

8 formal domainsではcomplete graph、state / transition digest、retrograde solution、root status、absolute winner、DTF、optimal move、recurrent SCC metadataをproduction / independentで一致確認した。

## 解釈

今回確立したのは、**prospectiveに固定したreachable late-game microdomain内でexact oracle foundationを構築できること**である。

Program Plan上、G4-06はG4-05がformal-eligible exact oracle domainを生成した場合だけ候補になるため、G4-06は次の個別authorization reviewへ進める状態になった。ただしG4-06の実行は自動認可されない。

## 解釈上の境界

- `RECURRENT`はcomplete graph上のrecurrent SCC semanticsであり、公式ルール上の`DRAW`を意味しない。
- 8 formal domainsでは`RECURRENT = 0`だったが、Bao全体での不在を意味しない。
- whole-Bao game-theoretic solutionを主張しない。
- arbitrary late-game rootへの無条件な一般化をしない。
- best move correctness、AI棋力、勝率、人間のdifficultyを主張しない。
- public AI変更を認可しない。
- G4-10 depth-11へアクセスしていない。

## 実行方針とclosure

長時間trialはGitHub Actionsを第一候補として設計し、Stage 0 / 1 / 2すべてActions上でdurable artifactを残した。Stage 2はone-shot authorizationに従い、一回だけformal executionした。

G4-05 scientific executionは完了している。同一Studyをrepair / rerun / seed-extensionしない。研究closure後、PR #166で`main`へ統合した。main統合はformal result、no-rescue境界、public AI非変更を変更しない。

## 主要文書

`STUDY_1_PROTOCOL.md`はStudy開始時点のprospective freezeを保持する歴史記録であり、本文中のStage 1 / Stage 2 `NOT AUTHORIZED`は**その時点の状態**を示す。後続Stageの実行状態は各`authorizations/*.json`、`CURRENT_STATUS.md`、`FINAL_REPORT.md`を正本として読む。protocol自体を結果後に書き換えて現況へ合わせない。

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`FINAL_REPORT.md`](FINAL_REPORT.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`preregistration/STAGE_2_FORMAL_SPEC.json`](preregistration/STAGE_2_FORMAL_SPEC.json)
- [`authorizations/STAGE_2_AUTHORIZATION.json`](authorizations/STAGE_2_AUTHORIZATION.json)
- [`results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`checkpoints/2026-09-25-stage2-formal-complete.md`](checkpoints/2026-09-25-stage2-formal-complete.md)
- [`../research-generation-4/checkpoints/2026-09-26-g4-05-main-integration.md`](../research-generation-4/checkpoints/2026-09-26-g4-05-main-integration.md)
