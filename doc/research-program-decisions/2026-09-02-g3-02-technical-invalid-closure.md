# Program Decision — G3-02 EBRWS-STUDY1 technical-invalid closure

Date: 2026-09-02

## Decision

Accept Research Generation 3 `G3-02` formal Study `EBRWS-STUDY1` as:

`CLOSED / TECHNICAL-INVALID`

Stage 2 is:

`NOT-AUTHORIZED-NOT-EXECUTED`

Formal promoted candidate set is:

`[]`

## Basis

Stage 0 passed all frozen synthetic technical controls. Stage 1 was then separately authorized for exactly one fresh-development execution using `31210001..31210192`, 12 Namua + 12 Mtaji, relative depth 5.

The Stage 1 scientific runner completed and locally reported global gate PASS and exact production / independent stage-core agreement. It also locally reported two reply-width compression-dominant candidates. However, the canonical Stage 1 result files were not durably materialized in the repository: the ephemeral runner's result commit was rejected non-fast-forward and is not recoverable after job teardown.

The no-rescue boundary had already been crossed by fresh evidence generation/read. A second execution of the same Stage 1 evidence is not authorized. Therefore the runner-local positive summary remains diagnostic provenance only and is not a formal promoted candidate set.

The frozen prerequisite for Stage 2 — an immutable Stage 1 promoted-candidate artifact with no technical-integrity violation — is not satisfied.

## Diagnostic provenance retained but not promoted

GitHub Actions run `33569323221`, job `100059596453`, logged:

- selected roots: 12 Namua + 12 Mtaji
- globalGatePass: true
- production / independent stage core: `4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e`
- runner-local `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT`: 12/12
- runner-local `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT`: 9/12

These observations do not change the formal disposition.

## Immutable upstream boundaries

- Research Generation 2 remains CLOSED.
- G3-01 `LGTGMF-STUDY1` remains `CLOSED / TECHNICAL-INVALID`, eligible families `[]`, Stage 2 unexecuted.
- `LGTGMIV-STUDY1` remains `CLOSED / FORMAL-ELIGIBLE-ALL` and is not re-run or re-decided.
- authoritative state identity remains RAW-only.
- validated transform set remains `[]`.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

G3-02 did not generate/read it. Stage 2 seed `31220001..31220288` also remains unconsumed.

## No-rescue boundary

`EBRWS-STUDY1` will not be repaired by:

- same-evidence Stage 1 rerun,
- root replacement,
- seed extension/replacement,
- threshold/class/endpoint change,
- family or phase subset change,
- treating runner-local diagnostic candidates as formal promotion,
- retrospective Stage 2 authorization.

Any future re-examination of effective branching / reply-width structure must be a new prospective Study or explicitly new version using fresh evidence. It must not alter this Study's formal decision.

## Next program boundary

This closure does not automatically authorize G3-03 or any later Research Generation 3 Study. The next scientific action requires a separate current-state program review that preserves the G3-02 technical-invalid closure and the protected depth-10 firewall.
