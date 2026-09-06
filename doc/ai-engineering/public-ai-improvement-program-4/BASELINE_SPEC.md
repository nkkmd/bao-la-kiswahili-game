# PBAI-P4 — 比較基準の説明

正本は[BASELINE.json](BASELINE.json)。識別子は `AI-GEN2-BASELINE-2026-09-06-v1`、開始mainは `548ccead3965fa98602d99c8b3e2a49fbeeed093` である。

## 固定した公開用source

engine.js、ai.js、ai-weights.js、ai-config.js、ai-worker.js、main.js、index.html、service-worker.jsの8ファイルをSHA-256で固定した。候補比較ではbaselineのエンジンとAIを固定commitから別moduleへ読み出す。候補側のエンジンをbaselineへ注入しない。

評価は既定のbao、探索は既定のphase2、quiescence深度1、hard/expertの評価キャッシュ既定有効、上限2048件を維持する。TTの既定上限50000、TT優先・追加捕獲順・history・aspiration・mate正規化の実験設定は追加しない。

## 予算の区別

固定深度比較はD2/D3でInfinity、標準ブラウザー予算の運用比較はhard 500ms/D8とexpert 2000ms/D12、対局比較はhard 100ms/D8である。最後の条件は短時間の工学比較であり、標準公開予算での棋力判定を代替しない。

エンジンは従来どおりrootの準備後にdeadlineを設定する。今回も時間配分の意味を変えず、割当予算と呼出全体のwall-clockを両方記録する。したがって、100msの指定が呼出全体の厳密な100ms上限を意味するわけではない。

## 公開配信との区別

ここで確認したのはリポジトリ内の公開用sourceである。Cloudflareの配備IDと実サイトの配信byte identityは独立確認していない。候補は隔離ブランチのdefault-off実装であり、公開採用・公開配備を実行したという意味ではない。
