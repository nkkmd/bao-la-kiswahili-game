# `JEV-BAO-DIRECT-POLICY-20260922-v1` — Pre-main Documentation Audit

更新日: 2026年9月22日

## 判定

**`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

本記録はStudy完了後、main統合前に実施した関連文書の整合監査である。Study自体の正式判定、technical audit、closure auditはすでに確定済みであり、本監査はそれらを変更せず、現在状態の案内・索引・最終文書に更新漏れがないかを確認する。

本監査のPASSはmainへの自動統合を意味しない。main統合は別の明示指示を必要とする。

## 正本として確認した状態

- Study: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- Study状態: `COMPLETED / CLOSED / AUDIT-PASS`
- 正式判定: `AI-GEN4-SUPERIOR`
- formal: `64 / 64` terminal
- Jev Direct Policy wins: `7`
- AI-GEN4 wins: `57`
- AI-GEN4 2-0 pairs: `25`
- Jev 2-0 pairs: `0`
- split pairs: `7`
- primary p-value: `5.960464477539063e-8`
- final closure verify: `VERIFIED` at `2026-09-22T15:01:20.844Z`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`
- production boundary: `NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`
- current public AI: `AI-GEN4 / AI-GEN4-RELEASE-001`

## 監査対象

現在状態を案内する文書を中心に次を相互照合した。

- ルート `README.md`
- `doc/AI_ENGINEERING_INDEX.md`
- `doc/ai-engineering/README.md`
- `doc/ai-engineering/jev-direct-policy-comparison/README.md`
- `CURRENT_STATUS.md`
- `FINAL_REPORT.md`
- `FORMAL_RESULT.md`
- `FORMAL_TECHNICAL_AUDIT.md`
- `CLOSURE_AUDIT.md`
- `tools/jev-direct-policy/README.md`

加えて、authorization / pause / resume / pilot文書は時点記録として確認し、現在状態へ書き換える対象ではないことを確認した。

## 検出した更新漏れと修正

### 1. ルートREADME

問題:

- 2026年9月22日の前Study `JEV-BAO-STRENGTH-20260921-v1` は記載されていたが、Direct Policy Studyが未掲載だった。

修正:

- Direct Policyの方式、64局結果、paired統計、`AI-GEN4-SUPERIOR`、解釈の限定、closure PASS、非採用境界を追加した。
- 前Studyの`INCONCLUSIVE`結果とは独立Studyとして分離した。
- 現在の公開AIがAI-GEN4のままであることを維持した。

### 2. AI Engineering中央索引

問題:

- 完了済みJev比較試験の節がroot move ordering Studyだけで止まっていた。

修正:

- 2つのJev Studyを独立して索引化した。
- Direct Policy Studyについて、57対7、25対0 directional pair、p-value、限定解釈、`COMPLETED / CLOSED / AUDIT-PASS`、非採用境界を追加した。
- `PBAI-P13`や新しい公開候補の採用評価ではないことを明記した。
- P1〜P12の正式判断とAI-GEN4 releaseを変更しなかった。

### 3. `doc/ai-engineering/README.md`

問題:

- P12を「直近」として終了しており、その後の2つの独立Jev比較への入口がなかった。

修正:

- 独立比較試験の節を追加し、前StudyとDirect Policy Studyを分離して案内した。

### 4. Study入口と最終報告

問題:

- Study `README.md` と `FINAL_REPORT.md` に、opening archive前の `ARCHIVE-CLOSURE-PENDING` が残っていた。

修正:

- `COMPLETED / CLOSED / AUDIT-PASS`へ更新した。
- opening定義をcommit `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`で固定済みであることと、その後の再verifyを反映した。

### 5. Formal result / technical audit

問題:

- formal完走直後の `2026-09-22T14:51:53.367Z` verifyだけを最終監査としており、opening固定後のclosure verifyが反映されていなかった。

修正:

- 結果確定verifyとclosure verifyを区別した。
- opening固定後の最終closure verify `2026-09-22T15:01:20.844Z`、不変のopenings/spec hashを記録した。

### 6. Tool README

問題:

- Study完了後も `RUNTIME-FROZEN / PAID-PILOT-NOT-AUTHORIZED` と記載されていた。

修正:

- `COMPLETED / CLOSED / AUDIT-PASS`へ更新した。
- 過去のlive authorizationを追加有料試験へ再利用しないことを明記した。

## 意図的に変更しなかった文書

次は実行時点のprospective / event historyであり、結果後に現在状態へ書き換えると履歴を破壊するため変更しない。

- `PILOT_AUTHORIZATION.md`
- `FORMAL_AUTHORIZATION.md`
- `FORMAL_PAUSE_001.md`〜`003.md`
- `FORMAL_RESUME_AUTHORIZATION_001.md`〜`003.md`
- pilot実行時点のresult / audit記録に含まれる当時のgate表現

これらの現在状態は`CURRENT_STATUS.md`、Study `README.md`、`FINAL_REPORT.md`を正本として読む。

## Branch / production境界

監査時の`main`との比較では、merge baseは `4d072cb862864f25d6ae74363040c8f4a772d8ee`、branchはbehind `0`。

差分は次の範囲である。

- Direct Policy Studyの文書
- Direct Policy Studyの試験tool
- 固定opening定義
- main統合前の文書整合更新として、ルートREADME、AI Engineering中央索引、AI Engineering案内

次の変更はない。

- `public/`
- production AI実装
- `AI-GEN4-RELEASE-001`
- AI世代
- 本番配信資産

raw live resultsと`.live-authorization.json`はtoolの`.gitignore`対象であり、Gitへ追加しない。API keyやauthorization secretはGitに含めない。

## 結論

現在状態を示す入口・索引・最終文書は、Direct Policy Studyの確定結果・監査・closure・限定解釈・非採用境界と整合するよう更新済みである。

main統合前の文書監査判定を **`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`** とする。

mainへの統合はまだ実施していない。
