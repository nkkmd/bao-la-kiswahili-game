# G2-01 Stage 2 formal `INCONCLUSIVE` closure checkpoint

Date: 2026-08-27
Study: `PEOCR-STUDY1`
Stage: `PEOCR-S2-FORMAL-2026-08-26-v1`

```text
workflow run = 33038132423
source authorization commit = 5d1b4a40ef95ac639787aa0abf040a455c3c2995
games = 8192 / 8192
seeds = 24020001..24028192
execution = 8 fixed contiguous shards x 1024
all shard independent replay = PASS
merge/select/measure independent verification = PASS
Stage 1 overlap = trajectory 0 / opening 0 / RAW state 0
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

Failed exactly three frozen gates:

```text
3898 < 4500 unique historical trajectories after Stage 1 firewall
3570 < 4000 selected unique RAW states
1747 < 1750 Mtaji selected states
```

No near-miss exception exists. No extension, replacement, threshold relaxation, refit, subgroup rescue, or alternate primary was used.

```text
formalDecision = INCONCLUSIVE
primary = null
```

Artifact identity:

```text
formal artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
generation manifest SHA-256 = 1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411
selection/measurement summary SHA-256 = 3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45
verification SHA-256 = 48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da
formal result SHA-256 = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
```

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE` remains immutable. Public-AI engineering is outside the scientific decision.
