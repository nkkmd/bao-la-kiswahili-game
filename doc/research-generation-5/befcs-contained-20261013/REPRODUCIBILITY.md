# 共通workloadの再現性

科学seedを生成せずに入力と科学入口の拒否を照合する。

```bash
node --test test/g5-befcs-contained.test.cjs test/g5-befcs-envelope.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-contained/run.cjs --bindings
```

7 caseの実cgroup/物理quotaは隔離Actionsに限定する。対象fileはcaseごとに排他的に新規作成し、filesystem準備から回収・image圧縮まで同じdeadlineで監督する。markerを再消費しない。observer全体期限のcaseは期限後診断とし、完了へ昇格しない。取得後は保存Git bundleとjournal、source checkpoint・候補・閉包だけを独立再生し、元入力hashを付け替えず出力bindingを別固定する。

[取得証拠](CI_CONFIRMATION.md)は次の保存byteだけで再検算できる。raw imageの各hashと容量確認はimage manifestへ保持し、回収した全1229 fileはcontent-addressed gzipへ保存した。完全sourceとstop nullのprefixを分け、未知・未保存続きを補わない。

```bash
node -e "const fs=require('fs'),z=require('zlib');const rows=JSON.parse(z.gunzipSync(fs.readFileSync('doc/research-generation-5/befcs-contained-20261013/results/CI_TECHNICAL_EVIDENCE.json.gz')));rows.forEach(require('./tools/research/g5-befcs-pipeline/run.cjs').replay);"
node doc/research-generation-5/befcs-contained-20261013/results/VERIFY_IMAGE.cjs
```

取得後検算器は実行時manifestの入力ではなく、出力bindingにhashを固定した追加artifactである。先行実装と科学sourceを変更せずに、prefix 32 step・追加journal 9 step、候補null、範囲外の続行拒否と改変検出を確認した。
