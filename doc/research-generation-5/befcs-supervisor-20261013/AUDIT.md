# 監督区画の品質監査

監査対象は本directoryのREADME・REPORT・REPRODUCIBILITY・RESUME_HERE・AUDIT・results/READMEの6文書と、中央RESUME_HEREの追記である。日本語だけで目的・判定・結果の未確定・解釈の限界・次工程を追える構成を確認する。

英語のみの人間向け見出し0件、通常の英語説明文0件を確認する。command・field・canonical token・hash・pathは再現性のための例外として保持する。相対リンク切れ、意図しないfence変更、科学提案・旧結果・認可状態の意図しない変更は0件を要求する。

3つの新規policy検査と既存20検査、および旧入力の全hash照合を実施する。実kernelの4 caseはActionsで別検証する。CI確定後に原結果と検算記録を追加し、実行入力を遡って変更しない。
