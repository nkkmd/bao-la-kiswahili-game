# Research Generation 4 — 研究計画

作成日: 2026-09-05  
状態: **`PROSPECTIVE PROGRAM PLAN / SCIENTIFIC EXECUTION NOT AUTHORIZED`**  
対象: `Bao Fourth-Generation Research Program`  
Core agenda: `G4-01..G4-10`  
独立track: `G4-P01`、`G4-H01`

英語作業名:

**Bao Fourth-Generation Research Program — Local Game-Tree Geometry Meaning, Transportability, and Exact Consequences**

日本語作業名:

**Bao第四世代研究計画 — 局所ゲーム木幾何の意味、移送可能性、exact帰結のprospective検証**

本計画における`G4-01`〜`G4-10`、`G4-P01`、`G4-H01`はAgenda上の順序ラベルであり、正式Study IDではない。各Studyの正式題目、Study ID、Stage構成、Stage ID、source policy、population、seed block、endpoint、threshold、推定可能性の判定条件、resource ceiling、停止条件は、各Study開始時のauthorization review後、scientific outcome生成前に結果を見ることなく固定する。

この計画をリポジトリへ統合することは、個別Studyの科学実行、seedへのアクセス、計算実行、過去Studyの再実行、公開AIの変更を承認しない。

---

## 1. 第四世代研究の位置づけ

Research Generation 3は、bounded RAW local game-tree / reachable-graph geometryについて、再現可能な測定器と限定的な正式結果を残した。特に次が第四世代の出発点になる。

```text
LGTGMIV F1..F5 = FORMAL-ELIGIBLE-ALL / RAW-only / relative depth 5
G3-04 = FORMAL-COMPLETE / C1+C6 CONFIRMED
G3-07 = FORMAL-COMPLETE / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
CRCLGR-R1-EXACT-SQUASHED-L1 = FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION
G3-10 = FORMAL-COMPLETE / C1+C2+C3+C5 CONFIRMED / C4 NOT-CONFIRMED
G3-11 = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN / H1..H4 DEEPER-CONFIRMED
G3-12 = CLOSED / TECHNICAL-INVALID / formal generalization decisions NONE
```

一方、第三世代は局所幾何のwhole-Bao generalization、game-theoretic value、人間の難しさ、一般的な因果機構を確立していない。G3-12のtechnical-invalid closureにより、別populationへ主張を移すためのformal generalization / counterexample boundaryも未確定である。

したがって第四世代は、第三世代のclosed Studyを修理する世代ではない。第三世代で測定可能になった構造について、**どこまで移送できるか、exactに解ける限定domainで何を意味するか、時間・ルール・探索条件の下でどのような帰結を持つか**を、新しいprospective Study群として検証する。

## 2. 中心科学課題

第四世代の中心問いを次のように定める。

> Research Generation 3で測定可能になったbounded RAW local game-tree geometryは、freshなphase・root family・source policy・rule contextへどこまで移送可能か。また、完全解析可能な限定domainにおいて、局所幾何はgame-theoretic value、時間的持続、rule-semantic transition、search reliabilityとどのように関係するか。

ここでいう「意味」は、盤面の印象や人間の難しさではない。第四世代coreで扱う意味は、次のmachine-verifiable constructへ限定する。

- 別domainへのformal transportabilityと反例境界
- exact oracleが与える限定domain内のgame-theoretic value
- trajectory上の持続、消失、反転、回帰
- rule-semantic event前後の構造変化
- search configuration変更に対する出力安定性
- standard initial RAW rootからのbounded exact reachability topology

## 3. Research Generation 1〜3から引き継ぐ不変の境界

