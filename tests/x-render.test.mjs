import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {renderXNotes, isDirectXPostUrl} from '../web/x-notes.js';

const example = 'https://x.com/example/status/1234567890123456789';
const seed = JSON.parse(await fs.readFile(new URL('../content/editions/2025-01-20/v1.json', import.meta.url), 'utf8'));
const appSource = (await fs.readFile(new URL('../web/app.js', import.meta.url), 'utf8')).replace(/^import \{renderXNotes\} from '[^']+';\r?\n/, '');

async function renderStoryPage(fields = {}, view = 'story') {
  const edition = structuredClone(seed);
  Object.assign(edition.stories[0], fields);
  const item = {date:edition.date, versions:[{...edition.revision, path:'data/edition.json'}], stories:edition.stories};
  const catalog = {config:{automationNote:'Research is recorded after review.'}, editions:[item]};
  const main = {innerHTML:''};
  const document = {
    title:'',
    querySelector:selector => selector === '#main' ? main : selector === '#version-select' ? {addEventListener(){}} : null,
    querySelectorAll:() => []
  };
  const hash = view === 'story' ? '#'+new URLSearchParams({date:edition.date, story:edition.stories[0].id}) : view === 'archive' ? '' : '#view='+view;
  await vm.runInNewContext('(async () => {'+appSource+'})()', {
    renderXNotes, document, location:{hash}, URLSearchParams, URL, Intl,
    fetch:async url => ({ok:true, json:async () => url.startsWith('./data/archive.json') ? catalog : edition}),
    window:{addEventListener(){}, scrollTo(){}}
  });
  return main.innerHTML;
}

test('missing or null optional observations add no section or inferred attention state', () => {
  for (const story of [{}, {xAttention:null}, {xDiscourse:null}, {xAttention:null,xDiscourse:null}]) {
    assert.equal(renderXNotes(story), '');
  }
});

test('every attention state has an explicit label, including false and unclear observations', () => {
  for (const [trending, label] of [[true,'Trend observed'],[false,'No trend observed'],['high volume','High volume'],['moderate','Moderate'],['low or not observed','Low or not observed'],['not clearly observed','Not clearly observed']]) {
    const html = renderXNotes({xAttention:{trending,note:'A limited public sample.'}});
    assert.ok(html.includes('Observed attention: '+label));
    assert.ok(html.includes('A limited public sample.'));
    assert.ok(!html.includes('Public framing'));
  }
});

test('discourse can render without attention or example links', () => {
  const html = renderXNotes({xAttention:null,xDiscourse:{summary:'Several framings were visible.'}});
  assert.ok(html.includes('Public framing'));
  assert.ok(html.includes('Several framings were visible.'));
  assert.ok(!html.includes('Observed attention:'));
  assert.ok(!html.includes('<a '));
  assert.ok(html.includes('aria-labelledby="x-conversation-heading"'));
  assert.ok(html.includes('Attention and public framing only — not verified reporting.'));
});

test('notes and summaries remain escaped text, never executable HTML or embeds', () => {
  const html = renderXNotes({
    xAttention:{trending:true,note:'<script>alert("x")</script> & \'quoted\''},
    xDiscourse:{summary:'<img src=x onerror="alert(1)"> <blockquote>text</blockquote>',examples:[example]}
  });
  assert.ok(html.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quoted&#39;'));
  assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
  assert.doesNotMatch(html, /<(?:script|img|iframe|blockquote)\b/i);
});

test('direct-post URL guard permits supported X and Twitter variants only', () => {
  for (const url of [example,'https://www.x.com/example/status/1234567890123456789/','https://mobile.twitter.com/example/statuses/1234567890123456789','https://twitter.com/i/web/status/1234567890123456789?ref=share#post']) {
    assert.equal(isDirectXPostUrl(url), true, url);
  }
  for (const url of ['javascript:alert(1)','data:text/html,hello','http://x.com/example/status/123','//x.com/example/status/123','https://x.com.evil.test/example/status/123','https://example.test/x.com/example/status/123','https://user:pass@x.com/example/status/123','https://x.com:444/example/status/123','https://x.com/example','https://x.com/search?q=news','https://x.com/example/status/abc','https://x.com/example/status/123/photo/1','https://x.com/example/status/123/../456','https://x.com/%65xample/status/123','https://x.com/example/status/0','https://x.com/example/status/9223372036854775808']) {
    assert.equal(isDirectXPostUrl(url), false, url);
  }
});

test('example links retain absolute URLs, escape attributes, deduplicate posts and cap at three', () => {
  const shared = example+'?ref=share&source=web#post';
  const html = renderXNotes({xDiscourse:{summary:'An observation.',examples:[
    shared,
    example.replace('x.com','twitter.com'),
    'javascript:alert(1)',
    'https://x.com/example/status/1234567890123456790',
    'https://x.com/example/status/1234567890123456791',
    'https://x.com/example/status/1234567890123456792'
  ]}});
  assert.equal((html.match(/<a /g)||[]).length, 3);
  assert.ok(html.includes('href="'+example+'?ref=share&amp;source=web#post"'));
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g)||[]).length, 3);
  assert.ok(html.includes('Example post 3 on X'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('1234567890123456792'));
});

test('story details put X observations after research and before following the record', async () => {
  const html = await renderStoryPage({xAttention:{trending:false,note:'No trend established in the reviewed sample.'},xDiscourse:{summary:'Views varied.',examples:[example]}});
  const xIndex = html.indexOf('Observed conversation on X');
  for (const heading of ['One event. Three lenses.','Common, corroborated facts',"What we didn't yet know",'Where the framing differs','Why this made the record']) {
    assert.ok(html.indexOf(heading) >= 0 && html.indexOf(heading) < xIndex, heading);
  }
  assert.ok(xIndex < html.indexOf('Follow the record'));
  assert.equal((html.match(/Observed conversation on X/g)||[]).length, 1);
});

test('existing story pages remain free of X UI, and archive cards keep reporting prominent', async () => {
  assert.ok(!(await renderStoryPage()).includes('Observed conversation on X'));
  assert.ok(!(await renderStoryPage({xAttention:{trending:true,note:'Visible sample.'}},'archive')).includes('Observed conversation on X'));
});

test('methodology describes optional and limited observations without implying consensus', async () => {
  const html = await renderStoryPage({},'method');
  assert.ok(html.includes('Optional observations from X'));
  assert.ok(html.includes('limited sample of public posts'));
  assert.ok(html.includes('do not represent all users or public consensus'));
  assert.ok(html.includes('Missing notes mean observations were unavailable or not recorded, not that activity was low.'));
});
