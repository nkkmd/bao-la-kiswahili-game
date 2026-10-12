# RAW可逆codec — 追加の技術契約

技術IDはRSMR-S0C-CODEC-2026-10-13-v1。科学用遷移の検証後、全閉包を維持して資源を改善する方法として、状態同一視を伴わないRAWの可逆保存を技術検証する。新規科学sourceや旧rootの追加展開は行わない。

対象は先行技術検証の保存境界422状態で、pits/reserve/pendingは各0..64整数、配列形は固定、houseOwnedはbool、playerは0/1、phaseはnamua/mtaji、winnerはnull/0/1、takasiaはnullまたはplayer/indexだけのobjectとする。範囲外・未知field・異なるrule revisionを棄却し、clamp・wrap・既定値への救済をしない。reason/turnはRAW同一性の範囲外で、完全な遷移記録には別途保持する。

pits32個・reserve2個・pending2個を各7 bit、houseOwned2 bit、player1 bit、phase1 bit、winner2 bit、takasia5 bitの計263 bitで記録する。payloadは33 byteで、残る1 padding bitを0に限定する。codec版とBAO-RULES-V0.2.0-TAKASIA-001はファイル側のheader/manifestで固定する。

bit演算と文字列bit列の独立二実装を用い、全422状態でencode/decodeと旧RAW識別が一致することを確認する。境界値0/64とtakasia全17 code等の固定技術例も確認する。field順・padding・予約code・未知値・不正形の改変を棄却する。packed bytesのhashを旧RAW hashへ置き換えない。

検証は先行技術結果を別manifestで入力結合する。先行の契約・source manifest・結果は保持する。全体30秒、RSS 1GiB、出力1MiBを上限とし、新規seedを割り当てない。codec合格はBFS統合・runtime/RSS改善・全閉包供給の成功を意味しない。正式要件の全閉包は保持し、有限戦略証明への変更を自動承認しない。
