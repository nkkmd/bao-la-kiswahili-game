# DECISION_REGISTER — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-17

## TMHV-D001 — New prospective independent study

**Decision:** Treat this as a new study. All completed Bao study formal decisions and boundaries are immutable historical evidence.

## TMHV-D002 — Repository baseline

**Decision:** Stage 0 baseline is current `main` `3cc40d83917660dd815c785ff0e0c754666d9a0e`, verified at study start.

## TMHV-D003 — Evidence-layer separation

**Decision:** Record machine and human evidence on separate axes. Human positive/negative/inconclusive outcomes never modify `TM-S2-C03 = CONFIRMED`.

## TMHV-D004 — Primary construct

**Decision:** Use blinded cross-position principle discrimination as the confirmatory center because it directly addresses transferability recognition. Move-choice is secondary.

## TMHV-D005 — Position-only primary condition

**Decision:** Do not show opening history in the primary task. Opening prefixes remain internal diversity/audit metadata.

## TMHV-D006 — Anti-cue task order

**Decision:** Primary discrimination → move choice → free text → explicit tesuji/label task. Do not reveal C03/machine terminology beforehand.

## TMHV-D007 — Expert definition is outcome-blind

**Decision:** Freeze age/experience/qualification/neutral competence/prior-exposure rules before participant outcomes. Never define expertise by C03 support.

## TMHV-D008 — Fresh Stage 1 machine pool

**Decision:** Reserve `22100001..22101536`, 1536 games, six strata ×256, first 8 plies seeded-uniform exact moveVariants, max ply100, no extension/replacement.

**Boundary:** Stage 1 machine pool may develop/freeze stimuli but provides no human scientific outcome.

## TMHV-D009 — Primary controls are C03 near misses

**Decision:** Construct prospectively matched `P-ONLY`, `M-ONLY`, and `MORPH-NEAR` controls from the fresh pool. Controls are not assumed to be bad moves/states.

## TMHV-D010 — C01/C02/C04 are secondary calibration only

**Decision:** Prior machine-negative candidates are not primary controls. Fresh examples may be used only in prespecified secondary calibration, and their human results do not alter historical machine labels.

## TMHV-D011 — Participant is the primary inferential unit

**Decision:** Aggregate repeated block responses within participant. Do not count participant×position rows as independent expert samples.

## TMHV-D012 — Primary exact analysis candidate

**Decision:** Planned participant success is `primaryScore > 0.5`; participant-level prevalence is tested against `0.5` with one-sided exact binomial at alpha `0.05`. Positive validation also requires median primary score `>=2/3`.

**Boundary:** Stage 2 spec must freeze this before formal data; technical redesign before formal data requires documented prospective versioning.

## TMHV-D013 — Minimum estimability

**Decision:** Minimum included primary experts = `10`; planned primary blocks = `12`; minimum usable blocks/expert = `10`.

If recruitment fails, return `INCONCLUSIVE-NOT-ESTIMABLE`; do not loosen expert criteria.

## TMHV-D014 — Formal result vocabulary

**Decision:** Use `HUMAN-EXPERT-VALIDATED`, `NOT-HUMAN-EXPERT-VALIDATED`, `INCONCLUSIVE-NOT-ESTIMABLE`, `TECHNICAL-INCONCLUSIVE` for the human axis.

## TMHV-D015 — Raw human data stay out of public Git

**Decision:** Public repo receives protocol/schema/aggregate/audit metadata only. Contact linkage and identifying/free-text raw material remain private.

## TMHV-D016 — Free-text coding firewall

**Decision:** Coding ontology must be frozen before formal data. If independent blinded coding cannot be implemented, explanation coding remains exploratory.

## TMHV-D017 — Stage 0 contains no human scientific data

**Decision:** Stage 0 is repository/construct/technical design only. No participant recruitment or endpoint response is permitted.

## TMHV-D018 — Language equivalence

**Decision:** Formal instrument must support participant comprehension; planned priority is Kiswahili and English. Formal versions require content-equivalence review before Stage 2.

