# SFCDFT-STUDY3 Stage 1 compatibility — FORMAL-PREPARATION-ELIGIBLE

更新日: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
Study: `SFCDFT-STUDY3`  
Stage: `SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1`  
判定: **`FORMAL-PREPARATION-ELIGIBLE`**

## 結論

Study 3 Stage 1のone-shot GitHub Actions executionは、fresh source acquisition、historical/Study 1/Study 2 freshness firewall、deterministic selection、seed-free measurement、compatibility-only aggregateを全て通過した。

これは**Stage 2 formal held-out executionを準備できる**というcompatibility/readiness判定であり、C1/C6のeffect direction、p-value、generalization、counterexampleの科学的判定ではない。Stage 2は自動認可されない。

## Canonical execution

```text
run ID = 35396341311
run attempt = 1
workflow conclusion = success
execution branch = research/g4-02-sfcdft-study3-prereg
execution head = b2a70b198c343bf05b9c81ac15fa546858955cdf
workflow = .github/workflows/sfcdft3-stage1-github-actions.yml
```

runのrerun・fresh population再実行は行っていない。

## Source acquisition

```text
primary START = 384 / 384
sealed primary source = 384 / 384
paired reserve START = 0
safe retry = 0
deterministic source failure = 0
unresolved = 0
NO-CANDIDATE-ROOT-SHORTAGE = 99
CANDIDATE-PAIR-COMPLETE = 285
engine-guard censoring = 0
```

Stage 1 primary namespace `40511001..40511384` は384件すべて1回だけ読まれ、以後再利用しない。Stage 1 paired reserve `41511001..41511384` は未読・未使用であり、完了済みStage 1の回復用途には使用しない。

## Freshness firewall / selection

source bundle artifact:

```text
artifact ID = 10567978033
digest = sha256:c8f97ebd7a7efb2e03d0982f7fb1e90aa797c25c93812b401fcb549418fcbfdb
selection ready = true
selected pairs = 32
selected source deterministic core = 1cedbbf91fc126f82b2e4c2bcee0146e5f7b2cb433da42c5dacd90977631a031
```

各domainは8 pairずつ選択され、preflight rejectは0だった。

```text
SFCDFT3-D1-P1-RF1 = 8 / 8
SFCDFT3-D2-P1-RF2 = 8 / 8
SFCDFT3-D3-P2-RF1 = 8 / 8
SFCDFT3-D4-P2-RF2 = 8 / 8
```

freshness firewallではseed `40511296` が `STUDY2-OPENING-PREFIX-COLLISION` として除外された。これは期待どおりのprospective exclusionであり、technical failureではない。

## Seed-free measurement

8個のmeasurement taskは全てSUCCESSした。fresh scientific seedの追加読取りは行っていない。

4 domainすべてで次を満たした。

```text
measured pairs = 8
C1 defined pairs = 8
C6 defined pairs = 8
resource pass pairs = 8
```

Stage 1ではendpoint magnitude、paired direction、p-valueをhuman-facing outputとして生成していない。

## Final result provenance

final result artifact:

```text
artifact ID = 10567663854
digest = sha256:a36e4cbad1fb885065badd9b1ad519f065e221cb9af4ea4669e56ea13192b2ba
decision = FORMAL-PREPARATION-ELIGIBLE
deterministic core = 498decdc808558d2e019d1ddf7aeec6c66d2a8074c6478e117a24bc9301e4dab
```

final source classification artifact:

```text
artifact ID = 10568167745
digest = sha256:7392939ef57ef6929589555b377d5b9179b71095e5225cd84dcd35d51dbd78b9
```

repository正本はActions生成JSONを内容変更せず保存する。

## Scientific boundary

Stage 1の結果から以下を生成・推論してはならない。

- C1/C6 effect magnitude
- paired direction
- p-value
- generalization decision
- counterexample decision

Stage 2 scientific namespaceは未読のままである。

```text
Stage 2 primary = 40521001..40521768 / UNREAD
Stage 2 paired reserve = 41521001..41521768 / UNREAD
Stage 2 authorized = false
```

## 次の安全な作業

Stage 2 formal held-out executionについて、frozen scientific contractを変更せず、one-shot pipeline・freshness firewall・resource ceiling・exact inference family・blob bindingをprospectiveに確認するpre-access authorization reviewへ進む。

review PASSとfinal authorizationが成立するまではStage 2 seedを読まない。

## 保護状態

- Study 1/2 replay: false
- Stage 1 rerun: false
- Stage 2 seed read: false
- G4-10 depth11 access: false
- public AI change: false
- `main` integration: false
