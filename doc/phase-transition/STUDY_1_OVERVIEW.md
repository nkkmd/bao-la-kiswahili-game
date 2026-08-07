# 第1研究概要 — Baoにおける局面相転移点とcapture-branch-expansion

更新日: 2026-08-07  
Status: **Study 1 closed**

> この文書は、第1研究の成果を初めて読む人向けに説明する入口文書です。
>
> 科学的な正本は [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)、用語・機械定義の正本は [`STUDY_1_VOCABULARY.md`](STUDY_1_VOCABULARY.md)、現在の研究状態は [`CURRENT_STATUS.md`](CURRENT_STATUS.md) を参照してください。

---

## 1. この研究は何を調べたのか

第1研究の出発点は、Bao la Kiswahiliの対局中に、単なる評価値の上下や一時的な好手・悪手ではなく、**局面の戦略的な構造そのものが切り替わる地点をデータから検出できるか**という問いでした。

ここでいう「相転移」は、物理学上の相転移をそのまま主張するものではありません。Baoの局面において、合法手、捕獲可能性、強制性、前列構造、reserveなど複数の特徴が変化し、その変化が一定期間持続する地点を「戦略的転移候補」として抽出し、再現性を検証する研究上の枠組みです。

当初はformal phase、reserve、nyumba、前列、mobility、forcingなど広い現象を対象としていました。その探索の中で、最も明瞭かつ再現性の高い中心現象として残ったのが **`capture-branch-expansion`** でした。

第1研究は最終的に、次の研究として完結しました。

> **Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**

---

## 2. `capture-branch-expansion` とは何か

`capture-branch-expansion` は、ある戦略的転移候補の後で、**合法的に選べる捕獲手の数が増え、その増加が一時的な跳ね上がりではなく持続する現象**です。

重要なのは、「その一手で大量に種を取れる」という意味ではないことです。見ているのは、候補局面を境にして**その後の捕獲選択肢の構造がどのように発達するか**です。

研究では、似て見える変化を区別するため、候補を少なくとも次の型に分類しました。

- `capture-branch-expansion`: 捕獲選択肢の持続的拡大
- `capture-branch-convergence`: 捕獲選択肢の収束
- `temporary-spike`: 一時的な増加
- `namua-to-mtaji-precursor`: formal phase転換直前の変化
- `forcing-release-precursor`: 強制捕獲状態の解除直前の変化

この区別によって、「変化が大きい局面」を一括して相転移候補と呼ぶのではなく、**どのような構造変化が起きたのかを分解して扱えるようになった**ことも第1研究の成果です。

---

## 3. 最初の発見

開局妥当性を確認したpilot-v2では、100局・5,650観測から421個のforced-capture regimeを抽出しました。

探索段階のCategory-A候補15区間のうち、`capture-branch-expansion`は5区間、33.3%で観測されました。一方、比較可能なforced-capture controlでは120/4,127、2.9%でした。

したがって探索段階では、候補側で約 **11.46倍** の濃縮が見られました。

この時点ではまだ探索的結果です。しかし、この大きな差によって`capture-branch-expansion`が後続確認実験の中心対象になりました。

---

## 4. forced-capture regimeとの関係

研究中に重要な構造として浮かび上がったのが **forced-capture regime** です。

これは、盤面状態として `forcedCapture === true` が連続している最大区間、つまり捕獲義務によって着手の自由度が制約されている期間を指します。

探索段階のCategory-A archetypeはすべて、このforced-capture regimeの内部で観測されました。

ただし、「regime内ならどこでも同じように発生する」という結果ではありませんでした。後半の分析では、`capture-branch-expansion`が成立しやすい候補には次のような傾向が見られました。

- forced-capture regimeが比較的長い
- regime内の比較的早い位置にいる
- `namua -> mtaji`転換の直前ではない
- forcing releaseの直前ではない
- 候補後にも高い捕獲選択肢数を維持できる
- elevated stateの持続余地が残っている

第1研究では、このような拡大と持続に適したregime内部の形態を解釈的に **`sustained-forcing window`** と呼んでいます。

これは結果後にclassifierへ追加した条件ではなく、固定済みデータを用いたStage Bの構造説明です。

---

## 5. 新しい対局でも現象は再び現れた

