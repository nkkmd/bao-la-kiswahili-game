# PCRPR-STUDY1 — Post-Closure Workflow Archive

Date: 2026-08-29

## Closure state

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seeds 28710001..28713072 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Study = CLOSED
main integration = NOT PERFORMED
```

## Archived workflow blobs

After the terminal scientific decision was fixed, PCRPR executable workflows were replaced on the research branch with notice-only archival stubs. Original executable blobs remain in Git history and the source-freeze records.

```text
pcrpr-stage0-technical.yml
former blob = 0a7c83a0c658aba44633d88b7b3b434ebe7b80c3
canonical run = 33238931893

pcrpr-stage1-preauth-smoke.yml
former blob = 488f03b9e54735c17198272fc8aa3b65578a5767
canonical final smoke run = 33240901637

pcrpr-stage1-resource-preflight.yml
former blob = d870762f06a86d447ad5b8a000cb7c4a7898faac
canonical run = 33240989191

pcrpr-stage1-independent-smoke.yml
former blob = 274ce2d9f4768440712b3833b6a7161fdc7b1202
canonical run = 33241110983

pcrpr-stage1-source-freeze.yml
former blob = 98ab5fc405859eb516d5846cf75a22e9f91e3889
canonical passing run = 33241372471

pcrpr-stage1-development.yml
former blob = 70d7aaeb5234634e8460ab66911d9939cbf742f7
canonical consume-once run = 33241465899
```

No archived workflow performs PCRPR technical/scientific generation, source freezing, verifier replay, or final adjudication. Manual dispatch only displays historical closure information.

## Scientific immutability

Archival conversion occurred only after the Stage 1 block had been consumed and the terminal decision had been determined under the frozen failure semantics. The archive edits do not alter the frozen scientific source blobs, executed workflow history, production artifact, independent job log, or Study decision.
