# DECISION REGISTER

## TMGC-D001 — Baseline

2026-08-30時点のremote `main` SHA `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`をG2-09開始baselineとして固定する。

## TMGC-D002 — Study identity

Study IDを`TMGC-STUDY1`、Research Generation slotを`G2-09`としてprospectively固定する。

## TMGC-D003 — Stage identity

- `TMGC-S0-TECHNICAL-2026-08-30-v1`
- `TMGC-S1-DEVELOPMENT-2026-08-30-v1`
- `TMGC-S2-FORMAL-2026-08-30-v1`

を科学的outcomeを見る前に固定する。

## TMGC-D004 — Upstream decisions are immutable

`TM-S2-C03 = CONFIRMED`、`TM-S2-C01/C02/C04 = NOT-CONFIRMED`を変更・救済・再定義しない。

## TMGC-D005 — State identity

RAW identityのみをauthoritativeとし、`pits/reserve/houseOwned/player/phase/winner/pending`をidentityに含め、`turn/reason`を除外する。validated transform setは空、canonicalization/symmetry reductionは禁止する。

## TMGC-D006 — Exact C03 is Mtaji-specific

元C03を`C03-EXACT`として保持する。Stage 0 technical verificationにより、Namua legal move constructionはfront-rowのみで、C03 exactが要求するMtaji back-row `row=1` move familyをphase変更だけでは作れないことを確認した。direct Namua transportは`TECHNICALLY-INELIGIBLE`とし、Namuaをscientific counterexampleへ数えない。row変更を伴う新constructはG2-09ではauthorizeしない。

## TMGC-D007 — Scientific seed reservation

Stage 1 `29110001..29114096`、Stage 2 `29210001..29218192`をG2-09専用として予約する。両blockとも開始時点およびStage 0進行中は`UNCONSUMED`である。repository検索で開始時点に同一seed startの既存使用がないことを確認した。

## TMGC-D008 — Development / confirmation firewall

Stage 1 roots、RAW states、trajectories、opening prefixesをStage 2 formal evidenceへ再利用しない。Stage 2 authorizationはStage 1 preregistered gate通過後のみ行う。

## TMGC-D009 — G2-08 non-estimable leaf observations

G2-08のleaf-level development observationsをG2-09のvalidated input、classifier、grouping rule、threshold根拠として使用しない。

## TMGC-D010 — Decision vocabulary

`STUDY_1_PROTOCOL.md`に記載したformal decision vocabularyをoutcome前に固定し、同Study内の結果を見た後に救済labelを追加しない。

## TMGC-D011 — Upstream C03 provenance correction

Stage 0 code-level auditでResearch Generation 1のcandidate/spec/authorization正本を再照合し、開始時prospective文書の一部にあったC03記述を正本準拠へ訂正した。primary consequenceは`actorNyumbaSeedsDeltaSign=0`単独であり、`coarse-no-index`はsource policyではなくmove abstraction modeである。上流formal endpointのminimum observed rateは各0.60であり、exact one-sided binomial + Holm-Bonferroni + consistency/estimability gatesがformal ruleである。

この訂正はG2-09 scientific evidence生成前、reserved seed未消費、Stage 1/2未authorizedの状態で行われたprovenance correctionであり、scientific designのoutcome-driven変更ではない。

## TMGC-D012 — Stage 0 core technical verification

GitHub Actions run `33285277593`をtechnical-only evidenceとして採用し、interim core dispositionを`CORE-SEMANTICS-AND-PROVENANCE-PASS`とする。これはStage 0 terminal passではない。

## TMGC-D013 — Source preflight and Stage 1/2 contract frozen before scientific evidence

source-only technical preflight gateを`STAGE_0_SOURCE_PREFLIGHT_SPEC.json`に結果前freezeした。またStage 1 development classificationとStage 2 held-out validation / multiplicity / decision ruleを`STAGE_1_2_BOUNDARY_CONTRACT.json`にscientific seed消費前freezeした。Stage 0 terminal pass前にStage 1 authorizationは発行しない。
