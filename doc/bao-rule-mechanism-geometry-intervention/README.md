# Bao Rule-Mechanism / Geometry Intervention Study 1

Research Generation 3 / G3-06の独立prospective Study。

正式Study ID: **`BRMGI-STUDY1`**

正式英語題目:

**Bao Rule-Mechanism / Geometry Intervention Study 1 — Prospective move-conditioned exact analysis of bounded RAW local game-tree geometry change around capture, nyumba choice, reserve exhaustion, and Namua-to-Mtaji transition events**

正式日本語題目:

**Bao固有のrule-semantic eventに伴う局所ゲーム木幾何変化のprospective move-conditioned exact解析 — capture、nyumba選択、reserve枯渇／Namua→Mtaji移行を対象とするbounded RAW pre/post構造差の検証**

## Current state

```text
program review = G3-06-AUTHORIZED
Study status = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID / 1 authorized / 1 actual
Stage 1 seed = 31610001..31610256 / CONSUMED
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31620001..31620384 / NOT CONSUMED
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 = SEALED / NOT GENERATED / NOT READ
main integration = COMPLETE / fast-forward / force=false
```

## 結論

LGTGMIV F1-F5 / RAW-only / relative depth 5を用いるtechnical Stage 0 v2はPASSした。しかしfresh Stage 1のexactly-one authorized executionは、geometry measurementへ入る前のproduction / independent event-unit selection比較で:

`production/independent selection mismatch`

となり、mandatory verification gateを満たさなかった。

Stage 1 fresh seedへアクセス済みであるため、selectorを修正して同じevidenceを再実行することはno-rescue ruleにより禁止される。したがってformal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`、Studyは**`CLOSED / TECHNICAL-INVALID`**として閉じる。

これはcapture、nyumba、reserve exhaustion、Namua→Mtajiとbounded geometryの関係に対するnegative/null resultではない。

## Scientific boundary

本StudyはG3-05を救済しない。G3-05 partial telemetryはscientific inputではない。

Historical labelの`Intervention`はgeneric causal claimを意味しない。本Studyが当初authorizeしていたformal interpretationもmove-conditioned / event-conditioned bounded structural differenceに限定されていた。

今回valid Stage 1 geometry resultへ到達していないため、capture / nyumba / reserve / Namua→Mtajiのgeometry direction、G3-04 C1/C6のrule mechanism、search/value/forcing/human difficultyについて新しいscientific claimを行わない。

## Canonical documents

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — prospective frozen protocol
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json) — prospective machine-readable contract
- [`results/stage-1/scientific-result.json`](results/stage-1/scientific-result.json) — canonical Stage 1 technical-invalid result
- [`checkpoints/2026-09-03-stage-1-technical-invalid-study-closure.md`](checkpoints/2026-09-03-stage-1-technical-invalid-study-closure.md)

Program records:

- [`../research-program-decisions/2026-09-02-post-g3-05-g3-06-authorization-review.md`](../research-program-decisions/2026-09-02-post-g3-05-g3-06-authorization-review.md)
- [`../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md`](../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md)
- [`../research-generation-3/checkpoints/2026-09-03-g3-06-technical-invalid-closure.md`](../research-generation-3/checkpoints/2026-09-03-g3-06-technical-invalid-closure.md)
- [`../research-generation-3/checkpoints/2026-09-03-g3-06-main-integration-complete.md`](../research-generation-3/checkpoints/2026-09-03-g3-06-main-integration-complete.md)

## Main integration

2026-09-03、監査済みresearch branch `research/g3-06-bao-rule-mechanism-geometry-intervention` を、`main` baseline `b0cbd9f562bb803597acb313360c064dadd73299`からaudited head `f8eda131b81f0d6e3bc9f804ddfce875c9cd8d2b`へ **fast-forward / `force=false`** で統合した。squash、rebase、history rewrite、scientific rerunは行っていない。

## Next program action

G3-07は自動authorizeしない。次に進む場合はseparate post-G3-06 current-state authorization reviewを行う。

BRMGI selection diagnosticsをG3-07のvalidated scientific inputとして利用しない。protected depth-10 holdoutは引き続きsealed。
