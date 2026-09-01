# PBAI-P2 — 再開位置

更新日: 2026-09-01  
Program: `PBAI-P2`

## 1. 最初に読む順序

再開時は、Research Generation 3の内容を読まず、次の順序で確認する。

1. [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
3. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
4. [`GENERATION_2_EVIDENCE_AUDIT.md`](GENERATION_2_EVIDENCE_AUDIT.md)
5. [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
6. [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
7. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)
8. [`candidates/PBAI-C006-v1-predevelopment-static-audit.md`](candidates/PBAI-C006-v1-predevelopment-static-audit.md)

Machine-readable正本:

- `baselines/AI-GEN2-BASELINE-2026-09-01-v1.json`
- `benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json`
- `candidates/PBAI-P2-INITIAL-CANDIDATE-INVENTORY-2026-09-01-v1.json`

## 2. 固定済みidentity

```text
Program ID = PBAI-P2
formal title = Generation-2 Evidence-Informed Public Bao AI Improvement Program 2
scientific evidence cutoff = cd200b85c1eb24aa4419bd5a9573552f3682f00d
initial remote main = 2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
baseline = AI-GEN2-BASELINE-2026-09-01-v1
global gates = PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1
current public lineage = AI-GEN2
next lineage reserved = AI-GEN3
```

Stage:

```text
PBAI-P2-A..PBAI-P2-H
```

Initial candidates:

```text
PBAI-C006-v1
PBAI-C007-v1
PBAI-C008-v1
PBAI-C009-v1
```

## 3. 絶対に維持するfirewall

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

G3のscientific evidence、development observation、result、diagnostic、hypothesis、measurement、candidate mechanism、documentation-derived ideaをPBAI-P2へ使用しない。

current `main`はrepository operational state / integration先確認には使えるが、scientific evidence sourceとして使わない。

## 4. 現在のengineering状態

```text
PBAI-P2-A = COMPLETE
PBAI-P2-B = COMPLETE
PBAI-P2-C = COMPLETE
PBAI-P2-D = C006 PREDEVELOPMENT
candidate implementation count = 0
candidate outcome count = 0
validation count = 0
release holdout count = 0
public deployment count = 0
```

## 5. C006の確定済みstatic fact

```text
G2 authoritative RAW fields
= pits,reserve,houseOwned,player,phase,winner,pending

current AI.stateKey fields
= pits,player,phase,reserve,houseOwned,winner

pending mismatch = true
propagation to evaluation cache / TT base key / Worker stale identity = true
practical correctness defect = NOT ESTABLISHED
```

このため、candidate implementationへ進んではならない。

## 6. 次に実行してよい工程

**C006 baseline-only dynamic support measurement**だけが次に許可されている。

```text
support seeds = 43000001..43002048
max plies = 160
candidate code = prohibited
benefit benchmark = prohibited
validation = prohibited
release holdout = prohibited
```

測定対象:

1. engine-valid semantic collision witness;
2. natural reachable collision;
3. same-search / evaluation-cache operational reuse witness;
4. Worker stale-identity witness。

## 7. Support結果の機械的処理

```text
semantic witness = 0
-> WITHDRAWN / NO-ACTIONABLE-IDENTITY-DEFECT

semantic witness >= 1 AND practical witness = 0
-> NON-ESTIMABLE-PRACTICAL-SUPPORT / HOLD

semantic witness >= 1 AND practical witness >= 1
-> SUPPORT-PASS
```

`SUPPORT-PASS`の場合だけ、candidate outcomeを見る前にexact implementation contractを新たにfreezeし、その後にdevelopment authorizationを判断する。

## 8. 再開時にしてはいけないこと

- cutoffを変更する;
- G3 document/resultをcandidate designへ使う;
- PBAI-P1 C001〜C005を救済する;
- static mismatchだけでC006をbug fixとして実装する;
- validation / holdoutを先に開く;
- candidateをpublic defaultへ直接反映する;
- AI-GEN3へ先に昇格する。

## 9. 正常な最終結果

PBAI-P2はAI-GEN3を必ず作るProgramではない。

```text
ADOPT one or more candidates
```

だけでなく:

```text
KEEP-AI-GEN2
```

も正常なclosure outcomeである。
