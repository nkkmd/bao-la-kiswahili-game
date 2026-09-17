# Research Generation 4 — G4-01 repository consistency audit

日付: 2026-09-18  
Agenda: `G4-01`  
Study: `LGTTCI-STUDY1`

## 判定

`PASS / CURRENT-FACING-DOCUMENTS-SYNCHRONIZED / MAIN-NOT-MERGED`

G4-01のformal closure後、`main`統合前のrepository-wide consistency auditを実施した。

## 確認した正本

- `doc/local-game-tree-geometry-transfer-compatibility-instrument/README.md`
- `doc/local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md`
- `doc/local-game-tree-geometry-transfer-compatibility-instrument/RESUME_HERE.md`
- `doc/local-game-tree-geometry-transfer-compatibility-instrument/results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json`
- `doc/local-game-tree-geometry-transfer-compatibility-instrument/results/stage-1r/README.md`
- `doc/research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/RESUME_HERE.md`
- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`

## audit前に見つかった更新漏れ

次のcurrent-facing文書がG4-01開始前の状態を保持していた。

1. root `README.md`
   - Research Generation 4をProgram計画のみの状態として記載
   - 次の作業をpre-G4-01 authorization reviewとして記載
2. `doc/RESEARCH_INDEX.md`
   - G4-01を`CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED`として記載
   - Research Generation 4全体をscientific execution未承認として記載
   - AI Engineeringの説明が`PBAI-P1`・`PBAI-P2`までの古い表現
3. `doc/FUTURE_RESEARCH_AGENDA.md`
   - G4-01を未承認の最初の候補として記載
   - Research Generation 4をscientific execution未承認として記載

## 修正内容

root `README.md`:

- G4-01 `LGTTCI-STUDY1`の完了を反映
- `COMPATIBILITY-ELIGIBLE-ALL`をcompatibility/readiness限定の結果として記載
- G4-02/G4-03/G4-04をeligibility gate satisfied / not authorizedとして記載
- 次の科学作業をpost-G4-01 authorization reviewへ更新
- G4-01入口へのリンクを追加

`doc/RESEARCH_INDEX.md`:

- 更新日を2026-09-18へ更新
- G4-01を正式Studyとして中央索引へ追加
- G4-02/G4-03/G4-04のdependency状態を更新
- AI Engineeringを`PBAI-P1`〜`PBAI-P12`、現在`AI-GEN4`の説明へ更新
- 既存Studyリンクを再監査し、CRCLGRリンクの転記ミスを修正

`doc/FUTURE_RESEARCH_AGENDA.md`:

- Versionを`5.1.0`、更新日を2026-09-18へ更新
- G4-01完了を現在地へ反映
- G4-02/G4-03/G4-04を次のWave A候補として整理
- G4-01の結果をgeneralization/effect/counterexample結果へ拡張しない境界を明記
- 推奨program順序をG4-01完了後へ同期

## 整合性確認

最終状態は次で一致する。

```text
G4-01 / LGTTCI-STUDY1 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
SILGM = compatible
GCLD = compatible
source coverage = 1536 / 1536
paired reserve use = 0
seed-free measurements = 22 / 22 success
recovery run = 35265290422 / success
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
G4-02 / G4-03 / G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
public AI change authorized by G4-01 = false
main integration = NOT AUTHORIZED
```

`COMPATIBILITY-ELIGIBLE-ALL`をfresh-domain generalization、scientific effect、counterexampleのformal resultとして扱う記述はcurrent-facing文書に置かない。

## freeze文書の扱い

`doc/research-generation-4/PROGRAM_PLAN.md`などprospectiveにfreezeした計画・preregistration・authorization/binding文書は、事後結果に合わせて書き換えない。historical recordとして保持し、現在状態は`CURRENT_STATUS.md`、入口README、checkpoint、中央索引で表現する。

## 結論

G4-01のcurrent-facing主要文書について、formal result、closure、Program状態、後続authorization境界の不整合は解消した。

このcheckpointは`main`統合を承認しない。PR #151はユーザーの明示的な統合指示まで未mergeのまま保持する。
