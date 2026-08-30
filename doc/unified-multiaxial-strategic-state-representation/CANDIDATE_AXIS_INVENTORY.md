# UMSSR-STUDY1 — 候補axis inventory

## 1. 原則

このinventoryはG2-10 outcomeを見る前の候補一覧である。ここに掲載されたことは採用・validationを意味しない。Stage 0でtechnical eligibilityを確認し、Stage 1 scientific seed消費前のmachine-readable specで実際に使用するcandidate familyを固定する。

## 2. 候補axis family

| ID | 候補axis family | 初期資格 | 取扱い |
| --- | --- | --- | --- |
| `UMSSR-A01` | phase / rule-semantic state | `FORMALLY-ELIGIBLE` technical boundary | `phase`, `player`, reserve / house / pending等をRAW semanticsに従い使用 |
| `UMSSR-A02` | RAW material / occupancy structure | `DEVELOPMENT-CANDIDATE-ONLY` | pits、reserve、houseOwnedからoutcome-blind structural observablesを新規定義 |
| `UMSSR-A03` | legal-move / branching structure | `DEVELOPMENT-CANDIDATE-ONLY` | legal move count、capture availability等をfreshに再計算 |
| `UMSSR-A04` | search-condition agreement / ranking stability | `DEVELOPMENT-CANDIDATE-ONLY` | G2-02 secondary profileをコピーせず、fresh state上のraw agreement observablesとして新規定義 |
| `UMSSR-A05` | evaluation / top-set stability | `DEVELOPMENT-CANDIDATE-ONLY` | calibration probabilityとは分離し、fixed search/evaluator semantics下のraw observableとして扱う |
| `UMSSR-A06` | bounded local graph / state-space structure | `DEVELOPMENT-CANDIDATE-ONLY` | G2-05 exact resultを外挿せず、G2-10 fresh roots上でprospectively boundedな局所graphを再構築する場合だけ使用 |
| `UMSSR-A07` | tactical structure | 条件付き`FORMALLY-ELIGIBLE` + `DEVELOPMENT-CANDIDATE-ONLY` | `TM-S2-C03`は元scopeのみ。その他のtactical raw featuresはfresh candidateとして扱う |
| `UMSSR-A08` | morphology | 条件付き | historical `MTAJI-M1/MTAJI-M2`はexact executable reconstruction成功時のみ元scopeで使用。失敗時はfresh candidateへ分離 |
| `UMSSR-A09` | reply-set / reply-pressure raw structure | `DEVELOPMENT-CANDIDATE-ONLY` | G2-07 model / family selectionを再利用せず、reply count、defense-maintaining fraction等を新規定義可能 |
| `UMSSR-A10` | machine decision-failure raw observables | `DEVELOPMENT-CANDIDATE-ONLY` | G2-08 taxonomy labelを使わず、reference disagreement、rank reversal等のraw observablesとして再定義可能 |
| `UMSSR-A11` | exact bounded upstream control | `BOUNDED-EXACT-ELIGIBLE` | G2-05 depth-9 standard-root domainをtechnical / calibration controlとしてのみ使用可能 |

## 3. 初期除外

Stage 1 candidate setへ自動的に含めないもの:

- G2-01のoutcome-calibration mapping
- G2-06の`RICH_ALL` classifier / operating threshold
- G2-07の`F05_ALL` / `lambda=100` model
- G2-08のpromoted leaf setをそのままtaxonomyとして使うこと
- G2-09のgeneralization / counterexample label
- symmetry-reduced / canonical state key
- human difficulty、deception、error probability、expert judgmentを示すproxy label
- long-horizon transition / persistence / recurrence指標

## 4. feature constructionの原則

- RAW identityを保持する。
- outcome、winner、future trajectory eventをroot selectionやcandidate constructionへ使用しない。ただしterminal stateを除外するためのrule-semantic判定など、protocolで明示したtechnical eligibilityには使用できる。
- 浮動小数featuresは、G2-06で発生したaccumulation-order mismatchを踏まえ、deterministic accumulation order、quantization、serializationをStage 0で固定する。
- productionとindependent implementationが同じfeature helperを共有しない構成を優先する。
- scientific seedを用いる前に、各feature familyのmissing / undefined semanticsを固定する。

## 5. scalar圧縮の扱い

G2-10のprimary representationはvector / regime representationである。単一composite scoreは既定では作らない。

Stage 1でdimensionality reductionやlatent scoreが必要になった場合でも、それは候補methodとして扱い、Stage 1のfrozen promotion ruleを満たさない限りStage 2へ持ち込まない。
