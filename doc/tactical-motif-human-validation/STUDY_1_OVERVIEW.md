# Tactical Motif Human / Expert Validation — Study 1 Overview （概要）

Updated: 2026-08-18  
Status: **Study 1 complete**

## 何を調べたか

Tactical Motifs / Tesuji Study 1でmachine-confirmedとなった`TM-S2-C03`について、異なるBao局面にまたがる同じmove principleとして、人間の熟練者にも認識されるかを検証するための独立prospective studyを設計した。

## Machine / instrument側で完了したこと

fresh 1,536-game corpusを生成し、全1,536局を独立full recomputationで再検証した。mismatchは0だった。

そこからprospectiveに定義したC03 target / near-miss controlsを抽出・matchingし、全readiness gateを通過した。

最終的に、人間向けformal validation用として次をdeterministicにfreezeした。

```text
primary blocks = 12
primary C03 targets = 24
primary controls = 12
control balance = P_ONLY 4 / M_ONLY 4 / MORPH_NEAR 4
secondary move-choice targets = 6
total unique formal positions = 42
```

42局面はrule state、historical trajectory、opening prefixの再利用を避ける形で固定されている。

Private exact-stimulus freeze SHA-256:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

## 人間による検証はどうなったか

本研究は特定の大学・研究機関等に所属しない独立研究として実施された。

formal scientific recruitmentを開始する前の時点で、凍結済みexpert基準を満たすBao専門家・研究者・競技者へ現実的にアクセスする経路を確保できなかった。

```text
accessible eligible experts = 0
scientific recruitment started = false
formal human responses = 0
```

expert minimumは事前に`10`名と固定されていたため、基準を緩めずhuman endpointを閉じた。

## 最終結果

Historical machine result:

```text
TM-S2-C03 = CONFIRMED
```

Human axis:

```text
INCONCLUSIVE-NOT-ESTIMABLE (N=0)
```

これは「人間の熟練者がC03を認識しなかった」というnegative resultではない。人間データが存在しないため、human recognitionについて推論できなかったという結果である。

## この研究の意味

このStudy 1では、人間による認知結果そのものは得られなかった一方、machine-confirmed motifをhuman validationへ橋渡しするための以下を再現可能な形で構築した。

- fresh held-out machine population
- independent full verification
- prospectively defined near-miss controls
- no-reuse matching
- participant-facing blinded rendering
- exact formal 42-position stimulus freeze
- machine/human evidenceを分離するdecision framework
- recruitment不足時に結果を救済しないestimability rule

したがって最終的な正しい読み方は、

> **C03はmachine-confirmedのままであり、人間のexpert recognitionは未確認ではなく、正式には`INCONCLUSIVE-NOT-ESTIMABLE`である。**

## 今後

将来qualified expertへアクセス可能になった場合、このStudy 1の結果を書き換えるのではなく、新しいprospective studyまたは明示的にversionedされたprospective extensionとしてhuman validationを行う。

詳細は`STUDY_1_FINAL_REPORT.md`を参照。
