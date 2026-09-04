# 状態空間・ゲーム木のbounded exact解析 — `SSGTC-STUDY1`

**Study ID:** `SSGTC-STUDY1`  
**Status:** COMPLETED  
**Formal decision:** `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`  
**Representation:** RAW-ONLY

## 何を調べたか

本Studyは、authoritative raw rule-state identityを用いて、Baoのreachable-state growth、branching structure、transposition、bounded game-tree expansionを測定した、事前規定・独立研究です。exact bounded enumerationを、observed / censored count、game-tree path occurrence、trajectory、estimateから明確に分離しました。

完了済みのBao研究を再開・救済・再分類・修正したものではありません。

## 研究開始時の基準

```text
remote main = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
study branch = research/state-space-game-tree-complexity
study ID = SSGTC-STUDY1
```

## 表現を分離する規則

authoritative raw-state identityに含めるfieldは、次の7項目だけです。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

次のfieldは除外します。

```text
turn
reason
```

`pending`は必須です。欠けているstateはengineへ渡す前にrejectします。採用するraw stateはすべて次を満たします。

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

Study 1ではsymmetry、seat swap、reflection、compound transformation、canonicalization、quotient reductionを使用していません。

## 各Stageの流れ

1. **Stage 0 — technical representation/enumeration validation:** `SSGTC-STAGE0-PASS`; diagnostic-only.
2. **Stage 1 — exploratory growthの特徴づけ:** `EXPLORATORY-ONLY`として採用。graph resource capへ到達したためpartial depth-9 rowをcensorしたが、Stage 2 feasibility minimumは通過
3. **Stage 2 — 事前規定したformal bounded quantification:** fresh evidenceを使用し、Stage 1 rowを再利用せず、完全なindependent re-enumerationによってformal targetをexactに完了

## 固定範囲における正式結果

```text
reachable raw states through depth 8 = 24,848
transition occurrences from parent depths 0..7 = 25,648
duplicate encounters = 801
multi-parent raw states = 763

game-tree nodes through depth 8 = 30,941
game-tree edges through depth 8 = 30,940
raw-state / tree-node ratio = 0.803076823632074
```

set identityは次のとおりです。

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

これらは、固定済みstandard-root depth-8 RAW-ONLY domainの内部に限るexact resultです。Bao全体のstate-space countまたはfull game-tree countではありません。

## 主要文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — first-read result summary
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — scientific and technical integrated report
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closed status and current claim boundary
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — frozen decisions and no-rescue record
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronology, including technical-invalid attempts
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — tooling, workflow, artifact and hash index
- `results/STAGE_0_TECHNICAL_RESULT.json` — technical-only Stage 0 record
- `results/STAGE_1_EXPLORATORY_RESULT.json` — accepted exploratory-only record
- `results/STAGE_2_FORMAL_RESULT.json` — canonical formal result
- [`preregistration/STUDY_START_FIREWALL.md`](preregistration/STUDY_START_FIREWALL.md)
- [`preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`](preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md)
- [`preregistration/STAGE_1_EXPLORATORY_DESIGN.md`](preregistration/STAGE_1_EXPLORATORY_DESIGN.md)
- [`preregistration/STAGE_2_PROSPECTIVE_FIREWALL.md`](preregistration/STAGE_2_PROSPECTIVE_FIREWALL.md)
- `preregistration/STAGE_2_FORMAL_SPEC.json`

## 解釈上の境界

Study 1から、次の推論・処理は承認されません。

- `Bao state space = 24,848`;
- exactなfull-game state-space / game-tree count
- full-game estimatorまたは外挿したgrowth law
- symmetry-reduced state count
- validated canonicalization
- 上流のRestricted Endgame、Symmetry、ORISCの判断変更

より深い探索、full-game、symmetry-reduced countを扱う場合は、新しいprospective Studyまたは明示的にversionedされたprotocolが必要です。

Study 1は、repository-wide documentation・CI監査と明示的なユーザー承認を経て`main`へ統合済みです。この統合はformal bounded resultと解釈境界を変更していません。
