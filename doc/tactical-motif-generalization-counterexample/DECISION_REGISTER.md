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

元C03を`C03-EXACT`として保持する。Namua等へのphase跨ぎは元C03の名前・定義を流用せず、Stage 0でtechnical eligibilityを満たした場合のみG2-09専用の別constructとして凍結する。

## TMGC-D007 — Scientific seed reservation

Stage 1 `29110001..29114096`、Stage 2 `29210001..29218192`をG2-09専用として予約する。両blockとも開始時点では`UNCONSUMED`である。

## TMGC-D008 — Development / confirmation firewall

Stage 1 roots、RAW states、trajectories、opening prefixesをStage 2 formal evidenceへ再利用しない。Stage 2 authorizationはStage 1 preregistered gate通過後のみ行う。

## TMGC-D009 — G2-08 non-estimable leaf observations

G2-08のleaf-level development observationsをG2-09のvalidated input、classifier、grouping rule、threshold根拠として使用しない。

## TMGC-D010 — Decision vocabulary

`STUDY_1_PROTOCOL.md`に記載したformal decision vocabularyをoutcome前に固定し、同Study内の結果を見た後に救済labelを追加しない。
