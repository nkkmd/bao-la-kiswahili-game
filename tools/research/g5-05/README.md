# G5-05の供給・保存・独立検算ツール

core.cjsは全軌跡のsource、全root手の応手種別screen、最後の代表固定、全閉包を実装する。independent-source.cjsはruntime/source生成器/構造判定器を呼ばずにsourceを別経路で再生する。verify.cjsは全記録・全保存辺・解・読取集合を検算する。storage.cjsは読取journalとcheckpoint、run.cjsとlease.cjsは事前結合・Actions限定・一度限りの消費を管理する。

[Study入口](../../../doc/research-generation-5/g5-05/README.md)と[契約](../../../doc/research-generation-5/g5-05/CONTRACT.md)を先に読む。機械的なID・field・状態token・hash・コマンドは保持し、意味を日本語で説明する。技術fixtureテスト以外の新規実行は永続leaseを必要とし、再開・retryを認めない。
