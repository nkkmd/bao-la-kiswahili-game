# 2026-09-25 — G4-05 / RLEMOF-STUDY1 closure

## 正式状態

**`COMPLETE / FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`**

G4-05 / `RLEMOF-STUDY1` は、fresh reachable late-game rootsからresource-feasibilityだけでformal microdomainを選び、complete legal-transition closureと独立exact solver agreementを確立できるかをprospectiveに検証した。

## Canonical formal execution

```text
Stage 2 run = 36120286922
attempt = 1
head SHA = 72e45631112359346a83f9399be32ee3e6420ccb
artifact ID = 10858056244
artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
production-result.json SHA-256 = 03f0f416dca4bb92de9c55e780d47e8d39c2e2bb50fa0d987953fa87f256fff0
independent-verification.json SHA-256 = acfb9fda216d0669e4432ab4bb112b07283e05def34e9793507c0c7ad9964140
```

```text
Stage 1 RAW identity firewall = 8307 roots
fresh overlap exclusion = 0
eligible candidates = 21
inspected candidates = 10
formal domains = 8
production / independent exact agreement = true
```

candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのままformal populationから除外した。resource capの増加、candidate replacement、seed extension、same-evidence rerunは行っていない。

## Formal decision

事前登録ではminimum 6 complete domainsを満たし、production / independentの全検証が一致した場合のdecisionを

`EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`

へ固定していた。今回8 complete formal domainsを得て、全agreement gateが成立したため、このdecisionを正式採用する。

8 formal domainsのroot statusは`WIN` 2件、`LOSS` 6件。各domainのterminal / win / loss / recurrent counts、root absolute winner、DTF、optimal move keys、graph digest、solution digestをcanonical artifactへ保存した。8 domainすべてでrecurrent countは0だった。

ただし`RECURRENT = 0`はwhole-Baoでの再帰構造不在を意味しない。またStudy protocol上、`RECURRENT`から`DRAW`を生成せず、draw inference自体を認可していない。

## Program上の意味

G4-05は、限定されたfresh reachable late-game microdomainでexact oracle foundationを構築できることを確認した。

RG4 Program PlanではG4-06について「G4-05がformal-eligible exact oracle domainを生成した場合だけ実行する」と固定している。したがってG4-05 closure後は、**G4-06を次のauthorization review候補として扱える**。

これはG4-06の自動authorizationではない。G4-06を開始する場合は別Studyとしてprospective authorization、claim/domain contract、identity firewall、exact consequence endpoints、no-rescue ruleをfresh access前に固定する。

## Interpretation boundary

本結果は次を意味しない。

- whole-Bao solution
- Bao全体のWIN / LOSS / DRAW分布
- arbitrary late-game domainへの一般化
- recurrent stateと公式drawの同一視
- symmetry / canonicalization validity
- best move correctnessの一般保証
- AI棋力・勝率改善
- public AI変更

## Closure decision

**G4-05 / `RLEMOF-STUDY1` を上記formal decisionで閉じる。**

同一Studyのscientific rerun、seed extension、resource rescueを行わない。G2-04をrepairせず、G3-11 depth-10をrerunせず、G4-10 depth-11へアクセスしない。

`main`統合はこのclosureとは別操作であり、ユーザーの明示指示があるまで行わない。

## Durable evidence

- [`../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md`](../reachable-late-game-exact-microdomain-oracle-foundation/FINAL_REPORT.md)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](../reachable-late-game-exact-microdomain-oracle-foundation/results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/preregistration/STAGE_2_FORMAL_SPEC.json`](../reachable-late-game-exact-microdomain-oracle-foundation/preregistration/STAGE_2_FORMAL_SPEC.json)
- [`../reachable-late-game-exact-microdomain-oracle-foundation/authorizations/STAGE_2_AUTHORIZATION.json`](../reachable-late-game-exact-microdomain-oracle-foundation/authorizations/STAGE_2_AUTHORIZATION.json)
