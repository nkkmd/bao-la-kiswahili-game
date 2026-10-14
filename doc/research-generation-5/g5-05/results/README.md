# G5-05 — 保存結果の入口

新規64 sourceと固定8候補の一度限り実行結果を保存した。RESULTは実行完了、VERIFICATIONは独立検算合格を示すが、完全閉包は0件である。原記録は5cfe0f00629f65995a2d6be5889cebbe68bb8940のmirrorで保持する。CHECKPOINTやDOMAIN_IN_PROGRESSの名称を現在も実行中であるという意味に読み替えない。

DESCRIPTIONは事後の保存記述で、解・遷移・候補を追加していない。CI_RECEIPTとDESCRIPTION_MANIFEST/BINDINGから来歴・hashを辿れる。[報告](../REPORT.md)で6状態上限・2guard・勝敗価値差未確定を説明する。結果の上書き、候補追加、retryは認めない。
