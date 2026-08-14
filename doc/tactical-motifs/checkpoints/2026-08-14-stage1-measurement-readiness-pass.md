# Stage 1 all-move measurement — discovery-readiness checkpoint

Date: 2026-08-14

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## Purpose

Record completion of the preregistered `measure` phase and the frozen minimum-measured-record gate before candidate discovery is allowed.

This checkpoint does not alter the frozen candidate grammar, promotion thresholds, ranking, caps, seed block, selection rules, interpretation boundary, or Stage 2 firewall.

## Frozen bindings

- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- frozen minimum measured move records: 1800

## Measurement result

Measurement was executed against exactly the frozen 715 selected unique rule states.

`measurement-manifest.json` reports:

- completed measurements: 715
- measured exact move records: 3148
- minimum measured move records: 1800
- `measurementReadinessPassed`: `true`
- measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`

Thus:

- 715 completed measurements = 715 selected unique rule states
- 3148 measured exact move records ≥ 1800 frozen minimum

## Provenance

The measurement manifest records:

- source commit: `40990b1489f956d52486553bb5e39d974e47dd75`
- source tree dirty: `false`
- Node: `v24.6.0`
- platform: `linux`
- architecture: `x64`

The manifest scientific source-file SHA-256 mapping is unchanged from the authorization-bound mapping, including the frozen spec SHA-256.

## Integrity interpretation

This is a measurement-readiness milestone, not a motif finding.

At this checkpoint no candidate enumeration output, candidate support table, D3 promotion statistic, candidate ranking, promoted set, manual curation, or Stage 2 claim has been inspected or generated.

No seed extension, replacement sampling, threshold retuning, phase reassignment, favorable subset selection, opening-threshold relaxation, post-outcome depth selection, failed-candidate renaming, or manual promotion occurred.

## Gate decision

The frozen discovery-readiness requirement is satisfied:

- required measured exact move records: at least 1800
- observed: 3148
- result: **PASS**

Therefore the preregistered firewall permits:

`node tools/experiments/run-tactical-motif-stage1-exploratory.js --phase discover`

The discover phase must use the already frozen candidate grammar, support deduplication, transferability gates, D3-value gates, deterministic ranking, and candidate caps without manual override.

Any promoted Stage 1 item remains an exploratory candidate for Stage 2 planning only. Stage 2 generation remains not authorized, and no `confirmed tesuji` claim is authorized by this checkpoint.
