# G4-05 / RLEMOF-STUDY1 — 最終報告

更新日: 2026-09-26  
Agenda: `Research Generation 4 / G4-05`  
Study ID: `RLEMOF-STUDY1`  
正式状態: **`COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED`**

## 1. 研究目的

本Studyは、outcome-blindかつresource-feasibilityだけで選択したfresh reachable late-game rootについて、合法遷移graphを完全に閉じた限定microdomainを構築し、production solverと独立solverがgame-theoretic valueとsolution structureを一致して再構築できるかをprospectiveに検証した。

G2-04 `REEOE-STUDY1`のrepair / rescueではない。過去の8-state exact domainはStage 0 technical regression fixtureにだけ使用し、fresh G4-05 scientific evidenceには混合していない。

## 2. Stage 0 — 技術検証

Stage 0はfresh scientific evidenceを読まず、既存8-state fixtureとsynthetic recurrent graphでexact closure・retrograde・independent verification・recurrent handlingを検証した。

```text
run = 36118292862 / attempt 1 / success
stage decision = STAGE0-TECHNICAL-PASS
technical gates = 9 / 9 PASS
positive fixture = 8 states / 7 edges
synthetic recurrence = 2 recurrent + 1 terminal
```

ここで確認した`RECURRENT`はgraph上のrecurrent SCC semanticsであり、公式ルール上の`DRAW`を意味しない。

## 3. Stage 1 — fresh feasibility / development検証

Stage 1はformal game-theoretic inferenceを行わないdevelopment stageとして一回だけ実行した。fresh root feasibilityをresource-only条件で評価し、formal Stage 2を実行できるresource envelopeが存在するかを確認した。

```text
run = 36118961899 / attempt 1 / success
stage decision = STAGE1-DEVELOPMENT-ACCEPTED
selected tier = T3
selected roots = 7
complete closures = 5
Stage 1 RAW identity firewall roots = 8307
Stage 1 RAW identity set SHA-256 = 83a563ae908ea8778c689ce68f4b63b3e8873eba7dcc8d0547edc5eabb199503
```

Stage 1 root / outcomeをformal evidenceとして再利用せず、Stage 2ではこの8307 RAW identityを exclusion-only firewall として扱った。

## 4. Stage 2 — canonical formal実行

Stage 2は別authorization `RLEMOF-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE`の下で、GitHub Actionsにより一回だけ実行した。

```text
canonical run = 36120286922
attempt = 1
head SHA = 72e45631112359346a83f9399be32ee3e6420ccb
workflow conclusion = success
artifact ID = 10858056244
artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
production-result.json SHA-256 = 03f0f416dca4bb92de9c55e780d47e8d39c2e2bb50fa0d987953fa87f256fff0
independent-verification.json SHA-256 = acfb9fda216d0669e4432ab4bb112b07283e05def34e9793507c0c7ad9964140
execution-identity.txt SHA-256 = 982f929993888e61375b812bc7bc1898ec024825539bf81bac9584753ebb1c5b
```

fresh holdoutは`40523001..40524024 / 1024 games / maxPly 320`。Stage 1 RAW identityとのoverlap exclusion countは0だった。

## 5. 候補選択とno-rescue境界

frozen candidate orderは`seed ascending -> ply ascending -> RAW-state-key ascending`。resource-conditioned selectionでは最大16 candidateを調べ、8 complete formal domainsを目標、最低6 complete domainsをformal gateとした。

fresh holdoutから21 eligible candidateを得た。candidate orderの先頭からclosureを調べ、10 candidateを検査した時点で8 complete closureへ到達した。

completeにならなかった2件は次のとおり。

| Candidate | Seed | Ply | Stop | States | Edges |
| ---: | ---: | ---: | --- | ---: | ---: |
| 1 | 40523043 | 55 | `STATE-LIMIT` | 200001 | 200274 |
| 4 | 40523197 | 82 | `STATE-LIMIT` | 200001 | 200873 |

この2件についてcap増加、seed extension、root replacement、structural restriction追加、partial graphのexact昇格を行っていない。結果確認後のsame-evidence rerunも行っていない。

## 6. Formal exact domainの結果

formal populationはcomplete closureを得た8 domainである。

| Candidate | Seed | Ply | States | Edges | TERMINAL | WIN | LOSS | RECURRENT | Root | DTF |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| 2 | 40523046 | 57 | 13 | 12 | 10 | 2 | 1 | 0 | `LOSS` | 2 |
| 3 | 40523102 | 76 | 7 | 6 | 4 | 2 | 1 | 0 | `LOSS` | 2 |
| 5 | 40523368 | 63 | 30 | 29 | 21 | 6 | 3 | 0 | `LOSS` | 4 |
| 6 | 40523368 | 64 | 27 | 26 | 20 | 5 | 2 | 0 | `WIN` | 3 |
| 7 | 40523368 | 65 | 10 | 9 | 7 | 2 | 1 | 0 | `LOSS` | 2 |
| 8 | 40523399 | 44 | 8 | 7 | 4 | 3 | 1 | 0 | `WIN` | 3 |
| 9 | 40523399 | 45 | 7 | 6 | 4 | 2 | 1 | 0 | `LOSS` | 2 |
| 10 | 40523519 | 72 | 23 | 22 | 12 | 7 | 4 | 0 | `LOSS` | 6 |

