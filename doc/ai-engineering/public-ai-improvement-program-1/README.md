# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** ESTABLISHED / **PBAI-A COMPLETE / PBAI-B COMPLETE** / PBAI-C numeric gate freeze next / no public AI implementation change

## 1. 目的

完了済みの**Research Generation 1** Bao研究をevidence baseとして、publicで使用されているBao AIについて改善可能な設計箇所を抽出し、候補変更を独立に実装・比較・回帰検証したうえで、public deploymentの採否をengineering decisionとして判断する。

このProgramは研究ではない。研究成果を実装へ利用する場合も、AIが強くなった・弱くなったというengineering outcomeによって元研究のformal decisionを変更しない。

## 1.1 AI generation naming

AI世代名の正本は[`../AI_GENERATION_NAMING.md`](../AI_GENERATION_NAMING.md)とする。

```text
current public AI lineage = AI-GEN2
exact frozen baseline = AI-GEN2-BASELINE-2026-08-26-v1
next adopted public lineage reserved name = AI-GEN3
candidate IDs = PBAI-Cxxx
AI-GEN3 promotion before formal public adoption = prohibited
```

`AI-GEN2`はlineage、`AI-GEN2-BASELINE-2026-08-26-v1`はPBAI-P1のexact comparison configurationである。

`legacy` / `bao` / `bao-v2`等はevaluation/search profile identifierであり、AI generation numberではない。特に`bao-v2`は`AI-GEN2`の別名ではない。

PBAI candidateがdevelopment/validation benchmarkを通過しただけでは`AI-GEN3`と呼ばない。frozen release gateとnon-regression gateを通過し、explicit `ADOPT` decisionを得てpublic defaultとして正式採用・deploymentされた場合にのみ`AI-GEN3`へpromotionする。

## 2. Evidence cutoff

PBAI-P1のscientific inputは、program scientific evidence anchorまでに完了・closureされた**Research Generation 1 results**に限定する。

- Research Generation 1のformal labelを元のevidence levelのまま扱う。
- Research Generation 2 research outcomesはPBAI-P1へ逐次流入させない。
- Research Generation 2を利用する場合はPBAI-P1の結果後拡張ではなく、新しいprogram/versionのevidence cutoffをprospectively定義する。
- First Joseki Study、first-player advantage research、paired-opening / historical AI-development workはbaseline/context/infrastructureとして利用できるが、PBAI-AによってResearch Generation 1 scientific evidenceへ黙って再分類しない。

