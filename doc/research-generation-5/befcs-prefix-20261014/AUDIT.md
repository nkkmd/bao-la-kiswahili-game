# 技術工程の品質監査

## 対象と日本語品質

対象は本directoryのREADME・TECHNICAL_CONTRACT・REPORT・CURRENT_STATUS・REPRODUCIBILITY・RESUME_HERE・AUDIT・results/README、toolsのREADME、中央RESUME_HEREの新規追記である。追加CI確認文書がある場合も監査へ含める。

人間向け見出しと通常説明文を日本語で記述し、token・JSON field・path・exact command・hashを例外として保持する。英語のみの説明見出しと通常の英語完全文、壊れた相対リンク、意図しないfenced block・ID・数値・hash・認可状態の変更がないことを差分と追跡pathで確認する。

初回監査の対象は上記10 Markdown。英語のみの説明見出し0件、説明済み例外以外の通常の英語完全文0件、相対リンク切れ0件、意図しないcanonical変更0件である。新規13検査＋既存5検査の18検査、5停止caseの保存と再生、2207入力・2198保護入力の照合が合格した。日本語品質ゲートはPASSである。

## 不変性と検査

旧SOURCE_MANIFESTとPROTECTED_INPUTSを変更せず、この工程の入力・出力bindingを別固定する。生成中のcheckpoint・source journal・read journal・receiptはbyte単位で保存し、検算器は入力を変更しない。失敗した開発診断と未確定CIを成功へ読み替えない。

検査結果の正本は[結果入口](results/README.md)と機械結果・bindingである。科学seed消費0・科学leaseなし・Study未登録/未実行、103355遮断・全閉包・未知・救済禁止・主課題・main/公開AI未変更を保持する。source prefixだけの合格を科学全pipelineの合格にしない。
