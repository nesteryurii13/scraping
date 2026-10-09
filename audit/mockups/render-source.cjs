const fs=require('node:fs');
const {chromium}=require('/tmp/laptoprent-audit-tools/node_modules/playwright-core');
const out='/home/dream/Documents/scraping/audit/mockups';
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--allow-file-access-from-files']});
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:2});
  await page.goto('file:///tmp/laptoprent-audit/mockup.html',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const size=await page.evaluate(()=>({width:innerWidth,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`${out}/laptoprent-${name}.png`,fullPage:true});
  await page.screenshot({path:`${out}/laptoprent-${name}-first-screen.png`});
  console.log(name,size);
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
