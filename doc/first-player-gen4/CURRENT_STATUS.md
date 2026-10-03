# 追加研究の現在状態

更新日: 2026-10-03  
研究ID: `FPA-GEN4-STUDY1-20261003-v1`  
状態: **GitHub Actions実行中。技術検証合格、標準初期局面を診断中。**

予備試験・本試験・開局長感度分析の科学的結論は未生成です。技術テスト4件は合格しています。17,768対局を予定し、正式試験の16,384対局は別seedで実施します。

結果確認後の条件変更は行いません。進捗はworkflowのjobと保存artifactで確認し、[再現・再開手順](REPRODUCIBILITY_INDEX.md)に従って引き継ぎます。

## 実行記録

- 科学ソースcommit: `542439d33b80275550f07a8ed04295e51fd545e1`
- 保存PR: [#178](https://github.com/nkkmd/bao-la-kiswahili-game/pull/178)（draft）
- 正式workflow run: [37121863392 / attempt 1](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37121863392)
- workflow名: **AI-GEN4 先攻後攻差追加研究**

Actions側の保存点・座席交換テストも合格しました。標準初期局面診断の後、予備試験352局を再生・別言語検算し、通過した場合に本試験を自動開始します。終了後の集計・検算jobまで登録済みです。
