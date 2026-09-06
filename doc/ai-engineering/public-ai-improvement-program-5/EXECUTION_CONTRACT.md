# PBAI-P5 — チャットから独立した実行の追補契約

状態: `FROZEN-BEFORE-SCIENTIFIC-START`。この追補はユーザーの「トークンが途中で切れるのを避けて試験ができるように準備してください」に基づく。新規科学seedは未使用である。旧PROTOCOL.mdを上書きせず、実行環境と保存方式に限って以下を優先する。候補source、baseline、seed、標本数、探索条件、数値gate、4時間上限は変更しない。

## トークンへの依存をなくす方法

試験の実行、stage間の判定、途中保存、最終集計をすべてスクリプトが行う。モデルの生成やチャットの応答を必要としない。トークン切れ自体を防ぐ保証ではなく、切れても試験を継続できる構成である。正式実行はGitHub側のrunnerを使い、この会話の作業環境にプロセス寿命を依存させない。

開始入口はPR #108へ `pbai-p5-start-once` labelを付ける操作とする。labelの追加は正式試験開始であり、今回の準備では行わない。通常のPR更新や準備CIでは正式試験を開始しない。mainに未統合でもPRイベントのworkflowを利用できる。workflow_dispatchのdefault branch要件に依存させない。

## 実行環境の固定

旧PROTOCOLのローカルAMD EPYC 9V74限定に代えて、GitHub-hosted ubuntu-24.04のLinux x64、Node v24.19.0を使用する。同一job・同一Nodeプロセスでbaselineとcandidateを比較する。CPUモデル、OS、runner image版、commit、計画hash、run IDを開始記録へ保存する。ホストCPUのモデルと他テナントの負荷は固定できず、環境差を含む測定として報告する。P4の速度倍率を今回のrunnerで再現したと先取りしない。

4時間はRUN_STARTED.json作成から独立検算と最後の工程checkpointまでの連続時間であり、初回の保存先確保、通信、保存待ちを含む。wall-clockとmonotonic clockの早い期限を採用する。job上限270分はセットアップと停止後保存の猶予であり、科学的測定の4時間を延長しない。停止後の最終保存には最大120秒だけを与え、その間に新たな測定・判定を実行しない。

## 保存と計測の分離

正確性完了、source生成完了、各16個の速度root・運用root・先後ペア完了、および各コマンド終了でcheckpointを作る。速度計測や対局の最中には圧縮・通信せず、Node側が安全な区切りで待機し、保存成功のackを受けて続ける。途中保存の待機も全体4時間へ含める。通信失敗はHOLDで停止し、無断再試行しない。

保存先は同一repoの専用ref `engineering/pbai-p5-evidence`。main、準備ブランチ、P4の証拠は更新しない。各checkpointはevidence.tar.gzとRESUME.jsonからなる新しいcommitで、archiveと各ファイルのSHA-256、run URL、開始・期限、完了局数を含む。履歴はforce更新せず、以前のcheckpointも保持する。最後にActions artifactへ残りの全runを保存する。artifact保持は90日、専用refはリポジトリの保存記録として扱う。

## 一度限りの起動と停止

最初の科学seedを開く前に、GitHub APIで専用refを原子的に新規作成する。存在していれば別runner・別チャットからも再開始を拒否する。ref作成の応答が不明な通信障害も安全側で止め、同じrunを再試行しない。labelの付け直し、ActionsのRe-run、ローカルの開始marker削除を再試行手段にしない。Actionsのrun_attemptが1以外なら正式jobを実行しない。

外側監視器の停止、保存失敗、全体期限、候補gate不成立は後続を止める。SIGKILLやrunner消失時は最後の外部checkpointが残る範囲だけを証拠とする。最新の最大15ペア等がまだ外部保存されていない可能性は残る。開始claimを消して試験し直さず、未完了・未保存分はINCOMPLETE/HOLDと記録する。未完了の対局を敗北・引分へ置換しない。

## 根拠と検証範囲

[GitHub公式のPRイベント仕様](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)と[ref作成API](https://docs.github.com/en/rest/git/refs#create-a-reference)を参照した。準備試験では人工データで、実Nodeの待機・保存ack、archiveのhash、別実行からのclaim拒否、保存失敗時の停止を確認する。ネットワークAPIは模擬応答で試験し、本物の科学run用refはまだ作成しない。実際の書込権限・通信経路は正式開始時にseed消費前のclaimと最初のcheckpointで確認する。
