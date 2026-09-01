# PBAI-P2 — 再開位置

更新日: 2026-09-01  
Program: `PBAI-P2`

## 1. 最初に読む順序

再開時は、Research Generation 3のscientific/development内容をcandidate設計へ取り込まず、次の順序で確認する。

1. [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
3. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
4. [`GENERATION_2_EVIDENCE_AUDIT.md`](GENERATION_2_EVIDENCE_AUDIT.md)
5. [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
6. [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
7. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)
8. [`candidates/PBAI-C006-v1-predevelopment-support-result.json`](candidates/PBAI-C006-v1-predevelopment-support-result.json)
9. [`candidates/PBAI-C007-v1-predevelopment-support-result.json`](candidates/PBAI-C007-v1-predevelopment-support-result.json)
10. [`checkpoints/2026-09-01-c006-predevelopment-support-closure.md`](checkpoints/2026-09-01-c006-predevelopment-support-closure.md)
11. [`checkpoints/2026-09-01-c007-predevelopment-support-closure.md`](checkpoints/2026-09-01-c007-predevelopment-support-closure.md)

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
PBAI-P2-D = C006 CLOSED / C007 CLOSED-HOLD / C008 PREDEVELOPMENT NEXT
candidate implementation count = 0
predevelopment support outcome count = 2
candidate development outcome count = 0
validation count = 0
release holdout count = 0
public deployment count = 0
```

## 5. C006 canonical closure

```text
canonical run = 33485530125
semantic unique RAW states = 389148
semantic collision witnesses = 0
practical witness count = 0
production/independent deterministic core equality = true
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
implementation = NOT AUTHORIZED
```

`pending`を含むauthoritative RAW identity contractは変更しない。

## 6. C007 canonical closure

```text
canonical run = 33486314298
selected roots = 256 (Namua 128 / Mtaji 128)
same-key TT stores = 16512
shallower-over-deeper overwrite events = 0
roots with such event = 0
baseline equivalence mismatches = 0
production/independent measurement core equality = true
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
implementation = NOT AUTHORIZED
```

Frozen floor `32 events / 16 roots`未達である。同じC007-v1へseed、depth、search profile、thresholdを追加して救済しない。

## 7. 次に実行してよい工程

**C008 baseline-only predevelopment support**だけが次のcandidate-specific工程として許可されている。

Initial inventoryで既に固定済みのsupport boundary:

```text
support seeds = 43200001..43201024
target eligible roots = 128
minimum eligible roots = 64
phase balance = Namua/Mtaji target
measurement = baseline D2/D3 root-best flip only
candidate code = prohibited
benefit benchmark = prohibited
validation = prohibited
release holdout = prohibited
```

`<64`なら`NON-ESTIMABLE-HOLD`。support floorを満たした場合でもcandidate implementationを自動承認せず、exact implementation contractの別freezeが必要である。

## 8. 再開時にしてはいけないこと

- cutoffを変更する;
- G3 document/resultをcandidate designへ使う;
- PBAI-P1 C001〜C005を救済する;
- C006/C007をsame-version追加supportで救済する;
- C008 support前にconfirmation re-searchを実装する;
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
