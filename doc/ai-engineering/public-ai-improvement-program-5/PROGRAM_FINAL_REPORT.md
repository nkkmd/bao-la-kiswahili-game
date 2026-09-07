# PBAI-P5 — 軽量な局面遷移の独立再検証・最終報告

## 結論

正式判断は `STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`。同等計算の短縮についても `EQUIVALENT-COMPUTATION-SPEEDUP` を確認した。新規の最終holdout512局を完了し、328勝184敗0分、勝点率64.0625％だった。先後ペアの相関を考慮したcluster bootstrapの95％区間は61.1328125〜66.9921875％で、事前の改善条件を満たした。

これはNode/Linux上の100ms/D8という固定範囲での改善である。公開AIへ採用・配備したという意味ではない。公開判断は `NO-RELEASE / KEEP-AI-GEN2 / AWAITING-USER-INSTRUCTION`。候補flagは既定false、main未統合、AI-GEN3未昇格のままである。

上記は科学的測定を終了した時点の公開境界である。その後、段階的公開と実サイト確認を完了し、2026年9月7日の明示的指示に基づいて正式判断`ADOPT`、release ID `AI-GEN3-RELEASE-001`、公開AI系統`AI-GEN3`への昇格を別記録として確定した。科学的数値や測定時点の判断を遡及変更しない。後続の正式判断は[AI-GEN3正式昇格判断](PROMOTION_DECISION.md)を参照する。

## 何を再検証したか

P4のPBAI-C011-v1を改名・改修せず、新しい82x seedと別Program PBAI-P5で検証した。探索に不要な表示用event.stateだけを省き、共通ルール処理、捕獲量・連鎖数、評価・着手順・枝刈り・置換表・時間配分を維持した。通常APIとUI向け詳細出力は既定で維持している。経路事前計算、JSONコピー置換、学習、手番間再利用は混ぜていない。

P4の結果を知った再計画であると事前に明示し、P4の開いたsource prefix・系列と対局RAWを除外表へ固定した。P4の354局を今回の成績へ加算していない。P4のHOLD、P1〜P3とC001〜C010の正式結果は変更しない。Research Generation 4から独立した工学検証である。

## 正確性と探索の同等性

新規3,669状態、14,869遷移、756,988イベントで不一致0。合法手variantとhouseChoice、最終RAWの全field、通常の詳細eventと軽量eventの必要情報を照合し、別処理で数量再生した。Namua→Mtaji、捕獲連鎖、nyumba stop/use、pass、front-empty、no-move、relay-limitの全指定境界を通過した。relay-limitは既知の人工盤面による境界確認であり、実戦での到達可能性の証明ではない。

全splitのhard/expert D2/D3で、baseline・flag-off・flag-onの選択手とelapsedMs以外の全statsが一致した。速度測定の各反復も同じhard D3の計算結果へ独立照合した。既知8戦術の回帰も全splitで通過した。既存VM global script・worker_threads・通常API回帰は同一sourceについてP4で確認した既知互換性証拠であり、新しい実機試験とは扱わない。

## 速度と運用

速度は各rootで方式別2回のwarmup後に6反復し、実行順を交互にした。root別中央値のcandidate/baseline比をphase別に集計した値は次のとおりである。

| split | Namua | Mtaji | root p95比の全体p95 |
| --- | ---: | ---: | ---: |
| development | 0.152720 | 0.243976 | 0.327213 |
| validation | 0.148502 | 0.238432 | 0.434513 |
| 最終holdout | 0.151096 | 0.235201 | 0.300417 |

最終holdoutでは同じ計算の時間がNamuaで約15.1％、Mtajiで約23.5％となった。これは観測したrootと実行環境の範囲であり、端末全般の倍率へ一般化しない。両phaseの中央値比0.90以下、p95比1.10以下、観測rss比1.25以下という条件を通過した。GCを強制せず、JIT・GC・環境変動を含めて測定した。

| 標準運用条件 | 平均到達深度 baseline→候補 | p95実時間 baseline→候補 |
| --- | --- | --- |
| hard 500ms/D8 | 5.421875→7.234375 | 507.496→501.378ms |
| expert 2000ms/D12 | 7.453125→9.734375 | 2007.635→2001.739ms |

