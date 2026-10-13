"use strict";
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
const { replayJournal } = require("../g5-branch-envelope/storage.cjs");
function capture(directory, maxBytes) {
  const files = {}, journals = {}; let used = 0;
  if (!fs.existsSync(directory)) return { files, journals, complete: false, solution: null };
  for (const name of fs.readdirSync(directory).sort()) {
    assert.match(name, /^[A-Za-z0-9_.-]+$/); const file = path.join(directory, name), stat = fs.lstatSync(file);
    assert.ok(stat.isFile(), "MIRROR-NONREGULAR-FILE"); assert.ok(used + stat.size <= maxBytes, "MIRROR-CAPTURE-LIMIT");
    const bytes = fs.readFileSync(file); used += bytes.length; assert.ok(used <= maxBytes, "MIRROR-CAPTURE-LIMIT"); files[name] = bytes;
    if (name.endsWith(".jsonl")) {
      const end = bytes.lastIndexOf(10) + 1, prefix = bytes.subarray(0, end);
      journals[name] = { verifiedPrefixBytes: end, verifiedRows: end ? replayJournal(prefix).length : 0, partialTailBytes: bytes.length - end };
    }
  }
  files["MIRROR_COVERAGE.json"] = Buffer.from(JSON.stringify({ journals, savedBytes: used, complete: false, solution: null, resumeAuthorized: false }) + "\n");
  return { files, journals, complete: false, solution: null };
}
module.exports = { capture };
