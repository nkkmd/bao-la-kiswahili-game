# State Space / Game Tree Complexity Study 1 — Overview （概要）

**Study ID:** `SSGTC-STUDY1`  
**State:** COMPLETED  
**Formal decision:** `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`  
**Representation:** RAW-ONLY

## What was studied （日本語の要点）

このprospective independent Studyでは、未検証のsymmetry reductionやcanonicalizationを使わず、正式なRAW rule-state identityに基づいて、Baoのreachable-state growth、branching、transposition、bounded game-tree expansionを定量化した。

根拠のないBao全体の局面数を1つ示すことは、意図的に研究課題から外した。exact bounded count、observed / censored row、game-tree path occurrence、unique RAW state、estimateを相互に区別した。

## Raw identity （識別と表現）

```text
include: pits, reserve, houseOwned, player, phase, winner, pending
exclude: turn, reason
seed invariant: sum(pits)+sum(reserve)+sum(pending)=64
```

`pending`の欠落はhard errorとした。seat swap、reflection、compound transform、SIP / ORISC transformation、canonicalization、symmetry quotientは使用していない。

## Formal bounded result （結果）

Stage 2では、standard initial state、RAW-state depth 8 / parent expansion depth 7までのcomplete enumeration、depth 8までのnon-deduplicated game treeを結果確認前に固定した。

```text
reachable raw states through depth 8 = 24,848
transition occurrences from parent depths 0..7 = 25,648
duplicate encounters = 801
multi-parent raw states = 763

game-tree node occurrences through depth 8 = 30,941
game-tree edge occurrences through depth 8 = 30,940

raw-state / tree-node ratio = 0.803076823632074
```

Raw-state growth by minimum depth was:

```text
0: 1
1: 4
2: 14
3: 38
4: 119
5: 384
6: 1,284
7: 4,706
8: 18,298
```

Game-tree node occurrences by depth were:

```text
0: 1
1: 4
2: 14
3: 38
4: 124
5: 405
6: 1,430
7: 5,655
8: 23,270
```

parent depth 0..7で完全に展開したnonterminal RAW stateでは、arithmetic mean branchingが`3.936157151626765`、geometric mean branchingが`3.4331822270441013`、forced single-move proportionが`0.06476365868631062`、capture-forced proportionが`0.8276550030693677`だった。

このdepth-8 domainに含まれる24,848 RAW statesはすべてNamuaだった。これは**このbounded depth内**でMtajiへ到達しなかったことだけを意味し、BaoがMtajiへ到達しないという意味ではない。

## Verification （日本語の要点）

Production and independent implementations agreed exactly on state count, transition count, tree occurrences, and set hashes:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

formal GitHub Actions runは`32805975114`である。independent verifierはproduction serializer / runnerやStage 1 evidenceをimportせず、固定済みgraph / tree domain全体を再列挙した。

## What this does not establish （日本語の要点）

This Study does **not** establish:

- the exact full Bao state-space size;
- the exact full Bao game-tree size;
- a validated full-game growth law or state-space estimator;
- a global transposition ratio;
- a symmetry-reduced count;
- validated canonicalization;
- Bao全体におけるMtajiやcycleの不在

exact claimは固定済みdepth-8 RAW-ONLY domainに限定される。より深いenumeration、full-game estimation、symmetry-reduced countには、新しいprospective Studyまたはversion付きprotocolが必要である。

## Where to read next （今後の課題）

- `STUDY_1_FINAL_REPORT.md` — scientific and technical integrated report
- `results/STAGE_2_FORMAL_RESULT.json` — canonical machine-readable result
- `REPRODUCIBILITY_INDEX.md` — runs, hashes, tooling, and artifact provenance
- `DECISION_REGISTER.md` — no-rescue and claim-boundary decisions
