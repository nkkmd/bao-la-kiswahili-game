"use strict";
const CACHE = "bao-la-kiswahili-v37";
const FILES = ["./", "./index.html", "./style.css", "./locale.js", "./engine.js", "./ai-weights.js", "./ai.js", "./logic-evaluator.js", "./ai-candidate.js", "./ai-release.js", "./ai-release-worker.js", "./ai-config.js", "./ai-worker.js", "./diagnostics.js", "./review-suggestion.js", "./diagnostic-download.js", "./main.js", "./manifest.webmanifest", "./icon.svg", "./privacy"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => {
    if (cached) return cached;
    return fetch(event.request);
  }));
});
