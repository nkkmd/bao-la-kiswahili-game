# Bao公開AI改善の索引

更新日: 2026-09-09
現在の公開AI系統: **`AI-GEN3`**
現在の正式release: **`AI-GEN3-RELEASE-001`**
完了済みProgram: **`PBAI-P1`、`PBAI-P2`、`PBAI-P3`、`PBAI-P4`、`PBAI-P5`、`PBAI-P6`、`PBAI-P7`、`PBAI-P8`、`PBAI-P9`**
進行中Program: **`PBAI-P10`（expertへの適用検証）**
公開準備: [PBAI-C015-v1のhard限定採用](ai-engineering/pbai-c015-adoption-review/ADOPTION.md)（`ADOPT`、正式配信の照合前）

この文書は、公開中のBao AIを安全に改善するAI Engineeringの入口です。`PBAI-P1`から`PBAI-P3`までは公開AIを変更せず`KEEP-AI-GEN2`で完了しました。`PBAI-P4`は資源監視の不成立により`HOLD`、`PBAI-P5`は同じ候補の独立再検証を完了し、固定範囲で棋力改善を確認しました。P5候補をhard/expertへ段階的に公開して実サイト確認を完了した後、正式に`ADOPT`し、`AI-GEN3-RELEASE-001`として`AI-GEN3`へ昇格しました。各Programは候補とgateを結果確認前に固定し、Research GenerationとAI世代を分けて管理します。

