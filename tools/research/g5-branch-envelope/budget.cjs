"use strict";
const { Stop } = require("./source.cjs");
function budget(limits, clock = () => performance.now(), rss = () => process.resourceUsage().maxRSS * 1024) {
  const started = clock();
  return { check(domainStarted = null) {
    const now = clock();
    if (now - started >= limits.maxTotalMs) throw new Stop("GLOBAL-TIME-LIMIT");
    if (rss() > limits.maxRssBytes) throw new Stop("RSS-LIMIT");
    if (domainStarted !== null && now - domainStarted >= limits.maxDomainMs) throw new Stop("TIME-LIMIT");
  }, clock };
}
module.exports = { budget };
