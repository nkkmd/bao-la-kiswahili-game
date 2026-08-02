# E-019 事前登録 v2 訂正チェックポイント

更新日: 2026-08-02  
Experiment: `E-019`  
Hypothesis: `H17`  
analysisVersion: `17-search-profile-generalization`  
Status: Preregistered v2 / formal not authorized / formal corpus not generated

## 訂正理由

E-019 infrastructure implementation前の独立再計算で、v1の`sampleSizeDesign.referenceAvailability`に記載した5つの参考Nだけに数局の転記・探索誤差があることを確認した。

訂正前:

- discordance 0.5%: 5576
- discordance 0.75%: 3718
- discordance 1%: 2788
- discordance 2%: 1394
- discordance 3.6%: 775

二項分布で`P(D >= 20) >= 0.95`を満たす最小Nを再計算した訂正値:

- discordance 0.5%: **5572**
- discordance 0.75%: **3713**
- discordance 1%: **2784**
- discordance 2%: **1390**
- discordance 3.6%: **770**

## 変更していない事項

この訂正は参考欄のみであり、E-019の科学条件は変更していない。

- D1: 6500 paired seeds
- D3: 4500 paired seeds
- V2: 2000 paired seeds
- total games: 26000
- formal seed ranges
- candidate/regime thresholds
- `pliesRemaining >= 9`
- paired game-level binary endpoint
- exact two-sided McNemar
- component alpha 0.05
- minimum discordant pairs 20
- direction `phase2-only > legacy-only`
- IUT global decision
- Holm-Bonferroni standalone inference
- structural secondary boundary
- interpretation boundary

選択済みNにおけるplanning valuesも再計算と一致し、変更していない。

| stratum | N | P(discordants >=20) | unconditional exact-McNemar power |
|---|---:|---:|---:|
| D1 | 6500 | 0.992636 | 0.918904 |
| D3 | 4500 | 0.995893 | 0.931194 |
| V2 | 2000 | 0.999843 | 0.968665 |

## バージョン管理

v1は履歴として残し、黙って上書きしない。

正本となる訂正版:

- `config/experiments/phase-transition-search-profile-generalization-v2.json`
- `config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`

v2 policyはv2 preregistrationを参照する。formal corpusおよびformal execution lockはまだ存在しない。

この訂正はE-019 outcomeを見た変更ではない。E-019 formal seed blockは未使用であり、正式データ生成前の計算監査による訂正である。
