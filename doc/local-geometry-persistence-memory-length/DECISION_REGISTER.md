# LGPML-STUDY1 — Decision Register

更新日: 2026-09-03

| ID | Decision | Status | Scientific consequence |
|---|---|---|---|
| LGPML-D001 | Post-G3-07 program review | `G3-08-AUTHORIZED` | Study freezeとtechnical-only Stage 0を許可。fresh Stage 1は別authorization。 |
| LGPML-D002 | Formal Study ID | `LGPML-STUDY1` | Freeze後immutable。 |
| LGPML-D003 | Baseline main | `9f6abd3c9b146bb88c11dd04963052300e4cdc3b` | G3-07統合後current main。 |
| LGPML-D004 | Research branch | `research/g3-08-local-geometry-persistence-memory-length` | mainから科学開発を分離。 |
| LGPML-D005 | Measurement foundation | `LGTGMIV F1-F5 ONLY` | RAW-only / relative depth 5。 |
| LGPML-D006 | Representation | `RAW-ONLY / transforms=[] / depth=5` | symmetry quotient禁止。 |
| LGPML-D007 | Geometry panel | `G1..G6 FROZEN` | G3-07 confirmed threshold/direction非依存。 |
| LGPML-D008 | Primary process | `ONE-PLY EXACT CHANGE SIGN` | UP/DOWN/ZERO、phase crossing undefined。 |
| LGPML-D009 | Lag set | `{1,2,4,8}` | fresh後のlag追加・削除禁止。 |
| LGPML-D010 | Primary endpoint | `SAME vs OPPOSITE SIGN` | lag pairを独立sampleとしない。 |
| LGPML-D011 | Experimental unit | `SOURCE TRAJECTORY` | overlapping roots/windowsの依存をtrajectory内集約。 |
| LGPML-D012 | Secondary endpoints | `FIRST-EXIT / RETURN DESCRIPTIVE ONLY` | formal promotion/test family外。 |
| LGPML-D013 | Stage 1 seeds | `31810001..31810256` | exactly-one authorized Stage 1 executionでfresh access開始。 |
| LGPML-D014 | Stage 2 seeds | `31820001..31820384` | NOT CONSUMED。 |
| LGPML-D015 | Technical seeds | `31809001..31809008` | scientific use永久禁止。 |
| LGPML-D016 | Analysis segment | `PLIES 16..63` | 48 roots/eligible trajectory。 |
| LGPML-D017 | Stage 1 target | `10 TRAJECTORIES` | max 480 roots。 |
| LGPML-D018 | Stage 2 target | `16 TRAJECTORIES` | max 768 roots。 |
| LGPML-D019 | Stage 1 support | `8 supported / 6 nonzero balances / 2/3 direction` | promotion gate。 |
| LGPML-D020 | Lag hierarchy | `CONTIGUOUS SAME-DIRECTION PROMOTION` | isolated favorable long lagを防止。 |
| LGPML-D021 | Formal support | `12 supported / 10 nonzero balances` | failureはNON-ESTIMABLE。 |
| LGPML-D022 | Formal test | `EXACT TWO-SIDED SIGN TEST` | trajectory-level balance sign。 |
| LGPML-D023 | Multiplicity | `HOLM / FWER 1/20` | estimable promoted family。 |
| LGPML-D024 | Memory-length summary | `CONFIRMED CONTIGUOUS LAG MAX` | candidate resultsからdeterministic導出。 |
| LGPML-D025 | Exact arithmetic | `BIGINT / REDUCED RATIONAL` | scientific float toleranceなし。 |
| LGPML-D026 | Production/independent | `MANDATORY SEPARATION` | LGPML aggregationの相互import禁止。 |
| LGPML-D027 | G3-07 reuse | `CONTEXT / FIREWALL IDENTITY ONLY` | 3 CONFIRMED candidateをselection inputにしない。 |
| LGPML-D028 | G3-05 reuse | `TECHNICAL PATTERN ONLY / NO SCIENTIFIC OUTPUT` | technical-invalid direction/telemetry禁止。 |
| LGPML-D029 | Protected depth-10 | `SEALED / NOT GENERATED / NOT READ / NOT PEEKED` | 全Stageで使用禁止。 |
| LGPML-D030 | No-rescue | `CROSSED AT FIRST STAGE 1 FRESH ACCESS` | seed/lag/metric/test/ceiling変更とsame-evidence rerun禁止。 |
| LGPML-D031 | Main integration | `EXPLICIT USER INSTRUCTION REQUIRED` | Study closureでも自動統合しない。 |
| LGPML-D032 | Stage 0 authorization | `AUTHORIZED / EXECUTED ONCE` | trigger commit `830d1d9d...`; same-version rerun禁止。 |
| LGPML-D033 | Stage 0 result | `STAGE0-PASS` | technical controls exact agreement。fresh scientific evidenceなし。 |
| LGPML-D034 | Stage 0 technical seed | `31809002 USED` | scientific use永久禁止。 |
| LGPML-D035 | Stage 0 resource observation | `MAX COMBINED ROOT 10877 ms` | frozen scientific ceilingsの緩和根拠には使用しない。 |
| LGPML-D036 | Stage 1 preauthorization audit | `PASS` | run `33729048934`, job `100564565986`; source separation/resource wrapper/authorization gate確認。 |
| LGPML-D037 | Stage 1 authorization | `STAGE1-AUTHORIZED / MAX EXECUTIONS=1` | authorization commit `a7904798...`; source-bound exactly-one executionのみ。 |
| LGPML-D038 | Stage 1 execution | `RUNNING / ATTEMPT 1 / NO RERUN` | trigger `bfd0f7b0...`; run `33731577464`; lease `9884042604`。結果未確定。 |
| LGPML-D039 | Stage 1 recovery | `EXACT-BYTE ONLY` | artifact loss対応でscientific recomputationは禁止。 |
| LGPML-D040 | Stage 2 pretooling audit v1 | `TECHNICAL FIXTURE FAILURE` | synthetic lag-window expected-count誤記。Stage 2 seed accessなし、scientific consequenceなし。 |
| LGPML-D041 | Stage 2 pretooling audit v2 | `PASS` | 173 lag-window identities、sign-test、Holm、NON-ESTIMABLE、memory-lengthをproduction/independent exact確認。 |
| LGPML-D042 | Stage 2 authorization | `NOT AUTHORIZED` | Stage 1 canonical disposition/promoted setと別preauthorization reviewが必要。 |
| LGPML-D043 | Stage 2 tooling | `PREPARED / UNARMED` | runner/verifier/workflowは存在するがStage 2 triggerなし、seed accessなし。 |
