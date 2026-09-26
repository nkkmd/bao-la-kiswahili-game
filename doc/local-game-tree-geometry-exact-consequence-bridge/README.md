# G4-06 / LGTGECB-STUDY1

Research Generation 4 / G4-06 の研究入口です。

正式日本語題目:

**Baoの局所ゲーム木幾何とexact game-theoretic consequenceの対応検証1 — 完全解析済み固定microdomainにおけるbounded RAW geometryとexact value・solution distance・move-equivalence構造のprospective接続**

## 現在の状態

```text
Study = LGTGECB-STUDY1
authorization = G4-06-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 formal bridge mapping = NOT AUTHORIZED YET
G4-05 formal-domain bridge reads in Stage 0 = 0
G4-10 depth-11 access = 0
public AI change = NOT AUTHORIZED
```

Stage 0ではtechnical fixtureだけを使い、bounded geometry、exact solver output、value-preserving move分類、DTF整合、finite pair-ordering / concordance集計、production / independent実装の一致を検証した。Canonical run `36211754989`でmandatory gate 12 / 12がPASSした。

Stage 0の数値はtechnical fixtureの再現値であり、G4-06の科学結果ではない。

## 中心課題

G4-05でcomplete closureと独立exact solver agreementが成立した固定8 microdomainについて、relative depth 5のbounded RAW local game-tree geometryが、root exact value、solution distance、value-preserving move count等のexact consequenceと再現可能な対応を持つかをprospectiveに検証する。

## 重要な境界

- G4-05をrepair / reopen / rescueしない。
- scientific populationはG4-05 canonical Stage 2の固定8 domainsから追加しない。
- G4-05 candidate poolを再scanしない。
- G4-05 `STATE-LIMIT` candidateを救済しない。
- RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`を維持する。
- validated transform setは`[]`を維持する。
- state / edge / moveを独立標本として水増ししない。
- engine evaluation、自己対局勝率、deeper searchをexact truthへ置換しない。
- 限定microdomain内の結果をwhole-Bao optimalityへ一般化しない。
- G4-10 depth 11へアクセスしない。
- public AI変更へ自動接続しない。

## 読む順序

1. [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
2. [`../research-program-decisions/2026-09-26-post-g4-05-g4-06-authorization-review.md`](../research-program-decisions/2026-09-26-post-g4-05-g4-06-authorization-review.md)
3. [`preregistration/STAGE_0_TECHNICAL_SPEC.json`](preregistration/STAGE_0_TECHNICAL_SPEC.json)
4. [`checkpoints/2026-09-26-stage-0-technical-pass.md`](checkpoints/2026-09-26-stage-0-technical-pass.md)
5. [`results/stage-0/STAGE_0_ARTIFACT_RECEIPT.json`](results/stage-0/STAGE_0_ARTIFACT_RECEIPT.json)
6. [`results/stage-0/STAGE_0_CANONICAL_RESULT_SUMMARY.json`](results/stage-0/STAGE_0_CANONICAL_RESULT_SUMMARY.json)
7. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)

## 次工程

Stage 1は未認可である。次はpost-Stage0 / pre-Stage1 authorization reviewを行い、formal 8-domain input manifestとscientific endpointを結果を見る前に固定する。
