# 2026-09-04 — post-G3-11 current-state G3-12 authorization review

## Decision

Research Generation 3 のhistorical agenda item `G3-12 — Local Game-Tree Geometry Generalization / Counterexample Study 1`について、G3-12 scientific evidenceへアクセスする前にcurrent remote `main`、upstream formal closures、instrument eligibility、protected-evidence boundary、fresh-evidence feasibility、scientific identifiability、resource feasibilityを監査した。

最終decisionは次のとおりである。

**`G3-12-AUTHORIZED`**

このauthorizationは、G3-12を新規・prospective・独立Studyとして定義し、Study identity / Stage identity / population / source policy / root family / endpoint / estimability / resource / evidence firewallをscientific outcome生成前にfreezeすることだけを許可する。upstream Studyのdecision変更、G3-11 depth-10 evidenceのsame-evidence rerun、depth 11 access、G2-12 estimatorのscientific input利用は許可しない。

---

## 1. Reviewed source of truth

Review開始時にremote `main`を再取得した。

```text
repository = nkkmd/bao-la-kiswahili-game
remote main HEAD = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
HEAD commit message = Complete G3-11 main integration bookkeeping
review date = 2026-09-04
```

Prompt作成時に記録されていたSHAと一致したが、prompt値をsource of truthとして流用せずremoteを再取得して確認した。

Historical `doc/research-generation-3/PROGRAM_PLAN.md`はcurrent-state documentではなくprospective provenanceである。retroactiveに変更しない。

---

## 2. G3-11 current state

G3-11 canonical records、formal result、formal-complete closure、final consistency audit、main-integration-complete checkpointを照合した。

```text
G3-11 = FDEGHV-STUDY1
lifecycle = CLOSED / FORMAL-COMPLETE
formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1 = DEEPER-CONFIRMED
H2 = DEEPER-CONFIRMED
H3 = DEEPER-CONFIRMED
H4 = DEEPER-CONFIRMED
scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT USED / NOT AUTHORIZED
main integration = COMPLETE / FAST-FORWARD
```

