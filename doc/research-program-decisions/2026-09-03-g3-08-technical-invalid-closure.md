# Research Program Decision — G3-08 / LGPML-STUDY1 Technical-Invalid Closure

Date: 2026-09-03

## Decision

**`G3-08 / LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Stage state:

```text
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal promoted candidate set = []
Stage 1 seed block = CONSUMED
Stage 2 seed block = NOT CONSUMED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

## Basis

G3-08はG3-07 formal resultとは独立したhistorical prospective questionとしてauthorizedされ、LGTGMIV F1-F5 / RAW-only / relative depth 5の正式measurement boundary上でprospectively freezeされた。

Fresh Stage 1はexactly one authorized executionとしてrun `33731577464`で開始した。required bounded RAW reconstructionの途中で`relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e`が発生し、complete 10-trajectory development populationへ到達しなかった。

Canonical Stage 1 resultは`STAGE1-TECHNICAL-INVALID`であり、formal promoted candidate setは空である。

## Program interpretation

このdecisionはlocal geometry persistenceの存在・不存在を判定するscientific resultではない。Stage 1のpartial trajectory outputはtechnical provenanceに限定し、G3-08または後続Studyのpositive/negative scientific evidenceとして再利用しない。

G3-07のformal decisions、G3-06以前のformal decisions、LGTGMIV eligibility、protected depth-10 boundaryを変更しない。

## No-rescue

Stage 1 fresh access後のため、LGPML-STUDY1について以下は禁止する。

- same-evidence rerun
- relay-limit handling変更後の同一seed評価
- seed extension / root replacement
- lag / metric / threshold / endpoint / support gate / formal testの事後変更
- partial trajectoriesからcandidateをpromotionすること
- Stage 2を実行すること

将来relay-limit-safe longitudinal geometry studyを行う場合は、新しいprospective independent Study/versionとして別途authorizationする。

## Main integration boundary

このdecisionはresearch branch上で固定する。mainへの統合はユーザーの明示指示があるまで行わない。
