# FDERT-STUDY1 — Stage 1 resource planning

更新日: 2026-09-28  
対象Stage候補: `FDERT-S1-PROTECTED-EXACT-HOLDOUT-2026-09-28-v1`

## 1. 目的

protected depth-11 scientific evidenceへアクセスする前に、G4-10の計算資源上限と実行環境をoutcome-blindに固定する。

本計画の数値はdepth-11のpartial enumeration、count probe、RSS probe、search-depth artifact、G2-12 estimatorを用いて決めていない。

## 2. 計画に使用した許可済み情報

### Historical exact telemetry

G3-11のclosed depth-10 Studyで既に公開・確定しているtelemetryだけをresource planning referenceとして利用する。

```text
production peak RSS = 2269167616 bytes
independent peak RSS = 2460262400 bytes
production elapsed = 108.530371328 seconds
independent elapsed = 117.592820799 seconds
uncompressed scientific artifact = approximately 369 MB
```

これらはdepth-11 expected valueやgrowth estimatorへ変換しない。

### Current execution environment

GitHub-hosted public-repository standard `ubuntu-24.04` runnerを第一候補とする。2026-09-28時点のGitHub公式仕様では、このrunner classは4 CPU、16 GB RAM、14 GB SSDである。

GitHub-hosted jobには6時間のexecution limitがあるため、productionとindependent full re-enumerationを別jobに分離する。

## 3. Frozen Stage 1 resource ceiling candidate

protected access前にStage 1 specへ次を固定する。

```text
max cumulative distinct RAW states = 2000000
max depth-labelled edges = 12000000
max parent expansions = 2000000
max move evaluations = 12000000
max cumulative tree-node occurrences = 50000000000
max resident set bytes = 12884901888 (12 GiB)
max wall-clock seconds per scientific enumerator = 7200 (2 hours)
max uncompressed production scientific artifact bytes = 2147483648 (2 GiB)
max Node old-space MiB = 10240
```

### 設計理由

- state / edge / tree work capsはG3-11で既にoutcome-blindに使用したhardened ceilingを維持し、depth-11 outcomeに合わせて拡張しない。
- RSS ceilingは16 GB runnerに対して約4 GBのOS / runtime / upload余裕を残す。
- Node old-spaceは10 GiBに固定し、runner全体をmemory exhaustionへ追い込まない。
- wall clockはproduction / independentそれぞれ2時間とし、各jobのadministrative timeoutには追加のartifact処理余裕を置く。
- uncompressed artifact capは2 GiBとし、14 GB runner diskに十分な余白を残す。

これらはexpected depth-11 valuesではなく、研究をどこまで試みるかというadministrative / engineering ceilingである。

## 4. Artifact policy

大容量production materializationを二重uploadしない。

予定経路:

1. production jobがcompleteまたはfail-closedした直後にproduction artifactを1回だけdurable uploadする。
2. independent jobはそのproduction artifactをdownloadして検証する。
3. independent終了後は、full materializationを再uploadせず、formal result / manifest / compact summaryだけを別artifactとして保存する。
4. repositoryへのcanonical mirrorはartifactを外部から検証した後に行う。

production artifactのdurable uploadが失敗した場合、production computationがcompleteでもexact scientific resultへ昇格しない。artifact persistence failureは`TECHNICAL-INVALID`とする。

## 5. Enumeration hardening requirement

G3-11 production enumeratorは、state / edge JSONL materialization時にlayer全体を巨大な文字列へ一度展開する箇所を持つ。depth-11では、scientific capより先にJavaScript heapを浪費する可能性がある。

G4-10 Stage 1では、科学的semanticsを変えずに次を満たすStudy-owned production enumeratorを使用する。

- JSONL rowをbounded-memoryで逐次書き込みする。
- file SHA-256をchunked readで計算する。
- artifact byte capをrow/layer materialization前にfail closedできる。
- incomplete layerのtemporary materializationをcomplete layerとして扱わない。
- state identity、move identity、set/edge digest grammar、tree/arrival accountingはG3-11と互換に保つ。

このhardeningはStage 1 access前に新しいtechnical Stageでshallow fixture検証する。

## 6. Independent verification resource policy

materially separate independent full re-enumerationをexact classificationの必須条件とする。

Independent implementationはproduction enumeratorをimportしない。production artifactについてはchunked file hashとcanonical summary bindingを確認し、scientific topologyはindependent full re-enumerationとexactに照合する。

Production completeでもindependentがfrozen resource ceiling内でcompleteできなければformal decisionは`NON-ESTIMABLE`または、integrityを確認できないfailureであれば`TECHNICAL-INVALID`とする。production-only exact promotionは行わない。

## 7. No-rescue

最初のprotected depth-11 access後は次を変更しない。

- resource ceiling
- Node heap ceiling
- target depth
- artifact cap
- wall clock
- formal target family
- production / independent requirement
- execution environment class

resource不足を確認した後にlarge runner、自前machine、cap extensionへ切り替えてsame Study/versionを救済しない。
