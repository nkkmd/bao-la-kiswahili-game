# E-017 独立構造確認 — 正式完了チェックポイント

日付: 2026-08-02  
Experiment: `E-017`  
analysisVersion: `15-independent-structural-confirmation`  
Formal decision: **`not-confirmed`**

## 固定条件

E-017は事前登録どおり次の条件で正式実行した。

- 1000局
- seed: `20263001–20264000`
- AI: `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`
- raw candidate rowsは副次endpoint

結果後に局数、seed、候補検出、構造availability、RR基準、判定contractを変更していない。

## Formal integrity

`run-phase-transition-independent-confirmation-formal.js --phase verify` は成功した。

- observations: 56294
- games: 1000
- `artifactVerification: true`
- `manifestCompletedGames: true`
- `manifestConfiguredGames: true`
- `manifestBaseSeed: true`
- `manifestProfile: true`
- `manifestLevel: true`
- `manifestEvaluationProfile: true`
- `manifestSearchProfile: true`
- `manifestMaxDepth: true`
- `gamesCount: true`
- `exactSeedSequence: true`
- `uniqueGameIds: true`
- `allTrajectoryHashesPresent: true`
- `gameConfigHashesMatchManifest: true`
- `lockExperimentId: true`
- `lockAnalysisVersion: true`
- `sourceCommitMatchesLock: true`
- `lockPreregistrationHashPresent: true`
- `lockPolicyHashPresent: true`
- `errors: []`
- `mode: formal`
- `valid: true`

## 正式評価

### 生のendpoint

| 指標 | 結果 |
|---|---:|
| primary candidates | 53 |
| expansion candidates | 37 |
| controls | 40956 |
| control expansion | 1235 |
| candidate expansion rate | 69.81% |
| control expansion rate | 3.02% |
| RR | 23.15 |

### trajectory-ply重複除去後

| 指標 | 結果 |
|---|---:|
| unique candidate trajectory-ply | 21 |
| unique expansion trajectory-ply | 9 |
| unique control trajectory-ply | 23306 |
| unique control expansion | 727 |
| candidate expansion rate | 42.86% |
| control expansion rate | 3.12% |
| RR | 13.74 |

構造集計:

- unique candidate trajectories: 19
- unique candidate archetypes: 19
- unique expansion trajectories: 9
- unique expansion archetypes: 9
- largest trajectory-ply multiplicity: 24

## 事前登録criteria照合

| criterion | threshold | observed | result |
|---|---:|---:|---|
| raw primary candidate rows | >= 30 | 53 | pass |
| unique candidate trajectory-ply | >= 15 | 21 | pass |
| unique candidate trajectories | >= 12 | 19 | pass |
| unique expansion trajectory-ply | >= 5 | 9 | pass |
| unique expansion trajectories | >= 5 | 9 | pass |
| unique control trajectory-ply | >= 30000 | 23306 | **fail** |
| deduplicated RR | >= 3 | 13.74 | pass |
| deduplicated candidate rate > control rate | required | 42.86% > 3.12% | pass |

唯一の不通過は `minimumUniqueControlTrajectoryPly` である。

## 正式判定

事前登録では、formal integrityが成功した後にendpoint criterionが1つでも不通過なら `not-confirmed` とする。

したがってE-017の正式判定は **`not-confirmed`** と固定する。

`23306` を観測した後に最低control数 `30000` を緩和しない。強い効果方向や大きいRRを理由に `confirmed` へ読み替えない。

## 科学的解釈

E-017は正式確認には失敗したが、失敗理由は効果方向ではなく、重複除去後control availabilityである。

- 独立seed 1000局でも候補側のcapture-branch-expansion濃縮方向は維持された。
- trajectory-ply重複除去後でもRR 13.74。
- expansionは9固有trajectory-ply / 9固有trajectory / 9 archetypeに分散した。
- 一方で固有control trajectory-plyは事前登録最低30000に対し23306だった。

よって「構造的一般性を伴う濃縮方向がさらに観測された」と記録できるが、「E-017で正式confirmed」とは記録しない。

## 重複構造

最大trajectory-ply群は24候補で、E-010でも反復が確認された `trajectoryHash fe3c176c... / eventPly 7 / archetype 9f778d512ae1` だった。

ただしE-017では最大群を除いても複数の独立expansion trajectory-plyが存在し、全expansionは9固有trajectory-plyへ分散している。生の37候補を37独立構造とは解釈しない。

## evaluator状態ラベル

正式評価出力の `preregistrationStatus` は `preregistered-not-run` のままだった。これは事前登録configの状態文字列をそのまま出力しているためであり、formal execution stateを表す正本ではない。

formal実行の成立はexecution lock、formal runner、integrity結果 `mode=formal / valid=true` により確認する。状態ラベルの不整合はメタデータ/interface上の改善候補として分離し、正式科学判定を変更しない。

## 次工程

E-011で示唆されたH16「捕獲分岐急拡大の顕在化はsearch profileに依存する」を、E-011/E-017を再解釈せず、`phase2`対`legacy`の新規独立実験として事前登録する。
