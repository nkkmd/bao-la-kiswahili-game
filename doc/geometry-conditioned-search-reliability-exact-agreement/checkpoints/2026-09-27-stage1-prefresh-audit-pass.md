# G4-09 / GCSREA-STUDY1 — Stage 1 pre-fresh audit PASS

Date: 2026-09-27  
Stage: `GCSREA-S1-DEVELOPMENT-2026-09-27-v1`  
Audit class: `PRE-FRESH / NON-SCIENTIFIC`  
Disposition: **`PASS / READY-FOR-FINAL-ONE-SHOT-AUTHORIZATION-REVIEW`**

## Canonical audit execution

```text
workflow run = 36323915432 / attempt 1 / success
job = 108632898222
source SHA = 784b98f181e49ac8cb2602da51a0980e0de71e27
artifact ID = 10933925678
artifact name = gcsrea-stage1-prefresh-36323915432
artifact ZIP SHA-256 = 22caedb85cd7bc7da2aa09e52488c3ec53eea3698cb8b03d7b56cc1514e3428d
fresh scientific seed reads = 0
actual G4-05 search-vs-exact measurements = 0
G4-10 depth-11 access = 0
public AI change = false
```

## Static / source gates

次をfresh access前に確認した。

```text
Node syntax = PASS
Stage 1 protected-boundary static audit = PASS
all required upstream artifact ZIP downloads = PASS
all upstream artifact ZIP SHA-256 checks = PASS
full identity-firewall rematerialization = PASS
fixed-8 G4-05 exact-oracle integrity preflight = PASS
```

最初のaudit run `36323702322` は、G3-07 / G4-01の既存identity digestが使用するnewline-terminated legacy digest grammarを新規verifierが同じ方法で再計算していなかったため、fresh access前にfail closedした。これはscientific resultではなくtechnical verifier mismatchであり、fresh G4-09 seed readは0だった。

修正ではupstreamで既に凍結されているdigest grammarへverifierを合わせただけで、G4-09のseed、population、selection、geometry、search endpoint、support gate、resource ceiling、formal boundaryを変更していない。

## Materialized upstream freshness firewall

監査可能なupstream identityを実artifact / repository canonical identityから再物質化した。

```text
merged excluded seed set size = 16640
merged trajectory set size = 5489
merged opening-prefix set size = 4706
merged RAW-root set size = 185680
```

Canonical set digests:

```text
seed = c0f125760efe45516bfee2f1c7edc38d7db7f086e570e0fa1eb2b93025780f65
trajectory = 9477981d6e4e69769e990a33fb2649b5cc8a3fbeaa99555c7288ea64b4a4702b
opening prefix = 920267c91cf780f2d5e4141bd1bc8a4251cafb08d2a74f0a5622040faaa29bbb
RAW root = 7ae36d1477a2250d0fd8c2ae8ce95e4671c11d695cd5091bcb2207186ac435b1
combined firewall digest = 45980c3d1207e3f939f7dbf3c83bde41c76d472b15f7aab504ae91dd274d71df
```

確認した主なidentity source:

- G2-02 Stage 1 / Stage 2 full game identity artifacts
- G3-07 Stage 1 repository identity / Stage 2 canonical artifact
- G3-10 Stage 1 / Stage 2 repository identity
- G4-01 Stage 1R SILGM recovery source identity
- G4-03 Stage 1 / Stage 2 selected scientific identity
- G4-04 Stage 1 / Stage 2 identity-only artifacts
- G4-07 Stage 1 / Stage 2 identity-only artifacts
- G4-08 Stage 1 v3 / Stage 2 full identity-only artifacts

完全identityを監査できないhistorical classは非重複と推測せず、frozen seed namespace全体をquarantineしたままにする。

## G4-05 fixed-8 exact-oracle integrity preflight

G4-05 / G4-06で固定された8 exact microdomainを、保存済み `(seed, ply, rootStateKey)` からproduction / independentの両経路で再物質化・exact再計算した。

すべてで次がupstream canonical recordと完全一致した。

```text
rootStateKey
stateCount / edgeCount
stateSetSha256
transitionSetSha256
solutionSha256
rootStatus
rootAbsoluteWinner
rootDtf
rootOptimalMoveKeys
```

Preflight result:

```text
disposition = EXACT-ORACLE-INTEGRITY-PREFLIGHT-PASS
fixed domain count = 8
all production / independent upstream agreement = true
actual G4-09 search-vs-exact measurements = 0
G4-05 candidate rescan = 0
G4-05 domain replacement = 0
fresh G4-09 Stage 1 seed reads = 0
G4-10 depth-11 access = 0
public AI change = false
core SHA-256 = 924922e5072cfe19facb954ce24cf8207d15a38f3fb861e08a4e4d5f1daf8a7c
```

このpreflightはupstream oracle integrityだけを確認したもので、G4-09 exact-agreement scientific resultを生成していない。

## Final pre-fresh boundary

このcheckpoint時点でも次は未実行である。

```text
40913001..40913768 fresh seed read = 0 / 768
Stage 1 fresh scientific execution = NOT STARTED
actual fixed-8 search-vs-exact agreement measurement = 0
Stage 2 seed access = 0
G4-10 depth-11 access = 0
public AI change = false
```

次に許可されるのは、current branchのsourceを完全SHA / Git blob SHAでfreezeし、one-shot execution authorizationを別commitとして固定することだけである。

## No-rescue boundary

fresh Stage 1 execution開始後は同versionでrerun、seed extension、replacement、threshold relaxation、geometry/search family変更、resource ceiling relaxationを認可しない。technical failureは`STAGE1-TECHNICAL-INVALID`としてfail closedする。
