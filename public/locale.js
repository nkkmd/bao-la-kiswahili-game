"use strict";

(function exposeBaoLocale(root) {
  function detectLanguage(navigatorLike = {}, search = "") {
    const requested = new URLSearchParams(search).get("lang");
    if (requested === "ja" || requested === "en") return requested;
    const languages = Array.isArray(navigatorLike.languages) ? navigatorLike.languages : [];
    const primary = languages[0] || navigatorLike.language || "";
    return /^ja(?:-|$)/i.test(String(primary)) ? "ja" : "en";
  }

  const language = detectLanguage(root.navigator || {}, root.location?.search || "");
  const isJapanese = language === "ja";

  function t(english, japanese) {
    return isJapanese ? japanese : english;
  }

  function localize(rootNode) {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    if (!rootNode?.querySelectorAll) return;

    rootNode.querySelectorAll("[data-locale-link]").forEach((node) => {
      const href = new URL(node.getAttribute("href"), document.baseURI);
      href.searchParams.set("lang", language);
      node.setAttribute("href", href.href);
    });
    if (!isJapanese) return;

    rootNode.querySelectorAll("[data-ja]").forEach((node) => {
      node.textContent = node.dataset.ja;
    });
    rootNode.querySelectorAll("[data-ja-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", node.dataset.jaAriaLabel);
    });
    rootNode.querySelectorAll("[data-ja-title]").forEach((node) => {
      node.setAttribute("title", node.dataset.jaTitle);
    });
    rootNode.querySelectorAll("[data-ja-content]").forEach((node) => {
      node.setAttribute("content", node.dataset.jaContent);
    });
    rootNode.querySelectorAll("[data-ja-alt]").forEach((node) => {
      node.setAttribute("alt", node.dataset.jaAlt);
    });
  }

  const api = { detectLanguage, language, isJapanese, t, localize };
  root.BaoLocale = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
