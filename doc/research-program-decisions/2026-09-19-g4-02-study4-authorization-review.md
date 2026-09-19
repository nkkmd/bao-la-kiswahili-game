# 2026-09-19 — G4-02 Study 4 authorization review

## 判定

**`SFCDFT-STUDY4-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

G4-02 の未解決な科学的問いを、Study 3 を repair / rerun せず、新しい Study identity と fresh namespace を持つ独立した prospective successor study で再検証することを認可する。

ただし本認可の範囲は **preregistration と non-scientific Stage 0 technical validation のみ** とする。Stage 1 / Stage 2 の fresh scientific seed access、formal scientific inference、main integration、public AI change は認可しない。

## 審査識別情報

```text
Review ID = G4-02-SFCDFT4-AUTHORIZATION-REVIEW-2026-09-19-V1
Agenda = Research Generation 4 / G4-02
Successor Study = SFCDFT-STUDY4
Parent closure branch = research/g4-02-sfcdft-study3-prereg
Parent closure HEAD = 91e83b0757c02cd11e2a5f463407a342a91ce3ce
New research branch = research/g4-02-sfcdft-study4-prereg
Baseline main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
Fresh scientific seed reads authorized by this review = 0
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 1. Study 3 closure の扱い

Study 3 Stage 2 canonical run `35427427920` は `classify-final` までは成功したが、mandatory `bundle-source` 工程で失敗し、formal measurement / aggregate は開始されなかった。

正式 closure は次である。

```text
SFCDFT-STUDY3 Stage 2 = TECHNICAL-INVALID
8-cell scientific decision vector = NOT GENERATED
scientific decision = NONE
rerun = NOT AUTHORIZED / NOT PERFORMED
```

したがって Study 3 の失敗は C1 / C6 の科学的反証・不支持・NON-ESTIMABLE を意味しない。Study 4 の科学的設計を Study 3 fresh scientific outcome に合わせて変更してはならない。

## 2. Study 4 を認可する理由

G4-02 の中心課題は未解決であり、Study 3 は formal measurement 前の technical artifact-pipeline failure で停止した。

このため、次の条件を満たす独立 successor study は prospective research として正当化できる。

1. Study 3 を reopen / repair / rerun しない。
2. Study 1–3 の scientific seed namespace を再利用しない。
3. C1 / C6、frozen direction、representation、relative depth、source policies、root families、4 domains、sample target、alpha、inference、resource ceilingsを変更しない。
4. Study 3 fresh evidence を endpoint / domain / threshold / sample target / subgroup selection の調整に利用しない。
5. Study 3 から利用する情報は、source-bundle pipeline に fresh access 前の end-to-end technical validation が必要だったという **technical failure fact** に限定する。

## 3. Study 4 の唯一の substantive technical change

Study 4 では fresh scientific namespace へアクセスする前に、non-scientific synthetic fixture だけを使って次の artifact pipeline を end-to-end で検証する。

```text
synthetic source fixture generation
-> source classification
-> frozen selection representation
-> source bundle construction
-> bundle artifact upload
-> bundle artifact retrieval
-> bundle digest / manifest verification
-> measurement input parse
-> production / independent dry-run exact agreement
-> aggregate schema validation
```

この gate は scientific effect magnitude、effect direction、p-value、generalization / counterexample decision を生成してはならない。

## 4. 科学的 contract の不変条件

Study 4 では次を Study 3 から変更しない。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / NAMUA-GREATER
representation = RAW-ONLY
relative depth = 5
source policies = P1 / P2
root families = RF1 / RF2
four domains = P1/P2 × RF1/RF2
Stage 1 target = 8 compatible pairs/domain
Stage 2 target = 18 selected pairs/domain
formal family = fixed 8 hypotheses
family-wise alpha = 1/20
formal test = exact two-sided sign test
multiplicity = fixed-eight Holm-Bonferroni
resource ceilings = unchanged
```

## 5. Freshness boundary

Study 4 には新しい seed namespace を割り当てるが、本レビューではアクセスしない。

planned namespace:

```text
Stage 1 primary = 40611001..40611384
Stage 1 paired infrastructure reserve = 41611001..41611384
Stage 2 primary = 40621001..40621768
Stage 2 paired infrastructure reserve = 41621001..41621768
Stage 0 non-scientific fixture = 49041001..49041256
```

Study 1 / 2 / 3 の全 scientific seed namespace は禁止する。Study 3 の既存 immutable artifacts から seed-free に materialize 可能な identity については、Study 4 Stage 1 authorization 前に durable firewall 化する。Study 3 scientific seed の再読や source regeneration は行わない。

## 6. Stage authorization boundary

本レビューで認可するもの:

- Study 4 branch creation
- Study 4 protocol / machine-readable preregistration
- non-scientific Stage 0 implementation
- synthetic fixture generation
- end-to-end artifact-pipeline validation
- seed-free static / schema / provenance checks

本レビューで認可しないもの:

- Stage 1 fresh scientific seed access
- Stage 2 fresh scientific seed access
- Study 1 / 2 / 3 scientific population replay
- Study 3 rerun / repair / manual dispatch
- scientific effect / direction / p-value output
- generalization / counterexample decision
- main integration
- public AI change

## 7. Stage 0 PASS の必要条件

Study 4 Stage 0 は少なくとも次を満たさなければならない。

1. synthetic source fixture が deterministic に生成される。
2. classifier と frozen selection representation が deterministic に一致する。
3. `bundle-source` 相当の production path が synthetic fixture で成功する。
4. bundle artifact の upload → retrieval が成功する。
5. retrieved bundle digest と manifest binding が exact に一致する。
6. measurement consumer が retrieved bundle をそのまま parse できる。
7. production / independent dry-run scientific-structure digest が exact 一致する。
8. aggregate consumer が frozen 8-cell schema を受理する。
9. missing / malformed / digest-mismatched bundle は fail-closed する。
10. fresh scientific seed reads = 0。
11. scientific effect / p-value / formal decision output = 0。

Stage 0 PASS は Stage 1 authorization を自動的に意味しない。Stage 1 前に別個の pre-access authorization review を必須とする。

## 8. 正式判定

**`SFCDFT-STUDY4-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

G4-02 は `IN PROGRESS` のままとする。Study 4 の fresh scientific execution はまだ認可しない。