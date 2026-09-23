# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月23日

## 状態

**`COMPLETED / CLOSED / AUDIT-PASS / PRE-MAIN-DOC-AUDIT-PASS / MAIN-INTEGRATED`**

Jev Direct PolicyとAI-GEN4 expert standardの比較Studyは完了した。

正式64局はすべてengine terminalまで完走し、最終 `run.cjs verify` も `VERIFIED`。実試験に使用した生成opening定義も専用branchへ固定し、その後の再verifyでbinding不変を確認した。closure auditも完了している。

正式判定は **`AI-GEN4-SUPERIOR`**。

main統合前の文書整合監査も実施し、ルート`README.md`、`doc/AI_ENGINEERING_INDEX.md`、`doc/ai-engineering/README.md`、本Studyの入口・最終結果・技術監査・tool READMEに残っていた更新漏れを専用branch上で修正した。

2026年9月22日、監査済みsource branch HEAD `9f0ba0cb5b25f5d6d09a3535b531afd881d5f0fa` をforceなしのfast-forwardで`main`へ統合した。統合直後の比較で`main`と`experiment/jev-direct-policy-20260922`はidentical、ahead `0` / behind `0` / changed files `0`を確認した。

本統合はStudy文書・試験tool・固定opening定義・関連索引の記録をmainへ保存するものであり、`public/`、production AI、AI-GEN4 release、本番配信資産は変更していない。**`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`** を維持する。


## 事後的な追加局面解析（2026年9月23日）

保存棋譜の追加解析では、1勝1敗だった7つの開幕すべてについて開始局面の強制勝敗を証明した。また、AI-GEN4が敗れた7局の全41判断局面で、着手前から相手の強制勝ちが成立していた。直後の負けを許す手を静的評価が高く採点する局面もあったが、保存棋譜の該当59局面ではAI-GEN4は危険な手を選ばなかった。方法、手数上限、訂正点および一般化できない範囲は[`POSTHOC_POSITION_ANALYSIS_20260923.md`](POSTHOC_POSITION_ANALYSIS_20260923.md)に記録する。

この事後解析はformalの主要評価や正式判定を変更しない。公開AIへの採用も行わない。

同じ開幕05のside swap対局では、AI-GEN4が5手以内の強制勝ちとなる初手で5手勝ち、Jevは別の初手から24手で敗れた。Jevの選んだ初手の後の強制勝敗は未確定である。formal全体では、相手の次手での敗北を避ける合法手があるのにJevがその敗北を許す手を選んだ局面が97件中31件あり、AI-GEN4は同種の59件中0件だった。局面群が異なるため同条件の棋力差や勝てた対局数には換算しない。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Formal確定結果

- planned / terminal games: `64 / 64`
- Jev Direct Policy wins: `7`
- AI-GEN4 wins: `57`
- Jev 2-0 pairs: `0`
- AI-GEN4 2-0 pairs: `25`
- split 1-1 pairs: `7`
- incomplete pairs: `0`
- directional pairs: `25`
- formal plies: `1029`
- two-sided exact paired sign-test p-value: `5.960464477539063e-8`
- alpha: `0.05`
- 正式判定: **`AI-GEN4-SUPERIOR`**

この判定は今回固定した `jev-1.13.0` Direct Policy方式に限定する。Jev一般、別model version、別prompt、別統合方式へは一般化しない。本比較はcompute-equalでもない。

## 最終再生監査

formal完走後およびopening定義固定後に、API keyを外して `node tools/jev-direct-policy/run.cjs verify` を実行した。

最終確認:

- status: `VERIFIED`
- timestamp: `2026-09-22T15:01:20.844Z`
- pilot: `4 / 4` terminal
- formal: `64 / 64` terminal
- total games: `68`
- pilot plies: `74`
- formal plies: `1029`
- total plies: `1103`

保存game、request / response、response digest、candidate binding、selected move、exact after-state、ledger chain、runtime manifest、protocol/openings/spec bindingに不整合は検出されなかった。

## Opening archive

実対局に使用した生成opening定義を次のcommitで固定済み。

- commit: `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`
- message: `test(jev-direct): freeze generated openings`
- `tools/jev-direct-policy/design/openings.json`
- `tools/jev-direct-policy/design/opening-verification.json`

`opening-verification.json` は Namua 16 / Mtaji 16、formal 32 pairs / 64 games、first-game Jev player 16 / 16、前Study opening 34件除外、固定openings hash一致を記録する。

## Technical pauses

formal中に3件のretryable `invalid-response` が発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2
2. `direct-v1-formal-pair-26-game-1` ply 5
3. `direct-v1-formal-pair-17-game-0` ply 3

各attempt-1をオフライン監査し、minimum retry wait経過後に同一logical moveのattempt-2を最大1回だけ認可した。3件ともattempt-2で回復し、attempt-3、opening replacement、sample extension、adaptive extension、optional stoppingは行っていない。

## 費用

- cumulative paid requests: `413`
- cumulative reported usage USD: `0.036509592`
- pilot stage USD: `0.002129904`
- formal stage USD: `0.034379688`
- uncertain reserved USD: `0`
- ledger halted: `false`
- overall hard limit USD: `1.00`
- formal hard limit USD: `0.75`

費用gate違反はない。

## Pre-main documentation audit

main統合前に、現在状態を案内する文書を相互照合した。

修正済み:

- ルート`README.md` — Direct Policy Studyの結果・限定解釈・非採用境界を追加
- `doc/AI_ENGINEERING_INDEX.md` — 2つのJev Studyを分離して索引化
- `doc/ai-engineering/README.md` — 直近の独立比較試験を追加
- Study `README.md` — `ARCHIVE-CLOSURE-PENDING`を閉鎖済み状態へ更新
- `FINAL_REPORT.md` — opening archiveとclosure完了を反映
- `FORMAL_RESULT.md` / `FORMAL_TECHNICAL_AUDIT.md` — opening固定後の最終closure verifyを反映
- `tools/jev-direct-policy/README.md` — pilot未認可表記を閉鎖済みtool状態へ更新

authorization / pause / resume文書は実行時点の履歴なので、現在状態へ書き換えず保存する。

## Main integration

- pre-integration main HEAD: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- integrated source branch HEAD: `9f0ba0cb5b25f5d6d09a3535b531afd881d5f0fa`
- integration method: forceなしfast-forward
- immediate post-integration compare: `identical`
- ahead / behind: `0 / 0`
- changed files after compare: `0`
- `public/`変更: `0`
- production AI変更: `0`
- `AI-GEN4-RELEASE-001`変更: `0`
- 本番配信資産変更: `0`

main統合は完了した。本Studyの記録統合は公開AI採用・世代変更・本番配信を意味しない。

## Closure

closure記録:

- `FINAL_REPORT.md`
- `FORMAL_RESULT.md`
- `FORMAL_TECHNICAL_AUDIT.md`
- `CLOSURE_AUDIT.md`
- `PRE_MAIN_DOCUMENT_AUDIT.md`

本Studyは **`COMPLETED / CLOSED / MAIN-INTEGRATED`**。pre-main documentation auditもPASSである。

## 非採用境界

**`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`**

本Studyから公開AI採用、AI-GEN4置換、AI世代変更、`public/`へのJev組込み、本番配信へ直接進まない。
