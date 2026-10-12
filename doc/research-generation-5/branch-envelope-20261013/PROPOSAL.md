# 分岐包絡による新しい供給Studyの設計案

## 目的と判断状態

提案名はBEFCS-STUDY1、stage案はBEFCS-S1-SUPPLY-2026-10-13-v1である。状態はPROPOSAL-NOT-REGISTRATION-NOT-EXECUTED。名前・seed範囲は空き照合済みの提案値で、正式登録・消費・認可を意味しない。

問いは「新しい固定有限source群から、初期2 plyの分岐包絡を事前に制限した競合応手構造を選ぶ規則が、全合法手の完全閉包を供給できるか」である。補助記述として、得られた全root手の厳密勝敗値の範囲と値損失差の有無を報告する。値差が出るよう候補を選ばない。順位条件間の正式関係検定、一般局面への推論、公開AI評価は含まない。

## 前段からの切り替え理由

G5-05は全軌跡最後の混合応手rootを8件固定したが、完全閉包0件だった。5件は5000状態上限、2件は閉包内のruntime guard、1件は別の状態上限で停止した。新しいBFS技術検証は既知Bao完全領域で一致し、1024-node抽象fixtureの保存・資源を比較できた。ただし実Bao新規closure規模は測っていない。

同じ8候補を延長せず、旧27代表の代替を選ばず、状態上限だけで旧領域を再試行しない。新案ではfresh trajectoryの「最初の」条件適格rootを固定し、全root子の応手数の**合計**にも上限を置く。閉包前に測れる枝量を抑える構造上の新しい選択規則である。自然終局までの全閉包量は保証しない。

## sourceと候補を固定する規則

現行ルールBAO-RULES-V0.2.0-TAKASIA-001と標準初期配置を用い、128個の新しいsourceを独立trajectoryとして生成する。proposal seed block `50613001..50613128` は既存リポジトリ記録で同一文字列の使用がないことを確認しただけで、予約も消費もしていない。source選択は既存のcanonical moveKey順・xorshift32・整数棄却方式を別source IDの下で再実装する。各trajectoryは自然終局または512 plyで止める。

ply 48以後の各rootを時系列順に調べ、最初に次を全て満たす1 rootをそのsourceの代表として固定する。

- rootは非終局mtaji、両reserve 0、合法手数2〜4。
- 各root手のguard-free遷移は自然終局し、子はすべて非終局。反復・管理停止・遷移不一致なら代表なし。
- 各子の応手数は1〜8、かつ全子の応手数の合計は16以下。
- 子の応手集合に「捕獲手のみ」と「takata手のみ」がそれぞれ最低1つずつある。
- runtime/ring二実装で全root合法手と全child legal move key集合が一致する。

構造判定器は合法性・幅・応手種別と自然終局の真偽だけを参照する。絶対勝者名、retrograde値、DTF、探索順位、AI選択を候補生成・選定へ渡さない。種別差は価値差の証明ではない。

一つのtrajectoryで最初の適格rootが既読・重複なら、そのsourceを候補なしで閉じ、後続や前のrootへ置き換えない。候補のscreen子や後続閉包に既読RAWがあっても候補を除外する。標準初期局面などsource経路の共有だけでtrajectory全体を除外しない。128 sourceを全て処理後、source順で最初の最大8候補を固定し、その後に閉包を始める。8件未満でもsource追加・root補充をしない。

この128source・8候補は固定有限開発コーパスの資源上限であり、IID標本数や検出力を主張する数ではない。seedの連番、xorshift、異なるroot、非共有closureから確率的独立性を推論しない。

新しいsourceのroot、rootの全子、各子の全screen応手、閉包中に到達する全RAWは、BFS統合で確定した103355件の保守的既読RAW識別集合と照合する。いずれかが遮断集合に含まれれば、そのsourceは候補なしで閉じるか、候補閉包を`READ-FIREWALL-HIT`で不完全終了し、別root・別seed・別候補へ置換しない。sourceの途中経路が既読であることだけでは除外しない。Bao RAWと抽象fixture識別は別namespaceのまま保ち、抽象fixtureをsource・候補・到達性証拠に使わない。

## 全閉包・未知・独立検算

候補ごとに全合法手BFSを最後まで閉じる。全root手・全内部合法辺・全子RAWをguard-free object/ring二実装で照合する。complete graphだけを独立retrograde解法二つへ渡す。未閉包・未解決・反復を勝敗値0、DRAW、負けへ代入しない。途中結果は`solution: null`と停止分類を保持する。時間、状態、辺、RSS、microstate、journal/総bytes上限停止も候補の差替え理由にしない。

独立source verifierは全trajectory・PRNG列・全適格screen・最初の代表・それ以前/以後の順序・候補固定順・既読除外を独自再生する。edge verifierは全保存辺・各辺metadata・microstate要約・stop witnessを独立遷移で照合する。共有RAWの推移的成分を両実装で集約する。集団非共有だけではIIDを主張しない。

## 事前停止・保存案

1 rootあたり10,000 distinct RAW状態、128,000辺、180秒、1手8192 microstateを固定する。全source・候補runは20分、RSS 1 GiB、展開後evidence+重複除去state journal 256 MiB。16 MiBを終了・検算・書出し用に予約し、先に予約域へ達したら`EVIDENCE-RESERVE-LIMIT`として安全停止する。gzip後bundleも最大256 MiB、単一blobが48 MiBを超えないよう最大6片へ分ける。上限に達した区画は保存済みcheckpointと停止witnessを残す不完全終了とし、完全解析へ読み替えない。値を見てcapを変更しない。

source trajectoryは32 plyごと、BFSは128 edgeごとと各領域終了時にcheckpointする。各seedの読取journalをsource生成前にfsyncし、state/move/edgeの記録はhash連鎖でfsyncする。現在のsource/domain、全停止witness、未展開frontier、別個の旧/新RAW既読区分、解と検算をartifact・研究ブランチに保存する。結果を消すretryやattempt 2以降は行わない。

ここに示す資源は候補の停止上限であり、成功予測ではない。10,000状態へcapを引き上げても完全閉包を得る根拠はない。小さな抽象fixtureのRSSを現実のBaoへ外挿しない。保存監視を実装・再生し、pressure-stopで一貫したjournal/snapshotを検査するfixtureを新sourceの読み取り前にCIへ追加する。

## 実行・終了条件

正式契約にはここから導いた最終JSON・人間向け契約・全入力hash・candidate selector・二独立verifier・永続全区画lease・読み取り前consume journal・別push trigger・attempt 1固定・常時保存・終了後mirrorを含める。fixture CIとソースfreezeの後、Actionsの新triggerを作り、seedを読む前にlease作成が永続確認できた場合だけ進む。lease不在/不一致・CI失敗・原資産差分はsource開始前にfail closedする。

128source・最大8候補を全処理して保存・検算が終われば、完全閉包0件でも固定開発Studyを終了する。区画切れ、技術不一致、漏れたjournal、全体上限停止では`INCOMPLETE-NOT-INTERPRETABLE`で区画を閉じる。新source追加、root差し替え、旧candidate延長、上限引上げ・retryはしない。新規完全領域が得られた場合も、この開発コーパスを正式holdoutへ昇格させない。

このproposalは実行契約・ユーザー認可artifact・lease・source freeze・triggerではない。science seed消費は0件で、次工程はsource実装・fixture preflight・契約レビューである。提案値を正式登録へ移す前にseed/namespaceを再照合し、最終契約・fixture CI・独立検算・source freezeを別々のhashで固定する。新規runのleaseを作る前に、固定契約と初回区画の実行可否を独立して確認する。
