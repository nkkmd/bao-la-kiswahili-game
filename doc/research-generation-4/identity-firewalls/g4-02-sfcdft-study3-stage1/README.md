# G4-02 SFCDFT-STUDY3 Stage 1 identity firewall

更新日: 2026-09-19  
状態: **`MATERIALIZED / IDENTITY-ONLY / SEED-FREE`**

このdirectoryは、Study 3 Stage 2 held-out executionでStudy 3 Stage 1 evidenceとのidentity collisionを除外するためのdurable firewallである。

materializationはStage 1 scientific seedを再読せず、canonical run `35396341311`で既に保存済みの384 sealed source artifactsだけを入力にした。Stage 1 selection membership、endpoint値、formal Stage 1 resultは入力にしていない。

provenance:

```text
source scientific run = 35396341311
source execution head = b2a70b198c343bf05b9c81ac15fa546858955cdf
seed-free materialization run = 35416648775
materialization artifact ID = 10575483751
materialization artifact digest = sha256:94727cef01134333011e5b8a43954e5cdd16286be32b38512268055bc5d8e46c
identity core SHA-256 = 3d8e9b9e175c63a864ea72a1cdc3b667feba2f216758a9325ebacba2c3c81cda
```

identity counts:

```text
sealed source records = 384
unique anchor-bounded source trajectory hashes = 384
unique first-16 opening-prefix hashes = 375
unique RAW-root hashes = 647
```

Stage 1 primary namespace `40511001..40511384` と未使用reserve namespace `41511001..41511384` はともにStage 2で再利用しない。Stage 1 sourceはanchor-bounded decision-prefix semanticsであり、このfirewallはtrajectory、first-16 opening prefix、RAW root、seed namespaceを併用する。

このdirectoryはscientific endpoint、effect direction、p-value、generalization/counterexample decisionを保存しない。
