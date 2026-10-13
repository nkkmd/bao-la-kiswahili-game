# 専用host通信手順の再開位置

現在は、科学seedなしのhost状態機械と読取許可順序を固定した位置である。継続指示は有効であり、追加認可を求めるために停止したものではない。

1. 新hostのSOURCE_MANIFEST、PROTECTED_INPUTS、OUTPUT_BINDINGと固定4シナリオを照合し、ドラフトPRの技術CIを確認する。科学用adapterの実行認可へ昇格させない。
2. 科学source・独立source・全閉包workerを専用hostへ結合する。consume receiptをworkerへ渡す前にremote再照合し、科学PRNGをcontainer内だけで初期化する。技術fixtureでは保存済みbyteと抽象fixtureを使い、科学区画を読まない。
3. 全体1200秒、領域180秒、1 GiB・swap追加分なし、256 MiBと16 MiB reserve、累積mirror容量、強制終了、子process排除、通信不明、終了mirror不成立、残余予算不足を全体結合で確認する。host資源も別記録へ残す。
4. 最終科学SPEC・契約・認可範囲・全入力hash・CI receipt・保護入力・実行前レビューを固定する。operations.executionRefとregistryRefを明示し、実行codeのmanifest対象漏れを監査する。提案seed/ID/namespaceを最新状態と再照合する。
5. 全条件成立後にだけ科学専用triggerを設置し、全128 sourceのleaseを永続確保する。attempt 1、読取前consume、常時/終了mirrorによる一度限り実行と既存byteの独立検算へ進む。科学seed読取り前の技術合格を実行認可と読み替えない。

BEFCS-STUDY1、BEFCS-S1-SUPPLY-2026-10-13-v1、seed案50613001..50613128は未予約・未消費である。最大8候補、ply 48以後の第一適格root、103355件遮断、全合法手完全閉包、未知の保持、不足/0/停止でも追加・差替え・上限引上げ・retry禁止、正式関係未登録/未実行と主課題、main・公開AI未変更を保持する。
