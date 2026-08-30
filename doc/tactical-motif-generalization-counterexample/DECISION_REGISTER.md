# DECISION REGISTER

更新日: 2026-08-30

## TMGC-D001 — Baseline

remote `main` SHA `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`をG2-09開始baselineとして固定した。

## TMGC-D002 — Study identity

Study IDを`TMGC-STUDY1`、Research Generation slotを`G2-09`としてprospectively固定した。

## TMGC-D003 — Stage identity

- `TMGC-S0-TECHNICAL-2026-08-30-v1`
- `TMGC-S1-DEVELOPMENT-2026-08-30-v1`
- `TMGC-S2-FORMAL-2026-08-30-v1`

をscientific outcome前に固定した。

## TMGC-D004 — Upstream decisions are immutable

`TM-S2-C03 = CONFIRMED`、`TM-S2-C01/C02/C04 = NOT-CONFIRMED`を変更・救済・再定義しない。Human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`もmachine evidenceで補完しない。

## TMGC-D005 — State identity

RAW identityのみをauthoritativeとし、`pits/reserve/houseOwned/player/phase/winner/pending`を含め、`turn/reason`を除外する。validated transform setは空、canonicalization/symmetry reductionは禁止する。

## TMGC-D006 — Exact C03 is Mtaji-specific

C03 exactはMtaji back-row takata constructであり、Namuaへphase-only transportできない。direct Namua transportは`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`で、scientific counterexampleには数えない。

## TMGC-D007 — Scientific seed reservation

Stage 1 `29110001..29114096`、Stage 2 `29210001..29218192`をG2-09専用として予約した。

## TMGC-D008 — Development / confirmation firewall

Stage 1 root、RAW state、trajectory、opening prefixをStage 2 formal evidenceへ再利用しない。Stage 2 authorizationはStage 1 preregistered gate通過後のみとした。

## TMGC-D009 — G2-08 observations are not validated input

G2-08 leaf-level development observationをG2-09のvalidated classifier/grouping/threshold根拠として使用しない。

## TMGC-D010 — Decision vocabulary

Stage/Study formal tokensをscientific outcome前に固定し、同Study内の結果後に救済labelを追加しない。

## TMGC-D011 — Upstream C03 provenance correction

Stage 0 code-level auditでprimary consequenceが`actorNyumbaSeedsDeltaSign=0`単独、`coarse-no-index`がmove abstraction modeであること等を正本準拠へ訂正した。訂正はscientific seed未消費・Stage 1/2未authorizedで行った。

## TMGC-D012 — Stage 0 core verification

run `33285277593`を`CORE-SEMANTICS-AND-PROVENANCE-PASS`として採用した。

## TMGC-D013 — Source preflight and Stage 1/2 contract freeze

source-only preflight gateとStage 1/2 boundary/validation contractをscientific seed消費前にfreezeした。

## TMGC-D014 — Stage 0 source preflight attempt 1

run `33285427882`はresult serialization defectとpipeline maskingのため`TECHNICAL-EXECUTION-INVALID-NO-PREFLIGHT-RESULT`とした。Stage 0 technical-onlyでscientific evidenceはなく、gate/population/technical seedを変えず同一technical blockの修正rerunのみ行った。

## TMGC-D015 — Stage 0 source preflight pass

run `33285761079`は同一technical seedsで`SOURCE-PREFLIGHT-PASS`。全frozen technical gateとscientific leakage guardをpassした。

## TMGC-D016 — Stage 0 terminal closure

core、contract、source/diversity/resource evidenceが揃ったためStage 0を`STAGE0-TECHNICAL-PASS`でclosureした。

## TMGC-D017 — Stage 1 tooling architecture frozen before authorization

Stage 1 scientific authorization前に16 source shards / 16 measurement shards、production/independent source replay、selected-root collapse、5 search conditions、boundary assignment/aggregation、runner-local exact equalityを実装した。scientific workflowはauthorization file bindingがなければseed generationを開始できない設計とした。

## TMGC-D018 — Stage 1 tooling smoke contract

technical-only smoke seeds `8090201..8090232`、pass gates、source file hash freeze対象、resource ceiling、failure mappingを`STAGE_1_TOOLING_SMOKE_SPEC.json`へ結果前に固定した。

特に:

```text
contractChangeBasedOnSmokeOutcomeAllowed = false
toolingMismatch -> STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
noPostHocSeedExtension = true
noThresholdOrAxisChange = true
```

を固定した。

## TMGC-D019 — Stage 1 tooling smoke technical failure

run `33287035754`はsyntax checksをpassした後、independent boundary aggregatorで`ReferenceError: topSetRate is not defined`を発生させた。canonical smoke result JSONは生成されなかった。

```text
source commit = 65b2e3dee0994e1520ad9a3470feff4f3c9d98ae
artifact id = 9724782927
artifact ZIP SHA-256 = 54c536eceb460d8734ba19e6e79bfc2e9e7c82838056338a4527e7d365e1d51c
```

このfailureはscientific negativeではなくtechnical implementation invalidityである。

## TMGC-D020 — No same-study tooling rescue

D018のprospective failure mappingに従い、D019を見た後に変数名を修正してsame-study smokeをrerunしない。Stage 1 authorizationを発行しない。

Status: **NO-RESCUE / FROZEN**.

## TMGC-D021 — Study closure

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = TECHNICAL-INVALID
Stage 1 seeds 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 seeds 29210001..29218192 = RESERVED / UNCONSUMED
```

C03 generalization/counterexample scientific endpointは未推定である。将来修正版は新しいprospective Study/versionで扱う。

Status: **FROZEN STUDY CLOSURE**.
