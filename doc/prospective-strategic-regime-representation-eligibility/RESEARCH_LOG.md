# PSRRE-STUDY1 — 研究ログ

## 2026-08-30 — Study start （日本語の要点）

remote `main`=`3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a`をbaselineとして固定し、G2-10 closure、upstream eligibility、RAW identity、G2-11 firewallを監査した。Study ID=`PSRRE-STUDY1`、branch=`research/pre-g2-11-strategic-regime-representation-eligibility`を固定した。

## 2026-08-30 — Stage 0 （Stageの記録）

3 representation familyのtechnical qualificationをproduction/independentで検証。workflow run `33304155488`は18 mandatory gateをすべてPASSし、`STAGE0-TECHNICAL-PASS`。scientific outcomeは生成していない。

## 2026-08-30 — Stage 1 prospective prefreeze （固定した条件）

scientific seed使用前に28-feature dictionary、median/MAD、PCA/Ward/PAM、`K=2..8`、candidate selection、readiness、Stage 2 held-out contract、resource ceiling、consume-once ruleを固定した。

Stage 1 seeds=`29510001..29514096`、Stage 2 seeds=`29610001..29618192`。

## 2026-08-30 — tooling smoke （日本語の要点）

source commit `509c80bbf1d0f9855e61923a2fa3c722aeb3c492`をmaterializeし、authorization commit `1ae4dc02263a9c400f9f39f89f6105e9f80a79a2`からrun `33307611100`を実行。16 mandatory checkを全PASSした。technical seedsのみ使用し、scientific seeds used=`[]`。

## 2026-08-30 — packaging preflight （日本語の要点）

初回run `33307852222`とactivation run `33307879877`は、technical preflight payload全体へ一律scaleを掛けたartifact-size projection defectによりFAILした。scientific seedsは未使用。

contract、threshold、feature、K、resource ceilingを変更せずcomponent-wise projectionへ修正した。repair run `33308028155`はPASS。authorization binding manifestを追加した最終preflight run `33308152033`もPASSした。

最終scientific source freeze=`41124069f89f0706cf943e18688c96a8c2db35d7`。

## 2026-08-30 — Stage 1 authorization / execution （承認状態）

commit `085c5df24baff44bb644c00eda91d6212caf5708`でStage 1 scientific executionをexplicit authorize。GitHub Actions run `33308337738` / job `99248759871`を実行した。

consume-once recordをseed generation前に保存後、4096 gamesを生成。seed block `29510001..29514096`は`CONSUMED`。

## 2026-08-30 — Stage 1 result audit （Stageの記録）

workflow全stepはsuccess。artifact=`9731444105`、ZIP SHA-256=`c418bca917723eb9c07035c323431972ac541b4b58e286820657b0d1c7e40d7a`。

Production / independent full exact=true。populationは4096 games / 4066 unique trajectories / 3734 opening prefixes / 512 roots、8 strata各64。resource gateはPASS。

Feature readinessは28 features中nonzero-MAD=15、active feature families=5。事前固定floor 20 nonzero-MAD featuresを満たさなかった。

したがって:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
selected representation = null
```

## 2026-08-30 — Study closure （最終状態）

Stage 2 entry conditionを満たさないためStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。Stage 2 seedsは`RESERVED_UNCONSUMED`のまま。

```text
Study = NON-ESTIMABLE
G2-11 candidate input authorized = false
```

同Study rescueは行わない。G2-10 closure、G2-11 outcome、human/game-theoretic/public-AI claimには変更を加えない。
