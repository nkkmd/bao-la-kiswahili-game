# 2026-09-20 — G4-02 main integration complete

## Decision

ユーザーの明示指示に基づき、Research Generation 4 / G4-02 の完了済み研究成果を `main` へ統合した。

```text
Agenda = G4-02
scientific state = CLOSED / NO SCIENTIFIC DECISION
final formal Stage2 status = TECHNICAL-INVALID
scientific transfer decision = NONE
source branch = research/g4-02-sfcdft-study4-prereg
source head = 3316f254c115e57e0ec557e2b33a57be90b3e173
integration PR = #154
merge commit = 8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd
main integration = COMPLETE
public AI change = false
```

## Pre-integration validation

最終文書整合性監査は source head `3316f254c115e57e0ec557e2b33a57be90b3e173` で実行し、GitHub Actions run `35455227641` が `SUCCESS` となった。

監査対象には、machine-readable closure JSON、live-state status marker、古い進行状態表記の排除、主要Markdownリンクが含まれる。

## Scientific boundary

この統合は repository state の統合であり、G4-02 の科学的裁定を変更しない。

- `TECHNICAL-INVALID` を negative scientific evidence として再解釈しない。
- `GENERALIZES-WITHIN-FROZEN-DOMAIN`、`COUNTEREXAMPLE-BOUNDARY-DETECTED`、`NOT-CONFIRMED`、`NON-ESTIMABLE` は割り当てない。
- Study 1〜4 の scientific execution を rerun / repair / reopen しない。
- closed scientific seed を救済目的で再読しない。
- G4-10 depth 11 へ未承認アクセスしない。
- G4-02 の結果を public AI へ自動反映しない。

## Verification

PR #154 は merged 状態であり、`main` は source head `3316f254c115e57e0ec557e2b33a57be90b3e173` を完全に包含する。merge commit は `8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd` である。
