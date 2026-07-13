"use strict";

(() => {
  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function timestamp(date = new Date()) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
      "-",
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds()),
    ].join("");
  }

  function filenameFor(value) {
    const prefix = Array.isArray(value) ? "bao-ai-review" : "bao-position";
    return `${prefix}-${timestamp()}.json`;
  }

  function downloadJsonText(text) {
    const value = JSON.parse(text);
    const filename = filenameFor(value);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function saveInsteadOfClipboard(text) {
    downloadJsonText(text);
  }

  try {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: saveInsteadOfClipboard },
    });
  } catch {
    if (navigator.clipboard) navigator.clipboard.writeText = saveInsteadOfClipboard;
  }

  const status = document.querySelector("#diagnostic-status");
  if (status) {
    const rewrite = () => {
      status.textContent = status.textContent
        .replaceAll("コピーしました", "保存しました")
        .replaceAll("コピーできませんでした", "保存できませんでした")
        .replaceAll("コピーする記録", "保存する記録");
    };
    new MutationObserver(rewrite).observe(status, { childList: true, subtree: true });
  }
})();
