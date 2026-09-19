# G4-02 SFCDFT-STUDY2 identity firewall

更新日: 2026-09-19  
状態: **`MATERIALIZED / IDENTITY-ONLY / SEED-FREE`**

このdirectoryは、`SFCDFT-STUDY3`以降でStudy 2 Stage 1 evidenceとのidentity collisionを除外するためのdurable firewallである。

materializationはStudy 2 scientific seedを再読せず、GitHub Actions run `35345143248`で既に保存済みの382 sealed source artifactsだけを入力にした。

provenance:

```text
source scientific run = 35345143248
source execution head = 8c84f2cda1a62f812f030ef319341683a4d77e54
seed-free materialization run = 35388490684
materialization artifact ID = 10565022669
materialization artifact digest = sha256:5b899255bbcf658b078185a03959432282a404a47ccce9c3dc741d5d3797efe3
identity core SHA-256 = 7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc
```

identity counts:

```text
sealed source records = 382
unique source trajectory hashes = 380
unique first-16 opening-prefix hashes = 372
unique RAW-root hashes = 657
failed Study 2 slots without sealed identity = 40411112 / 40411312
```

failed slotsはseed namespace exclusionで保護する。Study 2のtrajectoryはfull-trajectory semantics、Study 3はanchor-bounded decision-prefix semanticsであるため、旧trajectory hashの非一致だけからprefix-level independenceを主張しない。first-16 opening prefix、RAW root、seed namespaceを主要な監査可能firewallとして併用する。

このdirectoryはscientific endpoint、effect direction、p-value、generalization/counterexample decisionを保存しない。
