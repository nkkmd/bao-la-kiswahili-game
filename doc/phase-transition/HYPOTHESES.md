# 局面相転移点研究 — 仮説台帳

更新日: 2026-08-02

## H1 — 戦略的転移は形式的phase移行より前に現れる

状態: 部分的支持・未認定

mtaji前兆は探索群で候補20.0%、対照16.8%で識別力が弱い。

## H2 — reserve閾値が戦略転換を誘発する

状態: 未検証

## H3 — nyumba消失効果は複数特徴の組合せに依存する

状態: 未検証

## H4 — 強制系列と自由選択系列の境界には再現可能な転移がある

状態: 支持弱化・定義修正中

forcing解除前兆は終局近傍効果として再解釈した。

## H5 — 評価値単独では転移を安定識別できない

状態: 探索的支持

1-ply静的評価だけでは候補の構造的意味を説明できない。

## H6 — 一対局には複数の相転移がある

状態: 探索的支持

探索群で95候補区間、66ゲームに候補。

## H7 — 主要転移は複数探索条件で近接して検出される

状態: 正式E-011は`inconclusive`・phase2 family内で方向的一貫性・global robustness未確認

E-011として次の5条件を固定し、各400局、合計2000局を固定ローカル環境で正式実行した。

- C0: `bao / phase2 / depth 2`
- C1: `bao / phase2 / depth 1`
- C2: `bao / phase2 / depth 3`
- C3: `bao-v2 / phase2 / depth 2`
- C4: `bao / legacy / depth 2`

shared seedは`20262001–20262400`。全条件でpaired opening hashが一致し、formal integrityは`valid: true`だった。

主解析結果:

| 条件 | A候補 | expansion | 対照 | RR | status |
|---|---:|---:|---:|---:|---|
| C0 | 16 | 9 | 16395 | 19.09 | `pass` |
| C1 | 15 | 2 | 15679 | 6.49 | `insufficient` |
| C2 | 12 | 3 | 15801 | 14.26 | `insufficient` |
| C3 | 19 | 11 | 16437 | 20.08 | `pass` |
| C4 | 8 | 0 | 15412 | 0.00 | `insufficient` |

formal global decisionは**`inconclusive`**。C1/C2はRRと方向条件を満たすが最低expansion件数に未達。C4は候補8件・expansion 0件で最低件数不足のため、事前登録ロジック上`fail`ではなく`insufficient`。

`trajectoryHash + candidatePly`重複除去後RRはC0 7.87、C1 7.31、C2 10.98、C3 11.70、C4 0.00。したがって、phase2を使う4条件では方向的一貫性が見えるが、AI/search条件全般へのglobal robustnessは確認されていない。

## H8 — 局面特徴による分類は手数分類より安定する

状態: 探索的支持・重複構造に注意

探索群A 15候補は13アーキタイプ、確認群A 22候補は15アーキタイプへ整理された。ただしE-010主解析11候補は5アーキタイプ、4trajectory、5 trajectory-plyへ集約された。E-011でも条件ごとにtrajectory-ply重複が残り、E-017でも最大trajectory-ply multiplicityは24だったため、生の候補行数と構造的一般性を分けて扱う。

## H9 — 強制捕獲レジーム内部に捕獲分岐の相転換が存在する

状態: **濃縮方向と構造的一般性は複数独立データで支持・formal confirmation未達・正式認定保留**

探索群:

- 候補5/15（33.3%）
- 対照120/4127（2.9%）
- リスク比約11.46

E-010未使用seed確認群の事前登録単位:

- 候補7/11（63.6%）
- 対照249/8424（3.0%）
- リスク比21.53
- formal `not-confirmed`（最低主解析候補12に対し11）

E-010 trajectory-ply重複除去後:

- 候補2/5（40.0%）
- 対照218/7061（3.09%）
- リスク比12.96

E-011ではC0とC3が正式`pass`、C1/C2は最低expansion件数不足だがRR 6.49/14.26、trajectory-ply重複除去後もRR 7.31/10.98だった。C4 (`legacy`)では生・重複除去後ともexpansion候補0。formal global decisionは`inconclusive`。

E-017独立seed 1000局ではformal integrity `valid: true`。主解析のtrajectory-ply重複除去後は:

- unique candidates: 21
- unique expansion trajectory-ply: 9
- unique expansion trajectories: 9
- unique controls: 23306
- candidate expansion rate: 42.86%
- control expansion rate: 3.12%
- deduplicated RR: 13.74

E-017では効果方向、RR、候補・expansion構造availabilityは通過したが、事前登録最低unique control trajectory-ply 30000に対し23306だったためformal **`not-confirmed`**。

したがって捕獲分岐急拡大の濃縮方向は複数の独立seed・複数phase2条件・複数固有構造で繰り返し観測されている。一方、E-010/E-017は`not-confirmed`、E-011は`inconclusive`であり、事前登録済み確認実験としての正式認定にはまだ達していない。

## H10 — 捕獲分岐爆発の一部はmtaji移行の前兆である

状態: 支持弱化・未認定

探索群では候補20.0%、対照16.8%。

## H11 — 相転移候補検出器は一時的スパイクを除外する

状態: 探索的支持

探索群で一時的スパイクは候補6.7%、対照54.0%。

## H12 — forcing解除前兆は終局近傍現象である

状態: 強い探索的支持

