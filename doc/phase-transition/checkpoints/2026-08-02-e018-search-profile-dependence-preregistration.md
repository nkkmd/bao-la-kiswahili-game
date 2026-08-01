# E-018 search profile依存性直接比較 — 事前登録チェックポイント

日付: 2026-08-02  
Experiment: `E-018`  
Hypothesis: `H16`  
analysisVersion: `16-search-profile-dependence`  
Status: **preregistered / formal not approved / not run**

## 目的

H16「捕獲分岐急拡大の顕在化はsearch profileに依存する」を、`phase2`と`legacy`を同一条件・同一seed・同一ランダム開局で直接比較して検証する。

E-011では`phase2`条件C0–C3に候補側濃縮が見られ、`legacy` C4ではexpansion候補0だったが、C4は候補availability不足で`insufficient`だった。E-017では`phase2`の独立seed 1000局でもtrajectory-ply重複除去後RR 13.74、9固有expansion trajectory-plyを観測したが、固有control trajectory-plyが事前登録最低30000に達せずformal `not-confirmed`だった。

E-018はこれら既存結果を再判定せず、新規seedでsearch profile差そのものを主解析する。

## 条件

各search profile 2000局、合計4000局。

- shared seed: `20265001–20267000`
- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- maxPly: 180
- openingPlies: 6
- primary population: `pliesRemaining >= 9`

各game indexでseedとランダム開局境界stateをP2/LG間で一致させる。

既存探索群、E-010、E-011、E-017のseedとは重複しない。

## 候補・分類条件

既存の固定条件を維持する。

- category `A`
- `signalThreshold=2.0`
- `persistenceThreshold=0.75`
- opening除外
- final observation除外
- adjacent candidate ply統合
- `expansionDelta=3`
- `persistenceFraction=0.5`
- `eventWindow=8`
- `controlExclusionBuffer=8`

## 主解析単位

**paired shared-seed game** を一次単位とする。

各conditionについて、1ゲーム内に`pliesRemaining >= 9`のeligible category-A candidateで `capture-branch-expansion` に分類されるものが1件以上あればendpoint=1、なければ0とする。

同一seed/game indexのP2とLGを1ペアとして比較する。

## 主解析

paired 2値endpointのdiscordant pairを次のように数える。

- `n10`: P2=1 / LG=0
- `n01`: P2=0 / LG=1

主検定は **two-sided exact McNemar test**。

事前登録criteria:

1. formal corpus integrityとpaired opening監査が成功
2. discordant pair `n10+n01 >= 20`
3. exact McNemar two-sided `p <= 0.05`
4. `n10 > n01`

全条件通過のみH16をE-018上で`confirmed`とする。

integrityと最低discordant数が通過した上で3または4が不通過なら`not-confirmed`。

corpus、hash、source、paired opening、seed pairing、候補event構築、必要出力、または最低discordant pair数が成立しない場合は`inconclusive`。

## なぜlegacy expansion最低件数を要求しないか

E-011 C4ではlegacyのexpansion候補が0だったが、E-011の条件別availability ruleでは最低expansion数未達のため`insufficient`となった。

H16では「legacyで顕在化しない」こと自体が仮説と整合し得るため、E-018でlegacy側に最低expansion件数を要求すると、仮説を支持する極端な0件観測を自動的に評価不能へ変換してしまう。

したがってE-018はprofile間のpaired game endpointを直接比較し、legacy expansion最低件数を成功条件に置かない。この設計判断はE-018データ生成前に固定する。

## 構造的副次解析

既存研究との接続のため、各conditionについて`trajectoryHash + eventPly`重複除去後も報告する。

- unique candidate trajectory-ply
- unique candidate trajectory
- unique expansion trajectory-ply
- unique expansion trajectory
- candidate / expansion archetype
- largest duplicate multiplicity
- candidate対control expansion rateとRR

さらにP2/LG間のunique candidate trajectory-plyのexpansion率を2×2表で比較し、two-sided Fisher exact p、risk ratio、risk differenceを副次報告する。

これらは主McNemar判定を置き換えない。

## サンプル数設計

2000 paired seedsを採用する。

既存データを計画値としてのみ使用した。

### legacy側

E-011 C4のtrajectory-ply重複除去後unique candidateは `6 / 400局`。

2000局への単純投影は30件。Poisson点推定で20件以上となる確率は約97.81%。

### phase2側

E-017のunique candidate trajectory-plyは `21 / 1000局`。

2000局への単純投影は42件。Poisson点推定で20件以上となる確率は約99.994%。

### control参考値

- E-017 phase2: 23306 unique control trajectory-ply / 1000局 → 2000局単純投影46612
- E-011 legacy C4: 11412 / 400局 → 2000局単純投影57060

これらは計画上の近似であり、正式なMcNemar検出力や統計的証拠として使用しない。E-018のprimary confirmationはpaired discordant gameに基づく。

## 独立性

E-018 seedは次と非重複。

- 探索群: `20260721–20260820`
- E-010: `20261001–20261200`
- E-011: `20262001–20262400`
- E-017: `20263001–20264000`

E-011/E-017は、H16の動機、主解析設計、2000局の計画にのみ使用した。

E-018 data generation開始後に、E-018結果を見て局数・threshold・primary unit・検定・alpha・direction rule・minimum discordant pairs・decision ruleを緩和しない。

## 登録ファイル

- `config/experiments/phase-transition-search-profile-dependence-v1.json`

## 実行制約

- formal corpus: 未生成
- GitHub Actions formal run: 禁止
- formal execution approval: **未承認**
- 正式4000局開始にはE-018固有の別の明示的ユーザー承認を要求する

E-017開始承認はE-018へ継承しない。

## 次工程

formal dataを生成せず、E-018用のpaired-condition runner、integrity validator、McNemar evaluator、fixtureテストを実装・検証する。
