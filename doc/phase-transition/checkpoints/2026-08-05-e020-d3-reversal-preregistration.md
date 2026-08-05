# E-020 / H18 D3逆転 独立確認 — 事前登録チェックポイント

更新日: 2026-08-05  
Experiment: `E-020`  
Hypothesis: `H18`  
analysisVersion: `18-d3-reversal-replication`  
Status: **Preregistered / formal execution not authorized / no formal data generated**

## 1. 背景

E-019/H17のD3 (`hard / bao / depth 3`) では、事前登録方向 `phase2 > legacy` と逆に `legacy > phase2` が強く観測された。

E-019 D3:

- pairs: 4500
- phase2-only: 13
- legacy-only: 140
- discordants: 153
- exact two-sided McNemar p: `4.614222568073049e-28`
- E-019 D3 component: `fail`
- E-019 global H17: `not-confirmed`

この逆転はE-019のconfirmatory directionではないため、E-019内で新しいconfirmationへ読み替えない。

Study 1 completion plan Stage Aとして、新規seed blockによる独立replicationを別experimentとして事前登録した。

設計選定checkpoint:

- `doc/phase-transition/checkpoints/2026-08-05-stage-a-d3-independent-replication-design.md`

## 2. H18

> 固定条件 `hard / bao / depth 3` において、eligible category-A `capture-branch-expansion` のゲーム単位manifestationは、phase2 searchよりlegacy searchで高い。

H18はE-019/H17の変更ではない。E-019 D3観測を動機として、新しい独立データに対しprospectiveな逆方向仮説を設定する。

H18の範囲は `hard / bao / depth 3` のみに限定する。

次はH18から主張しない。

- 全depthでlegacyがphase2より高い
- depthとsearch profileの一般的interactionがconfirmedされた
- depth依存性が単調または非単調である一般法則
- 他evaluator・他search implementationへの一般化
- E-019 D3が遡及的にconfirmedされた

## 3. Preregistration

- file: `config/experiments/phase-transition-d3-reversal-replication-v1.json`
- experiment: `E-020`
- hypothesis: `H18`
- status: `preregistered-not-run`

固定条件:

- level: `hard`
- evaluator: `bao`
- maxDepth: `3`
- P2 search: `phase2`
- LG search: `legacy`
- paired same-seed / same random-opening boundary
- paired seeds: `4500`
- games per condition: `4500`
- total games: `9000`
- formal seed range: `20275001–20279500`
- primary population: `pliesRemaining >= 9`

Candidate detection / regime classificationはE-019から変更しない。

- signalThreshold: `2.0`
- persistenceThreshold: `0.75`
- category: `A`
- beforeWindow: `3`
- afterWindow: `8`
- expansionDelta: `3`
- persistenceFraction: `0.5`
- eventWindow: `8`
- controlExclusionBuffer: `8`

## 4. Primary endpoint

Primary unit:

`paired shared-seed game`

Binary endpoint:

各conditionのgame内に、primary populationのeligible category-A candidateで `capture-branch-expansion` に分類されるものが1件以上あればevent=1、なければ0。

Primary test:

- two-sided exact McNemar
- alpha: `0.05`
- minimum discordant pairs: `20`
- prospective direction: **legacy-only > phase2-only**

E-019の逆方向観測を理由にone-sided testへ変更せず、E-018/E-019と同じtwo-sided exact McNemar frameworkを維持する。

## 5. Decision contract

### `confirmed`

- formal integrity / exact pairing pass
- exactly 4500 paired games
- discordants >=20
- two-sided exact McNemar p <=0.05
- legacy-only > phase2-only

### `not-confirmed`

formal integrity / exact pairingが成立しdiscordants >=20だが、significanceまたはprospective directionが不通過。

phase2 > legacyへ有意に戻った場合も、H18は`not-confirmed`とする。結果を見て方向を再変更しない。

### `inconclusive`

corpus/integrity/pairing/required-output construction/exact pair countが成立しない、またはdiscordants <20。

## 6. Sample size

E-019 D3と同じ4500 pairsを採用した。

PlanningではE-019実測をそのまま仮定せず、次の保守条件を使用した。

- discordance probability: `0.01`
- legacy share among discordants: `0.75`
- legacy/phase2 discordant OR: `3.0`
- minimum discordants: `20`
- alpha: `0.05`

4500 pairsで:

- P(discordants >=20): approximately `0.9999905274`
- unconditional exact-McNemar power: approximately `0.9127717901`

E-019 D3実測はdiscordance 3.4%、legacy share約91.5%であり、planning assumptionは意図的に弱い。

## 7. Independence

E-020 formal seed blockは過去seedと重複させない。

除外済み:

- pilot: `20260721–20260820`
- E-010: `20261001–20261200`
- E-011: `20262001–20262400`
- E-017: `20263001–20264000`
- E-018: `20265001–20267000`
- E-019: `20268001–20274500`

E-020:

- `20275001–20279500`

GitHub Actions fixtureはformal seedを使用しない。

## 8. Secondary boundary

Structural secondary:

- trajectoryHash + eventPly重複除去
- unique candidate / expansion trajectory-ply
- unique candidate / expansion trajectory
- archetype counts
- within-condition candidate/control enrichment
- P2/LG candidate trajectory-ply direct Fisher comparison

Mechanism-bridge secondary:

- candidate occurrence
- expansion manifestation
- candidate→expansion率
- forced-capture regime length / candidate position
- terminal distance

これらはprimary McNemarを置換・救済・反転しない。

詳細なtrajectory divergence、legal/capture move structure、maximum capturable seeds、depth 1/2/3の選択手境界はStage Bで扱う。

## 9. Execution policy

- file: `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`
- policy status: `preregistered-awaiting-infrastructure-validation`
- `formalExecutionAllowed: false`
- formal authorization: `granted: false`
- GitHub Actions formal generation: prohibited

今回の一般的な研究続行指示はE-020 formal開始承認として扱わない。

formal実行には、infrastructure validation完了後に**E-020固有の明示的ユーザー承認**を別途要求する。

その承認後にのみ:

- policyをapproved状態へ更新
- fixed-local environmentを再検証
- E-020専用execution lockを生成
- source commit / preregistration hash / policy hash / runtime / hardwareを固定
- formal corpus generationを開始

過去experimentのapproval token / execution lockは再利用しない。

## 10. Infrastructure

E-020専用として次を追加した。

- preregistration validator
- fixture-only paired runner
- paired endpoint builder
- reversed-direction evaluator
- integrity verifier
- structural/mechanism-bridge secondary summarizer
- guarded formal runner
- local execution-lock preparer
- unit/formal-guard tests
- non-formal fixture GitHub Actions workflow

Fixture seedは `90902001` から使用し、formal blockから分離する。

## 11. 既存formal decisions

変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

E-020はまだ結果を持たない。

PR #26はopen / draftを維持する。
