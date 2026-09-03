# SILGM-STUDY1 — Reproducibility Index

更新日: 2026-09-03

## 1. Repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
review baseline remote main = 9e6ca03bbb36919b2fbf32d61639779c17b04932
Study baseline remote main = ba48c5c3643649655137d5d3c07988fdc84bee9d
research branch = research/g3-07-search-instability-local-geometry-mechanism
Study ID = SILGM-STUDY1
Study status = CLOSED / FORMAL-COMPLETE
main integration = COMPLETE / FAST-FORWARD / source branch tip 7f14538aa0ec3edd2045649025715219ffea17ec
```

## 2. Canonical Study contracts

| Artifact | Git blob |
|---|---|
| `prereg/STUDY_1_SPEC.json` | `04eeba3f536df846b66282b574009df06490a0bb` |
| `STUDY_1_PROTOCOL.md` | `5ec69dffd20568aebcbe5c33315a7e6fa8d96abc` |
| `prereg/STAGE_1_DEVELOPMENT_SPEC.json` | `6eaa28f7f95f26db27aad56f43c8a511b6af29a0` |
| `prereg/STAGE_2_FORMAL_SPEC.json` | `78ef5d4f2cbda65470e300d1651b9866bf5ea7e8` |
| `prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json` | `3c9c67def9925df85b14287ef4fd931f099dca2a` |
| `prereg/STAGE_2_FORMAL_INPUT.json` | `70c7d841cf71183e6733565bf36a76e4a62047d4` |
| `prereg/UPSTREAM_IDENTITY_FIREWALL.json` | `c1878ccd0739aacc7a0158e541e6e153723fef8e` |

Stage 2 formal input core:

`6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0`

## 3. Frozen upstream source bindings

```text
public/engine.js = Git blob 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = Git blob 8d472be415fac17e47a8e5e667cea9672e7a9ef5
tools/experiments/lib/lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
tools/experiments/lib/lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
tools/experiments/lib/search-reliability-decision-robustness.js = f3a6951fe711db62e164910cfb248a9cbc2cac1a
tools/experiments/verify-search-reliability-stage2-independent.js = 18b756f019902b80da2383ced1d148f4fe5d0760
```

The G2-02 sources are technical precedent/bindings only. G2-02 scientific rows and conclusions are not reused.

## 4. Geometry and search contract

```text
representation = RAW-only
relative geometry depth = 5
validated transforms = []
geometry metrics = G1..G5
search conditions = D2_Q1, D3_Q1, B256_Q1_MAXD3, B1024_Q1_MAXD3, D2_Q0, D2_Q2
peer contrasts = SC1 depth, SC2 node budget, SC3 quiescence
endpoints = E1..E5
score tie tolerance = exact zero
canonical best = deterministic TopSet representative only
```

No search condition is a truth/reference oracle.

## 5. Stage 0

Final technical version:

```text
Stage ID = SILGM-S0-TECHNICAL-2026-09-03-v4
trigger commit = 422acd162877daceacac4189e0edcef266480c2d
workflow run = 33709314157
job = 100505215270
lease artifact = 9876354259
lease ZIP SHA-256 = 2a06fcfdcb56f92e84538dc27815e5cfe39a3f0f2ad8bc67532ee888c040ccbb
result artifact = 9876361267
result ZIP SHA-256 = 2da957aa86e149a55783246280adccbe4e3e5b458db6cec4eeda63f589326975
canonical result SHA-256 = c33f3979f068879913123447c66ae2d81146724d87db2b5f72f021bbe36348c8
deterministic core = fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076
disposition = STAGE0-PASS
```

Earlier v1/v2/v3 failures are retained as technical provenance and were not rerun as the same version/trigger.

## 6. Stage 1

```text
Stage ID = SILGM-S1-DEVELOPMENT-2026-09-03-v1
seed block = 31710001..31710256
selected = 24 Namua + 24 Mtaji
trigger commit = 487a8a760f47862a24d2dd22abc1c20276221a6e
authorization commit = bb6e1ebe7cd3b1ff4c0b391c0a716617a0d9faa2
tooling commit = 11d7b29234f5eddfd30fa85821efaf4ac1e4ce15
authorization nonce = SILGM-S1-AUTH-2026-09-03-V1-01
workflow run = 33714665861
job = 100521197935
lease artifact = 9878071217
lease ZIP SHA-256 = 1266666a9c3583a38def48d5df8734e0dcc8a1cf0a0e7e53435d75e850db7888
result artifact = 9878178694
result ZIP SHA-256 = e6908832c5617cc3a015996d2ea59cee1ba247a6078b64cd408d85697d1fdc03
canonical scientific-result SHA-256 = 20209db1b87bdf3e87f48f1968014154d6f2862820eabea40be645cd1f924470
selection core = 06a230341ea10fd20b60739061067240dd5696f155b2a25e3004619ffb27903c
measurement core = 713c11f110f04f8bb82fd8dbde0873c4114728615383dcd701f0d10be7b60288
development core = 3017dbf4cf10736a8c9a5b923e0422a3e46867f06dd7a74c4545f684166567b7
scientific core = e347099b3506f323351066ccc589942101fa48b1d8e0293dbf8a614f0063f74a
disposition = STAGE1-PASS
promoted candidates = 8
```

Repository compact record:

- `results/stage-1/STAGE_1_RESULT_SUMMARY.json`

## 7. Stage 2 input firewall

Input materialization v2:

```text
workflow run = 33716060972
artifact ID = 9878546389
artifact ZIP SHA-256 = 26bb6355a589fe4d47efc6a2a111dc112f35cc95e114e1145f5f7fea8a578b97
formal input core = 6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0
promoted candidate identities = 8
Stage 1 identity exclusions = 48
Stage 2 fresh seed access = false
protected depth-10 access = false
```

Input materialization v1 failed before Stage 2 seed access due to gzip transport encoding and is retained as control-plane provenance. No same-trigger rerun was used.

## 8. Stage 2 preauthorization

```text
workflow run = 33716437350
artifact ID = 9878673914
artifact ZIP SHA-256 = 2fbcbf0cf2b3241e918a4f3fb31314b5f397cc246075b845a2942dddaed6782b
audit JSON SHA-256 = 318e709fa1e05579c422a9111da3ca925d32824819bcad72a30ee321123ec0bd
audit Git blob = 061e279157b58eb214b31bb82e86daf010bf7670
disposition = STAGE2-PREAUTH-STATIC-AUDIT-PASS
Stage 2 fresh seed access = false
protected depth-10 access = false
```

The audit checked 17 frozen bindings, 8 promoted candidate identities, 48 Stage-1 exclusions, production/independent separation, exact-test/Holm contract, resource ceilings and unarmed fail-closed behavior.

## 9. Stage 2 formal execution

```text
Stage ID = SILGM-S2-FORMAL-2026-09-03-v1
seed block = 31720001..31720384
selected = 36 Namua + 36 Mtaji
authorization review commit = 49a5bf7aa33e69c20ed79cf64a0d18eca628426a
scientific tooling commit = ba35c4ad817795158424f577c51c1e689b1d29d8
machine authorization commit = db439ed6ba74184b5f522c32116259ecbf76a005
execution trigger commit = 872da6b0507b91845516ca54da0da8058844d893
authorization nonce = SILGM-S2-AUTH-2026-09-03-V1-01
workflow run = 33716884975
job = 100527827048
lease artifact = 9878826404
lease ZIP SHA-256 = 28a365ea1736d4924131f51b507547ffeea25c1396c35031cffaae145fea578c
result artifact = 9879091983
result ZIP SHA-256 = 5ada1dcb0ceab7d89ea0bfc78410a14c3875ba03a01e31a243950706349de70a
canonical scientific-result bytes = 733559
canonical scientific-result SHA-256 = 05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9
selection SHA-256 = c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89
measurement core = 525efb5fff335bf22b0cf1a6f52e2944958055449bc80457af03c0e385c7ead5
formal core = 91d02434fbe6ba19784e4ef0d0c4099d54821a969b8ada8ac23d883d6712deda
scientific core = 2355969853b4e4d7faea063cee828f9713f94c38d8e0fed68386638717184849
disposition = STAGE2-PASS
```

Repository compact records:

- `results/stage-2/STAGE_2_RESULT_SUMMARY.json`
- `results/stage-2/telemetry.json`
- `results/stage-2/execution-summary.json`

The durable GitHub Actions result artifact is the canonical full-row evidence record. The repository summary preserves all formal candidate labels, exact p-values, support counts and core hashes without duplicating full measurement rows.

## 10. Formal candidate record

```text
8 promoted
7 estimable
3 CONFIRMED
4 NOT-CONFIRMED
1 NON-ESTIMABLE
```

Confirmed candidate keys:

1. `SILGM-SC1-DEPTH|SILGM-E3-RANKING-PREORDER-CHANGE|SILGM-G1-ROOT-LEGAL-WIDTH|HIGHER-IN-HIGH`
2. `SILGM-SC2-NODE-BUDGET|SILGM-E3-RANKING-PREORDER-CHANGE|SILGM-G1-ROOT-LEGAL-WIDTH|HIGHER-IN-HIGH`
3. `SILGM-SC3-QUIESCENCE|SILGM-E3-RANKING-PREORDER-CHANGE|SILGM-G1-ROOT-LEGAL-WIDTH|HIGHER-IN-HIGH`

Exact candidate-level values are in `results/stage-2/STAGE_2_RESULT_SUMMARY.json` and `STUDY_1_FINAL_REPORT.md`.

## 11. Execution integrity

```text
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 2 authorized scientific executions = 1
Stage 2 actual scientific executions = 1
same-evidence scientific reruns after fresh access = 0
Stage 1 seed extension = 0
Stage 2 seed extension = 0
```

## 12. Protected evidence

Standard initial RAW-root complete exact depth-10 holdout:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

No Stage of SILGM-STUDY1 used it for measurement, selection, debugging, resource probing or interpretation.

## 13. Interpretation and reuse boundary

Reproduction or downstream reuse must preserve these restrictions:

- no validated transforms or canonical quotient;
- no use of deeper/larger search as truth;
- no causal interpretation of `Mechanism`;
- no objective-best/game-theoretic/human-difficulty interpretation;
- no rescue of NOT-CONFIRMED or NON-ESTIMABLE candidates;
- no same-evidence rerun;
- protected depth-10 remains sealed;
- any new validation must be a separately authorized prospective Study/version.

## 14. Main integration boundary

Study closure itself did not authorize main integration. A later explicit user instruction did authorize it, and fast-forward integration from research branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` completed on 2026-09-03. The research branch remains available for provenance.
