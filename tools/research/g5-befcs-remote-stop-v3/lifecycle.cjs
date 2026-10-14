"use strict";
// 最初の失敗を保ち、work停止・timer解除・自分のwatch終了を順に行う。
async function lifecycle(body, hooks) {
  let value, primary = null;
  const cleanupErrors = [];
  try { value = await body(); } catch (error) { primary = error; }
  let workStopped = false;
  try { await hooks.stopWork(); workStopped = true; }
  catch (error) { cleanupErrors.push({ phase: 'stopWork', message: error.message }); }
  try { hooks.clearTimer(); }
  catch (error) { cleanupErrors.push({ phase: 'clearTimer', message: error.message }); }
  // 停止確認が失敗した場合はwatchdogを解除しない。
  if (workStopped) {
    try { await hooks.finishWatch(); }
    catch (error) { cleanupErrors.push({ phase: 'finishWatch', message: error.message }); }
  }
  if (!primary && cleanupErrors.length) primary = Error(cleanupErrors[0].message);
  const receipt = { primaryError: primary?.message ?? null, cleanupErrors, workStopped,
    technicalComplete: false, scientificSeedsRead: 0, resumeAuthorized: false };
  // 停止発行より先に保存を行わない。保存失敗も元の失敗を上書きしない。
  try { hooks.save(receipt); }
  catch (error) { if (!primary) primary = error; }
  if (primary) throw primary;
  return value;
}
module.exports = { lifecycle };
