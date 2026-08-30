# 2026-08-30 — Stage 0 core technical検証の合格

Study: `TMGC-STUDY1`  
Stage: `TMGC-S0-TECHNICAL-2026-08-30-v1`

## 中間判断

**`CORE-SEMANTICS-AND-PROVENANCE-PASS`**

これはStage 0全体のterminal `STAGE0-TECHNICAL-PASS`ではない。source/diversity/resource preflight等の残mandatory gateが完了するまでStage 0 formal dispositionは`PENDING`である。

## 検証済み事項

GitHub Actions run `33285277593`、source commit `123b24049f6d12dbe529c5aecc7fc2ee78852deb`でtechnical coreがsuccessした。

- Research Generation 1のcandidate / spec / authorization文書SHA-256はexact一致した。
- authorization-bound 17 source files: 全件exact SHA-256 match
- production / independent間でG2-09 classifierを共有しない要件はPASSした。
- RAW identityはproduction / independentでexact一致した。
- `turn` / `reason` exclusion: pass
- `pending` inclusion: pass
- exact legal move / canonical C03 move / successor bindingはPASSした。
- primary structural positive synthetic controlはPASSした。
- primary structural counterexample synthetic controlはPASSした。
- paired diagnostic reconstructionはexact一致した。
- D1/D2/D3 reference instrumentation reconstructionはtechnical fixture上でexact一致した。

## phaseに関する境界

`TM-S2-C03` exactはMtaji `row=1`（back row）takataである一方、Namua legal move constructionはfront rowのみである。このため、phaseだけを変えるdirect Namua transportは`TECHNICALLY-INELIGIBLE`である。

NamuaをC03-exactのscientific counterexampleとして数えない。rowを変えた別constructはG2-09ではauthorizeしない。

## resource観測

- core runのmaximum resident setは59,396 KBだった。
- core result JSON: 15,540 bytes（artifact field追加前）
- workflow artifact ZIPは8,008 bytesだった。

これらはcore fixtureのtechnical resource observationであり、scientific population runtimeの推定にはsource preflightを別途用いる。
