"use strict";
const CACHE = "bao-la-kiswahili-v40";
const FILES = ["./", "./index.html", "./style.css", "./locale.js", "./engine.js", "./ai-weights.js", "./ai.js", "./logic-evaluator.js", "./ai-candidate.js", "./ai-release.js", "./ai-release-worker.js", "./ai-config.js", "./ai-worker.js", "./diagnostics.js", "./review-suggestion.js", "./diagnostic-download.js", "./main.js", "./manifest.webmanifest", "./icon.svg", "./privacy"];
FILES.push("./rules", "./rules.css", "./rules.js",
  ...["board-overview", "initial-setup", "sowing-before", "sowing-relay", "sowing-stop",
    "capture-before", "capture-taken", "capture-after", "nyumba-two", "front-empty"]
    .map((name) => `./assets/rules/${name}.svg`));
// 言語はクライアントで選ぶため、既知のHTMLページだけURLの別名を同一キャッシュに対応させる。
// 他のリソースや外部URLのクエリーは維持する。
const DOCUMENTS = new Map([
  ["./", "./"], ["./index.html", "./"],
  ["./rules", "./rules"], ["./rules.html", "./rules"],
  ["./privacy", "./privacy"], ["./privacy.html", "./privacy"],
].map(([requestPath, cachedPath]) => [new URL(requestPath, self.registration.scope).href,
  new URL(cachedPath, self.registration.scope).href]));
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const cacheKey = DOCUMENTS.get(url.origin + url.pathname) || event.request;
  event.respondWith(caches.match(cacheKey).then((cached) => {
    if (cached) return cached;
    return fetch(event.request);
  }));
});
