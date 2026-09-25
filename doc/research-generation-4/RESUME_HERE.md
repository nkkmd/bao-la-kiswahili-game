# Research Generation 4 — 再開位置

更新日: 2026-09-25  
状態: **`G4-05 COMPLETE / MAIN NOT INTEGRATED / NEXT CORE CANDIDATE = G4-06 AUTHORIZATION REVIEW`**

## 再開時の読む順序

1. remote `main` HEADとresearch branch HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`../reachable-late-game-exact-microdomain-oracle-foundation/CURRENT_STATUS.md`](../reachable-late-game-exact-microdomain-oracle-foundation/CURRENT_STATUS.md)でG4-05 closureを確認する。
4. [`../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md)で正式解釈を確認する。
5. [`../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)でcanonical exact resultを確認する。
6. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でG4-06のfrozen program roleとdependencyを確認する。

## 現在地

```text
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN NOT INTEGRATED
G4-06 = NEXT CORE CANDIDATE / ELIGIBLE FOR AUTHORIZATION REVIEW / NOT AUTHORIZED
G4-07..G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-05 canonical result

```text
Stage 0 run = 36118292862 / success
Stage 0 decision = STAGE0-TECHNICAL-PASS
Stage 1 run = 36118961899 / success
Stage 1 decision = STAGE1-DEVELOPMENT-ACCEPTED
Stage 1 selected tier = T3
Stage 1 selected roots = 7
Stage 1 complete closures = 5
Stage 2 run = 36120286922 / attempt 1 / success
Stage 2 execution SHA = 72e45631112359346a83f9399be32ee3e6420ccb
Stage 2 artifact ID = 10858056244
Stage 2 artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
fresh seed block = 40523001..40524024 / 1024 games
Stage 1 identity firewall roots = 8307
fresh RAW overlap excluded = 0
eligible candidates = 21
inspected candidates = 10
formal complete domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
```

candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのままfail-closedした。cap増加、root replacement、seed extension、post-access repair-and-rerunは行っていない。

## G4-05 interpretation

G4-05は、prospectiveに固定したreachable late-game microdomain内でcomplete legal-transition closureと独立exact solver agreementを持つoracle foundationを構築できることを確認した。

8 formal domainsではroot status、absolute winner、DTF、optimal move keys、graph / solution digestまで一致した。recurrent countは8 domainすべて0だったが、これはBao全体のrecurrent構造不在やDRAW不在を意味しない。Study protocol上`RECURRENT`は`DRAW`ではなく、draw inferenceは未認可である。

whole-Bao solution、arbitrary late-game generalization、AI棋力、human difficulty、public AI変更も主張しない。

## 次にRG4を進める場合

次のcore candidateは**G4-06 — 局所幾何とexact game-theoretic consequenceの接続**。

Program Planでは、G4-06はG4-05がformal-eligible exact oracle domainを生成した場合だけ実行すると固定している。G4-05がこのdependencyを満たしたため、G4-06のauthorization reviewへ進むことは可能になった。

ただしG4-06は未認可である。fresh evidence access前に少なくとも次をprospectiveに固定する。

1. authorization review
2. Study ID / exact-domain inheritance contract
3. geometry claim / endpoint mapping
4. freshまたはholdout identity firewall
5. exact consequence endpoint
6. multiplicity / decision rule（必要な場合）
7. production / independent agreement gate
8. resource ceiling / stop rule
9. no-rescue / no-rerun rule
10. execution environment / artifact receipt

G4-05のformal domainを都合のよいgeometry claimに合わせてpost-hoc selectionしない。

## Main integration

G4-05はresearch branch上でclosure済みだが、`main`統合はまだ行っていない。明示指示があるまでresearch branchを維持する。

## 禁止事項

- G4-02 Study 1〜4のrepair / reopen / rerun
- G4-03 Stage 1 / Stage 2のrerun
- G4-04 Stage 1 / Stage 2のrerun
- G4-05 Stage 0 / Stage 1 / Stage 2のrerun
- G4-05 `STATE-LIMIT` candidateのresource rescue
- G4-05 seed extension / root replacement
- G4-05 resultのwhole-Bao solutionへの拡張
- `RECURRENT`から未定義の`DRAW`を推論すること
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AIへの自動反映
