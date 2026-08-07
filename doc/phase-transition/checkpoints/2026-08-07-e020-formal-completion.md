# E-020 / H18 formal completion

更新日: 2026-08-07  
Experiment: `E-020`  
Hypothesis: `H18`  
analysisVersion: `18-d3-reversal-replication`  
Status: **formal complete / confirmed**

## 1. 固定scientific contract

E-020はE-019 D3で事後観測された`legacy > phase2`逆転を、独立seed blockでprospectiveに直接再検定した。

- condition: `hard / bao / depth 3`
- P2: `phase2`
- LG: `legacy`
- paired seeds: `4500`
- total games: `9000`
- formal seed: `20275001–20279500`
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- endpoint: eligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上あるか
- test: two-sided exact McNemar
- alpha: `0.05`
- minimum discordant pairs: `20`
- prospective direction: `LG-only > P2-only`

このcontractはformal data generation後に変更していない。

## 2. Locked execution

- source commit: `43ab667403d307e4163aefab631969a43fa897ee`
- preregistration: `config/experiments/phase-transition-d3-reversal-replication-v1.json`
- preregistration SHA-256: `4133410fe7a5bdad9ed8cf84d63ee240373c104adb2a75aa23ea81dd91a63a08`
- execution policy: `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`
- execution-policy SHA-256: `18ff7689b61b73eefc4b08b5f6ff04b12fb7cdf4e2a729238a20e2d83eb97000`
- execution-lock SHA-256: `fbbf4fc758ceacc74118c6ebf9fc65575145788c6231b442d9d3e36a1d64be70`
- formal execution: fixed-local
- GitHub Actions formal generation: not used

Formal corpus:

| Condition | search profile | games | observations |
|---|---|---:|---:|
| P2 | `phase2` | 4500 | 276764 |
| LG | `legacy` | 4500 | 249575 |

両条件は同一formal seed sequenceを共有し、paired opening hashも一致した。

## 3. Formal integrity

Verifier result:

- experiment: `E-020`
- hypothesis: `H18`
- mode: `formal`
- expected games per condition: `4500`
- expected base seed: `20275001`
- `valid: true`
- `errors: []`

全integrity checkが通過した。

- both conditions present
- unique condition config hashes
- common source commit
- source commit matches execution lock
- exact paired seed sequence
- paired opening hashes
- condition identity clean
- trajectory hashes present
- execution mode correct
- lock preregistration hash
- lock policy hash present
- artifact verification

## 4. Preregistered primary result

4500 paired games:

| count | observed |
|---|---:|
| `n00` | 4353 |
| `n01` LG-only | 129 |
| `n10` P2-only | 18 |
| `n11` | 0 |
| discordant pairs | 147 |

Rates / effect:

- P2 event-game rate: `0.004` = **0.40%**
- LG event-game rate: `0.028666666666666667` = **2.8667%**
- paired risk difference P2 − LG: `-0.024666666666666667` = **-2.4667 percentage points**
- discordant odds ratio LG / P2: `7.166666666666667`
- exact two-sided McNemar p: `7.0456833990241785e-22`

Decision checks:

- exact 4500 pairs: pass
- discordants >=20: pass (`147`)
- p <=0.05: pass
- LG-only > P2-only: pass (`129 > 18`)

Formal decision:

> **E-020 / H18 = `confirmed`**

## 5. Preregistered secondary bridge

Secondaryはprimaryを置換・救済・反転しない。

Trajectory-ply deduplicated candidate endpoint:

- P2: expansion `5/42` = `11.90%`
- LG: expansion `13/35` = `37.14%`
- risk difference P2 − LG: `-0.2523809523809524`
- LG / P2 risk ratio: `3.12`
- two-sided Fisher exact p: `0.01413147130729561`

Mechanism bridgeではLG側でcandidate→expansion manifestation率とforced-capture regime lengthが高かったが、これを新しいconfirmatory claimへ昇格しない。

## 6. Local analysis output lifecycle anomaly

Formal `analyze / verify / evaluate`は正常終了し、console上で`valid: true / errors: [] / decision: confirmed`を得た。一方、repository内の既定local analysis root

```text
artifacts/local/phase-transition/d3-reversal-replication-v1
```

はprocess終了後に保持されない事象が再現した。

この事象に対し、formal corpus・execution lock・source commit・preregistration・policy・runtime・N・seed・endpoint・direction・decision ruleを変更せず、同じlocked corpusから各analysis toolの明示`--output`を用いてrepository外へ決定論的に再構築した。

External reconstruction:

```text
/home/oruorane/bao-e020-exports/e020-analysis-final
```

再構築結果は元のformal console resultと完全一致した。

- `EXTERNAL_REBUILD_MATCH=true`
- integrity: `formal / valid=true / errors=[]`
- decision: `confirmed`
- pair count: `4500`
- LG-only: `129`
- P2-only: `18`
- discordants: `147`
- exact McNemar p: `7.0456833990241785e-22`

主要再構築成果物SHA-256:

- integrity: `61a7fc55b6607a02e45d0577981d5277eeea632cbd0da794643734f1ee3e7503`
- paired endpoint: `f64652a0067cd5dc51f958470f43cdef14330b893811af72f57736fd2a439fa6`
- evaluation: `548ee212aaaf7cdadf35856f144e16bdd1eb73c35024970b45898deedbb514d3`
- structural secondary: `f97a0953c6a7eb1afa3de2c287a15b41e5ee21a7d1fab759ad7bd08fe40cbf17`

この保存経路上の事象はscientific contract・formal integrity・primary decisionを変更しない。

## 7. Interpretation boundary

E-020が確認したのは次だけである。

> 固定`hard / bao / depth 3`では、eligible category-A `capture-branch-expansion`のgame-level manifestationはphase2よりlegacyで高い。

E-020は次を主張しない。

- depth全体でlegacyがphase2より高い
- search-profile effectがdepthに対して単調または非単調であることの一般確認
- 一般的なsearch-profile × depth interaction
- 他evaluatorへの一般化
- E-019/H17の事前登録方向の救済

E-019/H17は引き続き`not-confirmed`。E-018/H16のdepth2 `phase2 > legacy` confirmedも変更しない。

## 8. Study 1 Stage A

Stage A「D3 reversal independent confirmation」はE-020/H18により完了した。

固定済みformal decisions:

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`
- E-020: **`confirmed`**

次工程はStudy 1 Stage B「depth/search-profile mechanism」である。Stage BではE-018 depth2とE-020 depth3の逆方向を境界条件として扱うが、結果後にinteractionを自動的なformal claimへ昇格しない。
