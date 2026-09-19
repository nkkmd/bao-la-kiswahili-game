# 2026-09-19 — G4-02 / SFCDFT-STUDY4 Stage 2 pre-access authorization review

## 正式判定

**`PASS / STAGE2-PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

Authorization token:

**`SFCDFT4-STAGE2-PREACCESS-PASS`**

このreviewは、`SFCDFT-STUDY4` Stage 2 の implementation、pre-execution binding、seed-free preflight を固定することのみを許可する。

**このreviewだけでは Stage 2 fresh scientific seed read を許可しない。** Stage 2 scientific execution authorization は、implementation / binding / seed-free preflight を検証し、すべてPASSした後に別commitで最後のone-shot triggerとして初回作成する。

## 1. Review anchor

```text
repository = nkkmd/bao-la-kiswahili-game
agenda = Research Generation 4 / G4-02
study = SFCDFT-STUDY4
branch = research/g4-02-sfcdft-study4-prereg
review anchor HEAD = f037a762637c572255a40914d0fbbc5f506a7b47
Study 4 preregistration = FROZEN
Study 4 Stage 0 = STAGE0-PASS
Study 4 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
Study 4 Stage 1 canonical run = 35441719931 / completed / success / attempt 1
Study 4 Stage 2 fresh seed reads before review = 0
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```

## 2. Stage 1 prerequisite

Stage 1 canonical resultは次を満たした。

```text
primary START = 384 / 384
sealed primary source = 384 / 384
paired reserve use = 0
candidate pair complete = 297
root shortage = 87
engine-guard censoring = 0
selected pairs = 32 / 32
measurement tasks = 8 / 8 SUCCESS
all four domains: measured pairs = 8 / 8
all four domains: C1 defined = 8 / 8
all four domains: C6 defined = 8 / 8
all four domains: resource pass = 8 / 8
decision = FORMAL-PREPARATION-ELIGIBLE
```

Stage 1はcompatibility / formal-preparation gateに限定され、endpoint magnitude、effect direction、p-value、generalization/counterexample decisionを生成していない。

canonical Stage 1 result deterministic core:

`24ef523c374ba2afb8cd79726be7531fffc602f5936534ff82a016ef08fc411f`

したがってStage 2移行条件は満たすが、Stage 1 scientific evidenceをStage 2 formal evidenceとして再利用してはならない。

## 3. Study 4 Stage 1 durable identity firewall

Stage 1 canonical artifactからidentity-only firewallをdurable repository evidenceとして固定済みである。

```text
firewall ID = G4-02-SFCDFT-STUDY4-STAGE1-IDENTITY-FIREWALL
source run = 35441719931
source execution HEAD = b84b53a3369490cafad2b428feddee20323f3e82
MANIFEST git blob = 58b43655638bdba9bd2902ae4ab3fd89571859d0
identity core SHA-256 = f9ed5a91c1db6985d3daca62e384940b7ef804940a79b20ef651c6fc2514634f
source records = 384
unique trajectory SHA-256 = 384
unique first-16 opening-prefix SHA-256 = 375
unique RAW-root SHA-256 = 659
scientific seed replay = false
scientific endpoint loaded = false
effect direction loaded = false
p-value loaded = false
scientific decision loaded = false
```

Stage 1 seed namespaces `40611001..40611384` と `41611001..41611384` はStage 2で全面除外する。

## 4. Frozen Stage 2 scientific contract

Study 4 preregistration `STUDY_4_SPEC.json` にfreeze済みの科学契約を変更しない。

```text
stage ID = SFCDFT4-S2-FORMAL-HELDOUT-2026-09-19-v1
primary namespace = 40621001..40621768 / 768
paired infrastructure reserve = 41621001..41621768 / 768
max infrastructure replacements = 24
max fresh seed reads = 792
source policies = P1 / P2
root families = RF1 / RF2
four frozen domains
selected pairs = 18 / domain = 72 total
selected roots = 144 total
representation = RAW-ONLY
relative depth = 5
validated transform set = []
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION
C1 frozen direction = MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO
C6 frozen direction = NAMUA-GREATER
formal hypothesis count = 8
family-wise alpha = 1/20
inference = exact two-sided sign test + fixed-eight Holm-Bonferroni
minimum nonzero per hypothesis = 12
```

sample target、endpoint、direction、alpha、domain、root-family、source policy、depth、representation、resource ceilingはStage 1結果またはStudy 3障害を見て変更しない。

## 5. Study 3 Stage 2 technical failure audit

Study 3 Stage 2 canonical one-shot run `35427427920` はfresh source acquisitionとfinal classificationまでは正常に進んだが、formal measurement開始前の`bundle-source`で停止した。

確定した実行事実:

```text
canonical run = 35427427920
execution HEAD = dec9a91d5860b9f3d927d632a7165bcbf99f5f63
bundle-source job = 105857959486 / failure
final classification artifact = 10579503509
final classification artifact digest = sha256:1e77f4aeb02905286f78bafd1c86f4aa4c24c20bec2f5a03052c714cea3205e5
sourceCount = 768
primaryStartCount = 768
reserveStartCount = 0
retryCount = 0
reserveCount = 0
unresolvedCount = 0
fatal = false
formal measurement tasks started = 0
formal aggregate generated = false
```

bundle job stderrの確定failureは:

`paired reserve artifacts are forbidden in a clean canonical execution`

であった。

一方、final classifierはpaired reserve use = 0を示す。したがってStudy 3のfailureはscientific outcomeではなく、**artifact relay / bundle guard層の技術的不整合**として扱う。

Study 3 Stage 2のrepair、rerun、scientific seed reread、追加namespace accessは行わない。またStudy 3のendpoint、effect、formal decisionをStudy 4設計根拠にしない。

## 6. Stage 2 technical remediation boundary

Study 4 Stage 2で許可する技術変更は、Study 3で確定したartifact relay / bundle guard failure classをfresh access前に除去することに限定する。

seed-free preflightでは最低限、次をmandatory gateとする。

1. production-equivalent 768-slot source matrixをseed-free synthetic identity fixtureで構成できること
2. clean fixtureの分類が`primaryStart=768 / reserveStart=0 / retry=0 / reserve=0 / unresolved=0 / fatal=false`となること
3. clean primary-only fixtureをproduction-equivalent bundlerへ渡し、paired-reserve誤検知なしでbundle構築が成功すること
4. reserveの判定は実際のeffective seed / seed role / final classifier provenanceに基づき、単なるartifact名・directory存在・download globだけではreserve useと判定しないこと
5. synthetic infrastructure interruptionを用いたnegative/positive guard testで、reserveが実際に呼ばれた場合だけreserve countが増えること
6. deterministic scientific failure、root shortage、engine-guard censoring、identity firewall reject、endpoint undefined、effect magnitude/direction、formal resultをreserve使用理由にできないこと
7. source bundle upload/retrieval、digest/manifest verification、measurement consumer parseまでseed-freeで通ること
8. exact two-sided sign testとfixed-eight Holm-Bonferroni実装のdeterministic testが通ること
9. fresh scientific seed readsが0のままであること
10. scientific endpoint magnitude / direction / p-value / decisionをpreflightが生成しないこと

このremediationはpipeline semanticsの修正であり、scientific contractの変更ではない。

## 7. Freshness / protected-evidence firewall

Stage 2 implementation / bindingは、既存durable identity firewallのみを参照し、prior scientific trajectoryを再生してはならない。

最低限のprotected inputs:

- G3-04 frozen claim definition / direction metadata
- G4-01 legacy SFCDF identity firewall
- G4-02 Study 1 identity firewall
- G4-02 Study 2 identity firewall
- G4-02 Study 3 Stage 1 durable identity firewall
- G4-02 Study 3 Stage 2 durable identity firewall
- G4-02 Study 4 Stage 1 durable identity firewall

禁止:

- Study 1 scientific seed replay
- Study 2 scientific seed replay
- Study 3 Stage 1 scientific seed replay
- Study 3 Stage 2 repair/rerun/reread
- Study 4 Stage 1 scientific seed replay
- prior-study selected-pair membershipのformal evidence流用
- prior scientific endpoint値の読込み
- G4-10 depth 11 access

## 8. Resource and reserve semantics

既存freezeを変更しない。

```text
max distinct RAW states = 100000
max unique transitions = 750000
max parent expansions = 100000
max legal move evaluations = 750000
max tree node occurrences = 1000000000
max elapsed per root = 180000 ms
max peak RSS = 4294967296 bytes
max root artifact = 67108864 bytes
```

paired reserveは、durable START後にsealed sourceが存在せず、かつinfrastructure interruptionと証明されたslotのみに使用できる。

次を理由とするreserve使用は禁止する。

- deterministic scientific failure
- root shortage
- engine guard censoring
- identity firewall reject
- endpoint undefined
- unfavorable effect direction
- p-value / formal decision
- resource ceiling failure後の科学的救済

full workflow rerun、same-evidence repair、seed extension、threshold変更、selection後replacementは禁止する。

## 9. このreviewで許可する範囲

許可:

1. Stage 2 frozen specのStudy 4 identity materialization
2. Stage 2 source / selection / measurement / inference implementation
3. production / independent implementation exact-agreement checks
4. Stage 1およびprior-study durable firewall reader / verifier
5. Stage 2 768-slot matrix generation
6. artifact relay / bundler guard remediation
7. Stage 2 pre-execution binding
8. Stage 2 seed-free preflight
9. preflight PASS後にのみfinal one-shot authorization fileを準備すること

未許可:

- Stage 2 fresh scientific seed read
- Stage 2 final scientific execution
- effect direction
- p-value
- generalization / counterexample decision
- workflow rerun
- manual dispatchによるscientific execution
- main integration
- public AI change

## 10. Authorization gates

| Gate | 判定 |
| --- | --- |
| G4-02 Agenda authorization | PASS |
| Study 4 independent prospective identity | PASS |
| Study 4 Stage 0 | PASS |
| Study 4 Stage 1 prerequisite | PASS / FORMAL-PREPARATION-ELIGIBLE |
| scientific contract unchanged | PASS |
| Stage 4 Stage 1 identity-only firewall | PASS |
| prior-study scientific replay forbidden | PASS |
| Stage 2 namespace previously unread | PASS |
| Study 3 failure class technically identified | PASS |
| artifact relay remediation scope bounded | PASS |
| pre-execution binding | PENDING |
| seed-free 768-slot artifact-relay preflight | PENDING |
| Stage 2 final execution authorization | NOT AUTHORIZED |
| fresh scientific reads before authorization | 0 / PASS |
| main integration | NOT AUTHORIZED |
| public AI change | NOT AUTHORIZED |

## 11. 正式結論

**`SFCDFT4-STAGE2-PREACCESS-PASS / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

よって、Study 4 Stage 2のimplementation、pre-execution binding、seed-free preflightへ進んでよい。

fresh scientific accessは、bindingとseed-free preflightがすべてPASSし、別commitによるfinal one-shot authorizationが初回作成されるまで禁止する。
