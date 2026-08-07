# E-020 / H18 D3逆転独立確認 — formal開始承認チェックポイント

更新日: 2026-08-05  
Experiment: `E-020`  
Hypothesis: `H18`  
analysisVersion: `18-d3-reversal-replication`  
Status: **Formal execution authorized / awaiting fixed-local execution lock / formal corpus not generated**

## 1. 明示的開始承認

2026-08-05 18:41 JST、ユーザーからE-020固有の明示的開始指示を受領した。

> E-020の正式実験を開始してください

この指示を、E-020/H18のfixed-local formal executionに限定した開始承認として記録する。

一般的な研究続行指示やE-011/E-017/E-018/E-019の過去承認を流用したものではない。

## 2. 承認時のGitHub状態

承認直前のbranch head:

- branch: `research/forced-capture-regime-analysis`
- head: `6a21f10f147453b4a3c70226d849327502bded6b`
- commit: `docs: sync E-020 research ledgers`

PR #26は引き続きopen / draftを維持する。

## 3. Execution policy state transition

Execution policy:

- `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`

承認により、科学条件を変更せずexecution stateだけを遷移した。

- status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- `formalCorpusGenerated: false`
- `githubActionsFormalRunAllowed: false`
- `formalAuthorization.granted: true`
- approval token: `E-020-FORMAL-APPROVED`

Authorization policy commit:

- `5e01628618d2b37cda8c794e5de51a662a44f6b8`

## 4. 変更していない科学条件

承認は次を一切変更しない。

- hypothesis: H18
- experiment: E-020
- condition: `hard / bao / depth 3`
- P2 search: `phase2`
- LG search: `legacy`
- 4500 paired seeds / 9000 games
- formal seed: `20275001–20279500`
- same seed / same random-opening paired design
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- binary endpoint: eligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上あるか
- test: two-sided exact McNemar
- alpha: `0.05`
- minimum discordants: `20`
- prospective direction: **LG-only > P2-only**
- decision contract
- structural secondary boundary
- mechanism-bridge secondary boundary

P2 > LGへ結果が戻った場合も、H18のprospective directionを結果後に反転しない。

## 5. Formal execution gate

開始承認後も、formal corpus生成前にE-020専用fixed-local execution lockを必須とする。

次の順序を固定する。

1. fixed-local repositoryを最新branch headへ同期
2. research ledgersのauthorization状態を同期しcommit/push
3. clean worktreeを確認
4. fixed Python venvをactivate
5. repository path / branch / Node.js / Python / numpy / pandas / platformを確認
6. E-020専用execution lockを生成
7. lockが `status=prepared-approved`、`errors=[]` であることを確認
8. lockにsource commit / preregistration SHA-256 / execution-policy SHA-256 / runtime / hardware / approval-token hashが固定されたことを確認
9. その後にのみformal corpus generationを開始

execution lock生成前にformal seed `20275001–20279500`を使った自己対局を開始しない。

## 6. GitHub Actions boundary

GitHub Actionsでのformal corpus generationは禁止のまま維持する。

GitHub Actionsは既に完了したnon-formal fixture/infrastructure validationだけに使用した。

- workflow run: `30972650445`
- validated infrastructure head: `124ca132900487c66b44c37df3de99b59849ad0c`
- result: `success`

## 7. 既存formal decisions

変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

E-020 formal decisionはまだ存在しない。

## 8. 次工程

固定ローカル環境でauthorization ledger syncとexecution lock生成を行う。

lock監査成功後にのみ、E-020 formal 9000 gamesを開始する。
