# 認証付きGit技術検証の報告

## 目的と追加範囲

先行envelope工程は接続機能でcommit成立後の応答抑止とhead保持を確認したが、古いexpected SHAのサービスエラーは理由未確認、生Git objectの独立復元も未確認だった。本工程は既存registryとpipeline sessionをそのまま使い、専用技術refへの認証付きGit pushとraw bundle再生を追加する。

## 固定caseと期待する保存

| case | marker | ACK | mirror | 終了状態 |
| --- | ---: | ---: | ---: | --- |
| 正常 | 1 | 1 | 2 | FINISHED |
| 古いexpected SHA | 0 | 0 | 1 | STOPPED・head不変 |
| commit後の応答抑止 | 1 | 0 | 1 | STOPPED・未ACKを保持 |
| consume前のproxy拒否 | 0 | 0 | 1 | STOPPED |
| 終了mirrorのproxy拒否 | 1 | 1 | 1 | STOPPED・最終mirrorなし |

local fixtureでは全caseの生Git bundleを独立再生する。proxy拒否はlocalでは固定例外注入で、実network障害と呼ばない。認証・kernel資源・実proxy拒否のActions結果は取得後に確定する。[結果入口](results/README.md)へ原記録とhashを保持する。

## 解釈の境界

commit後の応答抑止はhost adapterへの故障注入であり、実GitHub応答がnetwork上で失われた実験ではない。実proxy拒否は通信不能時の停止を検証するが、GitHub server障害の全種類を実証しない。

このcgroupはGit host・認証通信・pack・再検算を含むが、共通128 source・監督区画・外側のActions制御・artifact保存を統合していない。科学供給128件の通信費用、全起動から終了保存までの期限、途中科学閉包の検算、最終SPEC/CONTRACT/AUTH/hash/review/別triggerは残る。

科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355遮断・全閉包・未知・救済禁止・正式関係未登録/未実行、主課題の勝敗価値損失、main/公開AI未変更を保持する。
