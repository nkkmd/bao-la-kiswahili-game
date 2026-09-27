# G4-08 / BRSGT-STUDY1 — Stage 1 hardened pre-fresh static audit

Date: 2026-09-27  
Study: `BRSGT-STUDY1`  
Stage: `BRSGT-S1-DEVELOPMENT-2026-09-27-v1`  
Disposition: **`STAGE1-PRE-FRESH-STATIC-AUDIT-PASS / SCIENTIFIC-EXECUTION-NOT-AUTHORIZED`**

## Why this audit supersedes the earlier PASS

An earlier pre-fresh static audit passed, but Stage 1 workflow, binding verification and relay-limit handling were subsequently changed. That earlier PASS is therefore not used as the source-binding basis for current-head execution.

The audit scope was expanded and rerun against the current Stage 1 implementation.

## Canonical hardened audit

```text
workflow run = 36298236747
run attempt = 1
job = 108560959336
run conclusion = success
audit head = bc39087699d20761dfa58ce904e6b9534d2fbcd2
audit scope version = 2
artifact ID = 10924423363
artifact name = brsgt-stage1-pre-fresh-static-36298236747-1
artifact ZIP SHA-256 = 37aa71b03d2be9c90006b4c1a4466e2afa0d6c0150def550f2599ba7032eba09
```

## Frozen hashes recorded by the audit

```text
Stage 1 spec SHA-256 = c6b71ef982481ea78288f28761f212535d61813fcc2bb2f8ff4bce005386db43
firewall spec SHA-256 = ab495a2ded9e8dc31a0af05a5314afd38640e79fba79e771ca3bbdb003bf7e6a
runner SHA-256 = 9f5bd50a4027fb5df97788d98203f177f53b5ee31326fdc6fd4ed847505f2b12
production SHA-256 = b635f8cac808127b99a53373dc81a04cc12b1b297d1f18e5bb9505de7cb8b64b
independent SHA-256 = 17d5f5e1756698bd9ff232c3dd5625db63a821a1e337efa32b3d67d4eed24750
binding verifier SHA-256 = 9efc07490769db6f3971a760fc3474f853b1dc8ff024e9db57148e56ae4673a9
development workflow SHA-256 = ea84de6605537b62b51b5cfad78c4d57336baf75bbbfea8812e0d12548e3d226
firewall digest SHA-256 = 7f734c5086cc483531882993dbeac43cdd918b325a609ab619a0f9c0d1f2f946
```

## Firewall set sizes

```text
seed = 8448
trajectory = 1041
opening prefix = 657
RAW root = 9355
```

## Gates verified

- Stage 1 scientific authorization file was absent.
- Stage 1 scientific trigger file was absent.
- development workflow is triggered only by `STAGE_1_TRIGGER.json` on the isolated research branch.
- workflow runs the binding verifier before the scientific runner.
- binding verifier requires one-shot authorization, attempt 1, frozen branch/source binding, and only authorization + trigger changes after the audited source.
- runner checks authorization and one-shot guards before firewall materialization.
- firewall is fully materialized before the first fresh seed read.
- source replay production/independent success and error identities must agree.
- relay-limit source failures are rejected and relay-limit candidate post-states are not promoted.
- Stage 1 output is support/definedness-only; effect values/signs are not retained.
- Stage 2 seed namespace, G3-06 scientific namespaces, G4-10 depth 11 and public AI changes remain outside authorization.

## Evidence access record

```text
fresh Stage 1 scientific seed reads = 0
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI changed = false
scientific outcome generated = false
```

## Post-audit documentation rule

This checkpoint and status synchronization are documentation-only changes made after audit head `bc390876...`. Therefore that head is not used directly as the final execution binding.

Before any Stage 1 scientific authorization is considered, the documentation-inclusive current HEAD must pass one more **final-freeze pre-fresh static audit**. After that final-freeze PASS, no repository change other than the separately reviewed Stage 1 authorization and scientific trigger may be introduced before execution.

This checkpoint does **not** authorize Stage 1 scientific execution.
