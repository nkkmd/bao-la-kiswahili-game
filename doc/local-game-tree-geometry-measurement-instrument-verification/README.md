# 局所ゲーム木幾何の測定instrument検証 — `LGTGMIV-STUDY1`

## 結論

`LGTGMIV-STUDY1`は、G3-01の後、G3-02の実行承認前に行った、新規・事前規定・独立の前提Studyです。Studyは完了しています。

正式英語題目:

**Local Game-Tree Geometry Measurement Instrument Verification Study 1**

正式日本語題目:

**Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**

正式判断:

**`FORMAL-ELIGIBLE-ALL`**

結果を見る前に固定した5つの測定familyは、このStudyが定めたRAW-only・relative depth 5の局所再構築範囲で、すべてformal eligibleとなりました。

研究ブランチ:

`research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`

研究開始時のsource baseline:

`a53aabd26f78ac408445aff2d18ace3b21b827d7`

リポジトリへの統合:

- 科学的な研究ブランチのHEAD: `1777ba717ced88be64cbaf981ce7096372046334`
- `main`への統合: **COMPLETE**
- 最終closure監査: `33466581297 / success`
- checkpoint: [`checkpoints/2026-09-01-main-integration-complete.md`](checkpoints/2026-09-01-main-integration-complete.md)

## この独立Studyが必要だった理由

G3-01（`LGTGMF-STUDY1`）では、productionとindependentの両実装がfreshなbounded local tree / graphをroot・family単位でexactに再構築しました。一方、固定済みstage-manifest contractが、実装に依存するruntime / resource観測値をcanonical stage digestへ含める設計になっていたため、stage digestが一致しませんでした。証拠を読んだ後の修正は禁止されていたため、G3-01は`TECHNICAL-INVALID`で確定しています。

本StudyはG3-01を修正・救済していません。G3-01のfailure modeは設計情報としてだけ参照し、新しいStudy identity、新しい事前規定contract、新しいfresh evidence分離規則の下で開始しました。

## 最終的な証拠

### Stage 0の結果

- technical instrument validation: `STAGE0-PASS`
- workflow run: `33386868192`
- fresh scientific seedの使用: なし

### Stage 1の結果

- fresh block: `31110001..31110128`
- 対象集団: Namua 8 + Mtaji 8 = 16 roots
- relative depth: 5
- 判断: `STAGE1-PASS`
- exact reconstruction: 16/16
- promotionされたfamily: 5/5

### Stage 2の結果

- fresh holdout: `31120001..31120192`
- 対象集団: Namua 12 + Mtaji 12 = 24 roots
- relative depth: 5
- formal workflow run: `33452082425`
- 変更不可のresult commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`
- exact reconstruction: 24/24
- 各familyのexact roots: 24/24
- resource gate: PASS
- 正式判断: `FORMAL-ELIGIBLE-ALL`
- read-only audit run: `33452400324 / success`

formal eligibleとなったfamily:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`
- `LGTGMIV-F5-REPLY-GEOMETRY`

## 変更しない境界

G3-01について、次の判断は変わりません。

- `CLOSED / TECHNICAL-INVALID`
- formal eligible measurement families: `[]`
- Stage 2: `NOT-AUTHORIZED-NOT-EXECUTED`
- consumed Stage 1 seeds: `31010001..31010096`

Research Generation 2は終了済みです。科学的なstate identityは`pits,reserve,houseOwned,player,phase,winner,pending`から成るRAW-onlyのままで、validated transform setも空のままです。

standard initial RAW rootのexact depth-10 holdoutは、このStudyでは開封していません。

`SEALED / NOT GENERATED / NOT READ`

本Studyのclosure時点ではG3-02〜G3-08を自動開始できず、`automaticG302StartAuthorized = false`でした。後続研究の実行には、closure後の独立したprogram authorization reviewを必要としました。

## 文書案内

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向けの問い・結果・主張範囲
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的な最終報告
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の終了状態
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — spec・code・workflow・output・hashの索引
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — 固定済みの科学・技術contract
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 変更不可の判断と各Stageの処置
- [`preregistration/`](preregistration/) — 機械可読な固定contract
- [`checkpoints/`](checkpoints/) — 事前規定・Stage・closureのcheckpoint
- [`authorizations/`](authorizations/) — Stage進行と実行承認のartifact
- [`results/`](results/) — 変更不可のStage結果とread-only監査