科学研究の結果は[`RESEARCH_INDEX.md`](RESEARCH_INDEX.md)と[`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)で管理します。engineering上の結果によって、研究Studyの正式判断を書き換えることはありません。

## 1. 最初に知っておくこと

- `AI-GEN2`は直前の公開AI系統です。
- `AI-GEN3`は現在の公開AI系統で、最初の正式releaseは`AI-GEN3-RELEASE-001`です。
- `PBAI-P1`から`PBAI-P10`までは、候補を評価するengineering programのIDです。
- `PBAI-Cxxx`は個別candidateのIDです。
- `Research Generation 1..3`は研究世代であり、AI世代とは別です。
- `legacy`、`bao`、`bao-v2`はprofile identifierであり、AI世代名ではありません。

正式な命名規則は[`ai-engineering/AI_GENERATION_NAMING.md`](ai-engineering/AI_GENERATION_NAMING.md)を参照してください。

## 2. Programの状態

| Program | 使用する研究証拠 | Candidate | 現在状態・最終判断 | 公開AIへの変更 |
| --- | --- | --- | --- | --- |
| `PBAI-P1` | Research Generation 1まで | `PBAI-C001..C005` | `KEEP-AI-GEN2` | なし |
| `PBAI-P2` | Research Generation 2まで。Research Generation 3は除外 | `PBAI-C006..C009` | `KEEP-AI-GEN2` | なし |
| `PBAI-P3` | Research Generation 3まで。cutoff `479bc3d...` | `PBAI-C010-v1` | `KEEP-AI-GEN2` | なし |
| `PBAI-P4` | 新規工学検証、baseline 2026-09-06 | `PBAI-C011-v1` | `STRENGTH-NON-ESTIMABLE / HOLD` | なし |
| `PBAI-P5` | P4と独立した新規工学再検証 | `PBAI-C011-v1` | `ADOPT / AI-GEN3-RELEASE-001` | hard/expertへ正式採用 |
| `PBAI-P6` | 新規教師データによる学習評価器の工学検証 | `PBAI-C012..C014` | `DEVELOPMENT-GATE-FAIL / HOLD` | なし、`KEEP-AI-GEN3` |

`KEEP-AI-GEN2`は失敗時の代替措置ではなく、採用条件を満たす候補がない場合に事前に認められた正式結果です。結果確認後にthreshold、population、seed、candidate mechanismを都合よく変更して救済していません。

## 3. `PBAI-P3` — 第三世代研究を使う改善Program

正式題目: `Generation-3 Evidence-Informed Public Bao AI Improvement Program 3`

状態: **`COMPLETE / KEEP-AI-GEN2`**

研究証拠cutoff: `479bc3d3a9b6c745e37a88529732180e8690d6b3`

baseline: `AI-GEN2-BASELINE-2026-09-05-v1`

Program開始認可、Research Generation 3 evidence audit、現在の公開用source監査、baseline固定に加え、initial candidate inventory、support / reachability contract、global gate、fresh splitを結果確認前に固定しました。support測定を1回実行し、候補実装前に終了しました。

```text
PBAI-P3-A = COMPLETE
PBAI-P3-B = COMPLETE
PBAI-P3-C = COMPLETE / CONTRACT FROZEN
PBAI-P3-D = COMPLETE / SUPPORT-FAIL
PBAI-P3-E and later = NOT-AUTHORIZED / NOT-EXECUTED
candidate identifiers issued = 1 / PBAI-C010-v1
candidate implementations = 0
support executions = 1
benchmark executions = 0
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

読む順序:

1. [`ai-engineering/public-ai-improvement-program-3/README.md`](ai-engineering/public-ai-improvement-program-3/README.md) — Programの入口と停止境界
2. [`ai-engineering/public-ai-improvement-program-3/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-3/CURRENT_STATUS.md) — 現在の正式状態
3. [`ai-engineering/public-ai-improvement-program-3/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-3/PROGRAM_FINAL_REPORT.md) — 最終報告
4. [`ai-engineering/public-ai-improvement-program-3/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-3/DECISION_REGISTER.md) — supportとProgramの工学判断
5. [`ai-engineering/public-ai-improvement-program-3/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-3/RELEASE_REGISTER.md) — 公開系統とリリース判断
6. [`ai-engineering/public-ai-improvement-program-3/SUPPORT_REACHABILITY_RESULT.md`](ai-engineering/public-ai-improvement-program-3/SUPPORT_REACHABILITY_RESULT.md) — support結果とartifact hash
7. [`ai-engineering/public-ai-improvement-program-3/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-3/CANDIDATE_REGISTER.md) — `PBAI-C010-v1`の一覧
8. [`ai-engineering/public-ai-improvement-program-3/SUPPORT_REACHABILITY_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-3/SUPPORT_REACHABILITY_PROTOCOL.md) — baseline-only support契約
9. [`ai-engineering/public-ai-improvement-program-3/BENCHMARK_PROTOCOL.md`](ai-engineering/public-ai-improvement-program-3/BENCHMARK_PROTOCOL.md) — fresh splitとprospective gate
10. [`ai-engineering/public-ai-improvement-program-3/GENERATION_3_EVIDENCE_AUDIT.md`](ai-engineering/public-ai-improvement-program-3/GENERATION_3_EVIDENCE_AUDIT.md) — Research Generation 3証拠の利用範囲
11. [`ai-engineering/public-ai-improvement-program-3/BASELINE_SPEC.md`](ai-engineering/public-ai-improvement-program-3/BASELINE_SPEC.md) — `AI-GEN2`の基準構成
12. [`ai-engineering/public-ai-improvement-program-3/PROGRAM_PLAN.md`](ai-engineering/public-ai-improvement-program-3/PROGRAM_PLAN.md) — prospective工程

## 4. `PBAI-P2` — 第二世代研究を使った改善Program

正式題目: `Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`
状態: **`COMPLETE / KEEP-AI-GEN2`**
研究証拠cutoff: `cd200b85c1eb24aa4419bd5a9573552f3682f00d`
Research Generation 3の影響: **`ZERO / EXCLUDED`**

### 4.1 Candidateの最終状態

| Candidate | 最終状態 | 判断理由の要約 |
| --- | --- | --- |
| `PBAI-C006-v1` | `WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED` | frozen support universeで、実装を正当化するidentity defectを確認できませんでした。 |
| `PBAI-C007-v1` | `NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION` | support floorに必要なsame-key TT event数を満たしませんでした。 |
| `PBAI-C008-v1` | `DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED` | quality / safety gateは通過しましたが、計算cost gateを2件とも満たしませんでした。 |
| `PBAI-C009-v1` | `TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED` | negative control 18件が失敗し、primary benefit gateも2件とも未達でした。 |

`PBAI-C008-v1`のcost resultは次のとおりです。

```text
median node ratio = 2.1004464285714284 > 1.60
p95 node ratio = 3.079245283018868 > 2.50
```

quality指標の改善だけを理由に、事前に固定したcost gateを緩和していません。

`PBAI-C009-v1`ではtechnical failureが0でも、negative-control gateとbenefit gateを満たさなかったためvalidationへ進めませんでした。これを結果後のcontrol再定義やtrigger変更で救済していません。

### 4.2 実行しなかった工程

```text
validation executions = 0
release holdout executions = 0
formal ADOPT = none
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

未実行のvalidation / holdoutを「効果なし」という測定結果に読み替えてはいけません。実行の承認条件が成立しなかったため、保護されたデータへアクセスしていないという意味です。

### 4.3 読む順序

1. [`ai-engineering/public-ai-improvement-program-2/README.md`](ai-engineering/public-ai-improvement-program-2/README.md) — Programの目的と入口
2. [`ai-engineering/public-ai-improvement-program-2/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-2/CURRENT_STATUS.md) — 現在の正式状態
3. [`ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-2/PROGRAM_FINAL_REPORT.md) — 全候補を含む最終報告
4. [`ai-engineering/public-ai-improvement-program-2/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/CANDIDATE_REGISTER.md) — candidate台帳
5. [`ai-engineering/public-ai-improvement-program-2/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/DECISION_REGISTER.md) — 判断記録
6. [`ai-engineering/public-ai-improvement-program-2/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-2/RELEASE_REGISTER.md) — 公開状態

