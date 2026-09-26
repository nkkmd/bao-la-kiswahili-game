# 2026-09-26 — G4-06 main統合 checkpoint

## 統合状態

```text
Agenda = G4-06
Study = LGTGECB-STUDY1
scientific status = COMPLETE
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
pre-main audit = PASS
integration method = fast-forward
main baseline before integration = 6a005d9f84d222126dc41abfe17ad5baa4c96629
integrated research HEAD = 889b3d16f09517e5b8aa6621cfd347d4b8902891
main integration = COMPLETE
public AI change = false
```

## 統合内容

`research/g4-06-geometry-exact-consequence-bridge` は、統合直前に `main` に対して `ahead 43 / behind 0` であり、merge baseは `6a005d9f84d222126dc41abfe17ad5baa4c96629` と一致していた。このため履歴を書き換えず、`main` refを研究branch HEAD `889b3d16f09517e5b8aa6621cfd347d4b8902891` へfast-forwardした。

統合対象はG4-06専用workflow・実験コード・研究文書・RG4 current-facing文書・中央研究索引に限定され、`public/`、公開AI production code、ゲーム機能への変更は含まれない。

## 科学結果

統合によって科学的判断は変更しない。

```text
Stage 0 canonical run = 36211754989 / attempt 1 / success
Stage 0 decision = STAGE0-TECHNICAL-PASS
Stage 1 canonical run = 36214800357 / attempt 1 / success
Stage 1 execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
Stage 1 artifact ID = 10897225431
fixed formal domains = 8 / 8
relations emitted = 12 / 12
all production / independent agreement = true
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
```

## 保護境界

```text
G4-05 candidate rescan = 0
G4-06 post-outcome rerun = false
G3-11 depth-10 rerun = false
G4-10 depth-11 access = 0
whole-Bao generalization = false
public AI change = false
```

## 次のProgram候補

G4-06 main統合後の次のcore candidateは **G4-07 — 多時間尺度geometry memoryと回帰** のauthorization reviewである。

これはG4-07のexecution authorizationではない。G4-02は `CLOSED / NO SCIENTIFIC DECISION` であるため、G4-07 authorization reviewではProgram Planのdependencyをpositive scientific evidenceと機械的に読み替えず、利用可能な上流evidenceを改めて判定する。

## 結論

```text
G4-06 = COMPLETE / MAIN INTEGRATED
G4-07 = NEXT AUTHORIZATION-REVIEW CANDIDATE / NOT AUTHORIZED
G4-10 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
public AI change = false
```
