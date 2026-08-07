#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const files = {
  current: path.join(ROOT, "doc/phase-transition/CURRENT_STATUS.md"),
  log: path.join(ROOT, "doc/phase-transition/RESEARCH_LOG.md"),
  decisions: path.join(ROOT, "doc/phase-transition/DECISION_REGISTER.md"),
  experiments: path.join(ROOT, "doc/phase-transition/EXPERIMENT_INDEX.md"),
  hypotheses: path.join(ROOT, "doc/phase-transition/HYPOTHESES.md"),
};

function replaceRequired(text, from, to, label) {
  if (text.includes(to)) return text;
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one anchor, found ${count}`);
  return text.replace(from, to);
}

function appendBefore(text, marker, addition, uniqueMarker, label) {
  if (text.includes(uniqueMarker)) return text;
  const count = text.split(marker).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one marker, found ${count}`);
  return text.replace(marker, `${addition}\n${marker}`);
}

function syncCurrent(text) {
  let next = text;
  next = replaceRequired(
    next,
    "Status: Active / Study 1 completion phase / Stage A E-020 preregistered",
    "Status: Active / Study 1 completion phase / Stage A E-020 formal authorized / awaiting local lock",
    "CURRENT_STATUS header",
  );
  next = replaceRequired(
    next,
    "現在は、**Study 1 Stage AとしてE-020/H18の非formal infrastructure validationを行い、formal開始承認前のゲートを閉じる段階**。",
    "現在は、**Study 1 Stage AとしてE-020/H18のformal開始承認を完了し、fixed-local execution lock生成前のゲートにある**。",
    "CURRENT_STATUS stage sentence",
  );
  next = replaceRequired(
    next,
    "E-020 formal corpusはまだ生成していない。E-020のformal開始には、infrastructure validation完了後も別途E-020固有の明示的ユーザー承認と新規execution lockを要求する。",
    "E-020 formal corpusはまだ生成していない。E-020固有の明示的開始承認は2026-08-05 18:41 JSTに受領済みであり、次にE-020専用fixed-local execution lockを要求する。",
    "CURRENT_STATUS authorization sentence",
  );
  next = replaceRequired(
    next,
    "E-020はpreregisteredだがformal未実行であり、formal decisionはまだ存在しない。",
    "E-020はpreregistered / infrastructure-validated / formal開始承認済みだが、execution lock未生成・formal未実行であり、formal decisionはまだ存在しない。",
    "CURRENT_STATUS E-020 decision state",
  );
  next = replaceRequired(
    next,
    "現在は非formal fixtureによるinfrastructure validation中。GitHub Actionsではformal seedを使用しない。",
    "non-formal fixtureによるinfrastructure validationは完了済み。E-020固有formal開始承認も受領済みで、現在はfixed-local execution lock待ち。GitHub Actionsではformal seedを使用しない。",
    "CURRENT_STATUS E-020 subsection state",
  );
  next = replaceRequired(
    next,
    "1. E-020専用non-formal fixture / formal guard / integrity基盤のCI監査\n2. infrastructure validation結果の固定\n3. **E-020固有の明示的formal開始承認**\n4. fixed-local environmentの再確認\n5. E-020専用execution lock生成\n6. 同一lock下でformal 9000局 → analyze → verify → evaluate",
    "1. E-020専用non-formal fixture / formal guard / integrity基盤のCI監査 — 完了\n2. infrastructure validation結果の固定 — 完了\n3. **E-020固有の明示的formal開始承認 — 完了**\n4. fixed-local environmentの再確認\n5. E-020専用execution lock生成\n6. lock監査成功後、同一lock下でformal 9000局 → analyze → verify → evaluate",
    "CURRENT_STATUS Stage A gate list",
  );
  return next;
}

function syncLog(text) {
  const marker = "## 2026-08-05 — E-020 formal開始承認";
  if (text.includes(marker)) return text;
  return `${text.trimEnd()}\n\n${marker}\n\n2026-08-05 18:41 JST、ユーザーからE-020固有の明示的開始指示「E-020の正式実験を開始してください」を受領した。\n\nExecution policyは科学条件を変更せず、execution stateだけを次へ遷移した。\n\n- status: \`approved-awaiting-local-lock\`\n- \`formalExecutionAllowed: true\`\n- \`formalAuthorization.granted: true\`\n- \`formalCorpusGenerated: false\`\n- GitHub Actions formal execution: prohibited\n- authorization policy commit: \`5e01628618d2b37cda8c794e5de51a662a44f6b8\`\n- authorization checkpoint: \`doc/phase-transition/checkpoints/2026-08-05-e020-formal-start-authorization.md\`\n\n承認はH18/E-020のN、seed、condition、endpoint、two-sided exact McNemar、alpha、minimum discordants、prospective direction \`LG-only > P2-only\`、decision contract、secondary boundaryを一切変更しない。\n\nformal seed \`20275001–20279500\`はexecution lock成功前には使用しない。過去experimentのapproval token / execution lockも流用しない。\n\n次工程はfixed-local environment再確認とE-020専用execution lock生成。lockが\`prepared-approved / errors=[]\`であることを確認した後にのみformal 9000局を開始する。\n\n既存formal decisionsは変更しない。E-010 \`not-confirmed\`、E-011 \`inconclusive\`、E-017 \`not-confirmed\`、E-018 \`confirmed\`、E-019 \`not-confirmed\`。PR #26はopen / draftを維持する。\n`;
}

