# G5-01 — 独立ルール遷移の技術検証

作成日: 2026-10-12（日本時間）  
Stage: `RRSVL-S0T-TRANSITION-2026-10-12-v1`  
状態: **固定40局面・416状態・411遷移で独立一致し、技術検証合格。**

工程2の前半として、現行takasiaルールの合法手生成と盤面遷移を別実装で照合する。前のStage 0は探索アルゴリズムだけが独立していたが、今回は遷移アルゴリズムも独立させる。

productionは基準mainの `public/engine.js` をbyte単位で固定したコピー、独立実装は前列0〜7・逆順後列8〜15の環状配列と算術移動を使う。独立実装は公開エンジン、既存oracle、旧研究の合法手生成を呼び出さない。

技術対象は既知・構成fixture40局面と、そこから相対深さ2までの全合法遷移である。正式な新規局面群を生成したり、Bao全状態の正しさを証明したりする工程ではない。

## 正本

- [技術契約](TECHNICAL_CONTRACT.md)
- [機械用契約](SPEC.json)・[ソース固定](SOURCE_MANIFEST.json)・[実行範囲](AUTHORIZATION.json)
- [次の開発工程の設計](../DEVELOPMENT_PLAN.md)
- [現在の状態](../../CURRENT_STATUS.md)

## 技術検証の結果

[検証報告](REPORT.md)に結果、独立性の範囲、安全上限と次工程を記録する。ローカルとGitHub Actionsのcore hashが一致した。
