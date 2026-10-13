# 第五世代研究 — 現在の状態

更新日: 2026-10-13（日本時間）  
状態: **全workload実cgroup合格・科学用host統合前／新規Study登録前／正式関係は未登録・未実行**

## 現在確定していること

現在は、[分岐包絡供給の技術preflight](branch-envelope-preflight-20261013/README.md)が合格し、source選定・独立再生・全閉包・停止保存を固定fixtureで確認した。BEFCS-STUDY1の科学登録・実行はまだ行っておらず、科学seed消費0、leaseなし、科学source未固定、実行未認可である。運用moduleと実128 MiB/1 GiB OOM確認は合格した。[保存済み全workload統合](befcs-workload-20261013/REPORT.md)のローカル検証も合格し、[全pipeline実cgroup確認](befcs-workload-20261013/CI_CONFIRMATION_V2.md)も合格し、次は科学用hostへの結合・最終freezeを整える。

中心課題は「探索順位の変動と、完全解析した局面における選択手の厳密価値損失との関係」である。[研究計画](PROGRAM_PLAN.md)の第1段階を[G5-01](g5-01/README.md) / `RRSVL-STUDY1` として具体化した。ユーザーの着手指示に基づく[実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)で、対象、現行takasiaルール、測定、計算上限、独立検算の範囲を固定した。

2026-10-12に既知fixture限定のStage 0が `STAGE0-TECHNICAL-PASS` となった。ローカルとGitHub Actionsのcore hashが一致し、技術テスト7件、takasiaエンジン・AI回帰36件が合格した。[技術検証報告](g5-01/STAGE_0_REPORT.md)に結果と検算範囲を記録する。技術合格は科学的な関係の確認とは別である。新規対局生成、科学的seed読取、正式解析、正式検定、公開AI変更はこの技術工程に含まれない。

第四世代の確定結果は変更しない。G4-03の順位変動と幅の関連、G4-05・G4-09の固定8領域、G4-09一般Module Aの標本条件未達、G4-10の`NON-ESTIMABLE`を、それぞれ元の範囲のまま参照する。

