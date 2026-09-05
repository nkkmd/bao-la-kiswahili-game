# `PBAI-P3` — 再開位置

更新日: 2026-09-05

状態: **`INITIALIZED / PRE-CANDIDATE / KEEP-AI-GEN2`**

## 1. 最初に読む

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)
3. [`GENERATION_3_EVIDENCE_AUDIT.md`](GENERATION_3_EVIDENCE_AUDIT.md)
4. [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)
5. [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
6. [`checkpoints/2026-09-05-program-initialization-freeze.md`](checkpoints/2026-09-05-program-initialization-freeze.md)

## 2. 固定済み状態

```text
Program = PBAI-P3
formal title = Generation-3 Evidence-Informed Public Bao AI Improvement Program 3
scientific evidence cutoff = 479bc3d3a9b6c745e37a88529732180e8690d6b3
initialization main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
baseline = AI-GEN2-BASELINE-2026-09-05-v1
PBAI-P3-A = COMPLETE
PBAI-P3-B = COMPLETE
PBAI-P3-C and later = NOT-AUTHORIZED / NOT-EXECUTED
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

## 3. まだ存在しないもの

```text
candidate inventory = NONE / NOT FROZEN
candidate IDs = NONE
global gate spec = NONE
support / reachability contract = NONE
development split = NONE
validation split = NONE
release holdout split = NONE
candidate source = NONE
benchmark result = NONE
```

未実行をnegative resultとして解釈しません。

## 4. 次の認可判断

次の作業候補は`PBAI-P3-C`の事前固定です。明示的な指示があった場合だけ、initial candidate inventory、fresh split、prospective global gate、support / reachability audit protocolを作成します。

この次の作業でもcandidate implementation、support measurement、benchmark execution、validation、release holdout、公開変更、`main`統合は行いません。

## 5. 変更禁止事項

- Research Generation 3のformal conclusionを変更しない。
- PBAI-P1 / PBAI-P2または`PBAI-C001..C009`を再開しない。
- `G3-12`を一般化根拠にしない。
- higher-resource searchをground truthとしない。
- engine scoreをBao勝率としない。
- 未検証のsymmetry / canonicalizationを使用しない。
- outcome依存のthreshold、endpoint、seed、subgroup変更をしない。
- 正式採用・公開配備前に`AI-GEN3`と呼ばない。
