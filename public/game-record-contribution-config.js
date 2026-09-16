"use strict";

(function configureBaoGameRecordContribution(root) {
  root.BaoGameRecordContributionConfig = Object.freeze({
    // Fail closed until the Cloudflare Worker, R2 bucket, and Turnstile widget
    // have been provisioned and tested. The site key is public and may be
    // committed here; TURNSTILE_SECRET_KEY must remain a Worker secret.
    enabled: false,
    endpoint: "https://bao-data.cultivationdata.net/v1/game-records",
    turnstileSiteKey: "",
    maxRecordBytes: 49152,
  });
}(typeof window !== "undefined" ? window : globalThis));