1. closed Studyのformal decision、threshold、population、endpoint、seed、representation、解釈境界を変更・救済しない。
2. G3-12をrepair、reopen、same-evidence replayとして扱わない。G3-12 Stage 2の未使用seedを第四世代へ流用しない。
3. authoritative scientific state identityは`pits,reserve,houseOwned,player,phase,winner,pending`から成るRAW identityとする。
4. validated transform setは`[]`である。独立した新規formal validationなしにsymmetryやcanonicalizationをdeduplicationへ使用しない。
5. G3-11 depth 10は`OPENED / CONSUMED EXACTLY ONCE`であり、同じ証拠の再実行を行わない。
6. depth 11は`NOT AUTHORIZED / NOT ACCESSED`から開始し、G4-10の個別authorization前に生成・readしない。
7. tree occurrence、RAW graph、search output、engine evaluation、empirical outcome、game-theoretic value、人間の判断を別constructとして保持する。
8. engine scoreをvalidated Bao win probabilityまたはgame-theoretic valueとして扱わない。
9. higher-resource searchを真値とみなさない。exact oracleを利用できるdomainだけでexact agreementを論じる。
10. narrow corridor、small branch width、stable rankingを、最善手の明白さ、勝ち筋、人間の容易さへ読み替えない。
11. machine-only evidenceからhuman difficulty、human error、錯覚、熟練判断を主張しない。
12. public Bao AIの棋力、勝率、latency、UX、deploymentを科学研究のendpointとしない。

## 4. 証拠区分と保護規則

第四世代では証拠を少なくとも次に分ける。

```text
TECHNICAL-FIXTURE
HISTORICAL-G3-REFERENCE
FRESH-COMPATIBILITY
FRESH-DEVELOPMENT
FRESH-FORMAL-HELDOUT
FRESH-EXACT-MICRODOMAIN
FRESH-DEEPER-EXACT-HOLDOUT
DIAGNOSTIC-ONLY
HUMAN-EVIDENCE
```

### 4.1 第三世代の記録

G3-04、G3-07、G3-10、G3-11、LGTGMIV、CRCLGRのformal recordは、問い、instrument、候補選択、resource planningの参照に利用できる。ただし、第四世代のfresh confirmation evidenceへ混合しない。

### 4.2 Compatibility用証拠

`FRESH-COMPATIBILITY`は、root contract、source policy、helper precondition、測定可能性、production / independent一致、resource envelopeだけを検証する。formal scientific endpoint、effect direction、p-value、counterexample判定を生成しない。

### 4.3 Formal用証拠

`FRESH-FORMAL-HELDOUT`はdevelopmentおよびcompatibility evidenceからtrajectory、opening prefix、RAW root、seedを分離する。formal decisionは、この区分の証拠だけで評価する。

### 4.4 Exact用証拠

`FRESH-EXACT-MICRODOMAIN`は、事前に固定した限定root群からterminalまたは明示されたrecurrent closureまで完全に構築できるdomainを指す。`FRESH-DEEPER-EXACT-HOLDOUT`はG4-10用に保護し、個別authorization前にアクセスしない。

## 5. 第四世代共通scientific contract

各core Studyは原則として次を満たす。

1. 開始時のremote `main` HEADを完全SHAで記録する。
2. 新しいresearch branchとStudy directoryを使用し、`main`を進行中実験領域にしない。
3. scientific outcome生成前にStudy ID、Stage ID、source、population、seed、endpoint、threshold、gate、resource ceiling、停止条件を固定する。
4. authorization review完了前にscientific seedを生成・readしない。
5. development、compatibility、formal、exact holdoutを用途別に分離する。
6. root selectionは可能な限りoutcome-blindとし、raw plyを独立標本として扱わない。
7. production computationと、集計logicを共有しない独立検証を用意する。
8. exact primitiveはintegerまたはreduced rationalを優先し、hashとcanonical serializationを保存する。
9. 浮動小数点metricを使用する場合は、演算順、rounding、toleranceを結果を見る前に固定する。
10. resource cutoff、timeout、artifact failure、administrative cutoffをnegativeまたはnull scientific resultへ読み替えない。
11. gate failure後にthreshold relaxation、seed extension、root replacement、module drop、favorable subgroup rescueを行わない。
12. partial completionをcomplete exact resultへ昇格しない。
13. 各Stageのauthorizationは当該Stageに限定し、次Stageへ自動継承しない。
14. formal result確認前にclosed Studyの判断や公開AIを変更しない。
15. heavy formal generationは原則としてGitHub Actionsに依存せず、再現可能なlocal runbookとartifact検証経路を用意する。

