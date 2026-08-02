# E-018 最終formal bundle監査

更新日: 2026-08-02  
Experiment: `E-018`  
analysisVersion: `16-search-profile-dependence`  
Status: Final bundle audited / formal `confirmed`

## 1. 受領ファイル

最終formal成果物archiveと、そのローカルSHA-256記録を受領して照合した。

- archive: `e018-final-formal-evaluation.tar.gz`
- supplied SHA-256 file: `e018-final-formal-evaluation.tar.gz.sha256`
- archive SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- supplied SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- SHA-256 match: **yes**

共有時のアップロード名には重複回避の`(1)`が付いていたが、SHA-256はローカル保存時の`e018-final-formal-evaluation.tar.gz`に対する記録と完全一致した。

## 2. Archive構造監査

- tar member count: `4046`
- unsafe path member: `0`

archive内に次の必須成果物が存在することを確認した。

- `artifacts/phase-transition/search-profile-dependence-v1/execution-lock.json`
- `artifacts/local/phase-transition-search-profile-dependence-v1/integrity/search-profile-dependence-integrity.json`
- `artifacts/local/phase-transition-search-profile-dependence-v1/evaluation/search-profile-dependence-result.json`
- `config/experiments/phase-transition-search-profile-dependence-v1.json`
- `config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json`
- P2/LG formal corpusおよびanalysis outputs

## 3. Formal integrity再確認

archive内のintegrity結果を直接再確認した。

- experimentId: `E-018`
- analysisVersion: `16-search-profile-dependence`
- mode: `formal`
- P2: 2000 games / 110985 observations
- LG: 2000 games / 115785 observations
- common source commit: true
- source commit matches lock: true
- exact paired seed sequence: true
- paired opening hashes: true
- condition identity clean: true
- trajectory hashes present: true
- artifact verification: true
- errors: `[]`
- **valid: true**

## 4. Formal evaluation再確認

archive内の正式評価結果を直接再確認した。

- decision: **`confirmed`**
- pairCount: `2000`
- `n00`: 1928
- `n01`: 9
- `n10`: 63
- `n11`: 0
- discordantPairs: 72
- P2 event rate: 0.0315
- LG event rate: 0.0045
- paired risk difference: 0.027
- discordant odds ratio: 7.0
- exact McNemar two-sided p: `4.1812279092751445e-11`
- exact pair count: pass
- minimum discordant pairs: pass
- alpha criterion: pass
- direction P2 > LG: pass

このbundle監査はE-018の判定条件を変更せず、完了済みformal `confirmed`結果と保存archiveの一致を確認する工程である。

## 5. 固定事項

E-018最終formal archiveの識別値を次として固定する。

- archive: `e018-final-formal-evaluation.tar.gz`
- SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- member count: 4046
- unsafe path member: 0
- formal integrity: `valid: true`
- formal decision: **`confirmed`**

E-010 `not-confirmed`、E-011 `inconclusive`、E-017 `not-confirmed`は変更しない。E-018のprimary endpoint、McNemar rule、解釈境界も結果後に変更しない。

PR #26は引き続きopen / draftのまま維持する。
