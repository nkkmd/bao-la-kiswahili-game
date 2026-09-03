# LGPML-STUDY1 — Reproducibility Index

更新日: 2026-09-03

## Repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 9f6abd3c9b146bb88c11dd04963052300e4cdc3b
research branch = research/g3-08-local-geometry-persistence-memory-length
Study ID = LGPML-STUDY1
current status = PROSPECTIVE-FROZEN / NO FRESH SCIENTIFIC EVIDENCE
```

## Frozen contracts

- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `STUDY_1_PROTOCOL.md`

Blob bindingsはStudy-freeze commit後にStage 0 authorization recordへmaterializeする。

## Upstream bindings

Scientific implementationは次へ別々にbindingする。

- production: `tools/experiments/lib/lgtgmiv-stage1-production.js`
- independent: `tools/experiments/lib/lgtgmiv-stage1-independent.js`
- rule engine: `public/engine.js`

G3-05 / G3-07 scientific result rowsはG3-08 measurement sourceではない。

## Stage namespaces

```text
technical = 31809001..31809008 / scientific use prohibited
Stage 1 = 31810001..31810256 / not consumed
Stage 2 = 31820001..31820384 / not consumed
```

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout = `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`。

Stage 0 execution provenanceはtechnical run完了後に追記する。Stage 1/2は別authorizationまで未実行。
