# Formal実験 最終成果物保管台帳

更新日: 2026-08-02

保管規則: `doc/phase-transition/FORMAL_EXPORT_STORAGE.md`

この台帳はformal experimentの最終export保管状態を記録する。科学判定、事前登録条件、分析条件を変更するものではない。

| Experiment | Archive | SHA-256 | WSL保管先 | Windows参照先 | 状態 |
|---|---|---|---|---|---|
| E-011 | `e011-final-formal-evaluation.tar.gz` | `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc` | `/home/oruorane/bao-e011-exports/` | `\\wsl.localhost\Ubuntu\home\oruorane\bao-e011-exports` | 保管先確認済み |
| E-018 | `e018-final-formal-evaluation.tar.gz` | `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5` | `/home/oruorane/bao-e018-exports/` | `\\wsl.localhost\Ubuntu\home\oruorane\bao-e018-exports` | final bundle監査済み / 保管先固定 |

## E-011

- formal decision: `inconclusive`
- final archive: `e011-final-formal-evaluation.tar.gz`
- SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- local export directory: `/home/oruorane/bao-e011-exports/`
- Windows: `\\wsl.localhost\Ubuntu\home\oruorane\bao-e011-exports`

## E-018

- formal decision: `confirmed`
- final archive: `e018-final-formal-evaluation.tar.gz`
- checksum file: `e018-final-formal-evaluation.tar.gz.sha256`
- SHA-256: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- local export directory: `/home/oruorane/bao-e018-exports/`
- Windows: `\\wsl.localhost\Ubuntu\home\oruorane\bao-e018-exports`
- final bundle audit: `doc/phase-transition/checkpoints/2026-08-02-e018-final-bundle-audit.md`
- archive member count: 4046
- unsafe path member: 0
- formal integrity: `valid: true`

## 追記規則

新しいformal experimentのfinal bundleを固定したら、次をこの台帳へ追記する。

- experiment ID
- archive filename
- SHA-256
- WSL export directory
- Windows参照先
- final bundle audit checkpoint
- 保管状態

実際の保管を確認していないexperimentについて、推測で保管先を記録しない。
