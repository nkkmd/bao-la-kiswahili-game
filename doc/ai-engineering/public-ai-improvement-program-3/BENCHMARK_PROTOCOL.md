# `PBAI-P3` — prospective benchmark・判断protocol

状態: **`FROZEN / P3-D SUPPORT EXECUTION AUTHORIZED`**

Gate spec: `PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1`

固定日: 2026-09-05

機械可読正本:

- [`benchmark/PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1.json`](benchmark/PBAI-P3-C-GLOBAL-GATES-2026-09-05-v1.json)

数値、seed、decision tokenに相違がある場合は機械可読正本を優先し、相違自体をtechnical failureとして記録します。

## 1. 現在の実行境界

この文書は`PBAI-P3-C`で、candidate outcomeを見る前に評価設計を固定するものです。

```text
candidate = PBAI-C010-v1 only
support execution = AUTHORIZED / PRE-GENERATION
candidate implementation = NOT AUTHORIZED
development benchmark = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
```

ここで固定したseedを読むこと、rootを生成すること、candidate codeを作ることは、このStageの作業に含みません。

## 2. 証拠層と情報遮断

評価は次の層を順番に分離します。

1. baseline-only support / reachability
2. candidate-specific contract freeze
3. fresh development
4. independent reconstructionとfresh validation
5. protected release holdout
6. public-product decisionと、別認可によるrelease

前の層のPASSは次の層の自動認可ではありません。validationはcandidate tuningに使用せず、release holdoutはthreshold、candidate、endpoint、subgroupの選択に使用しません。

## 3. 新規証拠のsplit

| 用途 | development | validation | protected release holdout |
| --- | ---: | ---: | ---: |
| fixed-depth strength Namua core | `44100001..44100128` | `44200001..44200256` | `44300001..44300512` |
| fixed-depth strength Mtaji core | `44101001..44101128` | `44201001..44201256` | `44301001..44301512` |
| decision quality source | `44400001..44401024` | `44500001..44502048` | `44600001..44604096` |
| operational quality source | `44700001..44700512` | `44800001..44801024` | `44900001..44902048` |
| trajectory stress source | `45000001..45000512` | `45100001..45101024` | `45200001..45202048` |

validationとrelease holdoutのstrength splitには、Namua early / lateおよびMtaji entry / laterのchallenge strataも別blockで固定しています。完全な範囲は機械可読正本に従います。

重複firewallはseed番号だけではなく、次をすべて対象にします。

- gameまたはpaired opening
- full trajectory
- opening prefix
- authoritative RAW root identity

