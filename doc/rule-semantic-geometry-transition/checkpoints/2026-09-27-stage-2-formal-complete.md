# G4-08 / BRSGT-STUDY1 — Stage 2 formal holdout closure

日付: 2026-09-27  
Stage: `BRSGT-S2-FORMAL-2026-09-27-v1`  
Disposition: **STAGE2-FORMAL-COMPLETE / 24-OF-24 NON-ESTIMABLE**

## 実行 provenance

```text
pre-fresh static audit run = 36314109864 / attempt 1 / PASS
audited source SHA = d2e22fa9b4ca8286480beda2a89b5e287bcdad9c
formal run = 36314208922 / attempt 1
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
artifact ID = 10929684128
artifact name = brsgt-stage2-formal-36314208922-1
artifact ZIP SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
```

監査HEAD以後、formal execution前に追加されたのは`STAGE_2_AUTHORIZATION.json`と`STAGE_2_TRIGGER.json`の2 pathのみ。binding verifierはPASSした。

## Fresh evidence accounting

```text
seed block = 40823001..40824024
fresh scientific seed reads = 1024 / 1024
first seed = 40823001
last seed = 40824024
no-rescue boundary crossed = true
same-version rerun = prohibited
seed extension = prohibited
replacement population = prohibited
```

## Frozen freshness firewall

firewallはfresh seed read前にmaterializeされ、fresh access 0の状態で完成した。

```text
firewall digest = 38ccbc1ace22a921c8f340c1ae9a56cfab5451208898f629810de9a06af982f7
seed identities = 9984
trajectory identities = 1552
opening-prefix identities = 1166
RAW-root identities = 37188
fresh reads before firewall complete = 0
```

1024 fresh source trajectoriesは全件がfrozen firewallにより除外された。

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
total rejected = 1024
accepted = 0
```

## Formal result

accepted source trajectoryが0だったため、event candidate、geometry measurementともに0となった。

```text
candidate count = 0 for all 4 event families × 2 policies
measured event units = 0
unique geometry roots measured = 0
formal family = 24 slots
INCREASE-CONFIRMED = 0
DECREASE-CONFIRMED = 0
NOT-CONFIRMED = 0
NON-ESTIMABLE = 24
TECHNICAL-INVALID = 0
production / independent inference exact agreement = true
```

したがって、**24 / 24 formal slotsはすべて`NON-ESTIMABLE`**で閉じる。

これは「effectが存在しない」「増減がない」というnegative scientific resultではない。formal estimabilityに必要なevent unitsがfreshness gate後に1件も残らなかったため、directional scientific conclusionを形成できなかったという意味である。

## Post-execution identity diagnostic

formal resultを変更しない説明診断として、Stage 2 candidate manifestとStage 1 v3 identity exclusionを照合した。

全1024 Stage 2 trajectoriesのply 0 RAW rootは同一で、

```text
2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
```

であった。このinitial RAW rootはStage 1 v3の512 identity rowsにも含まれ、frozen firewallのRAW-root setへ既に登録されていた。

runnerのcollision判定順はseed → full trajectory → opening prefix → reachable RAW rootである。このため6 trajectory collisionsと7 prefix collisionsを先に除外した後、残る1011 trajectoriesは全てply 0で`UPSTREAM-REACHABLE-RAW-ROOT`となる。

これは**post-hoc rescueの根拠として使用しない**。ply 0を除外する、root freshness定義を変更する、seedを追加する等の同Stage/version修正再実行は禁止する。

## Artifact integrity

artifact内`SHA256SUMS.txt`とdownload後の実ファイルを照合し一致した。

```text
STAGE_2_EXECUTION_CONTEXT.json = e75dde20099d5c7c61aad33aed8e8f5b77e6d65671a4025907c4209b6c592c21
STAGE_2_RESULT.json = 0ffa3c7949efea601f41550fd25a5075cdae58c105b0c83cdd904c76f92d290e
STAGE_2_CANDIDATE_MANIFEST.json = 3a5ffd6cdfeffddf1fb00d4289e5f278dfc319b260c99cf05d5c956244f4c13f
STAGE_2_FIREWALL_SUMMARY.json = 2d65262989d9f35d977ee250285b23e28dbbee1507d43a9f5cd76e6e5a160265
```

Candidate manifestは1024 identity rowsを保持し、`scientificOutcomeFieldsRetained=false`である。

## Interpretation boundary

このStage 2から許される結論は次に限定する。

- frozen Stage 2 populationはfrozen identity firewallにより全件除外された。
- その結果、24 formal event×metric slotsは全てNON-ESTIMABLEである。
- capture / nyumba / reserve decrement / Namua→Mtajiのgeometry effect方向について結論は出ていない。
- causal effect、whole-Bao law、game-theoretic consequence、AI strength、人間にとっての難しさを推論しない。

## Protected boundaries

```text
G4-10 depth-11 access = 0
public AI changed = false
main integration = not performed
```

Canonical record: `results/stage-2/STAGE_2_CANONICAL_RECORD.json`
