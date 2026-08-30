# SSGTGE-STUDY1 — Reproducibility Index

更新日: 2026-08-31  
状態: **COMPLETE / TECHNICAL-INVALID / NOT MERGED TO MAIN**

## Canonical identity

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Formal decision = TECHNICAL-INVALID
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Branch = research/g2-12-state-space-game-tree-growth-estimation
canonical selectedEstimator = null
fresh depth 10/11 = not generated / not read
```

## Prospective authorities

- `preregistration/STUDY_START_FREEZE.md`
- `preregistration/STUDY_START_SPEC.json`
- `STUDY_1_PROTOCOL.md`
- `preregistration/STAGE_0_V2_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`

## Upstream immutable evidence

```text
upstream Study = DRSSE-STUDY1
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
G2-05 formal result blob = b25c9f51bdecf95d249df65ddd9b27cd1268d573
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
complete layers = 0..9
cumulative RAW states = 102857
development source summary SHA256 = 04debfa47516d0288d9baf5cf1ff0d761c83c27ada16d9ea43c02be66887659a
```

## Stage 0 v1 — permanently technical-invalid

```text
Stage ID = SSGTGE-S0-TECHNICAL-2026-08-30-v1
implementation freeze = 00b89802c9d40313cc0309bc36f59eecc53899b2
authorization = 76afec9b0ba3d1c5ef84cb42bc3d205360da9b97
run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
disposition = STAGE0-TECHNICAL-INVALID
```

Failure: `SOURCE-HASH-BINDING-MISMATCH`; workflow also lacked `pipefail`. v1 produced no accepted technical result and consumed no real development/holdout outcome. Same-v1 rerun is not authorized.

## Stage 0 v2 — accepted technical PASS

```text
Stage ID = SSGTGE-S0-TECHNICAL-2026-08-30-v2
source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
acceptance commit = e452aaaa10666369daa065d06a6d14abe53ddd6e
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
disposition = STAGE0-TECHNICAL-PASS
```

Canonical Stage 0 v2 files:

- `results/STAGE_0_V2_SOURCE_HASHES.json`
- `authorizations/STAGE_0_V2_TECHNICAL_EXECUTE.json`
- `results/STAGE_0_V2_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-31-stage0-v2-technical-acceptance.md`

Result identities:

```text
artifact STAGE_0_V2_TECHNICAL_RESULT.json SHA256 = 8b3f19a3a182133a46236abc979a11a93f8fd921053aa507333c566b7c5a5923
productionCoreSha256 = 6cc54143124c80e3cc4e2f4653b13840706a112ef6dfbcad5a81cba973848426
independent resultCoreSha256 = f7bbd991ad61befc24d8164b90ae1e8fd8c254454a2fe96469013e1d1c898b5a
```

Technical replay target:

```text
depth = 2
cumulative RAW states = 19
depth-labelled legal edges = 18
cumulative tree occurrences = 19
RAW-state-set SHA256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
```

## Stage 1 — technical-invalid

Source/spec freeze:

```text
3d93b6cb228bc314819495e89c1521859bf258b6
```

Separate execution authorization:

```text
bba6d55b1a22e403976ced5ef05ed5b9d3c99f6e
```

Frozen source blobs:

```text
ssgtge-production.js = 71bc8a45d45df171edfde5d4882529c4a7e057fd
ssgtge-independent.js = cf462806552e038e4c23d0eb1cdf0cb211187472
run-ssgtge-stage1-development.js = ad2c60428bb098d0a7328ed99dfb61a5c730e732
verify-ssgtge-stage1-independent.js = eed18650da2b6eb652cba97f7a714d7d6968d485
ssgtge-stage1-development.yml = 45c50148e998011e876ec80830638e55e49c8c15
STAGE_1_DEVELOPMENT_SPEC.json = f79d38637fd22e99419da26f4044783d471ef79f
```

Execution provenance:

```text
run = 33324107667
job = 99291109199
artifact = 9735723141
artifact size = 4267 bytes
artifact ZIP SHA256 = 7b415b0fad9cadf92568d0b1103b44d9325d8b4c2a729edb40cb1f673e3af09f
workflow conclusion = failure
```

Artifact file identities:

```text
stage1-production-result.json SHA256 = 673045090bd15eda1d27b46e413f506c685aef37f91fffc4f63a60458804a8e0
production log SHA256 = dfd0e9775c7868e9d32eab0a8fef5081741cda35cd5aa9f9258735a9ad9dc8dc
independent log SHA256 = 8004aa24b1271d22cf707769e09a46847439bbea5dc292c33150d597d268cc4b
productionCoreSha256 = 0dde91343fd7ff1c7736eda2629d4c0f1c04c32b7aad0afee5613e6432cba194
```

Production-only candidate summaries:

```text
E1: max=0.2813333110915206 mean=0.21758046269506714 eligible=false
E2: max=0.07917793679237395 mean=0.027282797524651126 eligible=true
E3: max=0.1129709359542721 mean=0.036062220843277815 eligible=true
production proposed winner = E2-LOG-QUADRATIC-D2PLUS
```

These are **not** canonical estimator-selection evidence because independent verification failed.

Mandatory independent failure:

```text
prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
frozen relative tolerance = 1e-12
independent exit = 1
```

Canonical closure files:

- `results/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-08-31-stage1-technical-invalid.md`

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
canonical selectedEstimator = null
same Stage 1 evidence rerun = not authorized
```

## Stage 2

```text
Stage ID = SSGTGE-S2-FORMAL-2026-08-30-v1
status = NOT-AUTHORIZED-NOT-EXECUTED
fresh depth 10 = not generated / not read
fresh depth 11 = not generated / not read
```

No Stage 2 source freeze or execution authorization was issued.

## Study closure

Study-local closure commit:

```text
4f63d615ef25702d99881aedf4a4054fbe7c275b
```

Canonical final files:

- `STUDY_1_FINAL_REPORT.md`
- `results/STUDY_1_FINAL_RESULT.json`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`

```text
formal decision = TECHNICAL-INVALID
selectedEstimator = null
```

The production-only E2 proposal is retained only as diagnostic provenance and must not be used as the formal Stage 2 estimator within this Study.

## Central documentation synchronization provenance

The four central documents were synchronized only on the G2-12 research branch after Study-local closure. The machine-readable synchronization authorization explicitly set `mainIntegrationAuthorized=false`.

```text
authorization path = authorizations/CENTRAL_DOC_SYNC_EXECUTE.json
authorization commit = 57c813726e72486f38f3da86216523afbccdafd7
workflow run = 33339370675
job = 99332085365
workflow conclusion = success
central-doc sync commit = f69e4a7912e39bfd424969e5cd220ac36baa5d15
```

Synchronized files:

```text
README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md
```

Direct post-sync inspection confirmed the G2-12 `TECHNICAL-INVALID` closure, `selectedEstimator=null`, Stage 2 not authorized, and fresh depth 10/11 untouched. The one-time write-capable helper files were subsequently removed:

```text
.github/workflows/ssgtge-central-doc-sync.yml removal = 9651f62c8f07605800b6a9103d9d6966c389870d
tools/maintenance/sync-g2-12-central-docs.js removal = 8ef6b0329d386db48c729ea5017cfe6f4e21eb10
```

The authorization record remains as provenance only; its triggering workflow no longer exists.

G2-05 remains unchanged; G2-11 remains `NOT-AUTHORIZED`. A corrected attempt requires a new prospective Study or explicit new version. `main` has not been integrated or modified by this closure work.