PBAI-Aのcanonical auditは[`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md)を正とする。

## 3. Engineering evidence tiers

- **E1 — direct engineering candidate evidence:** formal positiveまたはbounded exact evidenceからbounded trigger/fixture/benchmark stratum等を直接設計できる。production adoptionは別途benchmarkを必要とする。
- **E2 — engineering hypothesis evidence:** bounded/descriptive signalはあるがproduction ruleへ直接昇格できない。新しいengineering candidateとして独立にbenchmarkする。
- **E3 — engineering constraint:** negative/inconclusive/non-estimable resultから「してはいけない実装」「誤表示」「未検証仮定」を固定する。
- **E4 — reusable infrastructure:** replay、RAW identity、exact move enumeration、seed ledger、benchmark、artifact verification等をengineering validationへ再利用する。

E1〜E4は科学的evidence strengthの再分類ではない。

## 4. Program flow

```text
PBAI-A  Research Generation 1 Evidence → Engineering Audit       COMPLETE
   ↓
PBAI-B  AI-GEN2 Public Baseline Freeze                           COMPLETE
   ↓
PBAI-C  Benchmark / Numeric Non-Regression / Release-Gate Freeze NEXT
   ↓
PBAI-D  Candidate Registration + isolated implementation
   ↓
PBAI-E  Ablation / development benchmark
   ↓
PBAI-F  Fresh validation / release benchmark
   ↓
PBAI-G  Regression + operational gate
   ↓
PBAI-H  Staged public deployment / keep-or-rollback decision
```

## 5. PBAI-A completion

PBAI-A fixed:

- a 14-Study Research Generation 1 scientific evidence core;
- engineering use and prohibited inference for every Study;
- First Joseki / first-player work as earlier context/infrastructure;
- Research Generation 2 exclusion;
- authoritative research-derived RAW identity;
- candidate evidence trace for `PBAI-C001..PBAI-C005`.

Candidate state:

```text
PBAI-C001..PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
```

## 6. PBAI-B completion

Exact baseline:

```text
AI-GEN2-BASELINE-2026-08-26-v1
source main commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public endpoint = https://bao-la-kiswahili.cultivationdata.net/
```

Canonical sources:

- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)

PBAI-B freezes exact public-source SHA-256, rules binding, difficulty mapping, default `bao` evaluation, hard/expert enhanced search semantics, device-tier budgets, timeout/max-depth semantics, quiescence, TT/evaluation cache, randomness, Worker/fallback behavior and PWA cache identity.

Canonical verification workflow `32910436754` passed deterministic fixed-depth, Worker equivalence, timeout-safe move and existing rule/AI/search/config/worker/tactical regressions. Time-limited values were measured separately as descriptive operational observations only.

Cloudflare-internal deployment ID was unavailable through the repository/tooling used for PBAI-B, so it was not invented. The deployment binding and exact live-asset comparison boundary are recorded explicitly in the baseline.

PBAI-B changed no `public/` asset.

## 7. Non-negotiable boundaries

1. Research decisionをengineering resultで変更しない。
2. Calibration Study 1のmappingをvalidated Bao win probabilityとして実装・表示しない。
3. BMP C01-C04をconfirmed blunder ruleとしてhard-codeしない。
4. unvalidated symmetry / canonicalizationをstate identity、transposition deduplication、tablebase keyへ導入しない。
5. machine reply pressure / search complexityをhuman difficultyやhuman error probabilityとして表示しない。
6. PCEM-T1..T8をvalidated winning-try detectorとしてproduction化しない。
7. 一度に複数mechanismを変更して原因を不明にしない。原則single-candidate ablationから始める。
8. candidate開発でrelease holdout seed/resultを見ない。
9. rule correctness、crash、timeout、major tactical regressionを棋力向上で相殺しない。
10. Research Generation 2 researchをPBAI-P1へ途中投入しない。
11. candidate段階で`AI-GEN3`へpromotionしない。
12. Research Generation 1 RAW identityを必要とするtablebase/research-derived keyへcurrent `AI.stateKey`を暗黙流用しない。
13. frozen `AI-GEN2` baselineをlive driftへ黙って差し替えない。

## 8. Existing engineering assets

再利用する主要基盤:

- `doc/AI_BENCHMARK.md`
- `doc/AI_ADVANCED_ROADMAP.md`
- `doc/AI_DEVELOPMENT_LOG.md`
- `doc/AI_HUMAN_REVIEW_GUIDE.md`
- `tools/benchmark.js`
- rule / AI / evaluation / search / config / Worker / tactical tests
- paired opening / seeded self-play / diagnostic fixtures
- Research Generation 1 replay / independent-verification / identity-firewall / bounded exact-oracle / continuation-policy infrastructure

過去に不採用となったMCTS、`bao-v2`、adaptive search budget、weight-tuning variantsをPBAI-A/B完了だけで自動再開しない。

## 9. Current authorization boundary

現時点で許可される次工程は**PBAI-C numeric benchmark / non-regression / release-gate freeze**までである。

Candidate implementationはまだ禁止する。

```text
PBAI-B baseline = FROZEN
PBAI-C numeric gates = NOT-FROZEN
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

PBAI-Cではcandidate outcomeを見る前に、candidate-independent hard rejection gates、playing-strength non-inferiority、decision-quality、robustness、operational thresholds、development/validation/release-holdout blocksをprospectively固定する。その後にのみ個別`PBAI-Cxxx`をdevelopment authorizationへ進められる。