## 6. Wave A — 移送可能性の基盤とclaim別検証

### G4-01 — Claim-Transfer Compatibility Instrument Foundation Study 1

日本語作業名:

**Bao局所ゲーム木幾何claimの移送検証に必要なcompatibility instrumentのprospective構築 — root contract、source policy、search helper、exact measurementの適合性検証**

中心課題:

> 科学的effectを見ずに、G3-04・G3-07・G3-10由来の各claim familyをfresh domainへ移すためのroot eligibility、helper precondition、測定一致、resource conditionを再現可能に判定できるか。

本StudyはG3-12のrepairではない。G3-12で未使用だったseedやStage 1 evidenceを再利用せず、technical fixtureとfresh compatibility populationだけを使う。formal scientific effectを生成しない。

得られる可能性のある状態は、全family適格、一部family適格、`NON-ESTIMABLE`、`TECHNICAL-INVALID`である。後続のG4-02〜G4-04は、本Studyで適格化されたfamilyだけを使用できる。

**Priority: P0 / first candidate**

### G4-02 — Corridor / Tree-Graph Phase-Structure Generalization and Counterexample Study 1

日本語作業名:

**Baoのcorridor・tree/graph phase structureの一般化可能範囲と反例領域 — G3-04 C1・C6をfresh phase、root family、source policyへ移すclaim別検証**

中心課題:

> G3-04で限定的に確認されたunit-width occupancyとcumulative tree/RAW ratioのphase差は、どのfresh domainで同方向に成立し、どこで成立しないか。

