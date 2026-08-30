# PSRRE-STUDY1 — 最終報告

更新日: 2026-08-30  
正式判断: **`NON-ESTIMABLE`**

## 1. 研究

**Study ID:** `PSRRE-STUDY1`  
**Formal title:** Prospective Strategic-Regime Representation Eligibility Study 1  
**Program position:** G2-10とG2-11の間のdependency-resolution prerequisite

日本語研究題目:

> **Baoにおける戦略状態・regime表現の新規構築とprospective eligibility検証 — G2-11長期戦略遷移研究に先立つfresh evidenceベースの独立representation prerequisite**

本StudyはG2-10のsame-Study rescueではなく、新しいprospective representation familyをfresh development evidenceで構築し、条件を満たした場合にのみfresh held-out Stage 2へ送れるかを調べた独立研究である。

## 2. 結論

Studyの正式判断は:

```text
NON-ESTIMABLE
```

である。

Stage 0は`STAGE0-TECHNICAL-PASS`。Stage 1はfresh 4,096-game blockをconsume-onceで実行し、production / independent implementationはsource generation、root selection、28-feature calculation、scaler、全candidate representation評価、frozen-representation decisionでexact一致した。resource ceilingもすべてPASSした。

しかし、結果を見る前に固定したdevelopment readiness gateのうち:

```text
nonzero-MAD features = 15
required minimum = 20
```

が未達だった。active feature family数は5で固定minimum 5を満たし、その他のpopulation / diversity / technical gateもPASSした。

したがってStage 1 dispositionは:

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

となった。Stage 2は`STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`をentry条件としていたため、`NOT-AUTHORIZED-NOT-EXECUTED`である。

## 3. Stage 1 scientific population

```text
generated games = 4096
unique trajectories = 4066
distinct opening prefixes = 3734
selected roots = 512
selected distinct opening prefixes = 502
maximum single selected opening-prefix share = 0.00390625
```

8 phase/source-policy strataはすべて64 rootsでexact quotaを満たした。

## 4. feature readiness

Feature widthは28だった。nonzero-MAD featureは15:

```text
F01, F07, F08, F09, F10, F11, F12, F13,
F17, F18, F19, F20, F23, F24, F26
```

zero-MAD featureは13:

```text
F02, F03, F04, F05, F06, F14, F15, F16,
F21, F22, F25, F27, F28
```

active feature familyは5:

```text
RAW-STRUCTURAL
LEGAL-ACTION-STRUCTURE
ONE-PLY-SUCCESSOR-STRUCTURE
SEARCH-RELIABILITY-RAW
REPLY-PRESSURE-RAW
```

`TACTICAL-C03-ORIGINAL-SCOPE-ONLY`はこのdevelopment population上でnonzero-MAD familyにならなかった。これはTM-S2-C03の元scopeにおけるhistorical formal resultを否定・一般化するものではない。

## 5. representation candidateの扱い

3 family × `K=2..8`のcandidate計算自体はproduction / independent exactで完了した。runner上では全candidateがfrozen candidate eligibilityを満たさなかったが、formal decision orderではglobal readiness failureが先行する。

したがって本Studyはcandidateのnear-missや局所的metricを切り出して`NOT-ELIGIBLE`へ読み替えず、`NON-ESTIMABLE`として閉じる。threshold relaxation、feature差替え、family/K追加、subgroup rescueは行わない。

## 6. 技術的完全性とresource

```text
production / independent full exact = true
production wall = 516990.085642 ms
independent wall = 724782.182668 ms
max RSS = 350812 KB
production compressed shard = 2694038 bytes
independent compressed shard = 2694038 bytes
resource gates = PASS
```

full shardはbyte-identicalでSHA-256は双方:

```text
1f00bf677de11899c38179c7a383676be753c1184c0010bd84d3b1fb26af6cd1
```

である。

## 7. seed状態

```text
29510001..29514096 = Stage 1 CONSUMED
29610001..29618192 = Stage 2 RESERVED / UNCONSUMED
```

Stage 1 blockのrerun / repair / replacement / extensionは禁止する。Stage 2 blockは使用しない。

## 8. G2-11への影響

本Studyはfrozen representationを成立させなかったため:

```text
G2-11 candidate input authorized = false
G2-11 scientific authorization = false
```

である。transition matrix、persistence、recurrence、bottleneck/transient structure、transition asymmetry、survival/hazard、time-to-first-Mtaji等のG2-11 outcomeは本Studyで検査していない。

## 9. G2-10への影響

G2-10 closureは不変である。特に40-feature dictionary、deterministic K-means `K=2..6`、threshold、consumed Stage 1 seeds、reserved Stage 2 seeds、formal decisionを変更しない。

本Studyのnon-estimable resultをG2-10の救済材料には使用しない。

## 10. execution provenance

```text
source freeze = 41124069f89f0706cf943e18688c96a8c2db35d7
authorization = 085c5df24baff44bb644c00eda91d6212caf5708
workflow run = 33308337738
job = 99248759871
artifact = 9731444105
artifact ZIP SHA-256 = c418bca917723eb9c07035c323431972ac541b4b58e286820657b0d1c7e40d7a
Stage 1 result SHA-256 = 1a198843dfe57b6b378e8e9aec3f1f60e5cf5424b4e76028894485863914539e
runner internal result SHA-256 = 42bbb556b96e35bef24044c9112d47508b5f6759718c582f278dd64cbd7db9a8
```

## 11. Study closure

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NON-ESTIMABLE
G2-11 candidate input authorized = false
```

将来strategic-regime representationを再検討する場合は、新しいprospective Study/version、新しいpopulation contract、新しいfeature/readiness contract、fresh seed blockが必要である。本Studyのthresholdやseedを結果後に変更して再利用してはならない。
