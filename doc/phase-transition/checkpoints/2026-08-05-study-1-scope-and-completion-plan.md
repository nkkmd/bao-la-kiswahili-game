# 第1研究スコープ整理・完了計画チェックポイント

更新日: 2026-08-05  
Status: Scope clarified / no scientific decision changed

## 1. 目的

初期 `doc/PHASE_TRANSITION_RESEARCH_PLAN.md` は研究開始前のDraftとしてRQ1–RQ10を広く設定していた。

E-010–E-019まで研究が進み、強制捕獲レジーム内部の `capture-branch-expansion` が主要な再現可能候補として確認研究の中心になったため、研究プログラムを次のように整理した。

- 第1研究: **Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**
- 第1研究で主対象としなかったRQ: 将来の追加研究課題として保持

この整理は結果後の仮説変更やformal decision変更ではない。

## 2. 新設文書

- `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`

同文書は第1研究の残工程・完了条件・Future Workを定義する。

## 3. 第1研究に残す中核工程

1. E-019 D3で観測されたlegacy > phase2逆転の独立確認
2. depth/search-profile依存性の機構解析
3. capture-branch-expansionの最終認定範囲の確定
4. 機械定義と人間向けBao語彙の対応
5. 最終研究報告と再現情報の統合

D3逆転はE-019の事前登録方向とは逆の観測であるため、E-019内でconfirmatory resultへ読み替えない。新しいconfirmatory testを行う場合は、新規仮説・新規seed・新規preregistration・新規execution lockを要求する。

現時点でE-020 / H18は未登録。

## 4. Future Workへ繰り越す初期RQ

初期RQ1–RQ10は削除しない。

特にreserve、nyumba、前列支配、capture→mobility、forcing→free-choice、namua→mtajiとの一般的時間関係など、第1研究で中心確認対象としなかった問いは「否定」ではなく将来の追加研究課題として残す。

RQ8の探索条件依存性はE-011/E-018/E-019で重点的に扱われ、第1研究内で境界条件まで整理する。

## 5. Formal decisionsの不変性

以下は変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

E-018の確認範囲、E-019のIUT/direction rule、各experimentのthreshold/sample/seed/endpointも変更しない。

## 6. 研究運用

- `RESEARCH_LOG.md`はappend-only
- 過去formal corpusを再生成・上書きしない
- 新規formal experimentは新規preregistration / policy / explicit approval / execution lockを要求
- GitHub Actionsでformal corpusを生成しない
- PR #26は明示的指示までopen / draft維持

## 7. 意味

このスコープ整理により、第1研究は初期RQの全消化を完了条件としない。

探索で最も有力だったcapture-branch-expansionを確認・境界条件・機構・語彙まで統合して第1研究を完結させ、残りRQはBaoの局面相転移研究プログラムの追加研究として独立に進める。
