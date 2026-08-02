# E-019 search-profile一般化実験 事前登録チェックポイント

更新日: 2026-08-02  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Preregistered / formal not authorized / formal corpus not generated

## 1. 目的

E-018でformal `confirmed`となったH16「捕獲分岐急拡大の顕在化はsearch profileに依存する」の確認範囲を変更せず、新規仮説H17として、search-profile依存性が事前指定したdepth/evaluator変更下でも維持されるかを検定する。

E-018の正式判定は固定する。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`

E-019の結果はこれらの過去判定を遡及変更しない。

## 2. H17

> 捕獲分岐急拡大のsearch-profile依存性は、事前指定したsearch depthおよびevaluator変更下でも維持される。

E-019が直接対象とするのは次の3 strataのみである。

| stratum | evaluator | depth | comparison | paired seeds |
|---|---|---:|---|---:|
| D1 | `bao` | 1 | `phase2` vs `legacy` | 6500 |
| D3 | `bao` | 3 | `phase2` vs `legacy` | 4500 |
| V2 | `bao-v2` | 2 | `phase2` vs `legacy` | 2000 |

全条件でlevelは`hard`。

全depth、全evaluator、将来の別search implementationへの一般化はしない。

## 3. Corpusとseed

新規master seed block:

- `20268001–20274500`

nested prefix設計:

- D1: `20268001–20274500` = 6500 pair
- D3: `20268001–20272500` = 4500 pair
- V2: `20268001–20270000` = 2000 pair

各stratum内ではphase2/legacyが同一seedおよび同一random-opening boundaryを使用する。

E-019内のcross-stratum seed重複は意図的なnested designであり、primary inferenceは各stratum内pairに限定する。cross-stratum shared seedsを独立replicationとして数えない。

総量:

- paired comparisons across strata: 13000
- formal games予定数: 26000

過去の探索・formal seed blockとは重複させない。

## 4. Primary endpoint

E-018から変更せず継承する。

- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game within stratum
- binary endpoint: 各conditionのゲーム内にeligible category-A `capture-branch-expansion` candidateが1件以上あれば1、なければ0
- primary test: two-sided exact McNemar
- component alpha: 0.05
- minimum discordant pairs: 20 / stratum
- direction: `phase2-only > legacy-only`

candidate detectionおよびregime classification閾値もE-018から変更しない。

## 5. Sample size設計

E-011/E-017/E-018は設計入力にのみ使用し、E-019の証拠には使用しない。

sparse-event stress assumption:

- discordant pair内のphase2 share: 0.8
- discordant odds ratio: 4.0
- E-018 observed discordant OR 7.0より弱い効果をplanning assumptionとする

| stratum | assumed discordance | N pairs | P(discordants >=20) | unconditional exact-McNemar power |
|---|---:|---:|---:|---:|
| D1 | 0.5% | 6500 | 0.992636 | 0.918904 |
| D3 | 0.75% | 4500 | 0.995893 | 0.931194 |
| V2 | 2.0% | 2000 | 0.999843 | 0.968665 |

availability referenceとして、discordance 0.5% / 0.75% / 1% / 2% / E-018 observed 3.6%の場合に`discordants >=20`を95%以上で確保するbinomial planning Nはそれぞれ5576 / 3718 / 2788 / 1394 / 775 pair。

これらはdata generation前のplanning calculationであり、E-019観測結果を見てNや成功条件を変更しない。

## 6. Condition-level decision

各D1/D3/V2を次で分類する。

### `pass`

- formal integrity / pairing pass
- discordant pairs >=20
- exact McNemar two-sided p <=0.05
- `phase2-only > legacy-only`

### `fail`

formal integrity / pairingが成立しdiscordants >=20だが、significanceまたはdirection criterionが不通過。

### `insufficient`

formal integrity / pairingは成立するがdiscordants <20。

### `inconclusive`

corpus generation、schema/hash/source、paired opening、seed pairing、candidate-event construction、required outputs等のtechnical integrityが成立しない。

## 7. Global decision

H17のglobal claimは3条件すべてで効果が維持されるというconjunctionなので、Intersection-Union Testとして扱う。

- `confirmed`: D1 / D3 / V2がすべて`pass`
- `not-confirmed`: 1条件以上が`fail`
- `inconclusive`: `fail`はないが、1条件以上が`insufficient`またはtechnical `inconclusive`

Global IUTでは各componentをalpha 0.05で要求し、Bonferroniによるcomponent alpha縮小は行わない。

一方、各stratumをglobal componentではなくstandalone confirmationとして報告する場合は、3 McNemar p-valuesにHolm-Bonferroniを適用し、raw pとadjusted pを両方保存する。

## 8. Structural secondary

E-018と同じprimary/secondary境界を維持する。

各conditionについて:

- unique `trajectoryHash + eventPly` candidate / expansion
- unique candidate / expansion trajectories
- largest duplicate multiplicity
- trajectory-ply-deduplicated candidate/control expansion rate
- deduplicated RR

各stratum内のphase2 vs legacyについてcandidate trajectory-ply expansion率のFisher exact two-sided、RR、risk differenceを報告する。

これらは**preregistered secondary**であり、どの結果であってもpaired game-level McNemar condition decisionまたはglobal IUT decisionを置換・救済・反転しない。

## 9. 実行ロック

事前登録:

- `config/experiments/phase-transition-search-profile-generalization-v1.json`

execution policy:

- `config/experiments/phase-transition-search-profile-generalization-execution-policy-v1.json`
- `formalExecutionAllowed: false`
- GitHub Actions formal run: prohibited

E-011/E-017/E-018のformal authorizationおよびexecution lockはE-019へ継承しない。

E-019 formal corpus生成には、今後次をすべて要求する。

1. E-019 runner/analyzer/verifier/evaluatorの実装
2. deterministic fixtureとinfrastructure validation
3. fixed-local runtime/worktree preflight
4. **E-019固有の明示的formal開始承認**
5. E-019専用execution lock
6. lock後にのみfixed-local formal generation

現時点ではformal corpusを生成しない。

## 10. 次工程

次はE-019 infrastructure implementationである。

E-018実装を再利用可能な部分は利用するが、E-019固有の3-stratum corpus contract、nested seed ranges、condition identity、pairing integrity、IUT/Holm evaluatorを実装し、小規模fixtureのみで検証する。

fixtureではE-019 formal seed block `20268001–20274500`を使用せず、formal outcomeを先に観測しない。

実装・fixture・infrastructure validation完了後も、明示的開始承認なしにformal corpus生成へ進まない。
