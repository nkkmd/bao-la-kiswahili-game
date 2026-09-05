# 2026-09-05 — Research Generation 4研究計画のmain統合完了

## 結論

**`RG4-PROGRAM-PLAN-MAIN-INTEGRATION-COMPLETE`**

Research Generation 4のprospective Program計画、入口文書、現在状態、再開文書、計画固定記録、中央文書同期をPR #103から`main`へ統合した。

```text
Repository = nkkmd/bao-la-kiswahili-game
Planning branch = research/g4-program-plan
Planning branch head = a4e9ca3235be68c4ce691cbd4822e46f367288c3
Pull request = #103
Main merge commit = 692bcb40f52c097ca89bf7fea842b6f77fbdf19e
Merge method = merge
CI checks = 5 / 5 SUCCESS
Scientific execution authorized = none
Scientific evidence generated = none
Scientific seeds accessed = none
```

## 統合した範囲

- `doc/research-generation-4/PROGRAM_PLAN.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/RESUME_HERE.md`
- Program計画固定checkpoint
- 計画策定・統合authorization decision
- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`

## 検証結果

新規・更新した9文書について、次を確認した。

- 英語だけの人間向け見出し: 0件
- 説明済み例外を除く英語の完全な通常説明文: 0件
- 壊れた相対リンク: 0件
- fenced code blockの不整合: 0件
- canonical identifier、decision token、数値、hash、authorization状態の意図しない変更: 0件
- GitHub Actions: 5件すべて`SUCCESS`
- source code・科学成果物の変更: なし

## 統合後も変わらない境界

本統合はProgram計画のrepository反映だけを完了した。次は引き続き未承認である。

- G4-01〜G4-10、G4-P01、G4-H01のscientific execution
- scientific seedへのアクセス
- G3-12のrepair、replay、Stage 2 seed利用
- G3-11 depth 10の再実行
- depth 11へのアクセス
- public AIの変更

次に許可される研究作業は、post-RG3 / pre-G4-01 current-state authorization reviewだけである。
