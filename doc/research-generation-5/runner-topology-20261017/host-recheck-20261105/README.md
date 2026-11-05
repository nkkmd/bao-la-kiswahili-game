# 起動・保存設計の停止点とWSLの現在値確認

## 今回の結論

2026-11-05、GitHubのmain `7358d035b8c402b2b1964d34c4ca4940ace1a055`、tree `0884330e58ebec019fe2c7f3aba9cfd4c288ee51`を照合した。PR #230後の変更と未統合PRはなかった。作業領域の自動メンテナンス後、GitHubから履歴を復旧した。復旧時の無関係な未追跡一時ファイル3件は変更へ含めない。

[停止専用FDと最終送信案](../launcher-terminal-20261105/README.md)を検討したが、起動担当Lの初回ロード計数と、最終ACK記録・親終了証拠の保全は未解決である。文書上の順序を詳しくしただけで配備可能とは認定しない。次の環境側判断に必要な現在値を受け取るため、設定変更を伴わない観察器を追加した。ユーザーWSLの現在値はまだ受領していない。

## 2つの設計条件に対する停止判断

| 条件 | 検討した経路 | 現時点の判断 |
| --- | --- | --- |
| 初回ロード | OS側が先に制限を確立し、その中でLを初回execする | 設定生成・起動前処理の担当と計数、既存信頼基盤との境界が未固定。LをC外で動かした後のコピーでは補えない |
| 最終保存 | 全子停止後、S自身が子を作らずDを送信する | DのACKだけでは、その後の制御記録Tと親終了証拠Eの外部保全が閉じない。保存対象の除外・事後回収・別uploaderで補えない |

従ってrunner改変・build・登録・実行、新規remote結合試験、実行可能なunit/launcher作成へ進まない。現行契約を満たす経路が得られなければ成立不足として止める。新しい試験を増やしてこの不足を埋めたことにしない。

## 読取専用観察器

[observe-parent-host.py](../../../../tools/research/g5-runner-topology/observe-parent-host.py)はPython標準libraryだけを使う。科学code・manifest指定入力・seedを読まない。stdoutへJSONを返すだけで、結果fileの作成・設定変更・root権限・package導入は要求しない。今回の調査を科学用20分・容量内の実証へ転用しない。

| 読取対象 | 方法・範囲 | 意味しないこと |
| --- | --- | --- |
| architecture・kernel | os.unameのmachine/release。hostnameは出力しない | WSL buildと上流ソースの同一性 |
| systemd版・稼働状態 | systemctl --version、system側is-system-running | 専用unitの作成権限、停止の実効性 |
| 現在UIDのuser service | system側showでControlGroup/ActiveState/Delegateのみ | Delegate=yesからtask隔離や制限解除禁止を認定しない |
| cgroup rootと返却された委任先 | type/controllers/subtree_control/memory.max/memory.swap.max/eventsの6file、各最大4096 byte | 全階層の走査、memory/swap制限の書込試験、全体peakの測定 |
| cgroup.kill | lstatで存在・種別・modeだけ | open・書込・kill・権限行使の成功 |

systemctl呼出しは固定3種類で各5秒のtimeoutを設け、失敗時の再試行や別commandへのfallbackをしない。stderrは保存しない。ControlGroupが不正・欠落なら観察不能とし、過去のpathや値で補わない。取得は逐次で、原子的snapshotではない。返却pathは選択rootの内側へ限定するが、観察中の全階層変化を原子的に防ぐものではない。

## ユーザーWSLでの確認手順

統合後の案内で示す固定PR headからscriptを読む。Git履歴を取得する操作はローカル.gitを更新するが、WSL設定や作業treeを変更しない。checkout・reset・pull・sudoは不要である。既にそのcommitを持っていればfetchは不要。

```bash
git fetch origin main
git show <今回PRの固定head>:tools/research/g5-runner-topology/observe-parent-host.py | python3 -B -
```

上のheadは説明用placeholderで、実際の固定SHAはPR記録とユーザーへの案内で示す。scriptのSHA-256は`f0236e9368afcf0f8243d1d637fc7fb339ff8cf29d15f0d36f6439659aa8e342`である。ユーザーのリポジトリ内で実行し、stdoutを共有する。ChatGPT側で観察器を起動した結果をWSLの証拠にしない。

現在値が不足・変化していればそこで止め、必要な変更と影響を整理する。従来値と一致しても権限・隔離・起動/保存条件の成立を認定せず、system側の限定起動と最終保全を具体化する設計へ戻る。設定変更・管理者操作を自動で続行しない。

## 検証と残工程

[人工入力の5テスト](../../../../tools/research/g5-runner-topology/test-observe-parent-host.py)で、commandの固定、path逸脱・重複propertyの拒否、観察不能の保持、過大file・末尾symlinkの拒否、kill fileをreaderへ渡さないことを確認する。CIもこの人工入力だけを使い、host観察・runner・科学codeを起動しない。

```bash
python3 -B tools/research/g5-runner-topology/test-observe-parent-host.py
```

5テストの成功は実WSLでの観察・権限検証ではない。既存の6gateは全て未成立で、Node20互換性・全client・下位無再送・全egress拒否・OS制限・全保存peak・最終receiptは未認定のままである。[全工程完了判定](../../befcs-capsule-20261016/COMPLETION_GATES.md)の後続である既知fixture接続、最終事前固定、一度限りの科学供給、準備判定、条件成立時の正式検証、終了報告も残る。

第五世代研究は継続中。主要課題、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と選定差0件を維持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiBは変更しない。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseである。提案seedの読取・生成、旧区画/root/witness延長、source追加、候補差替え、上限増加、救済的retry、成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Workerを変更しない。

人間向け監査は本書と研究案内5文書の追補、計6文書を対象とする。英語だけの見出し・通常説明文、リンク切れ、意図しない既存code block・canonical情報変更を0件とする。Python/JSON/path/ID/field/commandは機械定義例外で、日本語説明を付ける。[現在用保存監査](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)を適用し、旧凍結verify.pyを現在案内へ流用しない。CI・自己レビュー・統合後監査はPR記録へ残す。