authoritative RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`です。`turn`と`reason`はidentityから除き、未検証のsymmetryによる同一視は行いません。

raw plyを独立標本として扱いません。strengthはopening pair、decision / operational qualityは1 trajectoryから最大1件の一意root、longitudinal stressはtrajectoryを独立単位とします。

## 4. 固定depthのstrength判定条件

candidateとfeature-off baselineを、同じseeded openingからSouth / Northを交換した2 gameで比較します。

```text
profile = bao
level = hard
maxDepth = 4
timeLimitMs = Infinity
maximum turns = 160
independent unit = openingPair
```

scoreはwin `1.0`、drawまたはadministrative unresolved `0.5`、loss `0.0`です。administrative unresolvedを科学上のdraw結論とは扱いません。

主なconjunctive gateは次のとおりです。

| 層 | core observed | core片側95%下限 | phase別core | seat別 | challenge別 |
| --- | ---: | ---: | ---: | ---: | ---: |
| development | `>= 0.50` | — | `>= 0.48` | `>= 0.47` | — |
| validation | `>= 0.50` | `>= 0.47` | `>= 0.48` | `>= 0.47` | `>= 0.45` |
| release holdout | `>= 0.50` | `>= 0.47` | `>= 0.48` | `>= 0.47` | `>= 0.45` |
| locked validation + holdout | `>= 0.50` | `>= 0.48` | `>= 0.49` | `>= 0.48` | — |

片側95%下限はopening pair単位の20,000回percentile bootstrapで計算し、analysis seedは`45999991`です。

## 5. 手選択品質の判定条件

candidateとbaselineは`hard / D4 / Infinity`で比較します。referenceは凍結済み`AI-GEN2` processによる`bao / D5 / Infinity / quiescenceDepth 1`のexact full-window root evaluationです。

referenceはengineering comparison referenceにすぎません。真のbest move、game-theoretic truth、局面価値、Bao勝率のoracleではありません。

| 層 | TopSet agreement delta | mean normalized rank-loss delta | severe excess | catastrophic new loss |
| --- | ---: | ---: | ---: | ---: |
| development | `>= +0.03` | `<= -0.01` | `<= 0` | `0` |
| validation | `>= +0.02` | `<= -0.005` | `<= 0` | `0` |
| release holdout | `>= +0.01` | `<= 0` | `<= 0` | `0` |
| locked validation + holdout | `>= +0.015` | `<= -0.0025` | `<= 0` | `0` |

各phaseにも非劣化gateを置きます。すべてconjunctiveであり、1指標の改善で別指標の失敗を相殺しません。

## 6. 計算量の判定条件

同一rootにおけるcandidate D4累積`analyzeMove` node数をfeature-off baseline D4で割ります。

```text
all-root median node ratio <= 1.10
all-root p95 node ratio <= 1.60
triggered-root median node ratio <= 1.50
triggered-root p95 node ratio <= 2.00
negative-control median node ratio = 1.00 exactly
negative-control p95 node ratio = 1.00 exactly
```

`PBAI-C008-v1`のcost失敗を踏まえ、aggregateとtriggered-rootを分け、node capがあること自体ではなく実測ratioで判断します。結果を見て上限を変更しません。

## 7. operational qualityと互換性

同一host・同一rootでAB / BA順を交互にし、`hard D8 / 500ms`と`expert D12 / 2000ms`を評価します。

主なhard gateは次のとおりです。

- crash、unhandled exception、illegal move、invalid stateは各0件。
- elapsed ratioはmedian `<= 1.05`、p95 `<= 1.10`。
- completed depthのmedian差は`>= -1`、2以上不足するrootの割合は`<= 0.05`。
- timeout rate増加は`<= 0.03`。
- direct / Worker決定性mismatchは0件。
- easy / normalの挙動変更は0件。
- `public` AI JavaScriptの追加は最大8,192 bytes、新規public assetは禁止。
- 追加persistent memoryは0 bytes。

保存状態、diagnostic schema、Worker / fallback、PWA cache、rollbackはcandidate-specific contractとrelease前runbookで明示し、互換性失敗をstrengthで相殺しません。

## 8. phase・trajectory・transposition strata

- `G3-04 / SFCDF-STUDY1`はNamua / Mtajiのphase層別化に使います。forcing、best-move明瞭さ、局面価値の証明には使いません。
- `G3-10 / GCLD-STUDY1`はdirectionality、persistence-lag gradient、return、first-order path dependenceによるtrajectory stressに使います。評価関数や勝率推定へ埋め込みません。
- `G3-11 / FDEGHV-STUDY1`はdepth 10 exact topologyとtransposition continuationを、move generation、RAW identity、transposition reuse、search-loadのstress fixtureに使います。best-move oracleには使いません。
- `G3-12 / LGTGGC-STUDY1`は`TECHNICAL-INVALID`であり、一般化または全面的公開変更の根拠にしません。

## 9. correctnessとfeature-off equivalence

rule engine、move generation、terminal result、cache identity、direct / Worker決定性、既存tactical suiteはhard gateです。candidate作業内でpublic rule engineのhashが変わった場合はcandidate評価から分離して`REJECT-AND-SEPARATE-RULES-WORK`とします。

feature-on benefit runの前に、512件以上のrootでfeature-off exact equivalenceを確認します。selected move、root score、completed depth、node、quiescence node、cutoff、cache統計、evaluation統計、例外・timeout挙動、candidate diagnostic surfaceの不存在にmismatchを1件も認めません。

## 10. negative control要件

次の各stratumではtrigger、semantic mismatch、node-count mismatchを0件とします。

- high-width / no-churn
- low-or-equal-width / churn
- low-or-equal-width / no-churn
- partialまたはtimeoutしたranking
- easy / normal level
- legacyまたは非eligible profile
- feature flag off

controlをprimary targetへ移したり、失敗したcontrolを事後除外したりしません。

## 11. 独立再構成とartifact

support、development、validation、release holdoutの各判断に独立再構成を要求します。production trigger codeをimportせず、trigger、top-3、row metric、aggregate decisionを別実装で再構成します。

candidate source / config hash、実行command、環境、seed / root manifest、full artifact、compact canonical summary、各SHA-256を保存します。重いformal generationをGitHub Actionsに強制せず、local再現runbookと独立検証手順を用意します。

## 12. failure semanticsとno-rescue

```text
support不足 = HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
support evidence生成上のtechnical / verifier failure = HOLD / TECHNICAL-INVALID-EVIDENCE
candidate semantics上のtechnical failure = REJECT / TECHNICAL-INVALID-CANDIDATE
feature-off failure = REJECT / TECHNICAL-INVALID-CANDIDATE
development intended-benefit failure = DEVELOPMENT-BENEFIT-FAIL / HOLD
development cost failure = DEVELOPMENT-BENEFIT-FAIL / HOLD
development hard-safety failure = REJECT / CANDIDATE-CLOSED
validation failure = VALIDATION-FAIL / HOLD
release holdout failure = RELEASE-HOLDOUT-FAIL / REJECT
```

formal dispositionは原因とStageで次のように固定します。

- support不足またはsupport evidence生成上のtechnical failureは`HOLD`とし、実装せずcandidateを閉じる。
- feature-off equivalenceまたはcandidate起因のhard safety failureは`REJECT`とし、candidateを閉じる。
- developmentのbenefit / cost failureとvalidation failureは`HOLD`とし、same-version tuningを行わずcandidateを閉じる。
- release holdout failureは`REJECT`とし、candidateを閉じる。
- 全engineering gate通過は`ADOPT-ELIGIBLE`であり、自動的な`ADOPT`ではない。独立検証、rollback、互換性を含む別のpublic-product decisionで明示的に`ADOPT`を記録する必要がある。
- Program closure時にformal `ADOPT`がなければ、Program outcomeは`KEEP-AI-GEN2`とする。

結果確認後のthreshold緩和、endpoint変更、seed追加、標本追加、subgroup救済、negative control除外、cost上限変更、candidate改名救済を禁止します。失敗した`PBAI-C010-v1`を同Program内の別名で再開しません。

## 13. 公開製品上の判断

全gate通過だけでは自動deployしません。scientific benchmark判断とpublic-product判断を別に記録し、正式な`ADOPT`後も、公開default変更、rollback、保存データ、PWA migrationを別途認可・確認します。

`AI-GEN3`は予約名です。formal `ADOPT`と実際のpublic default deploymentの両方が完了するまでは、`PBAI-C010-v1`とfeature flagで識別し、現在の公開lineage `AI-GEN2`を維持します。
