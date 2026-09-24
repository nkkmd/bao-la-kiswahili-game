# LWSRT-STUDY1 — Study 1 Protocol

Freeze date: 2026-09-24  
Program: Research Generation 4 / G4-03  
Authorization: **`G4-03-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
Source `main`: `dfc80a8fbf4487f7d6eb24e28908849d51a141ee`  
Research branch: `research/g4-03-width-ranking-transfer`

## 1. Formal identity

**Study ID:** `LWSRT-STUDY1`

**日本語題目**

**Baoのroot legal widthとsearch ranking変化の移送可能性研究1 — fresh source policy・reachable-root family・phase strataにおけるG3-07 confirmed associationのprospective再検証**

**English title**

**Local Width / Search-Ranking Transfer Study 1 — Prospective transfer validation of the G3-07 root-legal-width / ranking-preorder-change association across fresh source policies, reachable-root families, and phase strata**

Machine-readable preregistration is `prereg/STUDY_1_SPEC.json`. Scientific access before the separately required Stage 1 authorization is prohibited.

## 2. Primary question

G3-07で限定的に確認された、`root legal width`のHIGH stratumで`ranking-preorder change`が多いという非因果的associationが、G4-01でcompatibilityを確認したfresh source policy・reachable-root familyへ移したときにも同方向に再現するか、また反対方向のcounterexample domainが存在するかを検証する。

本Studyはbest move correctness、game-theoretic value、AI棋力、人間の難しさ、causal mechanismを検証しない。search condition A/Bのどちらもtruthとは扱わない。

## 3. Frozen upstream claims

Positive transfer targetはG3-07でformal `CONFIRMED / HIGHER-IN-HIGH`となった3 claimのみ。

```text
SC1 DEPTH × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH
SC2 NODE-BUDGET × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH
SC3 QUIESCENCE × E3 RANKING-PREORDER-CHANGE × G1 ROOT-LEGAL-WIDTH
```

Predictor thresholdは再学習しない。

```text
Namua = 4
Mtaji = 3
HIGH = width > threshold
LOW = 2 <= width < threshold
EQUAL = width == threshold / association sampleから除外
width < 2 = NON-ESTIMABLE
```

Search contrasts:

```text
SC1: D2_Q1 vs D3_Q1
SC2: B256_Q1_MAXD3 vs B1024_Q1_MAXD3
SC3: D2_Q0 vs D2_Q2
```

Endpointは3 contrastすべて`SILGM-E3-RANKING-PREORDER-CHANGE`。

## 4. Transfer domains

G4-01でSILGM compatibilityが成立した軸だけを使用する。

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE

RF1 = LGTTCI-RF1-MID-ANCHOR
  Namua exact ply 20
  Mtaji first nonterminal mtaji at ply >= 40

RF2 = LGTTCI-RF2-OFFSET-ANCHOR
  Namua exact ply 28
  Mtaji exact ply 52
```

Formal domainsは`P1×RF1`, `P1×RF2`, `P2×RF1`, `P2×RF2`の4つ。Namua/Mtajiを各domainのstrataとする。

## 5. Stage structure

### Stage 0 — `LWSRT-S0-TECHNICAL-2026-09-24-v1`

`TECHNICAL-FIXTURE` only。G4-01で既に科学利用禁止として隔離されたtechnical-only fixture namespace `44010001..44010064`を再利用してよい。fresh Stage 1/2 seedは生成・readしない。

検証項目:

- frozen source blob binding
- P1/P2 deterministic replayのproduction/independent一致
- RF1/RF2 anchor selection一致
- width threshold boundary
- 6 search conditionのproduction/independent一致
- singleton rootがranking helper前にfail closedすること
- exact two-sided stratified hypergeometric arithmetic一致
- exact Holm arithmetic一致
- protected evidence boundary

Stage 0 PASSだけではStage 1をauthorizeしない。

### Stage 1 — `LWSRT-S1-DEVELOPMENT-2026-09-24-v1`

`FRESH-DEVELOPMENT`。**NOT AUTHORIZED**。

Seed block:

```text
40312001..40312768 / 768 slots / RESERVED-NOT-ACCESSED
```

各`policy × root-family × phase`について`8 HIGH + 8 LOW`をtargetとする。Stage 1はsupport、endpoint definedness、production/independent exactness、resource readiness、identity firewall exactnessだけを判定する。

