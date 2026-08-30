# PSRRE-STUDY1 — Stage 0 technical source freeze / execution authorization

Date: 2026-08-30  
Study: `PSRRE-STUDY1`  
Stage: `PSRRE-S0-TECHNICAL-2026-08-30-v1`

## 固定内容

Stage 0 technical-only toolingを、次のsource commitで固定した。

```text
724e05ef6a730593aab2f9165a0d02216e372c6d
```

このcommitはStudy-start commit `c1904a6a03361804411ccf7be89d919145d9ff15`の子であり、baseline remote `main`は引き続き

```text
3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
```

である。

## technical-only authorization

このcheckpointと同一authorization commitで、`STAGE_0_TECHNICAL_EXECUTE.json`によりStage 0 technical executionだけを承認する。

承認されるのは、次の確認だけである。

- RAW identityのproduction / independent exact reconstruction
- technical fixture上のRAW structural / legal-action / one-ply successor / reply-width observables
- bounded search raw diagnosticのproduction / independent reconstruction
- Research Generation 1 `TM-S2-C03` original frozen scopeのtechnical reconstruction
- robust scaling、PCA、Ward、PAM、held-out assignment semanticsのsynthetic fixture上のdeterminism
- zero-variance / missing / undefined handlingが実装上明示できること
- IEEE-754 binary64 canonical encoding
- source binding、artifact completeness、resource ceiling

## 明示的に未承認のもの

```text
Stage 1 scientific execution = NOT AUTHORIZED
Stage 2 scientific execution = NOT AUTHORIZED
Stage 1 scientific seed use = NOT AUTHORIZED
Stage 2 scientific seed use = NOT AUTHORIZED
G2-11 = NOT AUTHORIZED
G2-11 outcome inspection = NOT AUTHORIZED
scientific representation performance comparison = NOT AUTHORIZED
support / silhouette / assignment-stability inspection = NOT AUTHORIZED
```

Stage 0では、3 representation familyのどれが科学的に良いかを判断しない。technicalにPASSしたfamilyはすべてStage 1 prefreeze候補として残す。

## G2-10との境界

`UMSSR-STUDY1`の40-feature dictionary、deterministic K-means `K=2..6`、promotion threshold、negative Stage 1 result、consumed Stage 1 seeds、unconsumed Stage 2 seedsはimmutableである。本Stage 0はそれらを救済・再定義・再実行しない。

## 次の判定

GitHub Actionsによるtechnical-only runが全mandatory gateをPASSした場合だけ、Stage 0を`STAGE0-TECHNICAL-PASS`としてclosure可能とする。

その場合でもStage 1は自動承認されない。Stage 1 scientific seedを使用する前に、fresh observable dictionary、representation-family hyperparameter space、model-selection rule、numeric eligibility thresholds、firewall、independent verification contractを別途結果を見る前に固定しなければならない。