## TMHV-D019 — Ethics gate before recruitment

**Decision:** Document applicable ethics-review determination, consent, withdrawal, retention, and secure storage before scientific recruitment.

## TMHV-D020 — No-rescue after formal collection starts

**Decision:** Do not change expert definition, inclusion, C03 definition, stimulus set, matching, endpoint hierarchy, alpha/test, response-category merge, or free-text ontology in response to formal outcomes. Subgroup/exploratory analyses remain separate.

## TMHV-D021 — Stage 1 machine contract identity

**Decision:** Freeze Stage 1 as `TMHV-S1-STIMULUS-2026-08-17-v1` with 1536 games / seeds `22100001..22101536` and spec SHA-256 `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`.

**Boundary:** This is a machine stimulus-development stage only; it does not authorize human scientific inference.

## TMHV-D022 — Historical C03 is imported by immutable hash, not redefined

**Decision:** Bind C03 to historical candidate-definition SHA-256 `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`, canonical rank 5 and candidate key `7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`.

No Stage 1 control/matching result may alter the C03 machine definition or machine decision.

## TMHV-D023 — Three prospective primary control families

**Decision:** Freeze `P_ONLY`, `M_ONLY`, and `MORPH_NEAR` before scientific corpus generation. Control classification uses only current state structure and legal move morphology; no search value or human response enters classification.

## TMHV-D024 — Primary block geometry

**Decision:** Develop the primary task as three-position discrimination: two independently sourced C03 targets plus one matched control. The participant chooses the pair sharing a reusable move principle; random-choice probability is `1/3` per block.

Planned formal balance is 12 blocks, four per control family. Final human use still requires Stage 2 preregistration.

## TMHV-D025 — Validated seat swap only for participant orientation

**Decision:** Normalize the actor to South using the already validated player-swap transform. Do not reverse columns or directions. Do not show opening history, ply, machine labels, legal-move highlights, search values, reusable-pit counts, or tesuji terminology in the primary position rendering.

## TMHV-D026 — Source-hash-bound machine generation authorization

**Decision:** After pre-generation CI success at implementation commit `03838e5d88329dd4b3c1f8e06598bbbc6d6a92cc`, issue Stage 1 authorization SHA-256 `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`.

Validation runs:

- pre-authorization: run `31955303204`, job `95184928361` = success;
- authorization binding: run `31955362114`, job `95185068008` = success.

**Authorized:** local/Colab generation, independent verification, outcome-blind selection/matching, rendering audit, non-scientific dry runs.

**Not authorized:** scientific expert recruitment, formal human responses, human outcome inspection, Stage 2 inference.

## TMHV-D027 — Scientific corpus must not be moved into CI as a convenience rescue

**Decision:** GitHub Actions remains contract/tooling validation only. Failure of the assistant runtime to resolve GitHub for local checkout did not justify generating the 1536-game scientific corpus in CI.

The scientific corpus was subsequently generated in an authorized clean local environment; no CI substitution, corpus extension, threshold change, or source-tree substitution was used.

## TMHV-D028 — Stage 1 machine stimulus pool is empirically ready

**Decision:** Accept the prospectively frozen Stage 1 readiness result as `MACHINE STIMULUS POOL READY`.

Observed under the frozen contract:

- `C03_TARGET = 687`
- `P_ONLY = 277`
- `M_ONLY = 621`
- `MORPH_NEAR = 987`
- matched `P_ONLY = 277`
- matched `M_ONLY = 605`
- matched `MORPH_NEAR = 672`
- target generation strata represented = `6`
- all ten readiness gates = `true`
- replacement performed = `false`
- control reuse performed = `false`
- pool hash = `6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`

**Boundary:** Machine pool readiness is not human validation. Human evidence remains `NOT-YET-COLLECTED`, and no exact formal 12-block stimulus set, scientific recruitment, formal response collection, or Stage 2 inference is authorized by this decision.
