# DECISION_REGISTER — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-16

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
