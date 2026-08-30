# G2-09 / TMGC-STUDY1 — 最終報告

更新日: 2026-08-30  
正式判断: **`TECHNICAL-INVALID`**

## 1. 研究

**Study ID:** `TMGC-STUDY1`  
**Program:** Research Generation 2 `G2-09`  
**正式英語題目:** Tactical Motif Generalization / Counterexample Study 1

日本語研究題目:

> **Baoにおけるmachine-confirmed tactical motifの一般化可能範囲と反例領域のprospective検証 — phase, morphology, search condition, state familyを横断したTM-S2-C03のgeneralization boundary / counterexample boundaryの再現可能な特定**

本研究は、Research Generation 1で唯一machine-confirmedされた`TM-S2-C03`を再確認・普遍化するのではなく、fresh prospective evidenceを用いてgeneralization domain、counterexample domain、non-estimable domainを分離することを目的とした独立研究である。

## 2. 結論

Study 1の正式判断は:

```text
TECHNICAL-INVALID
```

である。

Stage 0は`STAGE0-TECHNICAL-PASS`として完了した。上流C03 semantics、RAW identity、17 authorization-bound source hashes、production/independent technical reconstruction、source diversity/resource feasibilityを確認し、Stage 1/2のpopulation、axes、threshold、firewall、multiplicity、decision ruleもscientific seed消費前にprospectively固定した。

しかしStage 1 scientific authorization前に必須としたtechnical-only tooling smokeで、independent boundary aggregatorが`ReferenceError`を発生させ、canonical smoke result JSONを生成できなかった。

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 / Stage 2 scientific seedはどちらも未消費である。

## 3. 変更しないupstream境界

本StudyはResearch Generation 1の結果を変更しない。

```text
TM-S2-C03 = CONFIRMED
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
human axis = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
```

C03 exact primary constructはMtaji `coarse-no-index`、back-row `takata` right、`reusablePits=0-2`、primary consequence `actorNyumbaSeedsDeltaSign=0`である。paired `worstReplyActorCaptureMoveDeltaSign=0`はdiagnostic-onlyとして保持した。

Stage 0ではdirect Namua transportがfrozen C03 exactと意味論的に同一にはならないことを確認し、`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`とした。Namuaを人工的なcounterexampleへ数えていない。

## 4. Stage 0の結果

Stage 0はscientific inferenceを行わず、technical feasibilityだけを評価した。

### core semantics / provenanceの検証

```text
workflow run = 33285277593
source commit = 123b24049f6d12dbe529c5aecc7fc2ee78852deb
result = CORE-SEMANTICS-AND-PROVENANCE-PASS
```

Research Generation 1 candidate/spec/authorization document binding、17 source-file SHA-256 binding、RAW identity、legal moves、candidate move、successor、primary/paired semantics、D1/D2/D3 instrumentはtechnical fixtures上でexact検証された。

### contract validationの結果

```text
workflow run = 33285599766
result = PASS
```

Stage 1/2 seed非重複、8 source strata、RAW identity、Stage 1→2 firewall、prospective axes、Holm multiplicity、no-rescue、decision vocabularyの整合性を確認した。

### source / diversity / resource preflightの結果

初回run `33285427882`はresult serializationのtechnical defectでinvalidとなった。scientific seed未消費かつoutcome未生成のStage 0 technical workだったため、事前gate/population/technical seedを変更せず実装修正し、同一technical blockをexact rerunした。

accepted run:

```text
workflow run = 33285761079
source commit = 93396ec45619cf10a08726b5705b9a155bcb1c3b
result = SOURCE-PREFLIGHT-PASS
games = 128
unique RAW trajectories = 126
distinct opening prefixes = 121
selected unique C03-exact roots = 66
source strata = 8 / 8
source families = 4 / 4
```

これらを合わせStage 0は:

```text
STAGE0-TECHNICAL-PASS
```

でclosureした。

## 5. 凍結済みStage 1 / Stage 2設計

scientific evidence生成前に以下を固定した。

