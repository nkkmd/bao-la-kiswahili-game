# 供給設計 — 再開位置

## 次の工程

[設計](DESIGN.md)と[報告](REPORT.md)を起点に、別IDの新規開発供給Studyを実装する。今回の284既読nodeを候補として再利用しない。新しい方式の成功・完全閉包・価値差は未確認である。

1. 全64 sourceの512 ply上限軌跡、独立全手screen、最後の構造適格root固定、source失敗時の候補破棄、旧58532状態遮断を実装する。
2. source/screen/代表/全閉包を独立に再生できるverifier、サイズ・RSS・時間の監視、停止witness、checkpoint/圧縮保存を用意する。
3. 新規Study ID・未使用区画・固定仕様・認可・source manifest・資源・終了条件を登録する。fixture限定CI合格・ソース固定後に別triggerとseed読取前の永続leaseを使い、attempt 1だけを実行する。
4. 全候補を記述して固定区画で終了する。部分閉包や価値差不足でも候補置換・補充・上限引上げ・retryはしない。開発結果を正式holdoutへ移さない。

主要関係はPRIMARY-READINESS-NOT-MET、正式関係は未登録・未実行である。独立samplingが正当化されるまでは有限コーパス全数記述とし、条件付き93ずつの精度案を使わない。DTFを主課題へ差し替えない。
