"use strict";
const fs = require("node:fs"), cp = require("node:child_process"), assert = require("node:assert/strict");
function groupRss(groupId) {
  let bytes = 0, processes = 0; const namespace = fs.readlinkSync("/proc/self/ns/pid");
  for (const name of fs.readdirSync("/proc")) if (/^\d+$/.test(name)) {
    try {
      const stat = fs.readFileSync("/proc/" + name + "/stat", "utf8"), fields = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
      if (fields[0] === "Z") continue;
      const status = fs.readFileSync("/proc/" + name + "/status", "utf8"), nsGroup = /^NSpgid:\s+(.+)$/m.exec(status);
      const effectiveGroup = nsGroup ? Number(nsGroup[1].trim().split(/\s+/).at(-1)) : Number(fields[2]);
      if (effectiveGroup !== groupId || fs.readlinkSync("/proc/" + name + "/ns/pid") !== namespace) continue;
      const rss = /^VmRSS:\s+(\d+)\s+kB$/m.exec(status);
      if (rss) { bytes += Number(rss[1]) * 1024; processes++; }
    } catch (e) { if (!["ENOENT", "ESRCH"].includes(e.code)) throw e; }
  }
  return { bytes, processes };
}
async function supervise(command, args, limits, hooks = {}) {
  assert.equal(process.platform, "linux"); assert.ok(limits.maxTotalMs > 0 && limits.maxRssBytes > 0);
  const start = performance.now(), worker = cp.spawn(command, args, { detached: true, stdio: ["ignore", "pipe", "pipe"], env: hooks.env ?? process.env });
  let reason = null, peak = 0, maxProcesses = 0, stdout = "", stderr = "", ticks = 0, mirrorError = null;
  let mirroring = Promise.resolve(), mirrorPending = false, terminating = false, graceTimer;
  worker.stdout.on("data", b => { if (stdout.length < 65536) stdout += b.toString(); });
  worker.stderr.on("data", b => { if (stderr.length < 65536) stderr += b.toString(); });
  function kill(signal) { if (!Number.isInteger(worker.pid)) return; try { process.kill(-worker.pid, signal); } catch (e) { if (e.code !== "ESRCH") throw e; } }
  function stop(code) {
    if (terminating) return; terminating = true; reason = code; kill("SIGTERM");
    graceTimer = setTimeout(() => kill("SIGKILL"), limits.killGraceMs ?? 100);
  }
  const scheduleMirror = final => {
    if (mirrorPending && !final) return;
    mirrorPending = true;
    mirroring = mirroring.then(() => hooks.mirror?.(final)).catch(e => { mirrorError = e.message; stop("MIRROR-FAILURE"); }).finally(() => { mirrorPending = false; });
  };
  const timer = setInterval(() => {
    try {
      const sample = groupRss(worker.pid); peak = Math.max(peak, sample.bytes); maxProcesses = Math.max(maxProcesses, sample.processes);
      hooks.sample?.(sample); ticks++;
      if (sample.bytes > limits.maxRssBytes) stop("AGGREGATE-RSS-LIMIT");
      if (performance.now() - start >= limits.maxTotalMs) stop("GLOBAL-TIME-LIMIT");
      if (ticks % (limits.mirrorEveryTicks ?? 10) === 0 && !terminating) scheduleMirror(false);
    } catch (e) { mirrorError = e.message; stop("SUPERVISOR-FAILURE"); }
  }, limits.pollMs ?? 20);
  let result;
  try {
    result = await new Promise((resolve, reject) => { worker.once("error", reject); worker.once("exit", (code, signal) => resolve({ code, signal })); });
  } finally {
    clearInterval(timer);
    // leader終了後も同じprocess groupの子を残さない。終了mirror前に停止させる。
    kill("SIGKILL"); if (graceTimer) clearTimeout(graceTimer);
  }
  scheduleMirror(true); await mirroring;
  return { ...result, status: reason ?? (result.code === 0 ? "WORKER-COMPLETE" : "WORKER-INCOMPLETE"),
    solution: reason || result.code !== 0 ? null : undefined, peakAggregateRssBytes: peak, maxProcesses, ticks, mirrorError, stdout, stderr };
}
module.exports = { groupRss, supervise };
