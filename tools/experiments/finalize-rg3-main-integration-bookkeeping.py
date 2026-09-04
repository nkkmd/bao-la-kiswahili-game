#!/usr/bin/env python3
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path.cwd()
SOURCE_TIP = "0feaab24efdd92c3e094aae0fcc60256e90bd1a6"
PREVIOUS_MAIN = "fd6c8e2a4510d5937b47a87735854e8459b2646f"
PLAN_BLOB = "2bb90c11f1625f63f40a7eab8a3de7774505a1ac"
CHECKPOINT = Path("doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-main-integration-complete.md")
EXPECTED = {
    "README.md",
    "doc/FUTURE_RESEARCH_AGENDA.md",
    "doc/RESEARCH_INDEX.md",
    "doc/research-generation-3/CURRENT_STATUS.md",
    "doc/research-generation-3/FINAL_SYNTHESIS.md",
    "doc/research-generation-3/PROGRAM_FINAL_RESULT.json",
    "doc/research-generation-3/README.md",
    str(CHECKPOINT),
}


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, text):
    (ROOT / path).write_text(text, encoding="utf-8")


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, got {count}")
    return text.replace(old, new, 1)


def replace_regex_once(text, pattern, repl, label):
    out, count = re.subn(pattern, repl, text, count=1, flags=re.M)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one regex match, got {count}")
    return out


def git(*args):
    return subprocess.check_output(["git", *args], text=True).strip()


