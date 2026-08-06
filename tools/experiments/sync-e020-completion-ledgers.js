#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

function read(path) { return fs.readFileSync(path, "utf8"); }
function write(path, text) { fs.writeFileSync(path, text.endsWith("\n") ? text : `${text}\n`); }
function replaceRequired(text, search, replacement, label) {
  if (!text.includes(search)) throw new Error(`Missing expected marker for ${label}`);
  return text.replace(search, replacement);
}
function replaceRegexRequired(text, regex, replacement, label) {
  if (!regex.test(text)) throw new Error(`Missing expected regex marker for ${label}`);
  return text.replace(regex, replacement);
}
function appendOnce(text, marker, block) {
  if (text.includes(marker)) return text;
  return `${text.trimEnd()}\n\n${block.trim()}\n`;
}

const currentPath = "doc/phase-transition/CURRENT_STATUS.md";
let current = read(currentPath);
current = current.replace("更新日: 2026-08-05", "更新日: 2026-08-07");
current = replaceRequired(
  current,
  "Status: Active / Study 1 completion phase / Stage A E-020 formal authorized / awaiting local lock",
  "Status: Active / Study 1 completion phase / Stage A complete / Stage B depth-search-profile mechanism next",
  "CURRENT_STATUS status",
);
current = replaceRequired(
  current,
  "現在は、**Study 1 Stage AとしてE-020/H18のformal開始承認を完了し、fixed-local execution lock生成前のゲートにある**。\n\nE-020 formal corpusはまだ生成していない。E-020固有の明示的開始承認は2026-08-05 18:41 JSTに受領済みであり、次にE-020専用fixed-local execution lockを要求する。",
  "**Study 1 Stage AはE-020/H18 formal `confirmed`により完了した。現在はStage B depth/search-profile mechanismへ進む状態にある。**\n\nE-020はfixed-localで9000 formal gamesを完了し、formal integrity `mode=formal / valid=true / errors=[]`を通過した。final bundleもrepository外へ固定・監査済みである。",
  "CURRENT_STATUS current stage",
);
current = replaceRequired(
  current,
  "- E-019: **`not-confirmed`**\n\nこれらを結果後に変更しない。",
  "- E-019: **`not-confirmed`**\n- E-020: **`confirmed`**\n\nこれらを結果後に変更しない。",
  "CURRENT_STATUS fixed decisions",
);
current = replaceRequired(
  current,
  "E-020はpreregistered / infrastructure-validated / formal開始承認済みだが、execution lock未生成・formal未実行であり、formal decisionはまだ存在しない。",
  "E-020/H18はformal `confirmed`。固定`hard / bao / depth3`でLG event-game rate 2.8667%、P2 0.40%、LG-only 129、P2-only 18、discordants 147、exact two-sided McNemar p `7.0456833990241785e-22`。この結果を一般的なdepth interactionへ拡張しない。",
  "CURRENT_STATUS E020 decision sentence",
);
current = replaceRegexRequired(
  current,
  /### E-020 — H18 D3 reversal replication[\s\S]*?(?=\n## 第1研究に残る工程)/,
  `### E-020 — H18 D3 reversal replication\n\nStage AではE-019 D3で事後観測されたlegacy > phase2逆転を、独立seed blockでprospectiveに直接replicateした。\n\nFormal design:\n\n- 4500 paired seeds / 9000 games\n- formal seed \`20275001–20279500\`\n- condition \`hard / bao / depth3\`\n- P2=\`phase2\`, LG=\`legacy\`\n- primary population \`pliesRemaining >= 9\`\n- paired game-level endpoint\n- two-sided exact McNemar\n- alpha 0.05\n- minimum discordants 20\n- prospective direction **LG-only > P2-only**\n\nFormal integrity: \`mode=formal / valid=true / errors=[]\`.\n\nPrimary result:\n\n- n00: 4353\n- LG-only: 129\n- P2-only: 18\n- n11: 0\n- discordants: 147\n- P2 event rate: 0.40%\n- LG event rate: 2.8667%\n- RD P2−LG: -2.4667pp\n- OR LG/P2: 7.1667\n- exact McNemar p: \`7.0456833990241785e-22\`\n- formal decision: **\`confirmed\`**\n\nInterpretation boundary: E-020は固定\`hard / bao / depth3\`だけを確認し、E-019/H17 \`not-confirmed\`を変更せず、一般的search-profile × depth interactionを自動的にconfirmしない。\n\nCompletion / archive:\n\n- \`doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md\`\n- \`doc/phase-transition/checkpoints/2026-08-07-e020-final-bundle-audit.md\`\n- archive SHA-256: \`37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2\`\n`,
  "CURRENT_STATUS E020 section",
);
current = replaceRegexRequired(
  current,
  /### Stage A — D3逆転の独立確認[\s\S]*?(?=\n### Stage B — depth\/search-profile依存の機構解析)/,
  `### Stage A — D3逆転の独立確認\n\n**完了。** E-020 / H18はformal \`confirmed\`。4500 paired gamesでLG-only 129、P2-only 18、discordants 147、exact McNemar p \`7.0456833990241785e-22\`。\n\nStage Aの役割はD3境界条件を独立seedでprospectiveに確認することであり、一般的depth interactionを主張することではない。\n`,
  "CURRENT_STATUS Stage A",
);
current = replaceRequired(
  current,
  "### E-020\n\n- planned games: 9000\n- paired comparisons: 4500\n- formal seed block: `20275001–20279500`\n- condition: `hard / bao / depth3`, phase2 vs legacy\n- formal execution authorization: not granted\n- formal corpus generated: no\n- formal integrity: not yet available\n- formal decision: not yet available",
  "### E-020\n\n- games: 9000\n- paired comparisons: 4500\n- formal seed block: `20275001–20279500`\n- condition: `hard / bao / depth3`, phase2 vs legacy\n- formal execution authorization: granted 2026-08-05 18:41 JST\n- locked source: `43ab667403d307e4163aefab631969a43fa897ee`\n- formal corpus generated: yes\n- formal integrity: `valid`\n- formal decision: **`confirmed`**\n- final archive SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`",
  "CURRENT_STATUS E020 data block",
);
write(currentPath, current);

