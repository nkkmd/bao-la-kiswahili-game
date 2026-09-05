# 2026-09-05 — Research Generation 4計画策定・統合authorization

## 判断

**`RG4-PLANNING-AND-MAIN-INTEGRATION-AUTHORIZED`**

ユーザーの明示的指示に基づき、推奨された第四世代研究の方向をprospective program planとして文書化し、関連するcurrent-facing文書を同期したうえで、PRを通じて`main`へ統合することを承認する。

```text
Repository = nkkmd/bao-la-kiswahili-game
Authorization date = 2026-09-05
Baseline main = ed30395d98e4dd43cbbc5435752b9ba1943d789e
Authorized branch = research/g4-program-plan
Authorized work = program planning, documentation synchronization, PR, main integration
Scientific execution authorized = none
Scientific seed access authorized = none
Public AI change authorized = false
```

## 承認する作業

1. `doc/research-generation-4/`にProgram入口、研究計画、現在状態、再開文書、計画固定checkpointを作成する。
2. root `README.md`、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`を第四世代の計画状態へ同期する。
3. 日本語品質、相対リンク、canonical ID、authorization状態、第三世代closureとの整合を監査する。
4. planning branchからPRを作成し、監査PASS後に`main`へ統合する。
5. 統合後のcurrent `main`を再確認し、必要なintegration-status syncを別PRで行う。

## 承認しない作業

- G4-01〜G4-10、G4-P01、G4-H01のscientific execution
- scientific seedの生成、読取、消費
- G3-12のrepair、replay、Stage 2 seed利用
- G3-11 depth 10の再実行
- depth 11へのアクセス
- closed Studyの再判定
- symmetry / canonicalizationの利用
- public AIの変更または新しいAI世代の採用

## 次の研究authorization

計画統合後に自動的に開始されるStudyはない。最初の候補`G4-01 — Claim-Transfer Compatibility Instrument Foundation Study 1`について、current-state authorization reviewを別途実施し、明示的な`AUTHORIZED`判断を得た場合にのみStudy contractを固定できる。
