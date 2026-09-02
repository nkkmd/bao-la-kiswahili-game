#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const p="doc/RESEARCH_INDEX.md";
let s=fs.readFileSync(p,"utf8");
const replacements=[
  ["**Study ID:** `BECT-STUDY1`  \n","**Study ID:** `BECT-STUDY1`\n"],
  ["**状態:** `CLOSED / TECHNICAL-INVALID`  \n","**状態:** `CLOSED / TECHNICAL-INVALID`\n"],
  ["**formal promoted candidate set:** `[]`  \n","**formal promoted candidate set:** `[]`\n"]
];
for(const [a,b] of replacements){
  if(!s.includes(a)&&!s.includes(b))throw new Error(`expected BECT index line missing: ${a.trim()}`);
  s=s.replace(a,b);
}
fs.writeFileSync(p,s);
console.log("BECT_G3_05_INDEX_WHITESPACE_NORMALIZED=true");
