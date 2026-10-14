"use strict";
// 値・評価・探索順位を受け取らない構造選定。終局は勝者名を除いた真偽値で渡す。
function classify(root, branches, limits) {
  if (!root || root.nonterminal !== true || root.phase !== "mtaji" || !root.reserve?.every(v => v === 0)
    || root.reserve.length !== 2 || !Number.isInteger(root.width) || root.width < limits.minWidth || root.width > limits.maxWidth) return "ROOT-EXCLUDED";
  if (!Array.isArray(branches) || branches.length !== root.width || branches.some(b => !b || typeof b.nonterminal !== "boolean")) return "UNKNOWN";
  if (branches.some(b => b.nonterminal === false)) return "TERMINAL-CHILD-EXCLUDED";
  if (branches.some(b => b.width == null || b.mode == null)) return "UNKNOWN";
  if (branches.some(b => !Number.isInteger(b.width) || b.width < 1 || b.width > limits.maxReplyWidth)) return "REPLY-WIDTH-EXCLUDED";
  if (branches.some(b => !["capture", "takata"].includes(b.mode))) return "MODE-EXCLUDED";
  return branches.some(b => b.mode === "capture") && branches.some(b => b.mode === "takata")
    ? "MIXED-REPLY-ELIGIBLE" : "HOMOGENEOUS-REPLY-EXCLUDED";
}
function replyMode(keys) {
  if (!keys.length) return null;
  const types = new Set(keys.map(k => JSON.parse(k).type));
  return types.size === 1 ? [...types][0] : "mixed-or-other";
}
// 閉包結果の取得前に全軌跡の最後の構造適格rootを固定する。値による代替はしない。
function latestEligible(rows) {
  let last = null, previous = -1;
  for (const row of rows) {
    if (!Number.isInteger(row.ply) || row.ply <= previous) throw Error("Unordered trajectory");
    previous = row.ply;
    if (row.status === "MIXED-REPLY-ELIGIBLE") last = { ply: row.ply, raw: row.raw };
  }
  return last;
}
module.exports = { classify, replyMode, latestEligible };
