# G4-07 / MLGMR-STUDY1 — 最終報告

更新日: 2026-09-27  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
最終状態: **`COMPLETE / FORMAL-COMPLETE`**

## 1. 研究目的

G4-07は、Baoのbounded RAW local game-tree geometryを連続trajectory上で観測し、各geometry axisの変化方向が複数lagで持続するのか、反転するのか、あるいはformalに確認できないのかをprospectiveに検証した。

G3-08の再実行・救済ではない。G3-10は仮説生成にだけ使用し、fresh P1/P2 trajectories、事前固定lag family、trajectory-level experimental unit、phase-crossing censoring、exact rational inferenceを用いた。

## 2. Study構成

```text
Stage 0 = technical validation / PASS
Stage 1 = fresh development / support-only / COMPLETE
Stage 2 = fresh formal holdout / FORMAL-COMPLETE
```

Stage 1では24 axis×lag slotをsupport sufficiencyだけで評価し、effect directionを使わず16 slotをStage 2 familyへ送った。

Stage 2 formal family:

```text
A1: lag 1,2,4
A2: lag 1,2,4
A3: lag 1,2,4
A4: lag 1,2
A5: lag 1,2
A6: lag 1,2,4
```

lag 8はStage 1 support gateを満たさなかったためformal familyに含めていない。

## 3. Canonical Stage 2 execution

```text
run = 36278926636 / attempt 1 / success
head = f73e2ade42b3379b9eaf2007292a057cfeaf88f0
binding = MLGMR-STUDY1-STAGE2-BINDING-2026-09-27-V1
frozen source commit = 8bf76b5bb4ef375948cedaac131cb256b4a1dd8a
artifact ID = 10919769185
artifact ZIP SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
fresh scientific seed reads = 363
first / last read = 40723001 / 40723581
formal measured trajectories = 64
P1 / P2 = 32 / 32
production / independent exact agreement = true
G4-10 depth-11 access = 0
```

formal testは各slotのtrajectory-level balanceに対するexact two-sided binomial sign test。fixed 16 family全体にHolm-Bonferroni correctionを適用し、family alphaはexact `1/20`。

## 4. Formal result

最終decision counts:

```text
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
```

### lag 1

6軸すべてが`REVERSAL-CONFIRMED`。

| Axis | Positive | Negative | Zero | Decision |
| --- | ---: | ---: | ---: | --- |
| A1 root legal width | 1 | 61 | 2 | `REVERSAL-CONFIRMED` |
| A2 cumulative tree occurrence | 10 | 54 | 0 | `REVERSAL-CONFIRMED` |
| A3 cumulative distinct RAW states | 11 | 53 | 0 | `REVERSAL-CONFIRMED` |
| A4 cumulative tree/RAW ratio | 4 | 52 | 8 | `REVERSAL-CONFIRMED` |
| A5 duplicate-transition fraction | 8 | 49 | 7 | `REVERSAL-CONFIRMED` |
| A6 unit-width occupancy fraction | 9 | 55 | 0 | `REVERSAL-CONFIRMED` |

ここでpositiveはsame-sign persistence、negativeはopposite-sign relationを表す。したがってlag 1では全axisでopposite-sign側が強く優勢となり、multiplicity correction後もformal reversal confirmationに到達した。

### lag 2

6軸すべて`NOT-CONFIRMED`。

lag 1で見られた反対符号優勢は、lag 2ではformal reversal confirmationとして継続しなかった。同時にpersistence confirmationにも到達していない。

### lag 4

formal familyに入ったA1/A2/A3/A6の4軸はすべて`NOT-CONFIRMED`。

A4/A5 lag 4はStage 1 support不足によりformal family外であり、Stage 2の科学的decisionを持たない。

### lag 8

全axisでStage 1 support gateを満たさず、formal family外。Stage 2でのformal decisionは存在しない。

## 5. Bounded memory summary

事前登録した`confirmedContiguousPersistenceLagMax`は、lag 1から連続して`PERSISTENCE-CONFIRMED`となった最大lagを表す。

今回lag 1が全axisで`REVERSAL-CONFIRMED`であるため、6軸すべて:

```text
confirmedContiguousPersistenceLagMax = NONE
```

