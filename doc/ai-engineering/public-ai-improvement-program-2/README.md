# Public Bao AI Improvement Program 2 (`PBAI-P2`)

**正式題目:** Generation-2 Evidence-Informed Public Bao AI Improvement Program 2  
**日本語表記:** 第二世代研究の確定済み成果のみを用いたPublic Bao AI品質向上プログラム — Research Generation 2 evidenceからの新規engineering hypothesis構築、prospective candidate評価、独立validation、protected release holdoutによるAI-GEN3採用可否判定  
**開始日:** 2026-09-01  
**Status:** **INITIALIZED / PRE-OUTCOME FREEZE COMPLETE / NO CANDIDATE IMPLEMENTATION**

## 1. Program identityと目的

`PBAI-P2`は、完了済みResearch Generation 2の科学的正本と明示された不確実性・失敗境界だけをscientific/evidence inputとして、public Bao AIに実質的な改善をもたらす新しいengineering mechanismが存在するかをprospectively評価する独立AI Engineering Programである。

`PBAI-P1`の再開、救済、延長ではない。PBAI-P1のResearch Generation 1 scientific evidenceを新candidateのscientific premiseとして再利用しない。

正常な最終結果は次の両方を含む。

```text
ADOPT one or more candidates
KEEP-AI-GEN2
```

## 2. immutable scientific evidence cutoff

```text
G2 scientific evidence cutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d

cutoff commit
= Record Research Generation 2 main integration checkpoint

immediate child
= c5e33524c32b9ce9994760bababa08a85b6570d8
= Add Research Generation 3 program plan
```

したがって`cd200b85...`をResearch Generation 2-only / Research Generation 3-start boundaryとしてfreezeする。candidate outcomeを見た後にcutoffを変更しない。

## 3. Research Generation 3 hard firewall

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

Research Generation 3のscientific evidence、development observation、formal/diagnostic result、hypothesis、measurement、candidate mechanism、documentation-derived ideaをcandidate設計、selection、threshold、validation、interpretation、release decisionに使用しない。

current `main`はrepository operational stateとintegration baseの確認にのみ使用する。scientific evidence sourceとはしない。

Canonical firewall: [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)

## 4. current repository stateとpublic lineage

Program開始時のremote `main`:

```text
2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

current public lineage:

```text
AI-GEN2
```

`AI-GEN3`は引き続き予約名であり、formal `ADOPT`とactual public-default deploymentの双方が成立するまで使用しない。

## 5. PBAI-P2 Stage構成

PBAI-P1の`A..H` governance semanticsを継承しつつ、historical Stage IDとの衝突を避けるためProgram-qualified IDを使用する。

| Stage ID | 役割 |
| --- | --- |
| `PBAI-P2-A` | Research Generation 2 evidence audit / tier classification / Research Generation 3 exclusion freeze |
| `PBAI-P2-B` | current public AI read-only audit / exact `AI-GEN2` baseline re-freeze |
| `PBAI-P2-C` | global correctness・decision-quality・performance・regression gates、fresh split、candidate inventoryのpre-outcome freeze |
| `PBAI-P2-D` | candidate-specific predevelopment support、exact candidate contract、development authorization |
| `PBAI-P2-E` | isolated development / tuning-only evaluation |
| `PBAI-P2-F` | fresh independent validation、candidate source/config hash freeze、holdout authorization gate |
| `PBAI-P2-G` | protected release holdout、final correctness / operational gate、`ADOPT` / `REJECT` / `HOLD` decision |
| `PBAI-P2-H` | actual public-default deployment、release register、必要条件成立時のみ`AI-GEN3` promotion |

## 6. frozen baseline / gates

```text
baselineId = AI-GEN2-BASELINE-2026-09-01-v1
globalGateSpecId = PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1
```

Program開始時のminimum AI baseline filesとpublic execution binding filesはPBAI-P1 baseline source `f4ae3b11901180cbe417b3e643e2b357d8045d2d`とGit blob identityが一致した。したがってcurrent public AIはPBAI-P1 exact `AI-GEN2` sourceとbyte-identicalであり、G3期由来のpublic AI変更を分離するfallbackは不要と判定した。

詳細:

- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`baselines/AI-GEN2-BASELINE-2026-09-01-v1.json`](baselines/AI-GEN2-BASELINE-2026-09-01-v1.json)
- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json`](benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json)

## 7. candidate namespaceとinitial inventory

Repository-wide candidate namespaceは`PBAI-Cxxx`を継続する。PBAI-P1は`PBAI-C001`〜`PBAI-C005`を消費済みであり、PBAI-P2 initial inventoryは次でfreezeする。

```text
PBAI-C006-v1 = strict RAW-safe search/cache identity
PBAI-C007-v1 = depth-preferred bounded transposition-table replacement
PBAI-C008-v1 = instability-triggered bounded root confirmation re-search
PBAI-C009-v1 = exact single-reply forcing extension
```

いずれも`PROPOSED / NOT-AUTHORIZED-FOR-IMPLEMENTATION`から開始する。PBAI-P1 candidateのsame-mechanism rescueは行わない。

Canonical inventory: [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)

## 8. authorization boundary

Program initialization完了時点:

```text
PBAI-P2-A = COMPLETE
PBAI-P2-B = COMPLETE
PBAI-P2-C = COMPLETE / PRE-OUTCOME FREEZE
candidate implementations = 0
candidate benchmark outcomes = 0
validation executions = 0
protected release holdout executions = 0
public deployment changes = 0
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

最初に進めるのは`PBAI-C006-v1`のbaseline-only / static predevelopment auditと、その後のprospectively frozen practical-collision support measurementである。implementationはsupport contractを満たすまで承認しない。