const hypothesesPath = "doc/phase-transition/HYPOTHESES.md";
let hypotheses = read(hypothesesPath);
hypotheses = hypotheses.replace("更新日: 2026-08-05", "更新日: 2026-08-07");
hypotheses = replaceRegexRequired(
  hypotheses,
  /## H18 — depth 3におけるlegacy > phase2逆転は独立seedで再現する[\s\S]*?(?=\n## 第1研究スコープ上の仮説分類)/,
  `## H18 — depth 3におけるlegacy > phase2逆転は独立seedで再現する\n\n状態: **E-020 formal \`confirmed\`**\n\nE-019 D3で観測された\`legacy > phase2\`はH17の事前登録方向とは逆だったため、E-019内ではconfirmatory resultにしなかった。H18/E-020として独立seed block \`20275001–20279500\`、4500 paired gamesでprospectiveに直接検定した。\n\nFormal integrity:\n\n- \`mode: formal\`\n- \`valid: true\`\n- \`errors: []\`\n- exact paired seed sequence: true\n- paired opening hashes: true\n- source commit matches execution lock: true\n- artifact verification: true\n\nPrimary result:\n\n- n00: 4353\n- LG-only: 129\n- P2-only: 18\n- n11: 0\n- discordants: 147\n- P2 event-game rate: 0.40%\n- LG event-game rate: 2.8667%\n- paired RD P2−LG: -2.4667pp\n- discordant OR LG/P2: 7.1667\n- exact two-sided McNemar p: \`7.0456833990241785e-22\`\n\n事前登録済みのexact N、minimum discordants、alpha、prospective direction \`LG-only > P2-only\`を全て満たしたため、H18は**\`confirmed\`**。\n\nSecondary trajectory-ply endpointでもP2 5/42 = 11.90%、LG 13/35 = 37.14%、Fisher two-sided p \`0.01413147130729561\`だったが、secondaryはprimary decisionを置換しない。\n\nInterpretation boundary:\n\n- confirmationは\`hard / bao / depth3\`に限定\n- E-019/H17 global \`not-confirmed\`を変更しない\n- E-018/H16 depth2 \`phase2 > legacy\` confirmedを変更しない\n- depth全体の単調性/非単調性や一般的search-profile × depth interactionをこの実験だけでconfirmしない\n\nCompletion:\n\n- \`doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md\`\n- \`doc/phase-transition/checkpoints/2026-08-07-e020-final-bundle-audit.md\`\n- final archive SHA-256: \`37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2\`\n`,
  "HYPOTHESES H18",
);
hypotheses = replaceRequired(
  hypotheses,
  "- H18: D3 legacy > phase2逆転の独立再現 — E-020 preregistered / formal開始承認済み / local lock待ち",
  "- H18: D3 legacy > phase2逆転の独立再現 — E-020 formal `confirmed`",
  "HYPOTHESES center series H18",
);
hypotheses = replaceRegexRequired(
  hypotheses,
  /## 次の検証[\s\S]*$/,
  `## 次の検証\n\n- E-010 \`not-confirmed\`、E-011 \`inconclusive\`、E-017 \`not-confirmed\`、E-018 \`confirmed\`、E-019 \`not-confirmed\`、E-020 \`confirmed\`を固定する。\n- Stage AはE-020/H18により完了。\n- 次にStage B depth/search-profile mechanismを進め、E-018 depth2とE-020 depth3の逆方向をcandidate occurrence / manifestation / forced-capture regime / branching等から説明する。\n- Stage Bで新しいformal claimが必要な場合だけ新規hypothesis / experiment / preregistrationへ分離する。\n- その後Stage C認定範囲 → Stage D機械定義/Bao語彙 → Stage E最終統合の順で進める。\n- reserve、nyumba等の残RQは第1研究完了後の追加研究として独立設計する。\n`,
  "HYPOTHESES next validation",
);
write(hypothesesPath, hypotheses);

