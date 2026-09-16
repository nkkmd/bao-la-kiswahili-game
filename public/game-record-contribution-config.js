"use strict";

(function configureBaoGameRecordContribution(root) {
  root.BaoGameRecordContributionConfig = Object.freeze({
    // Controlled test configuration for feat/game-record-contribution-20260916.
    // The Turnstile site key and Worker URL are public identifiers. The
    // TURNSTILE_SECRET_KEY remains a Cloudflare Worker secret and must never
    // be committed here. Worker-side COLLECTION_ENABLED remains false in
    // wrangler.jsonc and is enabled only temporarily in Cloudflare for the
    // explicit test window.
    enabled: true,
    endpoint: "https://bao-game-record-ingest.oruorane.workers.dev/v1/game-records",
    turnstileSiteKey: "0x4AAAAAAE4W_jsKIMA65M99",
    maxRecordBytes: 49152,
  });
}(typeof window !== "undefined" ? window : globalThis));
