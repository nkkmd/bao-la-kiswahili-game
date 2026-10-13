# 専用host通信手順の報告

## 現在の結論

読取許可までのhost状態機械を実装し、新規10テストが合格した。全128論理markerを保存後、remote receipt・lease・markerを再照合してから許可を返す。必要mirror失敗、consume保存後の応答不明、remote receipt不一致、重複Stage、最終mirror失敗、順序・binding不一致、残余予算不足では次の読取りを許可しない。

科学専用transportの未固定拒否・生commit非公開を確認する追加1テストも合格した。最終実装の新規11件と既存58件、計69テストがすべて合格した。既存技術registryの科学範囲拒否を変更せず、科学専用transportへ分離した。

固定4シナリオの件数と保存hashは[結果](results/RESULT.json)、Git履歴は[圧縮証拠](results/TECHNICAL_EVIDENCE.json.gz)へ保存する。[入力manifest](SOURCE_MANIFEST.json)、[保護入力](PROTECTED_INPUTS.json)、[出力binding](OUTPUT_BINDING.json)で実装・契約・原記録・結果を結び付ける。科学PRNGと新規Bao遷移は呼んでいない。

通常ケースは138 commit・128 marker・9 mirrorで、128許可を返した。必要mirror失敗はleaseの1 commitだけでmarker/許可0件、consume応答不明は4 markerを保持し許可は3件、終了mirror失敗は3 marker・3許可を保持して停止した。全4保存bundleの独立履歴・blob検算が一致した。

## 完了と未完の分離

全区画取得と読取前記録のhost順序、保存後のremote再照合、失敗後の再開拒否を確認した。科学adapterは最終gate不在でGit接続前に拒否する。trigger条件のunit検査は行ったが、科学workflowを設置・起動した結果ではない。

科学source・独立source・全閉包workerを新hostへ結合する処理、worker/containerとhostの全資源監督、実GitHub通信の失敗fixture、最終科学事前固定、実行専用triggerは未完である。既存の保存済み全workloadのcgroup合格を、新しい科学pipelineの合格へ昇格させない。新CIの成立はGitHub上で別途確認する。

## 不変の境界

科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行を保持した。正式な順位変動と勝敗価値損失の関係は未登録/未実行であり、主課題をDTFへ置換しない。103355件遮断、全合法手完全閉包、未知の保持、source追加・root差替え・旧root/witness延長・上限引上げ・retry禁止、main・公開AI未変更を維持する。
