# AI-GEN4先攻・後攻差追加研究 — 自動集計

この集計は固定した序盤分布とAI条件に対する自己対局結果であり、Baoの理論的な必勝・均衡の証明ではありません。
打切り、循環、連続種まき上限、固定深度未達は未決着です。区間には、未決着をすべて先攻負け・すべて先攻勝ちとした不確実性を含めます。
座席交換対局は一組、重複開局は一クラスタとして扱います。主試験expertの2領域には97.5%区間、それ以外には探索的95%区間を示します。

|段階・条件|開局スロット|異なる開局局面|先攻勝|後攻勝|未決着|決着局先攻勝率|保守的区間|判断|
|---|---:|---:|---:|---:|---:|---:|---|---|
|pilot / uniform-8-G4D4|64|64|72|56|0|56.25%|43.75%〜68.75%|INCONCLUSIVE|
|pilot / uniform-8-G4D6|8|8|6|10|0|37.50%|12.50%〜75.00%|NON-ESTIMABLE-LOW-DIVERSITY|
|pilot / uniform-8-G4E2000|8|8|2|14|0|12.50%|0.00%〜37.50%|NON-ESTIMABLE-LOW-DIVERSITY|
|pilot / uniform-8-G3D4|8|8|12|4|0|75.00%|37.50%〜100.00%|NON-ESTIMABLE-LOW-DIVERSITY|
|pilot / top3-8-G4D4|64|63|74|54|0|57.81%|45.31%〜69.84%|INCONCLUSIVE|
|pilot / top3-8-G4D6|8|8|8|8|0|50.00%|12.50%〜87.50%|NON-ESTIMABLE-LOW-DIVERSITY|
|pilot / top3-8-G4E2000|8|8|8|8|0|50.00%|12.50%〜87.50%|NON-ESTIMABLE-LOW-DIVERSITY|
|pilot / top3-8-G3D4|8|8|10|6|0|62.50%|25.00%〜87.50%|NON-ESTIMABLE-LOW-DIVERSITY|
|formal / uniform-8-G4D4|1024|859|974|1074|0|47.56%|43.81%〜51.26%|INCONCLUSIVE|
|formal / uniform-8-G4D6|1024|859|1102|946|0|53.81%|50.20%〜57.58%|FIRST-ADVANTAGE-WITHIN-DOMAIN|
|formal / uniform-8-G4E2000|1024|859|1089|959|0|53.17%|49.21%〜57.11%|INCONCLUSIVE|
|formal / uniform-8-G3D4|1024|859|1012|1036|0|49.41%|45.80%〜53.09%|INCONCLUSIVE|
|formal / top3-8-G4D4|1024|631|1036|1012|0|50.59%|45.86%〜55.36%|INCONCLUSIVE|
|formal / top3-8-G4D6|1024|631|1144|904|0|55.86%|51.07%〜60.51%|FIRST-ADVANTAGE-WITHIN-DOMAIN|
|formal / top3-8-G4E2000|1024|631|1165|883|0|56.88%|52.31%〜61.51%|FIRST-ADVANTAGE-WITHIN-DOMAIN|
|formal / top3-8-G3D4|1024|631|1082|966|0|52.83%|48.11%〜57.48%|INCONCLUSIVE|
|sensitivity / uniform-4-G4D4|128|69|120|136|0|46.88%|32.28%〜63.57%|INCONCLUSIVE|
|sensitivity / uniform-12-G4D4|128|128|124|132|0|48.44%|39.06%〜57.03%|INCONCLUSIVE|
|sensitivity / top3-4-G4D4|128|38|106|150|0|41.41%|25.00%〜60.00%|INCONCLUSIVE|
|sensitivity / top3-12-G4D4|128|126|154|102|0|60.16%|51.56%〜68.75%|FIRST-ADVANTAGE-WITHIN-DOMAIN|

判断トークンは機械定義です。FIRST / SECONDは当該領域内の先攻 / 後攻方向、WITHIN-PRACTICAL-MARGINは±3ポイント内、INCONCLUSIVEは不確実、NON-ESTIMABLE-LOW-DIVERSITYは異なる開局系列が30未満で推定を確定しない状態です。
予備試験の数値は正式な結論に使いません。条件差は完全な対応対局だけの探索的解析で、未決着除外の影響を受けます。
