# 実戦的逆転可能性・error-inducing move — `PCEM-STUDY1`

研究題目: **Baoにおける逆転可能性と勝負手の定量化 — opponent-error dependence, reply difficulty, and practical comeback potential の分離・検証**

Working English title: **Practical Comeback / Error-Inducing Move Study 1**

Status: **STUDY 1 COMPLETE**

Study ID: `PCEM-STUDY1`  
Study slug: `practical-comeback-error-inducing-moves`  
研究開始時のremote `main`: `587472b7e1a3f6e390cdfea6ed0d8e0971d5711d`
研究ブランチ: `research/practical-comeback-error-inducing-moves`

## 最終結果

```text
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
Stage 1 candidate audits = 55
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

したがって本Studyは、固定済み設計の下で再現可能なpractical-comeback / error-inducing move classを確立したとは主張しません。

## 何を調べたか

本Studyは、strongest-policyのbest moveとは限らない着手でも、成功する防御を狭いmachine-reference reply setへ集中させることで、事前固定したimperfect-opponent policyに対するbounded-horizon empirical comeback frequencyを高められるかを調べた、事前規定・独立のBao研究です。

本Studyは、完了済みの上流研究を再開・救済・再解釈・再判定していません。

## 必ず区別する概念

本Studyでは、次の概念を分けて扱いました。

1. strongest-policy value / best-response robustness;
2. 固定したimperfect opponent policyの下でのbounded-horizon empirical comeback frequency
3. opponent reply-set narrowness;
4. opponent-error dependence;
5. machine-operational reply difficulty / punishment concentration;
6. root-move optimality gap.

machine-onlyのreply metricは、人間にとっての難しさ、心理、expert recognition、伝統的なBao用語に関する主張ではありません。

## 証拠の要約

```text
generated games = 3072
selected roots = 300 (Namua 150 / Mtaji 150)
exact root-move interventions = 1065
total continuation rows = 18105
candidate definitions audited = 55
promoted candidates = 0
```

canonical Stage 1 workflow `32820391017`は成功し、independent verificationでもsource generation、selection、RAW identity、measurement、discoveryを再現しました。

## 表現を分離する規則

後続工程で正本とするstate identityはRAW-ONLYであり、次のfieldだけを含みます。

`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.

`turn`と`reason`はidentityから除外します。`pending`がないstateはengineへ渡す前にinvalidとします。採用するstateはすべて次を満たさなければなりません。

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

symmetry reduction、seat swap、reflection canonicalization、quotient identity、transform-based deduplicationは承認されていません。

## 文書案内

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — concise final overview.
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — complete final scientific report.
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — authoritative terminal study state.
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — prospective and terminal decisions.
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronological study log.
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — protocol, code, workflow, artifact, hash and verifier index.
- [`protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md`](protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md) — measurement dependency audit.
- [`preregistration/STUDY_START_FIREWALL.md`](preregistration/STUDY_START_FIREWALL.md) — immutable upstream/no-rescue firewall.
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json` — frozen Stage 1 design.
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` — Stage 1 generation authorization.
- `preregistration/STAGE_1_EXECUTION_AMENDMENT_1.json` — pre-outcome execution-only parallelization amendment.
- [`preregistration/STAGE_2_FORMAL_SKELETON.md`](preregistration/STAGE_2_FORMAL_SKELETON.md) — unexecuted Stage 2 skeleton.
- `results/STAGE_1_EXPLORATORY_RESULT.json` — compact canonical Stage 1 result.
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json` — compact independent verification result.
- `results/STAGE_2_NON_AUTHORIZATION.json` — frozen Stage 2 non-authorization.

## main統合に関する境界

研究ブランチは明示的なユーザー指示に基づいて`main`へ統合済みです。この統合は、scientific label、candidate数、Stage 2の未承認状態を変更していません。