const indexPath = "doc/phase-transition/EXPERIMENT_INDEX.md";
let index = read(indexPath);
index = index.replace("更新日: 2026-08-05", "更新日: 2026-08-07");
index = replaceRequired(
  index,
  "| E-020 | D3逆転独立確認 | P2/LG各4500局、新規seed 20275001–20279500 | `run-phase-transition-d3-reversal-replication-formal.js` | paired game-level exact McNemar、構造・機構bridge副次 | **preregistered / infrastructure-validated / formal開始承認済み / local lock待ち** |",
  "| E-020 | D3逆転独立確認 | P2/LG各4500局、新規seed 20275001–20279500 | `run-phase-transition-d3-reversal-replication-formal.js` | paired game-level exact McNemar、構造・機構bridge副次 | **完了・formal `confirmed`** |",
  "EXPERIMENT_INDEX E020 row",
);
index = appendOnce(index, "## E-020 D3逆転独立確認 — formal completion", `## E-020 D3逆転独立確認 — formal completion\n\n- hypothesis: H18\n- analysisVersion: \`18-d3-reversal-replication\`\n- status: \`preregistered / infrastructure-validated / formal-complete / confirmed\`\n- condition: \`hard / bao / depth3\`\n- P2: \`phase2\`\n- LG: \`legacy\`\n- games: 4500 / condition, 9000 total\n- shared formal seed: \`20275001–20279500\`\n- locked source: \`43ab667403d307e4163aefab631969a43fa897ee\`\n- formal integrity: \`mode=formal / valid=true / errors=[]\`\n- n00: 4353\n- LG-only: 129\n- P2-only: 18\n- n11: 0\n- discordants: 147\n- P2 rate: 0.40%\n- LG rate: 2.8667%\n- RD P2−LG: -2.4667pp\n- OR LG/P2: 7.1667\n- exact McNemar p: \`7.0456833990241785e-22\`\n- formal decision: **\`confirmed\`**\n- completion checkpoint: \`doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md\`\n- final bundle audit: \`doc/phase-transition/checkpoints/2026-08-07-e020-final-bundle-audit.md\`\n- final archive SHA-256: \`37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2\`\n- interpretation: fixed \`hard / bao / depth3\` only; E-019/H17 remains \`not-confirmed\`; no general depth interaction claim\n`);
write(indexPath, index);

