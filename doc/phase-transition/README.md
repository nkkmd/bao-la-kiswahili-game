# 局面相転移点研究

このディレクトリは、[`doc/PHASE_TRANSITION_RESEARCH_PLAN.md`](../PHASE_TRANSITION_RESEARCH_PLAN.md) から始まったBao局面相転移点研究の文書・実験台帳・provenanceを保存します。

## 現在の状態

**Study 1: closed / Stages A–E complete / repository closure complete**

第1研究の題目:

> **Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**

第1研究では、再現可能な戦略的転移phenotypeとして `capture-branch-expansion` を同定しました。固定 `hard / bao` 条件では、depth2でphase2 > legacy、depth3でlegacy > phase2というsearch-profile orderingの逆転がそれぞれformalに確認されています。

ただし、一般的なsearch-profile × depth interactionや、Bao一般に普遍的なphase-transition lawを確認したとは扱いません。

---

## 初めて読む場合

まず次の順で読むことを推奨します。

1. **[`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)**  
   初見向けの成果概要。研究の問い、`capture-branch-expansion`、新規seed再現、depth2/depth3逆転、`sustained-forcing window`、研究の限界を平易にまとめる。
2. **[`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)**  
   科学的な最終統合。実験chronology、formal decisions、Stage B–E、negative result、reproducibilityを含む。
3. **[`STUDY_1_VOCABULARY.md`](STUDY_1_VOCABULARY.md)**  
   classifier、forced-capture regime、trajectory-plyなどの用語・機械定義の正本。

現在地だけを確認する場合は [`CURRENT_STATUS.md`](CURRENT_STATUS.md) を参照してください。

リポジトリ全体の研究成果一覧は [`../RESEARCH_INDEX.md`](../RESEARCH_INDEX.md) にまとめています。

---

## 第1研究の最終formal decisions

| Experiment | Formal decision | 固定範囲 / 理由 |
| --- | --- | --- |
| E-010 | `not-confirmed` | minimum primary candidate 12に対し11 |
| E-011 | `inconclusive` | 複数conditionでavailability不足 |
| E-017 | `not-confirmed` | minimum unique controls 30,000に対し23,306 |
| E-018 / H16 | `confirmed` | fixed `hard / bao / depth2` のphase2 > legacyのみ |
| E-019 / H17 | `not-confirmed` | D3が事前登録方向と逆転しglobal IUT不成立 |
| E-020 / H18 | `confirmed` | fixed `hard / bao / depth3` のlegacy > phase2のみ |

これらのformal decisionは、後続のsecondary / retrospective analysisで置換・救済・反転しません。

---

## 文書の役割

### 成果を読む

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的最終報告
- [`STUDY_1_VOCABULARY.md`](STUDY_1_VOCABULARY.md) — 用語・機械定義
- [`STUDY_1_COMPLETION_PLAN.md`](STUDY_1_COMPLETION_PLAN.md) — Study 1 completion設計

### 現在地・判断履歴を確認する

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在地
- [`HYPOTHESES.md`](HYPOTHESES.md) — hypothesis台帳
- [`EXPERIMENT_INDEX.md`](EXPERIMENT_INDEX.md) — experiment台帳
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — decision台帳
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — append-only研究ログ
- [`checkpoints/`](checkpoints/) — 工程・formal execution・completion checkpoint

### formal execution / archiveを確認する

- [`E011_FORMAL_EXECUTION.md`](E011_FORMAL_EXECUTION.md)
- [`E017_FORMAL_EXECUTION.md`](E017_FORMAL_EXECUTION.md)
- [`E018_FORMAL_EXECUTION.md`](E018_FORMAL_EXECUTION.md)
- [`E019_FORMAL_EXECUTION.md`](E019_FORMAL_EXECUTION.md)
- [`E020_FORMAL_EXECUTION.md`](E020_FORMAL_EXECUTION.md)
- [`FORMAL_EXPORT_INDEX.md`](FORMAL_EXPORT_INDEX.md) — repository外final bundleとSHA-256
- [`FORMAL_EXPORT_STORAGE.md`](FORMAL_EXPORT_STORAGE.md) — archive運用

### 探索段階を確認する

- [`PILOT_V2.md`](PILOT_V2.md) — 開局検証済みpilot-v2
- [`REPORT.md`](REPORT.md) — 初期分析報告
- [`RESULTS.md`](RESULTS.md) — 初期結果

探索段階のNotebookは `notebooks/phase-transition/`、分析・formal experiment toolingは `tools/experiments/` にあります。

---

## データとprovenanceの基本階層

後期Study 1では、独立性を混同しないため次の階層を区別しました。

```text
paired seed
  -> game
    -> forced-capture regime
      -> trajectory / ply
        -> candidate row
```

E-018 / E-019 / E-020のformal search-profile comparisonはpaired game-level endpointを使用します。candidate / regime / trajectory-ply分析はsecondary structural analysisであり、formal paired endpointを置換しません。

---

## Pilot-v2の位置づけ

pilot-v2はStudy 1の探索基盤として重要ですが、現在の研究状態を表す最終成果ではありません。

正式な開局検証済みpilot-v2分析入力:

```text
artifacts/phase-transition/pilot-v2/
```

主な値:

- study version: `0.4.1`
- games: 100
- observations: 5,650
- forced-capture regimes: 421
- Category-A candidate intervals: 15

再生成:

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot-v2
```

検証:

```bash
node tools/experiments/verify-phase-transition-artifacts.js \
  --input artifacts/phase-transition/pilot-v2
```

大規模成果物は原則としてrepositoryへcommitせず、manifest、hash、研究文書、再生成コード、final export indexで追跡します。

---

## 恒久的な研究運用ルール

Study 1 closure後も次を維持します。

- `RESEARCH_LOG.md` はappend-only。
- 過去formal corpusを再生成・上書きしない。
- secondary / retrospective analysisでformal primary decisionを置換しない。
- 新規formal experimentには新規hypothesis / experiment ID / seed block / preregistration / execution policy / explicit authorization / execution lockを要求する。
- GitHub Actionsではformal corpusを生成しない。
- Study 1の未解決mechanismを追究する場合は、Study 1の結論を書き換えず、新しいstudyとして開始する。

---

## 次の研究へ

Study 1から残った主な独立課題には次があります。

- search-tree / PV / cutoff / leaf-evaluation / horizon mechanism
- second independent feature groupのprospective confirmation
- reserve threshold
- nyumba transition
- front-row control
- capture-to-mobility transition
- non-terminal forcing-to-free-choice transition
- formal `namua -> mtaji` とstrategic transitionの時間関係
- multiple transition taxonomy
- broader evaluator / depth / search implementation external validity

これらはStudy 1の未完了項目ではなく、今後の新規研究候補です。
