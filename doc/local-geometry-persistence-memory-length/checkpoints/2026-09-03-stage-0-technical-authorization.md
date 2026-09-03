# LGPML Stage 0 — Technical authorization

Date: 2026-09-03

Decision:

**`LGPML-S0-TECHNICAL-2026-09-03-v1 / STAGE0-TECHNICAL-AUTHORIZED`**

The complete Study contract and Stage 0 tooling were frozen at:

`b293acc5943fab9100f512ed7008dd46583be763`

Authorization is limited to technical fixtures and technical seed namespace `31809001..31809008`.

It does not authorize:

- Stage 1 seeds `31810001..31810256`
- Stage 2 seeds `31820001..31820384`
- G3-08 scientific inference
- protected depth-10 generation/read/peek/probe

The execution trigger must be a new commit changing only `authorizations/lgpml-stage0-v1-trigger.txt`. Source blobs are frozen in `STAGE_0_TECHNICAL_AUTHORIZATION.json`. Exactly one technical execution is authorized; same-version rerun is prohibited.

Stage 0 PASS does not authorize Stage 1. A separate fresh-free post-Stage-0 authorization review is mandatory.
