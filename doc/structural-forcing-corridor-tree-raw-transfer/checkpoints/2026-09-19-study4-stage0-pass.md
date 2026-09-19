# SFCDFT-STUDY4 — Stage 0 technical gate PASS

日付: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
Study: `SFCDFT-STUDY4`  
Stage: `SFCDFT4-S0-E2E-TECHNICAL-2026-09-19-v1`  
Evidence class: `TECHNICAL-FIXTURE-E2E`  
正式判定: **`STAGE0-PASS`**

## 1. 実行 provenance

Canonical GitHub Actions run:

```text
workflow = SFCDFT4 Stage 0 end-to-end technical validation
run ID = 35435952961
run attempt = 1
event = push
execution SHA = 9eca4c249566a2c068083ba334fd47ca8d7aed4c
branch = research/g4-02-sfcdft-study4-prereg
overall conclusion = success
```

Jobs:

```text
gate = success / job 105878510109
build-bundle = success / job 105878528981
verify-roundtrip = success / job 105878555201
```

`gate` は workflow rerun attempt を拒否し、Stage 0 execution authorization の初回作成と frozen authorization / pre-execution binding を検証した。

`build-bundle` は synthetic production-equivalent source bundle を構築し、scientific namespace marker が存在しないことを確認したうえで GitHub Actions artifact として upload した。

`verify-roundtrip` は別 job から当該 artifact を download し、bundle / consumer / exactness / negative fixture / final result boundary を検証した。

## 2. Artifact provenance

Source bundle artifact:

```text
artifact ID = 10582054771
name = sfcdft4-s0-source-bundle-35435952961
artifact digest = sha256:c171dcfc78320be4ce51cd93afdf95cf76f5cdc735a7c099c27ac542feccf8e5
bundle core SHA-256 = ee402806f362ecb483f04353632d2e829ee13175bcab91b8b4038a091a3df01f
```

Final result artifact:

```text
artifact ID = 10582298316
name = sfcdft4-s0-final-result-35435952961
artifact digest = sha256:292ff27460f3c14f02f22c723245c06af408376475d71dfcf89230d74d48ba5a
result deterministic core SHA-256 = ebcffb9ab33acbafa6f5344740f0cc93d12fbd330911a2f96cac76b6c66d2133
aggregate structure SHA-256 = 35990d0c17dfac95c3c943903d83f9a74f1e0ef09d973c78b306d1990825ce3d
```

Repository copy of the canonical technical result:

- `results/stage-0-study4/STUDY_4_STAGE_0_TECHNICAL_RESULT.json`

## 3. Mandatory gates

すべて PASS:

- deterministic synthetic source fixture
- deterministic source classification
- deterministic frozen selection representation
- production-equivalent source bundle construction
- Actions artifact upload / retrieval round-trip
- retrieved bundle digest / manifest exactness
- measurement consumer parse
- production / independent dry-run exact agreement
- fixed-eight aggregate schema validation
- negative fixtures fail-closed

Negative fixtures:

- missing bundle
- malformed JSON
- schema-version mismatch
- missing selected pair
- duplicate pair identity
- bundle digest mismatch
- manifest/content mismatch
- wrong Study / Stage identity
- scientific-seed-marker contamination

## 4. Scientific boundary

Stage 0 は scientific evidence ではない。

```text
fresh scientific seed reads = 0
scientific outputs generated = 0
effect magnitude generated = false
effect direction generated = false
p-value generated = false
generalization decision generated = false
counterexample decision generated = false
```

したがって本 PASS から C1 / C6 の科学的方向、effect、generalization / counterexample のいずれも推論しない。

## 5. Authorization consequence

Stage 0 PASS は **Stage 1 の自動認可ではない**。

```text
automatic Stage 1 authorization = false
Stage 1 fresh scientific access authorized = false
Stage 2 fresh scientific access authorized = false
main integration authorized = false
public AI change authorized = false
```

次の mandatory gate は、Study 3 の既存 immutable artifacts から seed-free に materialize 可能な durable identity firewall を完成・検証し、その後に独立した Stage 1 pre-access authorization review を行うことである。

Stage 1 scientific seed namespace `40611001..40611384` / reserve `41611001..41611384` は、この checkpoint 時点で未読のまま保持する。

## 6. 判定

**`SFCDFT-STUDY4 STAGE 0 = PASS / TECHNICAL PIPELINE VALIDATED / NO FRESH SCIENTIFIC ACCESS`**

G4-02 全体は引き続き `IN PROGRESS`。`main` 統合および public AI 変更は行わない。
