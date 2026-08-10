# Stage 6 Study 1 Formal Archive Schema Audit Runbook

更新日: 2026-08-10  
Status: **ready for local read-only execution**

## Purpose

Stage 6 cross-study relationを開始する前に、closed Study 1のformal archivesについて、association値を計算せずに入力schemaだけを確認する。

この工程はsecondary / hypothesis-generation preparationであり、formal experimentではない。

## Fixed archive scope

今回のbridge本体で使用候補とするのは以下だけ。

```text
E-018: fixed hard / bao / depth2
       P2, LG

E-019: fixed hard / bao / depth3 stratum only
       D3-P2, D3-LG

E-020: fixed hard / bao / depth3 replication
       P2, LG
```

E-019 D1 / V2はarchiveには存在するが、今回のD2/D3 cross-study bridge本体へは入れない。

## Fixed archive hashes

```text
E-018 bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5
E-019 6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75
E-020 37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2
```

## What the schema audit may report

- exact candidate-metrics member path
- candidate CSV header names
- one archived game JSON's key/type structure
- move / observation key availability
- whether deterministic board replay is structurally feasible
- archive SHA-256 identity

## What it may NOT report

- candidate counts
- expansion rates
- position-type frequencies
- N-ACT / N-CON values
- MTAJI-M1 / MTAJI-M2 association values
- search-profile relation values
- outcome associations
- any new formal decision

The audit must not extract archives to a working directory. It reads members directly through `tarfile`.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile \
  tools/experiments/inspect-position-typology-stage6-study1-archive-schemas.py

python tools/experiments/inspect-position-typology-stage6-study1-archive-schemas.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-schema-audit.json
```

Share only that JSON.

## Decision after schema audit

If the archived schema provides:

1. candidate `gameId`,
2. candidate/event ply,
3. fixed phenotype classification,
4. archived game moves,
5. archived observation `stateHash` / phase,

then candidate-board states can be reconstructed from the archived move sequence without new game generation.

Only after this schema feasibility is confirmed will the exact cross-study relation protocol be frozen.

## Research boundary

- Study 1 archives remain read-only.
- Study 1 formal decisions remain unchanged.
- Stage 5 `not-confirmed` remains unchanged.
- No same-data rescue of STYLE-C1..C4 is permitted.
- AI implementation labels remain metadata only.
- Position type and playing style remain separate concepts.
