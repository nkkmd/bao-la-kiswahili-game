# G4-08 / BRSGT-STUDY1 — Decision Register

更新日: 2026-09-27

| ID | Topic | Decision | Rationale |
|---|---|---|---|
| BRSGT-D001 | Program authorization | `PREREGISTRATION + STAGE0 TECHNICAL-ONLY` | G4-08 authorization review V1。fresh scientific accessは別reviewまで禁止。 |
| BRSGT-D002 | Study identity | `BRSGT-STUDY1` | G3-06 repair/version incrementではない独立prospective Study。 |
| BRSGT-D003 | Research branch | `research/g4-08-rule-semantic-geometry-transition` | `main`を進行中実験領域にしない。 |
| BRSGT-D004 | Representation | `RAW-ONLY` | authoritative identityは`pits,reserve,houseOwned,player,phase,winner,pending`。validated transform setは`[]`。 |
| BRSGT-D005 | Local horizon | `relative depth 5` | LGTGMIV formal-eligible boundary内に限定。 |
| BRSGT-D006 | Event family | `E1 CAPTURE` | mandatory captureのsame-root generic non-capture counterfactualを要求しない。 |
| BRSGT-D007 | Event family | `E2 NYUMBA USE-vs-STOP` | same-root / same-physical-move variant pairとして分離。 |
| BRSGT-D008 | Event family | `E3 RESERVE-DECREMENT-NONTRANSITION` | Namua内reserve decrementをphase transitionから分離。 |
| BRSGT-D009 | Event family | `E4 NAMUA-TO-MTAJI` | reserve decrement familyへpoolしない。 |
| BRSGT-D010 | Compound handling | `FULL LABEL VECTOR` | outcome後のcompound exclusion / favorable subtype rescueを禁止。 |
| BRSGT-D011 | Default interpretation | `EVENT-CONDITIONED PRE/POST ASSOCIATION` | 有効counterfactual不在時に一般的causal effectを主張しない。 |
| BRSGT-D012 | Geometry metrics | `M1..M6 exact` | LGTGMIV F1-F5からdeterministicに派生。 |
| BRSGT-D013 | Arithmetic | `INTEGER / REDUCED RATIONAL` | float toleranceとpost-hoc roundingを使わない。 |
| BRSGT-D014 | G3-06 boundary | `NO REPAIR / NO SCIENTIFIC REUSE` | `BRMGI-STUDY1` technical-invalid closureを保持。 |
| BRSGT-D015 | G4-02 boundary | `SCIENTIFIC CONTRIBUTION NONE` | no-decisionをpositive/negative evidenceへ読み替えない。 |
| BRSGT-D016 | G4-07 boundary | `NO CAUSAL REINTERPRETATION` | lag-1 reversalをevent mechanismへ昇格しない。 |
| BRSGT-D017 | Stage 0 evidence | `TECHNICAL-FIXTURE ONLY` | scientific seed/trajectory/rootを使用しない。 |
| BRSGT-D018 | Selector gate | `UNIT-BY-UNIT CANONICAL EXACT` | G3-06のselection mismatch再発防止。count一致だけではPASSしない。 |
| BRSGT-D019 | Stage 0 resource ceiling | `8 geometry roots / 128 transitions / depth 5` | technical executionをboundedに固定。 |
| BRSGT-D020 | Future Stage 1 namespace candidate | `start 40813001` | default branch衝突なし。read未認可。 |
| BRSGT-D021 | Future Stage 2 namespace candidate | `start 40823001` | default branch衝突なし。read未認可。 |
| BRSGT-D022 | Long execution path | `GitHub Actions first candidate` | source/run/artifact provenanceを保存し、中断耐性を持たせる。 |
| BRSGT-D023 | G4-10 | `PROTECTED / NO ACCESS` | depth-11 holdoutは別authorizationまで封印。 |
| BRSGT-D024 | Public AI | `NO CHANGE` | scientific resultをproductionへ自動接続しない。 |
| BRSGT-D025 | Stage 1 authorization | `SEPARATE REVIEW REQUIRED` | Stage 0 PASSはfresh scientific accessを自動認可しない。 |
| BRSGT-D026 | Stage 0 v1 | `TECHNICAL-INVALID / NO-RERUN` | Run `36295138475`。binding/syntax PASS後、NYUMBA fixtureがrepresented seed total 34でRAW validatorにfail。scientific reads 0。 |
| BRSGT-D027 | Stage 0 v2 fixture invariant | `ALL FIXTURES MUST REPRESENT 64 SEEDS BEFORE SELECTION` | v1のtechnical defectをfresh evidence前に新versionで是正。 |
| BRSGT-D028 | Stage 0 v2 NYUMBA fixture | `64-SEED SYNTHETIC` | v1のfront semanticsを維持し、不足30石を非active opponent back rowへ配置してmass balanceを満たす。 |
| BRSGT-D029 | Stage 0 v2 phase fixture | `ENGINE-REACHABLE / SEED-FREE DETERMINISTIC PATH` | manual reserve mutationを廃止し、initial stateからcanonical nonterminal legal pathでNamua→Mtaji pre-stateへ到達する。 |
| BRSGT-D030 | Stage 0 v2 path ceiling | `MAX 160 PLIES` | deterministic technical searchをboundedにし、超過はtechnical-invalidとしてfail closed。 |
| BRSGT-D031 | Stage 0 version isolation | `V1 AUTH/TRIGGER NOT REUSED` | v2はnew spec、new source audit、new authorization、new trigger、new workflowを要求。 |
| BRSGT-D032 | Stage 0 v2 disposition | `STAGE0-PASS` | Run `36295553800`。4 fixturesすべて64 seeds、E1-E4 coverage、production/independent exact agreement、fresh reads 0。 |
| BRSGT-D033 | Stage 1 role | `FRESH-DEVELOPMENT / SUPPORT-ONLY / NO FORMAL INFERENCE` | effect value/signを保持せず、definedness/supportだけをStage 2 candidate preparationへ使用する。 |
| BRSGT-D034 | Stage 1 frozen namespace | `40813001..40813512 / 512` | v1 fresh access前にseed block・policy assignment・resource ceilingをfreeze。 |
| BRSGT-D035 | Stage 1 firewall | `FROZEN-PRE-FRESH / IDENTITY-ONLY` | G4-01/G4-04/G4-07等のseed・trajectory・opening-prefix・RAW-root identityを除外し、scientific effect値はselectionへ使わない。 |
| BRSGT-D036 | Earlier Stage 1 static audit | `PASS SUPERSEDED FOR CURRENT-HEAD BINDING` | PASS後にworkflow/binding/relay-limit処理が変更されたためcurrent HEADへの流用を禁止。 |
| BRSGT-D037 | Hardened Stage 1 static audit | `PASS / SCOPE-V2` | Run `36298236747`、audit HEAD `bc390876...`。workflow/binding/runner ordering、relay-limit、auth/trigger absenceまで再監査。 |
| BRSGT-D038 | Hardened audit fresh access | `0` | Stage 1 scientific authorization/triggerはaudit時に不在。fresh Stage 1 / Stage 2 / G4-10 readは0。 |
| BRSGT-D039 | Post-audit documentation | `DOCUMENT THEN FINAL-FREEZE REAUDIT` | audit結果文書化でHEADが進むため、その文書込みHEADを再度pre-fresh auditしてからauthorizationを検討する。 |
| BRSGT-D040 | Stage 1 scientific execution precondition | `SEPARATE AUTHORIZATION REQUIRED` | final-freeze audit PASSだけではfresh scientific executionを自動認可しない。 |
| BRSGT-D041 | Stage 1 final-freeze audit | `PASS / RUN 36298395328` | HEAD `4f307a5502...`。scientific auth/trigger不在、fresh reads 0、Stage 2/G4-10 read 0を再確認。 |
| BRSGT-D042 | Stage 1 v1 authorization | `FRESH-DEVELOPMENT-ONE-SHOT` | final-freeze HEADへsource-bindし、post-audit差分をauthorization + triggerの2 pathだけに限定。 |
| BRSGT-D043 | Stage 1 v1 execution | `TECHNICAL-INVALID / NO-RERUN-SAME-VERSION` | Run `36298620437`。terminal errorはcatch内の`freshScientificSeedReads`未定義。source auditで同じ未定義shorthandが正常系3箇所＋catch 1箇所に存在し、initiating exceptionは復元不能。 |
| BRSGT-D044 | Stage 1 v1 seed block | `CONSERVATIVELY-CONSUMED-NO-REUSE` | exact fresh-read countが保存されなかったため、`40813001..40813512`全体を安全側で隔離。 |
| BRSGT-D045 | Stage 1 v1 scientific interpretation | `NONE-TECHNICAL-INVALID` | formal inferenceなし。Stage 2 seed read 0、G4-10 depth-11 access 0、public AI変更なし。 |
| BRSGT-D046 | Stage 1 v2 prerequisite | `NEW VERSION + NEW SEED BLOCK + CATCH SELF-TEST` | v1の修復再実行を禁止し、別namespace・別spec・別binding・別authorizationを要求。 |
| BRSGT-D047 | Stage 1 v2 identity | `BRSGT-S1-DEVELOPMENT-2026-09-27-v2` | v1と科学的に区別可能な新versionとしてtechnical correctionを隔離。 |
| BRSGT-D048 | Stage 1 v2 seed block | `40814001..40814512 / 512` | v1 blockと非重複。v1 blockはv2 firewallで明示除外し再利用しない。 |
| BRSGT-D049 | Stage 1 v2 runner construction | `PINNED V1 SOURCE + COUNT-CHECKED DETERMINISTIC MATERIALIZATION` | frozen v1 runner SHA-256を固定し、spec/firewall/auth/version/output pathと4箇所のcounter mappingのみを厳密変換する。 |
| BRSGT-D050 | Stage 1 v2 failure-path gate | `PRE-FRESH CATCH SELF-TEST REQUIRED` | fresh access前にintentional exceptionで実際のcatchを通し、failure artifact・read count 0・no-rescue falseを確認する。 |
| BRSGT-D051 | Stage 1 v2 execution boundary | `STATIC AUDIT THEN SEPARATE ONE-SHOT AUTHORIZATION` | static audit PASSだけでは実行しない。audit後の許可差分はv2 authorization + triggerの2 pathのみ。 |
| BRSGT-D052 | Stage 1 v2 static audit | `PASS / RUN 36299573408` | HEAD `d5cc6be4...`。catch self-test PASS、generated runner SHA固定、fresh reads 0、v1 block quarantine、Stage2/G4-10 0。 |
| BRSGT-D053 | Stage 1 v2 execution | `TECHNICAL-INVALID / NO-RERUN-SAME-VERSION` | Run `36299638508`。failure artifactが正常保存され、error=`missing limit distinctRawStates`、fresh reads=512、first=40814001、last=40814512。 |
| BRSGT-D054 | Stage 1 v2 root cause | `PREFLIGHT LIMIT INTERFACE SCHEMA MISMATCH` | CRCLGR preflightは`distinctRawStates/uniqueTransitions/legalMoveEvaluations`を要求するがBRSGTは別名3項目を渡した。G4-04 technical runnerのmappingが正しい参照実装。 |
| BRSGT-D055 | Stage 1 v2 seed block | `CONSUMED-NO-REUSE` | 512 slotsすべてをexactly read済み。`40814001..40814512`を永久隔離しv2 rerun禁止。 |
| BRSGT-D056 | Stage 1 v2 scientific interpretation | `NONE-TECHNICAL-INVALID` | formal inferenceなし、effect値/sign保持なし、Stage2/G4-10 read 0、public AI変更なし。 |
| BRSGT-D057 | Stage 1 v3 prerequisite | `NEW VERSION + NEW BLOCK + PREFLIGHT-CONTRACT SELF-TEST` | 科学条件は維持し、3つのlimit keyだけを修正。fresh access前に同じ`preflightContinuous()` interfaceをtechnical fixtureで実動検証する。 |
| BRSGT-D058 | Stage 1 v3 static audit | `PASS / RUN 36303292448` | audit HEAD `27f2129d...`。catch self-test・preflight-contract self-testともPASS、fresh reads 0。 |
| BRSGT-D059 | Stage 1 v3 execution | `STAGE1-DEVELOPMENT-COMPLETE / SUPPORT-ONLY` | Run `36303568642`。512 fresh reads、64 event units、97 geometry roots、production/independent exact agreement。 |
| BRSGT-D060 | Stage 1 v3 promotion | `24-OF-24 SUPPORTED-FOR-FORMAL-HOLDOUT` | 4 events × 6 metrics全slotがsupport gateを満たした。effect direction/valueはformal family membershipへ使用しない。 |
| BRSGT-D061 | Stage 2 formal family | `FIXED 24 SLOTS / FRESH FORMAL HOLDOUT` | Stage 1 v3 support classificationだけから固定し、effect directionを参照しない。 |
| BRSGT-D062 | Stage 2 inference | `EXACT TWO-SIDED BINOMIAL SIGN TEST + HOLM-BONFERRONI + POLICY CONCORDANCE` | family alpha 1/20、24 familyを固定し、directional confirmationにはP1/P2双方のstrict same-sign majorityを要求。 |
| BRSGT-D063 | Stage 2 namespace | `40823001..40824024 / 1024` | 512 slots per policy、ascending full scan、extension/replacement禁止。 |
| BRSGT-D064 | Stage 2 pre-fresh audit attempt 1 | `TECHNICAL PRE-FRESH FAILURE / READS 0` | Run `36313405735`。G4-08 Stage 1 v3 artifactのidentity fileがnested pathで、workflowのtop-level presence assertionと不一致。 |
| BRSGT-D065 | Stage 2 audit correction | `TECHNICAL-ONLY / SCIENTIFIC CONTRACT UNCHANGED` | G4-08 artifact layout normalizationとstatic auditの現行spec-key参照・command ordering checkだけを修正。seed/family/inference/no-rescue条件は不変。 |
| BRSGT-D066 | Stage 2 pre-fresh audit attempt 2 | `PASS / SCOPE-V2 / RUN 36314109864` | audit HEAD `d2e22fa9...`。artifact ID `10930605637`、fresh reads 0、firewall/inference/binding/protected boundaries PASS。 |
| BRSGT-D067 | Stage 2 authorization | `FRESH-FORMAL-HOLDOUT-ONE-SHOT` | audit HEADへsource-bindし、post-audit変更をauthorization + triggerの2 pathだけに限定。attempt 1・max execution 1。 |
| BRSGT-D068 | Stage 2 execution | `STAGE2-FORMAL-COMPLETE / RUN 36314208922` | execution HEAD `692d2d718...`、1024/1024 fresh reads、artifact ID `10929684128`、artifact ZIP SHA-256 `bbbe1e22...bcb1b`。 |
| BRSGT-D069 | Stage 2 source eligibility | `1024-OF-1024 REJECTED BY FROZEN FRESHNESS FIREWALL` | RAW-root 1011、trajectory 6、opening-prefix 7。accepted source trajectory 0、measured event units 0。 |
| BRSGT-D070 | Stage 2 formal result | `24-OF-24 NON-ESTIMABLE` | estimability gateを満たすevent unitsが0。INCREASE/DECREASE/NOT-CONFIRMEDは0。NON-ESTIMABLEをno-effect/negative resultへ読み替えない。 |
| BRSGT-D071 | Freshness exhaustion diagnostic | `COMMON PLY-0 INITIAL RAW ROOT EXPLAINS 1011 ROOT REJECTIONS` | Stage 2全1024 rowsとStage 1 v3全512 rowsが同じinitial RAW rootを持ち、frozen root firewallに含まれる。post-hoc rescueには使用しない。 |
| BRSGT-D072 | Stage 2 no-rescue closure | `NO RERUN / NO FIREWALL GRAMMAR REPAIR / NO SEED EXTENSION` | fresh boundary通過後のply-0除外、root freshness定義変更、replacement population等を禁止。 |
| BRSGT-D073 | G4-08 study disposition | `CLOSED / NO DIRECTIONAL SCIENTIFIC CONCLUSION` | Stage 2 formal executionは完遂したが24/24 NON-ESTIMABLE。rule-semantic geometry directionについてformal confirmationなし。 |
| BRSGT-D074 | Protected final boundary | `G4-10=0 / PUBLIC AI UNCHANGED / MAIN NOT INTEGRATED` | G4-08 closureはprotected evidence、production AI、mainへ自動波及しない。 |
