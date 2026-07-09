"use strict";
const CACHE = "bao-la-kiswahili-v18";
const FILES = ["./", "./index.html", "./style.css", "./engine.js", "./ai-weights.js", "./ai.js", "./ai-config.js", "./ai-worker.js", "./main.js", "./manifest.webmanifest", "./icon.svg", "./privacy.html"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => { if (event.request.method !== "GET") return; event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))); });
