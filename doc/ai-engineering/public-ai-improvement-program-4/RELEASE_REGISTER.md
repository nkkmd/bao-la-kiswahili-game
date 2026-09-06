# PBAI-P4 — 公開判断とリリース台帳

公開判断: `NO-RELEASE / KEEP-AI-GEN2 / AWAITING-USER-INSTRUCTION`。

## 公開系統と境界

公開系統は開始前後とも `AI-GEN2`。`AI-GEN3` は予約名のままで、昇格していない。candidateの実装、速度向上、holdoutでの好成績は、公開defaultへの採用や世代昇格を自動的に認可しない。

main統合、公開デプロイ、default切替、正式な世代昇格はこの依頼で明示的に除外されている。PR作成はレビューの入口であり、正式なADOPT判断ではない。

## 変更と復帰の窓口

候補flagの既定値はfalse。通常のapplyMove、UIアニメーション、Workerメッセージ、評価重み、ai-config、PWAキャッシュ、保存データの形式は変更していない。将来の公開手順を認可する場合は、対象commit、配信asset、キャッシュ更新、feature-off復帰を別途確認する。

今回の候補有効化は実験のoptionsだけで指定する。実験内でflagをfalseへ戻すと、固定baselineと同じ計算結果を返すことを検証した。公開環境でのrollback操作は実行していない。

## 配信状態の確認限界

リポジトリに置かれた公開用sourceの同一性はBASELINE.jsonで固定した。Cloudflare配備IDと実サイトの配信byte identityは独立確認していない。不一致が見つかったという意味ではなく、未確認である。Node上の結果を、配信済みや実機検証済みという主張へ読み替えない。