const decisionsPath = "doc/phase-transition/DECISION_REGISTER.md";
let decisions = read(decisionsPath);
decisions = decisions.replace("更新日: 2026-08-05", "更新日: 2026-08-07");
if (!decisions.includes("| D-124 |")) {
  const rows = `| D-124 | E-020/H18のformal decisionを\`confirmed\`とする | 採用 | exact 4500 pairs、discordants 147、LG-only 129 > P2-only 18、two-sided exact McNemar p \`7.0456833990241785e-22\`。全integrity checks通過 |\n| D-125 | E-020 confirmedを固定\`hard / bao / depth3\`の境界条件に限定する | 採用 | E-019/H17 \`not-confirmed\`とE-018/H16 depth2 confirmedを変更せず、一般的depth interactionを結果後に自動昇格しない |\n| D-126 | Study 1 Stage A D3逆転独立確認を完了し、Stage B depth/search-profile mechanismへ進む | 採用 | E-020が独立seedでprospective directionを確認。Stage B secondaryはmechanism explanationであり、新formal claimは別preregistrationを要求 |\n| D-127 | E-020 final formal bundleを\`/home/oruorane/bao-e020-exports/\`へ固定し、SHA-256を\`37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2\`とする | 採用 | \`sha256sum -c\`成功、archive member 9049、unsafe path 0、reported size 116M、archive内primary result一致 |\n| D-128 | E-020 repository内local analysis rootの保持不具合はscientific decisionと分離し、同一locked corpusからrepository外へ決定論的再構築する | 採用 | \`EXTERNAL_REBUILD_MATCH=true\`。formal corpus・lock・source・runtime・N・seed・endpoint・direction・decision ruleは変更せず、主要成果物SHA-256を固定 |\n\n`;
  decisions = replaceRequired(decisions, "## 今後固定が必要な判断", `${rows}## 今後固定が必要な判断`, "DECISION_REGISTER insertion point");
}
write(decisionsPath, decisions);

const exportPath = "doc/phase-transition/FORMAL_EXPORT_INDEX.md";
let exports = read(exportPath);
exports = exports.replace("更新日: 2026-08-05", "更新日: 2026-08-07");
if (!exports.includes("| E-020 |")) {
  exports = replaceRequired(
    exports,
    "| E-019 | `e019-final-formal-evaluation.tar.gz` | `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75` | `/home/oruorane/bao-e019-exports/` | `\\\\wsl.localhost\\Ubuntu\\home\\oruorane\\bao-e019-exports` | final bundle監査済み / 保管先固定 |",
    "| E-019 | `e019-final-formal-evaluation.tar.gz` | `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75` | `/home/oruorane/bao-e019-exports/` | `\\\\wsl.localhost\\Ubuntu\\home\\oruorane\\bao-e019-exports` | final bundle監査済み / 保管先固定 |\n| E-020 | `e020-final-formal-evaluation.tar.gz` | `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2` | `/home/oruorane/bao-e020-exports/` | `\\\\wsl.localhost\\Ubuntu\\home\\oruorane\\bao-e020-exports` | final bundle監査済み / 保管先固定 |",
    "FORMAL_EXPORT_INDEX table",
  );
  const section = `## E-020\n\n- formal decision: \`confirmed\`\n- final archive: \`e020-final-formal-evaluation.tar.gz\`\n- checksum file: \`e020-final-formal-evaluation.tar.gz.sha256\`\n- SHA-256: \`37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2\`\n- local export directory: \`/home/oruorane/bao-e020-exports/\`\n- external analysis root: \`/home/oruorane/bao-e020-exports/e020-analysis-final\`\n- Windows: \`\\\\wsl.localhost\\Ubuntu\\home\\oruorane\\bao-e020-exports\`\n- completion checkpoint: \`doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md\`\n- final bundle audit: \`doc/phase-transition/checkpoints/2026-08-07-e020-final-bundle-audit.md\`\n- archive member count: 9049\n- unsafe path member: 0\n- reported archive size: 116M\n- formal integrity: \`valid: true\`\n- primary result: LG-only 129 / P2-only 18 / discordants 147 / exact McNemar p \`7.0456833990241785e-22\`\n- external reconstruction: \`EXTERNAL_REBUILD_MATCH=true\`\n\n`;
  exports = replaceRequired(exports, "## 追記規則", `${section}## 追記規則`, "FORMAL_EXPORT_INDEX section insertion");
}
write(exportPath, exports);

