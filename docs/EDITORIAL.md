# Editorial operation

## Daily research in ChatGPT

Use the existing World News History Archive task in the Open Source News Archive conversation and its news-selection intent. Research the previous completed Europe/Paris calendar day. Check the repository first: if that day already exists, do not duplicate it. Reuse persistent event IDs for continuing stories. A run more than 48 hours after cutoff is a retrospective backfill.

Search broadly for consequential international developments. Select three distinct events based on cross-border impact, breadth of reporting and lasting significance. This is an editorial selection, not an objective ranking. Find exactly three free-to-read articles about each event, with independent originating newsrooms: one factual/reference lens and two materially contrasting editorial or geopolitical lenses. Syndicated copies of one wire story do not constitute independent perspectives.

Open the actual articles without payment/login. Check original headline, publication date, genre, publisher, originating newsroom and access. An earlier chat entry is a research lead, not proof. Missing or inaccessible links must be repaired or replaced. Never bypass a paywall or substitute snippets for inspection. A state outlet may document its government's position, but its claims remain attributed unless independently supported.

Read and compare before writing. Keep summaries original and brief, respect source-specific usage limits, and never store publisher bodies or images. Identify article-specific framing without permanent extreme/moderate labels. A reference lens does not guarantee neutrality. At least two selected sources must support each common fact; multiple reports quoting one official establish the existence of that claim, not its truth.

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
