# 定石候補の証拠軸と判定表

生成日時: 2026-07-18T05:32:29.457Z

固定自己対局勝数、深い共通探索、有界強制終局、cross-method一致を別々の証拠軸として記録する。左から右へ単純加点せず、各軸が答える問いを限定する。

| 局面 | 着手 | 固定自己対局 | 深い探索 | 有界終局 | consensus | 証拠状態 |
| --- | --- | ---: | ---: | --- | --- | --- |
| P002 | `capture:namua:0:2:left:right::false` | 5/6 (#1) | 276 (#2, d8) | not-south-forced (9 ply) | no | `screened-out` |
| P002 | `capture:namua:0:2:right:left::false` | 3/6 (#2) | 999992 (#1, d8) | south-forced-win (9 ply) | yes | `bounded-forced-win-supported` |
| P003 | `capture:namua:0:2:left:right::false` | 5/6 (#1) | -302 (#4, d11) | unresolved (13 ply) | no | `screened-out` |
| P003 | `capture:namua:0:4:right:left::false` | 4/6 (#2) | -45 (#1, d11) | unresolved (13 ply) | yes | `deep-search-supported-bounded-unresolved` |
| P003 | `capture:namua:0:2:right:left::false` | 2/6 (#3) | -295 (#3, d11) | unresolved (13 ply) | no | `screened-out` |
| P003 | `capture:namua:0:4:left:right::false` | 0/6 (#4) | -173 (#2, d11) | unresolved (13 ply) | no | `screened-out` |

## 判定

- P002: `bounded-consensus-supported-no-promotion`。固定自己対局首位は`capture:namua:0:2:left:right::false`、深い探索首位・consensusは`capture:namua:0:2:right:left::false`。
- P003: `deep-consensus-supported-bounded-unresolved-no-promotion`。固定自己対局首位は`capture:namua:0:2:left:right::false`、深い探索首位・consensusは`capture:namua:0:4:right:left::false`。

P002は現ルール実装内の有界強制勝ちが最優先証拠となる。P003は深い探索首位とconsensusが一致する一方、13 ply有界終局は全候補未解決である。どちらも別ルール実装または人間対局検証がないため昇格しない。

## 運用規則

1. bounded terminal proof → deep common-depth search → cross-method stability → fixed-policy self-play
2. A fixed-self-play win-count leader is not called terminal-best, minimax-best, or theoretically best.
3. No row is promotion-eligible without a separate rules implementation or human-game validation, even when an engine-rules bounded win exists.

## 完全性

- candidates: 6
- fixed-self-play/deep-rank disagreements: 4
- promotion eligible: 0
- source sha256: `33f0e3f2b16e87759580f320a0007247218c667c50727b60931edd30209355e5`
- verification hash: `02590595d67b54b6e8d468d1a0e865af93432d89bfe51e85e95d5d8269d6fd39`
