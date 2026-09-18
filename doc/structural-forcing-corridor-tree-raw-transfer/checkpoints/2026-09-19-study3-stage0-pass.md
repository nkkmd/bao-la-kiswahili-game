# SFCDFT-STUDY3 — Stage 0 technical validation PASS

作成日: 2026-09-19  
Stage: `SFCDFT3-S0-TECHNICAL-2026-09-19-v1`  
状態: **`STAGE0-PASS / SCIENTIFIC-SEED-READS=0`**

## 結論

Study 3でprospectiveにfreezeしたanchor-bounded source replayとengine-guard censoringは、technical-only Stage 0で所定fixtureをすべて通過した。

```text
GitHub Actions run = 35389371946
execution head = f9cae36f33437abb7937f77ab7bac0bba063102a
artifact ID = 10564654680
artifact digest = sha256:0da2a47c4b4df3cc209217d2eab4c07785d520bca672725ab836b8c3b93b918a
deterministic core SHA-256 = d823461f553da8fc8bab27845c38bfcb7552e5acc771968e6e212a0dcd4294ff
scientific seed reads = 0
scientific outcome generated = false
```

## technical scan

technical namespace `49031001..49031256`から16 seedをscanし、4 domainすべてでcomplete candidate fixtureを確認した。

```text
SFCDFT3-D1-P1-RF1 -> seed 49031007 / pair complete at ply 44
SFCDFT3-D2-P1-RF2 -> seed 49031003 / pair complete at ply 52
SFCDFT3-D3-P2-RF1 -> seed 49031002 / pair complete at ply 44
SFCDFT3-D4-P2-RF2 -> seed 49031016 / pair complete at ply 52
```

各candidateで`moveCount = max(anchor ply)`となり、pair完成後のcontinuationが0であることを確認した。

## engine guard fixture

synthetic `relay-limit`をpair完成前に注入したfixtureでは次を確認した。

```text
candidateStatus = NO-CANDIDATE-ENGINE-GUARD-CENSORING
stopReason = ENGINE-GUARD
engineGuard.kind = relay-limit
pairComplete = false
scientificTerminal = false
engine winner present = true
```

したがって、engineが`winner`を設定しても`relay-limit`をBaoの自然なterminal evidenceへ流用しない境界が成立した。

比較用のsynthetic natural terminalは`NO-CANDIDATE-ROOT-SHORTAGE / NATURAL-TERMINAL / scientificTerminal=true`となり、両者を区別できた。

## その他のPASS項目

- max source ply到達時のincomplete pairを`NO-CANDIDATE-ROOT-SHORTAGE`へ分類
- complete candidateのfirst-16 opening prefixをmandatory化
- production / independent decision-prefix canonical exact一致
- Study 1 identity collision reject
- Study 2 identity collision reject
- malformed complete-candidate identityのfail-closed
- scientific endpoint magnitude / effect direction / p-value / generalization / counterexample outputなし

## freshness prerequisite

Study 2 identity firewallはStage 0前にseed-freeでdurable materialization済みである。

```text
firewall materialization run = 35388490684
firewall install run = 35388715102
identity core = 7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc
sealed source records = 382
unique trajectories = 380
unique opening prefixes = 372
unique RAW roots = 657
```

## authorization boundary

Stage 0 PASSはStage 1 fresh accessを自動認可しない。

```text
Stage 1 scientific seed access = NOT AUTHORIZED
Stage 2 scientific seed access = NOT AUTHORIZED
Study 1/2 seed replay = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

次の安全な作業は、Stage 1 compatibility-only spec / one-shot workflowをfreezeし、fresh access前の独立したauthorization reviewを行うことである。
