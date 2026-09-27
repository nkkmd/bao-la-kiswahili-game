# G4-09 — Geometry-Conditioned Search Reliability and Exact Agreement Study 1

Program: `Research Generation 4 / G4-09`  
Study ID: `GCSREA-STUDY1`  
Branch: `research/g4-09-search-reliability-exact-agreement`  
状態: **`PREREGISTERED / STAGE0-ONLY AUTHORIZED / NOT YET EXECUTED`**

## 研究の問い

Baoの局所ゲーム木幾何は、search configurationを変えたときのranking / TopSet / PV等の出力安定性とどのように関係するか。また、G4-05で完全解析済みの固定exact microdomainに限った場合、search outputはexact value-preserving move setとどの条件で一致するか。

本Studyは次の2 moduleを混同しない。

- `GENERAL-SEARCH-STABILITY`: 一般domainではsearch-output stabilityのみを扱い、higher-resource searchをtruthとしない。
- `EXACT-MICRODOMAIN-AGREEMENT`: G4-05の固定8 exact microdomainだけをtruth-bearing oracle domainとして扱う。

## 現在の認可範囲

現在認可されているのはpreregistrationとtechnical-only Stage 0だけである。

```text
fresh scientific seed access = NOT AUTHORIZED
scientific outcome = NOT AUTHORIZED
G4-05 actual exact-domain search measurement = NOT AUTHORIZED
G4-10 depth-11 access = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

Stage 0はsynthetic / technical fixtureだけを使用し、実際のG4-05 fixed 8 rootsには新規search measurementを行わない。

## 読む順序

1. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
2. [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
3. [`STAGE_0_TECHNICAL_PLAN.md`](STAGE_0_TECHNICAL_PLAN.md)
4. [`prereg/STAGE_0_TECHNICAL_SPEC.json`](prereg/STAGE_0_TECHNICAL_SPEC.json)
5. [`../research-program-decisions/2026-09-27-post-g4-08-g4-09-authorization-review.md`](../research-program-decisions/2026-09-27-post-g4-08-g4-09-authorization-review.md)

## 保護境界

- G2-02をrepair / rescueしない。
- G4-03のscientific evidenceを再利用しない。
- G4-05のcandidate rescan、replacement、STATE-LIMIT rescueをしない。
- G4-06 relation resultをG4-09 threshold選択へ使用しない。
- G4-08 `NON-ESTIMABLE`をno-effect / no-relation evidenceへ変換しない。
- G4-10 depth-11へアクセスしない。
- public AIへ自動反映しない。
