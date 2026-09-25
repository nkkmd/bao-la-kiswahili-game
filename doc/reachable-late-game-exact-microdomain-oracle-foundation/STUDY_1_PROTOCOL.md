# RLEMOF-STUDY1 — Study 1 Protocol

Study ID: `RLEMOF-STUDY1`  
Agenda: `Research Generation 4 / G4-05`  
Baseline `main`: `550508f07a1026fa5f08f82343c1b13da2e0dfbd`  
Research branch: `research/g4-05-exact-microdomain-oracle-foundation`

## 1. 中心問い

outcome-blindかつresource-feasibilityだけで選択したfresh reachable late-game rootsについてcomplete legal-transition closureを構築し、独立solver間でgame-theoretic valueとsolution structureを一致させられるか。

## 2. 非目的

本Studyは次を目的としない。

- G2-04のrepair / rescue
- REWR 8-state resultの一般化
- whole-Bao game-theoretic solution
- symmetry / canonicalization validation
- engine scoreやdeeper searchをexact truthへ置換すること
- public AIの採用判断

## 3. state identity

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## 4. exact / non-exact vocabulary

- `TERMINAL`: rules engine上でwinnerが確定し合法遷移を持たないstate。
- `WIN`: complete closure上のretrogradeでplayer-to-move側の強制勝ちがexactに確定。
- `LOSS`: complete closure上のretrogradeで相手側の強制勝ちがexactに確定。
- `RECURRENT`: complete closure上でterminal WIN/LOSS fixed pointに吸収されず、recurrent SCC構造へ属するstate。これだけから`DRAW`を意味しない。
- `DRAW`: 別途prospectiveにgame-theoretic semanticsを定義・認可しない限り生成しない。
- `UNRESOLVED`: resource ceiling、partial closure、technical stop等によりexact valueを付与できないstate/domain。
- `MOVE-NONTERMINATION`: 単一合法手内部のmicrostate recurrence。game-state `RECURRENT`または`DRAW`へ自動変換しない。

## 5. Stage構成

### Stage 0 — technical-only

既存8-state fixtureとsynthetic recurrent graphだけを使用する。fresh G4-05 scientific evidenceを生成しない。

PASS条件はStage 0 specの全gate成功。PASSしてもStage 1は自動開始しない。

### Stage 1 — fresh feasibility / development

**NOT AUTHORIZED**。

post-Stage0 reviewで、結果を見る前に少なくとも次をfreezeしてからのみ候補になる。

- root source / reachability generation
- late-game eligibility contract
- selection ordering
- fresh development seed block end/count
- state / edge / move-microstate / wall-clock ceiling
- deterministic Actions shard manifest
- minimum complete-closure gate
- partial / cutoff / technical-invalid mapping
- production / independent agreement gate

Stage 1はformal game-theoretic population claimを生成しない。

### Stage 2 — formal exact microdomain

**NOT AUTHORIZED**。

Stage 1 feasibility gateを事前定義どおり通過し、別authorizationを得た場合だけ候補になる。Stage 1 root / seed / identityをholdout formal evidenceへ流用しない。

## 6. long-run execution contract

長時間実行はGitHub Actionsを第一候補とする。

将来のfresh stageをActionsで認可する場合:

1. shard境界をfresh access前にmanifestへfreezeする。
2. shard assignmentはdeterministicとする。
3. 各jobはsource SHA、input digest、seed/root allocationをstdoutとartifactへ保存する。
4. timeout / resource cutoffでも可能な限りartifact receiptを保存する。
5. missing shardを0件・negative resultへ変換しない。
6. aggregatorは全required shard receiptの存在とdigestを検証する。
7. rerunはauthorization tokenとrun-attempt semanticsを事前に固定する。科学結果確認後のsame-evidence rescue rerunを禁止する。
8. Actionsに不適切なresource envelopeなら、科学結果を見る前に別authorizationで実行環境を変更する。

## 7. no-rescue

fresh evidence access後は、favorable outcomeを得るためのcap増加、seed extension、root replacement、structural restriction追加、symmetry導入、partial graphのexact昇格を行わない。

## 8. protected boundaries

- G2-04 scientific evidence reuse = false
- G3-11 depth-10 rerun = false
- G4-10 depth-11 access = false
- public AI change = false
- main integration during active study = false
