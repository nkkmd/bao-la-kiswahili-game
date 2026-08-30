# G2-09 / TMGC-STUDY1 — 研究概要

更新日: 2026-08-30  
状態: **Study closed / `TECHNICAL-INVALID`**

## 何を調べようとしたか

Research Generation 1で唯一machine-confirmedされた`TM-S2-C03`について、fresh positions上でどこまでgeneralizeし、どこにcounterexample boundaryがあり、どこがnon-estimableかをphase、morphology、search condition、state familyを横断してprospectively検証する研究だった。

目的はC03をuniversal motifと宣言することではなく、成立領域と反例領域を再現可能に分離することだった。

## Upstreamは変更していない

```text
TM-S2-C03 = CONFIRMED
TM-S2-C01/C02/C04 = NOT-CONFIRMED
human axis = INCONCLUSIVE-NOT-ESTIMABLE (N=0)
```

RAW identityのみを使用し、未validated symmetry / canonicalizationは使用しない。

## Stage 0

C03 exact semantics、Research Generation 1 provenance、RAW identity、production/independent technical reconstruction、source diversity、resource/artifact feasibilityを検証し、`STAGE0-TECHNICAL-PASS`となった。

C03 exactはMtaji back-row takata constructであり、Namuaへphaseだけを変えて同一constructとしてtransportできないため、direct Namua transportは`TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`とした。

## Stage 1 entryで何が起きたか

Stage 1/2のpopulation、seed、axes、threshold、firewall、multiplicity、decision ruleをscientific seed消費前に固定し、Stage 1 scientific authorizationの前提としてtechnical-only tooling smokeを実行した。

smokeのsyntax checkはpassしたが、independent boundary aggregatorが次で停止した。

```text
ReferenceError: topSetRate is not defined
```

canonical smoke result JSONは生成されず、Stage 1 scientific authorizationも発行されなかった。

事前freezeしたsmoke contractはtooling failureを`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`へ写像し、outcome後のsame-study repairを認めていなかった。このため容易な変数名修正であってもrerunせず、Studyを`TECHNICAL-INVALID`で閉じた。

## 何が分からなかったか

Stage 1 scientific evidenceは生成されていないため、次はすべて未推定である。

- C03 generalization domain
- C03 counterexample domain
- morphology/state-family boundary
- search-condition boundary
- mixed/non-estimable scientific boundary

「C03がgeneralizeしなかった」というnegative resultではない。

## Scientific seed state

```text
Stage 1 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 29210001..29218192 = RESERVED / UNCONSUMED
```

将来の再検証は新しいprospective Study/versionとして行い、本Study 1をretroactiveにrepairしない。
