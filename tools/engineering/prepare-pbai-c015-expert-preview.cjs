'use strict';
// P11の固定アダプターを実機用コピーへ適用する。公開資産・採用状態は変更しない。
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function prepare(target, mode = 'candidate') {
  if (!['candidate', 'rollback'].includes(mode)) throw Error('候補または切戻しを指定してください');
  target = path.resolve(target);
  const source = path.join(root, 'public');
  if (fs.existsSync(target)) throw Error('既存の保存先は上書きしません');
  if (target.startsWith(source + path.sep)) throw Error('public内は保存先にできません');
  const adopted = JSON.parse(fs.readFileSync(path.join(root, 'doc/ai-engineering/pbai-c015-adoption-review/ADOPTION.json')));
  for (const [name, hash] of Object.entries(adopted.publicSha256)) {
    if (sha(fs.readFileSync(path.join(root, name))) !== hash) throw Error('公開資産が固定時点から変わっています: ' + name);
  }
  const lockPath = path.join(root, 'doc/ai-engineering/public-ai-improvement-program-11/SOURCE_LOCK.json');
  for (const [name, hash] of Object.entries(JSON.parse(fs.readFileSync(lockPath)).files)) {
    if (sha(fs.readFileSync(path.join(root, name))) !== hash) throw Error('凍結ソース不一致: ' + name);
  }
  fs.cpSync(source, target, { recursive: true, errorOnExist: true, force: false });
  if (mode === 'candidate') {
    const file = path.join(target, 'ai-release.js');
    fs.writeFileSync(file, require('./lib/pbai-p11-adapter.cjs')(fs.readFileSync(file, 'utf8')));
  }
  const cache = 'bao-la-kiswahili-p11-device-' + mode + '-' + crypto.randomUUID();
  const sw = path.join(target, 'service-worker.js');
  fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').replace('bao-la-kiswahili-v35', cache));
  const index = path.join(target, 'index.html');
  const notice = mode === 'candidate' ? '実機確認用：expertは論理ゲート型評価器を使用します。正式採用・AI-GEN4昇格前です。' : '切戻し確認用：expertはAI-GEN3、hardは採用済み論理ゲート型評価器です。';
  fs.writeFileSync(index, fs.readFileSync(index, 'utf8')
    .replace('<head>', '<head>\n    <meta name="robots" content="noindex,nofollow">')
    .replace('<main class="game-shell">', '<main class="game-shell">\n      <p id="expert-preview-notice" role="note">' + notice + '</p>')
    .replace('value="normal" selected', 'value="normal"')
    .replace('value="expert" data-ja', 'value="expert" selected data-ja'));
  fs.copyFileSync(path.join(target, 'privacy.html'), path.join(target, 'privacy'));
  const files = Object.fromEntries(fs.readdirSync(target).filter(n => fs.statSync(path.join(target, n)).isFile()).map(n => [n, sha(fs.readFileSync(path.join(target, n)))]));
  const manifest = { purpose: 'PBAI-C015-v1 expert physical-device preview', mode, previewOnly: true,
    physicalDeviceVerified: false, expertAdopted: false, newGenerationIssued: false,
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sourceTreeDirty: Boolean(execFileSync('git', ['status', '--porcelain', '--', 'public', 'tools/engineering/prepare-pbai-c015-expert-preview.cjs'], { cwd: root, encoding: 'utf8' }).trim()),
    strengthRunId: 34439270384, sourceLockSha256: sha(fs.readFileSync(lockPath)), cache,
    adapterSha256: sha(fs.readFileSync(path.join(target, 'ai-release.js'))), files };
  fs.writeFileSync(path.join(target, 'PREVIEW.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
module.exports = { prepare };
if (require.main === module) {
  const target = process.argv[2] || path.join(root, 'artifacts/local/pbai-c015-expert-preview');
  console.log(JSON.stringify({ directory: path.resolve(target), ...prepare(target, process.argv[3]) }));
}
