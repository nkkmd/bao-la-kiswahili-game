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