def main():
    # Root README
    p = "README.md"
    t = read(p)
    t = replace_once(
        t,
        "program statusは`CLOSED / MAIN INTEGRATION PENDING`。formal-completeな主要結果はG3-04 corridor/funnel、G3-07 geometry×search-instability association、G3-10 longitudinal geometry dynamics、G3-11 protected depth-10 exact holdout。technical-invalid Studyはnegative/null resultへ読み替えず、G3-12はformal generalization/counterexample Stage 2未実行のままtechnical-invalid closure。G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`。generation closureのmain統合は明示的指示待ち。",
        "program statusは`CLOSED / MAIN INTEGRATION COMPLETE`。formal-completeな主要結果はG3-04 corridor/funnel、G3-07 geometry×search-instability association、G3-10 longitudinal geometry dynamics、G3-11 protected depth-10 exact holdout。technical-invalid Studyはnegative/null resultへ読み替えず、G3-12はformal generalization/counterexample Stage 2未実行のままtechnical-invalid closure。G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`。generation-level closureは`research/g3-final-program-closure` tip `0feaab24efdd92c3e094aae0fcc60256e90bd1a6`から`main`へforceなしfast-forward統合済み。",
        "root README RG3 closure integration status",
    )
    write(p, t)

    # Future agenda
    p = "doc/FUTURE_RESEARCH_AGENDA.md"
    t = read(p)
    t = replace_once(
        t,
        "Research Generation 3: **Closed on closure branch / core agenda G3-01..G3-12 complete / final synthesis materialized / G3-H01 deferred non-blocking / main integration pending explicit instruction (2026-09-04)**",
        "Research Generation 3: **Closed / core agenda G3-01..G3-12 complete / final synthesis materialized / G3-H01 deferred non-blocking / main integration COMPLETE FAST-FORWARD (2026-09-04)**",
        "future agenda header",
    )
    t = replace_once(
        t,
        "Research Generation 3 closure branchの`main` integrationは明示的ユーザー指示まで行わない。次のResearch Generationまたは新規Studyは、このclosureを救済・completionするものではなく、別のprospective authorizationを必要とする。",
        "Research Generation 3 closure branchは、明示的ユーザー指示に基づき`main`へ`COMPLETE / FAST-FORWARD / force=false`で統合した。次のResearch Generationまたは新規Studyは、このclosureを救済・completionするものではなく、別のprospective authorizationを必要とする。",
        "future agenda closure integration paragraph",
    )
    write(p, t)

    # Research index
    p = "doc/RESEARCH_INDEX.md"
    t = read(p)
    t = replace_once(t, "**状態:** `CLOSED / MAIN INTEGRATION PENDING`", "**状態:** `CLOSED / MAIN INTEGRATION COMPLETE / FAST-FORWARD`", "research index status")
    t = replace_once(t, "`main` integrationは明示的ユーザー指示まで実行しない。", "`main` integrationは`COMPLETE / FAST-FORWARD / source tip 0feaab24efdd92c3e094aae0fcc60256e90bd1a6 / previous main fd6c8e2a4510d5937b47a87735854e8459b2646f / force=false`として完了した。", "research index integration line")
    anchor = "- [`research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md`](research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md)\n"
    t = replace_once(t, anchor, anchor + "- [`research-generation-3/checkpoints/2026-09-04-research-generation-3-main-integration-complete.md`](research-generation-3/checkpoints/2026-09-04-research-generation-3-main-integration-complete.md)\n", "research index integration checkpoint link")
    write(p, t)

    # RG3 README
    p = "doc/research-generation-3/README.md"
    t = read(p)
    t = replace_regex_once(
        t,
        r"^Status = CLOSED / core agenda G3-01\.\.G3-12 complete / FINAL_SYNTHESIS materialized / MAIN INTEGRATION PENDING EXPLICIT USER INSTRUCTION$",
        "Status = CLOSED / core agenda G3-01..G3-12 complete / FINAL_SYNTHESIS materialized / MAIN INTEGRATION COMPLETE FAST-FORWARD",
        "RG3 README top status",
    )
    anchor = "- [`checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md`](checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md) — final pre-main repository/document consistency audit after documentation polish\n"
    t = replace_once(t, anchor, anchor + "- [`checkpoints/2026-09-04-research-generation-3-main-integration-complete.md`](checkpoints/2026-09-04-research-generation-3-main-integration-complete.md) — generation-level closure main fast-forward integration / post-integration bookkeeping record\n", "RG3 README checkpoint link")
    write(p, t)

    # RG3 current status
    p = "doc/research-generation-3/CURRENT_STATUS.md"
    t = read(p)
    t = replace_once(
        t,
        "Program status = CLOSED / core agenda G3-01..G3-12 complete / final synthesis materialized / main integration pending explicit user instruction",
        "Program status = CLOSED / core agenda G3-01..G3-12 complete / final synthesis materialized / main integration COMPLETE / FAST-FORWARD",
        "RG3 current top status",
    )
    t = replace_once(
        t,
        "Main integration = NOT AUTHORIZED / NOT PERFORMED / explicit user instruction required",
        "Main integration = COMPLETE / FAST-FORWARD / source tip 0feaab24efdd92c3e094aae0fcc60256e90bd1a6 / previous main fd6c8e2a4510d5937b47a87735854e8459b2646f / force=false",
        "RG3 current closure integration",
    )
    anchor = "- `checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md`\n"
    t = replace_once(t, anchor, anchor + "- `checkpoints/2026-09-04-research-generation-3-main-integration-complete.md`\n", "RG3 current integration checkpoint")
    write(p, t)

    # Final synthesis: preserve scientific synthesis, update repository integration boundary only.
    p = "doc/research-generation-3/FINAL_SYNTHESIS.md"
    t = read(p)
    t = replace_once(
        t,
        "`main` integrationは本synthesisでは実行しない。明示的ユーザー指示までclosure branch上で保持する。",
        "本synthesis materialization後、明示的ユーザー指示に基づきclosure branch tip `0feaab24efdd92c3e094aae0fcc60256e90bd1a6`をprevious main `fd6c8e2a4510d5937b47a87735854e8459b2646f`へforceなしfast-forwardし、generation-level `main` integrationを完了した。科学的synthesis・formal decision・protected evidence boundaryは変更していない。",
        "final synthesis integration boundary",
    )
    write(p, t)

    # Machine-readable final state
    p = "doc/research-generation-3/PROGRAM_FINAL_RESULT.json"
    data = json.loads(read(p))
    if data.get("mainIntegration") != "PENDING-EXPLICIT-USER-AUTHORIZATION":
        raise RuntimeError("unexpected pre-bookkeeping mainIntegration state")
    if data.get("mainIntegrationAuthorized") is not False:
        raise RuntimeError("unexpected pre-bookkeeping mainIntegrationAuthorized state")
    data["mainIntegration"] = "COMPLETE-FAST-FORWARD"
    data["mainIntegrationAuthorized"] = True
    data["mainIntegrationAuthorizationSource"] = "explicit-user-instruction-2026-09-04"
    rc = data.setdefault("repositoryClosure", {})
    rc["mainIntegrationComplete"] = True
    rc["integrationMethod"] = "FAST-FORWARD"
    rc["force"] = False
    rc["previousMainSha"] = PREVIOUS_MAIN
    rc["integratedClosureTip"] = SOURCE_TIP
    rc["integrationCheckpoint"] = str(CHECKPOINT)
    write(p, json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    # Integration checkpoint
    run_id = os.environ.get("GITHUB_RUN_ID", "unknown")
    checkpoint = f"""# 2026-09-04 — Research Generation 3 main integration complete

## Decision

**`COMPLETE / FAST-FORWARD / force=false`**

Research Generation 3 core program closureを、明示的ユーザー指示に基づいて`main`へ統合した。

```text
Repository = nkkmd/bao-la-kiswahili-game
Program = Bao Third-Generation Research Program
Program lifecycle = CLOSED
Closure branch = research/g3-final-program-closure
Previous main = {PREVIOUS_MAIN}
Integrated closure branch tip = {SOURCE_TIP}
Integration method = FAST-FORWARD
Force = false
Bookkeeping workflow run = {run_id}
Scientific execution = NONE
Scientific seed access = NONE
```

## Integration semantics

このintegrationはgeneration-level synthesis / closure documentationのrepository統合であり、新しいscientific authorizationではない。

- G3-01..G3-12のformal dispositionは変更しない。
- G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`のまま。
- G3-11 depth-10 same-evidence rerunはauthorizeしない。
- depth 11はauthorize / accessしない。
- G3-12 Stage 1 repair/replayはauthorizeしない。
- G3-12 Stage 2はauthorize / execute / accessしない。
- G2-12 estimator scientific reuseはauthorizeしない。
- symmetry/canonicalization rescueはauthorizeしない。

## Historical records

Pre-main closure review / closure decision / pre-main consistency checkpointsは、その時点のprospective repository stateを記録するhistorical provenanceとして改変しない。current-facing statusと`PROGRAM_FINAL_RESULT.json`だけをpost-integration stateへ進めた。

`doc/research-generation-3/PROGRAM_PLAN.md`はprospective historical planとしてbyte-identicalに保存する。

## Final repository expectation

Bookkeeping完了後のfinal treeにはone-time integration bookkeeping workflow/helper/triggerを残さない。変更対象はcurrent-facing central documents、generation final-state records、および本integration checkpointだけとする。
"""
    CHECKPOINT.parent.mkdir(parents=True, exist_ok=True)
    CHECKPOINT.write_text(checkpoint, encoding="utf-8")

    # Audits against the actually integrated closure tip.
    if git("hash-object", "doc/research-generation-3/PROGRAM_PLAN.md") != PLAN_BLOB:
        raise RuntimeError("historical PROGRAM_PLAN.md changed")
    names = set(filter(None, git("diff", "--name-only", SOURCE_TIP).splitlines()))
    if names != EXPECTED:
        raise RuntimeError(f"unexpected bookkeeping diff scope: missing={sorted(EXPECTED-names)} extra={sorted(names-EXPECTED)}")
    subprocess.check_call(["git", "diff", "--check", SOURCE_TIP])
    print("RG3 main integration bookkeeping audit PASS")


if __name__ == "__main__":
    main()
