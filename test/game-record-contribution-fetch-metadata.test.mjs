import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fetchMetadataAllowed, fetchWithMetadata } from "../cloudflare/game-record-ingest/src/entry.mjs";

const wrangler = JSON.parse(fs.readFileSync("cloudflare/game-record-ingest/wrangler.jsonc", "utf8"));

function env() {
  return {
    COLLECTION_ENABLED: "false",
    ALLOWED_ORIGINS: "https://bao-la-kiswahili.cultivationdata.net,https://cdn-ts.pages.dev",
    FETCH_METADATA_CROSS_SITE_ORIGINS: "https://cdn-ts.pages.dev",
  };
}

function post(origin, metadata = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Origin": origin,
  };
  if (metadata.site !== undefined) headers["Sec-Fetch-Site"] = metadata.site;
  if (metadata.mode !== undefined) headers["Sec-Fetch-Mode"] = metadata.mode;
  if (metadata.dest !== undefined) headers["Sec-Fetch-Dest"] = metadata.dest;
  return new Request("https://bao-data.cultivationdata.net/v1/game-records", {
    method: "POST",
    headers,
    body: "{}",
  });
}

const normalFetchMetadata = { site: "same-site", mode: "cors", dest: "empty" };

test("Wrangler deploys the Fetch Metadata gate and only names the controlled cross-site test Origin", () => {
  assert.equal(wrangler.main, "src/entry.mjs");
  assert.equal(wrangler.vars.FETCH_METADATA_CROSS_SITE_ORIGINS, "https://cdn-ts.pages.dev");
});

test("production same-site fetch metadata is accepted by the outer gate", () => {
  const request = post("https://bao-la-kiswahili.cultivationdata.net", normalFetchMetadata);
  assert.equal(fetchMetadataAllowed(request, env()), true);
});

test("missing Fetch Metadata is rejected fail-closed", async () => {
  const request = post("https://bao-la-kiswahili.cultivationdata.net");
  assert.equal(fetchMetadataAllowed(request, env()), false);
  const response = await fetchWithMetadata(request, env());
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error, "fetch_metadata_rejected");
});

test("arbitrary cross-site browser requests are rejected", async () => {
  const request = post("https://bao-la-kiswahili.cultivationdata.net", {
    site: "cross-site",
    mode: "cors",
    dest: "empty",
  });
  const response = await fetchWithMetadata(request, env());
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error, "fetch_metadata_rejected");
});

test("only the exact temporary test origin may use the cross-site exception", async () => {
  const request = post("https://cdn-ts.pages.dev", {
    site: "cross-site",
    mode: "cors",
    dest: "empty",
  });
  assert.equal(fetchMetadataAllowed(request, env()), true);
  const response = await fetchWithMetadata(request, env());
  // Passing the outer gate reaches the existing Worker, whose server-side
  // collection kill switch is deliberately disabled in this fixture.
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "collection_disabled");
});

test("navigation/no-cors style requests are rejected even from an allowed Origin", async () => {
  for (const metadata of [
    { site: "same-site", mode: "navigate", dest: "document" },
    { site: "same-site", mode: "no-cors", dest: "empty" },
    { site: "same-site", mode: "cors", dest: "image" },
  ]) {
    const response = await fetchWithMetadata(
      post("https://bao-la-kiswahili.cultivationdata.net", metadata),
      env(),
    );
    assert.equal(response.status, 403);
  }
});

test("CORS preflight is left to the existing Origin allow-list", async () => {
  const request = new Request("https://bao-data.cultivationdata.net/v1/game-records", {
    method: "OPTIONS",
    headers: { "Origin": "https://bao-la-kiswahili.cultivationdata.net" },
  });
  const response = await fetchWithMetadata(request, env());
  assert.equal(response.status, 204);
});
