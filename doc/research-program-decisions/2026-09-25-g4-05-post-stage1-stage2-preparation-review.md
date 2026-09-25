# 2026-09-25 — G4-05 / RLEMOF-STUDY1 post-Stage1 Stage 2 preparation review

Review ID: `G4-05-STAGE2-PREPARATION-REVIEW-2026-09-25-V1`  
Stage 1 run: `36118961899 / attempt 1 / success`  
判定: **`PASS / STAGE2-PREPARATION-AUTHORIZED / FRESH-FORMAL-EXECUTION-NOT-YET-AUTHORIZED`**

## 1. Stage 1 gate

Stage 1は事前固定したnested tiersのうちT3を機械的に選択した。

```text
T1 eligible = 0
T2 eligible = 1
T3 eligible = 7
selected roots = 7
complete closures = 5
MOVE-NONTERMINATION = 2
```

production / independentはfull fresh scan、tier choice、root order、全closure classificationで一致した。retrograde outcome、WIN/LOSS/RECURRENT、DTF、optimal moveは生成していない。

したがってStage 1で許可されたresource endpointsだけを使い、fresh formal holdoutの設計へ進める。

## 2. formal holdout

```text
seed block = 40523001..40524024 / 1024 games
max ply = 320
structural envelope = T3 only
non-empty pits <= 16
exact legal moves <= 2
```

Stage 1 seed / RAW root identityはすべてformal evidenceから除外する。

### 2.1 Stage 1 RAW identity firewall

Stage 1 artifactは全8,307 root key本体ではなく、集合digestだけをcanonicalに保存している。このためStage 2ではfresh holdout access前に固定した手順として、Stage 1 block `40513001..40513512` を**identity-only**でproduction / independentの双方が再生成し、次のfrozen digestと一致することを必須gateとする。

```text
Stage 1 allEncounteredRootSetSha256 = 83a563ae908ea8778c689ce68f4b63b3e8873eba7dcc8d0547edc5eabb199503
identity count = 8307
```

このidentity-only reconstructionではStage 1 rootのclosure enumeration、resource endpoint再評価、retrograde、winner、DTF、cycle、optimal moveを生成しない。目的はStage 2候補集合から既消費RAW identityを排除するfirewallの構築だけであり、Stage 1 scientific/development runの再実行またはrescueとして扱わない。

production / independentの双方でfrozen digestが一致しなければ、fresh formal resultを有効化せず`TECHNICAL-INVALID`とする。

## 3. resource-conditioned exact microdomain selection

formal candidateはseed asc / ply asc / RAW key ascで固定する。

- maximum closure candidates inspected = 16
- target complete formal domains = 8
- minimum complete formal domains = 6
- states/root <= 200000
- edges/root <= 800000
- move microstates <= 1000000

最初の16 candidate内で、固定resource ceilingの下 `COMPLETE` となったrootだけを順序を保ってformal exact domainへ採用し、8 domains到達で停止する。これはclosure completenessというresource-feasibilityだけを用いる選択であり、retrograde value、winner、DTF、cycle structure、optimal movesを選択入力にしない。

6 complete formal domains未満なら `NON-ESTIMABLE-INSUFFICIENT-COMPLETE-DOMAINS` とする。resource cutoffをnegative exact resultへ変換しない。

## 4. formal exact endpoint

complete formal domainについてのみproduction / independent solverが次を独立に再構築する。

- complete graph state / edge identity
- terminal / WIN / LOSS / RECURRENT counts
- root exact status / absolute winner / DTF
- root optimal move set / recurrent move set
- recurrent SCC metadata
- exact solution digest

`RECURRENT`は`DRAW`へ自動変換しない。

全formal domainsで独立一致し、minimum domain gateを満たした場合のStudy-level decisionを次に固定する。

`EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN`

これはwhole-Bao solution、普遍的なwinning strategy、公開AIの強さを意味しない。

## 5. Actions-first

Stage 2もGitHub Actionsを第一候補とする。180分timeout、attempt 1 one-shot、artifact alwaysとする。Stage 1が約5分で完了したため、このformal envelopeをActionsでまず検証することはresource planning上妥当である。

本レビューはspec/code/workflowのpre-access freezeまでを認可する。source blob identityを固定した別authorizationなしにformal holdout seedをreadしない。

## 判定

**`PASS / STAGE2-PREPARATION-AUTHORIZED / FRESH-FORMAL-EXECUTION-NOT-YET-AUTHORIZED`**
