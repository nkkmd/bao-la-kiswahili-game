# E-011実験基盤・E-010 trajectory重複監査 — チェックポイント

日付: 2026-08-01  
状態: `E-011 infrastructure validated / E-010 trajectory audit completed / formal E-011 not-run`

## 1. E-011 実験基盤

### 実装済み

- `config/experiments/phase-transition-robustness-v1.json`
- `tools/experiments/run-phase-transition-robustness.js`
- `tools/experiments/verify-phase-transition-robustness.js`
- `tools/experiments/evaluate-phase-transition-robustness.js`
- `tools/experiments/lib/phase-transition-robustness.js`
- `test/phase-transition-robustness.test.js`
- `.github/workflows/phase-transition-robustness.yml`

multi-condition runnerはC0–C4を同一seed列で生成し、condition別game ID、AI source、config hash、出力先を分離する。validatorはcondition混在、seed、source commit、config hash、開局境界hashを監査する。combined evaluatorは事前登録した条件別・全体判定を適用する。

### 開局境界hashの修正

初回fixtureでは、既存generatorの`openingStateHash`が開局終了後もAI手ごとに上書きされるため、条件間で開局が異なるように見える偽の不一致が発生した。

E-011 runnerでは、`openingPliesApplied - 1`番目のランダム開局手の`afterStateHash`を開局境界hashとして再計算する。これは監査用メタデータの実装修正であり、seed、開局手、AI条件、候補検出、成功条件は変更していない。

### fixture監査

- validated commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
- Actions run: `30641768496`
- artifact: `phase-transition-robustness-fixture`
- artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`
- fixture: 5条件 × 2局

通過項目:

- 全5条件が存在
- condition config hashが全条件で一意
- source commitが全条件で一致
- 同一game indexの開局境界hashが全条件で一致
- game、observation、AI sourceのcondition IDが混在しない

正式な400局×5条件は未実施である。事前登録どおり固定ローカル環境でのみ実行する。

## 2. E-010 trajectory重複監査

### 目的

E-010の候補行を独立な構造例として数えられるか確認するため、確認成果物の`games.json`にある`trajectoryHash`を候補・対照表へ結合し、`trajectoryHash + candidatePly`で重複除去した事後感度分析を行った。

この監査はE-010の事前登録判定を置き換えない。

### 元データ

- source Actions run: `30630007008`
- source artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`
- primary population: `distanceToTerminal >= 9`

### 結果

| 指標 | 生の事前登録単位 | trajectory+ply重複除去後 |
|---|---:|---:|
| 主解析候補 | 11 | 5 |
| 急拡大候補 | 7 | 2 |
| 主解析対照 | 8424 | 7061 |
| 急拡大対照 | 249 | 218 |
| 候補急拡大率 | 63.64% | 40.00% |
| 対照急拡大率 | 2.96% | 3.09% |
| リスク比 | 21.53 | 12.96 |

候補11件は5つの`trajectoryHash + candidatePly`、4つのtrajectory、5つのアーキタイプへ集約された。急拡大7件は2つのtrajectory-ply、2つのtrajectory、2つのアーキタイプへ集約された。

最大の重複群は6件で、次が完全に一致した。

- archetype: `9f778d512ae1`
- candidate ply: `7`
- phase: `namua`
- stateHash: `4328ee11314e976186821b06a296994f0a702b9cf5f6953ce76863aba2f98521`
- trajectoryHash: `fe3c176c6580e109a7bed260161b3189ea76aad51acd176992ab17f8fde387dd`

もう1つの急拡大アーキタイプは`cfdb2c4de1a2`で1件だった。

### 解釈

- E-010の正式判定は引き続き`not-confirmed`であり、変更しない。
- trajectory-ply重複除去後も候補側濃縮は残るが、構造的に独立した急拡大例は2件しかない。
- 生のRR 21.53をそのまま一般的構造の再現性と解釈してはならない。
- E-011では元の事前登録判定を維持したうえで、trajectory-ply重複除去後のRR、固有trajectory数、固有アーキタイプ数を必須副次出力とする。

### 再現コード

- `tools/experiments/analyze-confirmation-trajectory-duplication.js`
- `test/phase-transition-confirmation-trajectory-duplication.test.js`
- `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`

## 3. 確認群の捕獲分岐形成過程

確認群7急拡大候補へ既存の8ply形成過程解析を適用し、さらにtrajectory-ply重複除去後の平均を併記するコードとCI工程を追加した。

- `tools/experiments/summarize-confirmation-capture-branch-formation.js`
- `test/phase-transition-confirmation-capture-formation-sensitivity.test.js`

数値結果は再生成CI未完了のため、このチェックポイントでは確定しない。E-010の正式判定およびE-011の主判定条件には使用しない。

## 4. 次工程

1. 確認群7急拡大候補の形成過程CIを完了し、生の7件平均と2 trajectory-ply平均を確定する。
2. 固定ローカル環境のruntime・hardware・source commitを固定する。
3. E-011を`C0 → C1 → C2 → C3 → C4`の順で各400局実行する。
4. 条件別候補・対照分析、trajectory重複感度分析、事前登録判定を適用する。
5. 独立追加seed確認実験の必要サンプル数は、候補行数だけでなく固有trajectory発生率も併記して別登録する。
