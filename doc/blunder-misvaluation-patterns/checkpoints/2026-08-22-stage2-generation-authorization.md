# 2026-08-22 — Stage 2 formal generation authorization

## Decision

Stage 2 pre-authorization technical validation passed on the exact source tree at:

```text
validatedExecutionHead = 011b9a56ecb95046f7d61a331b76dea093aa7663
```

Validated frozen identities:

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
```

Local technical validation:

```text
candidate/spec validator = PASS
contract test = PASS
tooling semantics test = PASS
Node syntax checks = PASS
scientific source tree = CLEAN
pre-authorization generatedGames = 0
pre-authorization scientific artifacts = ABSENT
```

Technical validation result commit:

```text
3d5a1a33f673c9c98ba6a5ed2862b25c8d76e777
```

Exact execution source-file SHA-256 freeze commit:

```text
11670e528dccff063b8e66be9ff190e61e4e4e77
```

Final corrected source-bound authorization commit:

```text
a9eee06c6a1ad36f9e65948f5d78eff58a91d561
```

## Authorization correction audit

An initial authorization record was created at:

```text
a0e7d9ee619d081749039271f039b32267699d4b
```

Self-audit immediately detected a clerical SHA transcription error for:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
```

No Stage 2 scientific generation had occurred. The authorization record was corrected before use. The initial record is therefore **invalid / never used** and is retained only in Git history as an audit trail.

The correct frozen hash is:

```text
471dace470d1d83651d75b2e239b35bbfd55fd65cccc562ac3b47c020988eda9
```

The scientific spec, candidate freeze, engine, AI, runner, verifiers and evaluator were not changed by this correction.

## Authorized population

```text
games = 4096
seeds = 22500001..22504096
maxPly = 100
```

Stage 1 confirmation reuse remains forbidden.

## Mandatory execution order

```text
generate
-> independent full replay + generation-search verification
-> support-group selection
-> formal D3 measurement
-> independent formal measurement verification
-> formal evaluation
```

No later phase may be run before the preceding gate is accepted.

## No-rescue boundary

After scientific generation begins, no seed extension, replacement sampling, identity-overlap replacement, alternate-root substitution, candidate editing, matcher/failure retuning, endpoint/null/floor retuning, multiplicity change, favorable subgroup promotion, alternate primary depth/evaluator selection, or manual candidate override is authorized.

## Scientific interpretation boundary

Authorization permits formal scientific generation and the preregistered machine-operational inference only. It does not authorize game-theoretic blunder, human misconception, expert/traditional, pedagogical, causal, or external-validity claims.
