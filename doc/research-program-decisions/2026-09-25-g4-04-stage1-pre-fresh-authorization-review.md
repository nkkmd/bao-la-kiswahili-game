# G4-04 / GTTD-STUDY1 — post-Stage0 / pre-fresh Stage 1 authorization review

Date: 2026-09-25  
Research branch: `research/g4-04-geometry-trajectory-transfer`  
Pre-review branch HEAD: `3032f642b6cb7cc406cb03f2db8e7ff83683104b`

## Decision

**`GTTD-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE`**

本判定はfrozen Stage 1 developmentをGitHub Actions上で exactly once 実行することだけを認可する。Stage 2、formal scientific inference、main統合、public AI変更は認可しない。

## Gate review

### PASS — Stage 0

`GTTD-S0-TECHNICAL-2026-09-25-v1`はworkflow run `36082558032` / attempt 1で`STAGE0-PASS`。

```text
artifact ID = 10842846775
artifact ZIP SHA-256 = 947235a9f8bec085382b872e75d7e93e2e6643f44e3dfe1071b681af28eaa985
result JSON SHA-256 = a0b0fcc836c053e163e0bc5acec1d8a993994f54c209046717c1624c48c747a2
deterministic core SHA-256 = 3fb80c3421cbaccdc826d77afc95f0118a9d93a12ed3181dde3a14ce68d1db5d
```

P1/P2の双方でcomplete technical trajectory、全15 checkpoint resource preflight、C1/C2/C3/C5 production-independent exactness、RF1/RF2 technical classificationを確認した。scientific endpoint valueは保存せず、formal inference、Stage 1/2 fresh accessは0。

### PASS — transfer scope is bounded to G4-01 GCLD eligibility

GTTD Study 1のscientific domainはG4-01でGCLD compatibleとなったsource policy P1/P2に限定する。

RF1/RF2はStage 0でtechnical determinismを確認したが、G4-01 GCLD compatibilityがP×RF formal cellsを直接適格化したものではないため、Study 1ではsupport descriptorに限定する。root-family別formal inferenceを行わない。

### PASS — Stage 1 development contract frozen

`prereg/STAGE_1_DEVELOPMENT_SPEC.json`で次を固定した。

```text
seed block = 40413001..40413512 / 512
policy assignment = slot parity / 256 each
candidate target = 16 per policy
minimum fully resource eligible = 12 per policy
measured development = first 8 eligible per policy
15 checkpoints / 32 controls
minimum defined contrasts = 7/8 per endpoint per policy
```

Stage 1はsupport、definedness、production-independent exactness、resource readiness、identity hashesだけを出力できる。trajectory endpoint value、contrast sign、effect direction、effect size、p-value、generalization/counterexample decisionを出力・保存しない。

### PASS — formal Stage 2 contract is prospectively frozen but not authorized

`prereg/STAGE_2_FORMAL_SPEC.json`でholdout designをfresh Stage 1 access前に固定した。

```text
Stage 2 seed block = 40423001..40424024 / 1024 / NOT ACCESSED
formal domains = P1, P2
formal endpoints = C1,C2,C3,C5
fixed tests = 8
formal measured population = 32 per policy
exact two-sided sign test
minimum nonzero = 20
Holm family alpha = 1/20
```

Stage 1 resultを見てtest数、direction、threshold、sample size、multiplicityを変更しない。

### PASS — identity-only upstream firewall

`prereg/UPSTREAM_IDENTITY_FIREWALL.json`をfresh access前に固定した。

- G3-10 Stage 1 repository identity-only file: 24 rows
- G3-10 Stage 2 repository candidate identity file: 48 rows
- G4-01 Stage 1R GCLD immutable recovery source bundle artifact `10517090411`: 384 rows
- G4-01 interrupted GCLD namespace、Stage 1R primary namespace、reserve namespaceを全てseed-levelで除外

G4-01 Stage 1R GCLD bundleではopening-prefix hashが保存されていない。historical seed replayによる救済は行わず、このidentity classについて非重複を主張しない。sourceSeed、full trajectory、checkpoint RAW rootだけを監査・強制する。これはG4-03で採用済みの unavailable-identity handling と同じ境界である。

Stage 1 runtimeは最初のfresh seed readより前に、G3-10 identity fileの固定hashとG4-01 artifactの384-row projection / set digestを再計算し、frozen firewallと完全一致しなければfail closedする。

### PASS — fresh namespace

repository検索上、Stage 1 end `40413512`、Stage 2 end `40424024`に既存予約衝突を認めなかった。

Stage 1 rangeは上記512 slotだけを認可する。seed extensionは禁止する。

### PASS — execution environment

Stage 1はfresh development evidenceを扱うがformal inferenceを行わず、candidate targetは32 trajectories totalである。再現可能なsource-bound execution、immutable artifact、durable one-shot leaseを優先し、本StudyではGitHub Actions exactly once executionを認可する。

実行前に次を別途固定する。

1. runner / helper / engine / specのGit blob binding
2. immutable G4-01 artifact ID/digest
3. workflow source identity
4. one-shot execution lease
5. execution trigger

trigger push以外でscientific executionを開始しない。rerun機能を使わない。

## Authorized access

Exactly one Stage 1 development execution may access:

`40413001..40413512`

No other GTTD fresh seed range is authorized by this review.

## Still prohibited

- Stage 2 `40423001..40424024` fresh access
- Stage 1 endpoint values / contrast signs / p-values / effect directions
- root-family formal subgroup inference
- G3-10 scientific replay
- G4-01 historical seed replay for missing opening-prefix identity
- G3-12 scientific evidence reuse
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- unvalidated symmetry/canonicalization
- public AI change
- `main` integration

## Next gate

Stage 1 exactly-once run完了後、development-only resultとStage 2 identity exclusion materialを保存する。Stage 2は別のpost-Stage1 authorization reviewまで`NOT-AUTHORIZED`のままとする。