const logPath = "doc/phase-transition/RESEARCH_LOG.md";
let log = read(logPath);
log = appendOnce(log, "## 2026-08-07 — E-020 fixed-local formal 9000局・final bundle監査完了", `## 2026-08-07 — E-020 fixed-local formal 9000局・final bundle監査完了\n\nE-020/H18をlocked source \`43ab667403d307e4163aefab631969a43fa897ee\`でfixed-local実行した。P2/LG各4500局、合計9000局、shared formal seed \`20275001–20279500\`。\n\nFormal corpus:\n\n- P2 \`phase2\`: 4500 games / 276764 observations\n- LG \`legacy\`: 4500 games / 249575 observations\n\nFormal verifyは\`mode=formal / valid=true / errors=[]\`。paired seed sequence、paired opening hash、source-lock一致、condition identity、trajectory hash、artifact verificationを含む全checksが通過した。\n\nPreregistered primary result:\n\n- n00 4353\n- LG-only 129\n- P2-only 18\n- n11 0\n- discordants 147\n- P2 event rate 0.40%\n- LG event rate 2.8667%\n- paired RD P2−LG -2.4667pp\n- discordant OR LG/P2 7.1667\n- two-sided exact McNemar p \`7.0456833990241785e-22\`\n\nexact pair count、minimum discordants、alpha、prospective direction \`LG-only > P2-only\`を全て満たしたため、**E-020/H18 formal decision = \`confirmed\`**。\n\nSecondary trajectory-ply endpointはP2 5/42、LG 13/35、Fisher p \`0.01413147130729561\`。secondaryはprimary decisionを変更しない。\n\nRepository内既定local analysis rootがprocess終了後に保持されない事象が再現したため、同一formal corpus / execution lock / source / runtimeから明示\`--output\`でrepository外へ分析成果物を決定論的再構築した。\n\n- external root: \`/home/oruorane/bao-e020-exports/e020-analysis-final\`\n- \`EXTERNAL_REBUILD_MATCH=true\`\n- integrity SHA-256: \`61a7fc55b6607a02e45d0577981d5277eeea632cbd0da794643734f1ee3e7503\`\n- paired endpoint SHA-256: \`f64652a0067cd5dc51f958470f43cdef14330b893811af72f57736fd2a439fa6\`\n- evaluation SHA-256: \`548ee212aaaf7cdadf35856f144e16bdd1eb73c35024970b45898deedbb514d3\`\n\nFinal archive:\n\n- directory: \`/home/oruorane/bao-e020-exports/\`\n- archive: \`e020-final-formal-evaluation.tar.gz\`\n- SHA-256: \`37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2\`\n- \`sha256sum -c\`: OK\n- reported size: 116M\n- member count: 9049\n- unsafe path member: 0\n- archive内primary result: confirmed / 4500 pairs / LG-only 129 / P2-only 18 / p \`7.0456833990241785e-22\`\n\nInterpretationは\`hard / bao / depth3\`に限定し、E-019/H17 \`not-confirmed\`、E-018/H16 depth2 \`confirmed\`を変更しない。一般的depth interactionへ結果後拡張しない。\n\nStage A D3 independent confirmationは完了。次はStage B depth/search-profile mechanism。\n\nCheckpoints:\n\n- \`doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md\`\n- \`doc/phase-transition/checkpoints/2026-08-07-e020-final-bundle-audit.md\`\n\nPR #26はopen / draftを維持する。\n`);
write(logPath, log);

console.log(JSON.stringify({
  updated: [currentPath, hypothesesPath, indexPath, decisionsPath, exportPath, logPath],
  experimentId: "E-020",
  hypothesisId: "H18",
  decision: "confirmed",
  stageA: "complete",
  nextStage: "Stage B depth/search-profile mechanism",
}, null, 2));
