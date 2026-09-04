# G3-01 / LGTGMF-STUDY1 — 研究概要

更新日: 2026-08-31  
状態: **完了 / `TECHNICAL-INVALID`**

## 何を調べた研究か

Baoの局面から限られた手数だけ先を完全に列挙し、game treeとして数えた手順の広がりと、同じ局面をまとめたRAW graphの構造を、再現可能に測定できるかを調べた。

対象は、depth別tree occurrence、distinct RAW state、reply width、transposition、reconvergence、tree / graph divergenceなどである。Research Generation 3ではこれらを後続研究の基礎測定に使う計画だったため、G3-01では「興味深い局面を発見すること」より先に、measurement instrument自体のexactnessと独立再現性を検証した。

## 研究デザイン

Study開始前に次を固定した。

- Study ID: `LGTGMF-STUDY1`
- authoritative RAW identity: `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- 5つのmeasurement family: `F1`〜`F5`
- Stage 1 seed: `31010001..31010096`
- Stage 2 seed: `31020001..31020096`
- local horizon: depth 5
- root selection、resource ceiling、independent verification、no-rescue ruleの固定

standard initial RAW rootのcomplete depth-10 exact layerはG3-11用にsealedし、本Studyでは生成・readしなかった。

## Stage 0の役割

最初のtechnical implementation v1は、多くのtechnical checkには通ったものの、凍結済みの`rootBranchPairOverlap`と`narrowPathRun`をformal measurement coreへ出力していない欠陥が見つかった。

この時点ではfresh scientific evidenceをまだ生成していなかったため、事前に定めたルールに従ってv1を`STAGE0-TECHNICAL-INVALID`として保存し、scientific contractを変更しないcorrective v2を作成した。

v2ではproductionとindependent implementationが全technical primitiveをexactに再現し、Stage 0はpassした。

## Stage 1で確認できたこと

fresh development seedからgeometryを見ずにNamua 6局面、Mtaji 6局面を選び、全12局面を双方の実装でdepth 5まで完全に再構築した。

次はすべてexactに一致した。

- 12局面のroot identity
- source trajectory / opening-prefixのidentity
- 各rootのmeasurement core hash
- `F1-TREE-OCCURRENCE`
- `F2-RAW-GRAPH`
- `F3-TRANSPOSITION-RECONVERGENCE`
- `F4-TREE-GRAPH-RELATION`
- `F5-REPLY-GEOMETRY`

したがって、主要なlocal geometry primitiveはfresh development population上で高い再現性を示した。

## なぜ正式なeligible instrumentにならなかったのか

Study開始時には、各rootのdigestをcanonical orderで並べたdeterministicなstage-level hashもverification chainの一部として要求していた。

ところがStage 1 implementationは、そのstage hashにelapsed timeやmemory使用量など、実行ごとに変化するresource observationsまで含めてしまった。このため、各rootと5つのmeasurement familyが完全一致しているにもかかわらず、productionとindependentのstage-level hashが一致しなかった。

これは局所ゲーム木幾何そのものの不一致ではないが、事前に固定したverification artifact contractのtechnical defectである。

## なぜ修正して再実行しなかったのか

Stage 1のfresh seedはすでに消費され、結果も生成・readされていた。Study開始時のno-rescue ruleでは、その後にimplementationだけを直して同じevidenceを再利用し、判定をpositiveへ変更することを禁止している。

そのため、結果が惜しいからという理由でstage hashだけを修正して再判定することはしなかった。

## 正式判断

```text
LGTGMF-STUDY1 = TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed consumption = NONE
```

これは「これらのgeometry metricは測れない」という科学的否定ではない。fresh developmentでは全5 familyのroot-level exact agreementが得られたが、本Studyのformal verification chainを最後まで満たせなかったため、Research Generation 3の後続研究へformal eligibilityを付与できなかった、という判断である。

## 何が分からないままか

本Studyからは、Bao全体のstate-space / game-tree size、best move、勝ち筋、人間の難易度、search reliability、game-theoretic forcingなどは分からない。また、Stage 1で見えた個別geometry patternをBao一般へ一般化することもできない。

## 次の研究への影響

G3-02〜G3-08は、原則としてG3-01でformal eligibilityを得たmeasurement familyだけを使用する計画である。本Studyのeligible setは空なので、そのまま自動的に次へ進めることはできない。

今回のfailure modeを利用する場合は、G3-01を救済するのではなく、deterministic stage manifestを最初から正しく固定した新しいprospective prerequisite Studyとして独立に設計する必要がある。