禁止:

- HIGH-vs-LOW risk difference
- observed direction
- p-value
- generalization/counterexample decision
- threshold relearning
- seed extension / root replacement

### Stage 2 — `LWSRT-S2-FORMAL-2026-09-24-v1`

`FRESH-FORMAL-HELDOUT`。**NOT AUTHORIZED**。

Seed block:

```text
40322001..40323536 / 1536 slots / RESERVED-NOT-ACCESSED
```

各`policy × root-family × phase`で`12 HIGH + 12 LOW`をtarget、合計192 roots。

## 6. Source and root selection

各stageでslot seedをstage-specific SHA-256により`policy × root-family × phase`へoutcome-blindに割り当てる。assigned source policyでtrajectoryを生成し、assigned root-family / phaseのanchorだけを候補にする。

`width class`は事前固定predictor stratumとしてのみselectionに使用できる。search endpoint、search score、game outcome、historical effectはselection input禁止。

同一RAW rootの重複はminimum selection-rankだけを残す。別rootへのreplacementはしない。

## 7. Formal inference

各`policy × root-family` domainについてNamua/Mtajiをstrataとして扱う。

Per phase:

```text
HIGH = 12
LOW = 12
N = 24
n = 12
K = ranking-preorder changed total
X = changed in HIGH
X ~ Hypergeometric(N,K,n)

minimum changed = 6
minimum unchanged = 6
```

Namua/Mtajiのexact PMFをconvolutionし`T = X_Namua + X_Mtaji`を得る。

```text
p2 = min(1, 2 * min(P[T <= observed], P[T >= observed]))
```

Direction:

```text
2*T > K_total => HIGHER-IN-HIGH
2*T < K_total => LOWER-IN-HIGH
2*T = K_total => ZERO-DIRECTION
```

`3 contrasts × 4 domains = 12` fixed testsを単一Holm family、FWER `1/20`で補正する。

Decision:

```text
significant + HIGHER-IN-HIGH => GENERALIZATION-CONFIRMED
significant + LOWER-IN-HIGH  => COUNTEREXAMPLE-CONFIRMED
estimable nonsignificant     => NOT-GENERALIZED
support insufficient         => NON-ESTIMABLE
technical contract failure   => TECHNICAL-INVALID
```

一つのclaim/domainの結果によって他のpopulation、threshold、seed、testを変更しない。

## 8. Freshness firewall

G4-03はG3-07、G3-12、G4-01のrepair/reopenではない。

Excluded seed namespaces:

```text
G3-07 Stage 1 = 31710001..31710256
G3-07 Stage 2 = 31720001..31720384
G4-01 interrupted SILGM = 40112001..40112768
G4-01 Stage 1R SILGM primary = 40212001..40212768
G4-01 Stage 1R SILGM reserve = 41212001..41212768
```

Stage 1 fresh access前に、監査可能なupstream full trajectory / opening prefix / selected RAW root identitiesをidentity-only firewallとしてmaterializeする。監査不能なidentityについて非重複を主張しない。

Stage 2ではさらにG4-03 Stage 1のsource seed、full trajectory、opening prefix、selected RAW rootを除外する。G3-12 scientific seed/evidenceは一切再利用しない。

## 9. Resource and execution contract

- source max ply = 80
- Stage 1 fixed slots = 768
- Stage 2 fixed slots = 1536
- seed extension = prohibited
- heavy fresh scientific generation on GitHub Actions = prohibited
- technical Stage 0 may run on GitHub Actions
- required production/independent mismatch, relay-limit in required selected unit, malformed/nonfinite search result, identity firewall failure = fail closed
- post-access repair-and-rerun = prohibited unless an explicitly prospectively frozen infrastructure-only rule exists before access; none is authorized in this v1 protocol

## 10. Protected boundaries

The following remain prohibited:

```text
G3-11 depth-10 rerun
G4-10 depth-11 generation/read
symmetry canonicalization not independently validated
public AI changes
main integration before explicit user instruction
```

## 11. Current authorization boundary

This protocol freeze authorizes Stage 0 technical verification only. A separate post-Stage0 / pre-fresh Stage 1 authorization review is mandatory before any `40312...` seed is generated or read.
