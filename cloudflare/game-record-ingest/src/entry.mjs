import { handleRequest } from "./index.mjs";

const TRUSTED_FETCH_SITES = new Set(["same-origin", "same-site"]);

function csvSet(value) {
  return new Set(String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean));
}

function allowedOrigins(env) {
  return csvSet(env.ALLOWED_ORIGINS);
}

function crossSiteExceptionOrigins(env) {
  return csvSet(env.FETCH_METADATA_CROSS_SITE_ORIGINS);
}

export function fetchMetadataAllowed(request, env) {
  const site = (request.headers.get("Sec-Fetch-Site") || "").toLowerCase();
  const mode = (request.headers.get("Sec-Fetch-Mode") || "").toLowerCase();
  const dest = (request.headers.get("Sec-Fetch-Dest") || "").toLowerCase();
  const origin = request.headers.get("Origin") || "";

  // This endpoint is called by fetch() and should not be reached through a
  // navigation, image/script load, no-cors request, or a client that omits
  // Fetch Metadata entirely. Sec-* request headers are browser-controlled.
  if (mode !== "cors" || dest !== "empty") return false;
  if (TRUSTED_FETCH_SITES.has(site)) return true;

  // The temporary Pages test site is cross-site to the Worker. Permit only an
  // exact, separately allow-listed Origin; arbitrary cross-site requests stay
  // rejected. Production should normally use same-site cultivationdata.net.
  return site === "cross-site"
    && crossSiteExceptionOrigins(env).has(origin);
}

function rejection(origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return new Response(JSON.stringify({ ok: false, error: "fetch_metadata_rejected" }), {
    status: 403,
    headers,
  });
}

export async function fetchWithMetadata(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  // Preserve the existing Worker as the authority for routes, preflight,
  // methods, and the exact Origin allow-list. The additional gate applies only
  // to an otherwise allowed state-changing browser POST.
  if (url.pathname === "/v1/game-records"
    && request.method === "POST"
    && allowedOrigins(env).has(origin)
    && !fetchMetadataAllowed(request, env)) {
    return rejection(origin);
  }

  return handleRequest(request, env);
}

export default {
  fetch(request, env) {
    return fetchWithMetadata(request, env);
  },
};
