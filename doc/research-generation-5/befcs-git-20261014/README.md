# 認証付きGit通信と停止後object保存

PR #200の保存済みsource prefix検算の次に、実Git通信の未完条件を検証する。[技術契約](TECHNICAL_CONTRACT.md)で5固定case、技術専用ref、認証、資源、合否規則を結果前に固定する。科学seed・新規Bao RAW・科学leaseは使わない。

読む順序は[報告](REPORT.md)、[結果入口](results/README.md)、[再現手順](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)である。[現在状態](CURRENT_STATUS.md)と[品質監査](AUDIT.md)に未完条件を示す。

local Gitの合格は実認証通信の合格ではない。Actionsで認証付きGit push、Git自身の競合拒否理由、proxy接続拒否、生objectの取得・独立bundle再生を確認してからCIを確定する。科学hostと共通128 sourceへの接続・全起動/終了の統合は残る。
