# `PBAI-P14` — 開始認可レビュー

認可日: 2026-09-28
Program: **`PBAI-P14`**
作業名: **AI-GEN4の探索候補遷移再利用 — A1成立性確認**

## 1. 判断

**`AUTHORIZED-FOR-PROGRAM-INITIALIZATION-AND-BASELINE-SUPPORT-MEASUREMENT`**

ユーザーは2026-09-28に、公開AI改善へ着実に進むよう指示し、長めの試験はGitHub Actionsを第一候補として設計するよう指定した。本Programでは、最新mainの状態確認、隔離branchでのProgram文書・診断ツール作成、prospectiveに固定したbaseline support計測、固定gate判定、結果記録までを認可範囲とする。診断instrumentation以外の探索変更はbaseline測定に含めない。

## 2. 基準状態

```text
repository = nkkmd/bao-la-kiswahili-game
main anchor = 22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b
public lineage = AI-GEN4
release = AI-GEN4-RELEASE-001
release evaluator = PBAI-C015-v1
current program branch = engineering/pbai-p14-a1-support
baseline identity = AI-GEN4-BASELINE-2026-09-28-v1
baseline source commit = 22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b
```

本番経路は `BaoReleaseConfig.searchOptions("expert", capabilities, state)` から作る設定を `BaoReleaseAI.analyzeMove` へ渡す経路とする。baseline supportでは、端末条件を固定したうえで深度4・無制限時間に上書きし、release adapter、PBAI-C015評価器、継承された探索専用軽量遷移を通す。公開default、`public/`の既定値、表示、release manifestは変更しない。

## 3. 先行確認と非流用

- 最新mainは上記anchorで、PBAI-P1〜P12は閉鎖済み。
- Jev比較記録はPBAI-P13として扱わないと中央索引に明記されている。今回のfresh engineering programをPBAI-P14とする。
- Candidate命名規則上、repository-wideで次の未使用IDはPBAI-C017-v1候補だが、A1 support通過後に仕様を固定する段階まで正式発行しない。
- PBAI-P12 / C016は閉鎖済み。未消費seedや成果を流用せず、再開・救済もしない。
- Research Generation 4のclosed Study、保護データ、G4-10の未完成depth-11出力を追加実行・救済・教材化しない。
- 既知Jev局面、過去の対局・候補評価、G4-05/G4-09固定領域は、本Programのsupport判定や後続独立検証へ流用しない。

## 4. 認可段階と境界

この開始認可で許可するのは、P14文書・計測器・Actions workflowの作成、source-preserving diagnostic transformationのテスト、固定baseline seedでのsupport計測、独立集計・結果記録である。計測コードは `tools/engineering/pbai-p14/` とし、公開AIコードを変更せず、Actionsはartifactだけを出力する。

support gateを通過した場合に限り、同一探索判断を保つA1のcandidate仕様を新規に固定して開発へ進む。gate不通過なら `NO-SUPPORT / KEEP-AI-GEN4` として終了し、標本や閾値を結果後に足して救済しない。

独立validation・棋力比較・protected release holdout・公開AIの採用・`main`統合・production deployment・release・AI世代昇格は各段階で別に記録する。これらをbaseline support結果から自動的に認可されたものとはみなさない。
