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
| BRSGT-D034 | Stage 1 frozen namespace | `40813001..40813512 / 512 / NOT YET ACCESSED` | fresh access前にseed block・policy assignment・resource ceilingをfreeze。 |
| BRSGT-D035 | Stage 1 firewall | `FROZEN-PRE-FRESH / IDENTITY-ONLY` | G4-01/G4-04/G4-07等のseed・trajectory・opening-prefix・RAW-root identityを除外し、scientific effect値はselectionへ使わない。 |
| BRSGT-D036 | Earlier Stage 1 static audit | `PASS SUPERSEDED FOR CURRENT-HEAD BINDING` | PASS後にworkflow/binding/relay-limit処理が変更されたためcurrent HEADへの流用を禁止。 |
| BRSGT-D037 | Hardened Stage 1 static audit | `PASS / SCOPE-V2` | Run `36298236747`、audit HEAD `bc390876...`。workflow/binding/runner ordering、relay-limit、auth/trigger absenceまで再監査。 |
| BRSGT-D038 | Hardened audit fresh access | `0` | Stage 1 scientific authorization/triggerはaudit時に不在。fresh Stage 1 / Stage 2 / G4-10 readは0。 |
| BRSGT-D039 | Post-audit documentation | `DOCUMENT THEN FINAL-FREEZE REAUDIT` | audit結果文書化でHEADが進むため、その文書込みHEADを再度pre-fresh auditしてからauthorizationを検討する。 |
| BRSGT-D040 | Stage 1 scientific execution | `NOT AUTHORIZED` | final-freeze audit PASSもexecution authorizationを自動付与しない。別authorization reviewが必要。 |
