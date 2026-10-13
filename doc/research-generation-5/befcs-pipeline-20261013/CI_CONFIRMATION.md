# workerとhostの実cgroup技術CI確定

実装head `6f6b468ee591f21497413060d86fa88050206092` のPR [run 38364682184](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38364682184)は全stepが合格した。同headのPR側12ワークフローもすべてsuccessである。取得APIはPR側一覧であり、push側を含む全run数とは主張しない。

実1 GiB・swap追加分なし・networkなし・pids32で、通常128 sourceと停止専用fixtureを含む全9シナリオが合格した。通常は128 ACK/marker・1候補・1閉包で、worker完了と最終mirrorの両方が成立した。全体時間停止では12 marker/11 ACKとなり、未ACKの1件を保持した。終了mirror失敗ではworkerの閉包まで完了してもtechnicalComplete falseを保持した。

artifact `11796765815` のZIP SHA-256 `57de4333495c3ce08ad3a168570d677cac861340cbfa26b9ab8a52111c100ffb` を照合した。[取得結果](results/CI_RESULT.json)・[全圧縮証拠](results/CI_TECHNICAL_EVIDENCE.json.gz)の入力manifestと圧縮前証拠hashが一致し、全9保存Git bundle、source・候補・閉包をローカルでも独立再生した。[receipt](results/CI_RECEIPT.json)と[CI出力binding](results/CI_OUTPUT_BINDING.json)に別固定する。元の入力・保護入力・開発診断は付け直さない。

ローカルの回帰はpipeline負荷を分けてfile単位直列で再確認し、新規5件と既存69件、計74件がすべて合格した。先行の72/73合格・起動時間依存1失敗と単独合格の記録は保持し、旧test byteは変更していない。

これは既知抽象fixtureの共通worker/host結合の技術合格である。科学用全資源会計・実GitHub通信失敗・最終host配備・最終科学事前固定・科学triggerは未完であり、科学hostの直接API拒否を維持する。科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行、正式関係未登録/未実行、103355件遮断・全閉包・未知・救済禁止・主課題とmain/公開AI未変更を保持する。
