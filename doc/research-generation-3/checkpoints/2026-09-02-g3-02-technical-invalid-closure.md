# Research Generation 3 checkpoint — G3-02 technical-invalid closure

Date: 2026-09-02 (Asia/Tokyo)

## Program state

```text
Research Generation 2 = CLOSED
Research Generation 3 = ACTIVE
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-01 formal eligible families = []
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-02 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-02 formal promoted candidate set = []
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## G3-02 closure event

Stage 0 passed its frozen synthetic technical controls. Stage 1 was separately authorized for exactly one fresh execution using `31210001..31210192` and 12 Namua + 12 Mtaji at relative depth 5.

GitHub Actions run `33569323221`, job `100059596453`, completed the scientific runner and locally reported global gate PASS with production / independent stage scientific core exact equality. The runner-local diagnostic candidate summary contained reply-width `COMPRESSION-DOMINANT` for Namua 12/12 and Mtaji 9/12.

The three generated canonical Stage 1 result files were locally committed as short SHA `709bc393`, but repository push was rejected non-fast-forward because the research branch advanced during execution. The ephemeral commit is not recoverable from GitHub after runner teardown.

Because fresh evidence generation/read had already crossed the no-rescue boundary and Stage 1 was authorized for exactly one execution, the same evidence is not rerun to reconstruct missing canonical files. The runner-local positive summary remains diagnostic provenance only.

Formal fail-closed disposition:

`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`

Formal promoted candidate set remains `[]` and Stage 2 is not authorized or executed.

## Immutable evidence boundaries

- Stage 1 seed `31210001..31210192` is consumed.
- Stage 2 seed `31220001..31220288` remains unconsumed.
- standard initial RAW-root complete exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.
- G3-01 and LGTGMIV decisions are unchanged.
- RAW-only identity and validated transform set `[]` remain authoritative.
- historical `doc/research-generation-3/PROGRAM_PLAN.md` is unchanged.

## Next scientific decision point

No G3-03 or later Study is automatically authorized by this closure. The next scientific action requires a separate post-G3-02 current-state program review.