## 5. `PBAI-P1` — 第一世代研究を使った改善Program

正式題目: `Generation-1 Evidence-Informed Public Bao AI Improvement Program 1`
状態: **`COMPLETE / KEEP-AI-GEN2`**
研究証拠cutoff: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`
Research Generation 2の証拠: **対象外**

### 5.1 Candidateの最終状態

| Candidate | 最終状態 | 判断理由の要約 |
| --- | --- | --- |
| `PBAI-C001-v1` | `DEVELOPMENT-BENEFIT-FAIL / HOLD` | quality benefit conjunctionが未達。PR #61はmergeせずcloseしました。 |
| `PBAI-C002-v1` | `NON-ESTIMABLE / HOLD` | eligible target 5件でminimum 48件に届かず、PR #55はmergeせずcloseしました。 |
| `PBAI-C003-v1` | `NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD` | RAW identity bindingがreachability測定前に失敗。PR #63はmergeせずcloseしました。 |
| `PBAI-C004-v1` | `DEVELOPMENT-BENEFIT-FAIL / HOLD` | median node-ratio gateが未達。PR #58はmergeせずcloseしました。 |
| `PBAI-C005` | `NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD` | 現行公開面に修正すべきscore→probability表示を確認できず、実装せずcloseしました。 |

### 5.2 最終管理状態

```text
PBAI-P1 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
public/main candidate implementations = 0
validation = NOT-AUTHORIZED / NOT-EXECUTED
release holdout = NOT-AUTHORIZED / NOT-EXECUTED
original candidate inventory remaining = 0
public releases = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

### 5.3 C003を読むときの注意

`PBAI-C003-v1`はpractical reachabilityを測定していません。保存済みoracle rowとauthoritative RAW identityのbindingが成立しなかったため、その前段階で停止しました。

したがって、hit countは`null / unmeasured`であり、「hitが0件だった」という結論は承認されません。`REWR-STUDY1`と`ORISC-STUDY1`の既存判断も変更していません。

### 5.4 C005を読むときの注意

`PBAI-C005`は、現行のUI・code・diagnostic surfaceをread-onlyで監査しました。engine evaluationを検証済み勝率・勝利確率として表示する箇所がなかったため、candidate実装を作成していません。

```text
engine score -> validated Bao win probability = NOT AUTHORIZED
```

これは将来のprobability-like機能を包括的に許可する判断ではありません。

### 5.5 読む順序

1. [`ai-engineering/public-ai-improvement-program-1/README.md`](ai-engineering/public-ai-improvement-program-1/README.md) — Programの目的と入口
2. [`ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md`](ai-engineering/public-ai-improvement-program-1/CURRENT_STATUS.md) — 現在の正式状態
3. [`ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md`](ai-engineering/public-ai-improvement-program-1/PROGRAM_FINAL_REPORT.md) — 最終報告
4. [`ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/CANDIDATE_REGISTER.md) — candidate台帳
5. [`ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/DECISION_REGISTER.md) — 判断記録
6. [`ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md`](ai-engineering/public-ai-improvement-program-1/RELEASE_REGISTER.md) — 公開状態

