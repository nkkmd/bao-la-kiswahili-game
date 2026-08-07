# E-011 正式自己対局開始承認

日時: 2026-08-01 06:09 JST  
Status: Approved / Awaiting fixed-local execution lock

## 承認

ユーザーから「E-011の正式自己対局を開始してください」と明示的な開始指示を受領した。

この指示をE-011正式実験の開始承認として扱い、次の専用コミットでexecution policyを有効化した。

- authorization commit: `a0378010607aebad76420e0d377ee1b88166d861`
- policy: `config/experiments/phase-transition-robustness-execution-policy-v1.json`
- status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-011-FORMAL-APPROVED`

## 変更していない事項

開始承認によって、事前登録済みの実験条件・分析条件・判定条件は変更していない。

- 5条件×各400局
- seed範囲 `20262001–20262400`
- 実行順 `C0 → C1 → C2 → C3 → C4`
- 固定ローカル逐次実行
- GitHub Actionsでの正式2000局実行禁止
- 条件別最低候補数・対照数・RR・効果方向
- trajectory重複感度の必須副次分析

## 現在の到達点

開始承認とrepository許可フラグの有効化は完了した。

一方、実行環境から固定ローカルrepository `/home/oruorane/github/bao-la-kiswahili-game` へ直接アクセスできないため、次は固定ローカル機上で行う。

1. 最新branch headへ`git pull --ff-only`
2. Node.js `v24.6.0`、branch、clean worktreeを確認
3. execution lockを生成
4. lockにsource commit・runtime・hardware・preregistration/policy hashを記録
5. C0 400局を開始

このチェックポイント作成時点では、execution lock未生成、C0 corpusは`0 / 400`、E-011全体は`0 / 2000`である。

## 禁止事項

- 別の実行環境を固定ローカル機の代替として使用しない
- GitHub Actionsで正式corpusを生成しない
- execution lock生成前にC0を開始しない
- C0未完了時にC1以降を開始しない
- 結果確認後に事前登録条件を変更しない

PR #26は引き続きdraftのまま維持する。
