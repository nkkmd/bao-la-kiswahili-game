# `PBAI-P3-D` — support実行前freeze checkpoint

日付: 2026-09-05

状態: **`AUTHORIZED / PRE-GENERATION / OUTCOME UNREAD`**

## 1. 実行source

このcheckpoint、run manifest、runner、独立verifier、testを含むcommitをexact execution sourceとし、その完全なSHAを生成resultへ記録します。

```text
contract commit = 59bfd70ccd9cd0733237c7152679e68cdc622af2
branch = engineering/pbai-p3-d-support-audit
baseline = AI-GEN2-BASELINE-2026-09-05-v1
support spec = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1
run manifest = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-RUN-2026-09-05-v1
candidate implementation = NONE
support outcome = UNREAD / NOT GENERATED
```

## 2. pre-generation hashの固定

```text
support spec SHA-256 = a44287577c57e601e6a9010498264a7a737e3f14036354bd5ca54588e3f9fcb4
run manifest SHA-256 = b8af71b684c5d02e9fa1a5316323abeab0aafb05c65ff5643e17ac44392ffbd3
production runner SHA-256 = abc970ade54577c531e26c4f7f7a637efb0e9c7df259e4041b076f0958ad5263
independent verifier SHA-256 = b3053bf4bf236acc5e6e957250c47aae0253729b3629ee876ab8aed1dbf0f450
pre-generation test SHA-256 = 0a90caca1459ddffd3b21921f0b1f1d52173707073b58fc68791a0b40abaadd6
```

## 3. source bindingの確認

`public/engine.js`、`public/ai.js`、`public/ai-weights.js`、`public/ai-config.js`は`AI-GEN2` baseline hashと一致しました。`public/`は変更していません。

隔離runnerは、bound `public/ai.js`をNode VMへ読み、root search-return valueを受動的に収集するsinkをmemory上だけで挿入します。通常の`AI.analyzeMove`とのsynthetic comparisonでは、selected move、root score、elapsed以外の既存statsがexact一致しました。

## 4. pre-generation testの結果

```text
command = node test/public-ai-improvement-program3-support.test.js
result = PASS
support seed access = 0
candidate code = 0
candidate benefit endpoint = 0
```

## 5. 情報遮断

support runは`44000001..44004096`だけへアクセスします。development `441...`以降、validation、release holdout、D5 reference、game outcome metric、Research Generation 4科学証拠にはアクセスしません。

実行後は、結果がPASSでもFAILでもthreshold、seed、phase assignment、root selection、public-budget subset、negative controlを変更せず、独立検証と正式checkpointを作成して停止します。
