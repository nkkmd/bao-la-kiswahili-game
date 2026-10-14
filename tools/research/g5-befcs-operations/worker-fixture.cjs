"use strict";
// 保存・process・OOM試験だけ。Bao engine/PRNG/seed fileをimportしない。
const fs = require("node:fs"), cp = require("node:child_process"), path = require("node:path");
const Storage = require("../g5-branch-envelope/storage.cjs");
const mode = process.argv[2], directory = process.argv[3];
if (mode === "allocate") {
  const live = []; setInterval(() => { const b = Buffer.alloc(8 * 1024 * 1024, 1); live.push(b); }, 10);
} else if (mode === "group") {
  const parentBuffer = Buffer.alloc(24 * 1024 * 1024, 1); global.fixtureBuffer = parentBuffer;
  cp.spawn(process.execPath, [__filename, "allocate"], { stdio: "ignore" });
  setInterval(() => {}, 50);
} else if (mode === "journal" || mode === "ignore-term") {
  const store = Storage.store(directory, { maxEvidenceBytes: 8388608, storageReserveBytes: 1048576 });
  if (mode === "ignore-term") process.on("SIGTERM", () => {});
  let sequence = 0;
  setInterval(() => {
    store.append("fixture.jsonl", { kind: "technical-only", sequence: sequence++ });
    store.snapshot("CHECKPOINT.json", { savedRows: sequence, complete: false, solution: null, resumeAuthorized: false });
  }, 10);
} else if (mode === "oom") {
  fs.mkdirSync(directory, { recursive: true });
  const file = path.join(directory, "OOM_PREFIX.jsonl"), fd = fs.openSync(file, "wx");
  fs.writeSync(fd, JSON.stringify({ evidenceClass: "TECHNICAL-OOM-FIXTURE", scientificSeedsRead: 0, solution: null }) + "\n"); fs.fsyncSync(fd); fs.closeSync(fd);
  const live = [];
  setInterval(() => { live.push(Buffer.alloc(16 * 1024 * 1024, 7)); }, 10);
} else throw Error("FIXTURE-MODE-REQUIRED");
