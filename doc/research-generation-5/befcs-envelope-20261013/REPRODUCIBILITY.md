# 全資源包絡の再現性

保存receiptと凍結hashだけを読んで検証する。科学sourceを生成せず、停止した技術sessionも再開しない。

```bash
node --test test/g5-befcs-envelope.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-envelope/run.cjs --bindings
node tools/research/g5-befcs-envelope/verify-remote.cjs
```

GitHubの3保存snapshotと固定prefix hash、marker 1・ACK 0、再試行拒否、実UNKNOWNエラー後のhead不変を照合する。raw Git object復元とCAS拒否理由の検証は未完である。実cgroupのci-liveはActionsで既知固定文字列だけを処理し、停止prefixと各caseのreceiptをalways artifactへ保存する。

実cgroupの隔離Git objectはartifactのhidden file除外で失われないよう明示的に保存する。保存対象はfixtureの作業領域だけで、認証情報を持つrepositoryのGit設定は含めない。GitHubの技術registry snapshotと、cgroup内で作った固定prefixのGit blobは異なる証拠である。

取得済み80 fileと3 Git blobは、次の保存byteだけで検算する。これは新たなfixture実行でも科学seedの読取でもない。

```bash
node <<'NODE'
const fs=require('fs'),z=require('zlib'),c=require('crypto'),a=require('assert/strict');
const d='doc/research-generation-5/befcs-envelope-20261013/results/';
const h=(b,alg='sha256')=>c.createHash(alg).update(b).digest('hex');
const receipt=JSON.parse(fs.readFileSync(d+'CI_RECEIPT.json'));
const bytes=z.gunzipSync(fs.readFileSync(d+'CI_TECHNICAL_EVIDENCE.json.gz'));a.equal(h(bytes),receipt.evidenceSha256);
const saved=JSON.parse(bytes),files={};a.equal(Object.keys(saved.files).length,80);
for(const [p,f]of Object.entries(saved.files)){files[p]=Buffer.from(f.base64,'base64');a.equal(files[p].length,f.bytes);a.equal(h(files[p]),f.sha256);}
for(const mode of ['complete','detached','oom']){
  const prefix=files[mode+'/evidence/PREFIX.jsonl'];a.deepEqual(prefix,files[mode+'/mirror/PREFIX.jsonl']);
  const proof=JSON.parse(files[mode+'/verification/PROOF.json']);a.equal(h(prefix),proof.prefixHash);
  const object=z.inflateSync(files[mode+'/git/.git/objects/'+proof.blob.slice(0,2)+'/'+proof.blob.slice(2)]);
  a.equal(h(object,'sha1'),proof.blob);a.deepEqual(object,Buffer.concat([Buffer.from('blob '+prefix.length+'\0'),prefix]));
  let previous='0'.repeat(64),seq=0;for(const line of prefix.toString().trimEnd().split('\n')){
    const r=JSON.parse(line),{hash,...body}=r;a.equal(r.seq,seq++);a.equal(r.previous,previous);a.equal(h(JSON.stringify(body)),hash);previous=hash;
  }a.equal(seq,10);
}
a.deepEqual(files['RESULT.json'],fs.readFileSync(d+'CI_RESULT.json'));console.log('80 FILES / 3 PREFIX AND GIT BLOB REPLAYS PASS');
NODE
```

機械的な照合結果は[CI receipt](results/CI_RECEIPT.json)と[CI確定](CI_CONFIRMATION.md)に保存した。科学配備と実GitHub CAS拒否理由・registry raw Git object復元の未完条件は保持する。
