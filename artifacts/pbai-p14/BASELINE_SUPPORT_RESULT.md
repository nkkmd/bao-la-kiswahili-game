# `PBAI-P14-B` — baseline support結果

実行run: [GitHub Actions #36408095064](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36408095064)  
分類: **DEVELOPMENT-ONLY / SUPPORT PROBE**  
判定: **BASELINE-SUPPORT-PASS**

## 固定契約との照合

| 条件 | 観測 | 判定 |
| --- | ---: | --- |
| 完了shard・seed coverage | 8/8、64 seed全件を一度ずつ処理 | PASS |
| 合計局面 | 111 | PASS（最低48） |
| Namua局面 | 64、64 distinct seed | PASS（最低16） |
| Mtaji局面 | 47、47 distinct seed | PASS（最低16） |
| 深度4完了・timeout | 111/111、timeout 0 | PASS |
| 計装前後の挙動一致 | 111/111でmove、rootScore、depth、elapsed以外のstats一致 | PASS |
| Namua capture stop/use入力 | 103,788 | PASS（最低32） |

同じafter-stateに集約されたstop/use組は101,378、異なるafter-stateへ分かれた組は2,410だった。集計は今回のsupport sampleだけを記述し、一般の対局頻度、実際の時間短縮、棋力、最善性を推定しない。

## 実行・保全

- Baseline: `AI-GEN4-BASELINE-2026-09-28-v1`、source commit `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`
- Workflow run SHA: `2a8232adb867a027da5a5532ce95f2e73954015f`
- 8 shardはそれぞれ独立job/artifactとして保存され、集計jobも成功した。
- Canonical artifact ID: `10963350857`。GitHub zip SHA-256: `793f3eeb9bf7948e598147e7c3c53d3f7b351eafa07215d7aab9044ed000d290`
- 完全なcanonical JSONは[`artifacts/pbai-p14/baseline-support.json`](../../../artifacts/pbai-p14/baseline-support.json)に保存。
- baselineとsupport branchの公開AI実装7ファイルのGit blob SHAは一致した。計測はbaselineの公開AI実装を変更していない。

## 判断

support gateを満たしたため、A1候補の計測契約を固定する段階へ進む。これは候補の有効性や公開採用を承認する判断ではない。次の段階でCandidate ID `PBAI-C017-v1` の仕様を先に固定し、その後に隔離開発branchを作る。独立検証、対局強度試験、release holdout、main統合、公開AI変更はいずれも未認可・未実施。
