# 監督区画の再開位置

最初にSOURCE_MANIFEST.jsonとPROTECTED_INPUTS.jsonを照合する。CIの4 caseと23検査を確認し、結果を実行head・run・artifact・digestへ結び付ける。失敗した実行を消さず、固定入力とは別の修正履歴を残す。

この機構が合格しても、共通128 source・独立再生・閉包・復旧・圧縮保存を親1 GiB配下へ統合し、Docker daemonを使う場合はdaemonも明示的に計上する必要がある。起動準備・外側制御・終了保存も全体20分と物理容量の契約へ結合する。親OOM後の保存、実認証transport、科学経路の途中checkpoint検算も残る。

その後に科学用最終SPEC・CONTRACT・AUTH・全hash・CI・レビュー・専用triggerを固定する。全条件が揃うまで科学host拒否を維持する。継続指示は有効であり、追加認可待ちではない。科学seed消費0・leaseなし・未登録/未実行、main・公開AI未変更を保持する。