## 6. 研究とEngineeringの境界

- 研究の`CONFIRMED`は、公開AIへの採用を意味しません。
- engineering benchmarkのPASSは、科学的な真理やgame-theoretic optimalityを意味しません。
- higher-resource searchをground truthとして無条件に扱いません。
- candidate実装は、validation・release holdout・正式な`ADOPT`を経ない限り公開系統へ入りません。
- Research Generation番号と`AI-GENx`番号に対応関係はありません。

## 7. 次の認可境界

`PBAI-P1`と`PBAI-P2`には次のcandidate taskはありません。`PBAI-P3-C`では、結果を見る前に次を固定しました。

1. candidate inventoryとmechanism
2. development / validation / release holdoutのfresh split
3. 品質・安全性・コスト・互換性の判定条件
4. independent verificationとno-rescue rule
5. `ADOPT`・`HOLD`・`REJECT`・`KEEP-AI-GEN2`のdecision mapping
6. 基準構成だけを使うsupport・reachability監査の手順

`PBAI-P3`内の次作業はありません。唯一の候補は`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`です。新しい改善Programを検討する場合は、新しいID、evidence cutoff、fresh evidenceによるoutcome非依存の開始認可レビューから始めます。

人間向け文書は[`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md)と[`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)に従い、固定ID・数値・decision tokenを変えずに日本語で説明します。

## 2026-09-06: PBAI-P4の独立工学検証

PBAI-P4は探索専用の軽量な局面遷移PBAI-C011-v1を独立検証し、`COMPLETE / STRENGTH-NON-ESTIMABLE / HOLD`で終了した。正確性と前段の速度改善は観測したが、全体wall-clock上限4時間の監視漏れにより最終対局を354/512局で停止した。部分成績を棋力改善の正式証拠にしない。公開AIはAI-GEN2、候補は既定無効で、main統合・公開変更・世代昇格は行っていない。

[最終報告](ai-engineering/public-ai-improvement-program-4/PROGRAM_FINAL_REPORT.md)に固定条件、実測値、停止理由、独立検算、再開境界をまとめた。Research Generation 4とは独立であり、過去PBAI-P1〜P3とC001〜C010の正式判断は変更しない。小型の学習型評価関数、学習による着手順予測、手番間の計算結果再利用は後続構想のままである。

## PBAI-P5の再検証

PBAI-P5は同じPBAI-C011-v1の独立した再検証を完了し、固定範囲で改善を確認した。新規seedは消費済みで、P4のHOLDは維持する。全工程の連続実行と外側の4時間監視を追加した。公開用configではhard/expertの候補を既定有効にし、main `650b4312ed9cd318d9981523533dd692bdce6125`から実サイトへ配信した。配信確認後に正式`ADOPT`と`AI-GEN3`昇格を記録した。[入口](ai-engineering/public-ai-improvement-program-5/README.md)を参照する。

PBAI-P5は[チャット非依存の実行準備](ai-engineering/public-ai-improvement-program-5/EXECUTION_CONTRACT.md)も整備した。外部runnerの自動進行・途中保存・重複起動防止を用意し、正式試験は完了し、固定範囲の改善を確認した。

## PBAI-P5の最終結果

PBAI-P5は`COMPLETE / ADOPTED / AI-GEN3`。新規最終holdout512局で328勝184敗、勝点率64.0625％、cluster bootstrap 95％区間61.1328125〜66.9921875％となり、固定した100ms/D8の範囲で改善を確認した。全工程は約40分17秒で完了した。公開assetのbyte一致とChrome相当経路のhard AI着手完了を確認後、2026年9月7日に`AI-GEN3-RELEASE-001`を発行した。

