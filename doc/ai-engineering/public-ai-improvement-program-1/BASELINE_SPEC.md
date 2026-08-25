# PBAI-P1 Public AI Baseline Specification

Status: NOT-FROZEN  
Program: `PBAI-P1`

## 1. Purpose

candidate implementation前に、publicで実際に使用されているBao AIをengineering baselineとして再現可能に固定する。

Program start repository anchor `2db7c4d65771066e914f32cbc4116fcc3e9e386a`はdocumentation上のevidence cutoff anchorであり、**それだけではpublic AI baseline freezeではない**。deployment configurationと実際のdefault pathを確認してからfreezeする。

## 2. Required baseline fields

PBAI-B completion前に最低限次を記録する。

```text
baselineId
repositoryCommit
publicDeploymentSource/ref
rulesEngineCommit/identity
public/engine.js hash
public/ai.js hash
public/ai-weights.js hash
public/ai-config.js hash
public/ai-worker.js hash
default evaluation profile
default search implementation
hard settings
expert/mtaalamu settings
time-limit semantics
max-depth semantics
quiescence semantics
move-ordering semantics
transposition-table semantics
randomness / seed semantics
worker / fallback semantics
supported device classes
```

必要に応じてPWA/cache versionとUI difficulty mappingも記録する。

## 3. Baseline freeze gate

- actual public default path verified
- public difficulty names ↔ engine settings mapped
- relevant files hashed
- deterministic fixed-depth reproduction tested
- time-limited behavior measured separately from deterministic fixed-depth tests
- existing rule/AI/worker/tactical regressions pass
- known operational limitations recorded

## 4. Change rule

baseline freeze後にpublic AIが別経路で変更された場合、PBAI-P1の比較対象を黙って差し替えない。

- candidate developmentはfrozen baselineを保持する。
- live public version driftは別途記録する。
- 必要ならnew baseline versionを作り、candidate comparison matrixを明示する。

## 5. Current state

```text
baselineFrozen = false
baselineId = null
candidateImplementationAuthorized = false
```
