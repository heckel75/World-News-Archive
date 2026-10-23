# Editorial operation

## Data contract

`lib/schema.mjs` defines the strict data schema; `lib/validate.mjs` adds semantic checks. The checked-in January 20 edition is an example. Required fields include UTC cutoff, actual record time, edition kind, review status, version reason, 3 stories, and exactly 3 articles per story. Every common fact references at least two selected source IDs; the citation targets must belong to the same story.

Article `role` is `reference`, `contrast_a`, or `contrast_b`. These are slots, not permanent outlet bias classifications. `genre` distinguishes news, analysis and editorial. `ownershipGroup` tracks the originating newsroom rather than just the syndication host. `lens.rationale` must identify a visible difference in this article. A source's disagreement does not make its factual claims credible.

Preserve the original URL exactly. Canonicalization is only for duplicate detection. Dates with no displayed timezone use `YYYY-MM-DD` and `publishedPrecision: date`; never invent a clock time. An `updated-only` source is visibly labeled and is allowed only in reviewed retrospective editions. Automated daily editions require original publication metadata, before cutoff and within 72 hours.

`recordedAt` answers “when did this archive create the record?” `cutoff` answers “through what moment is the edition allowed to know things?” Keep them separate. Historical backfills created more than 48 hours after cutoff must be `retrospective`. They cannot prove the page contents were identical on that earlier day.

## Manual research

Read the selected articles fully, without payment/login. Check publication date, article type, origin and any syndication. Record exactly what access was observed. Prefer stable articles over live pages. Keep article summaries short and original. Do not copy full article bodies, photos, or excerpts into the repository.

For a new completed day:

```sh
node scripts/research.mjs 2026-10-22
node scripts/publish.mjs work/drafts/2026-10-22.json
npm test
npm run build
```

The research command requires `OPENAI_API_KEY` in the environment and writes no published content. The publish command requires the matching verification receipt. Never commit `.env` files or receipts with private keys; receipts here contain usage and response IDs, not credentials or article bodies.

For a manually prepared or edited draft, perform a real editorial review and use:

```sh
node scripts/publish.mjs work/drafts/2026-10-22.json --human-reviewed --reviewer="Your name"
```

That option is an explicit manual attestation, not a way for an automated job to bypass evidence checks. It still enforces the schema, dates, counts and immutable versions.

## Correct an edition

1. Copy the latest version to `work/correction.json`.
2. Keep the edition date, original `recordedAt`, edition kind and event IDs for unchanged events.
3. Increase `revision.number` by one. Set `revision.at` to the real current UTC timestamp. Name the editor and explain what changed and why.
4. Correct the error with source evidence. Do not put subsequent developments into the original as-of-day uncertainty; those belong in later editions. Describe a correction that reflects later verification explicitly in its reason.
5. Use the manual publisher above, test/build, and commit the new version. The build includes every earlier JSON file and a fingerprint per version. The site exposes the version selector and reason.

Do not overwrite or delete old edition files. A typo correction also creates a new version. PR checks reject modification of published files. Git administrators can bypass CI, so repository protections and external backups still matter; this is not a tamper-proof ledger.

## Failures and reruns

- Missing key, quota, unsupported model or API errors: fix configuration; inspect the failing step. Never print the secret.
- Paywall, metadata absence, post-cutoff modification or weak source evidence: select another genuine source or perform a documented human review. No bypassing access controls.
- Duplicate day: research exits without spending again. Corrections use the next version, never force an overwrite.
- Failed Pages deployment after a content commit: run the deployment workflow again; don't research the same day again.
- Existing review branch: the workflow preserves it. Open the branch and its PR; if PR creation failed, create the PR from that branch. It does not overwrite human edits.
- Failed research: no partial day is admitted. Receipts and successful drafts are retained as Actions artifacts for 30 days; raw article bodies are never persisted. Check calendar gaps and manually backfill a completed date.
- Retrospective machine checks can reject pages updated later. This is expected. A human can assess dated evidence and explicitly describe its limitation; the seed was prepared this way by an agent-assisted research review and is labeled accordingly.

Automated review can miss context or hallucinate. Inspect early editions before unattended publication and sample regularly afterward. The site labels agent review honestly and carries source-specific uncertainties.
