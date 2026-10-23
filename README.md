# World News Archive

A portable, publicly readable archive: **3 consequential stories per UTC day × exactly 3 freely readable article links per story**. Static HTML/CSS/JavaScript; immutable JSON editions in Git; no database, frontend build dependencies, tracking, or browser API keys.

## What is ready

- Timeline, calendar, date jump, searchable history, topic/region filters, event links and mobile CSS.
- Per-story reference and contrasting lenses, original summaries, corroborated facts with citations, framing differences, uncertainties and attributed unverified claims.
- Publication/access dates, publisher and originating-newsroom context, preserved original URLs, optional verified archive URLs, content fingerprints where available.
- Public downloadable editions and correction history with selectable versions.
- Daily research, anonymous source checks, separate evidence audit, duplicate protection, optional pull-request approval, and GitHub Pages deployment workflows.
- A researched **20 January 2025 retrospective edition** with 3 stories and 9 publicly retrieved articles. It is not today's news or evidence of contemporaneous capture. Source-specific date/access limitations are visible.

**Operational status:** see [DEPLOYMENT.md](DEPLOYMENT.md). The existence of a hosted website does not establish that daily enrichment is running. This delivery has no configured research key and no verified scheduled run.

## Run locally

Requires Node.js 24+. No dependency installation is needed.

```sh
npm test
npm run build
npm run serve
```

Open `http://127.0.0.1:4173`. Stop the server with Ctrl+C. The `dist/` folder works on static hosting, including GitHub Pages repository subpaths. Routes use URL fragments, so no rewrite server is needed.

## Put it on GitHub Pages

1. Create an empty public repository named `world-news-archive` in your GitHub account. Upload/push the source directory, including `.github/`, `content/`, `lib/`, `scripts/`, `tests/`, and `web/`. Do not upload `.env`, `work/`, credentials or the Sites `.git` directory. For a fresh GitHub copy, exclude `.openai/` as well; GitHub Pages doesn't use it.
2. Keep the default branch named `main`. Set **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Under **Settings → Actions → General → Workflow permissions**, enable read/write permissions. For review mode, also allow Actions to create pull requests. Match branch-protection rules to the desired review policy; direct auto-publishing cannot push to a branch that requires human review.
4. In `config.json`, set `repositoryUrl` to the repository URL. Leave `automationStatus` as `setup-required` until a research run actually succeeds. Commit changes.
5. Run **Actions → Validate and deploy archive → Run workflow**. Confirm the Pages deployment job succeeds and opens the returned public URL. A workflow file existing in Git is not evidence of successful deployment.

This project has no npm packages to install or update. GitHub action major versions are explicit in the workflows; update them deliberately. For stricter supply-chain policy, pin verified action commit SHAs before production use.

## Activate daily enrichment

1. Create a project API key for the OpenAI API with billing/credits and a project spending limit. **Enter it directly in GitHub: Settings → Secrets and variables → Actions → New repository secret → `OPENAI_API_KEY`.** Never put it in a source file, website form, issue, or chat.
2. Optionally set the Actions variable `OPENAI_MODEL` to a model your API account can use with Responses web search and structured output. The configured starting value is `gpt-6-astra`, as documented when this MVP was built; API availability and pricing must be checked in your account. The research and evidence-review calls use the same configured model in separate requests.
3. Set `ARCHIVE_PUBLISH_MODE` to `review` for pull-request approval, or `auto` for automatic publication (the default when unset). Review mode costs the same research usage but waits for a merge.
4. Run **Research the daily edition** manually with the previous UTC date (or leave blank). Check the evidence receipt, content commit/PR, and Pages deployment. Only then consider the research credentials and publishing path verified.
5. The schedule runs at **05:17 UTC daily** for the previous UTC day (06:17 Paris winter / 07:17 Paris summer). The cutoff is 23:59:59 UTC. Runs may be delayed or dropped by GitHub; this is not an exact-time service. Public-repository schedules can be disabled after inactivity. Watch Actions failures and audit gaps in the calendar.

The daily job invokes the reusable Pages workflow explicitly after a bot commit. This avoids relying on a new workflow being triggered by a `GITHUB_TOKEN` push, which GitHub normally suppresses. PR merges by a human use the normal push deployment.

