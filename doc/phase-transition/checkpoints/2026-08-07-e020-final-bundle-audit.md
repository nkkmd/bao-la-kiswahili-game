# E-020 最終formal bundle監査

更新日: 2026-08-07  
Experiment: `E-020`  
Hypothesis: `H18`  
analysisVersion: `18-d3-reversal-replication`  
Status: Final bundle audited / formal `confirmed`

## 1. 最終保管ファイル

E-020 final formal成果物をrepository外へ固定した。

WSL保管先:

```text
/home/oruorane/bao-e020-exports/
```

Windows参照先:

```text
\\wsl.localhost\Ubuntu\home\oruorane\bao-e020-exports
```

最低保管構成:

```text
bao-e020-exports/
├── e020-analysis-final/
├── e020-key-artifacts.sha256
├── e020-final-formal-evaluation.tar.gz
└── e020-final-formal-evaluation.tar.gz.sha256
```

## 2. Archive SHA-256監査

- archive: `e020-final-formal-evaluation.tar.gz`
- reported size: `116M`
- SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`
- checksum verification: `e020-final-formal-evaluation.tar.gz: OK`

`.sha256`はarchive basenameを記録する形式で生成され、保管ディレクトリ内で`sha256sum -c`に成功した。

## 3. Archive構造監査

`tar -tzf`による監査:

- member count: `9049`
- absolute pathまたは`..`を含むunsafe path member: `0`

必須memberの存在を確認した。

- `artifacts/phase-transition/d3-reversal-replication-v1/execution-lock.json`
- `config/experiments/phase-transition-d3-reversal-replication-v1.json`
- `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`
- `e020-analysis-final/integrity/d3-reversal-replication-integrity.json`
- `e020-analysis-final/paired-game-endpoints.json`
- `e020-analysis-final/evaluation/d3-reversal-replication-result.json`
- `e020-analysis-final/structure/d3-reversal-structural-secondary.json`

したがって、提示されたarchive member path監査ではunsafe pathを検出せず、必要なformal corpus / lock / config / analysis成果物がfinal bundleに含まれる。

## 4. Bundle対象

final archiveはE-020 fixed-local formal executionの次を含む構成で生成された。

- `artifacts/phase-transition/d3-reversal-replication-v1`
- `config/experiments/phase-transition-d3-reversal-replication-v1.json`
- `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`
- repository外再構築analysis正本 `e020-analysis-final`

Formal completion checkpoint:

- `doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md`

## 5. Key artifact SHA-256

- execution lock: `fbbf4fc758ceacc74118c6ebf9fc65575145788c6231b442d9d3e36a1d64be70`
- preregistration: `4133410fe7a5bdad9ed8cf84d63ee240373c104adb2a75aa23ea81dd91a63a08`
- execution policy: `18ff7689b61b73eefc4b08b5f6ff04b12fb7cdf4e2a729238a20e2d83eb97000`
- integrity: `61a7fc55b6607a02e45d0577981d5277eeea632cbd0da794643734f1ee3e7503`
- paired game endpoints: `f64652a0067cd5dc51f958470f43cdef14330b893811af72f57736fd2a439fa6`
- primary evaluation: `548ee212aaaf7cdadf35856f144e16bdd1eb73c35024970b45898deedbb514d3`
- structural secondary: `f97a0953c6a7eb1afa3de2c287a15b41e5ee21a7d1fab759ad7bd08fe40cbf17`

## 6. Archive内primary result監査

archiveを展開せず、`tar -xOzf`でprimary result JSONを抽出して確認した。

- decision: `confirmed`
- pair count: `4500`
- LG-only: `129`
- P2-only: `18`
- discordant pairs: `147`
- exact McNemar two-sided p: `7.0456833990241785e-22`

archive内resultはformal execution時およびrepository外決定論的再構築時のprimary resultと一致した。

## 7. Local analysis output lifecycle anomaly

Repository内既定local analysis rootがprocess終了後に保持されない事象が観測されたため、同一formal corpus・同一execution lock・同一source commit・同一runtimeから各analysis toolの明示`--output`を用い、repository外へanalysis成果物を再構築した。

- external analysis root: `/home/oruorane/bao-e020-exports/e020-analysis-final`
- reconstruction check: `EXTERNAL_REBUILD_MATCH=true`

この再構築ではformal corpusを再生成していない。N、seed、endpoint、direction、alpha、minimum discordants、decision rule、preregistration、policy、locked sourceを変更していない。

## 8. Formal resultとの対応

Formal integrity:

- `mode: formal`
- `valid: true`
- `errors: []`
- all integrity checks passed

Formal decision:

> **E-020 / H18 = `confirmed`**

Primary:

- `n00=4353`
- `n01 (LG-only)=129`
- `n10 (P2-only)=18`
- `n11=0`
- discordants `147`
- P2 rate `0.40%`
- LG rate `2.8667%`
- paired RD P2−LG `-2.4667pp`
- discordant OR LG/P2 `7.1667`
- exact two-sided McNemar p `7.0456833990241785e-22`

この結果は`hard / bao / depth3`に限定する。E-019/H17 `not-confirmed`を変更せず、一般的depth interactionを自動的にconfirmしない。

## 9. 固定識別値

E-020 final formal archiveの識別値を次として固定する。

- archive: `e020-final-formal-evaluation.tar.gz`
- SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`
- member count: `9049`
- unsafe path member: `0`
- reported archive size: `116M`
- formal integrity: `valid: true`
- formal decision: **`confirmed`**

保存監査は科学条件・事前登録・formal decisionを変更しない。

固定済みformal decisions:

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`
- E-020: **`confirmed`**

Stage Aは完了し、次工程はStage B depth/search-profile mechanismである。

PR #26はopen / draftのまま維持する。
