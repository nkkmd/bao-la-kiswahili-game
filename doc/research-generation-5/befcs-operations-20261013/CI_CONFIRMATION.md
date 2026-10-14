# 実cgroup確認の確定記録

2026-10-13、整理済みtree `e20d02406e568979cf1120104620205e70b45bd1`をGitHub commit `dc47116c4d81d773c327efd902b4f3a2d83c6f3c`へ保存した。PR #192はPR #191に積み上げたドラフトであり、mainへ統合していない。

push run [38347787205](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38347787205)とPR run [38347819157](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38347819157)はattempt 1で全stepが合格した。128 MiBと1 GiBの両方で、swap追加分なし、networkなし、OOMKilled、exit 137、fsync済prefix保持を確認した。詳しいjob・workflow・入力hash・artifact識別は[機械receipt](results/CI_RECEIPT_20261013.json)に保存した。receiptは取得したjobログのJSONとartifact APIのmetadataに基づく。

元の[結果](results/RESULT.json)と[出力binding](OUTPUT_BINDING.json)はローカル技術検証時点の固定記録として変更しない。CI確認は本書と別receiptへ追加する。科学seed消費0・科学leaseなし・科学Study未登録/未実行、正式関係未登録/未実行を維持する。

次は科学sourceと独立再生、全閉包保存と運用監督の結合、およびseedを読まない全体負荷fixtureである。このcgroup合格だけでは最終科学SPEC・契約・認可範囲・実行前レビューの条件は成立しない。
