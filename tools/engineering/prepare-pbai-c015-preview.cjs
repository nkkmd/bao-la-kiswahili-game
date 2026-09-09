"use strict";
// 実機確認用コピーを作る。publicと既存の保存先は変更しない。
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const source = path.join(root, 'public');
const target = path.resolve(process.argv[2] || path.join(root, 'artifacts/local/pbai-c015-preview'));
if (fs.existsSync(target)) throw Error('保存先が既に存在します。別の空の保存先を指定してください');
if (target.startsWith(source + path.sep)) throw Error('publicの中には作成できません');
const original = fs.readFileSync(path.join(source, 'ai-release.js'), 'utf8');
const flag = /const PBAI_C015_ENABLED = (true|false);/;
if (!flag.test(original)) throw Error('候補設定が見つかりません');
fs.cpSync(source, target, { recursive: true, errorOnExist: true, force: false });
// 簡易HTTPサーバーでも拡張子なしの保存対象を取得できるようにする。
fs.copyFileSync(path.join(target, 'privacy.html'), path.join(target, 'privacy'));
fs.writeFileSync(path.join(target, 'ai-release.js'), original.replace(flag, 'const PBAI_C015_ENABLED = true;'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files = Object.fromEntries(fs.readdirSync(target).filter(name => fs.statSync(path.join(target, name)).isFile()).map(name => [name, sha(path.join(target, name))]));
const manifest = { purpose: 'PBAI-C015-v1 hard-only preview', sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  sourceTreeDirty: Boolean(execFileSync('git', ['status', '--porcelain', '--', 'public'], { cwd: root, encoding: 'utf8' }).trim()),
  createdAt: new Date().toISOString(), physicalDeviceVerified: false, previewOnly: true, transformations: ['ai-release.js: PBAI_C015_ENABLED set to true', 'privacy.html copied to extensionless privacy for local HTTP serving'], files };
fs.writeFileSync(path.join(target, 'PREVIEW.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ directory: target, files: Object.keys(files).length, sourceCommit: manifest.sourceCommit, previewOnly: true }));