主要exact valuesもcanonical resultと一致する。

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
depth-10 duplicate arrivals = 11725
depth-10 states with multiple predecessors = 10383
cumulative distinct RAW states through depth 10 = 451127
cumulative depth-labelled legal edges through parent depth 9 = 466768
cumulative tree-node occurrences through depth 10 = 631101
```

G3-11 closure-time / pre-integration auditに残る`main integration = NOT AUTHORIZED / NOT PERFORMED`は当時のchronologyとして正しい。後続の`2026-09-04-g3-11-main-integration-complete.md`とcurrent-facing documentsが現在のrepository stateを`COMPLETE / FAST-FORWARD`として記録しているため、scientific stateの矛盾とは扱わない。

---

## 3. Upstream claim eligibility audit

G3-12はformalにeligibleなupstream positive claimだけをgeneralization targetにできる。technical-invalid、not-confirmed、non-estimable、non-promoted、diagnostic-only resultをpositive targetへ復活させない。

### G3-02

```text
Study = EBRWS-STUDY1
status = CLOSED / TECHNICAL-INVALID
formal positive claim = none
G3-12 role = INELIGIBLE AS POSITIVE SCIENTIFIC CLAIM
```

Technical diagnostics may inform defensive implementation only. Scientific direction、candidate、threshold、populationのinputにはしない。

### G3-03

```text
Study = TCTGD-STUDY1
status = CLOSED / TECHNICAL-INVALID
formal promoted set = []
formal positive claim = none
G3-12 role = INELIGIBLE AS POSITIVE SCIENTIFIC CLAIM
```

### G3-04

```text
Study = SFCDF-STUDY1
status = CLOSED / FORMAL-COMPLETE
C1 UNIT-WIDTH-OCCUPANCY-FRACTION = CONFIRMED / MTAJI-GREATER
C6 CUMULATIVE-TREE-RAW-RATIO = CONFIRMED / NAMUA-GREATER
C2..C5 = not promoted / not formal-tested
```

G3-12 role:

- C1 = **ELIGIBLE FORMAL GENERALIZATION TARGET**
- C6 = **ELIGIBLE FORMAL GENERALIZATION TARGET**
- C2..C5 = **INELIGIBLE AS POSITIVE CLAIMS**

G3-04のclaimはRAW-only / relative depth 5 / frozen paired populationに限定される。G3-12はそのdecisionを変更せず、新しいfresh domainsで同一claim identityのtransfer / failureを検証する。

### G3-05

```text
Study = BECT-STUDY1
status = CLOSED / TECHNICAL-INVALID
formal positive claim = none
G3-12 role = INELIGIBLE AS POSITIVE SCIENTIFIC CLAIM
```

### G3-06

```text
Study = BRMGI-STUDY1
status = CLOSED / TECHNICAL-INVALID
formal positive claim = none
G3-12 role = INELIGIBLE AS POSITIVE SCIENTIFIC CLAIM
```

Capture / reserve / nyumba等のrule-context labelをG3-12でprospectively定義することは可能だが、G3-06 diagnostic directionsをpositive evidenceとして再利用しない。

### G3-07

```text
Study = SILGM-STUDY1
status = CLOSED / FORMAL-COMPLETE
promoted = 8
estimable = 7
CONFIRMED = 3
NOT-CONFIRMED = 4
NON-ESTIMABLE = 1
```

Eligible confirmed family:

```text
SC1 DEPTH       x E3 RANKING-PREORDER-CHANGE x G1 ROOT-LEGAL-WIDTH = HIGHER-IN-HIGH
SC2 NODE-BUDGET x E3 RANKING-PREORDER-CHANGE x G1 ROOT-LEGAL-WIDTH = HIGHER-IN-HIGH
SC3 QUIESCENCE  x E3 RANKING-PREORDER-CHANGE x G1 ROOT-LEGAL-WIDTH = HIGHER-IN-HIGH
```

この3 candidateだけをG3-12のformal generalization targetとする。G3-07の4 `NOT-CONFIRMED` candidatesと1 `NON-ESTIMABLE` candidateはpositive targetへ昇格させない。

### G3-08

```text
Study = LGPML-STUDY1
status = CLOSED / TECHNICAL-INVALID
formal positive claim = none
G3-12 role = INELIGIBLE AS POSITIVE SCIENTIFIC CLAIM
```

### G3-09

```text
Study = CLGR-STUDY1
status = CLOSED / TECHNICAL-INVALID
formal continuous-representation eligibility = NOT ESTABLISHED
formal positive claim = none
G3-12 role = INELIGIBLE AS POSITIVE SCIENTIFIC CLAIM
```

G3-09 partial measurementsをscientific inputへ使用しない。

Independent post-G3-09 prerequisite chainは別扱いとする。

```text
RRCLGR-STUDY1 = CLOSED / TECHNICAL-INVALID
CRCLGR-STUDY1 = CLOSED / FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION
```

`CRCLGR-R1-EXACT-SQUASHED-L1`はG3-10 claim familyを再測定するための**independent instrument prerequisite**として利用可能である。CRCLGR自体をG3-12のscientific generalization claimへ読み替えない。

### G3-10

```text
Study = GCLD-STUDY1
status = CLOSED / FORMAL-COMPLETE
C1 DIRECTIONALITY / PATH EFFICIENCY = CONFIRMED / ACTUAL-GREATER
C2 PERSISTENCE / LAG-DISTANCE GRADIENT = CONFIRMED / ACTUAL-GREATER
C3 RETURN FRACTION = CONFIRMED / ACTUAL-LESS
C4 CHRONOLOGY-CONDITIONED CIRCULATION = NOT-CONFIRMED
C5 FIRST-ORDER DIRECTIONAL PATH DEPENDENCE = CONFIRMED / ACTUAL-GREATER
```

G3-12 role:

- C1, C2, C3, C5 = **ELIGIBLE FORMAL GENERALIZATION TARGETS**
- C4 = **INELIGIBLE AS POSITIVE CLAIM / MUST REMAIN NOT-CONFIRMED UPSTREAM**

### G3-11

G3-11 H1..H4はsingle standard-initial RAW rootのcomplete exact depth-10 domainにおけるdeeper continuation checksである。

G3-12でのlegitimate roleは次に限定する。

```text
generalization target = NO
validation anchor = YES
boundary reference = YES
historical exact comparator = YES
methodological RAW/tree-graph identity reference = YES
```

G3-11のsingle-root exact resultをBao-wide generalization evidenceとして扱わない。depth-10 same-evidence rerunを行わず、depth 11へ進まない。

---

## 4. Instrument eligibility

G3-12で使用可能なscientific instrumentは次に限定する。

### RAW local geometry

`LGTGMIV-STUDY1`のformal-eligible measurement family:

```text
LGTGMIV-F1-TREE-OCCURRENCE
LGTGMIV-F2-RAW-GRAPH
LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE
LGTGMIV-F4-TREE-GRAPH-RELATION
LGTGMIV-F5-REPLY-GEOMETRY
relative horizon = 5
representation = RAW-only
```

### Continuous trajectory geometry

G3-10 claim familyに限り:

```text
CRCLGR-R1-EXACT-SQUASHED-L1
relative horizon = 5
axes = CRCLGR-A1..A6
exact reduced-rational coordinate arithmetic
equal-weight exact L1
```

G3-09 / RRCLGR technical-invalid representationを使用しない。

---

## 5. Fresh-evidence feasibility

G3-12 fresh evidenceは、G3-11 protected depth-10 artifactを再実行せず、standard initial stateから新しいseeded source trajectoriesを生成してreachable rootsを選択することで構築できる。

現行repositoryには、canonical legal-move order、seeded Mulberry32、uniform legal selectionに加え、capture-available時だけcapture movesから選択する`CAPTURE_FIRST`型の決定論的source-policy precedentが存在する。G3-12では過去のscientific measurementsを流用せず、policy algorithmだけを新Studyのprospective contractとして再定義できる。

したがって:

```text
fresh population construction = FEASIBLE
new source-policy family construction = FEASIBLE
new reachable-root family construction = FEASIBLE
protected depth-10 reuse required = NO
depth-11 access required = NO
G2-12 estimator required = NO
```

---

## 6. Scientific identifiability

G3-12は全candidate axisの完全factorial化を要求しない。claim constructを壊さず、fresh populationで識別可能なaxisだけをformal matrixへ入れる。

Authorization時点のprinciple:

1. **source-policy transfer**は全3 eligible claim modulesでformalに扱える。
2. **reachable-root-family / ply-range transfer**はroot-based G3-04 / G3-07 claim modulesでformalに扱える。
3. **phase**はG3-04のpaired phase contrastとG3-07のphase-stratified associationへ元のconstructとして保持する。G3-10 trajectoryを事後的にphase別sampleへ分解しない。
4. **capture / nyumba / reserve context**はexact pre-root descriptorとしてprospectively記録できるが、reserveはphaseと強く構造連動するため独立factorとして無理に因果・generalization axis化しない。
5. **root legal width**はG3-07ではclaim predictorそのものであり、同claimの独立generalization axisとして二重使用しない。
6. G3-11 standard-root depth-10はhistorical exact comparatorであり、fresh root-family cellにしない。

この制約により、claim-specific domain matrixとしてgeneralization / counterexampleを識別できる。negative resultはrescueせず正式なboundary resultとする。

---

## 7. Resource / implementation feasibility

既存formal workloadsから、relative depth-5 exact RAW geometry、G3-07 search-condition comparison、CRCLGR/G3-10 trajectory measurementはいずれもbounded resource下で完走実績がある。

G3-11 depth-10 exact enumeration自体もproduction / independent full re-enumerationを凍結resource ceiling内で完了したが、G3-12はその重いsingle-root domainを再実行しない。

G3-12は:

- source-policy数を2に固定する;
- root-family数を2に固定する;
- eligible upstream claimだけをformal targetsにする;
- root-based moduleとtrajectory moduleを分離してresource ceilingを設定する;
- development Stageでeffect-based candidate promotionを行わず、support / exactness / resource readinessだけを確認する;
- formal Stage seedをStage 2 authorization前にreadしない;

ことで実装可能である。

Decision: **`RESOURCE / IMPLEMENTATION FEASIBLE WITH BOUNDED CONTRACT`**。

---

## 8. No-rescue boundary

G3-12 authorizationは次を明示的に禁止する。

- G3-02 / G3-03 / G3-05 / G3-06 / G3-08 / G3-09のtechnical-invalid decision変更
- G3-07 not-confirmed / non-estimable candidatesのpositive revival
- G3-10 C4のrescue
- G3-11 H1..H4をwhole-Bao claimへ拡張
- G3-11 depth-10 same-evidence rerun
- depth 11 access
- G2-12 estimator scientific input
- post-fresh threshold relaxation
- post-fresh endpoint replacement
- favorable subgroup rescue
- seed extension
- root replacement
- resource ceiling引き上げによるrescue
- symmetry / canonicalization導入
- outcomeを見た後のformal axis変更

Technical-invalid upstream Studyのfailure原因からtechnical defensive controlsを設計することは許可するが、そのStudyのscientific directionを復活させない。

---

## 9. Protected identity boundary

G3-12で維持すべきauthoritative identityはResearch Generation 3 common contractと同じである。

```text
RAW state identity fields = pits,reserve,houseOwned,player,phase,winner,pending
excluded from RAW identity = turn,reason
validated transform set = []
reflection = NOT USED
seat swap = NOT USED
symmetry quotient = NOT USED
canonicalization collapse = NOT USED
tree occurrences != unique RAW graph states
```

Move identityはcurrent LGTGMIV / G3-07 contractと整合させる。

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

---

## 10. Authorization conclusion

Dependencies、eligible claim supply、instrument eligibility、fresh evidence、identifiability、resource feasibilityのいずれにも、G3-12開始前に別prerequisite Studyを要求するblockerは認められない。

したがって:

# **G3-12-AUTHORIZED**

次に、新しいresearch branch上でscientific outcome生成前にStudy ID、Stage ID、fresh seed blocks、claim/domain matrix、resource ceiling、formal decision rule、independent-verification contractをprospectively freezeする。

このreview自体はG3-12 fresh scientific evidenceを生成・read・peekしていない。
