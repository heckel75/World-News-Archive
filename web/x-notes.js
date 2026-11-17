const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

const attentionLabels = new Map([
  [true, 'Trend observed'],
  [false, 'No trend observed'],
  ['high volume', 'High volume'],
  ['moderate', 'Moderate'],
  ['low or not observed', 'Low or not observed'],
  ['not clearly observed', 'Not clearly observed']
]);

function xPostId(value) {
  if (typeof value !== 'string' || /[\s\\]/.test(value)) return null;
  try {
    const url = new URL(value);
    const raw = /^https:\/\/([^/?#]+)(\/[^?#]*)(?:[?#].*)?$/i.exec(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port ||
        !/^(?:(?:www|mobile)\.)?(?:x|twitter)\.com$/.test(url.hostname) || !raw ||
        ![url.hostname, url.hostname+':443'].includes(raw[1].toLowerCase())) return null;
    // Inspect the raw path so normalization cannot conceal an encoded or dotted path.
    const match = /^\/(?:[A-Za-z0-9_]{1,15}\/status(?:es)?|i\/web\/status)\/([1-9]\d{0,18})\/?$/.exec(raw[2]);
    return match && BigInt(match[1]) <= (1n << 63n)-1n ? match[1] : null;
  } catch {
    return null;
  }
}

export function isDirectXPostUrl(value) {
  return xPostId(value) !== null;
}

export function renderXNotes(story = {}) {
  const attention = story.xAttention;
  const discourse = story.xDiscourse;
  if (attention == null && discourse == null) return '';

  const label = attentionLabels.get(attention?.trending);
  const attentionHtml = label ? `<div class="x-note"><h3>Observed attention: ${escape(label)}</h3><p>${escape(attention.note)}</p></div>` : '';
  const postIds = new Set();
  const examples = Array.isArray(discourse?.examples) ? discourse.examples.filter(url => {
    const id = xPostId(url);
    if (!id || postIds.has(id)) return false;
    postIds.add(id);
    return true;
  }).slice(0, 3) : [];
  const discourseHtml = discourse == null ? '' : `<div class="x-note"><h3>Public framing</h3><p>${escape(discourse.summary)}</p>${examples.length ? `<ul class="x-example-links" aria-label="Example posts on X">${examples.map((url, index) => `<li><a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Example post ${index + 1} on X<span class="x-link-context"> (opens in a new tab)</span></a></li>`).join('')}</ul>` : ''}</div>`;

  return `<section class="x-conversation" aria-labelledby="x-conversation-heading"><h2 id="x-conversation-heading">Observed conversation on X</h2><p class="context-note x-disclaimer">Attention and public framing only — not verified reporting.</p>${attentionHtml}${discourseHtml}</section>`;
}
