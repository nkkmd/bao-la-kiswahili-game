# 有限作業領域・入力取得・外部保存の統合 — 科学未実行

## 今回の範囲

専用1 GiB cgroup内で、224 MiBの有限ext4 imageを作り、既知の固定技術inputをGitHubから初めて取得し、work・終了予約の解放・停止証拠の作成・外部保存・読戻しACKを同じ監督台帳へ接続する。imageを224 MiBとするのは、既存256 MiB上限の中にsidecarと終了予約を残す保守的なfixture条件であり、科学Studyの予算変更ではない。

前版で分離していた容量制限と外部保存の接続を確認する。mounted viewとbacking imageは同じ物理byteなので二重加算せず、sidecarを加える。作業データ・取得input・停止証拠・通信journalはimage内へ置く。通常・ENOSPC・ACK抑止の3 caseを使う。ENOSPCではworkを未完とし、停止診断が保存できたことと区別する。

## 不変の境界

科学source・seed・lease・候補・閉包を生成しない。取得するのは前版で公開した42 byteの固定技術inputだけである。外部保存先はrunId・attempt1・modeで識別した新規技術refとし、旧ref・main・科学registryを変更しない。通信retry・force更新・削除をしない。

GitHubへ保存するのは限定したschemaの停止診断であり、原image全体ではない。外側bootstrap・Actions初回checkout/Node準備/systemd起動・Actions artifact uploadもまだscope外である。従って全工程の成立と科学実行認可はfalseを保持する。初回の技術inputを内部取得できても、科学実行code一式の取得・初期化を監督できた証明にはしない。

## ローカル検査と実OS確認

```bash
node --test test/g5-befcs-integrated.test.cjs
```

payloadの分類・namespace・ENOSPCの未完・ACK抑止後の非再書込み・image/sidecar計数を4検査で確認する。実GitHub/cgroup/imageの統合は専用push・attempt1のActionsで確認し、原artifact取得後に独立検算する。結果を得るまでは実OS合格を先取りしない。

本文・見出しは日本語で、field・ID・path・command・hashは機械定義の例外とする。旧凍結入力・原結果・認可状態を保持し、BEFCS-STUDY1と正式関係は未登録・未実行を維持する。

## 実行と取得後検算の確定

[Actions 38825929386](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38825929386)はhead `88eaf28c7e05c708defe53a6b10babaa57c01eb7`・push・attempt 1で3 caseと原artifact保存が成功した。[固定入力と来歴](CI_RECEIPT.json)、resultsの原ZIPとRESULT、[別経路のremote読取](REMOTE_INDEPENDENT_READ.json)、[独立検算](VERIFICATION.json)を保存した。原ZIPのbytesとSHA-256はGitHub metadataへ一致した。

| case | work | 停止診断の保存 | parent peak |
| --- | --- | --- | ---: |
| 通常 | 1 MiBを完了 | ACK・読戻し一致 | 45,891,584 byte |
| ENOSPC | 181,403,648 byteで未完 | 未完の診断をACK・読戻し一致 | 411,725,824 byte |
| ACK抑止 | 1 MiBを完了 | 未ACK・保存未完を保持 | 46,440,448 byte |

全caseのimageは234,881,024 byteで、sidecarを加えても256 MiB以内だった。作業未完と診断保存の成功を分け、ENOSPCを科学的完了や解へ変換しない。原imageを変更しないe2fsck/debugfs検査で、取得input・停止証拠・通信prefix・remote診断が一致し、検査前後のimage hashも一致した。

```bash
python3 tools/research/g5-befcs-integrated/verify.py
```

検算器は保存済み証拠だけを読み、元の通信・OS work・科学sourceを再実行しない。全G5ローカル技術テストは238件が合格し、先行3経路の独立検算も再確認した。次に残る条件は[完了までの判定表](COMPLETION_GATES.md)を参照する。
