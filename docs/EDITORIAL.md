# Editorial operation

## Daily research in ChatGPT

Use the existing daily publishing task and the news-selection criteria below. Research the previous completed Europe/Paris calendar day. Check the repository first: if that day already exists, do not duplicate it. Reuse persistent event IDs for continuing stories. A run more than 48 hours after cutoff is a retrospective backfill.

Search broadly for consequential international developments. Select three distinct events based on cross-border impact, breadth of reporting and lasting significance. This is an editorial selection, not an objective ranking. Find exactly three free-to-read articles about each event, with independent originating newsrooms: one factual/reference lens and two materially contrasting editorial or geopolitical lenses. Syndicated copies of one wire story do not constitute independent perspectives.

Open the actual articles without payment/login. Check original headline, publication date, genre, publisher, originating newsroom and access. An earlier chat entry is a research lead, not proof. Missing or inaccessible links must be repaired or replaced. Never bypass a paywall or substitute snippets for inspection. A state outlet may document its government's position, but its claims remain attributed unless independently supported.

Read and compare before writing. Keep summaries original and brief, respect source-specific usage limits, and never store publisher bodies or images. Identify article-specific framing without permanent extreme/moderate labels. A reference lens does not guarantee neutrality. At least two selected sources must support each common fact; multiple reports quoting one official establish the existence of that claim, not its truth.

## Material divergence

For each story, identify the central disputed question before choosing contrast_a and contrast_b. Select two independent articles expressing or reporting substantially different answers to that same question about facts, causes, responsibility, legitimacy or proposed action. State each position, whose position it is, and the supporting evidence. Differences in geography, topic emphasis or amount of detail alone do not qualify. Distinguish a newsroom's own analysis from positions attributed to quoted actors. Where sources converge, say so; never manufacture opposition or imply equal evidence.

Use the existing framingDifferences entries to make the disputed question, position A, position B and what the evidence establishes explicit, citing the relevant selected article IDs. A factual discrepancy caused by different reporting times or definitions is not automatically an opposing interpretation. Keep the existing world-impact selection and source-eligibility requirements; if a qualifying comparison cannot be verified, continue research and apply the existing private-draft failure rule.

## Optional X attention and discourse

After completing the normal three-article research, original summary, common facts, framing differences and historical uncertainties for each story, use browsing tools to check public X (x.com / Twitter) posts for that edition's calendar day in Europe/Paris, through its normal cutoff. This is an optional, secondary attention and discourse layer. X posts must never replace any of the three free-to-read journalistic articles or establish news facts, casualty numbers or official claims. Do not alter the original summary, common facts or uncertainties on the basis of X.

Include either or both optional story fields only when meaningfully observable; omitted fields and null mean unavailable or not assessed, not low attention:

- xAttention: {trending, note}. trending accepts true, false, "high volume", "moderate", "low or not observed", or "not clearly observed". note is at most one short sentence describing the observation and its limits.
- xDiscourse: {summary, examples?}. summary is two to four concise sentences describing observed or contested framings, attributed to the observed sample rather than asserted as facts or consensus. For genuinely low observable presence, use one sentence or omit it. examples is optional and contains at most three direct HTTPS links to representative public posts or threads, preferably still accessible. Use no embeds or full post text.

Assess xDiscourse independently of xAttention. Missing historical trend or volume measurements must not suppress a usable discourse note. A small, identifiable, dated sample can support narrowly attributed observations about those accounts; it cannot support claims about the whole platform, dominant opinion or consensus. Do not require a statistically representative platform sample to describe named examples, and do not impose a minimum engagement threshold.

Keep the combined note and summary to at most five sentences per story; a shorter one-sentence observation is acceptable when presence is low or the signal is unclear.

Use two discovery routes before concluding that no usable discourse is observable: try available public X/Twitter search or direct post pages, and search the wider web for identifiable posts reproduced or linked in freely readable contemporaneous reporting or dated curated records. Use entity names, common aliases, tickers/hashtags and event terms; do not rely only on literal calendar dates or site:x.com searches. Search adjacent dates when needed to account for indexing and timezone boundaries, then apply the exact Europe/Paris day and cutoff to each candidate. If native X search is unavailable or a post returns an access error, record that limitation and continue with the second route; do not repeatedly retry blocked endpoints or bypass login/access controls.

Verify each example's original posting timestamp and convert it to the edition's Europe/Paris day; the X window starts at local midnight and ends at the edition cutoff, not the articles' broader 72-hour window. A thread link does not make replies outside that window eligible. A date-only display or unverifiable timezone is insufficient if day membership is uncertain. Record the actual later observation time and its limitations in review.note; do not backdate retrieval or treat a current page as a preserved cutoff-time capture.

For a discovered canonical status URL, use the existing parseXPostUrl helper in lib/validate.mjs, or the equivalent decoding (Unix milliseconds = (BigInt(postId) >> 22n) + 1288834974657n), to establish its Snowflake creation timestamp when the visible date or timezone is incomplete. Unavailable local execution alone is not a reason to discard an otherwise verifiable candidate. This may resolve day membership without weakening the cutoff. A post ID alone does not establish that a post exists, who authored it, what it says, or whether it is currently accessible; verify its identity and substantive content through the direct page or the disclosed reproduction route below.

