# `PBAI-P3` — 証拠分離規則

状態: **`ACTIVE / CONTRACT-FROZEN / PRE-SUPPORT`**

Program: `PBAI-P3`

固定日: 2026-09-05

## 1. 科学証拠の上限

```text
allowed scientific evidence
= Research Generation 3 canonical evidence at or before
  479bc3d3a9b6c745e37a88529732180e8690d6b3

Research Generation 4 scientific evidence
= EXCLUDED
```

`main`はリポジトリの運用状態、現在の公開用source、命名規則、Program文書のintegration baseとして参照できます。`main`上のpost-cutoff研究内容は、candidateの科学証拠を拡張しません。

## 2. 科学判断と工学判断の分離

- Research Generation 3のformal conclusionはimmutableです。
- engineering benchmarkのPASS / FAILで過去Studyを再判定しません。
- scientific benchmarkとpublic-product decisionを別のdecision recordへ記録します。
- fresh engineering evidenceにはsource commit、contract、seed/root identity、artifact hashを付与します。

## 3. 過去Programの完了状態

```text
PBAI-P1 = COMPLETE / KEEP-AI-GEN2
PBAI-P2 = COMPLETE / KEEP-AI-GEN2
PBAI-C001..C009 = CLOSED
```

過去Programを再開・延長しません。過去候補のthreshold緩和、endpoint変更、seed追加、subgroup救済、negative control除外、cost上限変更、改名救済を行いません。

## 4. 保護split

development、validation、release holdoutは、結果を見る前に別々のnamespaceとして固定します。重複監査は少なくとも次を対象とします。

- seed
- game / paired opening
- full trajectory
- opening prefix
- authoritative RAW root identity

raw plyを独立標本として数えません。protected release holdoutをtuning、threshold選択、candidate選択へ使用しません。

## 5. contamination時の処理

未承認のvalidation / holdout、Research Generation 4、または結果依存の追加標本がcandidate判断へ混入した疑いがある場合、影響を受けた判断をfail-closedにします。消費済みevidenceを同一candidateの救済に再利用しません。

## 6. 公開AIとlineage

candidate、development実装、validation通過版、未配備の`ADOPT`版を`AI-GEN3`と呼びません。正式な`ADOPT`に加え、公開defaultとしての配備を完了した最初の新系統だけが`AI-GEN3`です。

## 7. 現在状態

```text
firewall status = ACTIVE / PASS
candidate inventory = PBAI-C010-v1 ONLY / FROZEN
candidate implementation = NOT AUTHORIZED
support execution = NOT AUTHORIZED
development evidence = NONE
validation evidence = NONE
release holdout evidence = NONE
public deployment = NOT AUTHORIZED
```
