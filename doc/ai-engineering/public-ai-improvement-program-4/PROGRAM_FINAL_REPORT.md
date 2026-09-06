# PBAI-P4 — 最終報告

## 結論と意味

正式判断は `STRENGTH-NON-ESTIMABLE / HOLD`。公開判断は `NO-RELEASE / KEEP-AI-GEN2 / AWAITING-USER-INSTRUCTION` である。全体wall-clock上限4時間の監視漏れにより、最終holdoutを途中で停止した。棋力改善も「速度だけ改善した」というProgram全体の正式判定も付与しない。正確性と前段の速度改善は観測できたが、全工程の成立とは区別する。

## 何を変更したか

唯一の候補PBAI-C011-v1は、共通ルール処理から返すイベントの表示用stateだけを探索中に省く。捕獲量・連鎖数などは維持した。通常のapplyMoveと詳細イベントの既定動作、UIアニメーション、評価重み、着手順、枝刈り、時間配分、置換表、終局判定は維持した。探索インスタンスの関数束縛を再利用するが、手番をまたぐ探索結果の保存は追加していない。

探索経路の事前計算、JSONコピーの置換、小型学習評価、学習による着手順予測、手番間の計算結果再利用は実装していない。PBAI-P1〜P3、C001〜C010、Research Generation 4から独立した検証である。

## 正確性と固定深度

3,620状態、14,222遷移、741,774イベントで不一致0。通常経路を固定baselineへ比較し、全合法variant、houseChoice、最終状態の全field、必要イベント、入力非破壊を確認した。イベントの数量再生は候補をimportしない別処理で検算した。Namua→Mtaji、捕獲連鎖、nyumba stop/use、pass、front-empty、no-move、relay-limitを含む。relay-limitは1穴1024個の人工盤面で実際の512上限へ到達させた境界試験であり、到達可能な実戦盤面とは主張しない。

development32、validation32、holdout64のrootでhard/expertのD2/D3を時間切れなしで比較し、baseline・flag-off・flag-onの選択手とelapsedMs以外の全statsが一致した。速度反復の全結果も同じhard D3の計算結果へ独立に照合した。後段の記録が一致しても、資源条件違反を解消したことにはならない。

## 速度と同じ時間枠での探索

各rootの6反復中央値のcandidate/baseline比をphase別に集計した。比が小さいほど短時間である。

| split | Namua中央値比 | Mtaji中央値比 | root反復p95比の全root p95 | 観測の扱い |
| --- | ---: | ---: | ---: | --- |
| development | 0.1731 | 0.2589 | 0.3582 | 前段PASS |
| validation | 0.1684 | 0.2381 | 0.3547 | 前段PASS |
| holdout | 0.1730 | 0.2243 | 0.3174 | 資源停止Program内の参考観測 |

前段では同等計算の時間短縮を確認した。全splitを有効に完了する条件が成立していないため、正式token `EQUIVALENT-COMPUTATION-SPEEDUP` は付与しない。測定範囲を超える一般的な高速化倍率や、snapshot処理の費用割合を断定しない。

validationの平均到達深度はhard 500ms/D8で5.96875→7.3125、expert 2000ms/D12で8.15625→10.21875だった。運用gateは通過した。holdoutの参考値はhard 6.03125→7.390625、expert 8.1875→10.21875。深く読めたことを棋力改善の証明に使わない。

holdoutのp95実時間はhard 507.56→501.32ms、expert 2008.54→2019.66ms。期限超過率はhard 0.015625→0.015625、expert 0→0.015625。探索内部のtimeout率とは別集計である。各反復のheapUsed前後・rssと全statsはarchiveへ保存した。同一プロセス内の最大観測rss比は1であり、独立した必要メモリが同じという意味ではない。JIT・GCを含む観測で、強制GCは行わなかった。

## 対局と停止理由

development16局は12勝4敗、validation32局は22勝10敗で次段階条件を通過した。最終対局は100ms/D8、先後交換256ペア512局を固定していた。deadline開始位置は公開実装と同じで、root準備後に探索の時間を計るため、関数呼出し全体の厳密な100ms制限ではない。

停止時点は177ペア354局、未完了markerはpair-177.json.started。完了分は233勝121敗0分で、177clusterだった。Namua103ペア、Mtaji74ペアという未完全集団であり、この部分勝率や保存済みの参考区間から正式な棋力判断はしない。512局、200cluster、各phase128openingを満たさない。残り158局は未完了・未実行であり、効果なしではない。

遅くともdevelopment開始の05:22:48.478Zから4時間で09:22:48.478Zが上限だった。09:44:03.788854Zの停止記録時点で既に超過していた。チャット中断を後から資源計算から除外しない。runnerには1探索・1局の上限確認があったが、全体wall-clockの監視がなかった。これは実行管理の不備である。発見後に進行中プロセスを停止し、候補とseedを変えず閉じた。終了済みの本Programを誤って再実行しない停止guardを追加したが、測定時から存在したと主張しない。

## 独立検証と適用範囲

source再生成と棋譜再生は測定runnerの選択処理をimportせず、固定baselineで行った。holdoutは387 source seed、320採用root、354局10,732着手を再構成し、不一致0。Pythonの別集計も数値を検算し、資源停止とreadiness不足から同じHOLDを返した。過去の研究holdoutや保護seedは新規評価へ流用していない。既存戦術fixtureは既知互換性確認である。

Node v24.19.0、Linux x64、AMD EPYC 9V74で測定した。global scriptのVMと実worker_threadsによるWorker経路、キャンセル、flag対象外・既定値、既存回帰を確認した。実Chromium、スマートフォン、標準500msでの対局棋力、実サイト配信byte identityは未検証である。高資源探索の選択手を真の最善手とは扱っていない。

## 公開・再開・レビュー

mainの開始HEADは548ccead3965fa98602d99c8b3e2a49fbeeed093。候補は隔離ブランチで既定無効、公開AIはAI-GEN2のままである。契約・baseline source hash・全観測・消費seed・独立検算を保存した。過去Programの正式結果は変更していない。

本Programの対局継続や近似候補への改名は認可されていない。再評価には資源管理の是正と、新規データ・ID・認可レビューを含む別の明示的指示が必要であり、今回のholdoutを未使用扱いにしない。PRでは実装の共通ルール維持、停止判断、証拠の完全性、CI範囲変更をレビューする。main統合・公開変更は別途指示まで行わない。

正本は[機械可読の最終判断](FINAL_RESULT.json)、[再現手順](REPRODUCIBILITY_INDEX.md)、[停止記録](../../../artifacts/pbai-p4/RESOURCE_STOP.json)、[holdout証拠索引](../../../artifacts/pbai-p4/holdout-summary.json)である。
