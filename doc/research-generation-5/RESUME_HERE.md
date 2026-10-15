# 第五世代研究 — 安全な再開位置

> 2026-10-15の再開監査: [保存済みG5-05の重複除外監査](resume-audit-20261015/README.md)で採用35代表・8候補の選定差0件を確認した。旧実行器の不足は保持・記録し、原実行を繰り返さない。現在checkoutの保存監査には[現在用の手順](../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を使う。BEFCSと正式関係は未登録・未実行である。

更新日: 2026-10-15（日本時間）
再開点: **中間保存main統合後／全起動保存予算と科学処理の統合前**

## 最初に確認する記録

1. [中間保存](checkpoint-20261014/README.md)、[現在状態](CURRENT_STATUS.md)、[研究入口](README.md)を読む。
2. [main統合記録](checkpoint-20261014/MAIN_INTEGRATION_20261015.md)と[PR #205](https://github.com/nkkmd/bao-la-kiswahili-game/pull/205)を読み、現在のmainが統合コミット44d7dafを祖先に持つことを確認する。[元head・変更範囲](checkpoint-20261014/INTEGRATION_SCOPE.json)と凍結証拠を照合する。統合後の文書追補により現在treeは変わるため、統合時treeと現在treeの同一性を再開条件にしない。
3. 第3版の全5原ZIP・3,361 fileと二経路の検算結果を保存済みbyteから確認する。旧10原artifact・失敗3件、期限後回収・最終mirrorなし・未ACK 1を保持する。技術取引や生成器を再起動しない。
4. 過去の案内はcheckpointの原snapshotと元コミットを参照する。旧案内の「次工程」を最新の再開条件として使わない。

## 次に進める工程

1. 外側checkout・起動から終了・artifact保全まで、全資源と単一時計を含む実行基盤を検証する。期限caseの回収を期限内完了へ読み替えない。
2. 科学reference API、固定初期状態、source・独立source、全合法手閉包と途中closure/microstate停止証拠を統合する。既知fixtureだけで科学seedを読まずに検証する。
3. 最終SPEC・CONTRACT・AUTHORIZATION・入力hash・CI receipt・保護入力・実行前レビュー・専用triggerを事前固定する。登録案だけで科学hostを開放しない。
4. 条件が全て成立した後、BEFCS-STUDY1の全128 source区画を原子的に取得し、読取前consumeとattempt 1固定で一度だけ供給を実行する。最大8候補を閉包前に固定する。
5. 供給結果と勝敗価値差・情報量を独立検算し、準備成立を判定する。不足でも追加・差替え・予算増加・retryをしない。
6. 正式関係へ進む場合は開発用から分離した新規評価対象と判定を事前登録する。主要関係、別対象への成立範囲、反例、終了報告を研究計画に従って進める。

## 維持する境界

BEFCS-STUDY1の科学seed消費0・科学leaseなし・未登録/未実行、正式関係未登録/未実行を出発点とする。G5-01〜G5-05の5区画は消費済み。提案seed 50613001..50613128は今回の保存では読まない。

103355件遮断・全合法手完全閉包・未知・不足時終了を維持し、旧root/witness延長・候補差替え・source追加・上限引上げ・retryをしない。主課題をDTFへ差し替えず、固定有限開発コーパスにIIDやBao一般の推論を適用しない。公開AIの変更・配信は独立の開発工程で判断する。
