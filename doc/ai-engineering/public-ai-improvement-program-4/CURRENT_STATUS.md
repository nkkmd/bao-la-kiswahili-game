# PBAI-P4 — 現在状態

PBAI-P4-Aは開始認可・baseline固定済み、Bはbaseline-only診断完了・契約固定済み。候補改善の結果は未観測。次はCの隔離実装と正確性検証である。[検証条件](PROTOCOL.md)を正本とし、後段は前段gate成立時だけ開く。公開系統はAI-GEN2のままである。

## 正確性検証の完了

CはPASS。3,620状態・14,222遷移・741,774イベントで、通常baseline／変更後通常／軽量経路が指定項目で一致した。独立した数量再生も一致した。指定した全境界を通過し、relay-limitは1穴1024個の到達可能性を主張しない人工盤面で実際の512上限を検証した。

既存engine、AI、search、tactical、AI Worker、Worker integration、AI config、diagnostics UI、Namua→Mtajiの回帰と、新規global-script／Worker／flag対象外の回帰がPASS。実Chromiumは利用環境に見つからず、実端末の検証はしていない。次はDのdevelopment測定である。

## developmentの判定

DはPASS。固定深度の全stats・選択手が一致し、速度・運用・既知戦術のgateが成立した。先後交換16局の候補勝点率は0.75。別実装が54 source seed・40採用rootを再構成し、全450着手を固定baselineでreplayした。独立集計も一致した。これは少数のdevelopment観測であり、正式な棋力改善の根拠にはしない。次はEの未使用validationを開く。