研究ブランチは `research/g5-01-measurement-readiness`。Stage 0ソース固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`、Actions runは `38229687584`。この作業は研究ブランチで記録し、mainへの統合は未実施である。

## 独立遷移の技術検証

工程2へ進めるユーザー指示を受け、[独立遷移の技術契約](g5-01/transition/TECHNICAL_CONTRACT.md)と、現行エンジンを呼び出さない環状配列の実装を準備した。固定40 fixtureと相対深さ2の全合法遷移を照合し、416状態・411辺で独立一致した。[独立遷移報告](g5-01/transition/REPORT.md)の技術判断は `STAGE0-TRANSITION-TECHNICAL-PASS`。遷移テスト6件とActions run `38231679692`が合格した。新規局面の全閉包を検証した結果ではない。[新規局面の開発診断設計](g5-01/DEVELOPMENT_PLAN.md)で候補選定・証拠分離・資源条件を具体化した。

## Stage 1の開発診断

[開発契約](g5-01/development/CONTRACT.md) / `RRSVL-S1-DEVELOPMENT-2026-10-12-v1` を事前固定し、Actions run `38234120711` / attempt 1で `50112001..50112032` の32 sourceを一度だけ生成した。全32 sourceの独立再生が合格し、要約・消費journal・候補固定・圧縮証拠・検算をコミット `f9d66df5998dd0be8570c2d855dcb89cd45c1bae` で研究ブランチへ保存した。

実行判断は `STAGE1-DEVELOPMENT-COMPLETE`、検算は `STAGE1-DEVELOPMENT-INDEPENDENT-PASS`。ただし候補は0件で、新規の完全閉包・厳密解の解析は未実施である。[報告](g5-01/development/REPORT.md)に結果と限界を記録する。開発診断の完了を、解析領域の供給や正式検証への適格性の成立へ読み替えない。

保存済み着手記録の事後診断では、ply・段階・合法手幅の条件を通過した23 sourceの311状態がすべて「占有穴数12以下」で除かれ、当該範囲の最小占有穴数は16だった。新しいsource生成、候補再選定、閉包再解析は行っていない。

## 終了境界と次の研究

本Stage 1 v1の区画は消費済みとして閉じる。同一区画の再実行、seed追加、候補置換、条件緩和による再選定、上限引上げは行わない。正式な順位変動・価値損失の関係は未承認・未実施であり、Bao全体や公開AIについて結論を出さない。

次は[新しい独立Studyの設計事項](g5-01/development/NEXT_RESEARCH.md)で、完全解析領域の供給と実資源を問う前提研究を検討する。新しいID、source・区画、結果を使わない選定、資源・重複・停止条件を結果前に固定する。今回の32 sourceを正式holdoutへ昇格させない。

長時間実行は引き続きGitHub Actionsを第一候補とする。main統合は未実施で、公開AI採用は別のAI Engineering判断である。

## 正本

- [入口](README.md)
- [研究計画](PROGRAM_PLAN.md)
- [G5-01技術契約](g5-01/TECHNICAL_CONTRACT.md)
- [研究ログ](RESEARCH_LOG.md)
- [再開位置](RESUME_HERE.md)
- [第四世代の最終統合](../research-generation-4/FINAL_SYNTHESIS.md)

## G5-02の供給診断完了

ユーザーの継続指示に基づき、[G5-02](g5-02/README.md) / `RECSF-STUDY1` の[契約](g5-02/CONTRACT.md)を事前固定した。Actions run `38237119716` / attempt 1で新規32 sourceを一度だけ生成し、16適格rootから固定8候補を解析した。全8候補が状態5000上限で未完となり、完全閉包供給は0件だった。32 sourceと保存40282辺の独立照合、artifactとブランチ保存はsuccess。原証拠は `c6d6a40cd1a1539b28219d57bffe54c5ce776fb2` で保持した。

[最終報告](g5-02/REPORT.md)、[再現性](g5-02/REPRODUCIBILITY.md)、[研究ログ](g5-02/RESEARCH_LOG.md)、[次の再開位置](g5-02/RESUME_HERE.md)に結果と境界を記録する。実行完了は完全解析領域の供給成功を意味しない。G5-01とG5-02の区画はともに消費済みで、未試行候補の補充や上限引上げによる延長はしない。

次は別Studyで供給戦略や状態・保存資源を再設計する。旧2094状態と今回41731状態の和集合を既読として扱い、新規証拠と問いを固定してから着手する。研究ブランチ `research/g5-02-exact-supply` のdraft PR #182はPR #181の研究ブランチを基底とする。正式関係検証、main統合、公開AI変更は未実施である。

## 2026-10-12 — G5-03の構造供給完了

[G5-03](g5-03/README.md) / `BTCS-STUDY1` の[固定契約](g5-03/CONTRACT.md)に基づき、新規64 sourceを一度だけ実行した。全合法分岐が2手以内に自然終局する10適格rootの最初の8候補で、完全閉包・厳密解を取得した。各3〜12状態・合計45状態37辺で、全解が独立一致した。Actions run `38239145152` / attempt 1とローカル再検算が合格し、原証拠を `8e4090020bd474e7d8ae7a2d40c19a2d14c8c02c` で保存した。

ただし全8 root内の全23合法手は同じ勝敗価値・DTFだった。特殊層での供給成功と、価値損失の変動事例が得られなかったことを分けて保持する。[最終報告](g5-03/REPORT.md)、[再現性](g5-03/REPRODUCIBILITY.md)、[研究ログ](g5-03/RESEARCH_LOG.md)、[再開位置](g5-03/RESUME_HERE.md)を参照する。

3 Studyの区画はすべて消費済みで、既読和集合は47483 RAW識別。次は別の新規Studyで小さな完全閉包の構造と推定可能性を設計し、今回のrootを深さ拡大・価値差選定で救済しない。正式関係検証は未承認・未実施で、mainと公開AIは未変更。PR #183はPR #182の研究ブランチを基底とするdraftである。

## 2026-10-12 — G5-04の供給完了とDTF差

[G5-04](g5-04/README.md) / `MTCS-STUDY1` の[契約](g5-04/CONTRACT.md)を固定し、新規128 sourceを一度だけ実行した。全分岐4手以内自然終局・2手以内未閉包の9適格rootの最初の8候補で完全閉包を得た。合計169状態162辺と全解が独立一致し、Actions run `38263687093` / attempt 1とローカル再検算が合格した。原証拠は `6a103cf4f55ec9e7ec84cf31f6d878fae3fb3ef4` で保存した。

全8 rootの勝敗価値はroot内で同じだが、3 rootにDTF差がある。同価値内の手数差を勝敗価値損失の変動例にしない。[最終報告](g5-04/REPORT.md)、[再現性](g5-04/REPRODUCIBILITY.md)、[研究ログ](g5-04/RESEARCH_LOG.md)、[再開位置](g5-04/RESUME_HERE.md)を参照する。探索条件間の順位比較・正式関係検証は未承認・未実施である。

4 Studyの区画はすべて消費済みで、既読和集合は58532 RAW識別。次は達成済みの解析基盤・供給・DTF差記述と未確保の勝敗価値差事例を分離し、追加実行前に正式検証の対象・最低条件と供給戦略を再評価する。今回のrootの延長・価値差による入替え・9番目の追加解析は行わない。draft PR #184はPR #183を基底とし、main・公開AIは未変更である。

## 2026-10-12開始 — 主要関係の準備再評価

[準備再評価](readiness-review-20261012/README.md)で終了済み4 Studyの256 source・消費・ソース・原検算記録を再監査し、全検算が同じバイトで一致した。16完全領域の214状態、84非終局・67複数手局面に手間勝敗価値差は0件だった。内部のDTF差は6件で元のroot3件を含むが、新しい候補として採用していない。

判断は `PRIMARY-READINESS-NOT-MET`。開発上の準備判断で、正式な仮説否定やNON-ESTIMABLEではない。新規seed・再選定・探索比較・正式検定は0件。主要指標をDTFへ差し替えない。[設計案](readiness-review-20261012/DESIGN_PROPOSAL.md)で対象・指標・情報量・samplingと条件付き精度を分離し、[再開位置](readiness-review-20261012/RESUME_HERE.md)で新しい供給方策と確率モデルを具体化する。93単位ずつという精度案は条件付き提案で、正式登録や実行認可ではない。main・公開AIは未変更である。

## 2026-10-13 — 応手種別による新しい供給設計

[供給設計](source-design-20261013/README.md)で、root手によって相手の捕獲手とtakataの応手集合に分かれる非終局構造層を具体化した。全軌跡の最後の構造適格rootを閉包前に固定する案で、着手の擬似乱数方策を保持する。旧部分グラフ内に284構造適格nodeがあったが、全て未完領域にあり、勝敗価値差・完全閉包供給・費用は未確認である。

状態はSOURCE-DESIGN-SPECIFIED-NOT-EXECUTED。構造判定の7fixtureと保存監査の再生が合格した。新規source・遷移・候補再選定・正式推論は0件。[設計](source-design-20261013/DESIGN.md)で64 source・8候補・資源・有限開発コーパスの記述対象を具体化し、[再開位置](source-design-20261013/RESUME_HERE.md)に実装・新規契約・未使用区画・一度限り実行の条件を残した。主要関係はPRIMARY-READINESS-NOT-MET、正式比較は未登録・未実行のままで、main・公開AIは未変更である。

## 2026-10-13 — G5-05の応手種別供給を事前固定

[G5-05](g5-05/README.md) / MRCS-STUDY1は、全軌跡最後の応手種別分岐rootを新規64 sourceから最大8候補へ固定する開発供給である。[契約](g5-05/CONTRACT.md)で旧58532状態遮断、全合法手閉包・独立再生、資源・読取journal・一度限り消費と不足時の終了を固定した。12技術fixtureがローカルで合格し、ソース固定・Actions技術CIの後、別triggerと永続leaseにより実行する。

正式関係は未登録・未実行、対象は固定有限開発コーパスである。IIDや93ずつの精度案を適用せず、DTFを主課題へ差し替えない。原記録・main・公開AIを保持する。[再開位置](g5-05/RESUME_HERE.md)を参照する。

## 2026-10-13 — G5-05の終了・構造差供給と全閉包未供給

[G5-05報告](g5-05/REPORT.md)で、新規64 sourceを一度だけ実行した結果を確定した。35構造適格代表の最初の8候補を固定して解析し、6領域は5000状態上限、2領域は別の合法枝のruntime guardで停止した。完全閉包0件で、8候補の勝敗価値差は未確定である。全64 source・513 screen・39354保存辺の独立検算と保存は合格した。原証拠は5cfe0f00629f65995a2d6be5889cebbe68bb8940、Actionsは38313556402 / attempt 1で保持する。

5区画は全て消費済み、既読和集合は101691 RAW識別となった。構造差の供給と全解析未達を区別し、guardを自然敗北・無限反復へ変換しない。追加source・未解析27代表の補充・旧root延長・状態上限引上げ・retryをしない。次は[科学用遷移と解析方式の再評価](g5-05/NEXT_RESEARCH.md)を先に行い、新しい区画を自動追加しない。正式関係は未登録・未実行、main・公開AIは未変更である。

## 2026-10-13 — 科学用遷移・可逆保存の技術再評価

[方法再評価](method-review-20261013/README.md)で、runtime上限による勝者付与を外した研究用遷移の二実装を確認した。既知40fixtureの416状態・411遷移と全microstate列が一致し、上限1の技術例では自然停止する5手のruntime勝者と科学的未知を分離した。G5-05の実際のguard witnessを延長した結果ではない。

422技術境界RAWの独立二codecは復号/旧RAW hashが一致し、符号化payloadは104660から13926 byteとなった。科学BFSの実資源改善は未測定である。[方法選択](method-review-20261013/METHOD_DECISION.md)はguard-free遷移と可逆保存を全閉包BFSへ統合する技術検証を優先し、抽象戦略証明の採用は現行Programの全閉包要件との適合レビューへ留保する。新規科学sourceは0件、全閉包要件は保持する。

旧101691状態と新技術RAW射影を合わせた保守的遮断集合は102329識別となる。中間状態を新候補・到達性証拠へ昇格させず、旧5区画・原記録を保持する。正式関係は未登録・未実行、main・公開AIは未変更。[再開位置](method-review-20261013/RESUME_HERE.md)を参照する。


## 2026-10-13の全閉包BFS統合検証

[全閉包統合](bfs-integration-20261013/README.md)で、科学用遷移と可逆RAW保存を固定fixtureのBFSへ統合した。既知Baoの3状態・2辺と固定抽象例で全合法手・全辺・独立解・snapshot/journal復元が一致した。未知・停止証拠・未展開境界・各辺metadataを保持した。[報告](bfs-integration-20261013/REPORT.md)に9テスト、全10 fixture、保存量と全測定を示す。

1024状態の抽象例でjournal込み保存は4363460から3988337 byteとなったが、科学BFSの資源改善や新規完全領域を確認した結果ではない。初回RSSの全同値も保持し、Linux補助計測を別契約で保存した。新規科学source/seed/候補・旧witness延長は0件である。

保守的遮断は103355 RAW識別となった。全閉包要件と正式関係未登録/未実行を保ち、次は[別Studyの登録条件](bfs-integration-20261013/RESUME_HERE.md)を具体化する。旧区画を救済・補充せず、技術合格から科学sourceを自動起動しない。main・公開AIは未変更である。


## 2026-10-13 — 分岐包絡による新しい供給Studyの設計案

[BEFCS-STUDY1提案](branch-envelope-20261013/README.md)は、G5-05のroot・27代表・seedを延長しない新しい有限開発案である。fresh trajectoryで最初の適格rootを選び、各root子の応手数合計を16以下に事前制限する。提案seed範囲`50613001..50613128`は空き照合のみで、未予約・未消費。10k状態/128k辺/180秒、全体20分・1 GiB・256 MiBと保存reserveを提示するが、新規Baoの完全閉包量や供給成功を保証しない。

状態はPROPOSAL-NOT-REGISTRATION-NOT-EXECUTEDで、seed消費0・leaseなし・source未固定・実行未認可。次は別source実装とfixture preflight、独立候補/閉包検算、保存上限testを行い、条件が揃うまで区画を開始しない。固定有限コーパスにIID/一般局面の推論を適用せず、主要関係は未登録・未実行、DTFへ差し替えない。旧記録、main、公開AIを保持する。


## 2026-10-13 — 分岐包絡供給のsource・保存fixture技術合格

[技術preflight](branch-envelope-preflight-20261013/README.md)で、第一適格root、全2-ply screen、独立source/edge再生、予約域付きjournal/snapshotとgzip分割を実装した。22新テストと先行BFS 9テスト、10 source/7 closure fixture、17 bundleが合格した。実容量256 MiB・16 MiB reserve、48 MiB以下・最大6片の復元を検査した。観測532 RAWは全て既読で、保守的遮断は103355識別のまま、555保護入力のbytesを保持した。

科学source/seed/候補・旧root/witness延長・正式推論は0件である。BEFCS-STUDY1は未登録・未実行、leaseなし、科学source未固定、実行未認可。次は科学用SPEC/契約/認可範囲と全区画lease・読取前consume・attempt 1固定の別trigger・常時保存/mirrorを具体化する。fixture技術合格から科学sourceを起動せず、全閉包と未知の保持、不足時終了、追加/差替え/retry禁止を維持する。main・公開AIは未変更である。

## 2026-10-13 — 一度限り運用のfixture検証

[運用preflight](befcs-operations-20261013/README.md)で、Gitの原子的全区画取得・読取前marker・稼働中/終了mirror・合算RSS監督を実装した。15運用テストと31先行回帰テストが合格し、1区画・128論理marker・8 mirror・137 commitを保存Git bundleから独立復元した。科学PRNGの初期化は0件で、新規Bao RAWは観測していない。実128 MiB/1 GiB cgroupはActions確認待ちである。

[科学契約案](befcs-operations-20261013/CONTRACT_DRAFT.md)は未登録案で、次は科学source/独立replay・全閉包保存とcontainer/mirrorの全workload結合、最終freeze・CI receipt・別triggerを整える。584保護入力と103355件遮断を保持し、科学seed消費0・科学leaseなし・科学Study未登録/未実行、正式関係未登録/未実行、main・公開AI未変更である。技術合格を科学供給へ昇格させない。

## 2026-10-13 — 運用cgroupの確認と保存済み全workloadの結合

[運用cgroup確認](befcs-operations-20261013/CI_CONFIRMATION.md)をPR #192へ保存し、実128 MiB/1 GiBのOOMとprefix保持が合格した。[全workload統合](befcs-workload-20261013/README.md)で保存済み技術source 128件・固定抽象閉包8件を共有保存予算、marker、mirror、停止監督へ結合した。58ローカルテスト・8シナリオと実256 MiB容量境界が合格した。科学生成の費用・供給結果へ昇格させず、実1 GiBの全pipeline CIと科学用hostの結合・最終freeze・別triggerは[再開条件](befcs-workload-20261013/RESUME_HERE.md)に残す。科学seed消費0・科学leaseなし・科学Study未登録/未実行、103355件遮断、正式関係未登録/未実行、main・公開AI未変更である。

## 第2版の全workload実cgroup確認完了

[CI確定](befcs-workload-20261013/CI_CONFIRMATION_V2.md)でpush/PRの全stepと同一headの15 runが成功した。旧failureを保持し、実1 GiBの8固定シナリオ、256 MiB共有容量、UID/GID対応後の後片付けとartifact保存を確認した。現行は第2版16入力・623保護入力を固定する。次は科学用host/registry/別triggerの接続と最終科学事前固定であり、科学seed消費0・科学leaseなし・未登録/未実行、103355件遮断、正式関係未登録/未実行、main・公開AI未変更を保つ。
