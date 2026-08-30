# PSRRE-STUDY1 — 再現性索引

## 1. Study baseline

```text
Repository = nkkmd/bao-la-kiswahili-game
Baseline remote main = 3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
Research branch = research/pre-g2-11-strategic-regime-representation-eligibility
Study ID = PSRRE-STUDY1
```

## 2. program / upstream binding

- `doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md`
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/DOCUMENTATION_LANGUAGE_POLICY.md`
- `doc/unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json`

G2-10 closureはimmutable historical provenanceとしてのみ参照する。

## 3. prospective contract

- `STUDY_1_PROTOCOL.md`
- `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
- `prereg/STUDY_1_INITIAL_CONTRACT.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `DECISION_REGISTER.md`
- `CURRENT_STATUS.md`
- `RESEARCH_LOG.md`

## 4. RAW identity

```text
included fields = pits,reserve,houseOwned,player,phase,winner,pending
excluded fields = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## 5. seed registry

```text
29500001..29500064 = PSRRE Stage 0 technical-only
29510001..29514096 = PSRRE Stage 1 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
29610001..29618192 = PSRRE Stage 2 scientific RESERVED_UNCONSUMED / NOT AUTHORIZED
```

G2-10 blocks `29310001..29314096`および`29410001..29418192`は本Studyで使用しない。

## 6. Stage 0 source / authorization provenance

```text
source freeze commit = 724e05ef6a730593aab2f9165a0d02216e372c6d
authorization commit = 2c1dea4f7f5c98497333d9ec325931e9091ba0df
workflow run = 33304155488
workflow job = 99237601518
artifact id = 9729904359
artifact ZIP SHA-256 = d861bc27c9fb273ac2d6f4c227bdaf9c01bd4d6e33c8ae2ca3370a836e357977
```

repo-facing result:

- `results/STAGE_0_TECHNICAL_CLOSURE_RESULT.json`
- `results/STAGE_0_SOURCE_HASHES.json`
- `checkpoints/2026-08-30-stage0-technical-pass.md`

artifact内部file hash:

```text
stage0-result.json = 0d5b831b753ebef4122bd2029f3639e68f19a707232f1ccdc078a5ee853cfb68
technical-family-output.json = 8ec1eacf1c506756cb6d63486153b137399460ad060ea28b97491dda80f24c5b
source-hashes.json = 6c89bc7c4b56d01efad6a47f72ceb72bd2836d6cde4eee2bad60a2414bd88f0b
```

Stage 0正式dispositionは`STAGE0-TECHNICAL-PASS`である。

## 7. production / independent分離

Stage 0 independent moduleはStudy-specific production moduleをimportしない。authoritative engine / rule semanticsは共有するが、RAW key、observable、robust scaling、PCA、Ward、PAM、assignment、serializationを別実装で再構築した。

18 mandatory gateはfailure 0 / missing 0だった。

## 8. Stage 0で確認していないもの

Stage 0では次をscientific outcomeとして確認していない。

- representation support
- silhouette
- assignment stability
- long-horizon transition structure
- G2-11 outcome
- human strategic salience
- game-theoretic truth

3 familyのtechnical PASSはscientific優劣を意味しない。

## 9. 今後のprovenance空欄

```text
Stage 1 prefreeze commit = null
Stage 1 authorization commit = null
Stage 1 workflow run = null
Stage 1 scientific result hash = null
Stage 2 authorization commit = null
Stage 2 workflow run = null
Stage 2 scientific result hash = null
frozen representation artifact hash = null
G2-11 input authorization = false
```

Stage 1 scientific seedを消費する前に、feature dictionary、family hyperparameter / selection rule、numeric thresholds、Stage 2 held-out contractを新たに固定する。