探索データだけで現象が見える場合、過適合や偶然の可能性があります。そのため第1研究では未使用seed・独立seed・trajectory単位の重複除去を使って確認を続けました。

### E-010 — unused-seed confirmation

新しい200局では、主要候補11件のうち7件、**63.64%** がexpansionでした。controlは249/8,424、**2.96%** で、risk ratioは **21.53** でした。

ただし、事前登録した最低候補数は12件で、実際は11件でした。そのためformal decisionは **`not-confirmed`** です。

結果を見た後で12を11へ緩めることはしませんでした。

### E-017 — independent structural confirmation

同一の決定論的trajectoryを大量に数えてしまう問題を避けるため、`trajectoryHash + eventPly` を独立構造単位として1,000 independent-seed gamesを検証しました。

- unique candidates: 21
- expansion candidates: 9
- candidate expansion rate: **42.86%**
- unique controls: 23,306
- control expansion rate: **3.12%**
- risk ratio: **13.74**

ここでも強い濃縮方向は維持されました。

一方、事前登録した最低unique control数30,000を満たさなかったため、formal decisionは **`not-confirmed`** のままです。

このように、第1研究では「現象を支持するデータが強い」ことと「事前登録したformal confirmation条件を満たした」ことを明確に分離しています。

---

## 6. 最大の発見 — depth2とdepth3でsearch profileの優位方向が逆転した

第1研究で最も明瞭な境界条件は、AIのsearch profileと探索深度の比較から得られました。

比較した主なsearch profileは、現在の`phase2`と旧`legacy`です。

### E-018 / H16 — depth2

固定条件 `hard / bao / depth2`、2,000 paired shared-seed gamesで直接比較した結果:

- phase2-only: 63
- legacy-only: 9
- discordants: 72
- phase2 event-game rate: 3.15%
- legacy event-game rate: 0.45%
- discordant OR P2/LG: **7.0**
- exact McNemar p: `4.1812279092751445e-11`

したがって、**depth2ではphase2 > legacy** がformalに確認されました。

ただし、この確認は固定 `hard / bao / depth2` の範囲だけです。

### E-019 / H17 — generalization test

次に、同じphase2 > legacy方向が他の深度・evaluatorでも成立するかを調べました。

D1とV2では事前登録方向を満たしましたが、D3では:

- phase2-only: 13
- legacy-only: 140
- RD P2-LG: -2.8222 pp
- exact p: `4.614222568073049e-28`

となり、方向が強く逆転しました。

このため、全strataが同方向でなければならないH17 globalは **`not-confirmed`** です。

ここでE-019を後から「legacy優位を確認した実験」と読み替えることはしませんでした。

### E-020 / H18 — depth3 reversalの独立追試

D3逆転を新しい仮説として改めて事前登録し、新しい4,500 paired seeds、9,000 gamesで独立確認しました。

- legacy-only: 129
- phase2-only: 18
- discordants: 147
- phase2 event-game rate: 0.40%
- legacy event-game rate: 2.8667%
- discordant OR LG/P2: **7.1667**
- exact McNemar p: `7.0456833990241785e-22`

結果として、**固定 `hard / bao / depth3` ではlegacy > phase2** がformalに確認されました。

整理すると:

| 固定条件 | `capture-branch-expansion`がより現れやすいprofile | formal status |
| --- | --- | --- |
| `hard / bao / depth2` | **phase2 > legacy** | confirmed |
| `hard / bao / depth3` | **legacy > phase2** | independently confirmed |

これは一般的な「search profile × depth interaction」をformalに確認したという意味ではありません。また、任意のdepthで非単調な法則が成立することも意味しません。

それでも、**探索深度を変えると、同じ2つのsearch profileのどちらがこの戦略的転移phenotypeへ到達しやすいかが反転する**ことを、2つの固定条件で確認できたことは第1研究の主要成果です。

---

## 7. 逆転は何によって説明できるのか

Stage Bでは、既存formal corpusだけを使ったretrospective secondary analysisを行いました。新しいformal gamesは生成していません。

まず、単純な説明を順番に検討しました。

### candidate数だけでは説明できない

favored profileにはcandidate-bearing gameも多い傾向がありましたが、より大きな差は、**candidateが存在した後、それが本当にexpansionへmanifestする確率**にありました。

### formal phaseやregime membershipだけでも説明できない

