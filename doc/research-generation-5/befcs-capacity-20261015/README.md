# 物理作業領域の上限と停止保存 — 技術fixture

## 目的と境界

先行の[外部保存検証](../befcs-external-20261015/README.md)で残った物理容量の条件を、既知データだけの専用ext4 imageで検証する。新規imageは240 MiBとし、全体256 MiBとの差16 MiBをimage外の保存記録へ残す。image内部にも既存の終了予約16 MiBを作り、容量不足後に停止証拠を書けるか確認する。上限を増やさず、同じ物理byteを含むimageとsidecarを合算する。

通常caseは1 MiBの固定データを書く。容量不足caseは固定byteを反復してENOSPCまで書き、未完・`solution: null`を保持する。その後に終了予約を解放し、fsyncした停止証拠を保存する。親1 GiB・swap無効の専用unit内でmkfs・mount・書込み・unmount・読取検査を実行する。

元imageを変更しないe2fsckの読取検査とdebugfsで停止証拠を別プロセスから読み、image hash・statfs・容量計数・停止理由を記録する。自分が新規作成したimageとmountだけを操作し、既存領域を削除・再利用しない。科学seed・候補・閉包・leaseを生成せず、ネットワークも使用しない。

## まだ成立しない条件

このfixtureの有限image上限は、科学pipeline全体への接続を証明しない。外側bootstrap・Actions初回checkout/Node準備/systemd起動・Actionsへのartifact uploadは依然として計測範囲外である。先行のGitHub外部保存経路も本imageへまだ結合していない。従って全工程の成立と科学実行認可はfalseを維持する。

Actionsでは通常と容量不足の2 caseを実行し、原imageを含むartifactとreceiptを取得する。圧縮後の小ささだけで容量条件を合格させず、原imageの論理sizeと物理割当、sidecarを確認する。結果が得られるまで実OS合格を先取りしない。

## 品質と再開

人間向け本文・見出しは日本語とし、field・path・command・hash・IDは機械定義の例外とする。旧実行器・原証拠・manifest・認可状態を変更しない。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・科学leaseなしである。

## 取得後の確定記録

[Actions 38745436271](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38745436271)はhead `bec5f15efebfac3991e0499108ccafe1008a5eb8`・pull_request・attempt 1で2 caseと原artifact保存が成功した。[来歴・固定入力](CI_RECEIPT.json)、resultsの原ZIPとRESULT、[独立検算](VERIFICATION.json)を保存した。各ZIPのbytesとSHA-256はGitHub metadataに一致した。

通常caseは1,048,576 byteを書込み、parent peak 267,722,752 byteだった。容量不足caseは196,083,712 byteでENOSPCを記録し、parent peak 425,426,944 byteだった。両方ともimageは251,658,240 byteで、imageとsidecarの合計は256 MiB以下だった。容量不足caseは処理未完・`solution: null`のままで、終了予約16 MiBを解放して停止証拠を保存した。

```bash
python3 tools/research/g5-befcs-capacity/verify.py
```

検算器は各原ZIPから原imageを一時領域へ取り出し、hash、e2fsckの読取検査、debugfsによるWORK size・停止証拠・予約file不在、検査前後のimage hash一致を確認する。元OS fixtureの再実行や原imageの修復・変更は行わない。

次はこの有限作業領域と既存の外部保存経路を結合し、初回checkout/実行準備を専用scopeの内側へ移す実行経路を作る。旧workflowの外側処理が自動的に監督済みになったとは解釈しない。科学用のAPI/初期状態/途中closure・microstate証拠、最終仕様・認可・入力hash・専用triggerも引き続き未完である。
