# Stage 0 — 技術検証protocol

Stage ID: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## 目的

科学的rootを生成する前に、G2-09のconstruct semantics、source-generation firewall、independent verification、resource/artifact feasibilityを検証する。

## 禁止事項

- Stage 1 / Stage 2 reserved seedの消費
- scientific outcomeの生成・閲覧
- G2-06 / G2-08未validated outputのvalidated input化
- symmetry reduction / canonicalization
- C03 definitionの変更
- result-driven threshold / subgroup / instrument選択

## 技術検証項目

1. repository正本から`TM-S2-C03`を完全再構築できること
2. RAW identity included/excluded fieldsを再現できること
3. exact legal movesとsuccessor bindingをproduction/independentで照合できること
4. structural classificationを共有helperなしで再構築できること
5. D3 evaluator、score quantization、top-setを再構築できること
6. paired/comparator semanticsを再構築できること
7. Mtaji固有C03とphase-transport候補を明確に区別できること
8. outcome-independent stratificationを計算できること
9. fresh source populationをStage 1/2で分離できること
10. RAW state / trajectory / opening-prefix firewallを実装できること
11. source-policy balance / diversity floorをStage 1開始前に定義・監査できること
12. resource/artifact preflightを完了できること

## 合格原則

mandatory項目のいずれかが曖昧、再構築不能、独立検証不能、resource上実行不能である場合はfail-closedとする。科学的seedを使ってtechnical feasibilityを推測しない。