[最終報告](ai-engineering/public-ai-improvement-program-5/PROGRAM_FINAL_REPORT.md)に速度・正確性・独立検算・資源条件を、[公開配信検証](ai-engineering/public-ai-improvement-program-5/PUBLIC_DEPLOYMENT_VERIFICATION.md)に配信一致と未確認範囲を、[AI-GEN3正式昇格判断](ai-engineering/public-ai-improvement-program-5/PROMOTION_DECISION.md)に`ADOPT`とrelease IDをまとめた。標準500msでの対局棋力やスマートフォンでの効果は未確認である。

## PBAI-P6の検証結果

[PBAI-P6](ai-engineering/public-ai-improvement-program-6/README.md)は、AI-GEN3の探索へ学習した論理ゲート型評価器を組み込み、同じ持ち時間での棋力改善を検証する新規Programである。比較対象として学習した線形評価器と小型ニューラルネットを同じデータで評価する。候補IDはPBAI-C012〜C014。学習用1,024 root、開発用128 rootで評価し、主候補の論理ゲート型は教師への誤差と既知戦術8件を通過したが、速度条件未達のため開発段階で終了した。正式判断は`COMPLETE / DEVELOPMENT-GATE-FAIL / HOLD`。対局・validation・holdoutは未実行であり、棋力改善は未確認。独立検算は通過し、公開AIはAI-GEN3を維持する。[最終報告](ai-engineering/public-ai-improvement-program-6/PROGRAM_FINAL_REPORT.md)を参照する。

## PBAI-P7の検証結果

[PBAI-P7](ai-engineering/public-ai-improvement-program-7/README.md)は、P6の固定モデルの出力を保持した推論軽量化を候補`PBAI-C015-v1`として検証した。同じ測定環境で旧推論実装に対し約10倍の評価速度を観測し、最終512局は300勝212敗だった。しかし、JSON保存で失われる0／−0の符号差により正式検算が停止したため、正式状態は`COMPLETE / TECHNICAL-INVALID / HOLD`である。終了後の原因調査ではゼロ符号差2件以外の全件照合を通過し、記述的な95％区間は55.46875〜61.5234375％となったが、正式な棋力改善認定には変更しない。P6のHOLDと公開AIのAI-GEN3を維持する。[最終報告](ai-engineering/public-ai-improvement-program-7/PROGRAM_FINAL_REPORT.md)を参照する。

## PBAI-P8の検証結果

[PBAI-P8](ai-engineering/public-ai-improvement-program-8/README.md)はP7の同じモデル・同じ推論コードを用い、JSON保存時の0／−0比較を修正して新規データで独立再検証した。候補は`PBAI-C015-v1`。最終512局は295勝217敗、勝点率57.6171875％、95％区間54.6875〜60.546875％で、事前条件と正式検算を通過した。正式判断は`STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`、Programは`COMPLETE`。Node/Linux、100ms・最大深度8に限る結論であり、公開判断は`NO-RELEASE / KEEP-AI-GEN3`。P6・P7のHOLDを維持する。検証終了時点ではmain統合・公開切替・正式採用は行っていない。[最終報告](ai-engineering/public-ai-improvement-program-8/PROGRAM_FINAL_REPORT.md)を参照する。

## PBAI-P9の検証結果

[PBAI-P9](ai-engineering/public-ai-improvement-program-9/README.md)は、同じ候補PBAI-C015-v1を静的JavaScriptとして毎手Workerで起動し、標準500ms・最大深さ8のNode条件で独立した追加検証を行った。主要256局は151勝105敗、勝点率58.984375%、95%区間55.078125〜62.890625%で、事前条件と全352局10329手の独立検算を通過した。正式判断は `STRENGTH-IMPROVED-IN-COLD-WORKER-DOMAIN`、プログラムは完了である。

Chromiumの既知試験78件は互換性確認として合格した。低設定64局は39勝25敗で参考基準を通過したが、スマートフォン実機の性能やブラウザ上の勝率を証明する結果ではない。公開判断は `NO-RELEASE / KEEP-AI-GEN3` とする。検証終了時点ではmain統合・公開切替・正式採用・世代更新は行っていない。P6・P7のHOLDとP8の結果を保持する。[最終報告](ai-engineering/public-ai-improvement-program-9/PROGRAM_FINAL_REPORT.md)と[実機確認の入口](ai-engineering/public-ai-improvement-program-9/RESUME_HERE.md)を参照する。

