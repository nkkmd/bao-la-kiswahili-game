"use strict";
const fs=require("node:fs");
process.on("exit",()=>{const s=fs.readFileSync("/proc/self/status","utf8"),take=key=>{const m=s.match(new RegExp(`^${key}:\\s+(\\d+) kB$`,"m"));if(!m)throw Error("Missing Linux RSS measurement");return Number(m[1])*1024;};console.log(JSON.stringify({linuxVmHwmBytes:take("VmHWM"),linuxVmRssBytes:take("VmRSS"),ruMaxRssBytes:process.resourceUsage().maxRSS*1024}));});
