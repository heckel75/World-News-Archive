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
export function validateEdition(ed,{allowUnverified=false}={}){
  schemaCheck(ed,editionSchema);assert(validDay(ed.date),'Invalid edition date');
  assert(ed.cutoff===ed.date+'T23:59:59Z','Cutoff must be end of the UTC edition day');
  const cutoff=Date.parse(ed.cutoff);for(const stamp of [ed.recordedAt,ed.revision.at])assert(/Z$/.test(stamp)&&Number.isFinite(Date.parse(stamp)),'Invalid UTC timestamp');
  assert(Date.parse(ed.recordedAt)>cutoff,'Edition must be recorded after its complete daily cutoff');
  assert(Date.parse(ed.revision.at)>=Date.parse(ed.recordedAt),'Revision predates record');
  if(Date.parse(ed.recordedAt)-cutoff>48*3600000)assert(ed.kind==='retrospective','Late research must be labeled retrospective');
  const ids=new Set(),events=new Set(),urls=new Set(),heads=new Set();
  for(const st of ed.stories){for(const id of [st.id,st.eventId])assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id),'IDs must be lowercase slugs');assert(!ids.has(st.id),'Duplicate story ID');ids.add(st.id);assert(!events.has(st.eventId),'Duplicate event in one edition');events.add(st.eventId);
    assert(new Set(st.articles.map(a=>a.role)).size===3,'Each story needs reference, contrast_a, contrast_b');
    assert(new Set(st.articles.map(a=>a.outlet.ownershipGroup)).size===3,'Article publishers must have distinct reporting ownership groups');
    const articleIds=new Set();for(const a of st.articles){assert(!ids.has(a.id),'Duplicate article ID');ids.add(a.id);articleIds.add(a.id);assert(/^[a-z0-9-]+$/.test(a.id),'Invalid article ID');
      const normalized=normalizedUrl(a.url),u=safeUrl(a.url);assert(!urls.has(normalized),'Duplicate article URL');urls.add(normalized);const headline=a.headline.toLowerCase().replace(/[^a-z0-9]/g,'');assert(!heads.has(headline),'Duplicate article headline');heads.add(headline);
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
