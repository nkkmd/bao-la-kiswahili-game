# PEOCR-STUDY1 — 判断台帳

## D-001 — Study identity

日付: 2026-08-26

`G2-01`を、Research Generation 2の新しい独立Studyとして開始しました。

```text
Formal title = Position Evaluation / Empirical Outcome Calibration Replication Study 1
Study ID = PEOCR-STUDY1
```

`G2-01`はAgenda上の順序labelであり、正式なStudy IDではありません。

## D-002 — Research Generation 1との境界

`PEC-STUDY1 = INCONCLUSIVE`は変更しません。

PEC Stage 2への追加game、seed extension、gate relaxation、replacement、mapping refit、threshold change、retrospective reclassificationは承認しません。

既存contractとの互換性のため、次のcanonical phraseも保持します。

```text
No additional PEC Stage 2 games
```

既存dataはresource planningとfailure-mode identificationにのみ利用できます。

## D-003 — baseline

Study開始時のremote `main`:

```text
9e9cb6e2525f09a873e741db9f8fa42696839fbe
```

Research branch:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## D-004 — state identity

正式なstate identityはRAWのままです。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

symmetry / canonicalizationの使用は承認しません。

## D-005 — calibration family

G2-01の科学的outcomeを見る前に、primary development familyを次へ固定しました。

```text
phase-stratified isotonic PAVA
formal prediction clipping = [0.01, 0.99]
candidate family selection = none
```

clipping ruleはlog lossを有限に保つため結果を見る前に固定したもので、Stage 1 / 2 outcome確認後に変更できません。

## D-006 — population size

```text
Stage 1 development = 2,048 games
Stage 2 formal = 8,192 games
```

Stage 2を大きくしたのは、Research Generation 1で確認されたidentity-firewall attrition mechanismに対して結果を見る前に設計上対応したものです。終了済みPEC Stage 2 corpusの延長ではありません。

## D-007 — 厳格なcross-stage firewall

Stage 2ではStage 1との重複を次の3単位で除外します。

```text
historicalTrajectoryHash
openingPrefixHash
rawStateKey
```

除外後のreplacementは行いません。seed extensionも禁止します。

## D-008 — formal metricsと判断規則

Formal co-primary evidence:

- Stage 1 phase-only referenceに対するpaired Brier skill
- 同じreferenceに対するpaired log-loss skill

全gateを満たしたうえでの成功には、事前に再利用を固定した次のreplication Brier maximaも必要です。

```text
pooled <= 0.18
Namua <= 0.25
Mtaji <= 0.12
```

判断規則:

```text
all gates + all criteria PASS -> CONFIRMED
all gates PASS + criterion failure -> NOT-CONFIRMED
any estimability/identity gate failure -> INCONCLUSIVE
```

## D-009 — human / game-theoretic / engineeringとの境界

本Studyは次を承認しません。

- game-theoretic probability claim
- 人間のadvantage perceptionに関するclaim
- causal claim
- public-AI qualityまたはpromotionに関するclaim

Engineering outcomeによって本Studyの判断を変更することはできません。

## D-010 — Stage 1 development decision

日付: 2026-08-27

完全なauthorized Stage 1 populationは、結果を見る前に固定したreadiness gateとindependent-verification gateをすべてPASSしました。

```text
Stage 1 decision = MODEL-FROZEN-DEVELOPMENT
frozen model = phase-stratified-isotonic-PAVA
frozen model SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
Stage 2 generation authorized = false
```

これはdevelopment / model-freeze decisionであり、held-out formal calibration confirmationではありません。Research Generation 1の`PEC-STUDY1 = INCONCLUSIVE`は変更しません。

## D-011 — Stage 2 technical smoke

日付: 2026-08-27

`PEOCR-S2-SMOKE-2026-08-27-v1`は、Stage 2 scientific seedを一切使用せず、productionとindependent verificationの双方をPASSしました。

Stage 1で固定したmappingとidentity-firewall reference universeもexactに検証しました。

このtechnical PASSはStage 2 scientific authorizationの前提ですが、それ自体がStage 2の科学的承認ではありません。

## D-012 — Stage 2 formal authorization

日付: 2026-08-27

production + independent technical smokeのPASS後、exact source / model / reference hashを固定し、commit `5d1b4a40ef95ac639787aa0abf040a455c3c2995`でStage 2 formal generationを明示的に承認しました。

承認populationはexactに8,192 games、seed `24020001..24028192`です。実行上のみ8つのcontiguous 1,024-game shardへ分割しました。

seed extension、replacement、outcome-dependent extension、Stage 2 refitは禁止したままです。

## D-013 — Stage 2 formal decisionとStudy closure

日付: 2026-08-27

全8,192 gamesと全shard-level independent replayが完了しました。統合後のselection / measurement独立検証もPASSし、historical trajectory、opening prefix、RAW state identityのすべてでStage 1との重複は0でした。

しかし、固定済みestimability gateのうち次の3条件がFAILしました。

```text
3898 < 4500 trajectories after firewall
3570 < 4000 selected RAW states
1747 < 1750 Mtaji selected states
```

したがって、

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

です。

co-primary Brier / log-loss formal branchには入っておらず、`primary = null`です。

near-miss exception、extra seed、replacement、gate relaxation、refit、subgroup rescue、alternate-primary relabelingは承認しません。これにより`PEOCR-STUDY1`は科学的に終了しました。

## D-014 — repository integration

日付: 2026-08-27

すべてのfinal auditがPASSした後、PR #67をreadyにし、expected research head `6e64cd5bb252eab40c2608fc88562ba7371b2602`で`main`へmergeしました。

```text
integration PR = 67
integration merge commit = 12ce1f5f212349cc827147adcb5de8e7eadb98f3
```

このrepository integrationはadministrative / provenance closureです。

`PEOCR-STUDY1 = INCONCLUSIVE`、固定済みgate、canonical artifact、科学的解釈境界、Research Generation 1の判断を変更しません。
