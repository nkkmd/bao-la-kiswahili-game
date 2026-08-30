# PSRRE-STUDY1 — 再開位置

## 現在地

Study-start prospective freezeを作成済みで、scientific evidenceはまだ生成していない。

```text
Study ID = PSRRE-STUDY1
Baseline = 3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
Branch = research/pre-g2-11-strategic-regime-representation-eligibility
Stage 0 = contract frozen / not executed / not authorized
Stage 1 = not authorized / not executed
Stage 2 = not authorized / not executed
G2-11 = not authorized
```

## 再開時の読む順序

1. `CURRENT_STATUS.md`
2. `DECISION_REGISTER.md`
3. `STUDY_1_PROTOCOL.md`
4. `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
5. `prereg/STUDY_1_INITIAL_CONTRACT.json`
6. `prereg/STAGE_0_TECHNICAL_SPEC.json`
7. `REPRODUCIBILITY_INDEX.md`
8. `RESEARCH_LOG.md`

## 次に行うこと

1. branch HEADとStudy-start commit SHAを再取得する
2. prospective filesのblob SHA / content hashをmanifest化する
3. Stage 0 production technical implementationを新規materializeする
4. Stage 0 independent implementationを別経路でmaterializeする
5. scientific seedを参照していないことをstatic auditする
6. technical fixture / technical-only seedだけを使うStage 0 authorization artifactを作成する
7. authorization後にStage 0 technical executionを行う

Stage 0 PASSだけではStage 1 scientific executionをauthorizeしない。Stage 1のexact observable dictionary、family hyperparameter space、model-selection rule、support / coverage / stability thresholds、resource ceilings、decision mappingを別prefreezeで固定してからStage 1 authorizationを検討する。

## 禁止事項

- G2-10 contract rescue
- G2-10 consumed seed rerun
- G2-10 reserved Stage 2 seed流用
- Stage 1 / 2 scientific seedの先行消費
- G2-11 outcome inspection
- mainへのmerge