割当+max(50ms,10％)を超えた率は、両難易度・両方式とも0。探索内部のtimeout率はhard 0.90625→0.421875、expert 0.953125→0.78125で、期限超過率とは別である。最大観測rssは両方式235,421,696 bytes、比は1。同一プロセス内の観測であり、独立した最大必要メモリの同一性は示さない。各反復のheapUsed前後、rss、全statsはarchiveへ保存した。

## 対局と統計判定

対局はhard/bao/phase2、両者100ms/D8、開局後最大160手、先後交換2局1ペアである。既存公開実装と同じくroot準備後にdeadlineを開始するので、関数呼出し全体の厳密な100msではない。実時間は別記録した。

| 集団 | 局数 | 勝敗 | 勝点率 | 扱い |
| --- | ---: | --- | ---: | --- |
| development | 16 | 14勝2敗 | 87.5％ | 次段階の開始条件 |
| validation | 32 | 23勝9敗 | 71.875％ | 次段階の開始条件 |
| 最終holdout | 512 | 328勝184敗 | 64.0625％ | 最終判定の正本 |

最終はNamua128ペア・Mtaji128ペアの計256clusterで、別ペア間の完全同一対局系列は0。各phaseの勝点率はNamua74.21875％、Mtaji53.90625％。512局完了、200cluster以上、各phase128個の一意opening、独立棋譜再生のreadinessを満たした。

勝点率53％以上、95％区間下限50％超、各phase45％以上、戦術・運用gate通過という事前条件はすべて成立した。phaseを保つ10,000回のcluster bootstrapは61.1328125〜66.9921875％。引分除外のWilson区間59.8158〜68.0997％は参考値にとどめ、512局を独立標本と仮定した主要判定には使わない。Namua/Mtajiの各層それぞれで有意な改善を証明した、という追加主張はしない。

標準初期局面と12手未満のprefixを共有する可能性は残る。完全同一系列をまとめる事前規定のcluster処理は、あらゆる対局間相関の除去を保証するものではない。

より深く読めた事実とは別に、ここでは独立holdoutの先後交換成績が改善条件を満たした。高資源探索の手を真の最善手とみなした判定ではない。

## 実行・保存・独立検算

[Actions run 34041683075](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/34041683075)は全step成功。開始15:14:46.445Z、終了15:55:03.628Z、所要2,417.183秒（約40分17秒）で、連続4時間上限内だった。モデルの応答待ちを挟まず、固定gateで全工程を連続実行した。計測の区切りで外部保存してから続け、保存時間も全体時間へ含めた。

実行sourceはb7ec229a7b34eb9266d4bc19506f3e0cd550004b。GitHub-hosted ubuntu-24.04、Node v24.19.0、Linux 6.17.0-1022-azure、CPU AMD EPYC 7763、4 vCPU、runner image 20260831.293.1だった。ホスト負荷やCPUモデルは端末一般へ固定できない。

最終証拠commitは4c3b2687343153436c00b9546b6fb6223be939d1、archive SHA-256は5881a422ebd0613f4378b28da1d8c5b9ed7a8f326d0ad07a81bba7e7ef75128c。1,153ファイルすべてを索引hashへ照合した。全10コマンドが期限内に完了し、未完了ペアmarkerはなかった。

最終holdoutの独立再構成は398 source seed・320採用root・512局14,468着手で不一致0。結果確認時にも全3splitの保存済みsource・棋譜・別集計を --check で再検算し一致した。新たな時間測定・対局は実行していない。

## 未確認事項と次の境界

実ブラウザー端末・スマートフォンの速度、標準500msでの対局棋力、実サイトへの配信byte identityは未確認。今回は公開用baseline sourceと同一候補の実験であり、公開AIを切り替えていない。

本Programの測定は完了した。seedを再使用して好成績を取り直さず、追加候補を混ぜない。次はPRレビューと、必要なら別途指示による公開前確認である。main統合・公開配備・default切替・正式な世代昇格は、明示的な指示まで行わない。

[機械可読の最終結果](../../../artifacts/pbai-p5/final-result.json)、[再現手順](REPRODUCIBILITY_INDEX.md)、[再開位置](RESUME_HERE.md)を参照する。
