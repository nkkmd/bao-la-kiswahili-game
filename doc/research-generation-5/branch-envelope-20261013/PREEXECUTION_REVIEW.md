# 実行前レビュー — 設計段階

## 現在の結論

候補選定と資源の提案はレビューできる形に固定したが、実行前レビューは未完である。source generator、independent selector/replay、durable lease、attempt 1固定の別trigger、サイズreserveを含むfixture CIはまだ作成・検証されていない。この提案ファイルをsource/authorization manifestとして使わない。

## source開始を拒否する条件

- `BEFCS-STUDY1`、seed block、branch名前空間の既使用/保護記録が見つかった。
- rule・初期状態・PRNG・第一候補選定・旧/新read firewallのcanonical定義が一致しない。
- selectorが2-ply aggregate reply width、first candidate、old-read exclude/no-fallbackを独立再生できない。
- BFSにguard winner、部分solver、unknownを0/DRAWへする経路がある。
- RAW/metadata/edge/witness/journalの往復・checkpoint・予約域・256 MiB bundleの48 MiB分割上限testに失敗する。
- source manifestまたはfixture CIが最終commitと一致しない。
- seed読取前のGitHub lease、別trigger、attempt 1、常時artifact/repository保存を再現可能に保証できない。

## 次の実装で固定する記録

最終のStage SPEC/AUTHORIZATION/SOURCE_MANIFEST/PREEXECUTION_REVIEWに以下を写し、相互hashを検査する。128 sourceの全体消費を原子的leaseで先に記録し、各seed直前にもdurable consume markerを保存する。source/closureとも状態・停止理由を失わない。run後は第三者から再生できるevidence・CI_RECEIPT・blob/tree/commitを残す。

この段階の fresh scientific seeds consumed は0である。stage ID・seed範囲は提案値のままで、lease未作成・source unfreezed・execution unauthorizedである。
