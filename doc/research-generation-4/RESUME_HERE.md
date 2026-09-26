# Research Generation 4 — 再開位置

更新日: 2026-09-26  
状態: **`G4-06 COMPLETE / PRE-MAIN AUDIT PASS / READY FOR MAIN INTEGRATION REVIEW / NEXT CANDIDATE AFTER INTEGRATION = G4-07 AUTHORIZATION REVIEW`**

## 再開時の読む順序

1. remote `main` HEADとG4-06 research branch HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の状態を確認する。
3. [`checkpoints/2026-09-26-g4-06-pre-main-audit.md`](checkpoints/2026-09-26-g4-06-pre-main-audit.md)でmain統合前監査を確認する。
4. [`../local-game-tree-geometry-exact-consequence-bridge/CURRENT_STATUS.md`](../local-game-tree-geometry-exact-consequence-bridge/CURRENT_STATUS.md)でG4-06 closure状態を確認する。
5. [`../local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md`](../local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md)で正式解釈を確認する。
6. [`../local-game-tree-geometry-exact-consequence-bridge/results/stage-1/STAGE_1_FORMAL_RECEIPT.json`](../local-game-tree-geometry-exact-consequence-bridge/results/stage-1/STAGE_1_FORMAL_RECEIPT.json)でcanonical formal resultを確認する。
7. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でG4-07のfrozen program roleとdependencyを確認する。

## 現在地

```text
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED
G4-06 = COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / PRE-MAIN-AUDIT-PASS / RESEARCH BRANCH ONLY
G4-07 = NEXT AUTHORIZATION-REVIEW CANDIDATE AFTER G4-06 MAIN INTEGRATION / NOT AUTHORIZED
G4-08..G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```

## G4-06 canonical result

```text
Stage 0 canonical run = 36211754989 / attempt 1 / success
Stage 0 decision = STAGE0-TECHNICAL-PASS
Stage 0 mandatory gates = 12 / 12 PASS
Stage 1 canonical run = 36214800357 / attempt 1 / success
Stage 1 execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
Stage 1 artifact ID = 10897225431
Stage 1 artifact SHA-256 = 1a087b4bccfb0c941e9895d2bf35cce41fcbee5f0194de1c43f2293ea593c688
fixed formal domains = 8 / 8
relations emitted = 12 / 12
all production / independent agreement = true
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
G4-05 candidate rescan = 0
G4-10 depth-11 access = 0
```

## G4-06の解釈

G4-06は、G4-05で完全解析済みとなった固定8 microdomainに限定し、relative depth 5のbounded RAW local game-tree geometryとexact value・DTF・value-preserving move countをprospectiveに接続した。

固定populationではTree/RAW inflationが全rootで`1`、transposition occupancyが全rootで`0`となり、これらのexact-consequence relationはvariation不足で`NON-ESTIMABLE`となった。

corridorとreply widthにはvariationがあった。事前登録したfinite ordering ruleでは次の結果になった。

```text
VALUE × CORRIDOR = MIXED-ORDER
VALUE × REPLY = MIXED-ORDER
DTF × CORRIDOR = MIXED-ORDER
DTF × REPLY = MONOTONE-DECREASING-ORDER-CONSISTENT
VPMC × CORRIDOR = MONOTONE-DECREASING-ORDER-CONSISTENT
VPMC × REPLY = MIXED-ORDER
```

この結果はN=8の固定late-game exact microdomain内だけを対象とする。whole-Bao一般則、因果関係、AI棋力、human difficulty、public AI feature採用を意味しない。

## main統合前監査

監査は`PASS`した。

```text
pre-main audit = PASS
READY-FOR-MAIN-INTEGRATION-REVIEW = true
main integration = NOT EXECUTED
public/ changes = 0
public AI production changes = 0
G4-10 depth-11 access = 0
```

G4-06正本、RG4 current-facing文書、`RESEARCH_INDEX.md`、`FUTURE_RESEARCH_AGENDA.md`の整合を確認した。historical checkpoint、Program Plan、preregistration、authorizationは事後結果に合わせて書き換えていない。

## 次にRG4を進める場合

次工程はG4-06を`main`へ統合するかどうかの明示的な判断である。main統合はまだ実行していない。

G4-06がmain統合された後の次のcandidateは **G4-07 — 多時間尺度geometry memoryと回帰** のauthorization reviewである。

ただしG4-07は未認可である。またG4-02は`CLOSED / NO SCIENTIFIC DECISION`であるため、G4-07 authorization reviewではProgram Planのdependencyを機械的にpositive evidenceとせず、利用可能な上流evidenceを改めて明示的に判定する。

## Main integration

G4-06はresearch branch上でscientific execution、closure記録、main統合前監査まで完了した。

現在の状態は次である。

```text
scientific work = COMPLETE
pre-main audit = COMPLETE / PASS
integration readiness = READY-FOR-MAIN-INTEGRATION-REVIEW
main integration = NOT AUTHORIZED / NOT EXECUTED
```

追加scientific runやpost-outcome rescueは行わず、次の操作は明示的な統合判断だけとする。

## 禁止事項

- G4-02 Study 1〜4のrepair / reopen / rerun
- G4-03 Stage 1 / Stage 2のrerun
- G4-04 Stage 1 / Stage 2のrerun
- G4-05 Stage 0 / Stage 1 / Stage 2のrerun
- G4-05 candidate rescan / seed extension / root replacement / resource rescue
- G4-05 resultのwhole-Bao solutionへの拡張
- G4-06 Stage 1のpost-outcome rerun / metric変更 / depth変更 / subgroup rescue
- G4-06 resultのwhole-Bao lawへの一般化
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- public AIへの自動反映
