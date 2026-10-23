const pause=ms=>new Promise(r=>setTimeout(r,ms));
export async function response(body){
  if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is missing. Add it as a GitHub Actions repository secret.');
  for(let attempt=0;attempt<3;attempt++){
    let res;try{res=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({...body,store:false}),signal:AbortSignal.timeout(240000)})}catch(err){if(attempt===2)throw new Error('Research API connection failed');await pause(1500*2**attempt);continue}
    if((res.status===429||res.status>=500)&&attempt<2){await pause(Math.min(10000,Number(res.headers.get('retry-after')||2)*1000)*2**attempt);continue}
    if(!res.ok)throw new Error(`Research API returned HTTP ${res.status}. Check account access, model, quota and request configuration.`);
    const data=await res.json();if(data.status!=='completed')throw new Error('Research response incomplete or refused. No publication.');return data;
  }
}
export function outputText(r){return (r.output||[]).filter(o=>o.type==='message').flatMap(m=>m.content||[]).filter(c=>c.type==='output_text').map(c=>c.text).join('\n')}
export function consultedUrls(r){const urls=new Set();for(const o of r.output||[]){if(o.type==='web_search_call'){for(const s of o.action?.sources||[])if(s.url)urls.add(s.url);if(o.action?.url)urls.add(o.action.url)}for(const c of o.content||[])for(const a of c.annotations||[])if(a.url)urls.add(a.url)}return [...urls]}
