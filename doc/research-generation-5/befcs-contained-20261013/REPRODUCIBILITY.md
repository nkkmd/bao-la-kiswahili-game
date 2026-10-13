# 共通workloadの再現性

科学seedを生成せずに入力と科学入口の拒否を照合する。

```bash
node --test test/g5-befcs-contained.test.cjs test/g5-befcs-envelope.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-contained/run.cjs --bindings
```

7 caseの実cgroup/物理quotaは隔離Actionsに限定する。対象fileはcaseごとに排他的に新規作成し、filesystem準備から回収・image圧縮まで同じdeadlineで監督する。markerを再消費しない。observer全体期限のcaseは期限後診断とし、完了へ昇格しない。取得後は保存Git bundleとjournal、source checkpoint・候補・閉包だけを独立再生し、元入力hashを付け替えず出力bindingを別固定する。
