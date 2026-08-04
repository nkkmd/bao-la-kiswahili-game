# E-019 固定ローカル正式実験 完了チェックポイント

更新日: 2026-08-05  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Formal complete / `not-confirmed`

## 1. 固定実行情報

E-019は事前登録v2、E-019固有開始承認、fixed-local execution lockを変更せず、固定ローカル環境でformal 26000局を完了した。

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- locked source commit: `73ccd513218d7afa96fa637b366c3af2abca6323`
- Node.js: `v24.6.0`
- platform: Linux / WSL2
- Python venv: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- preregistration: `config/experiments/phase-transition-search-profile-generalization-v2.json`
- preregistration SHA-256: `046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8`
- execution policy: `config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`
- execution-policy SHA-256: `47d8b0df17eaa7fb9e878117d973bba91aba6963bbd65cecb8e0bcb0a939495c`
- execution lock status: `prepared-approved`
- execution lock errors: `[]`
- GitHub Actions formal execution: prohibited

Formal strata:

| stratum | evaluator | depth | phase2 games | legacy games | seed range |
|---|---|---:|---:|---:|---|
| D1 | `bao` | 1 | 6500 | 6500 | `20268001–20274500` |
| D3 | `bao` | 3 | 4500 | 4500 | `20268001–20272500` |
| V2 | `bao-v2` | 2 | 2000 | 2000 | `20268001–20270000` |
| total |  |  | 13000 | 13000 | nested-prefix design |

## 2. Formal corpus completion

最終status:

- D1-P2: `6500 / 6500`, manifest present
- D1-LG: `6500 / 6500`, manifest present
- D3-P2: `4500 / 4500`, manifest present
- D3-LG: `4500 / 4500`, manifest present
- V2-P2: `2000 / 2000`, manifest present
- V2-LG: `2000 / 2000`, manifest present
- planned total: `26000`

Observation counts:

- D1-P2: 393710
- D1-LG: 310951
- D3-P2: 277876
- D3-LG: 251160
- V2-P2: 112412
- V2-LG: 117587

## 3. Formal integrity

`run-phase-transition-search-profile-generalization-formal.js --phase verify`はformal corpusを有効と判定した。

- `mode: formal`
- all conditions present: true
- unique condition config hashes: true
- common source commit: true
- source commit matches lock: true
- within-stratum seed sequences: true
- paired opening hashes within stratum: true
- nested formal seed prefixes: true
- condition identity clean: true
- trajectory hashes present: true
- execution mode correct: true
- lock preregistration hash: true
- lock policy hash present: true
- artifact verification: true
- errors: `[]`
- **valid: true**

## 4. Preregistered primary endpoint

Primaryは各stratum内のpaired shared-seed game。`pliesRemaining >= 9`でeligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上あればevent=1とした。

各stratumでtwo-sided exact McNemar、component alpha 0.05、minimum discordant pairs 20、direction `phase2-only > legacy-only`を事前登録どおり適用した。

### D1 — `bao / depth 1`

- pairCount: 6500
- `n00`: 6429
- `n01` LG-only: 4
- `n10` P2-only: 67
- `n11`: 0
- discordant pairs: 71
- P2 event-game rate: 1.0308%
- LG event-game rate: 0.0615%
- paired risk difference: +0.9692 percentage points
- discordant odds ratio: 16.75
- exact McNemar two-sided p: `8.735848890518809e-16`
- Holm-adjusted p: `1.7471697781037618e-15`
- condition decision: **`pass`**
- standalone Holm confirmed: **true**

### D3 — `bao / depth 3`

- pairCount: 4500
- `n00`: 4347
- `n01` LG-only: 140
- `n10` P2-only: 13
- `n11`: 0
- discordant pairs: 153
- P2 event-game rate: 0.2889%
- LG event-game rate: 3.1111%
- paired risk difference: -2.8222 percentage points
- discordant odds ratio: 0.09285714285714286
- exact McNemar two-sided p: `4.614222568073049e-28`
- Holm-adjusted p: `1.3842667704219146e-27`
- alpha criterion: pass
- direction `phase2-only > legacy-only`: **fail** (`13 < 140`)
- condition decision: **`fail`**
- standalone Holm confirmed for preregistered P2>LG claim: **false**

D3は単なるavailability不足ではない。discordant pairsは153あり、search-profile差は強く観測されたが、事前登録方向と逆の`legacy > phase2`だったため`fail`とする。結果後に方向条件を反転してH17を救済しない。

### V2 — `bao-v2 / depth 2`

- pairCount: 2000
- `n00`: 1919
- `n01` LG-only: 18
- `n10` P2-only: 63
- `n11`: 0
- discordant pairs: 81
- P2 event-game rate: 3.15%
- LG event-game rate: 0.90%
- paired risk difference: +2.25 percentage points
- discordant odds ratio: 3.5
- exact McNemar two-sided p: `5.204403564731451e-7`
- Holm-adjusted p: `5.204403564731451e-7`
- condition decision: **`pass`**
- standalone Holm confirmed: **true**

## 5. Global formal decision

事前登録global frameworkはintersection-union test (IUT)。D1/D3/V2の全3 stratumが`pass`の場合のみ`confirmed`、1 stratum以上が`fail`なら`not-confirmed`と固定していた。

Observed component decisions:

- D1: `pass`
- D3: `fail`
- V2: `pass`

したがってE-019 / H17のformal global decisionは:

**`not-confirmed`**

H17「捕獲分岐急拡大のsearch-profile依存性は、事前指定したsearch depthおよびevaluator変更下でもphase2優位として維持される」は、3 strataのconjunctionとして確認されなかった。

## 6. Preregistered structural secondary

Structural secondaryはprimary/global decisionを変更しない。

Trajectory-ply deduplicated candidate expansion:

| stratum | P2 | LG | RD | RR | Fisher p |
|---|---:|---:|---:|---:|---:|
| D1 | 12/64 = 18.75% | 4/33 = 12.12% | +6.63pp | 1.5469 | 0.565927217884321 |
| D3 | 6/49 = 12.24% | 17/36 = 47.22% | -34.98pp | 0.2593 | 0.0004792331642727793 |
| V2 | 17/34 = 50.00% | 11/41 = 26.83% | +23.17pp | 1.8636 | 0.05523184537701421 |

D3 secondaryでもlegacy側が高く、primaryの逆方向観測と整合する。ただしsecondaryのFisher結果を用いてprimary decisionやglobal IUTを置き換えない。

## 7. 解釈境界

E-019が示したのは、事前指定した3 strataにおいてsearch-profile effectの方向が一様ではないことである。

直接記録できること:

- D1 (`bao / depth1`)ではphase2 > legacyがformal component `pass`、Holm standaloneもconfirmed。
- V2 (`bao-v2 / depth2`)ではphase2 > legacyがformal component `pass`、Holm standaloneもconfirmed。
- D3 (`bao / depth3`)では事前登録方向が逆転し、legacy > phase2が強く観測されたためcomponent `fail`。
- したがってH17 global conjunctionは`not-confirmed`。

次は主張しない。

- D3逆転を新しいconfirmatory hypothesisとして遡及的に認定すること
- 任意のdepthで単調なsearch-profile効果があること
- 全evaluatorまたは将来のsearch implementationへの一般化
- structural secondaryによるprimary/global decisionの変更

E-019はE-018を再評価する実験ではない。E-018のformal `confirmed`は固定`hard / bao / depth2`範囲で維持する。

既存formal decisionsも維持する。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: **`not-confirmed`**

PR #26は引き続きopen / draftのまま維持する。
