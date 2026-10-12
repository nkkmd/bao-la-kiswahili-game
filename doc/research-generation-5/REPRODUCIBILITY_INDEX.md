# 第五世代研究 — 再現性の索引

更新日: 2026-10-12（日本時間）

## G5-01 Stage 0の再現資料

- [技術契約](g5-01/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/STAGE_0_SPEC.json)。
- [実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)・[技術認可](g5-01/STAGE_0_AUTHORIZATION.json)。
- [使用ソースのbyte hash](g5-01/SOURCE_MANIFEST.json)。
- [測定結果](g5-01/results/stage-0/result.json)・[Python検算](g5-01/results/stage-0/verification.json)。
- [Actions来歴](g5-01/results/stage-0/CI_RECEIPT.json)・[技術検証報告](g5-01/STAGE_0_REPORT.md)。
- [実行コマンドとツールの範囲](../../tools/research/g5-01/README.md)。

実行前固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`。ソースmanifestを照合してから、別のローカル出力先で技術fixtureを再現する。core hashから所要時間・メモリ・環境来歴は分離してある。

保存済み結果の検算は次で実行する。これは新規科学的seedを使用しない。

```bash
python3 tools/research/g5-01/verify.py doc/research-generation-5/g5-01/results/stage-0/result.json
```

Stage 0完了時点では、新規局面、科学的seed、正式標本、正式検定の成果物は存在しなかった。

## 独立遷移の技術検証

実行前固定コミットは `ec2607dfc4a09b62d2aaa56f75740f9f551992e4`。

- [技術契約](g5-01/transition/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/transition/SPEC.json)・[ソース固定](g5-01/transition/SOURCE_MANIFEST.json)・[実行範囲](g5-01/transition/AUTHORIZATION.json)。
- [測定結果](g5-01/transition/results/result.json)・[Actions来歴](g5-01/transition/results/CI_RECEIPT.json)・[検証報告](g5-01/transition/REPORT.md)。
- [ツールと再現コマンド](../../tools/research/g5-01/transition/README.md)。

独立実装は依存モジュールをimportしない。固定fixture上の再測定は技術作業であり、割当済みの開発区画を使用しない。

## Stage 1開発診断

- [固定契約](g5-01/development/CONTRACT.md)・[機械用契約](g5-01/development/SPEC.json)・[ソース固定](g5-01/development/SOURCE_MANIFEST.json)・[認可](g5-01/development/AUTHORIZATION.json)。
- [run・lease・mirrorの来歴](g5-01/development/results/CI_RECEIPT.json)。
- [実行要約](g5-01/development/results/RESULT.json)・[圧縮生記録](g5-01/development/results/EVIDENCE.json.gz)・[独立検算](g5-01/development/results/VERIFICATION.json)。
- [消費journal](g5-01/development/results/SEED_READS.jsonl)・[候補固定](g5-01/development/results/CANDIDATES_FROZEN.json)。
- [供給診断](g5-01/development/results/SUPPLY_DIAGNOSTIC.json)・[診断報告](g5-01/development/REPORT.md)。

保存済み記録の検算と事後診断は、sourceを生成し直さず次で行う。実行時の32 seed区画は再使用しない。

```bash
node tools/research/g5-01/development/verify.cjs doc/research-generation-5/g5-01/development/results
node tools/research/g5-01/development/diagnose-supply.cjs doc/research-generation-5/g5-01/development/results
```

現在はStage 1の開発source記録が存在する。新規閉包・厳密解・正式関係検定の成果物は存在しない。


## 2026-10-13の全閉包BFS統合検証

[全閉包統合](bfs-integration-20261013/README.md)で、科学用遷移と可逆RAW保存を固定fixtureのBFSへ統合した。既知Baoの3状態・2辺と固定抽象例で全合法手・全辺・独立解・snapshot/journal復元が一致した。未知・停止証拠・未展開境界・各辺metadataを保持した。[報告](bfs-integration-20261013/REPORT.md)に9テスト、全10 fixture、保存量と全測定を示す。

1024状態の抽象例でjournal込み保存は4363460から3988337 byteとなったが、科学BFSの資源改善や新規完全領域を確認した結果ではない。初回RSSの全同値も保持し、Linux補助計測を別契約で保存した。新規科学source/seed/候補・旧witness延長は0件である。

保守的遮断は103355 RAW識別となった。全閉包要件と正式関係未登録/未実行を保ち、次は[別Studyの登録条件](bfs-integration-20261013/RESUME_HERE.md)を具体化する。旧区画を救済・補充せず、技術合格から科学sourceを自動起動しない。main・公開AIは未変更である。
