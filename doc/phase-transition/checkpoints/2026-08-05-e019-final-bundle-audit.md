# E-019 最終formal bundle監査

更新日: 2026-08-05  
Experiment: `E-019`  
analysisVersion: `17-search-profile-generalization`  
Status: Final bundle audited / formal `not-confirmed`

## 1. 最終保管ファイル

E-019 final formal成果物をrepository外へ固定した。

WSL保管先:

```text
/home/oruorane/bao-e019-exports/
```

Windows参照先:

```text
\\wsl.localhost\Ubuntu\home\oruorane\bao-e019-exports
```

最低保管構成:

```text
bao-e019-exports/
├── e019-final-formal-evaluation.tar.gz
└── e019-final-formal-evaluation.tar.gz.sha256
```

## 2. SHA-256監査

- archive: `e019-final-formal-evaluation.tar.gz`
- archive size reported by `ls -lh`: `321M`
- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- checksum verification: `e019-final-formal-evaluation.tar.gz: OK`

`.sha256`はarchive basenameを記録する形式で生成され、保管ディレクトリ内で`sha256sum -c`に成功した。

## 3. Archive構造監査

`tar -tzf`による監査:

- member count: `26120`
- absolute pathまたは`..`を含むunsafe path member: `0`

したがって、提示されたarchive member path監査ではunsafe pathを検出しなかった。

## 4. Bundle対象

final archiveはE-019 fixed-local formal executionの次を含む構成で生成された。

- `artifacts/phase-transition/search-profile-generalization-v2`
- `artifacts/local/phase-transition-search-profile-generalization-v2`
- `config/experiments/phase-transition-search-profile-generalization-v2.json`
- `config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json`

Formal completion checkpoint:

- `doc/phase-transition/checkpoints/2026-08-05-e019-formal-completion.md`

## 5. Formal resultとの対応

archive固定前にE-019 formal corpusは全26000局完了し、formal integrityは次を通過した。

- `mode: formal`
- `valid: true`
- `errors: []`
- source commit matches execution lock
- within-stratum exact seed pairing
- paired random-opening hashes
- nested formal seed prefixes
- condition identity separation
- preregistration/policy lock checks
- artifact verification

Formal global decision:

**`not-confirmed`**

Component decisions:

- D1: `pass`
- D3: `fail`
- V2: `pass`

D3では`phase2-only=13`、`legacy-only=140`となり、事前登録方向`phase2 > legacy`と逆方向だった。これを結果後に方向条件変更で救済しない。

## 6. 固定識別値

E-019 final formal archiveの識別値を次として固定する。

- archive: `e019-final-formal-evaluation.tar.gz`
- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- member count: `26120`
- unsafe path member: `0`
- reported archive size: `321M`
- formal integrity: `valid: true`
- formal decision: **`not-confirmed`**

保存監査は科学条件・事前登録・formal decisionを変更しない。

既存判定を維持する。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

PR #26はopen / draftのまま維持する。
