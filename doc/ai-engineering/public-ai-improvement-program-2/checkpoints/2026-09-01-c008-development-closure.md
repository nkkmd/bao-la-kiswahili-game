# PBAI-P2 C008-v1 development closure — 2026-09-01

## 結論

`PBAI-C008-v1`のdevelopment evaluationと独立再構成が完了した。

```text
formal engineering disposition = DEVELOPMENT-BENEFIT-FAIL-HOLD
validation contract freeze = NOT AUTHORIZED
validation execution = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
```

## Canonical execution

```text
workflow run = 33497330874
job = 99822424093
artifact = 9796432233
artifact ZIP SHA-256 = c6e99b5f4c9fc63f31312e4827fb629f654ed7fa176759944f06ea31705347d3
production result SHA-256 = 6a59ce40ea17724ee167d1508ba0ed2567ecd838a00ce70f9a1ea00daf50c560
independent verification SHA-256 = 5da4ec1a2b4559337492ac4796eb36949e60191a144a4dbd6f4517c0719106aa
deterministic core SHA-256 = 18e3a1d6e9cd7dff4b06da406e20ba17bdfb51a5b36a8f6f8620745cd32e0fa6
```

Independent verifierはproduction runnerをimportせず、population、D2/D3 eligibility、D4 full-window engineering reference、candidate/baseline metrics、aggregate dispositionを再構築した。production / independent deterministic coreはexact一致し、eligible / negative-control full rowsも一致した。

## Population

```text
source seeds = 42400001..42400512
source seeds = 512
trajectory candidates = 426
global roots = 256
  Namua = 128
  Mtaji = 128
runtime-eligible roots = 71
  Namua = 51
  Mtaji = 20
minimum estimable = 64
negative controls = 64
technical failures = 0
```

したがってdevelopment resultはestimableである。

## Frozen gatesに対する結果

Quality / safety:

```text
TopSet agreement
  baseline = 0.5633802817
  candidate = 0.8591549296
  delta = +0.2957746479
  frozen minimum = +0.05
  PASS

mean normalized rank loss
  baseline = 0.2393085787
  candidate = 0.04517712335
  delta = -0.1941314554
  frozen maximum = -0.02
  PASS

severe-loss rate
  baseline = 0.09859154930
  candidate = 0
  excess = -0.09859154930
  frozen maximum = 0
  PASS

catastrophic new loss = 0
  frozen maximum = 0
  PASS
```

Cost:

```text
median node ratio = 2.1004464286
frozen maximum = 1.60
FAIL

p95 node ratio = 3.0792452830
frozen maximum = 2.50
FAIL
```

Runtime coverage / negative control / technical gateはいずれもPASSした。

## Interpretation boundary

C008-v1はengineering-reference decision qualityを大きく改善したが、prospectively固定したcost conjunctionを満たさなかった。PBAI-P2では全条件conjunctiveであるため、quality改善を理由にcost gateを結果後に緩和しない。

```text
PBAI-C008-v1 = DEVELOPMENT-BENEFIT-FAIL-HOLD
```

同一v1のtrigger、confirmation depth、candidate count、search semantics、population、cost thresholdを結果後に変更して救済しない。軽量化・別mechanismを将来検討する場合は、initial inventory外candidate追加規則に従う別candidate identityが必要である。

D4 referenceはengineering comparison referenceであり、game-theoretic truthではない。G2-02の正式判断`INCONCLUSIVE`も変更しない。

## Firewall

Canonical resultで次を確認した。

```text
C008 support seeds 432xxxxx accessed as development outcomes = false
feature-off technical seeds 434xxxxx accessed as development outcomes = false
validation seeds 425xxxxx accessed = false
release holdout seeds 426xxxxx accessed = false
Research Generation 3 artifacts accessed = false
candidate mechanism retuned after outcome = false
thresholds retuned after outcome = false
```

## 次のcandidate-specific action

C008-v1を閉じ、initial inventoryで次に固定済みの`PBAI-C009-v1`についてcandidate codeなしのbaseline-only predevelopment supportを実施する。

C009 support sourceは`43300001..43301024`、target eligible rootsは128、minimum eligible rootsは64である。C009 implementationはsupport outcomeと別のexact candidate contract freezeが成立するまで未承認とする。
