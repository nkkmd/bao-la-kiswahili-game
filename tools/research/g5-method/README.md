# 科学用遷移と解析方式の技術ツール

object-engine/ring-engineは別の科学用遷移実装で、runtime guardによる勝者を返さず自然停止/完全反復/管理上限を区別する。microstate-checkは完全反復の証明endpointを検算する。certificates/independent-certificatesは抽象有限戦略証明の独立二検算器で、Bao合法手・到達性のoracleではない。

raw-codec/independent-raw-codecはRAWの独立可逆保存器で、codec-runは先行技術境界の往復を確認する。reason/turnを省いたRAW payloadであり、完全な遷移記録の付帯metadataは別に保存する必要がある。範囲外を切り詰めたり、状態を対称性で同一視したりしない。

[契約と結果の入口](../../../doc/research-generation-5/method-review-20261013/README.md)を先に読む。run/codec-runの `--check` は固定技術fixtureと保存結果の再生で、新しい科学sourceを生成しない。JSON field・ID・hash・コマンド・exact outputは機械定義として保持する。