Claim trending or high/moderate/low conversation volume only when browsing reveals a suitable historical signal for that day, stating the scope (such as geography, terms and observation coverage) in the note or review.note. Current personalized trends, current engagement counts, search-result totals and a few selected posts do not establish past daily volume or dominant public opinion. Missing results, a login barrier or unavailable historical data are not evidence of low attention. Omit xAttention, set it to null, or use "not clearly observed" with an explicit limit when the signal is unclear; do not default to false. Use false only for an observed absence of a trend, not an unobserved day.

When direct X access fails, a readable contemporaneous reproduction may support the optional discourse note if it identifies the author/account, includes enough of the post's text to support the described framing, and links to the exact original status URL. Inspect the reproduction itself, its publication date and visible updates; use coverage published by the edition cutoff or a verifiable historical capture from that window, and exclude content visibly added later. Mere search snippets, untraceable screenshots and links without observable content are insufficient. Record the reproduction URL, original post URL, timestamp evidence and direct-access limitation in review.note. State in xDiscourse.summary that the observations come from posts reproduced in contemporaneous coverage, not direct live-X access; attribute the framing to the specific sample. Keep examples as original X/Twitter post links, with no site embeds or full post text. A current retrieval of dated coverage is not an immutable capture, so disclose any uncertainty about subsequent edits. This fallback applies only to the optional X layer and does not change the inspection/access requirements for the three journalistic articles.

Prefer a reasonably varied observable sample over extreme posts. Use wording such as "among the accessible posts observed" unless there is evidence for broader descriptions such as "many accounts" or "a dominant framing". Distinguish incompatible claims, different interpretations and simple differences in reporting times; do not endorse or verify any claim through X. Explain limits and convergence honestly.

Keep a concise X research record for each story in review.note: actual observation time, substantive queries/routes attempted, eligible post and reproduction URLs when used, timestamp exclusions, and concrete access failures. Distinguish no usable content, out-of-window posts, unknown timestamps, reproductions published after cutoff or with unresolved dating, and unavailable historical volume. Rejection of a reproduction is not evidence that the X discussion did not occur. Do not replace these distinct outcomes with a generic all-fields-omitted statement. Include only task-relevant public research metadata; keep private conversation details, credentials and unrelated browsing out of the repository.

Present any included note beneath "Observed conversation on X", after the journalistic comparison, with a short disclaimer that it concerns attention and public framing and is not verified reporting. Keep X links outside the journalistic articles and their citation IDs. If no usable evidence remains after the applicable discovery and reproduction checks, omit only the affected optional field and record the specific coverage limit in review.note; do not block or weaken an otherwise verified three-by-three edition. Existing editions are not retroactively changed by introducing this layer.

## As-of-day integrity

Set timezone to Europe/Paris. cutoff is the UTC instant corresponding to 23:59:59 on the edition date in Europe/Paris (21:59:59Z in summer, 22:59:59Z in winter); recordedAt is the actual preparation time. The validator checks the timezone with daylight-saving rules. Older editions without a timezone field retain UTC interpretation. Do not backdate retrieval or recording. Every article must have original publication metadata within 72 hours before cutoff. Use YYYY-MM-DD when no timezone or clock time is verified. An updated-only date is permitted only in a reviewed retrospective edition, with an explicit limitation. Disclose later edits and avoid facts only learned after cutoff. Preserve uncertainties as they stood then.

Review and openly flag unresolved claims, source-access gaps, uncertain date precision and lack of archived snapshots. Leave archivedUrl and contentHash null when no capture or actual fingerprint was checked. A current article retrieval is not proof that its text was identical at the historical cutoff.

## Data and publication

lib/schema.mjs defines the fields and lib/validate.mjs enforces dates, counts, citations, ownership groups and duplicates. Use the existing editions as structural examples. Each article has a reference, contrast_a or contrast_b role. ownershipGroup describes the originating newsroom even on a syndication host.

Write the draft under work/drafts/. Set review.status to agent-reviewed, review.reviewer to ChatGPT and a concrete review.note describing the checks and limitations. Set revision.author to ChatGPT. Publish locally with:

    node scripts/publish.mjs work/drafts/YYYY-MM-DD.json --agent-reviewed --reviewer=ChatGPT
    npm test
    npm run validate
    npm run build

A real human editor may instead set human-reviewed, use their own name and pass --human-reviewed with the matching --reviewer. Never use that option for agent work. No API key or verification-receipt fabrication is needed. Structural tests supplement editorial source checks; they cannot establish truth.

Commit only the completed edition and intended metadata to heckel75/World-News-Archive. Inspect the current branch head and use an expected-head check to avoid overwriting concurrent work. Do not upload local secrets, private files, full article text, or temporary drafts. Optional human approval uses a pull request. After a commit or merge, confirm GitHub Actions deployment success and open the live edition. If deployment fails, retry deployment without collecting the same edition again.

## Corrections and failures

Copy the latest version to a draft, preserve original recordedAt and unchanged event IDs, increase revision.number, and record the actual correction timestamp, author and reason. Perform a fresh agent or human source review and use the matching publisher flag. Earlier versions remain immutable and selectable. Later developments belong in a later edition, not silently inside an earlier uncertainty.

If nine suitable articles cannot be verified, retain a private working draft and report the gap. Do not lower evidence standards or fabricate a complete day. If access, authentication or publishing permission fails, preserve the existing site and report the actionable problem. Never claim the schedule or deployment succeeded merely because a task or commit exists.
