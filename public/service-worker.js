"use strict";
const CACHE = "bao-la-kiswahili-v20";
const FILES = ["./", "./index.html", "./style.css", "./engine.js", "./ai-weights.js", "./ai.js", "./ai-config.js", "./ai-worker.js", "./diagnostics.js", "./main.js", "./manifest.webmanifest", "./icon.svg", "./privacy.html"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => {
    if (cached) return cached;
    const path = new URL(event.request.url).pathname.replace(/\/$/, "");
    if (path.endsWith("/privacy")) return caches.match("./privacy.html").then((privacy) => privacy || fetch(event.request));
    return fetch(event.request);
  }));
});