## PBAI-P6〜P9のmain統合前確認（2026年9月9日）

ユーザーの明示指示に基づき、PR #122、#123、#124、#125を依存順にmainへ統合するための確認を実施した。統合の実績は各PRのマージ記録を正本とする。各プログラムの「main統合を行っていない」という記述は検証終了時点の履歴であり、今回の統合手続きとは区別する。公開判断は引き続き`NO-RELEASE / KEEP-AI-GEN3`である。

- 保存証拠の読取専用検算：P6の22件、P7の382件、P8の381件、P9の195件、合計980ファイルを照合し、全件通過した。凍結ソースも一致し、正式対局の再実行は行っていない。
- 回帰試験：`node --test test/pbai-p6.test.js test/pbai-p7.test.js test/pbai-p8.test.js test/pbai-p9.test.js test/engine.test.js test/ai.test.js test/pbai-p4-transitions.test.js`の9件が成功した。
- GitHub上の各PR最終コミットに対応するCIは全件成功し、レビュー提出と未解決スレッドは0件だった。P9のブラウザ互換性CIも成功した。
- 文書品質：差分に含まれる人間向けMarkdown50件を対象に確認し、壊れた相対リンク、説明済み例外を除く英語だけの見出し・英語の完全な通常説明文は0件だった。正式名称Bao la Kiswahiliと基準構成の識別子は許容例外として保持する。各プログラムの品質監査記録も参照した。
- 今回の文書補足によるコードブロック、数値、hash、正式判断、凍結記録の意図しない変更は0件。`git diff --check`は通過し、public配下の差分は0件だった。

スマートフォン実機、他ブラウザ、expert設定、継続操作の確認は公開採用に向けた残事項として保持する。

## PBAI-C015-v1の公開採用レビュー（2026年9月9日）

P6〜P9のmain統合後、[公開採用レビュー](ai-engineering/pbai-c015-adoption-review/README.md)を実施した。固定条件内の棋力改善は採用準備を進める根拠になるが、公開用組込みと実環境確認が未完了のため、現時点の正式採用は保留（`HOLD`）、公開状態は`NO-RELEASE / KEEP-AI-GEN3`を維持する。

expertの3設定と高設定hardについて、Nodeで既知9局面・両構成の計72要求を追加確認し、すべて成功した。これはP9終了後の動作確認であり、ブラウザ・実機・expertの棋力が確認済みになったという意味ではない。P8・P9の正式結果とP6・P7のHOLDは保持する。まずhardを対象に公開用組込みを準備し、expertは確認後に対象へ加える案と、保留解除に必要な確認をレビューへ記録した。

採用レビュー後、[hard向け組込み](ai-engineering/pbai-c015-adoption-review/INTEGRATION.md)をPR #127へ用意した。候補は既定無効。既存の正式AI資産5ファイルを保持し、Node回帰18件、Chromium・Firefox・WebKit各9項目の公開画面確認と切戻し確認が成功した。スマートフォン実機、長時間の使用感、実サイト配備は未確認であり、正式採用は保留を維持する。

## hard限定の正式採用

ユーザーの正式切替指示とmoto g52j 5G／Android 12／Chromeで約20分の実機確認報告に基づき、[PBAI-C015-v1をhard限定でADOPT](ai-engineering/pbai-c015-adoption-review/ADOPTION.md)とした。expertはAI-GEN3を維持する。候補有効化と難易度別表示、キャッシュv35を用意した。採用判断と実サイト配信を区別し、配信状態は`DEPLOYED-ASSETS-VERIFIED`である。[配信確認記録](ai-engineering/pbai-c015-adoption-review/DEPLOYMENT.md)に22ファイルの照合結果と配信後の再対局が未実施であることを記録した。新世代名は発行していない。


## PBAI-P10：expertへの適用検証

[PBAI-P10](ai-engineering/public-ai-improvement-program-10/README.md)で、PBAI-C015-v1を低・標準・高のexpert実設定に適用できるか検証する。各設定の棋力を別々に判定し、P8・P9の成績は加算しない。準備中であり、hardのADOPTと配信確認、expertのAI-GEN3を維持する。main統合・公開切替・AI-GEN4昇格は結果報告後の明示指示待ちである。
