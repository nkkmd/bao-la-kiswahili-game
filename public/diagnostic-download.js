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

  let installed = false;
  try {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: saveInsteadOfClipboard },
    });
    installed = navigator.clipboard?.writeText === saveInsteadOfClipboard;
  } catch {
    // Continue with narrower fallbacks below.
  }

  if (!installed && navigator.clipboard) {
    try {
      Object.defineProperty(navigator.clipboard, "writeText", {
        configurable: true,
        value: saveInsteadOfClipboard,
      });
      installed = navigator.clipboard.writeText === saveInsteadOfClipboard;
    } catch {
      // Continue with the execCommand fallback below.
    }
  }

  if (!installed) {
    const originalExecCommand = document.execCommand?.bind(document);
    document.execCommand = (command, ...args) => {
      if (String(command).toLowerCase() === "copy") {
        const field = document.activeElement;
        if (field instanceof HTMLTextAreaElement) {
          downloadJsonText(field.value);
          return true;
        }
      }
      return originalExecCommand ? originalExecCommand(command, ...args) : false;
    };
  }

  function rewriteStatus(node) {
    if (!node) return;
    const rewrite = () => {
      const next = node.textContent
        .replaceAll("コピーしました", "保存しました")
        .replaceAll("コピーできませんでした", "保存できませんでした")
        .replaceAll("コピーする記録", "保存する記録")
        .replaceAll("診断JSONをコピー", "診断JSONを保存");
      if (next !== node.textContent) node.textContent = next;
    };
    new MutationObserver(rewrite).observe(node, { childList: true, subtree: true });
  }

  rewriteStatus(document.querySelector("#diagnostic-status"));
  rewriteStatus(document.querySelector("#status"));
})();
