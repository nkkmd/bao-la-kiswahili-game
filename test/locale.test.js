"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const Locale = require("../public/locale.js");

assert.equal(Locale.detectLanguage({ languages: ["ja-JP"] }), "ja");
assert.equal(Locale.detectLanguage({ languages: ["ja"] }), "ja");
assert.equal(Locale.detectLanguage({ language: "ja-JP" }), "ja");
assert.equal(Locale.detectLanguage({ languages: ["en-US", "ja-JP"] }), "en");
assert.equal(Locale.detectLanguage({ languages: ["fr-FR"] }), "en");
assert.equal(Locale.detectLanguage({}), "en");

const html = fs.readFileSync("public/index.html", "utf8");
const main = fs.readFileSync("public/main.js", "utf8");
const manifest = JSON.parse(fs.readFileSync("public/manifest.webmanifest", "utf8"));
const serviceWorker = fs.readFileSync("public/service-worker.js", "utf8");

assert.match(html, /<html lang="en">/);
assert.match(html, /data-ja="対局設定"/);
assert.match(html, /src="\.\/locale\.js"/);
assert.ok(html.indexOf("./locale.js") < html.indexOf("./engine.js"),
  "locale initialization runs before game scripts");
assert.match(main, /window\.BaoLocale/);
assert.equal(manifest.lang, "en");
assert.match(serviceWorker, /\.\/locale\.js/);
assert.match(serviceWorker, /bao-la-kiswahili-v30/);

console.log("locale.test.js: ok");
