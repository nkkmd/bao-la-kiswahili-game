# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program start repository anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** ESTABLISHED / Phase A evidence audit ready / no public AI implementation change yet

## 1. 目的

完了済みの第一世代Bao研究をevidence baseとして、publicで使用されているBao AIについて改善可能な設計箇所を抽出し、候補変更を独立に実装・比較・回帰検証したうえで、public deploymentの採否をengineering decisionとして判断する。

このProgramは研究ではない。研究成果を実装へ利用する場合も、AIが強くなった・弱くなったというengineering outcomeによって元研究のformal decisionを変更しない。

## 2. Evidence cutoff

PBAI-P1のscientific inputは、program-start repository anchorまでに完了・closureされた**Generation-1 research results**に限定する。

- Generation-1の`CONFIRMED`、bounded exact、descriptive、negative、`NOT-CONFIRMED`、`INCONCLUSIVE`、`NON-ESTIMABLE`、`NOT-AUTHORIZED-NOT-EXECUTED`を、それぞれ元のevidence levelのまま扱う。
- Generation-2 research outcomesはPBAI-P1へ逐次流入させない。
- Generation-2を利用する場合はPBAI-P1の結果後拡張ではなく、新しいprogram/versionのevidence cutoffをprospectively定義する。
- 既存のopening/first-player/AI-development履歴はbaseline contextには使用できるが、Generation-1 scientific findingとして扱う場合はPhase A auditで明示的にeligibilityを記録する。

## 3. Engineering evidence tiers

研究のscientific labelを上書きせず、engineering利用目的だけを次のtierで整理する。

- **E1 — direct engineering candidate evidence:** formal positiveまたはbounded exact evidenceから直接candidateを設計できる。
- **E2 — engineering hypothesis evidence:** bounded/descriptive signalはあるが、production ruleへ直接昇格できない。新しいengineering candidateとしてゼロからbenchmarkする。
- **E3 — engineering constraint:** negative/inconclusive/non-estimable resultから「してはいけない実装」「誤表示」「未検証仮定」を固定する。
- **E4 — reusable infrastructure:** replay、RAW identity、exact move enumeration、seed ledger、benchmark、artifact verification等をengineering validationへ再利用する。

E1〜E4は科学的evidence strengthの再分類ではない。

## 4. Program flow

旧`AI_ADVANCED_ROADMAP.md`のPhase番号と衝突しないよう、本Programでは`PBAI-A`〜`PBAI-H`を用いる。

```text
PBAI-A  Generation-1 Evidence → Engineering Audit
   ↓
PBAI-B  Public AI Baseline Freeze
   ↓
PBAI-C  Benchmark / Release-Gate Freeze
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

## 5. Non-negotiable boundaries

1. Research decisionをengineering resultで変更しない。
2. Calibration Study 1のmappingをvalidated Bao win probabilityとして実装・表示しない。
3. BMP C01-C04をconfirmed blunder ruleとしてhard-codeしない。
4. unvalidated symmetry / canonicalizationをstate identity、transposition deduplication、tablebase keyへ導入しない。
5. machine reply pressure / search complexityをhuman difficultyやhuman error probabilityとして表示しない。
6. PCEM-T1..T8をvalidated winning-try detectorとしてproduction化しない。
7. 一度に複数mechanismを変更して原因を不明にしない。原則single-candidate ablationから始める。
8. candidate開発でrelease holdout seed/resultを見ない。
9. rule correctness、crash、timeout、major tactical regressionを棋力向上で相殺しない。
10. Generation-2 researchをPBAI-P1へ途中投入しない。

## 6. Existing engineering assets

既存の以下は再利用する。

- `doc/AI_BENCHMARK.md`
- `doc/AI_ADVANCED_ROADMAP.md`
- `doc/AI_DEVELOPMENT_LOG.md`
- `doc/AI_HUMAN_REVIEW_GUIDE.md`
- `tools/benchmark.js`
- `test/engine.test.js`
- `test/ai.test.js`
- `test/evaluation.test.js`
- `test/search.test.js`
- `test/tactical.test.js`
- paired opening / seeded self-play / diagnostic fixtures / worker regression infrastructure

既存roadmapのPhase 0〜11の結果は歴史的engineering recordとして保持し、本Programの採否結果によってretroactiveに書き換えない。

## 7. Current authorization boundary

現時点で許可されるのは**PBAI-A evidence auditとbaseline inspection**までである。

public AIの評価関数、探索、重み、UI、worker、時間配分、state identityを変更するcandidate implementationは、`BASELINE_SPEC.md`と`BENCHMARK_PROTOCOL.md`の必要項目をfreezeし、`CANDIDATE_REGISTER.md`でcandidateを`AUTHORIZED-FOR-DEVELOPMENT`へ明示的に移してから行う。
