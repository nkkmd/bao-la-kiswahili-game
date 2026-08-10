# Stage 0 Smoke Result — Position Typology Instrumentation

更新日: 2026-08-09  
Status: **Stage 0 instrumentation smoke passed / exploratory only / no formal experiment authorized**

研究: **Baoにおける局面類型と棋風の発見・検証**  
Branch: `research/position-typology-and-playing-style`

## 1. 位置づけ

本書は `STAGE_0_RUNBOOK.md` に従ってローカル実行したinstrumentation smokeの結果記録である。

この結果は次を意味しない。

- position typeが発見された
- cluster数が決まった
- playing styleが定義された
- formal hypothesisが支持された
- Study 1のformal decisionが変更された
- confirmatory corpusが生成された

Stage 0の目的は、専用instrumentationが研究に使用可能なintegrityを持つか、position / trajectory identityを安全に扱えるか、Stage 1 exploratory corpusのsampling designにどのような注意が必要かを確認することにある。

---

## 2. 実行provenance

ローカル実行時の主要条件:

- source commit: `d72c2c20e4f4e6376208e687d65157b1ee4756c8`
- source tree: clean
- Node.js: `v24.6.0`
- platform: Linux x64
- games: 16
- base seed: `20260809`
- max ply: 100
- opening: seeded uniform legal random, 8 ply
- generation conditions: 4 strata × 4 games

Generation conditions:

| ID | evaluator | search | depth |
|---|---|---|---:|
| P2-D1 | bao | phase2 | 1 |
| P2-D2 | bao | phase2 | 2 |
| LG-D2 | bao | legacy | 2 |
| V2-D2 | bao-v2 | phase2 | 2 |

これらのcondition labelはsampling / provenance metadataであり、position observationのprimary feature vectorには含まれていない。

Manifest上も `formalExperiment: false`、`clusteringAuthorized: false` が維持された。

---

## 3. Hard integrity gate

すべてpassした。

| Check | Result |
|---|---|
| schema validation | passed |
| full replay | passed |
| stored observation recomputation | passed |
| move legality | passed |
| state identity | passed |
| trajectory hash | passed |
| summary recomputation | passed |
| source provenance | passed |
| partial-file policy | per-game atomic files only |

Verification summary:

- games: 16
- observations: 970
- legal moves checked during replay verification: 3,846
- source hashes match: true

したがって、Stage 0専用observation、replay、hash/provenance、atomic game artifactはStage 1 exploratory data generationへ進めるengineering integrityを持つと判断する。

---

## 4. Position / trajectory duplication audit

### 4.1 Position-level

- raw observations: 970
- unique `ruleStateKey`: 935
- duplicate rule-state slots: 35
- unique rule-state rate: approximately 96.4%
- duplicate slot rate: approximately 3.6%
- unique `seatCanonicalKey`: 935
- seat-canonical collapse: 0
- within-trajectory repeated rule positions: 0

35 duplicate slotsは、raw phase countsとunique-state identity auditのphase countsとの差から、今回のsmokeではnamua側にのみ現れている。

これはinstrumentation failureではない。複数trajectoryが共通の初期局面・初期近傍を通ることを含め、trajectory間で同一rule stateが再訪され得ることを示す。

Stage 1ではraw plyをそのまま独立標本としてclustering geometryへ投入しない。

### 4.2 Trajectory-level

- unique historical trajectories: 16 / 16
- unique rule-state trajectories: 16 / 16
- unique seat-canonical trajectories: 16 / 16
- largest historical trajectory group: 1
- dominant historical trajectory rate: 1 / 16 = 6.25%

smokeではdeterministic trajectory repetitionは観測されなかった。

### 4.3 Opening-level

- unique opening rule states: 16 / 16
- largest opening group: 1
- dominant opening rate: 6.25%

8-ply random opening後のopening stateは全ゲームでuniqueだった。

この結果はopening diversificationが機能していることを支持するが、Stage 1のlarger corpusでもopening concentration監査を継続する。

---

## 5. Phase distribution

Raw observations:

