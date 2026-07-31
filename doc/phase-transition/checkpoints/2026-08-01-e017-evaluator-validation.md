# E-017 独立構造確認evaluator — 検証チェックポイント

日付: 2026-08-01  
analysisVersion: `15-independent-structural-confirmation`  
Status: Evaluator validated / Formal corpus not run

## 検証対象

- `config/experiments/phase-transition-independent-confirmation-v2.json`
- `tools/experiments/evaluate-phase-transition-independent-confirmation.js`
- `test/phase-transition-independent-confirmation.test.js`
- `.github/workflows/phase-transition-independent-confirmation.yml`

## 固定した判定契約

### Corpus integrity

次をすべて要求する。

- manifestの完了局数と設定局数が事前登録の1000局と一致
- base seedとprofileが一致
- AI level、evaluation profile、search profile、maxDepthが一致
- `games.json`が1000件
- seedが`20263001–20264000`の連続列と完全一致
- game IDが一意
- 全gameに`trajectoryHash`が存在
- game側config hashが存在する場合はmanifest config hashと一致

Corpus integrityが失敗した場合は`inconclusive`とする。

### Structural endpoint

`trajectoryHash + eventPly`でcandidate/controlを重複除去し、次をすべて要求する。

- 生の主解析候補行30件以上
- 固有candidate trajectory-ply 15件以上
- 固有candidate trajectory 12件以上
- 固有expansion trajectory-ply 5件以上
- 固有expansion trajectory 5件以上
- 固有control trajectory-ply 30000件以上
- 重複除去後リスク比3以上
- 重複除去後候補率が対照率を上回る

Corpusが有効で一つ以上のendpoint条件が失敗した場合は`not-confirmed`、全条件通過のみ`confirmed`とする。

## 回帰fixture

回帰テストでは次を確認した。

- 固有trajectory-ply重複除去
- 固有trajectory数の計数
- 重複除去後RRの算出
- 全条件通過時の`confirmed`
- 構造availability不足時の`not-confirmed`
- manifest完了局数不一致時の`inconclusive`

## GitHub Actions結果

- validated commit: `9190998507e144d239adb55cadc3f61860a005be`
- workflow: `Phase Transition Independent Confirmation`
- Actions run: `30646973255`
- job: `evaluator`
- result: `success`

成功したstep:

- checkout
- Node.js 24 setup
- `node test/phase-transition-independent-confirmation.test.js`

## 影響

- E-017の事前登録条件は変更していない。
- E-010の正式判定`not-confirmed`は変更していない。
- E-011の条件・判定規則は変更していない。
- E-017正式1000局corpusは生成していない。
- E-017正式実行には引き続き別の明示的開始承認を要求する。

## 次工程

1. E-017固定ローカル実行policy、execution lock、corpus integrity runnerを正式開始承認前に実装する。
2. E-011 formal execution guardのGitHub Actions検証を完了する。
3. 明示的承認なしにE-011またはE-017の正式corpusを生成しない。