探索群のforcing解除前兆6件はすべて終局まで0–4ply。

## H13 — 捕獲分岐急拡大は即時戦果ではなく将来の選択肢形成である

状態: 探索群・確認群で方向一致、独立構造は限定・未認定

探索群の急拡大5件は平均捕獲1.6粒、平均capture+relay長2.2。捕獲手数ピークは平均1.8ply後で、phase移行なし。

E-010確認群の急拡大7件では捕獲手数ピークが平均1.71ply後、trajectory-ply重複除去後の2構造では平均1.0ply後だった。全7件・全2構造でピーク時の手番は候補時点のプレイヤーと一致し、phase変化はなかった。

候補直後に捕獲選択肢構造が形成されるという時間順序は確認群でも一致した。ただし7件中6件が同一trajectory-plyであり、独立した形成例は2構造に限られる。

## H14 — 捕獲分岐形成には最大捕獲可能量の非対称化が伴う

状態: 確認群でも方向一致・限定的再現・未認定

探索群では候補からピークまで手番側最大捕獲可能量が平均+3.0粒、相手側が平均-1.2粒。

E-010確認群の生の7件平均では手番側+2.57粒、相手側-0.86粒だった。`trajectoryHash + candidatePly`重複除去後の2構造平均でも手番側+1.5粒、相手側-0.5粒となり、平均方向は維持された。

ただし最大重複群6件は同一構造で`+3 / -1`を示し、もう1つの独立構造は`0 / 0`だった。したがって確認群で方向一致は観測されたが、2つの独立構造すべてに共通する現象とはまだ言えない。

## H15 — 捕獲分岐急拡大は未使用seedでも候補群に濃縮する

状態: **効果方向は複数未使用seed blockで支持・formal confirmationは未達**

E-010の生の単位では候補急拡大率63.6%、対照3.0%、リスク比21.53。効果方向、最低急拡大件数、対照数、最低リスク比は通過したが、主解析候補数が11件で最低12件に1件届かずformal `not-confirmed`。

trajectory-ply重複除去後も候補40.0%、対照3.09%、リスク比12.96で濃縮は残ったが、急拡大は2つの固有trajectory-plyのみだった。

E-017はさらに独立したseed `20263001–20264000` を使用し、trajectory-ply重複除去後候補42.86%、対照3.12%、RR 13.74、9固有expansion trajectoryを観測した。効果基準と候補構造availabilityは通過したが、unique control trajectory-ply 23306が最低30000に届かずformal `not-confirmed`。

したがって「未使用seedでも濃縮方向が再観測される」はE-010とE-017の2独立blockで支持されるが、事前登録上の確認成功とは記録しない。

## H16 — 捕獲分岐急拡大の顕在化はsearch profileに依存する

状態: **E-018 formal `confirmed`**

E-011ではphase2を使用したC0–C3の全条件で候補側濃縮方向が維持され、trajectory-ply重複除去後RRも7.31–11.70だった。一方、`bao / legacy / depth2`のC4では主解析A候補8件、expansion 0件、RR 0.00で、重複除去後もexpansion 0件だった。ただしC4は`insufficient`だったため、E-011をsearch profile依存性の確認成功へ読み替えなかった。

E-017はphase2のみの独立確認で、H16の直接検定としては扱わない。E-017 formal decision `not-confirmed`も変更しない。

### E-018直接比較

E-018は次をdata generation前に固定した。

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 各2000局、合計4000局
- shared seed: `20265001–20267000`
- same seed / same random-opening boundaryをpaired
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- endpoint: eligible category-A `capture-branch-expansion`候補がゲーム内に1件以上あるか
- primary test: two-sided exact McNemar
- minimum discordant pairs: 20
- alpha: 0.05
- direction: P2-only > LG-only

formal integrityは`mode=formal / valid=true`。2000 paired gamesで:

- `n00`: 1928
- `n01` LG-only: 9
- `n10` P2-only: 63
- `n11`: 0
- discordant pairs: 72
- P2 event-game rate: 3.15%
- LG event-game rate: 0.45%
- paired risk difference: +2.70 percentage points
- discordant odds ratio: 7.0
- two-sided exact McNemar p: `4.1812279092751445e-11`

exact pair count、minimum discordant pairs、alpha、方向条件をすべて通過したため、事前登録decision contractに従いE-018は**`confirmed`**。

したがってH16は、固定 `hard / bao / depth 2` 条件における`phase2`対`legacy`、paired same-opening designの範囲で正式確認された。

structural secondaryではcandidate trajectory-ply expansion率がP2 11/34 (32.35%)、LG 7/31 (22.58%)、Fisher exact p=0.418だった。これは副次解析であり、事前登録primary McNemar判定を置き換えない。

### 解釈境界

H16の`confirmed`を次へ自動一般化しない。

- 全evaluation profile
- 全search depth
- 将来の別search implementation
- trajectory-ply副次比較自体の有意差
- E-011のglobal robustness判定

E-011 formal `inconclusive`、E-017 formal `not-confirmed`はそのまま維持する。

## 次の検証

- E-018 `confirmed`を固定し、primary endpoint、McNemar rule、解釈境界を結果後に変更しない。
- E-011 `inconclusive`、E-017 `not-confirmed`、E-010 `not-confirmed`を維持する。
- H16をより広いevaluator/depth/search implementationへ一般化する場合は、E-018と分離した新規事前登録実験として設計する。
