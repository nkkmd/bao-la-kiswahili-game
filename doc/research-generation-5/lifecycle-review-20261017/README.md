# 全工程の計測範囲の再開監査と次の実装条件

## 現在地と今回の変更

2026-10-17の再開時点で、GitHubのmainはPR #208の統合コミット`16218592f417b1e5f19a38a5beabc15f66a4c7b2`だった。保存済み原ZIP・原image・Git objectを再検算し、通常ケースの実行内ACKと、ACK抑止ケースの未ACKを確認した。研究の主要準備判断は`PRIMARY-READINESS-NOT-MET`のままである。

今回は成功済みの取引を再実行せず、[計測範囲の監査器](../../../tools/research/g5-checkpoint/audit-lifecycle.py)と[機械可読結果](COVERAGE.json)を追加した。監査器は原証拠の完全検算を先に行い、service内の測定値と全工程の未測定値を分離する。全工程の時間・memory peak・storage peakは`null`であり、0でもservice内測定値でもない。元の`chargedBytes`は`RESULT.json`書込前の測定であり、`inScopePreResultChargedBytes`として保持する。service内の最終保存量も`null`であり、元記録の上限再検査の成功から正確な最終byte数を推測しない。将来の入力が範囲成立を主張しても、旧証拠専用の監査器は自動承認せず停止する。

判断は`WHOLE-LIFECYCLE-READINESS-NOT-MET`。これは今回追加した計測範囲の技術判断で、科学的仮説の否定や第五世代研究の終了判断ではない。科学実行を認可する機能もない。BEFCS-STUDY1と正式関係は未登録・未実行、新規科学seed消費0・科学leaseなしを維持する。

## 保存証拠から確定できる境界

| 工程 | 現在の証拠と位置 | 次に必要な証拠 |
| --- | --- | --- |
| bootstrapの初回ロード | 計測serviceの作成前。コピーの保存はロード時の資源証明ではない | 最初の取得・読込より前から動く親監督と入力hash |
| Actions checkout・Node準備・起動 | workflow上でsystemd-runより前 | 準備用プロセスを含めた親scopeと共通開始点 |
| 固定code取得〜原image封印 | service内で計測し、原imageを保存済み | 既存部分証拠を保持し、全工程の予算へ結合 |
| 封印後のjournal・ACK | service内で記録するが、封印imageの外にある | journalの完全性、imageとの結合、期限内の外部保全 |
| artifact upload | service終了後のActions step | uploaderと圧縮・一時fileを含む資源、期限、保存receipt |
| 全工程の終了判断 | 部分serviceのfinishedだけがある | 全子停止、全保存対象のreceipt、全工程の停止理由 |

封印後journalが「imageに入っていない」ことと「計測service外にある」ことは異なる。前者は真、後者は偽である。しかし後続artifact保全はservice外なので、journalが元実行の全工程予算内で外部保存されたとは認定できない。実行後の取得・main保存は復旧証拠であり、元実行の時計を補完しない。

## 次の実装方針

現在のworkflowに計時stepを足すだけでは、先行checkout・Node準備のmemory hard capと作業領域を覆えない。`timeout-minutes`もserviceと共通の単調時計・1 GiB制限・256 MiB保存上限を証明するものではない。成功したcapsule取引の再実行を次の工程にしない。

次の対象は、**初回準備を開始する前から存在する親監督環境の実装可能性確認**に限定する。runner側の事前設定を使う案では、job開始前のhookまたは常駐監督が、初回取得より前に対象プロセスを親scopeへ入れられることを確認する。既存のGitHub-hosted runnerでそれが可能と確認した証拠はない。self-hosted runnerの存在・利用許可・接続情報も仮定しない。runner環境を変更する場合は、その構成と入力を科学契約の固定前に具体化する。

実装する親監督には次を要求する。

1. 信頼する事前配置部分と今回計測する処理を列挙する。事前配置したコード・runtimeをhashで固定し、科学inputの初回取得やbootstrapを無言で対象外へ移さない。親監督自身、取得、準備、work、圧縮、Git転送、artifact uploader、後片付けを同じscopeで計数する。
2. 親scopeの1 GiB・swap無効、20分の単一時計と終了予約180秒、全保存256 MiBと終了容量予約16 MiBを維持する。image、sidecar、journal、圧縮一時file、送信bufferの保存分、remote保存byteを分類し、二重計数を許す保守的な合算にする。最終容量だけで途中peakを代用しない。
3. 監督の起動失敗・停止失敗・初回取得の遅延・容量不足・転送応答欠落を、最初の停止理由と保存prefixで区別する。取得・通信の救済的retryをしない。全子プロセスの停止を確認できなければ完成としない。
4. 原imageと封印後制御記録を別の成果物としてhashで結合する。制御記録には原image digest、取引対象、実行内ACKの有無と最初の失敗を入れる。最後のACKをそのACK以前に封印したimage自身へ含めるという循環条件を課さず、最終保存先のreceiptと検算対象の終端を事前に定義する。実行後復元でACK欠落を補わない。
5. artifact保全まで同一scopeへ入れる実装ができなければ、成立不足として停止する。artifactを計測外の便宜的な複製へ位置付け直す変更も、現契約の条件成立とは扱わない。対象範囲の変更は別途レビューし、上限・科学境界を自動変更しない。

親監督の実装可能性と具体的な実行経路が確定するまでは、新しいremote fixtureを起動しない。今回の監査器は実OS adapterや科学gateの代用品ではない。全工程の成立後にも、科学reference API・固定初期状態・独立source再生・全合法手閉包・途中closure/microstate停止証拠の既知fixture接続、最終科学inputとSPEC/CONTRACT/AUTHORIZATION/hash/保護集合/CI receipt/実行前レビュー/専用triggerの事前固定が残る。

## 再現と品質確認

リポジトリルートで次を実行する。通信、mount、科学source生成、旧区画の実行は行わない。

```bash
python3 tools/research/g5-checkpoint/test-audit-lifecycle.py
python3 tools/research/g5-checkpoint/audit-lifecycle.py
```

監査器の出力は[COVERAGE.json](COVERAGE.json)と一致する。3検査で部分測定の全工程への転用、未レビューの範囲成立・欠落field、ACK抑止の完成への昇格を拒否する。原証拠自体の改変拒否は既存のtest-verify-capsule.pyが担う。

今回の人間向け監査対象は本書と現在案内9文書の追補である。英語だけの説明見出し・通常説明文、壊れた相対リンク、意図しないcode block変更・canonical情報変更を0件とする。ID・field・path・command・hash・固定判断tokenは機械定義の例外である。103355件遮断、未知の保持、固定有限開発コーパスの解釈を維持し、DTFへの課題差替え、旧root/witness延長、source追加、候補差替え、上限引上げ、retryを行わない。公開ゲーム・AI-GEN4・Workerと凍結済み入力を変更しない。

ローカル検証では、全G5技術テスト244件、新規境界検査3件、原capsule改変拒否3件、現在checkout監査の改変拒否6件が合格した。旧中間保存の原ZIP5件・3,361 file・43,364,710 byteと保存履歴の完全監査も合格した。対象10文書の相対リンク切れは0件で、変更箇所の日本語品質は合格である。既存の`Bao la Kiswahili`と`G4-xx`見出しは固有名・canonical identifierの例外として保持した。再開時に存在した無関係な未追跡の一時分割ファイルは変更・追加対象に含めていない。CIと統合の実際の状態はPRの記録で確認する。
