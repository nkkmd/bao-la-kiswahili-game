# EBRWS-STUDY1 — Stage 1 materialization failure / TECHNICAL-INVALID

Date: 2026-09-02 (Asia/Tokyo)

## Formal disposition

```text
Stage 1 = TECHNICAL-INVALID
Study = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal promoted candidate set = []
```

## What happened

The authorized one-shot Stage 1 run was GitHub Actions run `33569323221`, job `100059596453`.

The scientific execution step completed successfully and the frozen runner reported:

```text
reported runner disposition = STAGE1-PASS
globalGatePass = true
selected roots = 12 Namua + 12 Mtaji
production / independent stage scientific core exact match =
4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 =
4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
```

The runner-local diagnostic candidate set contained:

1. `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` — 9/12
2. `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` — 12/12

No formal claim is made from these two diagnostic candidates.

## Materialization failure

After generating `scientific-result.json`, `telemetry.json`, and `execution-summary.json`, the workflow locally committed them as short commit `709bc393`. The push was rejected as non-fast-forward because the remote research branch had advanced during execution.

The local ephemeral commit is not present in GitHub after job teardown and cannot be recovered through the repository API. The logged content commitments are:

```text
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
telemetryFileSha256 = f13a71a7a219fc1978667c1b39120df709b163fd5250962e9f19310ca9f9c719
```

Therefore the full canonical Stage 1 evidence object was generated but not durably materialized in the repository.

## Why fail-closed applies

The frozen protocol requires all Stage 1 mandatory gates to pass with no technical-integrity violation and requires the promoted primary candidate set to be frozen as an immutable artifact before Stage 2 authorization.

The no-rescue boundary was crossed when fresh `31210001..31210192` evidence was generated/read. The Stage 1 authorization permits exactly one execution. Re-running the same Stage 1 evidence merely to reconstruct missing canonical files is therefore not authorized.

The runner-local `STAGE1-PASS` and two observed candidates are retained as diagnostic provenance only. They are not converted into a formal promoted set.

Formal fail-closed disposition:

`TECHNICAL-INVALID`

## No rescue / no rerun

The following are prohibited:

- same-evidence Stage 1 rerun,
- seed replacement or extension,
- root replacement,
- threshold/class/endpoint changes,
- treating the logged candidate summary as a formally promoted candidate set,
- Stage 2 authorization based on the unrecoverable runner-local artifact.

## Protected evidence

The standard initial RAW-root complete exact depth-10 holdout was not generated or read by Stage 1 and remains:

`SEALED / NOT GENERATED / NOT READ`
