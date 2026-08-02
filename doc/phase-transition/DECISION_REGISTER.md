# 局面相転移点研究 — 判断台帳

更新日: 2026-08-02

## 状態

- `提案`: 未検証
- `暫定採用`: 現在の分析で使用するが、確認的検証前
- `採用`: 以後の研究設計に固定
- `撤回`: 根拠により使用を中止
- `保留`: 判断材料不足

## 判断一覧

| ID | 判断 | 状態 | 根拠・備考 |
|---|---|---|---|
| D-001 | `gameId + ply` を観測の一意キーとする | 採用 | Phase 0再現性要件 |
| D-002 | `observations.jsonl` を一次正本とする | 採用 | 派生表は再生成可能 |
| D-003 | ランダム開局観測を候補検出から除外する | 採用 | 人工的変動を除く |
| D-004 | 最終観測を候補検出から除外する | 採用 | 終局直前縮退を分離 |
| D-005 | 隣接候補plyを区間へ統合する | 採用 | 重複計数を防ぐ |
| D-006 | forcing距離と構造イベント距離を分ける | 採用 | 循環説明を避ける |
| D-007 | forcingを独立特徴群として候補成立に使う | 撤回 | 95区間から45区間へ減少 |
| D-008 | forcingは補助情報として保持する | 暫定採用 | 非forcing特徴を要求 |
| D-009 | 主閾値 `signal=2.0 / persistence=0.75` | 暫定採用 | 探索候補検出設定 |
| D-010 | strict閾値 `2.5 / 1.0` | 暫定採用 | 監査用 |
| D-012 | 区間対応は同一gameIdかつ区間重複 | 採用 | A/B/C/X分類 |
| D-015 | Aをforcing切替非同時候補と呼ぶ | 採用 | forcing状態からの独立ではない |
| D-016 | `pliesRemaining < 5` を終局近傍として分離 | 暫定採用 | 終局効果の可能性 |
| D-017 | stateHashと変化シグネチャを分ける | 採用 | 局面と変化型を区別 |
| D-018 | 同一変化シグネチャをアーキタイプ化 | 暫定採用 | A 13アーキタイプ |
| D-019 | 主要候補を正式な戦略的相転移と認定 | 保留 | E-010はnot-confirmed、E-011はinconclusive、E-017はnot-confirmed |
| D-021 | 主要4件を全て捕獲分岐爆発とする | 撤回 | 一時的スパイクを確認 |
| D-022 | 分析単位を強制捕獲レジームとする | 採用 | 系列内部構造を表現 |
| D-023 | Colab結果だけで正式結論を出さない | 採用 | 固定環境再現が必要 |
| D-024 | 全Aアーキタイプは強制捕獲レジーム所属 | 採用 | 13件すべて所属 |
| D-027 | レジーム分類閾値を正式固定する | 保留 | E-010のみでは正式固定しない |
| D-028 | 既存mtaji局面をmtaji前兆と数える | 撤回 | 時間順序に反する |
| D-029 | mtaji前兆はnamua候補から将来の初回mtajiまでで定義 | 採用 | 修正版 |
| D-030 | 全A分類を expansion 3 / mtaji 3 / release 6 / spike 1 とする | 暫定採用 | run 30615605472 |
| D-031 | 終局近傍mtaji候補6件をforcing解除前兆とする | 撤回 | 独立分類ではなく終局近傍効果 |
| D-032 | 対照群は候補区間前後8plyを除いた強制捕獲中の適格plyとする | 暫定採用 | 探索4127点、確認8557点 |
| D-033 | 捕獲分岐急拡大をA候補の主要識別分類とする | 暫定採用 | 探索11.46倍、E-010 21.53倍、E-011 phase2群で方向的一貫性、E-017 dedup RR 13.74 |
| D-034 | mtaji前兆をA候補固有の識別分類とみなす | 保留 | 探索群で差が小さい |
| D-035 | forcing解除前兆の濃縮を戦略転移の証拠とする | 撤回 | 終局近傍に限定 |
| D-036 | `expansionDelta=3 / persistenceFraction=0.5` をE-010確認値とする | 採用 | 事前登録後に変更せず実行 |
| D-037 | forcing解除前兆6件を終局近傍サブタイプとして扱う | 暫定採用 | 全件が終局まで0–4ply |
| D-038 | 主たる相転移候補の比較では終局まで9ply以上を別集計する | 採用 | E-010/E-011/E-017/E-018主解析に使用 |
| D-039 | 捕獲分岐急拡大を当該手の即時大量捕獲と解釈する | 撤回 | 即時捕獲量は小さい |
| D-040 | 捕獲分岐急拡大は選択手後に形成される捕獲選択肢構造の拡大として扱う | 暫定採用 | E-009/E-014 |
| D-041 | 1-ply静的評価差を探索判断の正式評価差とみなす | 撤回 | depth 2探索とは異なる |
| D-042 | 分岐形成時系列の盤面指標を候補時点の固定プレイヤーで測る | 撤回 | 奇数plyで主体がずれる |
| D-043 | 分岐形成時系列は各plyの手番側／相手側基準で測る | 採用 | 指標主体を一致 |
| D-044 | 捕獲分岐急拡大の形成はphase移行で説明される | 撤回 | 5区間すべてphase変化なし |
| D-045 | 急拡大形成の補助指標として手番側最大捕獲可能量の増加を追跡する | 暫定採用 | E-014 |
| D-046 | E-010の成功条件を結果後に11候補へ緩和する | 撤回 | 事前登録の最低12候補を維持 |
| D-047 | E-010の正式判定をconfirmedとする | 撤回 | 主解析候補11件で最低12件に未達 |
| D-048 | E-010をnot-confirmedだが効果方向の強い再現として記録する | 採用 | 候補63.6%、対照3.0%、RR 21.53 |
| D-049 | 同一確認データで成功条件を再最適化しない | 採用 | 確認分析の独立性を維持 |
| D-050 | E-011は評価器、探索実装、maxDepthを一要因ずつ変更する5条件設計とする | 採用 | C0–C4を事前登録 |
| D-051 | E-011は新規seed範囲を用い、同一400 seedを条件間で共有する | 採用 | 探索・E-010から独立し、開局構成差を抑制 |
| D-052 | E-011は各条件400局とする | 採用 | E-010の11/200を用いると12候補以上の確率はPoisson近似で約99.24% |
| D-053 | E-011でもE-010の候補検出、終局除外、急拡大分類閾値を変更しない | 採用 | 条件変更の影響だけを測る |
| D-054 | E-011の条件別・全体判定規則を実行前に固定する | 採用 | robust / partially-robust / not-robust / inconclusive |
| D-055 | E-011正式2000局は固定ローカル環境で逐次実行する | 採用 | GitHub Actionsはテスト・fixture・成果物検証に限定 |
| D-056 | E-011の開局一致は最後のランダム開局手直後のhashで監査する | 採用 | paired openingを条件間で固定 |
| D-057 | E-010の候補独立性を`trajectoryHash + candidatePly`で事後監査する | 採用 | 11候補が5 trajectory-plyへ集約 |
| D-058 | E-010の事前登録判定をtrajectory重複感度で置き換える | 撤回 | 事後分析であり、元のnot-confirmedを維持 |
| D-059 | E-011でtrajectory重複感度を必須副次分析として事前追加する | 採用 | 主判定条件は変更せず、構造的一般性を監査 |
| D-060 | E-010の生のRR 21.53を独立構造例の再現率と解釈する | 撤回 | 急拡大7件中6件が同一trajectory-ply |
| D-061 | 確認群でも最大捕獲可能量非対称化の方向が再現したと記録する | 暫定採用 | 生の7件で手番側+2.57／相手側-0.86、重複除去後+1.5／-0.5 |
| D-062 | 確認群7件を7つの独立した形成例として扱う | 撤回 | 6件が同一trajectory-ply、独立構造は2件 |
| D-063 | H14を確認済み仮説へ昇格する | 保留 | 2構造中、明確な非対称化は1構造のみ |
| D-064 | E-011正式実行はrepository許可フラグと完全一致トークンの二重承認を要求する | 採用 | 2026-08-01 06:09 JSTに明示承認。専用commit `a0378010607aebad76420e0d377ee1b88166d861`で許可フラグを有効化 |
| D-065 | E-011固定環境の既知条件をrepository pathとNode.js v24.6.0として固定する | 採用 | execution lockでsource commit、CPU、memory、OS releaseも記録 |
| D-066 | E-011正式corpusとexecution lockをgit管理外の固定出力先へ保存する | 採用 | partial出力でclean-worktreeガードが自己停止しないようにする |
| D-067 | E-011の各formal phaseで事前登録とexecution policyのパス・SHA-256をexecution lockと再照合する | 採用 | 代替設定ファイルやlock後の条件差し替えを拒否 |
| D-068 | E-011全体判定はformal integrity監査成功後にだけ実行する | 採用 | 5条件のsource、seed、開局、condition分離未確認のまま評価しない |
| D-069 | 独立追加seed確認実験E-017を1000局、seed `20263001–20264000`とする | 採用 | E-010構造発生率では1000局のavailability 4条件単純積が約93.8%、固有control期待35305 |
| D-070 | E-017の主解析単位を`trajectoryHash + eventPly`とする | 採用 | 同一決定論的trajectory・同一候補plyの反復を一次効果量から除外 |
| D-071 | E-017で最低15固有candidate trajectory-ply、12固有candidate trajectory、5固有expansion trajectoryを要求する | 採用 | 行数だけでなく構造的一般性を成功条件へ含める |
| D-072 | E-017の主効果条件を重複除去後RR 3以上かつ候補率>対照率とする | 採用 | 生の候補行endpointは副次報告に限定 |
| D-073 | E-017正式1000局の開始にはE-011とは別の明示的承認を要求する | 採用 | 2026-08-01 22:47 JSTにE-017固有の開始承認を受領し、固定ローカルで正式実行完了 |
| D-074 | E-017正式実行もrepository許可フラグと完全一致トークンの二重承認を要求する | 採用 | 専用commit `f0f9e90be0d77dac395e9ec53d951a011ad1f1fd`で`formalExecutionAllowed=true`。formal runnerはexecution lockを使用して完了 |
| D-075 | E-017 execution lockへsource、runtime、hardware、事前登録・policy hash、固定corpus条件を記録する | 採用 | formal verifyでsourceCommitMatchesLock、lock preregistration/policy hash presenceを確認 |
| D-076 | E-017全体判定はformal corpus integrity成功後にだけ実行する | 採用 | 1000局・56294 observations、formal `valid: true` 後にのみ評価した |
| D-077 | E-017のcandidate/control欠損・trajectory結合失敗・必要出力構築失敗は`inconclusive`成果物として残す | 採用 | 効果不通過の`not-confirmed`と区別 |
| D-078 | E-017正式corpusとexecution lockをgit管理外の固定出力先へ保存する | 採用 | partial再開時にclean-worktreeガードが自己停止しないようignore状態をlock生成時に検証 |
| D-079 | E-011の明示的開始承認後も、固定ローカルexecution lock生成前にはC0を開始しない | 採用 | 別環境へ置換せず、承認済み・local lock待ちとして停止した |
| D-080 | E-011開始承認を事前登録条件・分析条件・判定条件の変更として扱わない | 採用 | 変更はexecution policyの状態と許可フラグのみ。5条件、局数、seed、順序、閾値を維持 |
| D-081 | E-011正式2000局の全体判定を`inconclusive`として固定する | 採用 | formal integrity `valid: true`、C0/C3 pass、C1/C2/C4 insufficient。事前登録済みglobal ruleを変更せず適用 |
| D-082 | E-011を結果後に`partially-robust`または`not-robust`へ読み替えない | 採用 | C1/C2/C4の最低件数不足を含む登録statusとglobal decision contractを維持 |
| D-083 | C4の急拡大0件を「legacy search依存性の確定証明」とはせず、別事前登録実験の対象仮説とする | 採用 | C4は主解析A候補8件・expansion 0件で`insufficient`。探索方式依存性を示唆するが単条件で因果確定しない |
| D-084 | E-011 evaluatorの`inconclusive`時exit code 2を科学結果の失敗と扱わない | 採用 | 結果ファイル生成・完全出力後の終了コードをformal runnerが例外表示したinterface問題。正式判定は`inconclusive`のまま |
| D-085 | E-017開始承認を事前登録条件・分析条件・判定条件の変更として扱わない | 採用 | 変更はexecution policyの状態と許可フラグのみ。1000局、seed、AI条件、構造availability、RR基準を維持 |
| D-086 | E-017正式1000局の判定を`not-confirmed`として固定する | 採用 | formal integrity `valid: true`。8 endpoint criteria中、固有control trajectory-plyのみ30000未満（23306） |
| D-087 | E-017の最低固有control trajectory-plyを結果後に23306以下へ緩和しない | 採用 | 事前登録30000を維持し、dedup RR 13.74等を理由にconfirmedへ読み替えない |
| D-088 | E-017を「正式未確認だが構造的一般性を伴う濃縮方向の追加観測」と記録する | 採用 | unique candidate 21、unique expansion trajectory-ply 9、unique expansion trajectory 9、dedup RR 13.74 |
| D-089 | E-017 evaluatorの`preregistrationStatus: preregistered-not-run`をformal execution状態の正本と扱わない | 採用 | config由来の状態文字列であり、execution lockとformal integrity `mode=formal / valid=true`が実行状態を確定する |
| D-090 | H16直接比較をE-018として各profile 2000局、shared seed `20265001–20267000`で事前登録する | 採用 | P2=`bao/phase2/depth2`、LG=`bao/legacy/depth2`、計4000局 |
| D-091 | E-018主解析単位をpaired shared-seed gameとし、eligible expansion候補の有無をexact McNemarで比較する | 採用 | same seed/openingでsearch profile差を直接検定。two-sided alpha 0.05、discordant pair最低20、P2-only > LG-only |
| D-092 | E-018ではlegacy側expansion最低件数を成功条件に置かない | 採用 | legacyで0件/低件数はH16整合観測となり得るため、最低expansion数要求で自動insufficient化しない |
| D-093 | E-018 formal 4000局は別の明示的ユーザー承認まで開始しない | 採用 | 2026-08-02 08:39 JSTにE-018固有の開始承認を受領。E-017開始承認は継承していない |
| D-094 | E-018開始承認を事前登録条件・分析条件・判定条件の変更として扱わない | 採用 | 変更はexecution policyの状態と許可フラグのみ。局数、seed、search profile、primary unit、McNemar、alpha、direction、minimum discordant pairsを維持 |
| D-095 | E-018 formal実行はrepository許可フラグ、完全一致トークン、fixed-local execution lockをすべて要求する | 採用 | 専用authorization commit `9c5a902f3fbe0df02975050f2648a2a08cefb109`で`formalExecutionAllowed=true`。GitHub Actions formal runは禁止のまま |
| D-096 | E-018 execution lockの固定sourceを`1f6b129b9b3cb11580244b1d4c337c067289cfdb`とし、固定local runtimeで実行する | 採用 | Node v24.6.0、Python 3.12.3、numpy 2.5.1、pandas 3.0.5、preregistration/policy hashをlockへ固定 |
| D-097 | E-018 formal runの中断後は同一lock・source・configでatomic-write済みgameを検証再利用して再開できる | 採用 | 進捗表示確認のためP2 60局時点で一度中断。source/seed/config/lockを変更せずresumeし4000局完了 |
| D-098 | E-018正式4000局の判定を`confirmed`として固定する | 採用 | formal integrity `valid:true`、discordant 72、n10=63、n01=9、exact McNemar p=4.1812279092751445e-11、方向条件通過 |
| D-099 | E-018 structural secondaryのFisher p=0.418をprimary判定の反証として扱わない | 採用 | trajectory-ply比較は事前登録上secondary。paired game-level exact McNemar primaryを置き換えない |
| D-100 | H16のformal confirmation範囲を`hard / bao / depth 2`での`phase2`対`legacy`に限定する | 採用 | 全evaluator、全depth、将来の別search implementationへ自動一般化しない |
| D-101 | formal experimentの最終export保管をrepository外の`/home/oruorane/bao-eNNN-exports/`へ統一し、archiveとbasename形式の`.sha256`を対で保存する | 採用 | `doc/phase-transition/FORMAL_EXPORT_STORAGE.md`。移動後も`sha256sum -c`で検証できるようchecksum内に移動前の絶対パスを残さない |
| D-102 | E-018最終formal bundleの保管先を`/home/oruorane/bao-e018-exports/`として固定し、archive SHA-256を`bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`とする | 採用 | E-011既存保管先`/home/oruorane/bao-e011-exports/`と同じ規則へ統一。保管台帳`FORMAL_EXPORT_INDEX.md`とE-018 final bundle auditに記録 |

## 今後固定が必要な判断

- 強制捕獲レジーム最低長
- 最大捕獲可能量の非対称化を副次確認項目から主確認項目へ昇格するか
