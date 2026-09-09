"use strict";
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const dir=path.join(__dirname,'browser/pbai-p9');
const types={'.js':'text/javascript','.json':'application/json','.html':'text/html'};
const server=http.createServer((req,res)=>{const name=req.url==='/'?'index.html':req.url.slice(1);if(!/^[\w.-]+$/.test(name)){res.writeHead(404).end();return;}const file=path.join(dir,name);if(!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(`http://127.0.0.1:${server.address().port}/`);
 await page.getByRole('button',{name:'検証を実行',exact:true}).click();await page.locator('#status').filter({hasText:/^(合格|不合格)/}).waitFor({timeout:600000});
 const report=JSON.parse(await page.locator('#result').textContent());report.browserVersion=browser.version();report.commit=require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();report.eventCommit=process.env.GITHUB_SHA||null;report.pageErrors=errors;
 fs.mkdirSync('artifacts/pbai-p9/browser-ci',{recursive:true});fs.writeFileSync('artifacts/pbai-p9/browser-ci/report.json',JSON.stringify(report,null,2)+'\n');
 console.log('PBAI_P9_BROWSER_REPORT '+JSON.stringify({...report,rows:undefined}));
 if(!report.passed||errors.length)throw Error('Browser suite failed');
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
