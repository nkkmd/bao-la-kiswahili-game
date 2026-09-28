# `PBAI-C017-v1` — 開発ゲート結果

実行run: [GitHub Actions #36409930392](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36409930392)  
baseline: `AI-GEN4-BASELINE-2026-09-28-v1` / `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`  
判定: **CANDIDATE-DEVELOPMENT-PASS**（開発範囲のみ）

## 実行結果

| 指標 | 結果 |
| --- | ---: |
| shard | 8/8成功、seed coverage完全・重複なし |
| 固定development seed | `2026092901..2026092964`（64 seedをすべて処理） |
| 比較局面 | 104（Namua 62、Mtaji 42） |
| 局面のあるdistinct seed | 62（Namua 62 seed、Mtaji 42 seed） |
| 固定深度 | 104/104でdepth 4完了、timeout 0 |
| 探索判断とelapsed以外のstats | 104/104でbaselineと一致 |
| 遷移cacheのmove順・after-state・event意味 | Namua sample全62件で一致 |
| baseline `applyMove`呼出し | 318,039 |
| candidate `applyMove`呼出し | 299,353 |
| 機械的な呼出し削減 | 18,686（再利用entry 18,686と一致） |

今回の計測対象内では`applyMove`呼出しが5.88%減った。この比率は固定depthの選択sampleにおける機械的な呼出し数の差であり、実時間の短縮率や一般局面での頻度を表さない。計測器を使わないfresh-sampleのwall-clock比較を別途行う必要がある。

2 seedから選定局面が得られなかったが、契約どおり補充せず報告した。64 seedすべてを処理し、全104個の選定局面を対で比較した。候補fixture/measurementの失敗はなかった。

## sourceとartifact監査

- 変更された公開AI実装は `public/ai-candidate.js` のみ。継承済みAI-GEN3 `engine.js`、`ai.js`、`ai-config.js`、`ai-weights.js`、`ai-release.js`、`logic-evaluator.js`はbaselineと同一hash。
- 固定深度のsource比較はbaselineを明示的にcommit `22537fb...`から読み込んだ。candidateは開発branchの実装を読み込んだ。
- canonical artifact ID: `10962959150`。GitHub zip SHA-256: `2dcf65371c452777c44bfe61bfc6d4b73fdfbb1b13694c06c8db50876758ba85`。JSON SHA-256: `13471b10224160b115f8af6d5e2427ba7d9178ec28a637f390c5a3fbb53c5548`、66,359 bytes。
- canonical JSONは[`c017-development.json`](c017-development.json)に保存し、commit `f191c2397dfdf09b364f5cb2e5c3a4a4b6168c7c`でbranchへ追加した。shard artifactは30日、canonical Actions artifactは90日保持。
- 最初のActions準備runはimmutable engine hash test・unit test・構文確認の修正によりseed処理前に止まった。これらのrunではdevelopment seedを消費していない。最終runでは既存release regression、専用test、構文確認、8 shard、aggregateがすべて成功した。

## 判断と範囲

事前に固定した開発gateをすべて満たしたため、C017は隔離development candidateとして合格とする。この結果からwall-clock speedup、strength gain、独立一般化、公開採用は判断できない。public defaultは未変更、AI lineage/releaseは`AI-GEN4 / AI-GEN4-RELEASE-001`のままである。

次段階では、未使用seedによる診断計装なしのpaired fixed-depth wall-clock validationを別契約として固定し、長時間実行はGitHub Actionsのshardとartifactで行う。対局strength比較はその測定結果と次のprospective gateを見て判断する。
