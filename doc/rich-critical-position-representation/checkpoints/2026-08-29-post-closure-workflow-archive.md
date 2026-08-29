# RCPR-STUDY1 post-closure workflow archive

Date: 2026-08-29  
Study: `RCPR-STUDY1`  
Scientific status: **CLOSED AT STAGE 1 / `STAGE1-TECHNICAL-INVALID` / STAGE 2 `NOT-AUTHORIZED-NOT-EXECUTED`**

After canonical scientific closure and central-document integration, the executable G2-06 technical/development/materialization workflows were replaced by archival `workflow_dispatch` stubs. This is administrative hardening only. It does not alter the frozen scientific source commit, consumed Stage 1 evidence, canonical artifacts, final decision, or interpretation boundary.

Former executable workflow blobs preserved in Git history:

```text
.github/workflows/rcpr-stage0-technical.yml = 680049f0e07a4bfdb90324ffe1bdab8047596c75
.github/workflows/rcpr-stage1-development.yml = 9216c0614cae5638ef8eb20d99a1e0341e4c8fe0
.github/workflows/rcpr-stage1-implementation-smoke.yml = d7d10fb1f4d1ec28e68a496133c1bc3fe4cc1c79
.github/workflows/rcpr-stage1-resource-preflight.yml = 52319e8f12996c91217b9cddd1b7d39557bf3bf7
.github/workflows/rcpr-stage1-source-freeze-audit.yml = 9b024a55c993c3a1858a122d9974928afaca9000
.github/workflows/rcpr-central-docs-materialize.yml = bb66fdd01d6d15ca9c5498c8ccafd54caeec202c
```

Current archival-stub blobs:

```text
.github/workflows/rcpr-stage0-technical.yml = f3de3691911f1e546531ecb2a22287e3bc0e5143
.github/workflows/rcpr-stage1-development.yml = 6be2b718324b080a5d2d2cd23cd3efa8e3a0a1fb
.github/workflows/rcpr-stage1-implementation-smoke.yml = 8ebb8a5d4f0b9877590e8ff575fbbe269fe2b856
.github/workflows/rcpr-stage1-resource-preflight.yml = 6d2db6225d7b0eee4e872c02d3433ff07616df76
.github/workflows/rcpr-stage1-source-freeze-audit.yml = b17b86768deb8f9c2fbf2a2440741a240e134609
.github/workflows/rcpr-central-docs-materialize.yml = 7becd219afa2320c5b37ba3260015f0140983c7a
```

Canonical executed lineage remains:

```text
Stage 0 technical run = 33179301221 / artifact = 9688987798
Stage 1 implementation smoke run = 33195723195 / artifact = 9695647002
Stage 1 resource preflight run = 33195349152 / artifact = 9695494212
Stage 1 source-freeze audit run = 33196797865 / artifact = 9696075216
Stage 1 consume-once scientific run = 33196954082 / production artifact = 9704250489 / verification artifact = 9708956844
central-doc first administrative attempt = 33235620735 / failed before commit on whitespace validation only
central-doc successful run = 33235667801
central-doc integration commit = 61513669232ab79b245927087e065b3bb3dcdf6d
```

The exact Stage 1 scientific executable source remains bound to scientific source commit `a69ffce86cb278680ee676a2a9469aeb1d9ab1d4`, source-freeze audit, `authorizations/STAGE_1_EXECUTE.json`, Git history, and `REPRODUCIBILITY_INDEX.md`.

No further RCPR-STUDY1 Stage 0, Stage 1, source-freeze, resource, smoke, scientific evidence, or automatic central-document generation/materialization execution is authorized. The archival stubs may be manually invoked only to display the closed-workflow notice and do not execute scientific or materialization code.
