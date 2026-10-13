"use strict";
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto"), zlib = require("node:zlib");
const assert = require("node:assert/strict"), { Readable, Writable } = require("node:stream"), { pipeline } = require("node:stream/promises");
const { Stop } = require("./source.cjs");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const safe = name => { assert.match(name, /^[A-Za-z0-9_.-]+$/); return name; };
function syncDirectory(directory) { const fd = fs.openSync(directory, "r"); try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); } }
function all(fd, bytes) { for (let offset = 0; offset < bytes.length;) { const n = fs.writeSync(fd, bytes, offset); assert.ok(n > 0); offset += n; } }
function store(directory, limits, fault = () => {}) {
  fs.mkdirSync(directory, { recursive: true }); assert.equal(fs.readdirSync(directory).length, 0, "EXISTING-ATTEMPT-REFUSED");
  const sizes = new Map(), journals = new Map(); let used = 0, closed = false;
  function capacity(extra, critical) {
    const bound = limits.maxEvidenceBytes - (critical ? 0 : limits.storageReserveBytes);
    if (used + extra > bound) throw new Stop(critical ? "EVIDENCE-BYTE-LIMIT" : "EVIDENCE-RESERVE-LIMIT", { used, requested: extra, bound });
  }
  function append(name, record, critical = false) {
    assert.equal(closed, false); safe(name);
    let journal = journals.get(name);
    if (!journal) { journal = { fd: fs.openSync(path.join(directory, name), "wx"), seq: 0, previous: "0".repeat(64) }; journals.set(name, journal); syncDirectory(directory); }
    const body = { seq: journal.seq, previous: journal.previous, record }, row = { ...body, hash: hash(JSON.stringify(body)) };
    const bytes = Buffer.from(JSON.stringify(row) + "\n"); capacity(bytes.length, critical);
    all(journal.fd, bytes); fs.fsyncSync(journal.fd); used += bytes.length;
    sizes.set(name, (sizes.get(name) ?? 0) + bytes.length); journal.seq++; journal.previous = row.hash;
    fault("append-fsync", name); return row;
  }
  function snapshot(name, value, critical = false) {
    assert.equal(closed, false); safe(name); const bytes = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value) + "\n");
    // atomic rename中も旧snapshotと新temporaryが共存するので追加全量を先に検査する。
    capacity(bytes.length, critical);
    const file = path.join(directory, name), temporary = file + ".tmp", fd = fs.openSync(temporary, "wx");
    try { all(fd, bytes); fs.fsyncSync(fd); fault("snapshot-fsync", name); } finally { fs.closeSync(fd); }
    fs.renameSync(temporary, file); syncDirectory(directory);
    used += bytes.length - (sizes.get(name) ?? 0); sizes.set(name, bytes.length); fault("snapshot-rename", name);
  }
  return { append, snapshot, directory, get usedBytes() { return used; },
    close() { if (!closed) { for (const j of journals.values()) fs.closeSync(j.fd); closed = true; } } };
}
function replayJournal(bytes) {
  const lines = bytes.toString().split("\n"); assert.equal(lines.pop(), "", "TRUNCATED-JOURNAL");
  let previous = "0".repeat(64); return lines.map((line, seq) => {
    const row = JSON.parse(line), { hash: digest, ...body } = row;
    assert.equal(body.seq, seq); assert.equal(body.previous, previous); assert.equal(hash(JSON.stringify(body)), digest);
    previous = digest; return body.record;
  });
}
async function hashFile(file) { const h = crypto.createHash("sha256"); for await (const b of fs.createReadStream(file)) h.update(b); return h.digest("hex"); }
async function bundle(directory, names, limits, check = () => {}) {
  names.forEach(safe); assert.equal(new Set(names).size, names.length);
  const files = [];
  for (const name of names) { check(); files.push({ name, bytes: fs.statSync(path.join(directory, name)).size, sha256: await hashFile(path.join(directory, name)) }); }
  const magic = Buffer.from("BEFCS-BUNDLE-V1\n");
  const expandedBytes = magic.length + files.reduce((n, f) => n + Buffer.byteLength(JSON.stringify(f) + "\n") + f.bytes + 1, 0);
  const shards = []; let total = 0, fd = null, currentHash = null, current = null, complete = false, stopped = null;
  const archiveHash = crypto.createHash("sha256");
  function closeShard() { if (fd !== null) { fs.fsyncSync(fd); fs.closeSync(fd); fd = null; current.sha256 = currentHash.digest("hex"); syncDirectory(directory); } }
  const sink = new Writable({ write(bytes, encoding, callback) {
    try {
      check();
      if (total + bytes.length > limits.maxRepositoryBundleGzipBytes) throw new Stop("BUNDLE-GZIP-LIMIT");
      let offset = 0;
      while (offset < bytes.length) {
        if (fd === null) {
          if (shards.length >= limits.maxBlobChunks) throw new Stop("BUNDLE-SHARD-LIMIT");
          current = { name: "bundle-part-" + String(shards.length).padStart(3, "0") + ".gz.bin", bytes: 0, sha256: null };
          fd = fs.openSync(path.join(directory, current.name), "wx"); currentHash = crypto.createHash("sha256"); shards.push(current);
        }
        const piece = bytes.subarray(offset, offset + Math.min(bytes.length - offset, limits.maxBlobChunkBytes - current.bytes));
        all(fd, piece); currentHash.update(piece); current.bytes += piece.length; total += piece.length; offset += piece.length;
        if (current.bytes === limits.maxBlobChunkBytes) closeShard();
      }
      callback();
    } catch (error) { callback(error); }
  } });
  async function* archive() {
    archiveHash.update(magic); yield magic;
    for (const f of files) {
      const header = Buffer.from(JSON.stringify(f) + "\n"); archiveHash.update(header); yield header;
      for await (const b of fs.createReadStream(path.join(directory, f.name))) { check(); archiveHash.update(b); yield b; }
      archiveHash.update("\n"); yield Buffer.from("\n");
    }
  }
  try {
    if (expandedBytes > limits.maxEvidenceBytes) throw new Stop("BUNDLE-EXPANDED-LIMIT");
    await pipeline(Readable.from(archive()), zlib.createGzip(), sink); complete = true;
  } catch (error) { if (!(error instanceof Stop)) throw error; stopped = error.code; }
  finally { closeShard(); }
  const index = { version: 1, complete, status: complete ? "BUNDLE-COMPLETE" : stopped, files, expandedBytes,
    gzipBytes: total, shards, archiveSha256: complete ? archiveHash.digest("hex") : null, resumeAuthorized: false };
  if (files.reduce((n, f) => n + f.bytes, 0) + Buffer.byteLength(JSON.stringify(index) + "\n") > limits.maxEvidenceBytes) {
    index.complete = false; index.status = "BUNDLE-FINAL-METADATA-LIMIT"; index.archiveSha256 = null;
  }
  assert.ok(Buffer.byteLength(JSON.stringify(index) + "\n") <= limits.storageReserveBytes, "BUNDLE-INDEX-EXCEEDS-RESERVE");
  const temporary = path.join(directory, "BUNDLE_INDEX.json.tmp"), fdIndex = fs.openSync(temporary, "wx");
  try { all(fdIndex, Buffer.from(JSON.stringify(index) + "\n")); fs.fsyncSync(fdIndex); } finally { fs.closeSync(fdIndex); }
  fs.renameSync(temporary, path.join(directory, "BUNDLE_INDEX.json")); syncDirectory(directory); return index;
}
async function verifyBundle(directory, index, limits) {
  assert.equal(index.complete, true, "PARTIAL-BUNDLE-NOT-VERIFIABLE-AS-COMPLETE"); assert.equal(index.status, "BUNDLE-COMPLETE");
  assert.equal(new Set(index.files.map(f => f.name)).size, index.files.length);
  assert.ok(index.shards.length > 0 && index.shards.length <= limits.maxBlobChunks);
  assert.equal(new Set(index.shards.map(s => s.name)).size, index.shards.length);
  for (let n = 0; n < index.shards.length; n++) {
    const s = index.shards[n]; assert.equal(s.name, "bundle-part-" + String(n).padStart(3, "0") + ".gz.bin"); safe(s.name);
    assert.ok(s.bytes <= limits.maxBlobChunkBytes); assert.equal(fs.statSync(path.join(directory, s.name)).size, s.bytes);
    assert.equal(await hashFile(path.join(directory, s.name)), s.sha256);
  }
  assert.equal(index.gzipBytes, index.shards.reduce((n, s) => n + s.bytes, 0)); assert.ok(index.gzipBytes <= limits.maxRepositoryBundleGzipBytes);
  let total = 0, header = Buffer.alloc(0), phase = "magic", fileIndex = 0, left = 0, fileHash = null;
  const archiveHash = crypto.createHash("sha256");
  const sink = new Writable({ write(bytes, encoding, callback) {
    try {
      total += bytes.length; assert.ok(total <= limits.maxEvidenceBytes); archiveHash.update(bytes);
      let cursor = 0;
      while (cursor < bytes.length) {
        if (phase === "data") {
          const n = Math.min(left, bytes.length - cursor); fileHash.update(bytes.subarray(cursor, cursor + n)); cursor += n; left -= n;
          if (left === 0) { assert.equal(fileHash.digest("hex"), index.files[fileIndex].sha256); phase = "separator"; }
        } else if (phase === "separator") { assert.equal(bytes[cursor++], 10); fileIndex++; phase = "header"; }
        else {
          const end = bytes.indexOf(10, cursor), stop = end === -1 ? bytes.length : end;
          header = Buffer.concat([header, bytes.subarray(cursor, stop)]); assert.ok(header.length <= 4096); cursor = end === -1 ? stop : stop + 1;
          if (end !== -1) {
            if (phase === "magic") { assert.equal(header.toString(), "BEFCS-BUNDLE-V1"); phase = "header"; }
            else {
              assert.ok(fileIndex < index.files.length); const entry = JSON.parse(header); safe(entry.name); assert.deepEqual(entry, index.files[fileIndex]);
              assert.ok(Number.isSafeInteger(entry.bytes) && entry.bytes >= 0); left = entry.bytes; fileHash = crypto.createHash("sha256"); phase = "data";
              if (!left) { assert.equal(fileHash.digest("hex"), entry.sha256); phase = "separator"; }
            }
            header = Buffer.alloc(0);
          }
        }
      }
      callback();
    } catch (error) { callback(error); }
  } });
  async function* chunks() { for (const s of index.shards) for await (const b of fs.createReadStream(path.join(directory, s.name))) yield b; }
  await pipeline(Readable.from(chunks()), zlib.createGunzip(), sink);
  assert.equal(phase, "header"); assert.equal(header.length, 0); assert.equal(fileIndex, index.files.length);
  assert.equal(total, index.expandedBytes); assert.equal(archiveHash.digest("hex"), index.archiveSha256); return true;
}
module.exports = { store, replayJournal, bundle, verifyBundle, hash, hashFile };
