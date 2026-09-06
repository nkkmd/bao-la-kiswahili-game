# PBAI-P5 — 会話が途切れたときの確認位置

現在は `PREPARATION-COMPLETE / NOT-STARTED`。開始labelは未付与、新規科学seedは未使用である。準備PRは[108](https://github.com/nkkmd/bao-la-kiswahili-game/pull/108)、ブランチはengineering/pbai-p5-reverification-preparation。

## 開始後に最初に確認するもの

会話が切れても新規試験を起動しない。まず[Actions](https://github.com/nkkmd/bao-la-kiswahili-game/actions)のPBAI-P5 external single-use verificationと、専用ref engineering/pbai-p5-evidenceを確認する。RESUME.jsonにrun URL、実行commit、開始・期限、完了局数、archive hashが保存される。

次は読み取りだけの短い状態照会であり、試験を起動しない。

```sh
python3 tools/engineering/pbai-p5-checkpoints.py
```

NO-CLAIM-FOUNDは起動claimが見つからない状態、CLAIMED-NO-CHECKPOINTは起動claimだけで初回保存が完成していない状態である。後者を未実行と決めつけて再試行しない。finalがnullならまだ正式終了記録がない。必ず対応するActions runの生存・結論も確認する。古いcheckpointだけでは「現在も計測中」と断定しない。

## 終了している場合

最新のevidence.tar.gzを取得し、RESUME.jsonのarchiveSha256と展開ファイルhashを照合する。RUN_FINAL.jsonは運用上の完了/停止、holdout/independent-metrics.jsonは科学的判断の正本である。Actions成功と棋力PASSを同一視しない。

Actionsが停止して最終記録がなければ、直近checkpointとActions artifactを保存し、INCOMPLETE/HOLDとして未完了範囲を記録する。完了対局の再実行、seedの未使用扱い、claim refの削除、label再追加、Re-runは禁止する。

## 準備時の実行履歴

監視器self-test、checkpoint人工試験、preflight、構文・文書監査だけを実行した。正式--start、開始label付与、科学run用ref作成は行っていない。artifacts/pbai-p5/autonomous-*.jsonに新しい準備結果を保存する。旧P4のHOLD、P5の候補・seed・数値gate、公開AI-GEN2は維持する。

科学的な開始指示後はlabel付与で1回だけ開始し、その後は頻繁なチャットのポーリングを必要としない。完了後または次の会話で状態照会から続ける。
