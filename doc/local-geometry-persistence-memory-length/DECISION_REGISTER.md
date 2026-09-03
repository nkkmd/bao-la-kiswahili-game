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
| LGPML-D013 | Stage 1 seeds | `31810001..31810256 / CONSUMED` | exactly-one authorized Stage 1 executionでfresh access済み。 |
| LGPML-D014 | Stage 2 seeds | `31820001..31820384 / NOT CONSUMED` | Stage 2未実行。 |
| LGPML-D015 | Technical seeds | `31809001..31809008` | scientific use永久禁止。 |
| LGPML-D016 | Analysis segment | `PLIES 16..63` | 48 roots/eligible trajectory。 |
| LGPML-D017 | Stage 1 target | `10 TRAJECTORIES` | complete 10/10 populationが必要。 |
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
| LGPML-D031 | Main integration | `COMPLETE / FAST-FORWARD / FORCE=FALSE` | 明示的ユーザー指示後、source tip `72bd208267359f461e9dbbde938bb952eb01b91c` をmainへ統合。科学的closure/no-rescueは不変。 |
| LGPML-D032 | Stage 0 authorization | `AUTHORIZED / EXECUTED ONCE` | trigger commit `830d1d9d...`; same-version rerun禁止。 |
| LGPML-D033 | Stage 0 result | `STAGE0-PASS` | technical controls exact agreement。fresh scientific evidenceなし。 |
| LGPML-D034 | Stage 0 technical seed | `31809002 USED` | scientific use永久禁止。 |
| LGPML-D035 | Stage 0 resource observation | `MAX COMBINED ROOT 10877 ms` | frozen scientific ceilingsの緩和根拠には使用しない。 |
| LGPML-D036 | Stage 1 preauthorization audit | `PASS` | run `33729048934`, job `100564565986`; source separation/resource wrapper/authorization gate確認。 |
| LGPML-D037 | Stage 1 authorization | `STAGE1-AUTHORIZED / MAX EXECUTIONS=1` | authorization commit `a7904798...`; source-bound exactly-one executionのみ。 |
| LGPML-D038 | Stage 1 execution | `COMPLETED / ATTEMPT 1 / NO RERUN` | run `33731577464`; canonical technical-invalid resultをartifact保存。 |
| LGPML-D039 | Stage 1 recovery | `EXACT-BYTE ONLY` | scientific recomputationなしでartifact bytesをrepositoryへmirror。 |
| LGPML-D040 | Stage 2 pretooling audit v1 | `TECHNICAL FIXTURE FAILURE` | synthetic lag-window expected-count誤記。Stage 2 seed accessなし、scientific consequenceなし。 |
| LGPML-D041 | Stage 2 pretooling audit v2 | `PASS` | 173 lag-window identities、sign-test、Holm、NON-ESTIMABLE、memory-lengthをproduction/independent exact確認。 |
| LGPML-D042 | Stage 2 authorization | `NOT-AUTHORIZED-NOT-EXECUTED` | valid Stage 1 completion/nonempty promoted setなし。 |
| LGPML-D043 | Stage 2 tooling | `PREPARED / UNARMED / UNUSED` | technical readinessのみ。Stage 2 triggerなし、seed accessなし。 |
| LGPML-D044 | Stage 1 formal disposition | `STAGE1-TECHNICAL-INVALID` | required depth-5 RAW reconstructionで`relay-limit enumeration`発生。 |
| LGPML-D045 | Stage 1 technical error identity | `74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e` | technical provenanceのみ。科学的方向・effectを意味しない。 |
| LGPML-D046 | Partial Stage 1 data | `TECHNICAL PROVENANCE ONLY` | 9 complete trajectory logsをcandidate promotion/memory-length inferenceへ使用しない。 |
| LGPML-D047 | Formal promoted candidate set | `[]` | Stage 2へ渡すscientific candidateなし。 |
| LGPML-D048 | Study closure | `CLOSED / TECHNICAL-INVALID` | negative/null findingではなくtechnical validity closure。same-evidence rescue禁止。 |
| LGPML-D049 | Stage 2 / protected evidence | `STAGE2 NOT EXECUTED / DEPTH10 SEALED` | Stage 2 seedsとprotected depth-10を未アクセスのまま保持。 |

| LGPML-D050 | Post-closure repository integration | `COMPLETE` | 2026-09-03、mainを`72bd208267359f461e9dbbde938bb952eb01b91c`へfast-forward。squash/rebase/history rewrite/scientific rerunなし。 |