- namua: 704 / 970 ≈ 72.6%
- mtaji: 266 / 970 ≈ 27.4%

Unique rule states used by identity audit:

- namua: 669 / 935 ≈ 71.6%
- mtaji: 266 / 935 ≈ 28.4%

この偏り自体を異常とは判定しない。自然trajectory下でnamuaとmtajiの滞在量が等しくなる理由はないためである。

一方、namua / mtajiはルール上のmechanicsが異なり、reserve disappearanceを含む大きな構造的不連続を持つ。さらにsmoke corpusは約73:27のphase imbalanceを持った。

したがってStage 1では:

1. **phase-separated exploratory discoveryをprimary exploratory viewとする候補を優先する**
2. raw corpusの自然なphase occupancyは保存する
3. generation段階で人工的に50:50へ補正しない
4. joint feature-space analysisはsecondary diagnostic / sensitivityとして残す

という方針が最も自然である。

これはformal freezeではなくStage 1 exploratory designである。

---

## 6. Seat-canonical identity re-audit

新smokeから得たunique reachable rule statesを対象に再監査した。

- unique rule states checked: 935
- namua: 669
- mtaji: 266
- legal moves checked: 3,714
- transitions checked: 3,714
- failures: 0
- overall: passed

監査した内容:

- seat exchangeのinvolution
- mirrored stateでのsame `seatCanonicalKey`
- legal-move symmetry
- legal move適用後のtransition symmetry
- namua / mtaji双方のcoverage

identity definitionは既存symmetry研究と同じく:

- direct: `ruleStateKey`
- canonical: validated South/North seat exchange下のminimum hash
- excluded: column / direction reversal

である。

これによりSouth/North seat exchange自体はtypology identity用canonicalization候補として再度支持された。

ただし今回のsmokeでは `uniqueRuleState == uniqueSeatCanonical == 935` であり、実際にseat-swapped pairとしてcollapseするサンプルは0だった。

したがって:

- transformの**妥当性**はpass
- larger corpusでのcanonical dedupの**実効的影響**はまだ未評価

と分けて扱う。

Stage 1で `ruleStateKey` dedupと`seatCanonicalKey` dedupを比較し、結果が変わる場合のみprimary policyを明示的に選択する。

---

## 7. Stage 0結論

### Pass

Stage 0 hard integrity gateはすべてpassした。

専用instrumentationは次を満たす。

- full stateを保存できる
- primary board/legal primitivesを再計算できる
- replayでstored observationを完全再現できる
- move legalityを検証できる
- source provenanceを固定できる
- historical / rule-state / seat-canonical identityを分離できる
- trajectory duplicationを監査できる
- validated seat exchangeを新reachable-state sampleでも再確認できる

したがって、**Stage 0 — Instrumentation and corpus audit は完了**とする。

### Stage 1へ継承する注意

- raw plyを独立標本数とみなさない
- rule-state duplicateをcluster geometryのfrequency weightとして無批判に残さない
- phase-separated discoveryを優先候補とする
- natural phase occupancyはraw corpusに保持する
- seat-canonical transformのvalidityとdedup effectを区別する
- terminal positionをactive position type discoveryへ含めるか別途決める
- condition label / AI search diagnosticsをinitial typology featureへ入れない
- Study 1 formal corpusをdiscoveryへ入れない

---

## 8. 次工程

次は **Stage 1 — Exploratory position typology discovery** の準備へ進む。

まずlarge corpusやclusteringを即実行するのではなく、次をexploratory protocolとして明示する。

1. Stage 1 corpus generation strata
2. exploratory-only seed namespace
3. corpus size / incremental expansion policy
4. terminal-state inclusion policy
5. phase-separated / joint analysis views
6. rule-state / seat-canonical dedup sensitivity
7. trajectory-balanced sampling / weighting
8. candidate feature matrices
9. scaling / transformation candidates
10. clustering methods and stability diagnostics

これらはまだpreregistrationではない。Stage 1 exploratory evidenceを見て provisional position types を形成し、Stage 2 held-out replication前に必要事項をfreezeする。
