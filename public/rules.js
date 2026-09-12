"use strict";

(() => {
  const locale = window.BaoLocale;
  locale.localize(document);
  const languageLinks = document.querySelectorAll("[data-language]");
  function updateLanguageLinks() {
    languageLinks.forEach((link) => {
      const url = new URL(location.href);
      url.searchParams.set("lang", link.dataset.language);
      link.href = url.href;
      if (link.dataset.language === locale.language) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }
  updateLanguageLinks();
  window.addEventListener("hashchange", updateLanguageLinks);

  const dialog = document.querySelector("#figure-dialog");
  if (typeof dialog.showModal === "function") {
    document.querySelectorAll(".figure-zoom").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const figure = link.closest("figure");
        const original = figure.querySelector("img");
        const enlarged = dialog.querySelector("img");
        enlarged.src = original.src;
        enlarged.alt = original.alt;
        dialog.querySelector(".zoom-caption").textContent = figure.querySelector("figcaption").textContent;
        link.focus();
        dialog.showModal();
        dialog.querySelector(".zoom-scroll").scrollTo(0, 0);
      });
    });
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  }
  let closedDetails = [];
  window.addEventListener("beforeprint", () => {
    closedDetails = [...document.querySelectorAll("details:not([open])")];
    closedDetails.forEach(node => { node.open = true; });
  });
  window.addEventListener("afterprint", () => {
    closedDetails.forEach(node => { node.open = false; });
    closedDetails = [];
  });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
  }
})();
