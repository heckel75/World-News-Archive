import dns from 'node:dns/promises';
import https from 'node:https';
import {assert,safeUrl} from './validate.mjs';
export function isPublicIP(address){
  if(address.includes(':'))return false; // Deliberately conservative; IPv4 only for source checks.
  const p=address.split('.').map(Number);if(p.length!==4||p.some(n=>!Number.isInteger(n)||n<0||n>255))return false;
  const [a,b,c]=p;return !(a===0||a===10||a===127||a>=224||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0||b===2))||(a===100&&b>=64&&b<=127)||(a===198&&(b===18||b===19||b===51))||(a===203&&b===0&&c===113));
}
export async function publicGet(url,{maxBytes=1800000,redirects=4,allowedDomains}={}){
  const u=safeUrl(url);if(allowedDomains)assert(allowedDomains.some(d=>u.hostname===d||u.hostname.endsWith('.'+d)),'Redirect outside approved source domains');
  const addresses=await dns.lookup(u.hostname,{all:true,family:4});assert(addresses.length>0&&addresses.every(a=>isPublicIP(a.address)),'Source resolves to a non-public address');
  const ip=addresses[0].address;
  const response=await new Promise((resolve,reject)=>{const req=https.get(u,{headers:{'User-Agent':'WorldNewsArchive/1.0 (public article availability check)','Accept':'text/html,application/xhtml+xml'},lookup:(_host,opts,cb)=>opts?.all?cb(null,[{address:ip,family:4}]):cb(null,ip,4)},res=>{let size=0,chunks=[];res.on('data',chunk=>{size+=chunk.length;if(size>maxBytes){res.destroy(new Error('Source exceeds response size limit'));return}chunks.push(chunk)});res.on('error',reject);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,html:Buffer.concat(chunks).toString('utf8'),url:u.toString()}))});req.setTimeout(25000,()=>req.destroy(new Error('Source timed out')));req.on('error',reject)});
  if(response.status>=300&&response.status<400&&response.headers.location){assert(redirects>0,'Too many redirects');return publicGet(new URL(response.headers.location,u).href,{maxBytes,redirects:redirects-1,allowedDomains})}
  assert(response.status===200,`Source returned HTTP ${response.status}`);assert(String(response.headers['content-type']).includes('text/html'),'Source is not an HTML article');return response;
}
export function extractHtml(html){
  const structured=[];for(const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{structured.push(JSON.parse(match[1]))}catch{}}
  const flatten=v=>Array.isArray(v)?v.flatMap(flatten):v&&typeof v==='object'?[v,...Object.values(v).filter(x=>typeof x==='object').flatMap(flatten)]:[];
  const articles=structured.flatMap(flatten).filter(v=>/Article|NewsArticle|ReportageNewsArticle|AnalysisNewsArticle|OpinionNewsArticle/.test(String(v['@type'])));
  const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
  const body=html.replace(/<(script|style|nav|header|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ');
  const text=decode(body).replace(/\s+/g,' ').trim();
  const meta=(key)=>{const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const a=html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,'i')),b=html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,'i'));return (a||b)?.[1]};
  const article=articles.find(a=>a.datePublished)||articles[0];
  const published=article?.datePublished||meta('article:published_time')||meta('datePublished');
  const modified=article?.dateModified||meta('article:modified_time');
  const headline=article?.headline||meta('og:title')||decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
  const paywall=articles.some(a=>a.isAccessibleForFree===false||a.isAccessibleForFree==='false')||/subscribe to (?:continue|keep) reading|this article is (?:for|available to) subscribers|sign in to (?:continue|read the full)/i.test(text);
  return {text:text.slice(0,24000),published,modified,headline,paywall,articleBody:article?.articleBody||null};
}
