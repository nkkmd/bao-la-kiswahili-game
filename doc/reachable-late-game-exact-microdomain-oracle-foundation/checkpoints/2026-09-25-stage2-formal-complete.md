# 2026-09-25 — RLEMOF-STUDY1 Stage 2 formal complete

## 状態

**`FORMAL-COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`**

```text
run = 36120286922 / attempt 1 / success
head SHA = 72e45631112359346a83f9399be32ee3e6420ccb
artifact ID = 10858056244
artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
fresh holdout = 40523001..40524024 / 1024 games / maxPly 320
Stage 1 identity firewall roots = 8307
overlap excluded count = 0
eligible candidates = 21
inspected candidates = 10
complete formal domains = 8
incomplete inspected candidates = 2 / STATE-LIMIT
production / independent agreement = true
```

frozen minimum gateは6 complete domains、targetは8。candidate orderの先頭から10件を調べ、candidate 1と4を`STATE-LIMIT`のままfail-closedし、8 complete domainsへ到達した。cap増加、root replacement、seed extension、same-evidence rerunは行っていない。

`RECURRENT`はexact graph vocabularyであり`DRAW`を意味しない。今回の8 formal domainsではrecurrent countは0だが、draw inference、whole-Bao generalization、public AI変更は認可しない。

G4-05 scientific executionはここで終了する。追加runを行わない。`main`統合は別途明示指示が必要。
