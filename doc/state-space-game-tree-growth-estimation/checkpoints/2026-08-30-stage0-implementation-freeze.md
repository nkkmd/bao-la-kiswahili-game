# G2-12 Stage 0 implementation freeze

Date: 2026-08-30
Study: `SSGTGE-STUDY1`
Stage: `SSGTGE-S0-TECHNICAL-2026-08-30-v1`
Status: **FROZEN BEFORE STAGE 0 TECHNICAL OUTPUT**

## Purpose

Stage 0のtechnical-only実装を、実行結果を見る前に固定する。Stage 0は科学的growth resultを生成しない。

## Scientific firewall

Stage 0で許可するのは次のみ。

- standard initial RAW rootからdepth 2までのtechnical exact-enumeration fixture
- G2-05 `DRSSE-STUDY1` depth 0..9 formal resultのschema / per-depth plumbingのread-only確認
- synthetic growth seriesを用いた3 estimator familyの数値実装確認
- production / independent実装のcross-check
- deterministic serialization / hashing
- resource-stop mapping
- corruption / leakage negative controls
- artifact packaging

Stage 0では次を明示的に禁止する。

```text
fresh depth 10 generation
fresh depth 11 generation
G2-05 real depth 0..9 series上のcandidate ranking
Stage 1 winner selection
uncertainty envelope calibration on real development performance
formal validation metric evaluation
scientific inference
```

## Technical enumeration boundary

```text
maximum technical enumeration depth = 2
expected cumulative RAW states = 19
expected depth-labelled legal edges = 18
representation = RAW-ONLY
validated transform set = []
canonicalization = false
symmetry reduction = false
```

The depth-2 fixture uses the existing G2-05 production / independent enumeration implementations only as a technical positive fixture. Their reuse does not extend the G2-05 scientific claim and does not authorize their later use as an unreviewed G2-12 formal estimator implementation.

## New estimator implementations

Production and independent growth-estimator paths are separately implemented:

```text
tools/experiments/lib/ssgtge-production.js
tools/experiments/lib/ssgtge-independent.js
```

The production quadratic regression uses deterministic Gaussian elimination on normal equations. The independent implementation uses a separately coded centered linear regression and Cramer's-rule quadratic solve. Stage 0 cross-implementation numeric agreement is prospectively fixed at relative tolerance `1e-12`; estimator-family correctness is tested on synthetic series only.

## Source identities

Machine-readable source identity:

`results/STAGE_0_SOURCE_HASHES.json`

Frozen new-source SHA256 values:

```text
ssgtge-production.js = d2e76e782c9b497cf5d9dfebb96df0addba397162968a378af48314e52e7f84c
ssgtge-independent.js = d0379f63faffdf9ca2ac6bf37517385cea1574a2a609ef04438845a6211d5725
run-ssgtge-stage0-technical.js = eb60045ae6c8988c9ceb492d40d495792045ed11c7b347a8336a0046dd234025
verify-ssgtge-stage0-independent.js = 29ac9f639a8c5ce7dc5ca2fdc4affc1fe5826d7fd4e3a38a2d6dc0eaa2634856
ssgtge-stage0-technical.yml = e51b12eccb522ab23abb9bc6ef5a98256099d08304ae847235127c4b09c09f6d
STAGE_0_TECHNICAL_SPEC.json = 9fc85c30c86d96b2bc5b461441392e1732274d2a2bccdfc9f065cd3cab2f21b9
```

Technical dependency Git blobs are also recorded in `results/STAGE_0_SOURCE_HASHES.json`.

## Execution protocol

This implementation-freeze commit itself must not execute Stage 0. A separate commit must add:

`authorizations/STAGE_0_TECHNICAL_EXECUTE.json`

The Stage 0 workflow is triggered only by that path. The authorization must bind this implementation-freeze commit as its immediate parent and must retain:

```text
scientificInferenceAuthorized = false
freshDepth10Or11GenerationAuthorized = false
```

A Stage 0 PASS authorizes only consideration of Stage 1 preparation. It does not authorize Stage 1 execution and never authorizes Stage 2.
