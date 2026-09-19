# 2026-09-19 — G4-02 / SFCDFT-STUDY4 Stage 1 pre-access authorization review

## 正式判定

**`PASS / STAGE1-PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

Authorization token:

**`SFCDFT4-STAGE1-PREACCESS-PASS`**

このreviewは、`SFCDFT-STUDY4` Stage 1のimplementation、pre-execution binding、seed-free preflightを固定することを許可する。

**このreviewだけでは fresh scientific seed read を許可しない。** Stage 1 scientific execution authorizationは、implementation/binding/preflightを検証した後、別commitで最後のtriggerとして作成する。

## 1. Review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
agenda = Research Generation 4 / G4-02
study = SFCDFT-STUDY4
branch = research/g4-02-sfcdft-study4-prereg
review anchor HEAD = 3ff59676f824efbec6ce8930ca008aec29760c98
baseline main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
Study 4 preregistration = FROZEN
Study 4 Stage 0 = STAGE0-PASS
Study 4 Stage 1 fresh seed reads before review = 0
Study 4 Stage 2 fresh seed reads before review = 0
public AI change = false
main integration = false
```

## 2. Stage 0 technical gate

Canonical Stage 0:

```text
workflow = SFCDFT4 Stage 0 end-to-end technical validation
run ID = 35435952961
run attempt = 1
execution SHA = 9eca4c249566a2c068083ba334fd47ca8d7aed4c
decision = STAGE0-PASS
result deterministic core = ebcffb9ab33acbafa6f5344740f0cc93d12fbd330911a2f96cac76b6c66d2133
bundle core = ee402806f362ecb483f04353632d2e829ee13175bcab91b8b4038a091a3df01f
fresh scientific seed reads = 0
scientific outputs generated = 0
```

次のproduction-equivalent pathをnon-scientific synthetic fixtureでend-to-end検証済みである。

```text
source fixture generation
-> source classification
-> frozen selection representation
-> source bundle construction
-> artifact upload / retrieval
-> digest / manifest verification
-> measurement consumer parse
-> production / independent dry-run exact agreement
-> fixed-eight aggregate schema validation
```

negative fixtureもfail-closedでPASSしている。

## 3. Study 3 durable identity firewall

Study 3 Stage 2 canonical runをrepair/rerunせず、既存immutable GitHub Actions artifactsだけからidentity-only firewallをmaterializeした。

Materialization:

```text
source scientific run = 35427427920
source execution HEAD = dec9a91d5860b9f3d927d632a7165bcbf99f5f63
source formal closure = TECHNICAL-INVALID / NO-SCIENTIFIC-DECISION / NO-RERUN
materialization run = 35440279723
materialization artifact = 10583750946
materialization artifact digest = sha256:34c4c57f176c10be6c6cfce6083d0a9aa14897288884c524a9443ddd0d628715
identity core SHA-256 = 4e9948fed1f7274f7d25b07f95fbc65ce3341b892dc64a288a6bcaa86f39b382
```

Coverage:

```text
primary START = 768 / 768
sealed source = 768 / 768
deterministic source failure = 0
paired reserve START = 0
retry = 0
unresolved = 0
unique source trajectory SHA-256 = 767
unique first-16 opening-prefix SHA-256 = 746
unique Namua/Mtaji RAW-root SHA-256 = 1326
```

Scientific boundary:

```text
scientific seed replay = false
scientific endpoint loaded = false
scientific measurement loaded = false
scientific aggregate loaded = false
formal measurement in Study 3 Stage 2 = not started
scientific decision in Study 3 Stage 2 = not generated
selected-pair membership imported = false
root state payload retained = false
```

Durable repository path:

`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study3-stage2/`

Study 3 Stage 2 primary/reserve seed namespaceはidentity listとは別に全面除外する。

## 4. Authorization gates

| Gate | 判定 | 根拠 |
| --- | --- | --- |
| prospective Study identity | **PASS** | Study 4はStudy 1–3のrepair/reopenではなく独立Studyとしてfreeze済み。 |
| scientific contract unchanged | **PASS** | C1/C6、方向、RAW-only、depth 5、4 domains、sample target、alpha、inferenceをStudy 3から変更していない。 |
| Stage 0 artifact pipeline | **PASS** | run `35435952961`、全mandatory gate PASS。 |
| prior-study freshness firewall | **PASS** | Study 1–3 seed namespace全面除外 + durable identity firewall。 |
| Study 3 outcome non-reuse | **PASS** | endpoint/measurement/aggregate/decisionをfirewallへ取り込んでいない。 |
| fresh Stage 1 namespace | **PASS / UNREAD** | `40611001..40611384` primary、`41611001..41611384` reserve。review前read 0。 |
| reserve semantics | **PASS** | infrastructure interruption専用。scientific failure、root shortage、engine guard、firewall rejectの救済に使わない。 |
| resource / stopping contract | **PASS** | frozen protocol/specから変更なし。 |
| no-rescue / no-rerun | **PASS** | prior Study reread、failed-source repair、seed extension、threshold変更は禁止維持。 |
| product/repository boundary | **PASS** | public AI change=false、main integration=false。 |

## 5. Stage 1 preparation scope

このreviewで新たに許可するもの:

1. `SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1` implementation
2. production / independent source implementationのStudy 4 identity binding
3. Study 1–3 durable firewall reader / verifier
4. seed-free source matrix generation
5. seed-free workflow design validation
6. Stage 1 pre-execution binding
7. Stage 1 seed-free preflight
8. preflight PASS後のfinal execution authorization artifact準備

このreviewで許可しないもの:

- Stage 1 scientific seed read
- Stage 2 scientific seed read
- scientific endpoint magnitudeの公開
- effect direction
- p-value
- generalization / counterexample decision
- main integration
- public AI change

## 6. Fresh Stage 1 namespace

```text
primary = 40611001..40611384 / 384 / UNREAD
paired infrastructure reserve = 41611001..41611384 / 384 / UNREAD
max infrastructure replacements = 16
max fresh seed reads = 400
```

Stage 1 scientific execution authorizationが存在するまで、これらをengine replayへ入力してはならない。

## 7. Protected boundary

```text
Study 1 scientific replay = false
Study 2 scientific replay = false
Study 3 Stage 1 replay = false
Study 3 Stage 2 repair/rerun = false
Study 3 scientific seed reread = false
G4-10 depth 11 access = false
validated transform set = []
authoritative state identity = RAW
public AI change = false
main integration = false
```

## 8. 結論

Stage 0 end-to-end technical validationとStudy 3 durable identity firewallが成立し、fresh scientific namespaceは未読のまま保持されている。したがってStage 1 implementation / binding / seed-free preflightへ進むことを認可する。

**`SFCDFT4-STAGE1-PREACCESS-PASS / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**
