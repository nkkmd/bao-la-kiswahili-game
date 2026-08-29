# G2-04 第1研究概要 — 限定終盤exact oracleの拡張

更新日: 2026-08-28  
状態: **完了 / 正式判断 `INCONCLUSIVE` / Stage 2未承認**

正式英語名: **Restricted Endgame Exact Oracle Expansion Study 1**

## 1. 研究識別子

```text
Program label = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Research branch = research/g2-04-restricted-endgame-exact-oracle-expansion
PR = #70
```

日本語題目:

**Baoにおける限定終盤exact oracleの拡張 — 結果を見ずに事前選定したRAW-state domainに対する完全前向き閉包、exact retrograde analysis、cycle structure、distance、optimal-move multiplicityの厳密解析**

## 2. この研究は何を調べたのか

複数の限定Bao終盤domainを、結果を参照しない方法で事前選択し、authoritative RAW identityの下で**complete forward closureを証明できるか**を検証しました。

完全閉包を独立に確認できたdomainだけを、その後のexact retrograde analysisへ進める設計です。

途中までしか探索できなかったgraphや、計算資源上の上限で打ち切られたgraphを「exact」とみなさないことを、研究開始時から固定しました。

## 3. 状態表現上の境界

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
symmetry reduction / canonicalization / quotient graph = prohibited
```

G2-03までにvalidated transformが成立していないため、本研究ではsymmetry reduction、canonicalization、quotient graphを使用していません。

## 4. Stageごとの結果

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
  STAGE0-TECHNICAL-PASS

REEOE-S1-DEVELOPMENT-2026-08-28-v1
  TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED

REEOE-S1-DEVELOPMENT-2026-08-28-v2
  STAGE1-DEVELOPMENT-BLOCKED

REEOE-S2-FORMAL-2026-08-28-v1
  NOT-AUTHORIZED-NOT-EXECUTED
```

## 5. Stage 0 — 技術的対照

既存のREWR 8-state / 7-edge domainを、技術回帰用fixtureとしてのみ再構築しました。これは新しいG2-04科学結果を得るためのStageではありません。

Production実装と独立実装の双方が、graph、predecessor relation、exact solution、DTF、すべてのoptimal / max-resistance movesを再現し、4種類のcorruption controlもすべて検出しました。

```text
workflowRunId = 33150063023
artifactId = 9677327024
artifactZipSha256 = 37a7e522e233f8bfd0ce6534186d7babe4f3bf6551bb24b5e3f99698d3a7dac0
```

Stage 0ではfresh G2-04 scientific resultを生成していません。

## 6. Stage 1 — 拡張可能性の検証

Stage 1 v1では、production developmentの実行後にindependent verifierが起動時点で失敗したため、条件未成立時には承認しない規則に従って閉じました。同じ証拠を修正後に再実行することはしていません。

その後のfresh v2では、構造・計算資源・受入条件の設計を維持し、seed `24041001..24041512`を使用しました。

Productionと独立検証は、full scan、eligible set、selected roots、closure classificationについて一致しました。

```text
unique witness roots = 7055
eligible roots = 141
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
```

事前に固定した受入条件では、独立検証済みのcomplete closureを最低3 domain要求していました。実際には0だったため、v2は`STAGE1-DEVELOPMENT-BLOCKED`で終了しました。

## 7. complete closureに関する境界

不完全なgraphやresource-censored graphをexactへ昇格していません。

特に、

- `ADMIN-CUTOFF`はgame outcomeではない
- `MOVE-NONTERMINATION`は一手の内部遷移を計測したinstrument classificationであり、自動的にgame-levelの`RECURRENT`や`DRAW`を意味しない

という区別を維持しています。

## 8. Stage 2と正式判断

Stage 1 v2のfeasibility gateを満たさなかったため、Stage 2用のformal-domain contractもauthorizationも作成していません。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal domains evaluated = 0
fresh G2-04 exact oracle produced = false
formalDecision = INCONCLUSIVE
```

したがって、正式判断は`INCONCLUSIVE`です。

結果を見た後のcap増加、domain縮小、root replacement、seed extension、solver substitution、partial-closure promotion、symmetry reduction、canonicalizationによる救済は行っていません。

## 9. upstream研究との境界

G2-01、G2-02、G2-03、REWR、ORISC、SSGTC、AI Engineeringの既存結果は変更しません。

特に、REWRは凍結済み8-state / 7-edge domainの内部でのみexactであり、validated transformation setは引き続き空です。

## 10. 今後の再研究

構造や計算資源の契約を大きく変更してexact-oracle expansionへ再挑戦する場合は、新しいprospective independent Studyまたは新しいversioned protocolとして実施し、新しい独立証拠を使用する必要があります。

## 11. 詳細・再現用文書

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