G3-04の正式判断は変更しない。C1とC6は別endpointとして扱い、片方の失敗後に他方のpopulationやthresholdを変更しない。formal decisionは`GENERALIZES-WITHIN-FROZEN-DOMAIN`、`COUNTEREXAMPLE-BOUNDARY-DETECTED`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`等からStudy開始時に固定する。

**Priority: P0**

### G4-03 — Local Width / Search-Ranking Stability Transportability Study 1

日本語作業名:

**Baoのroot legal widthとsearch ranking変化の関連が移送できる範囲 — G3-07 confirmed familyのfresh search condition・root family検証**

中心課題:

> root legal widthのhigh stratumでranking-preorder changeが集中するというG3-07の限定的関連は、fresh source policy、phase、root contract、search perturbationでも再現するか。

ranking changeはbad move、評価失敗、game-theoretic error、人間の迷いを意味しない。G4-01が各search helperとpopulationのcompatibilityを確認した場合だけ実行候補になる。

**Priority: P0**

### G4-04 — Geometry-Trajectory Dynamics Transportability Study 1

日本語作業名:

**Bao局所幾何trajectoryのdirectionality・persistence・return・path dependenceの移送可能性 — G3-10 formal claimsのfresh domain検証**

中心課題:

> G3-10で確認されたC1・C2・C3・C5は、fresh trajectory policy、phase構成、root familyでも同じ方向を持つか。また反例はどのdomainに集中するか。

`CRCLGR-R1-EXACT-SQUASHED-L1`を使用する場合は、その既存eligibility範囲を超えない。表現を変更する場合は、G4-04とは別の新規representation prerequisiteを先に置く。

**Priority: P0**

## 7. Wave B — Exact microdomainとgame-theoretic帰結

### G4-05 — Exact Microdomain Oracle Foundation and Expansion Study 1

日本語作業名:

**Baoのreachable late-game exact microdomainと独立oracleのprospective構築 — terminal・recurrent closureを含む限定domainの完全解析可能性検証**

中心課題:

> outcome-blindかつresource-feasibilityだけで選んだfresh reachable rootsについて、合法遷移グラフを完全に閉じ、独立solver間でgame-theoretic valueとsolution structureを一致させられるか。

Research Generation 1の8-state exact domainやG2-04を拡張・救済するStudyではない。fresh root contractを用い、`WIN`、`LOSS`、`DRAW`、`RECURRENT`、`UNRESOLVED`等の値域と反復状態の扱いを事前に固定する。

**Priority: P0 / exact-consequence prerequisite**

### G4-06 — Local Geometry / Exact Game-Theoretic Consequence Bridge Study 1

日本語作業名:

**Baoの局所ゲーム木幾何とexact game-theoretic consequenceの対応検証 — 完全解析済みmicrodomainに限定したvalue、solution distance、move-equivalence構造との接続**

中心課題:

> 完全解析済みのfresh microdomain内で、corridor、tree/RAW inflation、transposition、reply width等は、exact value、solution distance、value-preserving move countと再現可能な関係を持つか。

G4-05がformal-eligible exact oracle domainを生成した場合だけ実行する。engine evaluation、自己対局勝率、deeper searchをexact valueの代替にしない。限定microdomain内の関連をwhole-Bao optimalityへ一般化しない。

**Priority: P0 / depends on G4-05**

## 8. Wave C — 時間・ルール・探索への接続

### G4-07 — Multiscale Geometry Memory and Return Study 1

日本語作業名:

**Bao局所ゲーム木幾何の多時間尺度memory、消失、反転、回帰のprospective検証 — trajectory単位の連続表現解析**

中心課題:

> 局所幾何の各axisは複数lagでどの程度持続し、どのrule eventまたはphase crossingで消失・反転・回帰するか。

G3-08の再実行ではない。G3-10のformal resultを仮説生成にだけ用い、fresh trajectory、事前固定したlag family、trajectory-level experimental unit、欠測・phase crossing規則で検証する。half-lifeという語を使う場合もbounded operational definitionとして固定し、物理的減衰法則を意味させない。

**Priority: P1**

### G4-08 — Bao Rule-Semantic Geometry Transition Decomposition Study 1

日本語作業名:

**capture、nyumba、reserve、Namua→Mtajiに伴う局所幾何変化の分解 — event-specific compatibilityとreachable contextを用いたmove-conditioned exact解析**

中心課題:

> Bao固有のrule-semantic eventごとに、branching、reply width、transposition、tree/graph ratioのどの成分が前後で変化するか。

G3-06をrepairしない。capture、nyumba、reserve decrement、Namua→Mtajiを一つのevent familyへ混合せず、eventごとのselection contractと独立一致gateを用いる。mandatory captureや機械的に連結したreserve・phase semanticsにより有効なcounterfactualが存在しない場合、claimをevent-conditioned associationへ限定し、一般的なcausal effectを主張しない。

**Priority: P1**

### G4-09 — Geometry-Conditioned Search Reliability and Exact Agreement Study 1

日本語作業名:

**Bao局所ゲーム木幾何によるsearch reliability境界のprospective検証 — 一般domainの出力安定性とexact microdomainのvalue agreementを分離した解析**

中心課題:

> 局所幾何は、fresh search configuration間のranking・PV・TopSet安定性を予測できるか。またexact microdomain内では、search outputがexact value-preserving move setと一致する条件を記述できるか。

一般domainではsearch-output stabilityだけを扱い、higher-resource searchを真値としない。exact correctnessを扱うmoduleはG4-05のeligible domainへ限定する。科学結果を公開AI採用へ自動接続しない。

**Priority: P1 / exact module depends on G4-05**

## 9. Wave D — 保護されたdeeper exact研究

### G4-10 — Fresh Depth-11 Exact Reachability Topology Study 1

日本語作業名:

**Bao standard initial RAW rootのfresh depth-11 exact reachability topology — novelty、transposition、tree/graph divergenceの独立deeper検証**

中心課題:

> standard initial RAW rootからのcomplete exact depth 11において、新規RAW state、tree occurrence、duplicate arrival、multi-predecessor state、tree/RAW divergenceはどのようなexact topologyを形成するか。

本Studyは第四世代のprotected deeper exact trackである。depth 11は個別authorization、resource ceiling、停止条件、partial-result rule、独立full re-enumeration経路を固定するまで生成・readしない。G3-11 depth 10のsame-evidence rerun、G2-12 estimatorの復活、depth 12の事後追加、whole-Bao sizeへの外挿を行わない。

**Priority: P2 / protected holdout**

## 10. 独立・非阻害track

### G4-P01 — State-Transformation Semantics / Canonicalization Re-foundation Study 1

validated transform setは現在`[]`である。canonicalization研究を行う場合は、G2-03や既存symmetry Studyの救済ではなく、full identity fields、legal-move bijection、transition commutation、terminal / winner / pending equivariance、inverse、独立再構築を新しく固定する。

このtrackはcoreの開始条件ではない。G4-P01が成立しない場合もcoreはRAW identityで進行できる。formal validation前にG4-10等のstate deduplicationへ使用しない。

### G4-H01 — Human Perception / Expert Judgment Study 1

machine geometryとhuman-perceived difficulty、criticality、confidence、candidate move recognitionの関係を扱う独立trackとする。

qualified Bao participantへの現実的なアクセス、参加資格、recruitment、minimum N、説明・同意、匿名化、分析計画を回答収集前に固定できない場合は、次の状態を維持する。

```text
DEFERRED
INDEPENDENT
NON-BLOCKING
```

`N=0`をnegative human evidenceへ読み替えず、machine-only coreから人間に関する代理主張を行わない。

## 11. Dependencyと推奨実施順

```text
Research Generation 4 Common Scientific Contract
        ↓
