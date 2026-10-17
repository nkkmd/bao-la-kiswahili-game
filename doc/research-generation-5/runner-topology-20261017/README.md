# 親runnerによる全工程監督の実装可能性調査

## 結論と今回進んだ工程

PR #209を統合したmain `26c63fa9fa77eb00b76957b2feff6ddca81c0ced`から、初回準備を含む監督方式を調べた。判断は`PARENT-RUNNER-SCOPE-REQUIRED-NOT-PROVEN`である。**job開始hookやjob containerを追加するだけの方式は、現在の全工程要件を満たさない。** runner自身を起動前から管理する方式を次の設計候補に絞るが、実行可能な専用環境は未確認で、配備・科学実行は行っていない。

今回閉じたのは方式選定の確認事項であり、全工程の実OS成立ではない。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・科学leaseなし、`wholeLifecycleOsProven: false`を維持する。主要課題・103355件遮断・全合法手完全閉包・未知・固定有限開発コーパスの解釈を変更しない。公開ゲーム・AI-GEN4・Workerと旧科学入力も変更しない。

## 一次資料と既存実行の照合

PR #209の修正後の既存[Actions run 38993598222](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38993598222)・attempt 1、job `117281084211`のログを取得した。runner版表示は`2.337.0`である。同版の公式tag `v2.337.0`が指すコミット`397b032cbf865e9c3ddfab89d533ec19325e1273`から3ソースとMITライセンスを保存し、GitHubが返したGit blobと各fileを照合した。

| 確認事項 | 保存資料からの根拠 | 意味と限界 |
| --- | --- | --- |
| hookより前の取得 | JobExtension.csの299行でPrepareActionsAsyncをawaitし、302行以降で開始hookを登録する | 開始hookの追加だけでは先行取得を管理できない |
| job containerの限界 | 同fileの313行以降でcontainer準備を追加する | container内部の制限だけでrunnerの先行取得を覆わない |
| 初期化とstepの順序 | JobRunner.csの190行で初期化、240行でstep実行を行う | 最初のrun stepからの監督も遅い |
| 実行時の順序 | 保存ログの31・32行にcheckout/setup-nodeの取得、34行にcheckout step開始がある | この既存jobで初回step以前の取得を実際に観測した |
| runner内部の再試行 | ActionManager.csのDownloadRepositoryArchiveにretry loopがある | 親scopeへ入れただけでは一度限り通信の条件まで成立しない |

[検算結果](VERIFICATION.json)はソースとログの行番号を機械的に再確認する。版表示とtag対応はソース調査の対象選定に使うだけであり、実行バイナリのhash一致の証明ではない。上流mainの現在コードを、過去jobの実装と同一視しない。

保存ログはGitHubコネクターが返した**復号済みテキスト**である。HTTP上の原log archiveのbyte保存や署名済みの実行証明とは扱わない。[job metadata](evidence/JOB_METADATA.json)はコネクターによる正規化済みの値、[run metadata](evidence/RUN_METADATA.json)は取得したAPI応答のJSON表現である。保存後の改変拒否は[入力manifest](INPUT_MANIFEST.json)で行う。これらは元実行の全工程資源を後から証明するものではない。

公式の[開始・終了hookの説明](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/run-scripts)と[containerカスタマイズの説明](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/customize-containers)はself-hosted runner向けである。「jobより前」という説明から、全てのrunner初期化より前だとは推定しない。取得時点の公式資料を参照し、実行順序の結論は上記固定ソースと保存ログに基づく。

## 内部retryの扱い

固定ソースではarchive取得のloopが最大3試行の経路を持つ。`_GITHUB_ACTION_DOWNLOAD_NO_BACKOFF`は待機を省く分岐であり、このloop自体を無効化する設定ではない。今回のjobでretryが発生したという主張はしない。旧技術実行の科学的状態や有効性も変更しない。

最終科学経路では、runnerによるActions取得を含めて通信の範囲と一度限りの意味を固定する必要がある。予期しない取得失敗をrunner内部で救済できる構成を、通信retryなしと宣言しない。将来の設計で一部の基盤通信を別の扱いにする場合も、その境界は実行前レビューの対象であり、今回の調査で認可したことにはならない。

## 環境の確認と残る阻害要因

[読取専用の環境観察器](../../../tools/research/g5-runner-topology/inspect-host.py)を現在の作業環境で実行した。[保存観察](evidence/LOCAL_HOST_OBSERVATION.json)ではPID 1がsupervisord、systemd起動なし、cgroup v2は存在するがmountは読取専用で、観察者による書込は不可だった。この環境で親systemd unitを実証できたとは扱わない。

これはChatGPTの現在の作業環境についての観察で、GitHub-hosted runner全般の能力調査ではない。コマンド名としてsystemctlが存在するだけでも成立としない。self-hosted runnerの登録情報・機械・委任済みcgroupは確認しておらず、存在しないとも断定しない。環境観察器は権限昇格、cgroup変更、runner登録、認証情報の探索、通信を行わず、条件が見えても実行認可を返さない。

次は[親runner実行設計](PARENT_EXECUTION_DESIGN.md)に従い、専用環境とrunner起動前の管理経路を確定する。利用できる環境を確認しないまま、self-hostedラベルのworkflowを投入して待たせたり、機械を新規契約したりしない。現在のhosted workflowへhookを追加する案の実OS試験や、成功済みcapsule取引の反復は行わない。

## 再現と品質

```bash
python3 tools/research/g5-runner-topology/test-verify.py
python3 tools/research/g5-runner-topology/verify.py
```

3検査で保存資料の整合、ソース・manifest・ログの改変拒否、ログ順序・runner版の読み替え拒否を確認する。検算器は通信、mount、C#ソースのcompile/実行、科学APIの読込を行わない。CIでは出力を[保存結果](VERIFICATION.json)と比較する。環境観察器を別のhostで実行した値を、保存済みの観察と一致させる必要はない。

人間向け対象は本書、親runner設計、現在案内9文書の変更箇所である。説明と見出しは日本語、ID・path・command・field・hashは機械定義の例外である。上流のC#ソースとLICENSE、API metadata、復号済みlogは原文資料の例外として保存し、その意味と限界を本書で日本語説明する。MITライセンスの著作権表示を保持する。リンク切れ・意図しないcode block変更・canonical情報変更を0件とする。

保存した原文は[JobExtension.cs](upstream/src/Runner.Worker/JobExtension.cs)、[ActionManager.cs](upstream/src/Runner.Worker/ActionManager.cs)、[JobRunner.cs](upstream/src/Runner.Worker/JobRunner.cs)、[MITライセンス](upstream/LICENSE)である。公式の[固定コミット](https://github.com/actions/runner/commit/397b032cbf865e9c3ddfab89d533ec19325e1273)と[SOURCE_ORIGIN.json](SOURCE_ORIGIN.json)を参照できる。

変更対象11文書の相対リンク切れは0件、説明見出しと通常説明文は日本語である。固有名・Study IDの既存見出しはcanonical例外として保持した。新規検算3件と現在checkoutの改変拒否6件は合格した。旧中間保存の完全監査とPRのCI・統合の実際の結果は、それぞれの出力とPR記録で確認する。