function syncDecisions(text) {
  const addition = "| D-123 | E-020固有formal開始承認を受領し、execution policyをapproved-awaiting-local-lockへ遷移する | 採用 | 2026-08-05 18:41 JST。承認はexecution stateだけを変更し、H18/E-020のN、seed、endpoint、direction、alpha、decision rule、secondary boundaryを変更しない。formal corpus開始前にE-020専用fixed-local execution lockを必須とする |\n";
  return appendBefore(text, "## 今後固定が必要な判断", addition, "| D-123 |", "DECISION_REGISTER D-123");
}

function syncExperiments(text) {
  let next = text;
  next = replaceRequired(
    next,
    "**preregistered / infrastructure-validated / formal未承認**",
    "**preregistered / infrastructure-validated / formal開始承認済み / local lock待ち**",
    "EXPERIMENT_INDEX E-020 table status",
  );
  next = replaceRequired(
    next,
    "- status: **preregistered / infrastructure-validated / formal未承認 / formal corpus未生成**",
    "- status: **preregistered / infrastructure-validated / formal開始承認済み / local lock待ち / formal corpus未生成**",
    "EXPERIMENT_INDEX E-020 detailed status",
  );
  next = replaceRequired(
    next,
    "- `formalExecutionAllowed: false`\n- formal authorization: not granted",
    "- `formalExecutionAllowed: true`\n- formal authorization: granted 2026-08-05 18:41 JST\n- authorization checkpoint: `doc/phase-transition/checkpoints/2026-08-05-e020-formal-start-authorization.md`\n- execution lock: not yet generated",
    "EXPERIMENT_INDEX E-020 authorization state",
  );
  next = replaceRequired(
    next,
    "- formal execution authorization: not granted",
    "- formal execution authorization: granted / awaiting E-020 fixed-local execution lock",
    "EXPERIMENT_INDEX common data E-020 state",
  );
  return next;
}

function syncHypotheses(text) {
  let next = text;
  next = replaceRequired(
    next,
    "状態: **E-020 preregistered / formal未実行**",
    "状態: **E-020 preregistered / infrastructure-validated / formal開始承認済み / execution lock待ち**",
    "HYPOTHESES H18 status",
  );
  next = replaceRequired(
    next,
    "Formal executionは未承認であり、GitHub Actionsではformal corpusを生成しない。E-020固有の明示的開始承認と新規execution lockを要求する。",
    "Formal executionは2026-08-05 18:41 JSTにE-020固有の明示的開始承認を受領済み。GitHub Actionsではformal corpusを生成せず、新規fixed-local execution lockを生成・監査した後にのみformal seedを使用する。",
    "HYPOTHESES H18 gate",
  );
  next = replaceRequired(
    next,
    "- H18: D3 legacy > phase2逆転の独立再現 — E-020 preregistered / formal未実行",
    "- H18: D3 legacy > phase2逆転の独立再現 — E-020 preregistered / formal開始承認済み / local lock待ち",
    "HYPOTHESES Study 1 classification",
  );
  next = replaceRequired(
    next,
    "- E-020/H18のinfrastructure validationをformal seed非使用fixtureで完了する。\n- infrastructure validation後も、E-020固有の明示的formal開始承認まではformal data generationを行わない。\n- E-020結果後、必要なStage B機構解析 → 認定範囲 → 語彙固定 → 最終統合の順で進める。",
    "- E-020/H18のinfrastructure validationはformal seed非使用fixtureで完了済み。\n- E-020固有の明示的formal開始承認は受領済み。次にfixed-local execution lockを生成し、lock監査成功後にのみformal data generationを開始する。\n- E-020結果後、必要なStage B機構解析 → 認定範囲 → 語彙固定 → 最終統合の順で進める。",
    "HYPOTHESES next validation",
  );
  return next;
}

function write(filePath, transform) {
  const before = fs.readFileSync(filePath, "utf8");
  const after = transform(before);
  if (before === after) return false;
  fs.writeFileSync(filePath, after.endsWith("\n") ? after : `${after}\n`, "utf8");
  return true;
}

function main() {
  const changed = {
    currentStatus: write(files.current, syncCurrent),
    researchLog: write(files.log, syncLog),
    decisionRegister: write(files.decisions, syncDecisions),
    experimentIndex: write(files.experiments, syncExperiments),
    hypotheses: write(files.hypotheses, syncHypotheses),
  };
  console.log(JSON.stringify({ changed, authorization: "E-020 formal authorized / awaiting local lock" }, null, 2));
}

if (require.main === module) {
  try { main(); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}
