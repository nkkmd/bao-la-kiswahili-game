"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const readme = fs.readFileSync("README.md", "utf8");
const html = fs.readFileSync("public/index.html", "utf8");
const privacy = fs.readFileSync("public/privacy.html", "utf8");
const robots = fs.readFileSync("public/robots.txt", "utf8");
const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");

const canonicalHome = "https://bao-la-kiswahili.cultivationdata.net/";
const canonicalPrivacy = "https://bao-la-kiswahili.cultivationdata.net/privacy";

assert.match(readme,
  /公式公開サイトは \[https:\/\/bao-la-kiswahili\.cultivationdata\.net\/\]/,
  "README identifies the official public game site");
assert.match(html,
  /<span data-ja="公式公開サイト: ">Official site: <\/span>/,
  "the footer identifies the canonical host as the official site");
assert.match(html,
  /href="https:\/\/bao-la-kiswahili\.cultivationdata\.net\/">bao-la-kiswahili\.cultivationdata\.net<\/a>/,
  "the footer links to the official public site");

assert.match(html,
  /<title[^>]*>Bao la Kiswahili Online – East African Mancala Board Game<\/title>/,
  "home title describes Bao, mancala, region and online play");
assert.match(html,
  /<meta name="description" content="[^"]*East African mancala strategy board game[^"]*Zanzibar and Tanzania[^"]*"[^>]*>/,
  "meta description contains a natural English summary");
assert.match(html,
  new RegExp(`<link rel="canonical" href="${canonicalHome.replaceAll(".", "\\.")}">`),
  "home page declares the production canonical URL");
assert.match(privacy,
  new RegExp(`<link rel="canonical" href="${canonicalPrivacy.replaceAll(".", "\\.")}">`),
  "privacy page declares its clean canonical URL");
assert.doesNotMatch(html, /<meta[^>]+name=["']keywords["']/i,
  "deprecated meta keywords are not used");

const structuredMatch = html.match(
  /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
);
assert.ok(structuredMatch, "home page includes JSON-LD structured data");
const structured = JSON.parse(structuredMatch[1]);
assert.equal(structured["@context"], "https://schema.org");
assert.equal(structured["@type"], "WebApplication");
assert.equal(structured.name, "Bao la Kiswahili");
assert.equal(structured.url, canonicalHome);
assert.equal(structured.applicationCategory, "GameApplication");
assert.equal(structured.isAccessibleForFree, true);
assert.ok(structured.genre.includes("Mancala"));
assert.ok(structured.genre.includes("Board game"));
assert.ok(structured.inLanguage.includes("en"));
assert.ok(structured.inLanguage.includes("ja"));

assert.match(html, /<details class="about-bao">/,
  "Bao background is available as user-visible collapsed content");
assert.match(html, /<summary data-ja="バオについて">About Bao<\/summary>/);
assert.match(html, /traditional East African mancala strategy board game/);
assert.match(html, /Zanzibar and mainland Tanzania/);
assert.match(html, /play Bao online against the computer AI/);
assert.match(html, /local two-player board game/);

assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^Allow: \/$/m);
assert.match(robots,
  /^Sitemap: https:\/\/bao-la-kiswahili\.cultivationdata\.net\/sitemap\.xml$/m);
assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.match(sitemap, /<loc>https:\/\/bao-la-kiswahili\.cultivationdata\.net\/<\/loc>/);
assert.match(sitemap, /<loc>https:\/\/bao-la-kiswahili\.cultivationdata\.net\/privacy<\/loc>/);

console.log("seo.test.js: ok");
