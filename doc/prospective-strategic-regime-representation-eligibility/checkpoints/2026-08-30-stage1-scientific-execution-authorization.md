# PSRRE-STUDY1 — Stage 1 scientific execution authorization

Date: 2026-08-30

## authorization

Stage 0 technical PASS、Stage 1 tooling smoke PASS、Stage 1 packaging preflight PASSを確認し、prospectively frozen contractとsource/hash bindingに従ってStage 1 scientific developmentをconsume-onceでauthorizeする。

```text
Study ID = PSRRE-STUDY1
Stage ID = PSRRE-S1-DEVELOPMENT-2026-08-30-v1
Source freeze commit = 41124069f89f0706cf943e18688c96a8c2db35d7
Packaging preflight run = 33308152033
Packaging preflight artifact = 9731133811
Packaging preflight result SHA-256 = 0f21e0b401d9b123be41ef3af5b2f60498e41270ac36eea108d876f6f47a394a
Stage 1 seeds = 29510001..29514096
Status before execution = RESERVED_UNCONSUMED
Stage 1 scientific execution = AUTHORIZED
Stage 2 scientific execution = NOT AUTHORIZED
G2-11 = NOT AUTHORIZED
```

## preflightの確認

component-wise projection修正後のfinal preflightでは、source generation、root selection、28-feature calculation、median/MAD、full candidate-model stress、production / independent exactness、runtime / RSS / artifact projectionの全checkがPASSした。

```text
projected production shard = 6,723,440 bytes
projected independent shard = 6,723,440 bytes
frozen per-shard ceiling = 33,554,432 bytes
projected total compressed = 13,446,880 bytes
frozen total ceiling = 268,435,456 bytes
```

preflightでscientific seedsは使用しておらず、scientific outcome、G2-11 outcomeも観察していない。

## consume-once rule

scientific runnerはauthorization/source bindingを検証後、scientific generationより前に`CONSUMPTION_RECORD.json`をmaterializeする。その時点以降、seed blockはCONSUMEDとして扱う。technical / resource / artifact failureが起きても同一blockのrerun、repair、replacement、extensionは行わない。

## immutable boundary

このauthorizationはG2-10のclosure、40-feature/K-means contract、threshold、formal decisionを変更しない。本Studyの28-feature dictionary、3 representation families、`K=2..8`、support/silhouette/stability/source-policy threshold、Stage 2 held-out contractも結果に応じて変更しない。

Stage 1がpositiveでもStage 2とG2-11は自動authorizeしない。
