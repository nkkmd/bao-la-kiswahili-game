# PBAI-P4 — CIの実行範囲監査

## 変更理由

engine.js／ai.jsを変更するPRから、過去研究の正式実行または過去のsource認可をそのまま現行sourceへ適用するCIが発火する状態だった。本件は独立した工学検証であり、過去研究の再実行や認可条件の書換えを目的としない。

次の4 workflowについて、pull_request.pathsからpublic全般の入口とworkflow自身の入口だけを外した。過去のsource hash、固定仕様、正式結果、seed、実行コマンド、判断条件、push先、手動実行の定義は変更していない。各研究の専用source／契約を変更した場合のPR検証は残す。変更前workflowは開始baselineのGit履歴から復元できる。

| workflow | 対象外PRで避ける実行 |
| --- | --- |
| ssgtc-stage1-exploratory.yml | 過去のStage 1全展開の再実行 |
| ssgtc-stage2-formal.yml | 過去のStage 2正式列挙の再実行 |
| g2-02-search-reliability-stage0.yml | 過去の認可hashを変更後sourceへ適用する検証 |
| critical-positions-stage1-contract.yml | 過去のsource-bound認可の現行sourceへの適用 |

これらの既存認可を本候補用に更新していない。公開sourceを変える将来のPRは、その変更に適した現在の回帰検証を追加する必要がある。

## 本候補の検証

pbai-p4-verification.ymlを追加し、既存engine・AI・search・戦術・Worker・UI回帰、新規の軽量経路回帰、保存済み観測のhash監査、独立した既知系列の再構成と集計検算を実行する。速度や対局の測定をCIでやり直さず、過去研究のholdoutを使わない。

既存の非正式fixture／回帰testを行うCIは維持する。そこで既知データを再生しても、本Programの新規棋力証拠として数えない。
