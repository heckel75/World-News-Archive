# Deployment and activation record

Prepared 23 October 2026.

- Sites project ID: `appgprj_6adb65252eb081919d2c77bfca2841fe`.
- Assigned release URL: https://world-news-archive-ke-2026.zanystork18.chatgpt.site . This assignment alone is not proof of deployment; the final delivery records the native deployment result.
- Static release includes the retrospective 20 January 2025 edition (3 stories, 9 article links).
- GitHub repository: not yet created/selected. The connected tools can inspect/edit repositories but cannot create one; browser GitHub sign-in is required or an empty target repository must be supplied.
- OpenAI API key: not configured. No live research API run was tested or scheduled successfully.
- Daily publication: setup required. Workflow files are delivered; they are not an active integration with the existing ChatGPT scheduled task.

## Activation checklist

1. Create/select a public GitHub repository and push this source (excluding the local Sites `.git` and `.openai` directories when making a fresh copy).
2. Enable GitHub Pages with Actions as the source.
3. Add `OPENAI_API_KEY` directly in GitHub Secrets and choose automatic or review mode.
4. Run one research edition, inspect evidence and verify the resulting deployment. The workflow updates the public status/configuration after a successful researched edition is committed.
5. Use the GitHub Pages URL as the canonical continuously enriched archive. This initial Sites release will not be updated automatically by the GitHub workflow.

Full instructions, operating costs and limitations are in [README.md](README.md).

## Verification completed before release

- 19 automated tests passed, covering article/day counts, independent publisher groups, citation scope, duplicate IDs, future/old source dates, unverified access, retrospective labels, unsafe URLs, paywall extraction, immutable writes and credential failures.
- Desktop browser: archive, search, region filter, comparison, provenance, JSON download link, calendar and missing-date state checked.
- Phone-width browser frame: 375-pixel content viewport, no horizontal overflow on archive or 3-source comparison.
- No browser console errors observed during these checks.
- Daily API and GitHub Actions end-to-end execution remain unverified until credentials and repository access are configured.
