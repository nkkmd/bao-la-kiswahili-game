# E-018 固定ローカル正式実験 完了チェックポイント

更新日: 2026-08-02  
Experiment: `E-018`  
analysisVersion: `16-search-profile-dependence`  
Status: Formal complete / `confirmed`

## 1. 固定実行情報

E-018は事前登録・execution lock・開始承認を変更せず、固定ローカル環境でformal 4000局を完了した。

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`
- Node.js: `v24.6.0`
- platform: Linux / WSL2
- fixed Python environment: `/home/oruorane/.venvs/bao-phase-transition-e011`
- activation: `source ~/.venvs/bao-phase-transition-e011/bin/activate`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- preregistration SHA-256: `17fb28bf250d2218b91d5d6196ec58ac7ba0c8b8d2ced93d498135ea669e4298`
- execution-policy SHA-256: `b1bd2769877989a236f24576ea8e11070fbe573f4f7a92b9c56d3f998b1b9653`
- P2: `hard / bao / phase2 / depth 2`, 2000局
- LG: `hard / bao / legacy / depth 2`, 2000局
- shared seeds: `20265001–20267000`
- total: 4000 paired-condition games

formal run中、runnerが1局ごとの進捗を表示しない仕様を確認するため一度`Ctrl+C`で中断した。中断時点でP2 60局がatomic-write済みだった。既存gameはconfig hash/source commitを検証して再利用し、未完了gameのみ再計算するresume設計に従って同一lock・同一source・同一条件で再開し、4000局を完了した。中断は科学条件、seed、source、config、execution lockを変更していない。

## 2. Formal corpus completion

最終status:

- P2: `2000 / 2000`, manifest present
- LG: `2000 / 2000`, manifest present
- planned total: `4000`

## 3. Formal integrity

`run-phase-transition-search-profile-dependence-formal.js --phase verify`はformal corpusを有効と判定した。

- `mode: formal`
- expected games / condition: 2000
- P2 observations: 110985
- LG observations: 115785
- P2 config hash: `443b975f5f8f2f63f49a49a513ebb9852843c968302190e06d5a4a9f5b9f4dd8`
- LG config hash: `9125d975041589544d4d8cbd372e2f4e0623ead3a5397a3a531874d0f806eb2e`
- both conditions present: true
- unique condition config hashes: true
- common source commit: true
- source commit matches lock: true
- exact paired seed sequence: true
- paired opening hashes: true
- condition identity clean: true
- trajectory hashes present: true
- execution mode correct: true
- lock preregistration hash: true
- lock policy hash present: true
- artifact verification: true
- errors: `[]`
- **valid: true**

## 4. Preregistered primary endpoint

Primary unitはpaired shared-seed game。各conditionでeligible category-A `capture-branch-expansion` candidateが1件以上あればevent=1とした。

2000 pairの結果:

| endpoint | count |
|---|---:|
| `n00` P2=0 / LG=0 | 1928 |
| `n01` P2=0 / LG=1 | 9 |
| `n10` P2=1 / LG=0 | 63 |
| `n11` P2=1 / LG=1 | 0 |
| discordant pairs | 72 |

- P2 event games: 63 / 2000 = **3.15%**
- LG event games: 9 / 2000 = **0.45%**
- paired risk difference: **+2.70 percentage points**
- discordant odds ratio `n10 / n01`: **7.0**
- two-sided exact McNemar p: **4.1812279092751445e-11**

事前登録criteria:

- exact pair count: pass
- minimum discordant pairs >=20: **pass (72)**
- exact McNemar p <=0.05: **pass**
- direction `n10 > n01`: **pass (63 > 9)**

### Formal decision

**`confirmed`**

H16「捕獲分岐急拡大の顕在化はsearch profileに依存する」は、E-018の事前登録primary endpoint上で確認された。

この判定はE-011 C4を事後的に読み替えたものではなく、独立seed block・paired same-opening設計・事前登録McNemar検定によるE-018自身の結果である。

## 5. Preregistered structural secondary

副次解析はprimary判定を変更しない。

### P2

Raw eligible endpoint:

- candidates: 107
- expansion candidates: 63
- controls: 80579
- control expansion: 2449
- candidate expansion rate: 58.88%
- control expansion rate: 3.04%
- RR: 19.37

Trajectory-ply deduplicated:

- unique candidates: 34
- unique expansion: 11
- unique candidate trajectories: 32
- unique expansion trajectories: 11
- unique candidate archetypes: 31
- unique expansion archetypes: 11
- largest trajectory-ply multiplicity: 37
- dedup candidate expansion rate: 32.35%
- dedup control expansion rate: 3.20%
- dedup RR: 10.12

### LG

Raw eligible endpoint:

- candidates: 54
- expansion candidates: 9
- controls: 77567
- control expansion: 1283
- candidate expansion rate: 16.67%
- control expansion rate: 1.65%
- RR: 10.08

Trajectory-ply deduplicated:

- unique candidates: 31
- unique expansion: 7
- unique candidate trajectories: 30
- unique expansion trajectories: 7
- unique candidate archetypes: 28
- unique expansion archetypes: 7
- largest trajectory-ply multiplicity: 5
- dedup candidate expansion rate: 22.58%
- dedup control expansion rate: 1.68%
- dedup RR: 13.43

### Direct trajectory-ply candidate comparison

- P2: 11 / 34 = 32.35%
- LG: 7 / 31 = 22.58%
- risk difference: +9.77 percentage points
- RR: 1.43
- two-sided Fisher exact p: **0.41837226457118804**

このFisher比較は事前登録上のstructural secondaryであり、paired game-level primary McNemar判定を置き換えない。したがってFisher p>0.05を理由にE-018 `confirmed`を変更しない。

## 6. 解釈境界

E-018が直接確認したのは、固定条件 `hard / bao / depth 2`、paired shared openings、P2=`phase2`対LG=`legacy`における**ゲーム単位のcapture-branch-expansion顕在化率のsearch-profile依存性**である。

次は主張しない。

- 全AI evaluator、全depth、全search implementationへの一般化
- trajectory-ply副次比較自体の有意差確認
- E-011 formal global decisionの変更
- E-017 formal decisionの変更

既存formal decisionsは維持する。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: **`confirmed`**

PR #26は引き続きopen / draftのまま維持する。
