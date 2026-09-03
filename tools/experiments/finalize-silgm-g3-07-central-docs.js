'use strict';

const fs = require('fs');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const paths = {
  root: 'README.md',
  index: 'doc/RESEARCH_INDEX.md',
  agenda: 'doc/FUTURE_RESEARCH_AGENDA.md',
  rg3Readme: 'doc/research-generation-3/README.md',
  rg3Status: 'doc/research-generation-3/CURRENT_STATUS.md',
  programPlan: 'doc/research-generation-3/PROGRAM_PLAN.md',
};

const EXPECTED_PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac';
const BRANCH = 'research/g3-07-search-instability-local-geometry-mechanism';
const RESULT_SHA = '05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9';

function need(cond, msg) {
  if (!cond) throw new Error(msg);
}
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, s) { fs.writeFileSync(p, s); }
function replaceOne(s, re, replacement, label) {
  const matches = s.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || [];
  need(matches.length === 1, `${label}: expected exactly one match, got ${matches.length}`);
  return s.replace(re, replacement);
}
function appendOnce(s, marker, block) {
  if (s.includes(marker)) return s;
  return s.replace(/\s*$/, '') + '\n\n' + block.trim() + '\n';
}
function gitBlob(p) {
  return execFileSync('git', ['hash-object', p], { encoding: 'utf8' }).trim();
}
function sha256(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

function updateRoot() {
  let s = read(paths.root);
  const currentLine = '- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05 / G3-06は`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04は`CLOSED / FORMAL-COMPLETE`。G3-07 / `SILGM-STUDY1`も`CLOSED / FORMAL-COMPLETE`となり、Stage 2では8 promoted candidates中7 estimable、3 `CONFIRMED` / 4 `NOT-CONFIRMED` / 1 `NON-ESTIMABLE`。3 confirmationsはいずれもG1 root legal width × E3 ranking-preorder changeの`HIGHER-IN-HIGH`で、depth / node-budget / quiescenceの各peer contrastに対するbounded non-causal association。protected depth-10はsealed。次はseparate post-G3-07 G3-08 authorization reviewで、G3-08は未承認。';
  s = replaceOne(s, /^- \[`doc\/research-generation-3\/CURRENT_STATUS\.md`\]\(doc\/research-generation-3\/CURRENT_STATUS\.md\):.*$/m, currentLine, 'root current-status bullet');
  const marker = '<!-- SILGM-G3-07-CLOSURE:ROOT-README -->';
  if (!s.includes(marker)) {
    const anchor = currentLine;
    need(s.includes(anchor), 'root README anchor missing after replacement');
    const extra = `${marker}\n- [\`doc/search-instability-local-geometry-mechanism/README.md\`](doc/search-instability-local-geometry-mechanism/README.md): Research Generation 3 \`G3-07\` / \`SILGM-STUDY1\` のformal-complete研究入口。\n- [\`doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md\`](doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md): G3-07のStage 0–2 execution、8 candidateのformal判定、3 confirmations、interpretation boundaryの正本。\n- [\`doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md\`](doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md): G3-07のsource binding、seed、Actions provenance、exact hashes、no-rescue / protected-evidence boundary。\n- [\`doc/research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md\`](doc/research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md): G3-07 \`CLOSED / FORMAL-COMPLETE\` program decision。G3-08は自動authorizeされない。\n- [\`doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md\`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md): RG3側のG3-07 closure checkpoint。main integrationは未実施。`;
    s = s.replace(anchor, anchor + '\n' + extra);
  }
  write(paths.root, s);
}

function updateRg3Readme() {
  let s = read(paths.rg3Readme);
  s = replaceOne(s, /^Status = .*$/m,
    'Status = ACTIVE / G3-07 SILGM-STUDY1 CLOSED FORMAL-COMPLETE / POST-G3-07 G3-08 CURRENT-STATE REVIEW REQUIRED / G3-08 NOT AUTHORIZED',
    'RG3 README status');
  const g306 = 'G3-06 no-rescue boundary = CROSSED / ACTIVE';
  need(s.includes(g306), 'RG3 README G3-06 anchor missing');
  if (!s.includes('G3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE')) {
    s = s.replace(g306, `${g306}\nG3-07 program review = G3-07-AUTHORIZED\nG3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE\nG3-07 Stage 0 = STAGE0-PASS\nG3-07 Stage 1 = STAGE1-PASS / 1 authorized / 1 actual / seed CONSUMED\nG3-07 Stage 2 = STAGE2-PASS / 1 authorized / 1 actual / seed CONSUMED\nG3-07 formal record = 8 promoted / 7 estimable / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE\nG3-07 confirmed family = G1 ROOT-LEGAL-WIDTH x E3 RANKING-PREORDER-CHANGE / HIGHER-IN-HIGH under SC1 depth, SC2 node-budget, SC3 quiescence\nG3-07 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED\nG3-08 = NOT AUTHORIZED / separate post-G3-07 current-state review required`);
  }
  const readAnchor = '- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state';
  need(s.includes(readAnchor), 'RG3 README read-first anchor missing');
  const readMarker = '<!-- SILGM-G3-07-CLOSURE:RG3-READ-FIRST -->';
  if (!s.includes(readMarker)) {
    s = s.replace(readAnchor, `${readAnchor}\n${readMarker}\n- [\`../search-instability-local-geometry-mechanism/README.md\`](../search-instability-local-geometry-mechanism/README.md) — G3-07 formal-complete Study入口\n- [\`../search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md\`](../search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md) — G3-07 formal result / interpretation boundary正本\n- [\`../search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md\`](../search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md) — G3-07 reproducibility provenance\n- [\`../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md\`](../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md) — G3-07 program closure / G3-08 not auto-authorized`);
  }
  s = appendOnce(s, '<!-- SILGM-G3-07-CLOSURE:RG3-README -->', `
<!-- SILGM-G3-07-CLOSURE:RG3-README -->
## G3-07 formal closure

G3-07は\`SILGM-STUDY1\`として、Stage 0 \`STAGE0-PASS\`、fresh Stage 1 \`STAGE1-PASS\`、held-out Stage 2 \`STAGE2-PASS\`まで完了し、\`CLOSED / FORMAL-COMPLETE\`で閉じた。

Stage 1は24 Namua + 24 Mtajiから8 formal hypothesesをpromotionした。Stage 2はfresh 36 Namua + 36 Mtajiでexactly one authorized executionを行い、7 estimable / 1 non-estimableとなった。Holm-Bonferroni FWER 1/20後、次の3 candidateが\`CONFIRMED / HIGHER-IN-HIGH\`となった。

1. depth × E3 ranking-preorder change × G1 root legal width
2. node-budget × E3 ranking-preorder change × G1 root legal width
3. quiescence × E3 ranking-preorder change × G1 root legal width

これはfrozen population / RAW-only relative depth 5 / frozen peer-search contrasts内のbounded non-causal associationである。root widthがsearch instabilityを因果的に生む、より深い/大きい/高quiescence searchが正しい、ranking changeが悪手を意味する、human/game-theoretic difficultyを示す、とは解釈しない。

残るpromoted hypothesesは4 \`NOT-CONFIRMED\` / 1 \`NON-ESTIMABLE\`。救済・threshold変更・seed extension・same-evidence rerunは行わない。

Protected standard-initial RAW-root complete exact depth-10 holdoutは\`SEALED / NOT GENERATED / NOT READ / NOT PEEKED\`のままである。

## Post-G3-07 boundary

Historical plan上の次候補G3-08 — Local Geometry Persistence / Memory-Length Study 1 は**自動authorizeされない**。G3-08を開始する場合は、G3-07 closure後のcurrent repository stateを用いたseparate authorization reviewが必要である。

G3-07 research branchのmain integrationもStudy closureではauthorizeされない。ユーザーの明示的指示があるまで\`main\`へ統合しない。
`);
  write(paths.rg3Readme, s);
}

function updateRg3Status() {
  let s = read(paths.rg3Status);
  s = replaceOne(s, /^Program status = .*$/m,
    'Program status = ACTIVE / G3-07 SILGM-STUDY1 CLOSED FORMAL-COMPLETE / POST-G3-07 G3-08 REVIEW REQUIRED / G3-08 NOT AUTHORIZED',
    'RG3 CURRENT_STATUS program status');
  const blockRe = /^G3-07 program review = G3-07-AUTHORIZED\nG3-07 = .*\nG3-07 fresh Stage 1 = .*$/m;
  s = replaceOne(s, blockRe,
    'G3-07 program review = G3-07-AUTHORIZED\nG3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE\nG3-07 Stage 0 = STAGE0-PASS\nG3-07 Stage 1 = STAGE1-PASS / 1 authorized / 1 actual / seeds CONSUMED\nG3-07 Stage 2 = STAGE2-PASS / 1 authorized / 1 actual / seeds CONSUMED\nG3-07 formal record = 8 promoted / 7 estimable / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE\nG3-07 confirmed family = G1 ROOT-LEGAL-WIDTH x E3 RANKING-PREORDER-CHANGE / HIGHER-IN-HIGH under SC1/SC2/SC3\nG3-07 no-rescue boundary = CROSSED / CLOSED\nG3-08 = NOT AUTHORIZED / separate post-G3-07 current-state authorization review required',
    'RG3 CURRENT_STATUS G3-07 block');
  s = replaceOne(s, /^Active scientific research branch = .*$/m,
    `Active scientific research branch = none / ${BRANCH} scientifically CLOSED and pending explicit user decision on integration`,
    'RG3 CURRENT_STATUS active branch');
  s = replaceOne(s, /^Next scientific action = .*$/m,
    'Next scientific action = separate post-G3-07 current-state G3-08 authorization review; do not auto-start G3-08',
    'RG3 CURRENT_STATUS next action');
  s = appendOnce(s, '<!-- SILGM-G3-07-CLOSURE:RG3-STATUS -->', `
<!-- SILGM-G3-07-CLOSURE:RG3-STATUS -->
## G3-07 formal closure

G3-07 \`SILGM-STUDY1\` is \`CLOSED / FORMAL-COMPLETE\`.

```text
Stage 1 = STAGE1-PASS / 24 Namua + 24 Mtaji / 8 promoted
Stage 2 = STAGE2-PASS / 36 Namua + 36 Mtaji
formal = 7 estimable / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
Stage 2 canonical result SHA-256 = ${RESULT_SHA}
Stage 2 selection exact = true
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED
```

Confirmed candidate identities are separately retained, not combined into a new omnibus test:

1. depth × E3 ranking-preorder change × G1 root legal width / \`HIGHER-IN-HIGH\`
2. node-budget × E3 ranking-preorder change × G1 root legal width / \`HIGHER-IN-HIGH\`
3. quiescence × E3 ranking-preorder change × G1 root legal width / \`HIGHER-IN-HIGH\`

Canonical records:

- \`../search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md\`
- \`../search-instability-local-geometry-mechanism/CURRENT_STATUS.md\`
- \`../search-instability-local-geometry-mechanism/DECISION_REGISTER.md\`
- \`../search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md\`
- \`../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md\`
- \`checkpoints/2026-09-03-g3-07-formal-complete-closure.md\`

G3-08 remains \`NOT AUTHORIZED\`; a separate post-G3-07 current-state review is required.
`);
  write(paths.rg3Status, s);
}

function updateAgenda() {
  let s = read(paths.agenda);
  s = replaceOne(s, /^Research Generation 3: \*\*.*\*\*$/m,
    'Research Generation 3: **Active / G3-07 `SILGM-STUDY1` closed `FORMAL-COMPLETE` / 3 `CONFIRMED`, 4 `NOT-CONFIRMED`, 1 `NON-ESTIMABLE` formal candidates / next action is separate post-G3-07 current-state G3-08 authorization review / G3-08 NOT AUTHORIZED (2026-09-03)**',
    'FUTURE_RESEARCH_AGENDA RG3 status');
  const heading = '### 2026-09-03 Research Generation 3 current update';
  need(s.includes(heading), 'agenda current update heading missing');
  const marker = '<!-- SILGM-G3-07-CLOSURE:FUTURE -->';
  if (!s.includes(marker)) {
    const paragraph = `${marker}\nG3-07 \`SILGM-STUDY1\`はLGTGMIV F1-F5 / RAW-only / relative depth 5のformal-eligible geometryと、depth / node-budget / quiescenceの3 peer search-condition perturbationに対するE1–E5 search-output changeとのbounded non-causal associationをprospectively検証して完了した。Stage 1 fresh 24 Namua + 24 Mtajiから8 candidateをpromotionし、Stage 2 fresh 36 Namua + 36 Mtajiをexactly one authorized formal executionで測定した。Stage 2は\`STAGE2-PASS\`、7 estimable / 1 non-estimable。Holm-Bonferroni FWER 1/20後、depth・node-budget・quiescenceの各contrastでG1 root legal width × E3 ranking-preorder changeが\`CONFIRMED / HIGHER-IN-HIGH\`となった。残りは4 \`NOT-CONFIRMED\` / 1 \`NON-ESTIMABLE\`。これはroot legal widthがsearch instabilityを因果的に生む、より強いsearch条件が正しい、ranking changeが悪手を意味する、game-theoretic / human difficultyを示す、という結論ではない。Stage 1/2 seedはconsume済みでsame-evidence rerun / seed extension / candidate rescueを行わない。protected depth-10 holdoutは\`SEALED / NOT GENERATED / NOT READ / NOT PEEKED\`のまま。historical plan上のG3-08は自動authorizeされず、separate post-G3-07 current-state reviewが必要。G3-07のmain integrationも明示的ユーザー指示までは行わない。`;
    s = s.replace(heading, `${heading}\n\n${paragraph}`);
  }
  write(paths.agenda, s);
}

function updateIndex() {
  let s = read(paths.index);
  s = appendOnce(s, '<!-- SILGM-G3-07-CLOSURE:RESEARCH-INDEX -->', `
<!-- SILGM-G3-07-CLOSURE:RESEARCH-INDEX -->
### G3-07 — Search Instability / Local Geometry Mechanism Study 1

**Study ID:** \`SILGM-STUDY1\`  
**Status:** \`CLOSED / FORMAL-COMPLETE\`

G3-07はLGTGMIV F1-F5 / RAW-only / relative depth 5のbounded local geometryと、depth・node-budget・quiescenceのpeer search-condition perturbation間で生じるbest-move / TopSet / ranking / score-gap / PV変化のassociationをprospectively検証した。

Stage 1はfresh 24 Namua + 24 Mtajiで\`STAGE1-PASS\`、15 contrast×endpoint slotsから8 candidateをpromotion。Stage 2はfresh 36 Namua + 36 Mtajiで\`STAGE2-PASS\`、7 estimable / 1 non-estimable、Holm-Bonferroni FWER 1/20後に3 candidateを\`CONFIRMED\`した。

Confirmed:

1. depth × E3 ranking-preorder change × G1 root legal width / \`HIGHER-IN-HIGH\`
2. node-budget × E3 ranking-preorder change × G1 root legal width / \`HIGHER-IN-HIGH\`
3. quiescence × E3 ranking-preorder change × G1 root legal width / \`HIGHER-IN-HIGH\`

その他は4 \`NOT-CONFIRMED\` / 1 \`NON-ESTIMABLE\`。formal resultはcandidate-levelのbounded non-causal associationに限定し、root legal widthのcausal mechanism、objective-best correctness、game-theoretic difficulty、human difficulty、depth >5 generalizationへ拡張しない。

Canonical records:

- [\`search-instability-local-geometry-mechanism/README.md\`](search-instability-local-geometry-mechanism/README.md)
- [\`search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md\`](search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md)
- [\`search-instability-local-geometry-mechanism/CURRENT_STATUS.md\`](search-instability-local-geometry-mechanism/CURRENT_STATUS.md)
- [\`search-instability-local-geometry-mechanism/DECISION_REGISTER.md\`](search-instability-local-geometry-mechanism/DECISION_REGISTER.md)
- [\`search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md\`](search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md)
- [\`research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md\`](research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md)
- [\`research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md\`](research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md)

**Downstream boundary:** G3-08 — Local Geometry Persistence / Memory-Length Study 1 is not automatically authorized. A separate post-G3-07 current-state authorization review is required. Protected depth-10 remains sealed. G3-07 research branch is not integrated to \`main\` without explicit user instruction.
`);
  write(paths.index, s);
}

function verify() {
  need(gitBlob(paths.programPlan) === EXPECTED_PROGRAM_PLAN_BLOB,
    `PROGRAM_PLAN changed: ${gitBlob(paths.programPlan)} != ${EXPECTED_PROGRAM_PLAN_BLOB}`);
  const root = read(paths.root);
  const idx = read(paths.index);
  const agenda = read(paths.agenda);
  const rr = read(paths.rg3Readme);
  const rs = read(paths.rg3Status);
  for (const [label, s] of Object.entries({ root, idx, agenda, rr, rs })) {
    need(s.includes('SILGM-STUDY1'), `${label}: SILGM-STUDY1 missing`);
    need(s.includes('CLOSED / FORMAL-COMPLETE') || s.includes('closed `FORMAL-COMPLETE`'), `${label}: formal-complete missing`);
    need(s.includes('G3-08'), `${label}: G3-08 boundary missing`);
  }
  need(rs.includes(RESULT_SHA), 'RG3 status canonical result SHA missing');
  need(rs.includes('NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED'), 'RG3 status main-integration firewall missing');
  need(rr.includes('main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED'), 'RG3 README integration firewall missing');
  need(agenda.includes('NOT PEEKED'), 'agenda protected holdout wording incomplete');
  need(root.includes('doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md'), 'root G3-07 final report link missing');
  need(idx.includes('search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md'), 'index G3-07 final report link missing');
  return {
    verified: true,
    programPlanBlob: gitBlob(paths.programPlan),
    files: Object.fromEntries(Object.entries(paths).map(([k,p]) => [k, { path:p, sha256:sha256(p), gitBlob:gitBlob(p) }])),
    protectedDepth10: 'SEALED-NOT-GENERATED-NOT-READ-NOT-PEEKED',
    mainIntegration: 'NOT-PERFORMED-EXPLICIT-USER-INSTRUCTION-REQUIRED',
  };
}

function main() {
  const verifyOnly = process.argv.includes('--verify-only');
  if (!verifyOnly) {
    updateRoot();
    updateRg3Readme();
    updateRg3Status();
    updateAgenda();
    updateIndex();
  }
  const result = verify();
  process.stdout.write(JSON.stringify(result) + '\n');
}

main();
