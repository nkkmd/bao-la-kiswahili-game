# Bao AI 世代命名規則

状態: **ACTIVE**  
制定日: 2026-08-26  
更新日: 2026-09-07
適用範囲: 公開Bao AIのengineering lineage命名

人間向けの説明文は[`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)に従い、日本語を主言語とする。以下で定義するcanonical identifier自体は翻訳・改名しない。

## 1. 目的

Bao AIの「世代」、evaluation / search profile、engineering program、candidate、research generationを混同しないためのcanonical naming ruleを定めます。

この文書におけるAI世代名は、**公開AIのengineering lineage**を表します。Research Generationとは別namespaceです。

## 2. canonical namespace（正式な名前空間）

| Namespace | Canonical form | 意味 |
| --- | --- | --- |
| AI generation | `AI-GEN1`, `AI-GEN2`, `AI-GEN3`, ... | 公開Bao AIの工学的系統 |
| evaluation/search profile | `legacy`, `bao`, `bao-v2`, etc. | code / config上のprofile identifier |
| engineering program | `PBAI-P1`, `PBAI-P2`, ... | AI改善Program |
| engineering candidate | `PBAI-C001`, `PBAI-C002`, ... | repository-wideの独立candidate identifier |
| research generation | `Research Generation 1`, `Research Generation 2`, ... | Bao研究Programの世代 |
| exact baseline | `AI-GEN2-BASELINE-...`等 | 完全固定した公開AI構成 |
| release | `AI-GEN3-RELEASE-...`等 | 正式採用された公開release |

`G1` / `G2` / `G3`という裸の表記は、AI世代と研究世代を混同する可能性があるためcanonical documentationでは使用しません。

AIについては必ず`AI-GENn`、研究については必ず`Research Generation n`と書きます。

## 3. 各AI世代の定義

### `AI-GEN1` — 旧世代AI系統

初期のlegacy AI lineageを指すhistorical engineering labelです。

- `legacy` evaluation / search profileと強く対応する歴史的系統を含みます。
- 現時点では、この命名規則だけを根拠として厳密な最初・最後のcommit boundaryを主張しません。
- 将来history auditが必要になった場合は、別のversioned archival recordでexact boundaryを固定します。

### `AI-GEN2` — 直前の公開Bao AI系統

2026年9月7日の`AI-GEN3`昇格までpublicに使用されていたBao AI lineageを指します。

legacy-only構成から発展し、Bao固有評価、強化Alpha-Beta系探索、transposition table、PVS、killer move、quiescence search、Web Worker、既存benchmark / regression infrastructureなどを持つ当時の系統を含みます。

重要な境界:

- `AI-GEN2`は**lineage label**であり、exact binary / configurationそのものではありません。
- exact public configurationは各AI Engineering Programで`AI-GEN2-BASELINE-...`として完全固定します。
- PBAI-P1 historical baselineは`AI-GEN2-BASELINE-2026-08-26-v1`です。
- PBAI-P2開始時のcurrent comparatorは`AI-GEN2-BASELINE-2026-09-01-v1`です。
- PBAI-P3開始時のcurrent comparatorは`AI-GEN2-BASELINE-2026-09-05-v1`です。
- `bao-v2`という既存experimental evaluation profile名は`AI-GEN2`を意味しません。
- profile名に`v2`が含まれていてもAI世代番号とは無関係です。

### `AI-GEN3` — 現在の公開Bao AI系統

`AI-GEN3`は、PBAI-P5で正式採用した現在のpublic lineageです。最初の正式releaseは`AI-GEN3-RELEASE-001`です。

`AI-GEN2`の探索・評価・ルール処理を継承し、hard/expertの既定Bao探索に`PBAI-C011-v1`の探索専用軽量局面遷移を加えた系統です。

候補作成、development benchmark、validation、formal `ADOPT`だけでは世代を付与せず、次の条件をすべて満たしたときに限って昇格する規則は維持します。

`AI-GEN3`へのpromotionには最低限、次をすべて要求します。

1. 適用Programのscientific/evidence auditと情報遮断規則が完了している。
2. 現行`AI-GEN2` public baselineがexactに固定されている。
3. benchmark / non-regression / release gateがcandidate outcomeを見る前に固定されている。
4. candidate mechanismがisolated ablationで評価されている。
5. fresh independent validationを通過している。
6. protected release holdoutを通過している。
7. rule correctness、tactical regression、operational qualityに重大なregressionがない。
8. 明示的なengineering release decisionが`ADOPT`である。
9. candidateまたはapproved candidate setが**実際にpublic default AIとしてdeployment済み**である。

PBAI-P5の`PBAI-C011-v1`はこの条件を最初にすべて満たしたため、2026年9月7日に`AI-GEN3`へ昇格しました。

今後もrelease候補や未deploymentの採用決定を次世代名で先取りして呼んではいけません。

## 4. Candidate命名規則

Engineering candidateはAI世代名ではなく、repository-wideの連番candidate IDをcanonical identifierとして使用します。

```text
PBAI-C001
PBAI-C002
...
PBAI-C006
...
```

Candidate IDはProgramを跨いで再利用しません。完了済みcandidateを別Programで救済・再評価する場合もsame IDを再利用せず、materially new mechanismに対して新しい未使用IDを付与します。

説明文として「次世代候補」と書くことはできますが、status / file / artifact / release IDとして`AI-GEN3`を先取りしてはいけません。

release前のassemblyやrelease candidateが必要な場合は、適用Program内identifierを使用します。public adoption前に`AI-GEN3-RELEASE-*`を発行しません。

## 5. Releaseとpatchの規則

`AI-GEN3`採用後に、小規模bug fix、performance tuning、UI-only変更、同一architecture内のminor parameter adjustmentを行っただけで、自動的に`AI-GEN4`へ進めることはしません。

同一lineage内の変更はrelease / version suffixで管理します。

例:

```text
AI-GEN3-RELEASE-001
AI-GEN3-RELEASE-002
```

新しい世代番号は、public default AIの主要engineering lineageが実質的に更新され、Program-level decisionで明示的にpromotionされた場合だけ進めます。

## 6. Research Generationとの分離

Research Generationと`AI-GENn`は、番号が一致していても意味上の対応関係を持ちません。

```text
Research Generation 1 = scientific research generation
AI-GEN1               = historical AI engineering lineage

Research Generation 2 = second pure research generation
AI-GEN2               = current public AI engineering lineage
```

したがって、Research Generationの開始・完了によってAIが自動的に次世代へ昇格することはありません。

## 7. PBAI-P1で固定した対応関係

PBAI-P1では次を固定しました。

```text
current public lineage at program establishment = AI-GEN2
historical exact baseline = AI-GEN2-BASELINE-2026-08-26-v1
next generation label reserved = AI-GEN3
candidate identifiers consumed = PBAI-C001..PBAI-C005
AI-GEN3 promotion before public adoption = prohibited
Research Generation 2 outcomes in PBAI-P1 = excluded by PBAI-P1 evidence cutoff
final outcome = KEEP-AI-GEN2
```

PBAI-P1によるpublic AI deploymentは発生せず、AI-GEN3は未昇格のままです。

## 8. PBAI-P2で確定した対応関係

PBAI-P2 closureで次を確定する。

```text
program = PBAI-P2
scientific evidence = Research Generation 2 only
scientific evidence cutoff = cd200b85c1eb24aa4419bd5a9573552f3682f00d
Research Generation 3 influence = ZERO
baseline = AI-GEN2-BASELINE-2026-09-01-v1
candidate identifiers consumed = PBAI-C006..PBAI-C009
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
public AI code changed by PBAI-P2 = false
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

C006〜C009はいずれもvalidation authorizationへ到達しなかった。したがってPBAI-P2-F/G/Hによるvalidation、protected release holdout、public deployment、generation promotionは実行していない。Research Generation 3が進行していてもAI generationは自動的に進まず、`AI-GEN3`は次の正式採用public lineageの予約名のままである。

## 9. PBAI-P3で固定した対応関係

PBAI-P3のProgram初期化とprospective contract freezeで次を固定しました。

```text
program = PBAI-P3
scientific evidence = Research Generation 3 canonical evidence at or before cutoff
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
Research Generation 4 scientific influence = ZERO / EXCLUDED
baseline = AI-GEN2-BASELINE-2026-09-05-v1
candidate identifiers issued = PBAI-C010-v1
candidate feature flag proposal = pbaiC010SelectiveRootReverification
current program state = COMPLETE / KEEP-AI-GEN2
PBAI-C010-v1 = HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

PBAI-P3ではformal `ADOPT`もpublic default deploymentもなく、`AI-GEN3`へ昇格しませんでした。`AI-GEN3`は次に正式採用・配備されるpublic lineageの予約名のままです。

## 10. PBAI-P4とPBAI-P5の昇格前記録

### PBAI-P4の独立工学検証

PBAI-P4は探索専用の軽量な局面遷移PBAI-C011-v1を独立検証し、`COMPLETE / STRENGTH-NON-ESTIMABLE / HOLD`で終了した。正確性と前段の速度改善は観測したが、全体wall-clock上限4時間の監視漏れにより最終対局を354/512局で停止した。部分成績を棋力改善の正式証拠にしない。公開AIはAI-GEN2、候補は既定無効で、main統合・公開変更・世代昇格は行っていない。

[最終報告](public-ai-improvement-program-4/PROGRAM_FINAL_REPORT.md)に固定条件、実測値、停止理由、独立検算、再開境界をまとめた。Research Generation 4とは独立であり、過去PBAI-P1〜P3とC001〜C010の正式判断は変更しない。小型の学習型評価関数、学習による着手順予測、手番間の計算結果再利用は後続構想のままである。

### PBAI-P5の再検証

PBAI-P5は同じPBAI-C011-v1の独立した再検証を完了し、固定範囲で改善を確認した。新規seedは消費済みで、P4のHOLDは維持する。公開用configではhard/expertの候補を既定有効にし、main `650b4312ed9cd318d9981523533dd692bdce6125`から実サイトへ配信した。公開AI系統はAI-GEN2を維持し、正式な`ADOPT`とAI-GEN3昇格は別判断とする。[入口](public-ai-improvement-program-5/README.md)を参照する。

### PBAI-P5の昇格前最終結果

PBAI-P5はCOMPLETE / STRENGTH-IMPROVED-IN-FROZEN-DOMAIN。新規最終holdout512局で328勝184敗、勝点率64.0625％、cluster bootstrap 95％区間61.1328125〜66.9921875％となり、固定した100ms/D8の範囲で改善を確認した。全工程は約40分17秒で完了した。公開assetのbyte一致とChrome相当経路のhard AI着手完了を確認し、状態は`STAGED-PUBLIC-ACTIVE / PROMOTION-PENDING`である。正式な世代昇格は未実行である。

[最終報告](public-ai-improvement-program-5/PROGRAM_FINAL_REPORT.md)に速度・正確性・独立検算・資源条件・未検証範囲をまとめた。標準500msでの対局棋力やスマートフォンでの効果は未確認である。

## 11. PBAI-P5によるAI-GEN3正式昇格

段階的公開と実サイト確認の完了後、2026年9月7日の明示的指示に基づいて次を確定しました。

```text
program = PBAI-P5
candidate = PBAI-C011-v1
formal release decision = ADOPT
release = AI-GEN3-RELEASE-001
public lineage before promotion = AI-GEN2
public lineage after promotion = AI-GEN3
deployment evidence = PASS
```

この後続判断により、`AI-GEN3`は予約名から現在の公開AI系統へ移りました。P1〜P4の当時の記録にある`AI-GEN2`、`NOT-PROMOTED`、`HOLD`等は履歴として維持し、遡及変更しません。正式な根拠は[PBAI-P5の昇格判断](public-ai-improvement-program-5/PROMOTION_DECISION.md)を参照してください。
