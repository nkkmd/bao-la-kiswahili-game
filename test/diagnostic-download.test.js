"use strict";

const assert = require("node:assert/strict");

const downloads = [];
const body = {
  append(link) {
    downloads.push(link);
  },
};
Object.defineProperty(globalThis, "navigator", { configurable: true, value: {} });
globalThis.document = {
  body,
  activeElement: null,
  execCommand: undefined,
  createElement(tag) {
    assert.equal(tag, "a");
    return {
      click() { this.clicked = true; },
      remove() { this.removed = true; },
    };
  },
  querySelector() { return null; },
};
globalThis.MutationObserver = class {
  observe() {}
};
const blobs = new Map();
globalThis.URL = {
  createObjectURL(blob) {
    const url = `blob:test-${blobs.size}`;
    blobs.set(url, blob);
    return url;
  },
  revokeObjectURL() {},
};

require("../public/diagnostic-download.js");

(async () => {
  const positionText = JSON.stringify({ format: "bao-ai-diagnostic", version: 1, position: {} });
  await navigator.clipboard.writeText(positionText);
  const positionDownload = downloads.at(-1);
  assert.match(positionDownload.download, /^bao-position-\d{8}-\d{6}\.json$/);
  assert.equal(await blobs.get(positionDownload.href).text(), positionText,
    "position downloads preserve the JSON body without adding a timestamp");
  assert.equal(positionDownload.clicked, true);

  const recordsText = JSON.stringify([{ review: { status: "unreviewed", signals: [] } }]);
  await navigator.clipboard.writeText(recordsText);
  const recordsDownload = downloads.at(-1);
  assert.match(recordsDownload.download, /^bao-ai-review-\d{8}-\d{6}\.json$/);
  assert.equal(await blobs.get(recordsDownload.href).text(), recordsText,
    "review downloads preserve review data");
  assert.equal(recordsDownload.clicked, true);

  console.log("Bao diagnostic download tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
