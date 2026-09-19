# SFCDFT-STUDY4 Stage 1 — FORMAL-PREPARATION-ELIGIBLE

日付: 2026-09-19  
Agenda: `Research Generation 4 / G4-02`  
Study: `SFCDFT-STUDY4`  
Stage: `SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1`

## 判定

`FORMAL-PREPARATION-ELIGIBLE`

この判定は **Stage 2 formal held-out preparationへ進むためのcompatibility gateを通過した**ことだけを意味する。C1/C6のeffect方向、p-value、generalization/counterexample decisionはStage 1では生成していない。Stage 2 scientific seed accessを自動認可しない。

## Canonical GitHub Actions provenance

```text
workflow = SFCDFT4 Stage 1 GitHub Actions execution
run ID = 35441719931
run attempt = 1
event = push
execution SHA = b84b53a3369490cafad2b428feddee20323f3e82
overall conclusion = success
```

Source acquisition:

```text
primary slots = 384 / 384
primary quartets = 96 / 96 success
safe pre-read retries = 0
paired reserve reads = 0
source artifacts = 384
candidate-pair-complete = 297
root-shortage = 87
engine-guard censoring = 0
```

Selection / measurement:

```text
selected pairs = 32
selected pairs / domain = 8
measurement tasks = 8
C1 defined = 8 / domain
C6 defined = 8 / domain
resource gate PASS = 8 / domain
```

Artifact provenance:

```text
source bundle artifact ID = 10584600006
source bundle artifact digest = sha256:42b0c858f9711a9b3236eb73a11fbc5f16e13c02563bf4de31b8fa833214b7f7
final result artifact ID = 10584535311
final result artifact digest = sha256:b6b9c8987be5da9b9d52405ae98eef897af7b725f11f350a958d1443aae8abcf
source manifest deterministic core SHA-256 = f5c77dfc1bce9bbcbc55b5d499724c4b824ba2ceb348178e2687a8b20eb6aacc
selected source manifest deterministic core SHA-256 = 30ead4b09e935e3370d894fc95581fdbc1630d1925a1d5cfd0f1ffd6202c3eac
Stage 1 result deterministic core SHA-256 = 24ef523c374ba2afb8cd79726be7531fffc602f5936534ff82a016ef08fc411f
```

## 科学的境界

Stage 1で許可・生成したもの:

- fresh compatibility source acquisition
- support / censoring counts
- candidate selection
- resource preflight
- endpoint definedness
- production / independent canonical digest equality

Stage 1で生成していないもの:

```text
human-facing numeric endpoint magnitude = false
scientific effect = false
effect direction = false
p-value = false
generalization decision = false
counterexample decision = false
Stage 2 scientific seed access authorization = false
```

Fresh read accounting:

```text
Stage 1 primary fresh seed reads = 384
Stage 1 reserve fresh seed reads = 0
Stage 1 rerun = false
Study 1/2/3 scientific replay = false
G4-10 depth11 access = false
```

## 正本

- `results/stage-1-study4/STUDY_4_STAGE_1_COMPATIBILITY_RESULT.json`
- GitHub Actions run `35441719931`
- source bundle artifact `10584600006`
- final result artifact `10584535311`

## 次の境界

Stage 2はStage 1 PASSだけでは開始しない。次に独立したStage 2 pre-access authorization reviewを実施し、PASSの場合でも許可するのはまずimplementation freeze / pre-execution binding / seed-free preflightまでとする。

Stage 2 fresh namespace `40621001..40621768` および paired reserve `41621001..41621768` は、別個のfinal execution authorizationが作成されるまで `UNREAD` を維持する。
