# 2026-09-25 — post-G4-04 current-state G4-05 認可レビュー

Review ID: `G4-05-AUTHORIZATION-REVIEW-2026-09-25-V1`  
Agenda: `Research Generation 4 / G4-05`  
Repository: `nkkmd/bao-la-kiswahili-game`  
Reviewed `main` HEAD: `550508f07a1026fa5f08f82343c1b13da2e0dfbd`  
判定: **`G4-05-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**  
fresh scientific seed / root access: **`0 / NOT AUTHORIZED YET`**  
formal exact scientific outcome: **`NOT GENERATED`**

## 1. 審査対象

G4-05は、outcome-blindかつresource-feasibilityだけで選択したfresh reachable late-game rootについて、合法遷移グラフを完全に閉じ、独立solver間でgame-theoretic valueとsolution structureを一致させられるかを検証する、Research Generation 4 Wave Bの独立Study候補である。

本レビューはG4-05の科学実行を開始するものではない。まずStudy identity、evidence firewall、exact semantics、technical instrument、resource / failure semantics、長時間実行経路を結果生成前に固定できるかだけを審査する。

## 2. current-state prerequisite

```text
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-03 = COMPLETE / MAIN INTEGRATED
G4-04 = COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED
G4-05 = NEXT CORE CANDIDATE / NOT-AUTHORIZED before this review
G4-10 depth 11 = PROTECTED / NOT-AUTHORIZED / NOT-ACCESSED
public AI change authorized by RG4 = false
```

G4-04の結果はG4-05のpositive evidenceではなく、Program current-stateの確認にだけ用いる。

## 3. G2-04 / REEOE-STUDY1との分離

G2-04 `REEOE-STUDY1`はhistorical methodology / resource-planning referenceに限定する。

```text
formal decision = INCONCLUSIVE
selected roots = 8
complete closures = 0
STATE-LIMIT = 4
ADMIN-CUTOFF = 3
MOVE-NONTERMINATION = 1
Stage 2 = NOT AUTHORIZED
```

この結果をG4-05のnegative scientific evidenceへ転用しない。同一seed、同一fresh root identity、同一selected-root setを再利用しない。G2-04をrepair / reopen / rescueしない。

一方、`REWR-STUDY1`の8-state / 7-edge exact domainは、既に固定済みのtechnical regression fixtureとしてのみStage 0で再構築してよい。これはG4-05 scientific evidenceではない。

## 4. authoritative identity / exact semantics boundary

G4-05のauthoritative state identityは次とする。

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = forbidden
symmetry reduction = forbidden
quotient graph = forbidden
```

game-state recurrenceとintra-move transition nonterminationを分離する。

- `RECURRENT`: 完全に閉じたgame-state graph上でretrograde fixed point後に未解決となるstate / SCCの構造分類
- `MOVE-NONTERMINATION`: 1合法手の内部microstate transitionが完了しないtechnical / transition classification
- `DRAW`: G4-05で明示的なgame-theoretic draw semanticsを別途prospectiveに定義・認可しない限り、`RECURRENT`から自動導出しない
- `UNRESOLVED`: resource cutoffや不完全closureをexact valueへ昇格しないための非exact分類

## 5. freshness firewall

G4-05 fresh scientific access前に、少なくとも次を排除する。

- G2-04 Stage 1 v1 / v2 scientific seedsとRAW root identities
- G2-04 selected-root set
- G2-04 fresh development outputをroot選択のfavorable inputとして利用すること
- G3/G4 scientific resultをrootのgame-theoretic outcome選択へ使用すること
- G3-11 depth-10 evidenceのrerun
- G4-10 depth-11 evidenceへのアクセス

候補namespaceとして `40513001...`（development）と`40523001...`（formal holdout）の開始点にrepository上の予約衝突がないことを確認した。ただし、本レビューではnamespaceの予約だけを許可し、seed生成・readは認可しない。end / count / allocationはfresh access前の別Stage authorizationで固定する。

## 6. Stage 0 technical design readiness

Stage 0は科学結果を生成しない。

必須項目:

1. frozen REWR 8-state technical fixtureのproduction再構築
2. import経路を分離したindependent verifierによるfull graph / retrograde一致
3. RAW identityとmissing `pending` hard-fail確認
4. graph node / edge / predecessor / solution digest一致
5. negative corruption controlsの検出
6. synthetic recurrent SCC fixtureでproduction / independent retrograde一致
7. `RECURRENT` / `DRAW` / `MOVE-NONTERMINATION` / `UNRESOLVED`語彙の分離
8. output reopen / hashとscientific authorization flag=false確認

Stage 0 PASSはfresh scientific Stage 1を自動認可しない。

## 7. 長時間実行 / GitHub Actions 方針

長時間trialは、チャット応答が途切れてもrepository stateだけから再開できることを優先し、**GitHub Actionsを第一候補**とする。

ただし、Program Planのresource方針に従い、巨大なexact enumerationをActionsの単一job timeoutへ無理に押し込まない。

fresh executionを将来認可する場合は、実行前に次を固定する。

- deterministic shard manifest
- 各shardのseed / root assignment
- source commit SHAとinput digest
- per-shard resource ceiling / timeout
- `if: always()`相当のartifact保存経路
- artifact名にStudy / Stage / shard / run identityを含める規則
- aggregatorが欠落shardをscientific zeroへ変換しない規則
- production結果とindependent verificationを別artifactまたは明示的に分離する規則
- run ID、attempt、artifact ID / digestをrepository-facing receiptへ記録する規則

Actionsで安全に完結しないresource envelopeと判定された場合だけ、別authorizationで再現可能な適格実行環境へ切り替える。結果確認後の環境変更によるrescueは行わない。

## 8. 認可gate

| Gate | 判定 |
|---|---|
| RG4 current-state | PASS |
| G4-05 program role | PASS |
| G2-04 separation | PASS |
| fresh namespace readiness | PASS-AS-DESIGN |
| RAW identity boundary | PASS |
| transform set `[]` | PASS |
| independent technical solver path | PASS-AS-DESIGN |
| recurrent / nontermination semantic separation | PASS-AS-DESIGN |
| Actions-first recoverability | PASS-AS-DESIGN |
| G4-10 / public AI protected boundary | PASS |

## 9. 認可される次工程

本レビューにより次だけを認可する。

- Study ID / title / research branchの固定
- Study-start contractとStage 0 specのfreeze
- technical-only Stage 0 code / workflow作成
- REWR 8-state fixtureのtechnical replay
- synthetic technical graph fixtureの生成
- GitHub ActionsでのStage 0 technical execution
- future fresh namespaceの予約
- future long-run Actions architectureのprospective設計

本レビューでは次を認可しない。

- G4-05 fresh scientific seed生成/read
- fresh reachable root scan / selection
- fresh closure enumeration
- formal exact value生成
- Stage 1 / Stage 2 scientific execution
- G2-04 scientific evidence replay / rescue
- symmetry / canonicalization
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- `main`統合
- public AI変更

## 10. 最終判定

**`G4-05-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY`**

次工程は`RLEMOF-STUDY1`をprospectiveにfreezeし、technical-only Stage 0を実行することである。Stage 0 PASS後もfresh scientific accessには別authorization reviewを必須とする。
