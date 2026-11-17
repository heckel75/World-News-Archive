import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {validateEdition,parseXPostUrl} from '../lib/validate.mjs';

const seed=JSON.parse(await fs.readFile(new URL('../content/editions/2025-01-20/v1.json',import.meta.url),'utf8'));
function edition(date='2025-01-20',cutoff='2025-01-20T22:59:59Z'){
  const ed=structuredClone(seed);ed.date=date;ed.timezone='Europe/Paris';ed.cutoff=cutoff;
  for(const st of ed.stories)for(const a of st.articles)a.publishedAt=date;
  return ed;
}
// Test-only synthetic IDs are never article evidence or published examples.
function postId(timestamp,sequence=0n){return (((BigInt(Date.parse(timestamp))-1288834974657n)<<22n)|sequence).toString()}
function post(timestamp='2025-01-20T12:00:00Z'){return `https://x.com/example/status/${postId(timestamp)}`}
function withExamples(examples){const ed=edition();ed.stories[0].xDiscourse={summary:'Some sampled posts disputed the proposal.',examples};return ed;}

test('old editions remain unchanged and valid without optional X fields',()=>{
  const original=structuredClone(seed);assert.equal(validateEdition(original),original);assert.deepEqual(original,seed);
});
test('X fields may independently be absent or null',()=>{
  for(const fields of [{xAttention:null},{xDiscourse:null},{xAttention:null,xDiscourse:null}]){
    const ed=edition();Object.assign(ed.stories[0],fields);assert.doesNotThrow(()=>validateEdition(ed));
  }
});
test('attention accepts the exact boolean or qualitative contract and one-sentence observations',()=>{
  for(const trending of [true,false,'high volume','moderate','low or not observed','not clearly observed']){
    const ed=edition();ed.stories[0].xAttention={trending,note:'No clear signal was observed in the limited sample.'};validateEdition(ed);
  }
  for(const invalid of [1,null,'yes','high',[],{}]){
    const ed=edition();ed.stories[0].xAttention={trending:invalid,note:'A limited sample.'};assert.throws(()=>validateEdition(ed));
  }
});
test('X objects require nonempty text and reject extra or mistyped fields',()=>{
  for(const fields of [
    {xAttention:true},{xAttention:[]},{xAttention:{trending:false}},{xAttention:{trending:false,note:' '}},
    {xAttention:{trending:false,note:'Limited sample.',confidence:1}},
    {xDiscourse:'Text'},{xDiscourse:{}},{xDiscourse:{summary:''}},{xDiscourse:{summary:'Summary.',examples:null}},
    {xDiscourse:{summary:'Summary.',examples:[42]}},{xDiscourse:{summary:'Summary.',evidence:'extra'}}
  ]){const ed=edition();Object.assign(ed.stories[0],fields);assert.throws(()=>validateEdition(ed));}
});
test('discourse may omit examples or use an empty list',()=>{
  for(const discourse of [{summary:'A limited sample was inconclusive.'},{summary:'A limited sample was inconclusive.',examples:[]}]){
    const ed=edition();ed.stories[0].xDiscourse=discourse;validateEdition(ed);
  }
});
test('sentence limits tolerate decimals and URLs but reject multi-sentence attention or lengthy discourse',()=>{
  const ed=edition();ed.stories[0].xAttention={trending:'moderate',note:'The sampled discussion mentioned a 0.4% change and https://example.com/report.'};
  ed.stories[0].xDiscourse={summary:'Some posts supported the proposal. Others questioned costs. Several shared coverage. The sample was limited.'};validateEdition(ed);
  ed.stories[0].xAttention.note='Some posts appeared. Others followed.';assert.throws(()=>validateEdition(ed),/at most one sentence/);
  ed.stories[0].xAttention=null;ed.stories[0].xDiscourse.summary+=' No overall consensus was established.';assert.throws(()=>validateEdition(ed),/at most four sentences/);
});
test('direct public post forms support share queries and fragments without mutating stored links',()=>{
  const id=postId('2025-01-20T12:00:00Z');
  for(const host of ['x.com','www.x.com','mobile.x.com','twitter.com','www.twitter.com','mobile.twitter.com']){
    for(const pathname of [`/example/status/${id}`,`/example/statuses/${id}/`,`/i/web/status/${id}`]){
      const url=`https://${host}${pathname}?s=20&t=share#context`,ed=withExamples([url]);validateEdition(ed);assert.equal(ed.stories[0].xDiscourse.examples[0],url);
    }
  }
  validateEdition(withExamples([`https://X.COM:443/example/status/${id}`]));
  assert.equal(parseXPostUrl(post()).timestamp,Date.parse('2025-01-20T12:00:00Z'));
});
test('unsafe hosts, credentials, embeds, encoded paths and non-post destinations are rejected',()=>{
  const id=postId('2025-01-20T12:00:00Z');
  const bad=[
    `http://x.com/example/status/${id}`,`javascript:alert(1)`,`https://x.com.evil.test/example/status/${id}`,
    `https://evil.x.com/example/status/${id}`,`https://localhost/example/status/${id}`,`https://127.0.0.1/example/status/${id}`,
    `https://user:secret@x.com/example/status/${id}`,`https://x.com:444/example/status/${id}`,`https://platform.twitter.com/embed/Tweet.html?id=${id}`,
    `https://x.com/example`,`https://x.com/search?q=test`,`https://x.com/example/status/${id}/photo/1`,
    `https://x.com/example/status/${id}/embed`,`https://x.com/example/status/not-a-number`,`https://x.com/example/status/0`,
    `https://x.com/example/status/9223372036854775808`,`https://x.com/example/status/000${id}`,
    `https://x.com/a/../example/status/${id}`,`https://x.com/example/%73tatus/${id}`,`https://x.com/example/status%2f${id}`,
    `https://x.com/example\\status/${id}`,` https://x.com/example/status/${id}`,`https://x.com/example/status/${id}\n`
  ];for(const url of bad)assert.throws(()=>validateEdition(withExamples([url])),undefined,url);
});
test('at most three examples are permitted and post IDs are unique across URL variants',()=>{
  const id=postId('2025-01-20T12:00:00Z'),urls=[0,1,2,3].map(n=>`https://x.com/example/status/${BigInt(id)+BigInt(n)}`);
  validateEdition(withExamples(urls.slice(0,3)));assert.throws(()=>validateEdition(withExamples(urls)),/wrong number/);
  assert.throws(()=>validateEdition(withExamples([urls[0],`https://mobile.twitter.com/other/statuses/${id}?s=20#share`])),/Duplicate X example/);
});
for(const [label,date,start,cutoff] of [
  ['winter','2025-01-20','2025-01-19T23:00:00Z','2025-01-20T22:59:59Z'],
  ['summer','2025-07-20','2025-07-19T22:00:00Z','2025-07-20T21:59:59Z'],
  ['spring DST change','2025-03-30','2025-03-29T23:00:00Z','2025-03-30T21:59:59Z'],
  ['autumn DST change','2025-10-26','2025-10-25T22:00:00Z','2025-10-26T22:59:59Z']
]){
  test(`X post dates respect Paris ${label} boundaries and inclusive cutoff`,()=>{
    const ed=edition(date,cutoff);
    for(const timestamp of [start,cutoff]){ed.stories[0].xDiscourse={summary:'Illustrative discussion sample.',examples:[post(timestamp)]};validateEdition(ed);}
    for(const timestamp of [new Date(Date.parse(start)-1).toISOString(),new Date(Date.parse(cutoff)+1).toISOString(),new Date(Date.parse(cutoff)+1000).toISOString()]){
      ed.stories[0].xDiscourse.examples=[post(timestamp)];assert.throws(()=>validateEdition(ed),/edition day in Europe\/Paris/);
    }
  });
}
test('legacy UTC editions still restrict optional X examples to their Paris calendar date',()=>{
  const ed=structuredClone(seed);ed.stories[0].xDiscourse={summary:'Illustrative discussion sample.',examples:[post('2025-01-20T23:30:00Z')]};
  assert.throws(()=>validateEdition(ed),/edition day in Europe\/Paris/);
});
test('X examples never satisfy the required journalistic article slots or citation IDs',()=>{
  const ed=edition();ed.stories[0].articles[0].url=post();ed.stories[0].articles[0].outlet.domain='x.com';
  assert.throws(()=>validateEdition(ed),/cannot replace required journalistic/);
  const cited=withExamples([post()]);cited.stories[0].commonFacts[0].sourceIds[0]=post();assert.throws(()=>validateEdition(cited),/missing article/);
});
