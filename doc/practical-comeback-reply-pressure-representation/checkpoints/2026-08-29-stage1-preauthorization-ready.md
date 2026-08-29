# PCRPR-STUDY1 — Stage 1 preauthorization ready

Date: 2026-08-29

## State immediately before execution authorization

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 scientific outcome generated = false
Stage 1 seeds 28710001..28713072 = RESERVED / UNCONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Preauthorization technical prerequisites are complete:

- production implementation smoke PASS — run `33240901637`;
- resource preflight PASS — run `33240989191`;
- structurally separate independent exact smoke PASS — run `33241110983`;
- dual-hash source-freeze audit PASS — run `33241372471`, source-freeze commit `eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237`.

Frozen Stage 1 specification SHA-256:

```text
15aff7a35c7875c16a815ae0323b3726714b36941ce53ce4788f8947700b2f2c
```

Frozen computation contract SHA-256:

```text
7f6d2c9a928392c557f31f35cd0e912ba8396055c9535872b698f8085bc282e9
```

Frozen execution addendum SHA-256:

```text
fbddae1c60bb1a4cbc06946c51faf9883046f581f4c33e3c22618079f2bea246
```

The execution addendum prospectively defines the consume-once boundary as successful completion of the authorization/hash gate that writes `execution-start.json` before production or independent scientific generation begins.

Once that gate succeeds, the Stage 1 scientific seed block is consumed regardless of downstream production, independent replay, resource, artifact, or comparison success. No same-block rerun, repair, replacement, extension, post-outcome tolerance change, threshold change, model change, or target change is authorized.

The independent replay is one required verifier replay inside the same canonical workflow; it is not a replacement or extension.

Creating the explicit Stage 1 authorization is the next permitted action. It does not authorize Stage 2 or confirmatory inference.
