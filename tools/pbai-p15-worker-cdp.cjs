"use strict";

// Browser-level CDP session: measurements target the dedicated Worker isolate.
const WAIT_MS = 5000;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function browserSession(browser) {
  const cdp = await browser.newBrowserCDPSession();
  await cdp.send("Target.setDiscoverTargets", { discover: true });
  return cdp;
}
async function attachWorker(cdp) {
  let target;
  const until = Date.now() + WAIT_MS;
  do {
    const result = await cdp.send("Target.getTargets");
    const matching = result.targetInfos.filter((item) => item.type === "worker" && typeof item.url === "string"
      && item.url.endsWith("/public/ai-release-worker.js"));
    if (matching.length > 1) throw new Error("ambiguous Worker targets: " + matching.length);
    target = matching[0];
    if (target) break;
    await pause(100);
  } while (Date.now() < until);
  if (!target) throw new Error("dedicated AI Worker CDP target unavailable");
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: false });
  let nextId = 0;
  async function send(method, params = {}) {
    const id = ++nextId;
    const result = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cdp.off("Target.receivedMessageFromTarget", receive);
        reject(new Error("Worker CDP timeout: " + method));
      }, WAIT_MS);
      function receive(event) {
        if (event.sessionId !== sessionId) return;
        let message;
        try { message = JSON.parse(event.message); } catch { return; }
        if (message.id !== id) return;
        clearTimeout(timer);
        cdp.off("Target.receivedMessageFromTarget", receive);
        if (message.error) reject(new Error(method + ": " + JSON.stringify(message.error)));
        else resolve(message.result);
      }
      cdp.on("Target.receivedMessageFromTarget", receive);
    });
    await cdp.send("Target.sendMessageToTarget", {
      sessionId, message: JSON.stringify({ id, method, params }),
    });
    return result;
  }
  return {
    target: { type: target.type, url: target.url, targetId: target.targetId },
    send,
    detach: async () => cdp.send("Target.detachFromTarget", { sessionId }),
  };
}
async function heapSamples(worker) {
  await worker.send("HeapProfiler.collectGarbage");
  const samples = [];
  for (let i = 0; i < 3; i += 1) {
    if (i) await pause(100);
    const value = await worker.send("Runtime.getHeapUsage");
    if (!Number.isFinite(value.usedSize) || !Number.isFinite(value.totalSize)) {
      throw new Error("invalid Worker heap response");
    }
    samples.push({ usedSize: value.usedSize, totalSize: value.totalSize });
  }
  return { afterGarbageCollection: true, samples };
}
module.exports = { browserSession, attachWorker, heapSamples };