`WIN` / `LOSS`はcomplete closure上でplayer-to-move基準にretrograde確定したstatusである。absolute winner、optimal move keys、state/transition digest、solution digestもartifactに保存され、production / independentで一致した。

8 formal domainsでは`RECURRENT = 0`だった。ただし、これはBao一般でrecurrent stateやdrawが存在しないことを示さない。Study protocolどおり`DRAW` inferenceは認可していない。

## 7. 独立検証

独立pathはStage 1 identity setをexclusion-only目的で再構築し、fresh Stage 2 holdoutを独立にfull regenerationした。そのうえでcandidate ordering、closure classification、formal domain identity、graph digest、solution digest、root exact result、recurrent SCC metadataを比較した。

```text
eligible candidates = 21
inspected candidates = 10
formal domains = 8
production / independent agreement = true
production core SHA-256 = f13c521c58ff2b6a5c649bf064752249fdf5a05754da90faddb78088b88e9a6c
independent verification core SHA-256 = 48c974e5304ba0fe3476dc88124fd4f7f26261b9d045c539b7e695ee4a9e5144
```

## 8. 正式判断

事前登録decision ruleでは、minimum complete-domain gateを満たし、全independent agreementが成立した場合のdecisionを次のtokenへ固定していた。

**`EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`**

今回、formal domain countは8でminimum 6を上回り、production / independent agreementも全項目で成立したため、このdecisionを正式採用する。

## 9. 解釈

G4-05が確立したのは、**prospectiveに固定したreachable late-game microdomain内で、complete legal-transition closureと独立exact solver agreementを持つformal oracle domainを構築できること**である。

これは、第四世代研究でgeometryとexact consequenceを直接結ぶための基盤を提供する。Program Plan上、G4-06は「G4-05がformal-eligible exact oracle domainを生成した場合だけ実行する」とされているため、G4-06は次のauthorization review候補になり得る。

ただし、G4-06のexecutionは本結果だけでは認可されない。

## 10. 主張しないこと

本Studyから次を主張しない。

- whole-Bao game-theoretic solution
- Bao全体でのWIN / LOSS / DRAW分布
- `RECURRENT = 0`の一般化
- recurrent stateを公式ルール上の`DRAW`と同一視すること
- arbitrary late-game rootへの無条件な一般化
- symmetry-reduced / canonicalized solution
- engine evaluationのexact truth化
- best move correctnessの一般保証
- AI棋力・勝率改善
- 人間のdifficulty
- public AI変更の妥当性

## 11. 整合性・不変境界

- Stage 0 / Stage 1 / Stage 2のsame-evidence rerunを行わない。
- Stage 2 seed extensionを行わない。
- `STATE-LIMIT` candidateを救済しない。
- G2-04をrepair / reopenしない。
- G3-11 depth-10をrerunしない。
- G4-10 depth-11へアクセスしない。
- G4-05結果をpublic AIへ自動反映しない。

GitHub Actionsではactions内部Node runtimeに関するdeprecation noticeが出たが、Study scriptの記録runtimeは`v20.20.2`であり、production / independent scientific stepsはsuccessで完了した。この通知を理由とするscientific rerunは行わない。

## 12. 研究終了（closure）

**G4-05 / `RLEMOF-STUDY1` を `COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN` として閉じる。**

研究closure後、PR #166で`main`へ統合した。merge commitは`97ffe3758157d2497b5884f7b17abe59a24159b5`。この統合はformal result、解釈境界、same-evidence rerun禁止、G4-06未認可、public AI非変更を変更しない。

## 13. 正本

`STUDY_1_PROTOCOL.md`はStudy開始時点のprospective freezeを保持する歴史記録であり、本文中のStage 1 / Stage 2 `NOT AUTHORIZED`は当時の状態を示す。後続Stageの実行状態はauthorization記録と本最終報告を優先し、protocol自体は結果後に現況へ合わせて書き換えない。

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`preregistration/STAGE_2_FORMAL_SPEC.json`](preregistration/STAGE_2_FORMAL_SPEC.json)
- [`authorizations/STAGE_2_AUTHORIZATION.json`](authorizations/STAGE_2_AUTHORIZATION.json)
- [`results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-generation-4/checkpoints/2026-09-26-g4-05-main-integration.md`](../research-generation-4/checkpoints/2026-09-26-g4-05-main-integration.md)