```text
Stage 1 seeds = 29110001..29114096 / 4096 games
Stage 2 seeds = 29210001..29218192 / 8192 games
source strata = 8
opening plies = 8
max ply = 100
RAW identity only
symmetry reduction = false
canonicalization = false
```

正式axisはRAW state / exact legal contextから直接得られるmarginal descriptorに限定し、post-hoc interaction subgroupを禁止した。Reference searchはD3/Q1をtruthではなくfrozen machine instrumentとして扱い、D1/Q1、D2/Q1、D2/Q0、D2/Q2もsensitivity instrumentとして固定した。

Stage 1でestimableになった全cellをStage 2へ持ち越す設計とし、favorable subgroupだけを選択することを禁止した。

## 6. Stage 1 tooling smokeの検証

Stage 1 scientific authorization前に、production/independent full source reconstruction、root collapse、measurement、5 search conditions、boundary assignment、boundary aggregationをtechnical-only seeds `8090201..8090232`で検証するsmokeを固定した。

```text
workflow run = 33287035754
source commit = 65b2e3dee0994e1520ad9a3470feff4f3c9d98ae
artifact id = 9724782927
artifact ZIP SHA-256 = 54c536eceb460d8734ba19e6e79bfc2e9e7c82838056338a4527e7d365e1d51c
syntax check = PASS
```

smoke runnerは約2分53秒実行後、independent boundary aggregatorで停止した。

```text
tools/experiments/lib/tmgc-stage1-boundary-independent.js:83
ReferenceError: topSetRate is not defined
```

原因は、local variable `topRate`を計算した後にreturn objectで未定義の`topSetRate`を参照した単純な実装欠陥である。

重要なのは、これはC03の成立・不成立を示すscientific resultではないという点である。canonical smoke result JSON自体が作られず、Stage 1 authorizationも発行されていない。

## 7. no-rescue規則によるclosure

smoke開始前に固定した`STAGE_1_TOOLING_SMOKE_SPEC.json`は:

```text
contractChangeBasedOnSmokeOutcomeAllowed = false
tooling failure -> STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
noPostHocSeedExtension = true
noThresholdOrAxisChange = true
```

を要求していた。

したがって、failureを見た後で変数名を修正し、同じStudy 1を再実行してStage 1へ進めることはしない。技術的に容易な修正であっても、prospective no-rescue boundaryを優先する。

## 8. Scientific resultの不在

Stage 1 scientific generationはauthorizeもexecuteもされていないため、以下はすべて`null / not estimated`である。

- generalization domain
- counterexample domain
- mixed boundary
- marginal-cell generalization label
- marginal-cell counterexample label
- search conditionごとのgeneralization / counterexample label
- Stage 2で予定していたHolm補正済みformal test

したがって「C03がgeneralizeしなかった」「counterexampleが見つかった」とは結論しない。

## 9. seedの状態

```text
Stage 1 scientific seeds 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 scientific seeds 29210001..29218192 = RESERVED / UNCONSUMED
```

technical-only smoke seedsはscientific blocksと非重複である。

## 10. 解釈境界

本Studyから言えるのは、C03 generalization/counterexample研究のStage 0 technical foundationとprospective contractは構築できた一方、Stage 1 authorization前に必須としたindependent tooling smokeを完遂できず、Study 1をscientific entryへ進める資格を失った、ということだけである。

次は主張しない。

- Bao全体でC03が普遍的または非普遍的である
- C03のcounterexample boundaryが存在する、または存在しない
- higher-resource searchがgame-theoretic truthである
- traditional/expert Bao terminologyと一致する
- 人間がC03を認識する、難しいと感じる、errorを起こす

第一世代`TM-S2-C03 = CONFIRMED`はその元claim domain内で不変である。

## 11. 将来の研究

実装欠陥を修正したgeneralization/counterexample検証は、**新しいprospective Studyまたは明示的versioned protocol**として開始できる。その場合は、今回のtechnical-invalid closureを変更せず、新しいtechnical-entry contract、fresh authorization、fresh scientific seed contractをoutcome前に固定する必要がある。