The pre-existing ChatGPT scheduled task is **not** connected to publication. No additional ChatGPT automation is created by this project.

## What the daily job checks

1. Selects a completed date and exits without API usage if the edition already exists.
2. Searches approved sources for consequential events with international impact and diverse regions. Selection remains editorial, not a measured universal “top three.”
3. Asks for 3 distinct events and 9 articles, grounded in actual web-tool source URLs, and consistent event IDs for continuing events.
4. Fetches each article anonymously over HTTPS, with DNS/IP checks, redirect limits, timeouts, body limits, no credentials, and no paywall bypass. Declared paywalls, thin text, missing publication metadata, and pages modified after cutoff stop the run.
5. Sends transient extracted article evidence to a separate model request to check dates/headlines, genuine accessible reporting, claim support, source independence, substantial contrast, attribution and hindsight. Raw publisher text is not written to the archive or public artifacts. This is an automated audit, **not guaranteed truth or human verification**.
6. Validates exact counts, dates, citation targets, roles, URL duplicates, ownership groups and schemas. Stores a draft plus a SHA-256-bound verification receipt. The publisher rejects a changed draft, stale receipt, or existing version.
7. Commits the complete edition and deploys, or opens a review PR. Any failure preserves the last published site; a missing day remains a gap. Temporary 429/5xx/network API failures retry at most three attempts. Source verification failures need editorial attention, not automatic lowering of standards.

Automatic source checks are intentionally conservative. JavaScript-only articles, missing metadata, anti-bot pages and later source edits can block a run even when a human could read the page. Extend `sources.json` after checking publisher provenance; do not add domains just to manufacture a contrast. Its initial catalog is small and reflects the seed's sources, so expanding geographic coverage is a first editorial improvement.

## Manual research, backfills and corrections

See [docs/EDITORIAL.md](docs/EDITORIAL.md) for exact commands and the data contract. Each published edition lives at `content/editions/YYYY-MM-DD/vN.json`. Never edit an existing version. Create `v2.json`, add a reason and new timestamp, preserve `recordedAt`, and explicitly record human review. GitHub validation rejects changes/deletions of existing edition files.

Original articles are linked, not republished. Free-to-read is an observed access condition, not an open license. Full-text archival snapshots are optional and not created automatically. `archivedUrl` stays null unless a real third-party capture was inspected. Earlier source text cannot be reconstructed from a checksum alone.

## Costs and maintenance

- GitHub Pages supports public repositories on GitHub Free. Check your Actions allowance and current hosting limits. A custom domain is optional and billed separately.
- Research uses **metered OpenAI API calls plus web search**, separate from a ChatGPT subscription. No API charge was incurred by this project's workflow during delivery because no key was available.
- Each successful edition uses one research request (up to 20 tool calls, output bounded at 18,000 tokens) and one evidence audit (up to 6,000 output tokens). Input/source tokens and retries also cost money; output limits are not a dollar spending cap. Use the project budget and inspect the first receipts' token usage before scheduling unattended runs. Do not assume a monthly price from a single run.
- No recurring database/server fee is required by the GitHub Pages architecture. Sites hosting is a separately managed deployment; check its account terms. Daily GitHub publication updates GitHub Pages, **not the initial Sites URL**. Use the Pages URL as the canonical archive once activated.
- Weekly: inspect failed runs, calendar gaps and sampled source links. Monthly: review API spend, source balance, source catalog/metadata, hosting limits and disabled schedules. Link rot requires a new correction version or annotation, never silently changing earlier evidence.

## Documentation references

- [OpenAI Responses web search](https://developers.openai.com/api/docs/guides/tools-web-search)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Current API pricing](https://developers.openai.com/api/docs/pricing)
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub scheduled workflows and caveats](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [Triggering workflows and GITHUB_TOKEN](https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow)

## License

Application code: [MIT](LICENSE). Original archive summaries and annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), attribution “World News Archive” plus edition URL/version. Third-party headlines, reporting, names and linked content remain subject to their publishers' rights; no license to the full articles is granted here.
