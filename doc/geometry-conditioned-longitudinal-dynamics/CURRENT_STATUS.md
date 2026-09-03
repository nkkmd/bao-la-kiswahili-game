# GCLD-STUDY1 — CURRENT STATUS

更新日: 2026-09-04

## Formal state

```text
Study = GCLD-STUDY1
Program = Research Generation 3 / G3-10
Lifecycle = CLOSED / FORMAL-COMPLETE
Stage 0 = GCLD-S0-TECHNICAL-2026-09-03-v1 / STAGE0-PASS
Stage 1 = GCLD-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-PASS
Stage 2 = GCLD-S2-FORMAL-2026-09-03-v1 / FORMAL-COMPLETE
Stage 1 seed block = 32210001..32210256 / CONSUMED
Stage 2 seed block = 32220001..32220384 / CONSUMED
same-evidence rerun = NOT AUTHORIZED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Stage 2 population

```text
fresh candidate trajectories = 48 / 48 complete
terminal-before-72 source-policy rejections while searching = 294
fully resource-eligible candidates = 47 / 48
formal measured trajectories = 32
checkpoints per trajectory = 15
checkpoint plies = 16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
inferential unit = trajectory
checkpoint inferential unit = false
production / independent = exact agreement
```

1本だけresource-ineligibleとなったcandidateはseed `32220258`で、ply 68 checkpointのdepth-5 preflightが`RELAY_LIMIT`となった。これはscientific outcomeではなく、prospectively固定されたresource eligibility ruleによる除外である。root replacementやseed extensionは行っていない。

## Formal decisions

```text
C1-DIRECTIONALITY-PATH-EFFICIENCY = CONFIRMED / ACTUAL-GREATER
C2-PERSISTENCE-LAG-DISTANCE-GRADIENT = CONFIRMED / ACTUAL-GREATER
C3-RETURN-FRACTION = CONFIRMED / ACTUAL-LESS
C4-CHRONOLOGY-CONDITIONED-CIRCULATION = NOT-CONFIRMED
C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE = CONFIRMED / ACTUAL-GREATER
```

全5 endpointはestimable。exact two-sided sign testをtrajectory levelで実行し、5 endpointを固定したHolm family、FWER=`1/20`を適用した。

## Formal evidence identity

```text
Stage 2 Actions run = 33810395545
Stage 2 workflow run number = 1
Stage 2 result artifact ID = 9916587217
Stage 2 result ZIP SHA-256 = 63e55a9a8f5d6c3752c15cee06a01c327fd717606bf7086b3d1242f780126a4f
Stage 2 result JSON SHA-256 = 08f31652fb599cf9db9b839cbc07f8aabe06aed69215208ec0556e6ec3a5bf7a
canonical scientific-result SHA-256 = c5ec84cecb4e540ce7ad9f52548dac14deecde3423b2f4d10e1c39e1000ae09f
exact-byte repository mirror commit = 622dae1ede85b3e8856a86a3b647a056f7ac08db
```

Stage 2の最初のexecution wrapper run `33809894513`は、fresh seed selectionより前のidentity-firewall metadata checkで停止した。fresh seed readは0、scientific result artifactは0であり、`PRE-FRESH-ACCESS-TECHNICAL-ABORT / SCIENTIFIC-EXECUTION-NOT-CONSUMED`として別途固定済みである。同runのrerunは行わず、科学契約を変更しないtechnical execution V2で初回fresh scientific executionを実施した。

## Remaining work

研究本体のscientific executionは完了した。残るrepository operationはcurrent-facing document consistency auditと、ユーザーが明示的に指示した場合に限る`main` integrationである。

`main` integrationの許可は本ファイルから推定してはならない。明示的なユーザー指示がない限り`NOT AUTHORIZED / NOT PERFORMED`を維持する。
