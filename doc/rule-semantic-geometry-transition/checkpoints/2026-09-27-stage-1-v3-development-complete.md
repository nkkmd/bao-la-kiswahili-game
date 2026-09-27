# G4-08 / BRSGT-STUDY1 — Stage 1 v3 development complete

Date: 2026-09-27

## Disposition

`BRSGT-S1-DEVELOPMENT-2026-09-27-v3` completed successfully as **fresh development / support-only** evidence.

This stage does **not** perform formal inference and does **not** retain contrast values or signs. Its sole scientific role is to determine whether each preregistered event-family × metric slot has sufficient exact-defined support to enter a later independently authorized formal holdout.

## Execution provenance

```text
workflow run = 36303568642
job = 108575705651
attempt = 1
execution HEAD = b59918149fdceac5f619328aa82771abdbfa5994
audited source HEAD = 27f2129d7ed434377c363b1f89534c7cd5cad7fb
binding = STAGE1-V3-BINDING-PASS
artifact ID = 10926322837
artifact ZIP SHA-256 = c93ae26b019edde841e58a4f452aa8bacd45c0954937294ca2c12c786d916140
result SHA-256 = 2fbacc87b88a74c7c06070d8365c9c45ec55e4080c4aa8be55d173457359db4e
identity SHA-256 = 31c8307b2221544fb388db03333959a06ef212d3bdc5322861a1352261b64e40
firewall summary SHA-256 = 4c1556a6f69b0d7ebae3f405697155fb012f443bf757ba804f79cefaacc1868e
```

The byte-exact raw outputs remain in the GitHub Actions artifact. The repository canonical summary/provenance record is:

`results/stage-1-v3/STAGE_1_V3_CANONICAL_RECORD.json`

## Fresh-access accounting

```text
seed block = 40815001..40815512
fresh scientific seed reads = 512
first seed read = 40815001
last seed read = 40815512
identity rows = 512
v1 seed reuse = false
v2 seed reuse = false
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
```

The v3 block is now consumed and may not be rerun or reused.

## Firewall and exact agreement

The firewall completed before the first fresh scientific read.

```text
firewall digest = 6dd29d162df43fc4e36bcb9323aecf30d98cda18e8aeeffa1424c865cd658f7a
seed identities = 9472
trajectory identities = 1041
prefix identities = 657
root identities = 9355
fresh reads before firewall complete = 0
```

Production / independent exact agreement for the retained Stage 1 outputs is `true`.

The artifact SHA manifest was rechecked after download; all four scientific output files matched their recorded SHA-256 digests.

## Candidate and measurement support

Candidate support was available in every event-family × policy cell:

```text
E1 capture: P1 255 / P2 254
E2 nyumba use-vs-stop: P1 234 / P2 248
E3 reserve decrement nontransition: P1 255 / P2 254
E4 Namua→Mtaji: P1 180 / P2 253
```

Each of the eight event-family × policy cells selected exactly 8 measurement units. No preflight rejection reason was emitted for the selected measurement sequence.

```text
measured event units = 64
unique geometry roots = 97
relative depth = 5
representation = RAW-ONLY
production / independent exact agreement = true
```

## Support-only result

The preregistered support family contains 24 slots: 4 event families × 6 geometry metrics.

All 24 slots reached the frozen support threshold:

```text
supported slots = 24 / 24
exact-defined per policy per supported slot = 8
exact-defined combined per supported slot = 16
minimum required per policy = 6
minimum required combined = 12
effect direction used for promotion = false
```

Therefore all 24 slots are classified:

`SUPPORTED-FOR-FORMAL-HOLDOUT`

This is **not** a directional scientific result. Stage 1 neither retained nor inspected the formal contrast sign or magnitude for promotion.

## Interpretation boundary

Stage 1 supports only the following statement:

> Under the frozen fresh-development source policies and exact RAW depth-5 measurement contract, all preregistered G4-08 event-family × metric slots had sufficient exact-defined support to be eligible for a separately preregistered formal holdout.

Stage 1 does **not** establish:

- whether any metric increases or decreases around an event;
- effect magnitude;
- causal effect of capture, nyumba, reserve decrement, or Namua→Mtaji;
- a universal Bao rule-semantic law;
- search strength or public-AI benefit;
- human difficulty;
- any Stage 2 formal confirmation label.

## Next gate

A formal Stage 2 may now be designed because all 24 slots passed the support-only gate. Stage 2 remains **NOT AUTHORIZED**.

Before any Stage 2 fresh seed read, a separate formal preregistration and authorization review must freeze:

1. the Stage 2 fresh seed block and identity firewall;
2. the formal family derived only from the 24 Stage 1 supported slots;
3. event-family-specific inference and multiplicity rules;
4. confirmation / not-confirmed / non-estimable labels;
5. production / independent agreement requirements;
6. resource ceilings and no-rescue boundary;
7. Stage 1 identity exclusions;
8. G4-10, public-AI, and main-integration protections.

No Stage 2 access is authorized by this checkpoint.
