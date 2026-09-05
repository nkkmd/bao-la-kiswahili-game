# `PBAI-P3-D` — baseline-only support実行認可

日付: 2026-09-05

状態: **`AUTHORIZED / PRE-GENERATION`**

## 1. 認可根拠

`PBAI-P3-C`完了報告後、利用者から次工程を進める明示的な指示がありました。直前に提示した最小作業単位は、凍結済みprotocolによる`PBAI-P3-D` baseline-only support / reachability auditです。このため、認可範囲を同Stageだけに限定します。

```text
authorization scope = PBAI-P3-D only
contract branch head = 59bfd70ccd9cd0733237c7152679e68cdc622af2
baseline = AI-GEN2-BASELINE-2026-09-05-v1
candidate = PBAI-C010-v1
support spec = PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1
support result observed before authorization = false
candidate implementation observed before authorization = false
```

## 2. 認可する作業

- support execution用のexact operational manifestを結果生成前に固定する。
- `public/`外の隔離support harnessと独立verifierを作成する。
- synthetic fixtureでtoolingとfeature-off同値性を事前検査する。
- support seed `44000001..44004096`だけを読み、凍結済みsupport endpointを生成する。
- full trace、compact result、独立検証result、hash、実行環境を保存する。
- support gateを機械的に判定し、status・checkpointを同期する。

## 3. 認可しない作業

- `PBAI-C010-v1`のcandidate sourceまたはfeature flag実装
- candidate feature-on move selection
- D5 reference、TopSet agreement、normalized rank loss等のbenefit benchmark
- game outcome、勝率、局面価値の推定
- development、validation、release holdout seedへのアクセス
- `public/`、公開default、deployment、`main`の変更
- `AI-GEN3`への昇格

SupportがPASSしても`PBAI-P3-E`は自動認可されません。結果を固定して停止し、candidate-specific contract freezeとdevelopment authorizationを別に判断します。
