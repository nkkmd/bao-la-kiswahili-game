#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = "doc/RESEARCH_INDEX.md";
let text = fs.readFileSync(path, "utf8");
const sectionMarker = "\n---\n\n### 13. Symmetry / Isomorphic Positions — Study 1";
const futureMarker = "\n---\n\n## 将来研究";
const sectionStart = text.indexOf(sectionMarker);
const futureStart = text.indexOf(futureMarker);
if (sectionStart < 0) throw new Error("Symmetry Study 1 section not found");
if (futureStart < 0) throw new Error("Future research marker not found");
if (sectionStart < futureStart) {
  console.log("Symmetry Study 1 section already precedes future research");
  process.exit(0);
}
const section = text.slice(sectionStart).trimEnd();
text = text.slice(0, sectionStart).trimEnd() + "\n";
const insertion = text.indexOf(futureMarker);
if (insertion < 0) throw new Error("Future research marker disappeared after extraction");
text = text.slice(0, insertion).trimEnd() + "\n\n" + section + text.slice(insertion) + "\n";
fs.writeFileSync(path, text);
console.log("Moved Symmetry Study 1 section before future research");
