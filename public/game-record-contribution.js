"use strict";

(function exposeBaoGameRecordContribution(root) {
  const ACTION = "game_record_contribution";
  const CONSENT_VERSION = 1;
  const DEFAULT_MAX_RECORD_BYTES = 48 * 1024;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function config() {
    const source = root.BaoGameRecordContributionConfig || {};
    return {
      enabled: source.enabled === true,
      endpoint: typeof source.endpoint === "string" ? source.endpoint.trim() : "",
      turnstileSiteKey: typeof source.turnstileSiteKey === "string" ? source.turnstileSiteKey.trim() : "",
      maxRecordBytes: Number.isInteger(source.maxRecordBytes) && source.maxRecordBytes > 0
        ? source.maxRecordBytes : DEFAULT_MAX_RECORD_BYTES,
    };
  }

  function recordSizeBytes(record) {
    return new TextEncoder().encode(JSON.stringify(record)).byteLength;
  }

  function isEligibleRecord(record) {
    return Boolean(record?.result && record?.finalPosition && record?.settings?.mode === "computer");
  }

  function stablePosition(value) {
    if (!value) return null;
    return {
      pits: value.pits,
      reserve: value.reserve,
      houseOwned: value.houseOwned,
      player: value.player,
      phase: value.phase,
      winner: value.winner,
      reason: value.reason || "",
      turn: value.turn,
      pending: value.pending || [0, 0],
    };
  }

  function verifyLocally(record) {
    const GameRecord = root.BaoGameRecord;
    const Engine = root.BaoEngine;
    if (!GameRecord || !Engine) throw new Error("Bao record verifier unavailable");
    GameRecord.validateRecord(record, true);
    const replayed = GameRecord.replay(record, Engine);
    if (JSON.stringify(stablePosition(replayed)) !== JSON.stringify(stablePosition(record.finalPosition))) {
      throw new Error("Bao game record replay mismatch");
    }
    return true;
  }

  const api = { ACTION, CONSENT_VERSION, config, recordSizeBytes, isEligibleRecord, verifyLocally };
  root.BaoGameRecordContribution = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (typeof document === "undefined" || !root.BaoGameRecord) return;

  const Locale = root.BaoLocale;
  const t = (english, japanese) => Locale?.t ? Locale.t(english, japanese) : english;
  let pendingRecord = null;
  let turnstileWidgetId = null;
  let turnstileToken = "";
  let turnstileLoader = null;
  let contributionButton = null;
  let dialog = null;
  let dialogStatus = null;
  let confirmButton = null;
  let turnstileContainer = null;

  function setRecordStatus(message) {
    const status = document.querySelector("#game-record-status");
    if (status) status.textContent = message;
  }

  function contributionReady() {
    const current = config();
    return current.enabled && Boolean(current.endpoint) && Boolean(current.turnstileSiteKey);
  }

  function syncContributionButton() {
    if (!contributionButton) return;
    const panel = document.querySelector("#game-record-actions");
    const record = root.BaoGameRecord.activeRecord?.();
    contributionButton.hidden = !contributionReady() || panel?.hidden !== false || !isEligibleRecord(record);
    if (!contributionButton.hidden && !contributionButton.dataset.submitted) contributionButton.disabled = false;
  }

  function loadTurnstile() {
    if (root.turnstile?.render) return Promise.resolve(root.turnstile);
    if (turnstileLoader) return turnstileLoader;
    turnstileLoader = new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-bao-turnstile]");
      if (existing) {
        existing.addEventListener("load", () => resolve(root.turnstile), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.baoTurnstile = "true";
      script.addEventListener("load", () => resolve(root.turnstile), { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.append(script);
    });
    return turnstileLoader;
  }

  function resetTurnstile() {
    turnstileToken = "";
    if (confirmButton) confirmButton.disabled = true;
    if (turnstileWidgetId !== null && root.turnstile?.remove) {
      try { root.turnstile.remove(turnstileWidgetId); } catch { /* no-op */ }
    }
    turnstileWidgetId = null;
    if (turnstileContainer) turnstileContainer.textContent = "";
  }

  async function renderTurnstile() {
    resetTurnstile();
    dialogStatus.textContent = t("Checking this submission…", "送信前の確認を行っています…");
    try {
      const turnstile = await loadTurnstile();
      if (!turnstile?.render) throw new Error("Turnstile unavailable");
      turnstileWidgetId = turnstile.render(turnstileContainer, {
        sitekey: config().turnstileSiteKey,
        action: ACTION,
        theme: "auto",
        callback(token) {
          turnstileToken = token;
          confirmButton.disabled = false;
          dialogStatus.textContent = t("Ready to send.", "送信できます。");
        },
        "expired-callback"() {
          turnstileToken = "";
          confirmButton.disabled = true;
          dialogStatus.textContent = t("Verification expired. Please verify again.", "確認の有効期限が切れました。もう一度確認してください。");
        },
        "error-callback"() {
          turnstileToken = "";
          confirmButton.disabled = true;
          dialogStatus.textContent = t("Could not verify this submission.", "送信前の確認に失敗しました。");
        },
      });
    } catch {
      dialogStatus.textContent = t("Could not prepare secure submission. You can still save the record locally.", "安全な送信を準備できませんでした。棋譜の端末保存は引き続き利用できます。");
    }
  }

  function closeDialog() {
    resetTurnstile();
    pendingRecord = null;
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else if (dialog) dialog.removeAttribute("open");
  }

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.id = "game-record-contribution-dialog";
    dialog.setAttribute("aria-labelledby", "game-record-contribution-title");
    dialog.style.maxWidth = "min(92vw, 520px)";
    dialog.style.border = "1px solid #6f8f7f";
    dialog.style.borderRadius = "10px";
    dialog.style.padding = "18px";
    dialog.style.background = "#172c2b";
    dialog.style.color = "#edf4e8";

    const title = document.createElement("h2");
    title.id = "game-record-contribution-title";
    title.textContent = t("Contribute this game record?", "この棋譜をAI改善のため送信しますか？");
    title.style.marginTop = "0";

    const summary = document.createElement("p");
    summary.textContent = t(
      "If you agree, this completed computer game will be sent voluntarily to help evaluate and improve the Bao AI.",
      "同意すると、このコンピュータ対戦の棋譜を、Bao AIの評価・改善に役立てるため任意で送信します。",
    );

    const details = document.createElement("ul");
    const detailTexts = [
      ["Sent: board positions, confirmed moves, result, game settings, and AI version.", "送信内容: 盤面、確定した着手、勝敗、対局設定、AIバージョン。"],
      ["Not included in the record: name, email address, free-form text, persistent user ID, AI search statistics, or device fingerprint.", "棋譜に含めない情報: 氏名、メールアドレス、自由記述、恒久的な利用者ID、AI探索統計、端末フィンガープリント。"],
      ["Submission is optional and happens only after you press Agree and send for this game.", "送信は任意で、この対局について「同意して送信」を押した場合だけ行います。"],
    ];
    for (const [english, japanese] of detailTexts) {
      const item = document.createElement("li");
      item.textContent = t(english, japanese);
      details.append(item);
    }

    const networkNote = document.createElement("p");
    networkNote.style.fontSize = "0.9em";
    networkNote.textContent = t(
      "Cloudflare may process connection information as part of network delivery and abuse prevention, but the collector does not write the source IP address into the stored game-record object.",
      "通信処理と不正利用防止のためCloudflareが接続情報を処理する場合がありますが、収集側は送信元IPアドレスを保存棋譜オブジェクトへ書き込みません。",
    );

    const privacy = document.createElement("a");
    privacy.href = "./privacy";
    privacy.target = "_blank";
    privacy.rel = "noopener noreferrer";
    privacy.textContent = t("Privacy Policy ↗", "プライバシーポリシー ↗");

    turnstileContainer = document.createElement("div");
    turnstileContainer.id = "game-record-contribution-turnstile";
    turnstileContainer.style.minHeight = "2px";
    turnstileContainer.style.margin = "12px 0";

    dialogStatus = document.createElement("p");
    dialogStatus.id = "game-record-contribution-dialog-status";
    dialogStatus.setAttribute("aria-live", "polite");
    dialogStatus.style.fontSize = "0.9em";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = t("Cancel", "キャンセル");
    cancel.addEventListener("click", closeDialog);

    confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = t("Agree and send", "同意して送信");
    confirmButton.disabled = true;
    confirmButton.addEventListener("click", submitContribution);

    actions.append(cancel, confirmButton);
    dialog.append(title, summary, details, networkNote, privacy, turnstileContainer, dialogStatus, actions);
    document.body.append(dialog);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    return dialog;
  }

  async function submitContribution() {
    if (!pendingRecord || !turnstileToken) return;
    const current = config();
    confirmButton.disabled = true;
    dialogStatus.textContent = t("Sending…", "送信しています…");
    try {
      const response = await fetch(current.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: pendingRecord,
          turnstileToken,
          consent: { version: CONSENT_VERSION, purpose: "ai-improvement" },
        }),
      });
      let payload = null;
      try { payload = await response.json(); } catch { /* no-op */ }
      if (response.ok && payload?.ok) {
        const duplicate = payload.duplicate === true;
        contributionButton.dataset.submitted = "true";
        contributionButton.disabled = true;
        setRecordStatus(duplicate
          ? t("This game record was already received. Thank you.", "この棋譜はすでに受信済みです。ご協力ありがとうございます。")
          : t("Game record sent. Thank you for helping improve the AI.", "棋譜を送信しました。AI改善へのご協力ありがとうございます。"));
        closeDialog();
        return;
      }
      if (response.status === 429) {
        dialogStatus.textContent = t(
          "The contribution service is temporarily at its safety limit. Please try again later; you can still save the record locally.",
          "棋譜収集が安全上限に達しています。時間をおいて再度お試しください。棋譜の端末保存は引き続き利用できます。",
        );
      } else if (response.status === 413) {
        dialogStatus.textContent = t("This game record is too large to contribute, but it can still be saved locally.", "この棋譜は送信上限を超えていますが、端末への保存はできます。");
      } else {
        dialogStatus.textContent = t("Could not send the game record. It was not queued or retried automatically.", "棋譜を送信できませんでした。自動的な保留・再送は行いません。");
      }
    } catch {
      dialogStatus.textContent = t("Could not send the game record. It was not queued or retried automatically.", "棋譜を送信できませんでした。自動的な保留・再送は行いません。");
    }
    await renderTurnstile();
  }

  function openContributionDialog() {
    const record = root.BaoGameRecord.activeRecord?.();
    const current = config();
    if (!contributionReady() || !isEligibleRecord(record)) return;
    try {
      verifyLocally(record);
      if (recordSizeBytes(record) > current.maxRecordBytes) {
        setRecordStatus(t("This game record is too large to contribute, but it can still be saved locally.", "この棋譜は送信上限を超えていますが、端末への保存はできます。"));
        return;
      }
    } catch {
      setRecordStatus(t("This game record could not be verified for contribution. Local saving is still available.", "この棋譜は送信用の検証に通りませんでした。端末への保存は引き続き利用できます。"));
      return;
    }
    pendingRecord = clone(record);
    ensureDialog();
    dialogStatus.textContent = "";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    renderTurnstile();
  }

  function installUi() {
    const panel = document.querySelector("#game-record-actions");
    if (!panel || document.querySelector("#send-game-record")) return;
    contributionButton = document.createElement("button");
    contributionButton.id = "send-game-record";
    contributionButton.type = "button";
    contributionButton.hidden = true;
    contributionButton.textContent = t("Send game record for AI improvement", "AI改善のため棋譜を送信");
    contributionButton.addEventListener("click", openContributionDialog);
    const status = panel.querySelector("#game-record-status");
    if (status) panel.insertBefore(contributionButton, status);
    else panel.append(contributionButton);

    if (typeof MutationObserver !== "undefined") {
      new MutationObserver(syncContributionButton).observe(panel, { attributes: true, attributeFilter: ["hidden", "style"] });
    }
    document.querySelector("#new-game")?.addEventListener("click", () => {
      contributionButton.dataset.submitted = "";
      contributionButton.disabled = false;
      contributionButton.hidden = true;
      if (dialog?.open) closeDialog();
    });
    syncContributionButton();
  }

  installUi();
}(typeof window !== "undefined" ? window : globalThis));
