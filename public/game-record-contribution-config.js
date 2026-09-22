"use strict";

(function configureBaoGameRecordContribution(root) {
  root.BaoGameRecordContributionConfig = Object.freeze({
    // Production client configuration. The Turnstile site key and Worker URL
    // are public identifiers. TURNSTILE_SECRET_KEY remains a Cloudflare Worker
    // secret and must never be committed here. wrangler.jsonc intentionally
    // keeps COLLECTION_ENABLED=false as a fail-closed deployment default;
    // actual production enablement is managed explicitly in Cloudflare.
    enabled: true,
    endpoint: "https://bao-data.cultivationdata.net/v1/game-records",
    turnstileSiteKey: "0x4AAAAAAE4W_jsKIMA65M99",
    maxRecordBytes: 49152,
  });
}(typeof window !== "undefined" ? window : globalThis));
