# PCRPR-STUDY1 — Resume Here

更新日: 2026-08-29

## Current safe state

```text
Program = G2-07 / Research Generation 2
Study ID = PCRPR-STUDY1
Branch = research/g2-07-practical-comeback-reply-pressure-representation
Baseline main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
Study = CLOSED / MAIN INTEGRATED
main integration = COMPLETE / PR #77 / 57f7cf2d58f0543082434cb4c3259e26e90fe02e
```

## Read order

1. `STUDY_1_FINAL_REPORT.md`
2. `CURRENT_STATUS.md`
3. `DECISION_REGISTER.md`
4. `REPRODUCIBILITY_INDEX.md`
5. `results/STAGE_1_DEVELOPMENT_RESULT.json`
6. `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
7. `RESEARCH_LOG.md`

## Closure fact pattern

- production computation = success
- independent scientific replay computation = success
- production/independent terminal development-core SHA256 = exact same value
- independent artifact upload = GitHub Actions `CreateArtifact` timeout after 5 attempts
- full independent artifact = unavailable
- mandatory final exact comparer = not executed / skipped
- frozen decision mapping = technical/integrity/independent-verification failure → `STAGE1-TECHNICAL-INVALID`

## Do not do

PCRPR-STUDY1について以下を行わない。

- Stage 1 consumed blockのrerun
- independent replayだけのrerun
- artifact uploadだけの結果修復run
- replacement / extension seeds
- threshold / tolerance / model / target変更
- stdout core hash一致をfull independent verificationの代替として採用
- production `F05_ALL` / lambda 100をvalidated modelとして再利用
- Stage 2の例外authorization
- PCEM/RCPR decisionの救済
- human difficulty/error/deception claims

## Next permitted research action

PCRPR-STUDY1の追加scientific workはない。

次の独立machine-only agenda item:

```text
G2-08 — Machine Decision-Failure Taxonomy Study 1
```

G2-08開始時はremote `main`を改めて取得し、新しいStudy/Stage identity、fresh evidence、fresh seeds、artifact-preservation contractをprospectively固定する。

## Integration boundary

G2-07 closureはPR #77でmainへ統合済み。merge commitは`57f7cf2d58f0543082434cb4c3259e26e90fe02e`。PCRPR-STUDY1を再開せず、次の研究はfresh main auditから開始する。
