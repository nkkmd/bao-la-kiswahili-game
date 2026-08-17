# Tactical Motif Human / Expert Validation Study 1

## 研究題目

**Baoにおけるmachine-confirmed tactical motifのHuman / Expert Validation — TM-S2-C03は人間の熟練者にも手筋として認識されるか**

## 状態

**STAGE 1 EXACT FORMAL MACHINE STIMULI FROZEN / HUMAN DATA COLLECTION NOT STARTED**

- repository baseline: `main` `3cc40d83917660dd815c785ff0e0c754666d9a0e`
- study branch: `research/tactical-motif-human-validation`
- Stage 0 ID: `TMHV-S0-DESIGN-2026-08-16-v1`
- Stage 1 ID: `TMHV-S1-STIMULUS-2026-08-17-v1`
- Stage 1 spec SHA-256: `c0dcff68255e1e1149d9c96c76fe0e7e8aa7ba8da32abd149077b6936772fd80`
- Stage 1 authorization SHA-256: `d91efea5995ef6ae19996053cc1fc41c7ce7c95b132bd3b1368405abb5dda009`
- Stage 1 pool hash: `6e36f9b23d489138979047c54e6ef83b8839efec3b4a4ecc9430645bfb4849b1`
- formal freeze ID: `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`
- private formal freeze SHA-256: `2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`
- human recruitment: **NOT AUTHORIZED**
- human scientific data collection: **NOT STARTED / NOT AUTHORIZED**
- Stage 2 formal preregistration: **NOT YET FROZEN**

## 研究目的

Tactical Motifs / Tesuji Study 1でformalに確認された`TM-S2-C03`について、Baoの熟練者が異なるopening / trajectory由来の局面を、同じ再利用可能なmove principleとして認識するかをprospectiveに検証する。

この研究はC03を「人間にも手筋だと認めさせる」研究ではない。negative / null / heterogeneous / inconclusive resultを完全に許容する。

## Immutable historical machine evidence

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

C03 frozen machine definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Canonical Stage 1 rank: `5`  
Canonical candidate key: `7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`

Historical machine confirmation never changes because of this study's later human result.

## Evidence layers

1. `machine-confirmed tactical motif` — historical / immutable
2. `human-recognized transferable tactical motif` — 本研究の中心
3. `expert-recognized tesuji` — label-based secondary construct
4. `traditional tesuji` — 本研究では判定しない
5. `pedagogically useful tesuji` — 本研究では判定しない

## Confirmatory center

Primary constructは**blinded cross-position principle discrimination**。

Formal primary block:

```text
C03 target A
C03 target B
matched non-C03 control
```

回答者は「同じ再利用可能なmove principleを共有する」と考える2局面を選ぶ。3つのpair候補があるためrandom-choice probabilityは`1/3`。

単一局面でのmove choiceはsecondary。

## Stage 1 machine result

Frozen population:

```text
games = 1536
seeds = 22100001..22101536
six generation strata x 256
first 8 plies = seeded-uniform exact E.moveVariants
max ply = 100
no extension / no replacement
```

Generation/verification:

```text
games generated = 1536 / 1536
fullSearchRecomputation = true
mismatchCount = 0
uniqueHistoricalTrajectories = 1453
distinctOpeningPrefixes = 1278
```

Stimulus classes:

```text
C03_TARGET = 687
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

Matched controls:

```text
P_ONLY     = 277
M_ONLY     = 605
MORPH_NEAR = 672
```

All ten prospective readiness gates passed. Machine conclusion:

`MACHINE STIMULUS POOL READY`

## Compact artifact audit

Bundle SHA-256:

`88918bf56e2e4e58875b014ab47da71b69756121c6c6dfa8ea76348400c16f3c`

The four compact artifact hashes are recorded in `STAGE_1_ARTIFACT_AUDIT.json`. Independent checks found no same-trajectory/opening-prefix matching violations, no within-family target/control reuse, no cost violations above the frozen maximum, and no participant-facing hidden-cue leakage detected by the audit.

## Exact formal stimulus freeze

The deterministic freezer has now been executed against the exact hash-frozen Stage 1 artifacts.

Cryptographic commitments:

```text
selection spec SHA-256 = 67384b96b14551eb80d83d26f798f396e52098712d533b0e2e88131bc69d3df5
private freeze SHA-256 = 2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22
public audit SHA-256   = e994ddeb2875831a7a79e1181aa2bbbb39658316ebffcf896c7953265cdd70b3
```

Frozen machine stimulus set:

```text
primary blocks              = 12
primary C03 targets         = 24
primary controls            = 12
control balance             = P_ONLY 4 / M_ONLY 4 / MORPH_NEAR 4
secondary C03 move-choice   = 6
total unique formal states  = 42
```

All 42 positions are unique by rule state, historical trajectory, and opening prefix. Exact selected board states and participant SVGs remain private in the gitignored local freeze artifact; public Git contains only the deterministic rule, SHA-256 commitment, aggregate counts, and constraint audit.

Observed aggregate generation-condition provenance is `LS-D2=10`, `LE-D2=10`, `B-D1=10`, `V2-D2=10`, `B-D2=1`, `B-D3=1`. Primary generation-condition balance was not a prospectively frozen gate, so this distribution is preserved without post hoc rebalancing or substitution.

Stage 1 machine/instrument conclusion:

`EXACT FORMAL MACHINE STIMULI FROZEN`

## Stage構成

- **Stage 0** — repository / construct / feasibility / ethics / statistics audit。**COMPLETE**。
- **Stage 1** — fresh machine pool、verification、matching、renderer、artifact audit、exact formal machine stimulus freeze。**COMPLETE**。
- **Stage 2** — ethics/recruitment/language/data-governance gatesとparticipant/stimulus/endpoint/test/exclusion/stopping/no-rescueをmachine-readableにfreezeした後にのみformal human data collection。**BLOCKED / PRE-COLLECTION**。

## 最初に読む

- `CURRENT_STATUS.md`
- `RESEARCH_PLAN.md`
- `STAGE_1_STIMULUS_PROTOCOL.md`
- `STAGE_1_FORMAL_STIMULUS_FREEZE_PROTOCOL.md`
- `STAGE_1_ARTIFACT_AUDIT.json`
- `STAGE_1_FORMAL_STIMULUS_FREEZE_AUDIT.json`
- `EXPERT_ELIGIBILITY.md`
- `STIMULUS_AND_BLINDING_PLAN.md`
- `STATISTICAL_ANALYSIS_PLAN.md`
- `ETHICS_AND_DATA_GOVERNANCE.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`

Machine-readable contracts:

- `preregistration/STAGE_0_DESIGN_BOUNDARY.json`
- `preregistration/STAGE_1_STIMULUS_SPEC.json`
- `preregistration/STAGE_1_STIMULUS_AUTHORIZATION.json`
- `preregistration/STAGE_1_FORMAL_STIMULUS_FREEZE_SPEC.json`

## Data boundary

個人識別可能なparticipant data、contact information、raw free textはpublic GitHubへcommitしない。formal exact stimulus identitiesもpre-collection contaminationを避けるためprivate local artifactとして保持し、公開側にはcryptographic commitmentのみ残す。
