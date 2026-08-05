# E-020 / H18 D3逆転独立確認 — formal infrastructure checkpoint

更新日: 2026-08-05  
Experiment: `E-020`  
Hypothesis: `H18`  
analysisVersion: `18-d3-reversal-replication`  
Status: **Infrastructure validated / formal execution not authorized / no formal data generated**

## 1. 対象

E-020は固定 `hard / bao / depth 3` で、E-019 D3に観測された `legacy > phase2` の逆転を新規seed blockで独立確認するpreregistered experiment。

科学条件は次で固定済み。

- P2=`phase2`
- LG=`legacy`
- 4500 paired seeds / 9000 games
- formal seed `20275001–20279500`
- same seed / same random-opening paired design
- primary population `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- two-sided exact McNemar
- alpha `0.05`
- minimum discordants `20`
- prospective direction: **LG-only > P2-only**

Preregistration:

- `config/experiments/phase-transition-d3-reversal-replication-v1.json`
- `doc/phase-transition/checkpoints/2026-08-05-e020-d3-reversal-preregistration.md`

## 2. Infrastructure implementation

E-020専用として次を実装した。

- preregistration validator
- fixture-only paired runner
- paired endpoint builder
- reversed-direction exact McNemar evaluator
- paired seed/opening/source/condition integrity verifier
- trajectory-ply structural secondary summarizer
- descriptive mechanism-bridge secondary
- guarded fixed-local formal runner
- fixed-local execution-lock preparer
- formal authorization / seed-overlap guard tests
- non-formal GitHub Actions fixture workflow

過去E-018/E-019のprimary endpoint frameworkは維持するが、experiment ID、hypothesis ID、seed、approval semantics、output root、execution lockはE-020専用とした。過去approval token / lockは再利用しない。

## 3. GitHub Actions infrastructure validation

Workflow:

- `Phase Transition D3 Reversal Replication`
- `.github/workflows/phase-transition-d3-reversal-replication.yml`

Validated infrastructure head:

- `124ca132900487c66b44c37df3de99b59849ad0c`

Actions:

- run: `30972650445`
- job: `fixture`
- result: **`success`**

Non-formal fixture:

- fixture base seed: `90902001`
- games per condition: `2`
- total games: `4`
- formal seed overlap: **none**

成功step:

1. preregistration / reversed-direction evaluator / formal guard tests
2. P2/LG two-condition non-formal fixture generation
3. paired fixture integrity verification
4. candidate detection / control construction
5. paired game-level endpoint construction
6. primary decision contract exercise
7. preregistered structural secondary construction
8. artifact upload

2-pair fixtureはformal Nおよびminimum discordantsを満たさないため、evaluatorが`inconclusive`になることもworkflow内で明示確認した。このfixture結果をH18の科学結果として使用しない。

## 4. Fixture artifact

- artifact: `phase-transition-d3-reversal-replication-fixture`
- artifact ID: `8917220737`
- size: `80111` bytes
- digest: `sha256:332e093b061fd2c065e21a09d6263c992dc3352ef65d5157acf97be672d3a617`

このartifactはnon-formal infrastructure fixtureであり、formal archiveではない。`FORMAL_EXPORT_INDEX.md`へは追加しない。

## 5. Formal guard state

Execution policy:

- `config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json`
- status: `infrastructure-validated-awaiting-formal-authorization`
- `formalExecutionAllowed: false`
- `formalCorpusGenerated: false`
- `githubActionsFormalRunAllowed: false`
- formal authorization: `granted: false`

今回の一般的な研究続行指示はE-020 formal開始承認として扱わない。

formal開始には次を別途要求する。

1. **E-020固有の明示的ユーザー開始承認**
2. execution policyのauthorization stateだけを承認済みへ遷移
3. fixed-local environmentでbranch / clean worktree / Node / Python environmentを再検証
4. E-020専用execution lockを生成
5. lockの`prepared-approved / errors=[]`を確認
6. その後にのみformal seed `20275001–20279500`を使用する

execution lock生成前にformal gameを1局でも作らない。

## 6. Primary/secondary boundary

E-020 primary decisionはpaired game-level exact McNemarだけで行う。

Structural secondaryおよびmechanism-bridge secondaryは:

- primaryを置換しない
- primaryを救済しない
- primaryを反転しない
- Stage Bの機構解析へ橋渡しする説明情報としてのみ扱う

P2>LGへ結果が戻った場合でも、prospective H18 directionを変更せず、事前登録contractに従う。

## 7. 既存formal decisions

変更なし。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

E-020 formal decisionはまだ存在しない。

PR #26はopen / draftを維持する。
