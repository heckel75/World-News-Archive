import {editionSchema} from './schema.mjs';
export function assert(condition,message){if(!condition)throw new Error(message)}
export function schemaCheck(value,s,path='$'){
  const types=Array.isArray(s.type)?s.type:[s.type];const type=value===null?'null':Array.isArray(value)?'array':Number.isInteger(value)?'integer':typeof value;
  assert(types.includes(type)||(type==='integer'&&types.includes('number')),`${path}: expected ${types.join('|')}`);
  if(s.enum)assert(s.enum.includes(value),`${path}: unsupported value`);
  if(type==='string'&&s.minLength)assert(value.trim().length>=s.minLength,`${path}: empty string`);
  if(type==='integer'&&s.minimum!==undefined)assert(value>=s.minimum,`${path}: below minimum`);
  if(type==='array'){assert(value.length>=(s.minItems||0)&&value.length<=(s.maxItems||Infinity),`${path}: wrong number of items`);value.forEach((v,i)=>schemaCheck(v,s.items,`${path}[${i}]`))}
  if(type==='object'){for(const k of s.required||[])assert(k in value,`${path}.${k}: missing`);if(s.additionalProperties===false)for(const k of Object.keys(value))assert(k in s.properties,`${path}.${k}: unknown field`);for(const [k,v] of Object.entries(value))if(s.properties[k])schemaCheck(v,s.properties[k],`${path}.${k}`)}
}
export function safeUrl(s){const u=new URL(s);assert(u.protocol==='https:'&&!u.username&&!u.password&&!u.port,'Only public HTTPS URLs are allowed');assert(!/^localhost$|\.local$|\.internal$|^\d+\.\d+\.\d+\.\d+$|:/.test(u.hostname),'IP and local addresses are forbidden');return u}
export function normalizedUrl(s){const u=safeUrl(s);u.hash='';for(const k of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid|mc_cid|mc_eid)$/i.test(k))u.searchParams.delete(k);u.hostname=u.hostname.replace(/^www\./,'');u.pathname=u.pathname.replace(/\/$/,'');u.searchParams.sort();return u.toString()}
export function validDay(day){return /^\d{4}-\d{2}-\d{2}$/.test(day)&&!Number.isNaN(Date.parse(day))&&new Date(day).toISOString().slice(0,10)===day}
const xHosts=new Set(['x.com','www.x.com','mobile.x.com','twitter.com','www.twitter.com','mobile.twitter.com']);
const sentenceSegmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const parisDayFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'});
function sentenceCount(text){return [...sentenceSegmenter.segment(text)].filter(part=>part.segment.trim()).length}
function parisDay(timestamp){const p=Object.fromEntries(parisDayFormatter.formatToParts(new Date(timestamp)).map(part=>[part.type,part.value]));return `${p.year}-${p.month}-${p.day}`}
export function parseXPostUrl(value){
  assert(typeof value==='string'&&!/[\s\\]/.test(value),'X examples require a direct public post URL');
  const u=safeUrl(value),raw=/^https:\/\/([^/?#]+)(\/[^?#]*)(?:[?#].*)?$/i.exec(value);
  assert(xHosts.has(u.hostname)&&raw&&(raw[1].toLowerCase()===u.hostname||raw[1].toLowerCase()===`${u.hostname}:443`),'X examples require an exact public X or Twitter host');
  // Match the raw path so URL parsing cannot hide dot segments, escapes or encoded separators.
  const match=/^\/(?:[A-Za-z0-9_]{1,15}\/status(?:es)?|i\/web\/status)\/([1-9]\d{0,18})\/?$/.exec(raw[2]);
  assert(match,'X examples require a direct status or statuses URL with a numeric post ID');
  const id=BigInt(match[1]);assert(id<=(1n<<63n)-1n,'Invalid X Snowflake post ID');
  // Twitter's Snowflake layout: timestamp = (id >> 22) + twepoch.
  // https://github.com/twitter-archive/snowflake/blob/snowflake-2010/src/main/scala/com/twitter/service/snowflake/IdWorker.scala
  // This establishes only an encoded timestamp, never existence, public access or factual truth.
  return {id:id.toString(),timestamp:Number((id>>22n)+1288834974657n)};
}
function validateXNotes(st,ed,cutoff){
  const attention=st.xAttention,discourse=st.xDiscourse;
  const attentionSentences=attention?sentenceCount(attention.note):0,discourseSentences=discourse?sentenceCount(discourse.summary):0;
  assert(attentionSentences<=1,'X attention note must be at most one sentence');
  assert(discourseSentences<=4,'X discourse summary must be at most four sentences');
  assert(attentionSentences+discourseSentences<=5,'Combined X notes must be at most five sentences');
  const postIds=new Set();
  for(const example of discourse?.examples||[]){
    const post=parseXPostUrl(example);
    assert(!postIds.has(post.id),'Duplicate X example post ID');postIds.add(post.id);
    assert(post.timestamp<=cutoff&&parisDay(post.timestamp)===ed.date,'X example must belong to the edition day in Europe/Paris and not exceed its cutoff');
  }
}
export function validateEdition(ed,{allowUnverified=false}={}){
  schemaCheck(ed,editionSchema);assert(validDay(ed.date),'Invalid edition date');
  assert(/Z$/.test(ed.cutoff)&&Number.isFinite(Date.parse(ed.cutoff)),'Invalid UTC cutoff timestamp');
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:ed.timezone||'UTC',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ed.cutoff)).map(p=>[p.type,p.value]));
  assert(`${parts.year}-${parts.month}-${parts.day}`===ed.date&&`${parts.hour}:${parts.minute}:${parts.second}`==='23:59:59','Cutoff must be end of the edition day in its stated timezone');
  const cutoff=Date.parse(ed.cutoff);for(const stamp of [ed.recordedAt,ed.revision.at])assert(/Z$/.test(stamp)&&Number.isFinite(Date.parse(stamp)),'Invalid UTC timestamp');
  assert(Date.parse(ed.recordedAt)>cutoff,'Edition must be recorded after its complete daily cutoff');
  assert(Date.parse(ed.revision.at)>=Date.parse(ed.recordedAt),'Revision predates record');
  if(Date.parse(ed.recordedAt)-cutoff>48*3600000)assert(ed.kind==='retrospective','Late research must be labeled retrospective');
  const ids=new Set(),events=new Set(),urls=new Set(),heads=new Set();
  for(const st of ed.stories){for(const id of [st.id,st.eventId])assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id),'IDs must be lowercase slugs');assert(!ids.has(st.id),'Duplicate story ID');ids.add(st.id);assert(!events.has(st.eventId),'Duplicate event in one edition');events.add(st.eventId);
    validateXNotes(st,ed,cutoff);
    assert(new Set(st.articles.map(a=>a.role)).size===3,'Each story needs reference, contrast_a, contrast_b');
    assert(new Set(st.articles.map(a=>a.outlet.ownershipGroup)).size===3,'Article publishers must have distinct reporting ownership groups');
    const articleIds=new Set();for(const a of st.articles){assert(!ids.has(a.id),'Duplicate article ID');ids.add(a.id);articleIds.add(a.id);assert(/^[a-z0-9-]+$/.test(a.id),'Invalid article ID');
      const normalized=normalizedUrl(a.url),u=safeUrl(a.url);assert(!urls.has(normalized),'Duplicate article URL');urls.add(normalized);const headline=a.headline.toLowerCase().replace(/[^a-z0-9]/g,'');assert(!heads.has(headline),'Duplicate article headline');heads.add(headline);
      assert(!/(^|\.)(x\.com|twitter\.com)$/.test(u.hostname),'X posts cannot replace required journalistic articles');
      assert(u.hostname===a.outlet.domain||u.hostname.endsWith('.'+a.outlet.domain),'URL must belong to declared publisher domain');
      if(a.archivedUrl)safeUrl(a.archivedUrl);if(a.outlet.ownershipSource)safeUrl(a.outlet.ownershipSource);
      const published=Date.parse(a.publishedAt);assert(Number.isFinite(published)&&published<=cutoff&&published>=cutoff-72*3600000,'Article must be published within 72h before cutoff');
      assert(a.publishedPrecision!=='updated-only'||ed.kind==='retrospective','Daily editions require an original publication date');
      assert(allowUnverified||a.access.status==='readable','Article access is not verified');
      for(const timestamp of [a.access.checkedAt,a.provenance.retrievedAt])assert(Number.isFinite(Date.parse(timestamp))&&Date.parse(timestamp)>=published,'Invalid source verification timestamp');
      assert(a.summary.split(/\s+/).length<=100,'Article summary too long');assert(a.headline.split(/\s+/).length<=35,'Headline too long');
      if(a.provenance.contentHash)assert(/^[a-f0-9]{64}$/.test(a.provenance.contentHash),'Invalid content fingerprint');
    }
    for(const f of [...st.commonFacts,...st.framingDifferences,...st.unverifiedClaims]){assert(new Set(f.sourceIds).size===f.sourceIds.length,'Duplicate citation');for(const id of f.sourceIds)assert(articleIds.has(id),'Citation refers to another story or missing article');}
    for(const f of st.commonFacts)assert(f.sourceIds.length>=2,'Common facts require independent corroboration');
  }return ed;
}