これは「Baoのgeometryにmemoryが存在しない」という一般命題ではない。今回固定した符号持続定義、checkpoint grid、lag family、P1/P2 trajectory populationにおいて、lag 1から始まるcontiguous positive persistenceがformalに確認されなかったという意味に限定する。

## 6. Return endpoint

reversal後のreturn endpointはpreregistration上**descriptive only**である。

多くのaxis/horizonで`RETURN`が観測されたが、formal p-value、multiplicity correction、confirmation labelの対象ではない。したがって「反転後に必ず戻る」「周期運動をする」等の法則へ昇格しない。

## 7. 科学的解釈

今回の最も明確なformal observationは、**最短の事前登録lagでは、6つのgeometry axisすべてが同方向持続ではなく反対符号側へ偏った**ことである。

一方、その反転はlag 2やlag 4までformal confirmationとして持続していない。したがって本Studyは、単純な「長く持続するgeometry memory」像よりも、少なくとも固定P1/P2 populationでは**短lagでdirectionが切り替わる局所的なtemporal structure**が存在することを支持する。

ただし、これを一般的なoscillation law、periodicity、mean reversion law、causal mechanismと呼ぶことは認可しない。

## 8. 明示的な限界

本Studyから次を主張しない。

- whole-Bao universal law
- geometryの物理的half-life / decay constant
- rule eventが反転を引き起こすという因果関係
- capture、nyumba、reserve、Namua→Mtaji別のmechanism
- lag 8以遠への外挿
- formal family外slotについてのpositive / negative scientific decision
- game-theoretic valueとの対応
- best move correctnessやsearch strength
- human-perceived difficulty
- 公開AIへ採用すべきfeatureの自動選定

rule-semantic eventごとの分解はG4-08、search reliabilityはG4-09、protected deeper exact topologyはG4-10の別agendaである。

## 9. No-rescue / protected boundary

Stage 2 fresh access開始後、以下は恒久的に禁止する。

- same-evidence rerun
- seed extension
- replacement population
- lag / axis / checkpoint / policyの事後変更
- support thresholdの緩和
- favorable subgroup rescue
- formal familyの結果後追加・削除
- G3-11 depth-10 rerun
- G4-10 depth-11 access without separate authorization

今回のG4-10 depth-11 access countは0。

## 10. Engineering boundary

```text
public AI change = false
public AI adoption authorization = false
main integration = NOT AUTHORIZED / NOT EXECUTED
```

研究結果はAI-GEN4の自動変更を意味しない。将来engineering candidateとして利用する場合も、科学結果とは別のengineering review、benchmark、実機検証、adoption decisionが必要である。

## 11. Canonical records

- [`results/stage-2/STAGE_2_CANONICAL_RECORD.json`](results/stage-2/STAGE_2_CANONICAL_RECORD.json)
- [`checkpoints/2026-09-27-stage-2-formal-complete.md`](checkpoints/2026-09-27-stage-2-formal-complete.md)
- [`results/stage-1/STAGE_1_CANONICAL_RECORD.json`](results/stage-1/STAGE_1_CANONICAL_RECORD.json)
- [`checkpoints/2026-09-27-stage-1-development-complete.md`](checkpoints/2026-09-27-stage-1-development-complete.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`prereg/STAGE_2_FORMAL_SPEC.json`](prereg/STAGE_2_FORMAL_SPEC.json)

Byte-exact raw Stage 2 output remains GitHub Actions artifact `10919769185`, pinned by SHA-256 values above.

## 12. Final conclusion

```text
G4-07 / MLGMR-STUDY1 = COMPLETE / FORMAL-COMPLETE
formal family = 16 slots
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
all six lag-1 axes = REVERSAL-CONFIRMED
confirmedContiguousPersistenceLagMax = NONE for all six axes
return endpoint = DESCRIPTIVE ONLY
G4-10 depth-11 access = 0
public AI change = false
main integration = NOT AUTHORIZED
```

本Studyは、固定されたfresh trajectory populationにおいて、局所geometryの最短lagが単純な同方向持続ではなく一貫して反対符号側へ偏るというprospective evidenceを得てformal closureする。