共通条件 `namua × inside forced-capture regime` に限定しても:

- E-018 D2: P2 63/77 = 81.82%、LG 9/46 = 19.57%
- E-019 D3: P2 13/68 = 19.12%、LG 140/175 = 80.00%
- E-020 D3: P2 18/73 = 24.66%、LG 129/157 = 82.17%

となり、D2/D3の方向反転は残りました。

### 瞬間的なcaptureDeltaだけでも説明できない

候補時点で捕獲選択肢が何個増えたかという瞬間的振幅は、profile reversalを十分に追跡しませんでした。

より大きく分離したのは、formal phase transitionやforcing releaseまでの距離と、その後の高いcapture-option stateの**持続性**でした。

### trajectoryの重複だけでも説明できない

`trajectory-ply`で重複を除去すると効果量は小さくなりましたが、方向は維持されました。

| comparison | phase2 | legacy | direction |
| --- | ---: | ---: | --- |
| E-018 D2 | 11/34 = 32.35% | 7/31 = 22.58% | P2 > LG |
| E-019 D3 | 6/49 = 12.24% | 17/36 = 47.22% | LG > P2 |
| E-020 D3 | 5/42 = 11.90% | 13/35 = 37.14% | LG > P2 |

したがって、大きな反復trajectory群はrawな差を増幅していましたが、逆転そのものの原因ではありません。

---

## 8. 現時点で最もよい構造説明

既存データから支持される最も限定的な説明は次です。

> search profileとsearch depthの組み合わせは、Category-A候補がforced-capture regimeのライフサイクル上のどこに配置されるかを変える。`capture-branch-expansion`は、十分長いregimeの比較的早い位置で、formal phase transitionやforcing releaseが目前ではなく、その後も高い捕獲選択肢構造を持続できる `sustained-forcing window` と整合的である。固定depth2ではphase2が、固定depth3ではlegacyが、この形態へより多く到達する。

これは**因果機構の証明ではありません**。

なぜdepth3で到達profileが逆転するのかを説明するには、現在のarchiveにはないsearch tree内部の情報が必要です。

例えば:

- principal variation
- node expansion
- alpha-beta cutoffや同等のpruning event
- leaf evaluation
- horizon boundary
- 同じopeningからdepth1/depth2/depth3でどの手を選ぶか

などです。

この部分は第2研究以降の独立課題です。

---

## 9. 「Baoの相転移を発見した」と言えるのか

第1研究では、強いphase-transition recognitionのために原始マスター計画で6基準を設定していました。

最終評価は次のとおりです。

| criterion | assessment |
| --- | --- |
| 異なる対局で再発 | satisfied |
| 2つ以上の独立特徴群が変化 | **partially satisfied** |
| 事前指定期間の持続 | satisfied |
| 新規seedで再現 | satisfied |
| 局面構造として説明可能 | satisfied |
| 反例・適用範囲を記録可能 | satisfied |

第2の独立特徴群として、maximum-capturable-seed asymmetryは探索群とE-010で平均方向が一致しました。しかしtrajectory-ply dedup後の独立構造すべてへ十分一般化したとは言えませんでした。

そのため第1研究は、無限定に「Baoの普遍的相転移を発見した」とは結論しません。

推奨される最終表現は:

> **`capture-branch-expansion strategic-transition phenotype`**

または:

> **`strong phase-transition candidate with bounded recognition scope`**

です。

---

## 10. 第1研究が確立したこと

限定された操作的・実験的範囲では、第1研究は次を確立しました。

1. Baoの対局データから、複数の非forcing特徴群を用いて再現可能な戦略的転移候補を抽出できる。
2. `capture-branch-expansion`はcandidate側でcontrolより強く濃縮する。
3. 現象は新規seedや複数の独立trajectory / trajectory-ply構造でも再発する。
4. 現象は単純な「その一手の捕獲量」ではなく、その後の合法捕獲選択肢の形成・持続に関係する。
5. forced-capture regimeのライフサイクルと強く関連し、temporary spikeやterminal-near forcing releaseなどと分離できる。
6. 発現率は固定条件下でAI search profileに依存する。
7. tested depthに対するprofile orderingは不変ではなく、depth2ではphase2 > legacy、depth3ではlegacy > phase2がそれぞれformalに確認された。
8. この逆転はcandidate数だけ、coarse phase/regime構成だけ、瞬間的capture振幅だけ、決定論的trajectory反復だけでは説明できない。
9. 現在のarchiveからは、search profileがexpansion-compatibleな`sustained-forcing morphology`へ到達する割合の反転が最もよい構造説明である。

