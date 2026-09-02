# BRMGI-STUDY1 — Prospective Study / preregistration freeze

Date: 2026-09-02  
Status: **PROSPECTIVE-FREEZE-COMPLETE / FRESH SCIENTIFIC EVIDENCE NOT AUTHORIZED**

## Formal identity

```text
Program position = Research Generation 3 / G3-06
Study ID = BRMGI-STUDY1
Study baseline main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
program decision = G3-06-AUTHORIZED
```

Formal English title:

**Bao Rule-Mechanism / Geometry Intervention Study 1 — Prospective move-conditioned exact analysis of bounded RAW local game-tree geometry change around capture, nyumba choice, reserve exhaustion, and Namua-to-Mtaji transition events**

正式日本語題目:

**Bao固有のrule-semantic eventに伴う局所ゲーム木幾何変化のprospective move-conditioned exact解析 — capture、nyumba選択、reserve枯渇／Namua→Mtaji移行を対象とするbounded RAW pre/post構造差の検証**

## Frozen Stage IDs

```text
BRMGI-S0-TECHNICAL-2026-09-02-v1
BRMGI-S1-DEVELOPMENT-2026-09-02-v1
BRMGI-S2-FORMAL-2026-09-02-v1
```

## Frozen scientific contract

```text
representation = RAW-ONLY
relative horizon = 5
validated transforms = []
eligible measurement families = LGTGMIV F1..F5
formal event families = E1 capture / E2 nyumba use-vs-stop / E3 reserve-exhaustion Namua-to-Mtaji
formal metrics = M1..M6
Stage 1 candidate universe = 18 event×metric combinations
Stage 1 target = 8 comparable units / event family
Stage 2 target = 12 comparable units / promoted event family
Stage 2 test = exact two-sided sign test + Holm-Bonferroni / FWER 1/20
causal effect authorization = false
```

Machine-readable canonical specification:

`../prereg/STUDY_1_SPEC.json`

Initial machine prereg commit:

`9ab2f7bb79c446df1431175686383271f341edd3`

Human-readable protocol initial commit:

`02d8b8605c913f42c145badd30aafd5fbb1f9538`

## Frozen seed namespaces

```text
technical-only = 31609001..31609008 / scientific use prohibited
Stage 1 = 31610001..31610256 / RESERVED / NOT CONSUMED
Stage 2 = 31620001..31620384 / RESERVED / NOT CONSUMED
```

G3-05 consumed Stage 1 and unused Stage 2 namespaces are not reused.

## Frozen technical-invalid rule

G3-05 partial telemetry is diagnostic-only and is not imported.

The relay-limit failure class is used only as technical risk information. If a required depth-5 reconstruction reaches relay-limit, the fresh Stage fails closed as `TECHNICAL-INVALID`; no root replacement, seed extension or same-evidence repair rerun is permitted.

## Freshness state at freeze

```text
G3-06 fresh scientific evidence generated = false
G3-06 fresh scientific evidence read = false
Stage 1 seed consumed = false
Stage 2 seed consumed = false
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## Authorization boundary

Program authorization permits technical-only Stage 0 work. It does **not** authorize Stage 1 fresh scientific evidence.

Next safe action:

1. materialize Stage 0 technical implementation and fixtures;
2. run non-scientific static audit;
3. bind a separate exactly-one Stage 0 technical authorization to the audited branch state;
4. execute Stage 0 once;
5. only after Stage 0 closure, conduct a separate Stage 1 authorization review.
