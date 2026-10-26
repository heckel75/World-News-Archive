# World News Archive

Three consequential world stories per Paris calendar day, each with exactly three freely readable news links: a reference account and two substantially contrasting editorial or geopolitical lenses. This is a static, searchable archive of original summaries, source metadata, common facts, framing differences and uncertainties.

## How it is maintained

ChatGPT researches and reviews each edition using the chat's browsing tools, then publishes versioned JSON to this repository. GitHub Actions only validates, builds and deploys that saved content to GitHub Pages. **No OpenAI API key, paid research API, or scheduled research workflow is used by this website.**

The existing hosted ChatGPT task is named **World News History Archive**, inside the **Open Source News Archive** conversation. Its active schedule remains daily at **08:00 Europe/Paris**. It finishes one missing edition per run: the previous completed day first, then the oldest gap if that day is already published. No duplicate local schedule was created. See [DEPLOYMENT.md](DEPLOYMENT.md) for verified status.

Canonical website: https://heckel75.github.io/World-News-Archive/

## Local use

Requires Node.js 24+, with no npm dependencies.

    npm test
    npm run validate
    npm run build
    npm run serve

Open http://127.0.0.1:4173. The dist folder also works under a GitHub Pages repository subpath. Search, date/calendar navigation, filters, comparison panels and all correction versions run in the browser.

## Research and publish

Follow [docs/EDITORIAL.md](docs/EDITORIAL.md). Inspect the actual article pages, check dates and ownership, compare the accounts and write original summaries. Never treat an earlier chat answer or search snippet as verified source evidence. Clearly label claims and access limitations. Do not publish an incomplete day.

Prepare an edition JSON under work/drafts/ using lib/schema.mjs and the existing editions as examples. Declare agent review honestly and use:

    node scripts/publish.mjs work/drafts/YYYY-MM-DD.json --agent-reviewed --reviewer=ChatGPT
    npm test
    npm run validate
    npm run build

Commit the new content/editions/YYYY-MM-DD/v1.json to main using the GitHub connector or Git. Confirm the Validate and deploy archive workflow succeeds, then verify the new date on the public site. A pull request can be used for optional human approval. If a PR is created, share it for review; publishing happens after merge.

Corrections create v2.json, v3.json and so on. Preserve the original recordedAt, explain changes and keep earlier files untouched. The publisher and CI protect version order and old files. Agent review is never labeled human review.

## Hosting and costs

This public repository is already configured for GitHub Pages with Source set to GitHub Actions. To deploy a copy, upload the source to a public repository, set that Pages option, update repositoryUrl in config.json and run the deployment workflow. Exclude .git, .openai, work, dist, .env and credentials when uploading a fresh copy.

Research takes place within the signed-in ChatGPT/Codex session and is subject to that account's plan limits. The website makes no AI API calls and requires no research secret. GitHub Pages supports public repositories on GitHub Free, subject to current platform limits; a custom domain is optional. There is no database or persistent server. The initial Sites demo is a separate deployment and does not receive GitHub updates.

A local scheduled chat needs the computer on and the app running. A hosted ChatGPT task depends on its own tool access and permissions. The October 24 run prepared the October 23 edition but paused at GitHub approval. On October 26, the owner authorized GitHub for that conversation, the task was resumed, and its pending content commit was recovered and deployed. A saved schedule alone is not evidence of successful publication. Check the actual edition dates and deployment result after each run; a missing day stays visible as a gap until verified research is available.

## Rights and provenance

Free-to-read does not mean openly licensed. Store original summaries, factual metadata and external links, never full publisher articles or images. An archive link is included only after inspecting a real capture. Access checks describe what was observed at retrieval; they do not guarantee future availability. The historical seed is explicitly retrospective.

Application code: [MIT](LICENSE). Original archive summaries and annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), attribution World News Archive plus edition URL/version. Linked publisher content retains its own rights.
