# Deployment and activation record

Prepared 23 October 2026.

- Sites project ID: `appgprj_6adb65252eb081919d2c77bfca2841fe`.
- Initial Sites release: https://world-news-archive-ke-2026.zanystork18.chatgpt.site . Native deployment succeeded on 23 October 2026 at 14:09 UTC.
- Canonical GitHub Pages URL: https://heckel75.github.io/World-News-Archive/ . GitHub's Pages deployment reported success on 23 October 2026 at 14:19 UTC.
- Static release includes the retrospective 20 January 2025 edition (3 stories, 9 article links).
- GitHub repository: https://github.com/heckel75/World-News-Archive . Source uploaded; repository made public with the owner's approval. Pages uses GitHub Actions.
- OpenAI API key: not configured. No live research API run was tested or scheduled successfully.
- Daily publication: setup required. Workflow files are delivered; they are not an active integration with the existing ChatGPT scheduled task.

## Activation checklist

1. Completed: public repository with source, workflows and the historical edition.
2. Completed: GitHub Pages enabled with Actions; validation, tests, build and deployment succeeded in run https://github.com/heckel75/World-News-Archive/actions/runs/39968173614 .
3. Pending: add `OPENAI_API_KEY` directly in GitHub Secrets. Automatic publication is the default; `ARCHIVE_PUBLISH_MODE=review` selects approval mode.
4. Pending: run one research edition, inspect evidence and verify the resulting deployment. The workflow updates the public status/configuration after a successful researched edition is committed.
5. Use the GitHub Pages URL as the canonical archive. This initial Sites release will not be updated automatically by the GitHub workflow.

Full instructions, operating costs and limitations are in [README.md](README.md).

## Verification completed before release

- 19 automated tests passed, covering article/day counts, independent publisher groups, citation scope, duplicate IDs, future/old source dates, unverified access, retrospective labels, unsafe URLs, paywall extraction, immutable writes and credential failures.
- Desktop browser: archive, search, region filter, comparison, provenance, JSON download link, calendar and missing-date state checked.
- Phone-width browser frame: 375-pixel content viewport, no horizontal overflow on archive or 3-source comparison.
- No browser console errors observed during these checks.
- GitHub Actions validation/build/deployment passed. Daily API research remains unverified until a research key is configured and a live run succeeds.
