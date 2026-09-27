#!/usr/bin/env node
"use strict";

if (process.env.BRSGT_STAGE2_EXECUTION_TRIGGER_OK !== "1") {
  throw new Error("BRSGT Stage 2 authorized execution trigger env missing");
}

require("./run-brsgt-stage2-formal.js");
