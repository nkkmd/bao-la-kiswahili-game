# `PBAI-P12` — 最終報告

Program: **`PBAI-P12`**
Candidate: **`PBAI-C016-v1`**
題目: **十分良い手を基準にしたマージン制限型選択探索**
英語作業名: **Good-Enough / Margin-Bounded Selective Search**
終了日: 2026-09-17

## 1. 最終判断

```text
PBAI-P12 = COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4
PBAI-C016-v1 = NOT-ADOPTED / CLOSED
public lineage = AI-GEN4
public release = AI-GEN4-RELEASE-001
public deployment change = NONE
```

候補`PBAI-C016-v1`は不採用とする。independent validation、release holdout、実機確認、公開Worker組込み、candidateの`public/`への統合、公開配信、release発行、AI世代昇格には進まない。

一方、閉鎖記録、再現用engineering tools/workflows、保存済み計測成果物は、後続の明示指示により2026年9月17日にPR #147で`main`へ履歴保存した。merge commitは`4e8af7dcf8a0cb995a6c231fd397e5c06b7af3c6`である。この履歴保存はcandidateの採用・公開統合を意味しない。

## 2. baseline support計測

開始時に`AI-GEN4-BASELINE-2026-09-17-v1`を固定し、候補実装より先に現行PVSの再探索コストを計測した。

固定depth 4のdevelopment-only計測では37局面を取得した。

- Namua: 24局面
- Mtaji: 13局面
- 診断ON/OFFの探索結果: 完全一致
- PVS scout: 3,144回
- full-window再探索: 260回
- full-window再探索node: 6,159
- root再探索発生: 26 / 37局面（70.27%）

事前固定したsupport gateをすべて満たしたため、現行AI-GEN4にPVS再探索コストが実測上残っていることは確認できた。この段階ではcandidateの有効性や棋力改善を示していない。

## 3. prospective candidate仕様

support PASS後、candidate結果を見る前に[`CANDIDATE_SPEC.md`](CANDIDATE_SPEC.md)を固定した。

中心機構は、rootの非principal candidateに対する従来の1点幅PVS scoutを、固定margin幅のprobeへ置き換えるものとした。margin内の小差ならfull-window再探索を省略し、暫定bestを維持する。

初回candidateはroot限定とし、captureがある局面、Namua→Mtaji遷移近傍、nyumba直接起点を含む局面などでは機構を無効化した。recursive node、quiescence search、評価器、ルール処理は変更していない。

固定margin候補は次の3値とした。

```text
Δ ∈ {16, 32, 64}
```

結果確認後の追加値探索は認めなかった。

## 4. development結果

予約済みdevelopment seed `121210001..121210032`だけを使用し、固定depth 4・時間無制限でbaselineと比較した。83局面のうち41局面が安全条件を満たすeligible局面だった。

| Margin | eligible node比 | 全体node比 | 再探索省略 | root move一致率 | 判定 |
| ---: | ---: | ---: | ---: | ---: | --- |
| 16 | 1.01665 | 1.00635 | 3 | 98.80% | FAIL |
| 32 | 1.02148 | 1.00819 | 7 | 97.59% | FAIL |
| 64 | 1.03805 | 1.01450 | 8 | 97.59% | FAIL |

事前gateでは、eligible局面のnode比`candidate / baseline <= 0.97`を要求していた。3値すべてでこの条件を満たさず、むしろnode数は増加した。

`Δ=64`ではfull-window再探索省略8回という最低条件を満たしたが、広いprobeの探索費用が節約した再探索費用を上回り、eligible局面では約3.8%のnode増となった。

feature flag OFF時はbaselineと完全一致し、全局面でdepth 4を完了したため、今回のFAILは実装不能やtimeoutではなく、**固定したmechanismが計算資源削減を達成できなかったことによる正式なdevelopment gate failure**である。

## 5. 解釈

baseline support計測により、「現行PVSに再探索コストが残っている」という問題設定には実測上の根拠があった。

一方、`PBAI-C016-v1`で採用した「rootでmargin幅probeを先に行い、小差ならfull-window再探索を省略する」方法では、そのprobe自体の追加探索費用が大きく、総node数削減へつながらなかった。

したがって、今回の結果から直接言えるのは**この具体的mechanismを採用しない**ということである。「十分良い手」という上位概念や、別形式の選択探索一般が無効であるとは結論しない。ただし、同じcandidateをmargin値・threshold・安全条件の事後変更で救済しない。

## 6. 未実行工程と情報遮断

次の工程は実行していない。

- independent validation
- tactical regressionの正式validation
- 先後交換pairによる棋力試験
- hard / expert同一時間での正式比較
- browser / smartphone実機試験
- protected release holdout
- 公開Workerへの組込み
- candidateの`public/`への統合・公開配信

次のseed blockは未消費である。

```text
independent validation = 121220001..121220064
protected release holdout = 121230001..121230064
```

これらを`PBAI-C016-v1`の救済目的で使用しない。

## 7. 公開AIへの影響

公開AIは`AI-GEN4`、正式releaseは`AI-GEN4-RELEASE-001`のまま維持する。

今回のProgramで`public/`の既定AIを変更していない。candidate mechanismは隔離branch上のengineering変換器・runnerとしてのみ実装した。したがって、本番サイト、公開AIの世代表示、release IDに変更はない。

PR #147で`main`へ保存したのは、Programの閉鎖記録、再現用engineering tools/workflows、保存済み計測成果物である。これは公開AIへのcandidate統合とは区別する。

## 8. 再開境界

`PBAI-P12`と`PBAI-C016-v1`は閉鎖済みとして再開しない。

将来、今回の知見を踏まえて別の再探索削減方式を検討する場合は、materially newなmechanismとして新しいProgram ID / Candidate IDを発行し、新しいbaseline、seed、prospective gateを結果確認前に固定する。今回の未消費holdoutを自動的に流用しない。