---

## 11. 第1研究が確立していないこと

一方、第1研究は次を確立していません。

- Bao一般に普遍的なphase-transition lawが存在すること
- 2つ以上の独立特徴群が広い独立構造で完全に確認されたこと
- 一般的なsearch-profile × depth interaction
- 任意のdepthにおける単調・非単調法則
- あらゆるevaluatorや将来のsearch implementationへの一般化
- search tree内部の因果mediation
- reserve、nyumba、front-row control、mobility、forcing release、formal phaseなど原始RQ全体を一つの理論で説明すること

この境界を明記したことも、第1研究の重要な成果です。

---

## 12. formal decision一覧

各formal experimentの判定は、後の解釈で変更していません。

| Experiment | Question | Formal decision | Main boundary |
| --- | --- | --- | --- |
| E-010 | unused-seed candidate enrichment | `not-confirmed` | minimum candidate countを1件下回った |
| E-011 | evaluator/depth/search robustness | `inconclusive` | 複数conditionでavailability不足 |
| E-017 | independent structural enrichment | `not-confirmed` | minimum unique controls未達 |
| E-018 / H16 | phase2 vs legacy at depth2 | `confirmed` | fixed `hard / bao / depth2` only |
| E-019 / H17 | D1/D3/V2同方向generalization | `not-confirmed` | D3が逆転 |
| E-020 / H18 | independent D3 legacy > phase2 replication | `confirmed` | fixed `hard / bao / depth3` only |

E-010、E-017の閾値を結果後に緩めず、E-019 D3をpost-hocでconfirmatory resultへ変えず、secondary analysisでprimary decisionを置換しなかったことは、第1研究の再現性と解釈規律の一部です。

---

## 13. この研究の意味

第1研究の価値は、単に一つの「珍しい局面」を見つけたことだけではありません。

Baoの局面を勝敗や単一評価値だけで見るのではなく、**合法手の構造が時間方向にどのように形成され、持続し、消失するか**という観点で分析できることを示しました。

特に、捕獲義務によって自由度が低く見えるforced-capture regimeの内部でも、将来の合法捕獲選択肢が持続的に拡大する構造的な窓が存在し得ること、その窓へ到達しやすいAI search profileがdepth2とdepth3で逆転したことは、今後のBao戦略研究・AI探索研究の具体的な足場になります。

ただし、この意味づけは第1研究の結果を広い研究文脈から説明したものです。科学的な最終claimは、あくまで**強いが境界付きのstrategic-transition phenotypeを確認した**ところまでです。

---

## 14. 次に読む文書

目的に応じて次を参照してください。

| 読みたい内容 | 文書 |
| --- | --- |
| 初見向けの成果概要 | **この文書 `STUDY_1_OVERVIEW.md`** |
| 科学的な最終報告・全実験 chronology | [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) |
| 用語・classifier・unitの厳密な定義 | [`STUDY_1_VOCABULARY.md`](STUDY_1_VOCABULARY.md) |
| 現在の研究状態と固定済み判断 | [`CURRENT_STATUS.md`](CURRENT_STATUS.md) |
| hypothesisの履歴 | [`HYPOTHESES.md`](HYPOTHESES.md) |
| experimentの履歴 | [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) |
| formal decisionの台帳 | [`DECISION_REGISTER.md`](DECISION_REGISTER.md) |
| formal archiveの所在とSHA-256 | [`FORMAL_EXPORT_INDEX.md`](FORMAL_EXPORT_INDEX.md) |
| 原始研究計画 | [`../PHASE_TRANSITION_RESEARCH_PLAN.md`](../PHASE_TRANSITION_RESEARCH_PLAN.md) |

---

## 15. 第1研究の最終状態

- Scientific stages A–E: **complete**
- Study 1 scientific conclusion: **closed**
- Repository closure: **complete**
- PR #26: **merged into `main`**

これ以降、未解決mechanismや新しいphase-transition claimを追究する場合は、第1研究のformal decisionsを書き換えるのではなく、新しいstudy / hypothesis / preregistrationとして扱います。
