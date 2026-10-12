# 方法再評価の再現性

[先行技術契約](TECHNICAL_CONTRACT.md)/[CONFIG](CONFIG.json)/[SOURCE_MANIFEST](SOURCE_MANIFEST.json)を先に固定し、科学用遷移と抽象証明を実行した。次に[codec契約](RAW_CODEC_CONTRACT.md)/[CODEC_MANIFEST](CODEC_MANIFEST.json)で先行技術結果を入力結合し、可逆codecを追加検証した。先行契約・ソース・結果はcodec追加で変更していない。

object-engineは旧runtime object engineからの別研究コピー、ring-engineは独立numeric ring engineからの別研究コピーで、公開エンジンや旧科学用コードのバイトは保持する。microstateの正規化も各実装に独立に書き、証明器/codecも相手の実装を呼ばない。[ツール入口](../../../tools/research/g5-method/README.md)を参照する。

Node 24・リポジトリrootで次を実行する。新規科学seedは生成しない。

```sh
node --test test/g5-method.test.cjs test/g5-method-codec.test.cjs
node tools/research/g5-method/run.cjs --check
node tools/research/g5-method/codec-run.cjs --check
```

RESULT・TECHNICAL_EVIDENCEは先行の技術結果、EXECUTIONはローカル資源記録、CODEC_RESULTとTECHNICAL_RAWはRAW payloadの往復結果である。OUTPUT_BINDINGはこれらと方法判断・入力manifest・readonly workflowをSHA-256結合する。新しい方法のCIはcontents readで固定fixtureと保存結果だけを再生する。

技術読取集合はTECHNICAL_EVIDENCE内のtechnicalRawProjectionIdentitiesである。旧101691状態と合わせて102329識別を将来の正式証拠から保守的に遮断する。source生成器へ技術microstateを新候補として渡さない。
