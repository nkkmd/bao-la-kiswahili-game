# 科学用遷移と解析方式 — 技術検証報告

## 結論と検証範囲

RSMR-S0-TECHNICAL-2026-10-13-v1の判断はSCIENCE-METHOD-TECHNICAL-PASS-NOT-SCIENTIFIC-AUTHORIZATIONである。既知40fixtureからの416境界状態・411合法遷移で、object実装と独立ring実装の自然停止、境界状態、relay回数、全microstate列が一致した。管理上限に達した結果を勝者付き境界状態にせず、未知とする実装を得た。

固定構築fixtureの1手も自然停止し、5 relays・5 microstatesで両経路が一致した。標準開始からの到達可能性を証明した結果ではない。実Baoの手内部反復や512を超える自然停止を今回観測・検証したわけではない。完全反復の検算は抽象状態機械で確認した。

## guardと自然停止の分離

既知P9/capture-relayの8合法variantに科学上限1と診断runtime上限1を適用した。5 variantは科学用ADMIN-CUTOFF/state nullだが、十分な上限では自然停止した。同じ5 variantに診断runtimeはRUNTIME-GUARDとしてwinner 0を設定した。残り3 variantは低い上限でも自然停止した。

上限を低くした技術例により、runtime上限の勝者を自然な敗北へ読み替えられないことを示した。実際のG5-05の2 guard枝やそのwitnessは延長していないので、当該手が自然停止するか、完全microstate反復なのかは依然未確定である。反復が検証されても対局のDRAWや0価値を付与しない。

手内部の比較には盤両側とreserve/houseOwned/pending/player/phase/takasia/cursor/direction/captureTurn/対象/houseChoiceを含めた。while内のwasEmpty falseと一手内の不変条件も確認した。盤だけが同じでcursorが違う抽象例を同一microstateとせず、周期2の完全反復・endpoint一致・正の周期を検算した。

## 有限戦略証明の検証

二つの独立検算器で、主張勝者の手番では1合法辺、相手手番では全合法辺、厳密に減少する非負整数rank、自然な主張勝者の終局葉を要求した。rankが非負整数で厳密に減少すれば証明経路は有限に終わり、相手の全合法選択を含むため、抽象グラフ上の有限勝利戦略となる。rankは勝利手数の上界であり、最適DTFではない。合法分岐欠落・非合法辺・非減少rank/循環・未知の合法集合・非終局空集合・runtime guardの終局ラベル・余分/重複nodeを拒否した。

抽象グラフでは未展開の枝が残っていても、全root手の子に有限勝利戦略証明があり、root相対値-1と+1を確定できる例を確認した。rootに1勝利証明があるだけでは全root手の価値損失を評価できないことも検証した。ただしこれは抽象グラフの論理で、Baoの証明生成・全合法手集合/遷移/到達性の検算を実装した結果ではない。現行Programの全閉包要件を満たした対象として承認しない。

## RAW可逆codec

RSMR-S0C-CODEC-2026-10-13-v1を別の[追加契約](RAW_CODEC_CONTRACT.md)で固定し、先行の422技術境界状態を入力とした。bit演算と文字列bit列の二codecでencode/decodeが一致し、全てのRAW識別が元と一致した。

pits32・reserve2・pending2を各7 bit、houseOwned2 bit、player1 bit、phase1 bit、winner2 bit、takasia5 bitで、1 RAW当たり263 bit/33 byteである。対象422 RAWのcanonical JSON payload 104660 byteに対しpacked payloadは13926 byteだった。この比較はRAW payloadだけで、graph index・move table・reason/turn等の付帯情報や圧縮後の保存量を含まない。科学BFSでの実メモリ/時間改善を測った値ではない。

codecは範囲外・未知値・未知takasia field・不正配列形・異なるrule・padding/予約codeを棄却し、clampやwrapをしない。reason/turnはRAW範囲外として別途保持する必要があり、guard winner等のラベルを保存できることは自然終局の認証を意味しない。状態同一視、対称変換、RAW hash置換は用いない。

## 資源・証拠分離・次の方法

先行のローカル技術実行は1168ms、最大RSS 446410752 byte、生証拠1069892 byteで固定上限内だった。11遷移/証明テストと4 codecテスト、保存証拠の再生と出力hashが合格した。

技術境界は422 RAW、microstateは654完全識別、境界と中間microstateのRAW射影は1054識別である。旧101691既読と合わせた保守的遮断集合は102329。中間射影を到達可能な局面・候補・独立標本にしない。新規科学source/seed/候補、旧guard witness延長、順位比較、正式検定は0件である。

[方法選択](METHOD_DECISION.md)で、guard-free遷移と可逆codecを全閉包BFSへ統合する技術検証を先に進める。全閉包を保つ方式を優先し、戦略証明の採用は現行計画との適合レビューに留保する。全閉包供給・勝敗価値差の確保・正式関係の準備条件はまだ成立していない。