G4-01 Claim-Transfer Compatibility Instrument
        ├──────── G4-02 Corridor / Tree-Graph Transfer
        ├──────── G4-03 Width / Search-Ranking Transfer
        └──────── G4-04 Geometry-Trajectory Transfer

G4-05 Exact Microdomain Oracle Foundation
        ├──────── G4-06 Geometry / Exact Consequence Bridge
        └──────── G4-09 Exact Agreement Module

G4-02..G4-04 eligible closures
        ├──────── G4-07 Multiscale Memory / Return
        ├──────── G4-08 Rule-Semantic Transition
        └──────── G4-09 Search Reliability

Protected independent exact track
        ↓
G4-10 Fresh Depth-11 Exact Reachability Topology

G4-01..G4-10 formal closures
        ↓
Research Generation 4 Final Synthesis

G4-P01 Canonicalization = independent / non-blocking
G4-H01 Human Track = independent / non-blocking
```

推奨優先度は次のとおりである。

```text
P0: G4-01, G4-02, G4-03, G4-04, G4-05, G4-06
P1: G4-07, G4-08, G4-09
P2: G4-10
Separate / non-blocking: G4-P01, G4-H01
```

G4-05はG4-01と並行してauthorization reviewを検討できるが、scientific evidenceを同時に無秩序生成しない。各Studyのdependencyとresource contentionをreviewで判定する。

## 12. 資源・実行方針

1. 重いexact enumerationやformal corpus generationをGitHub Actionsの時間上限へ無理に合わせない。
2. localまたは適格な計算環境で再現可能なrunbookを用意し、input manifest、source SHA、seed、command、stdout summary、artifact hashを保存する。
3. 大規模artifactをGitへ直接保存できない場合も、canonical summary、digest、schema、verification resultをrepositoryへ残す。
4. resource ceiling到達時は、事前固定した規則に従い`NON-ESTIMABLE`または`TECHNICAL-INVALID`を区別して閉じる。
5. outcome確認後に計算資源、depth、seed数、root数を追加してformal decisionを救済しない。

## 13. 第四世代で明示的に避ける設計

- G3-12 Stage 1のrepairまたはStage 2 seedの再利用
- G3-11 depth 10のsame-evidence rerun
- depth 0〜10からの事後的なwhole-game growth extrapolation
- closed G2/G3 threshold、classifier、representation、populationの再調整
- G3のconfirmed claimをformal testなしで普遍法則へ昇格
- engine scoreからBao win probabilityへの変換
- deeper searchをgame-theoretic truthとして利用
- corridorやnarrow branchingをgame-theoretic forcingと呼ぶこと
- machine search complexityをhuman difficultyと呼ぶこと
- unvalidated symmetryによるstate reduction
- raw plyを独立標本とする推論
- technical failureをnull resultへ読み替えること
- research resultから公開AI候補を自動採用すること

## 14. Program completion conditions

Research Generation 4はpositive resultの数で完了判定しない。次の条件を満たした時点をcore program closureとする。

1. G4-01〜G4-10が、dependency gateと事前固定した停止条件に従って正式にcloseしている。
2. Research Generation 1〜3のclosed decisionとprotected evidenceを変更・救済していない。
3. RAW identityとvalidated transform set `[]`が、独立formal authorizationなしに変更されていない。
4. claim-transfer compatibility instrumentについてformal eligibilityまたは明確なnon-estimable / technical-invalid closureがある。
5. G3-04・G3-07・G3-10由来のclaim familyについて、fresh evidence上のtransferability / counterexample agendaがformal closureしている。
6. exact microdomain oracle foundationについてformal eligibilityまたは明確なclosureがある。
7. exact oracleが成立した場合、geometryとgame-theoretic consequenceのbridge agendaがformal closureしている。成立しない場合はdependency-gated closureが記録されている。
8. multiscale memory、rule-semantic transition、search reliabilityの各agendaがformal closureしている。
9. depth 11が明示的にauthorizedされた場合はcomplete exact resultまたは事前規定のresource / technical closureを持ち、authorizedされない場合は`NOT-AUTHORIZED-NOT-EXECUTED`として閉じている。
10. tree、graph、search、evaluation、exact value、human constructが分離されている。
11. G4-P01とG4-H01がcoreを不当に阻害せず、未実施をnegative evidenceへ読み替えていない。
12. public AI engineeringをscientific successへ読み替えていない。
13. machine-readableなprogram final resultと、日本語のfinal synthesisが作成されている。
14. current-facing文書、中央索引、将来アジェンダ、再開文書が同じ最終状態を示し、日本語品質ゲートをPASSしている。

## 15. 最初の研究候補と次に許可される工程

第四世代の最初の候補は、次とする。

**G4-01 — Claim-Transfer Compatibility Instrument Foundation Study 1**

理由は、G3-12が科学的な一般化判定ではなく、root populationとsearch helper前提のcompatibility failureでtechnical-invalidになったためである。一般化検証を再び一つの大きなcapstoneへまとめる前に、claim familyごとの入口条件を科学的effectから切り離して検証する必要がある。

計画統合後に自動的に許可されるscientific executionはない。次に行えるのは、current `main`を基準とする**post-RG3 / pre-G4-01 current-state authorization review**だけである。reviewが`AUTHORIZED`を明示した場合に限り、正式Study ID、最終題目、Stage構成、fresh technical population、seed block、measurement family使用範囲を結果を見る前に固定する。

## 16. 文書と統合の品質

第四世代の人間向け文書は、初稿から[`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)と[`../JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](../JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を満たす。

- 読者が目的、状態、判断理由、意味、限界、読む順序を日本語だけで追えるようにする。
- canonical ID、decision token、hash、seed、pathは変更しない。
- 凍結前に日本語品質を監査し、後日一括翻訳する運用を前提にしない。
- Studyの入口、計画、現在状態、再現性、研究ログ、再開文書、最終報告、中央索引を横断して整合させる。
- closure、PR、`main`統合前に英語だけの見出し、英語完全文、相対リンク、code block、canonical情報、authorization状態を監査する。

本計画の完成と`main`統合は、第四世代の科学的成功を意味しない。各Studyはpositive、negative、not-confirmed、non-estimable、technical-invalid、not-authorizedのいずれも正当な最終状態として受け入れる。
