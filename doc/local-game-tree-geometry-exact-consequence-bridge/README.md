# G4-06 / LGTGECB-STUDY1

Research Generation 4 / G4-06 の研究入口です。

正式日本語題目:

**Baoの局所ゲーム木幾何とexact game-theoretic consequenceの対応検証1 — 完全解析済み固定microdomainにおけるbounded RAW geometryとexact value・solution distance・move-equivalence構造のprospective接続**

## 現在の状態

```text
Study = LGTGECB-STUDY1
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 = COMPLETE
Formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
fixed formal domains = 8 / 8
relations emitted = 12 / 12
production / independent agreement = true
G4-05 candidate rescan = 0
G4-10 depth-11 access = 0
public AI change = NOT AUTHORIZED
main integration = NOT AUTHORIZED / NOT EXECUTED
```

Canonical Stage 1 formal runは `36214800357 / attempt 1`、execution SHAは `90283d1680cef8feda02e11b072e98b145d5d786` である。

## 中心課題

G4-05でcomplete closureと独立exact solver agreementが成立した固定8 microdomainについて、relative depth 5のbounded RAW local game-tree geometryが、root exact value、solution distance、value-preserving move count等のexact consequenceと再現可能な対応を持つかをprospectiveに検証した。

## 主な結果

固定8-domain populationでは次が得られた。

- Tree/RAW inflationは全8 rootで`1`、transposition occupancyは全8 rootで`0`となり、variation不足のためexact consequenceとの関係は`NON-ESTIMABLE`。
- exact value × corridor、および exact value × reply widthは`MIXED-ORDER`。
- DTF × corridorは`MIXED-ORDER`。
- DTF × reply widthは`MONOTONE-DECREASING-ORDER-CONSISTENT`。
- value-preserving move count × corridorは`MONOTONE-DECREASING-ORDER-CONSISTENT`。
- value-preserving move count × reply widthは`MIXED-ORDER`。

これらはN=8の固定late-game exact microdomain内のfinite ordering summaryであり、whole-Bao一般化、因果推論、公開AIへのfeature採用を支持するものではない。

詳細は[`FINAL_REPORT.md`](FINAL_REPORT.md)を参照する。

## 重要な境界

- G4-05をrepair / reopen / rescueしていない。
- scientific populationはG4-05 canonical Stage 2の固定8 domainsから追加していない。
- G4-05 candidate poolを再scanしていない。
- G4-05 `STATE-LIMIT` candidateを救済していない。
- RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`を維持した。
- validated transform setは`[]`を維持した。
- state / edge / moveを独立標本として水増ししていない。
- engine evaluation、自己対局勝率、deeper searchをexact truthへ置換していない。
- 限定microdomain内の結果をwhole-Bao optimalityへ一般化しない。
- G4-10 depth 11へアクセスしていない。
- public AI変更へ自動接続しない。

## 読む順序

1. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
2. [`../research-program-decisions/2026-09-26-post-g4-05-g4-06-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-05-g4-06-authorization-review.md)
3. [`preregistration/STAGE_0_TECHNICAL_SPEC.json`](preregistration/STAGE_0_TECHNICAL_SPEC.json)
4. [`checkpoints/2026-09-26-stage-0-technical-pass.md`](checkpoints/2026-09-26-stage-0-technical-pass.md)
5. [`preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json`](preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json)
6. [`preregistration/STAGE_1_FORMAL_SPEC.json`](preregistration/STAGE_1_FORMAL_SPEC.json)
7. [`authorizations/STAGE_1_AUTHORIZATION.json`](authorizations/STAGE_1_AUTHORIZATION.json)
8. [`results/stage-1/STAGE_1_FORMAL_RECEIPT.json`](results/stage-1/STAGE_1_FORMAL_RECEIPT.json)
9. [`checkpoints/2026-09-26-stage-1-formal-complete.md`](checkpoints/2026-09-26-stage-1-formal-complete.md)
10. [`FINAL_REPORT.md`](FINAL_REPORT.md)
11. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)

## 次工程

G4-06のscientific executionはresearch branch上で完了した。次はmain統合前の最終整合性監査を行い、Research Generation 4のprogram statusとG4-07 dependency gateを含む関連文書の更新漏れがないか確認する。

main統合はその監査後の明示的判断まで行わない。
